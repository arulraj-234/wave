import sys, os

# Override env vars to point to production TiDB
os.environ['DB_HOST'] = 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com'
os.environ['DB_USER'] = '29PhucQrPwvzbKy.root'
os.environ['DB_PASSWORD'] = 'TJUoSvkVCyZJ0GFx'
os.environ['DB_NAME'] = 'test'
os.environ['DB_PORT'] = '4000'
os.environ['DB_SSL_MODE'] = 'true'

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import fetch_all

top_artists = fetch_all("""
    SELECT u.user_id, u.username, u.email, u.role, ap.artist_id, ap.verified,
           COUNT(DISTINCT sa.song_id) AS song_count,
           COALESCE(SUM(s.play_count), 0) AS total_plays
    FROM artist_profiles ap
    JOIN users u ON ap.user_id = u.user_id
    LEFT JOIN song_artists sa ON ap.artist_id = sa.artist_id
    LEFT JOIN songs s ON sa.song_id = s.song_id
    GROUP BY ap.artist_id
    ORDER BY total_plays DESC
    LIMIT 10
""")

print("\n=== TOP 10 ARTISTS BY PLAYS ===")
for a in top_artists:
    print(f"uid={a['user_id']} | aid={a['artist_id']} | {a['username']} | {a['email']} | role={a['role']} | songs={a['song_count']} | plays={a['total_plays']} | verified={a['verified']}")

# Check if any artist has a real password (not dummy)
print("\n=== ARTISTS WITH REAL PASSWORDS (loginable) ===")
loginable = fetch_all("""
    SELECT u.user_id, u.username, u.email, u.role, u.hashed_password
    FROM users u
    JOIN artist_profiles ap ON u.user_id = ap.user_id
    WHERE u.hashed_password NOT LIKE '%%dummy%%'
      AND u.email NOT LIKE '%%wave.local%%'
    LIMIT 10
""")
for a in loginable:
    print(f"uid={a['user_id']} | {a['username']} | {a['email']} | role={a['role']} | hash_prefix={a['hashed_password'][:40]}")
