import mysql.connector
from mysql.connector import pooling
from config import Config

_pool = None

def get_pool():
    global _pool
    if _pool is None:
        try:
            # Create a dynamic connection args dictionary
            db_args = {
                "host": Config.DB_HOST,
                "user": Config.DB_USER,
                "password": Config.DB_PASSWORD,
                "database": Config.DB_NAME,
                "port": Config.DB_PORT,
                "connection_timeout": 5 # Short timeout for boot safety
            }

            # TiDB and cloud providers strictly enforce SSL
            if Config.DB_SSL_MODE:
                db_args["ssl_verify_cert"] = True
                db_args["ssl_verify_identity"] = True

            print(f"[DB] Initializing connection pool for {Config.DB_HOST}...")
            _pool = pooling.MySQLConnectionPool(
                pool_name="wave_pool",
                pool_size=10,
                pool_reset_session=True,
                **db_args
            )
        except Exception as e:
            print(f"[CRITICAL] Database Pool Initialization Failed: {e}")
            raise e
    return _pool

def get_connection():
    pool = get_pool()
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

def execute_batch(query, params_list=None):
    """
    Executes a batch query using `cursor.executemany()` for optimized bulk inserts and updates.
    Returns True if successful, False otherwise.
    """
    if not params_list:
        return True

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.executemany(query, params_list)
        conn.commit()
        return True
    except mysql.connector.Error as e:
        print(f"DB Error (Batch): {e}")
        conn.rollback()
        return False
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
