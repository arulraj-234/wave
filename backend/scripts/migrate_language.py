import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from db import get_connection

def migrate():
    conn = get_connection()
    if not conn:
        print("Failed to connect to database.")
        sys.exit(1)

    try:
        cursor = conn.cursor()
        
        # 1. Check if column exists
        cursor.execute("SHOW COLUMNS FROM songs LIKE 'language'")
        has_lang = cursor.fetchone()
        
        if not has_lang:
            print("Adding `language` column to `songs` table...")
            cursor.execute("ALTER TABLE songs ADD COLUMN language VARCHAR(50);")
            conn.commit()
            print("Successfully added `language` column.")
        else:
            print("`language` column already exists.")
            
        # 2. Migrate existing "genres" that are actually languages
        languages_to_migrate = ['English', 'Hindi', 'Global', 'Tamil', 'Telugu', 'Punjabi', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Bhojpuri', 'Kannada', 'Unknown']
        
        moved_count = 0
        for lang in languages_to_migrate:
            cursor.execute("UPDATE songs SET language = %s, genre = NULL WHERE genre = %s", (lang, lang))
            moved_count += cursor.rowcount
            conn.commit()
            
        print(f"Migrated {moved_count} songs' genre to language column.")
            
    except Exception as e:
        print(f"Error during migration: {str(e)}")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    migrate()
