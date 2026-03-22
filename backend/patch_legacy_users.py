import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def upgrade_db():
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "wave")
    )
    cursor = conn.cursor()
    
    print("Marking all legacy users as onboarded...")
    try:
        cursor.execute("UPDATE users SET onboarding_completed = TRUE")
        conn.commit()
        print("Updated successfully.")
    except Exception as e:
        print(f"Error: {e}")
        
    cursor.close()
    conn.close()

if __name__ == "__main__":
    upgrade_db()
