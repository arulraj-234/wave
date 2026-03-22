import mysql.connector

try:
    db = mysql.connector.connect(host='localhost', user='root', password='020304', database='wave_db')
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT playlist_id, title, cover_image_url FROM playlists;")
    playlists = cursor.fetchall()
    
    print("Playlists:")
    for p in playlists:
        print(f"ID: {p['playlist_id']} | Title: {p['title']} | Cover: {p['cover_image_url']}")
        
except Exception as e:
    print("Error:", e)
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
