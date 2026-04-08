"""
Wave Migration Runner
=====================
Automatically applies pending SQL migrations to any MySQL/TiDB database.

Usage:
    # Apply to local DB (uses backend/.env)
    python migrate.py

    # Apply to TiDB production
    python migrate.py --prod

    # See what's pending without applying
    python migrate.py --dry-run

    # Apply to production with dry run
    python migrate.py --prod --dry-run

How it works:
    1. Creates a `_migrations` table to track what's been applied
    2. Scans backend/migrations/ for numbered .sql files (e.g. 001_*.sql, 002_*.sql)
    3. Runs only the ones that haven't been applied yet
    4. Records each successful migration in `_migrations`

Adding a new migration:
    1. Create a file: backend/migrations/NNN_description.sql
    2. Run: python migrate.py          (local)
    3. Run: python migrate.py --prod   (production)
"""

import os
import sys
import re
import argparse
import mysql.connector
from pathlib import Path
from dotenv import load_dotenv

# Load env from backend/.env
BACKEND_DIR = Path(__file__).parent
load_dotenv(BACKEND_DIR / '.env')


def get_connection(production=False):
    """Get a database connection. If --prod, uses PROD_ prefixed env vars."""
    if production:
        config = {
            'host': os.getenv('PROD_DB_HOST', os.getenv('DB_HOST')),
            'user': os.getenv('PROD_DB_USER', os.getenv('DB_USER')),
            'password': os.getenv('PROD_DB_PASSWORD', os.getenv('DB_PASSWORD')),
            'database': os.getenv('PROD_DB_NAME', os.getenv('DB_NAME')),
            'port': int(os.getenv('PROD_DB_PORT', os.getenv('DB_PORT', '4000'))),
        }
        ssl_mode = os.getenv('PROD_DB_SSL_MODE', os.getenv('DB_SSL_MODE', 'true'))
        if ssl_mode.lower() == 'true':
            config['ssl_disabled'] = False
        else:
            config['ssl_disabled'] = True
    else:
        config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', ''),
            'database': os.getenv('DB_NAME', 'wave_db'),
            'port': int(os.getenv('DB_PORT', '3306')),
            'ssl_disabled': True,
        }
    
    return mysql.connector.connect(**config)


def ensure_migrations_table(cursor):
    """Create the tracking table if it doesn't exist."""
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            version VARCHAR(10) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)


def get_applied_versions(cursor):
    """Get set of already-applied migration versions."""
    cursor.execute("SELECT version FROM _migrations ORDER BY version")
    return {row[0] for row in cursor.fetchall()}


def get_migration_files():
    """Scan migrations/ folder for numbered SQL files."""
    migrations_dir = BACKEND_DIR / 'migrations'
    if not migrations_dir.exists():
        print(f"No migrations directory found at {migrations_dir}")
        return []
    
    pattern = re.compile(r'^(\d{3})_(.+)\.sql$')
    files = []
    
    for f in sorted(migrations_dir.iterdir()):
        match = pattern.match(f.name)
        if match:
            version = match.group(1)  # "001", "002", etc.
            files.append({
                'version': version,
                'name': f.name,
                'path': f,
            })
    
    return files


def run_migration(cursor, migration, dry_run=False):
    """Execute a single migration file."""
    sql = migration['path'].read_text(encoding='utf-8')
    
    # Split on semicolons, skip empty statements
    statements = [s.strip() for s in sql.split(';') if s.strip() and not s.strip().startswith('--')]
    
    if dry_run:
        print(f"  [DRY RUN] Would execute {len(statements)} statement(s)")
        for i, stmt in enumerate(statements, 1):
            preview = stmt[:80].replace('\n', ' ')
            print(f"    {i}. {preview}...")
        return True
    
    for stmt in statements:
        try:
            cursor.execute(stmt)
        except Exception as e:
            print(f"  ❌ Failed: {e}")
            print(f"  Statement: {stmt[:200]}")
            return False
    
    # Record successful migration
    cursor.execute(
        "INSERT INTO _migrations (version, name) VALUES (%s, %s)",
        (migration['version'], migration['name'])
    )
    return True


def main():
    parser = argparse.ArgumentParser(description='Wave Database Migration Runner')
    parser.add_argument('--prod', action='store_true', help='Run against production TiDB')
    parser.add_argument('--dry-run', action='store_true', help='Show pending migrations without applying')
    args = parser.parse_args()

    target = "🌐 PRODUCTION (TiDB)" if args.prod else "💻 LOCAL (MySQL)"
    print(f"\n{'='*50}")
    print(f"  Wave Migration Runner — {target}")
    print(f"{'='*50}\n")

    if args.prod and not args.dry_run:
        confirm = input("⚠️  You are about to modify PRODUCTION. Type 'yes' to continue: ")
        if confirm.lower() != 'yes':
            print("Aborted.")
            return

    try:
        conn = get_connection(production=args.prod)
        cursor = conn.cursor()
        print(f"✅ Connected to {conn.server_host}:{conn.server_port}\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        sys.exit(1)

    ensure_migrations_table(cursor)
    conn.commit()

    applied = get_applied_versions(cursor)
    migrations = get_migration_files()

    if not migrations:
        print("No migration files found in backend/migrations/")
        return

    pending = [m for m in migrations if m['version'] not in applied]

    if not pending:
        print("✅ All migrations are up to date!")
        print(f"   ({len(applied)} migration(s) applied)")
        return

    print(f"📋 {len(pending)} pending migration(s):\n")

    success_count = 0
    for m in pending:
        print(f"  {'[DRY]' if args.dry_run else '▶'} {m['name']}")
        if run_migration(cursor, m, dry_run=args.dry_run):
            success_count += 1
            if not args.dry_run:
                print(f"    ✅ Applied")
        else:
            print(f"    ❌ Failed — stopping here")
            conn.rollback()
            break

    if not args.dry_run:
        conn.commit()
        print(f"\n{'='*50}")
        print(f"  ✅ {success_count}/{len(pending)} migration(s) applied")
        print(f"{'='*50}\n")
    else:
        print(f"\n  Dry run complete. Use without --dry-run to apply.\n")

    cursor.close()
    conn.close()


if __name__ == '__main__':
    main()
