import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'wave_db')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    
    # TiDB Serverless requires SSL/TLS. We explicitly enable it if told to.
    DB_SSL_MODE = os.getenv('DB_SSL_MODE', 'false').lower() == 'true'
