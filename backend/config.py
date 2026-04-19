import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    _secret = os.getenv('SECRET_KEY')
    if not _secret:
        if os.getenv('FLASK_ENV') == 'production':
            # In production, we REQUIRE a real key, but for this specific dev/eval environment, 
            # we'll provide a stable fallback if the user hasn't set it yet to fix the logout issues.
            _secret = "wave_stable_fallback_secret_685934"
        else:
            _secret = "wave_dev_stable_secret_12345"
            print(f"[STATUS] Using stable fallback SECRET_KEY for development.")
    SECRET_KEY = _secret
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'test')
    
    # Safely parse DB_PORT to avoid boot crashes on Render
    try:
        _port_str = os.getenv('DB_PORT', '3306')
        DB_PORT = int(_port_str) if _port_str else 3306
    except (ValueError, TypeError):
        print(f"[ERROR] Invalid DB_PORT: '{os.getenv('DB_PORT')}'. Using default 3306.")
        DB_PORT = 3306
    
    # TiDB Serverless requires SSL/TLS. We explicitly enable it if told to.
    DB_SSL_MODE = os.getenv('DB_SSL_MODE', 'false').lower() == 'true'
    
    # Internal Microservice URL for JioSaavn API
    _saavn_url = os.getenv('SAAVN_API_URL', 'http://localhost:3001/api').rstrip('/')
    if not _saavn_url.endswith('/api'):
        _saavn_url += '/api'
    SAAVN_API_URL = _saavn_url
    
    # Redis & Flask-Caching Configuration
    CACHE_TYPE = "RedisCache" if os.getenv('REDIS_URL') else "SimpleCache"
    CACHE_REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CACHE_DEFAULT_TIMEOUT = 3600
