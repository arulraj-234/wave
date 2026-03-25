import mysql.connector
from mysql.connector import pooling
from config import Config

# Create a dynamic connection args dictionary
db_args = {
    "host": Config.DB_HOST,
    "user": Config.DB_USER,
    "password": Config.DB_PASSWORD,
    "database": Config.DB_NAME,
    "port": Config.DB_PORT
}

# TiDB and cloud providers strictly enforce SSL
if Config.DB_SSL_MODE:
    db_args["ssl_verify_cert"] = True
    db_args["ssl_verify_identity"] = True

# Create a connection pool using Config class values
pool = pooling.MySQLConnectionPool(
    pool_name="wave_pool",
    pool_size=10,
    pool_reset_session=True,
    **db_args
)

def get_connection():
    conn = pool.get_connection()
    # Disable ONLY_FULL_GROUP_BY for TiDB compatibility
    cursor = conn.cursor()
    cursor.execute("SET sql_mode = ''")
    cursor.close()
    return conn

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
