import mysql.connector

try:
    db = mysql.connector.connect(host='localhost', user='root', password='020304', database='wave_db')
    cursor = db.cursor()
    
    # Fix songs table
    cursor.execute("UPDATE songs SET cover_image_url = REPLACE(cover_image_url, '1000x1000', '500x500') WHERE cover_image_url LIKE '%1000x1000%';")
    print(f"Songs updated: {cursor.rowcount}", flush=True)
    
    # Fix albums table
    cursor.execute("UPDATE albums SET cover_image_url = REPLACE(cover_image_url, '1000x1000', '500x500') WHERE cover_image_url LIKE '%1000x1000%';")
    print(f"Albums updated: {cursor.rowcount}", flush=True)

    # Fix playlists table
    cursor.execute("UPDATE playlists SET cover_image_url = REPLACE(cover_image_url, '1000x1000', '500x500') WHERE cover_image_url LIKE '%1000x1000%';")
    print(f"Playlists updated: {cursor.rowcount}", flush=True)
    
    # Fix users (avatars)
    cursor.execute("UPDATE users SET avatar_url = REPLACE(avatar_url, '1000x1000', '500x500') WHERE avatar_url LIKE '%1000x1000%';")
    print(f"User avatars updated: {cursor.rowcount}", flush=True)
    
    db.commit()
    print("Database image resolution patching complete.", flush=True)
except Exception as e:
    print("Error:", e, flush=True)
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
