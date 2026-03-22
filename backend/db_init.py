import os
import mysql.connector
import sys
from dotenv import load_dotenv

load_dotenv()

def init_db(force=False):
    db_name = os.getenv('DB_NAME', 'test')
    
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD', '')
    )
    cursor = conn.cursor()

    try:
        if not force:
            # Quick check if database and a core table exist
            cursor.execute(f"SHOW DATABASES LIKE '{db_name}'")
            if cursor.fetchone():
                cursor.execute(f"USE {db_name}")
                cursor.execute("SHOW TABLES LIKE 'users'")
                if cursor.fetchone():
                    print(f"Database '{db_name}' already initialized. Skipping...")
                    return

        with open('schema.sql', 'r') as f:
            schema = f.read()


        # Parse schema handling DELIMITER changes for stored procedures/triggers
        statements = []
        current_statement = []
        current_delimiter = ';'

        for line in schema.splitlines():
            stripped = line.strip()
            if not stripped or stripped.startswith('--'):
                continue

            if stripped.upper().startswith('DELIMITER'):
                parts = stripped.split()
                if len(parts) > 1:
                    current_delimiter = parts[1]
                continue

            current_statement.append(line)
            if stripped.endswith(current_delimiter):
                full_stmt = "\n".join(current_statement).strip()
                if full_stmt.endswith(current_delimiter):
                    full_stmt = full_stmt[:-len(current_delimiter)].strip()
                if full_stmt:
                    statements.append(full_stmt)
                current_statement = []

        print(f"Running {len(statements)} SQL statements...")
        for i, stmt in enumerate(statements, 1):
            try:
                cursor.execute(stmt)
                # Consume any results to avoid "Unread result found" errors
                while cursor.nextset():
                    pass
            except mysql.connector.Error as err:
                # Ignore "Duplicate key" (1061) for indexes that already exist
                if err.errno == 1061:
                    pass
                else:
                    print(f"  Warning on statement {i}: {err}")

        conn.commit()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    force_init = '--force' in sys.argv
    init_db(force=force_init)
