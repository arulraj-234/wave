"""
Script to delete users with invalid usernames (spaces, special chars).
Enforces the ^[A-Za-z0-9_]{3,30}$ standard for all users.
"""
import sys, os, re

os.environ['DB_HOST'] = os.environ.get('PROD_DB_HOST', 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com')
os.environ['DB_USER'] = os.environ.get('PROD_DB_USER', '29PhucQrPwvzbKy.root')
os.environ['DB_PASSWORD'] = os.environ.get('PROD_DB_PASSWORD', 'TJUoSvkVCyZJ0GFx')
os.environ['DB_NAME'] = os.environ.get('PROD_DB_NAME', 'test')
os.environ['DB_PORT'] = os.environ.get('PROD_DB_PORT', '4000')
os.environ['DB_SSL_MODE'] = ''

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db import fetch_all, execute_query

users = fetch_all("SELECT user_id, username, role FROM users")
invalid_ids = []

for u in users:
    if not re.match(r'^[A-Za-z0-9_]{3,30}$', u['username']):
        invalid_ids.append(u['user_id'])

if not invalid_ids:
    print("All usernames are valid!")
    sys.exit(0)

print(f"Deleting {len(invalid_ids)} violating users...")

placeholders = ', '.join(['%s'] * len(invalid_ids))
result = execute_query(f"DELETE FROM users WHERE user_id IN ({placeholders})", tuple(invalid_ids))

if result:
    print("[SUCCESS] Users deleted successfully.")
    print("ON DELETE CASCADE handles all cleanup (profiles, songs, etc).")
else:
    print("[ERROR] Delete failed!")
    sys.exit(1)
