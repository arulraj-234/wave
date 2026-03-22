import mysql.connector

try:
    db = mysql.connector.connect(host='localhost', user='root', password='020304', database='wave_db')
    cursor = db.cursor(dictionary=True)
    
    # Find duplicate songs by title (which indicates the same JioSaavn track was imported multiple times due to CDN url rotation)
    cursor.execute("""
        SELECT title, COUNT(*) as c 
        FROM songs 
        GROUP BY title 
        HAVING c > 1
    """)
    duplicates = cursor.fetchall()
    
    total_deleted = 0
    for dup in duplicates:
        title = dup['title']
        cursor.execute("SELECT song_id FROM songs WHERE title = %s ORDER BY song_id DESC", (title,))
        ids = [row['song_id'] for row in cursor.fetchall()]
        
        keep_id = ids[0] # Keep the newest one
        delete_ids = ids[1:]
        
        # Repoint streams
        format_strings = ','.join(['%s'] * len(delete_ids))
        cursor.execute(f"UPDATE streams SET song_id = %s WHERE song_id IN ({format_strings})", [keep_id] + delete_ids)
        
        # Repoint liked songs (ignore duplicates if they liked both)
        cursor.execute(f"UPDATE IGNORE user_liked_songs SET song_id = %s WHERE song_id IN ({format_strings})", [keep_id] + delete_ids)
        cursor.execute(f"DELETE FROM user_liked_songs WHERE song_id IN ({format_strings})", delete_ids)
        
        # Repoint playlist songs
        cursor.execute(f"UPDATE IGNORE playlist_songs SET song_id = %s WHERE song_id IN ({format_strings})", [keep_id] + delete_ids)
        cursor.execute(f"DELETE FROM playlist_songs WHERE song_id IN ({format_strings})", delete_ids)
        
        # Delete song_artists for duplicates
        cursor.execute(f"DELETE FROM song_artists WHERE song_id IN ({format_strings})", delete_ids)
        
        # Delete the actual song duplicates
        cursor.execute(f"DELETE FROM songs WHERE song_id IN ({format_strings})", delete_ids)
        
        total_deleted += len(delete_ids)
        
    db.commit()
    print(f"Deduplication complete. Deleted {total_deleted} duplicate entries.")
    
except Exception as e:
    print("Error:", e)
finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
