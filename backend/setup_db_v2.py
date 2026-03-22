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
    
    print("Adding gender to users...")
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN gender ENUM('male', 'female', 'non-binary', 'other', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say'")
    except Exception as e:
        print(f"Column might exist: {e}")
        
    print("Adding onboarding_completed to users...")
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE")
    except Exception as e:
        print(f"Column might exist: {e}")
        
    print("Creating user_preferences table...")
    cursor.execute("""
      CREATE TABLE IF NOT EXISTS user_preferences (
          preference_id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          preference_type ENUM('genre', 'language', 'artist') NOT NULL,
          preference_value VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
          UNIQUE KEY unique_user_pref (user_id, preference_type, preference_value)
      );
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Upgrade complete.")

if __name__ == "__main__":
    upgrade_db()
