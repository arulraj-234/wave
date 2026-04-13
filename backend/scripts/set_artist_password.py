"""
One-time script to set a known password on the top artist (Arijit Singh)
so we can log into the Artist Portal for testing.

Usage: python scripts/set_artist_password.py
Login with: username=Arijit Singh, password=artist123
"""
import sys, os

# Point at production TiDB
os.environ['DB_HOST'] = os.environ.get('PROD_DB_HOST', 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com')
os.environ['DB_USER'] = os.environ.get('PROD_DB_USER', '29PhucQrPwvzbKy.root')
os.environ['DB_PASSWORD'] = os.environ.get('PROD_DB_PASSWORD', 'TJUoSvkVCyZJ0GFx')
os.environ['DB_NAME'] = os.environ.get('PROD_DB_NAME', 'test')
os.environ['DB_PORT'] = os.environ.get('PROD_DB_PORT', '4000')
os.environ['DB_SSL_MODE'] = ''  # Disable strict verify locally (TiDB will still force TLS)

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from werkzeug.security import generate_password_hash
from db import execute_query, fetch_one

# Set password for the top artist
TARGET_USERNAME = "Arijit Singh"
NEW_PASSWORD = "artist123"

hashed = generate_password_hash(NEW_PASSWORD)

user = fetch_one("SELECT user_id, username, email, role FROM users WHERE username = %s", (TARGET_USERNAME,))
if not user:
    print(f"[ERROR] User '{TARGET_USERNAME}' not found!")
    sys.exit(1)

print(f"Found user: {user['username']} (ID: {user['user_id']}, role: {user['role']})")

# Set proper role if needed
if user['role'] != 'artist':
    execute_query("UPDATE users SET role = 'artist' WHERE user_id = %s", (user['user_id'],))
    print(f"  → Updated role to 'artist'")

# Update password and clear active_session so login works
result = execute_query(
    "UPDATE users SET hashed_password = %s, active_session = NULL, onboarding_completed = TRUE WHERE user_id = %s",
    (hashed, user['user_id'])
)

if result:
    print(f"\n[SUCCESS] Password set successfully!")
    print(f"   Username: {TARGET_USERNAME}")
    print(f"   Password: {NEW_PASSWORD}")
    print(f"   Role: artist")
    print(f"\n   Login at the Wave app and you'll be routed to /artist")
else:
    print("[ERROR] Failed to update password")
    sys.exit(1)
