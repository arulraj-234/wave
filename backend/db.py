import mysql.connector
from mysql.connector import pooling
from config import Config

# Create a connection pool using Config class values
pool = pooling.MySQLConnectionPool(
    pool_name="wave_pool",
    pool_size=10,
    pool_reset_session=True,
    host=Config.DB_HOST,
    user=Config.DB_USER,
    password=Config.DB_PASSWORD,
    database=Config.DB_NAME
)

def get_connection():
    return pool.get_connection()

def fetch_one(query, params=None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params or ())
        result = cursor.fetchone()
        return result
    except mysql.connector.Error as e:
        print(f"DB Error: {e}")
        return None
    finally:
        cursor.close()
        conn.close()  # returns connection to pool

def fetch_all(query, params=None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params or ())
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as e:
        print(f"DB Error: {e}")
        return []
    finally:
        cursor.close()
        conn.close()

def execute_query(query, params=None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(query, params or ())
        conn.commit()
        return cursor.lastrowid or True
    except mysql.connector.Error as e:
        print(f"DB Error: {e}")
        conn.rollback()
        return False
    finally:
        cursor.close()
        conn.close()
