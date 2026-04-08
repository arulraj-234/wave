import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.songs import songs_bp
from routes.playlists import playlists_bp
from routes.admin import admin_bp
from routes.stats import stats_bp
from routes.albums import albums_bp
from routes.jiosaavn import jiosaavn_bp
from routes.issues import issues_bp

app = Flask(__name__)
app.config.from_object(Config)

# Rate Limiter configuration
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["2000 per day", "300 per hour", "30 per minute"],
    storage_uri="memory://"
)

# Configure CORS to explicitly allow credentials and dynamically match the request origin
# if it is in our allowed list, bypassing strict string-matching issues with Flask-Cors
ALLOWED_ORIGINS_ENV = os.environ.get('ALLOWED_ORIGINS')
if ALLOWED_ORIGINS_ENV:
    allowed_origins = [o.strip() for o in ALLOWED_ORIGINS_ENV.split(',')]
else:
    allowed_origins = [
        "https://wavemusic-six.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "capacitor://localhost",
        "http://localhost"
    ]

CORS(app, 
     supports_credentials=True, 
     origins=allowed_origins,
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Capacitor Android WebView sometimes sends a null or missing Origin header.
# We handle these cases to ensure the app doesn't block legitimate native requests.
@app.after_request
def handle_capacitor_cors(response):
    origin = request.headers.get('Origin', '')
    # Check if origin is in our allowed list or is a known mobile origin
    is_allowed = origin in allowed_origins or origin == 'capacitor://localhost' or origin == 'http://localhost'
    
    if is_allowed or not origin or origin == 'null':
        # Force set CORS headers manually as an insurance policy
        target_origin = origin if (origin and origin != 'null') else '*'
        response.headers['Access-Control-Allow-Origin'] = target_origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    
    return response

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

app.register_blueprint(songs_bp, url_prefix='/api/songs')
app.register_blueprint(playlists_bp, url_prefix='/api/playlists')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(stats_bp, url_prefix='/api/stats')
app.register_blueprint(albums_bp, url_prefix='/api/albums')
app.register_blueprint(jiosaavn_bp, url_prefix='/api/jiosaavn')
app.register_blueprint(issues_bp, url_prefix='/api/issues')

# Serve static audio files (legacy path)
@app.route('/uploads/songs/<filename>', methods=['GET'])
def serve_audio(filename):
    upload_dir = os.path.join(app.root_path, 'uploads', 'songs')
    return send_from_directory(upload_dir, filename)

# Serve seeded/uploaded audio files from /api/uploads/
@app.route('/api/uploads/<filename>', methods=['GET'])
def serve_uploaded_audio(filename):
    upload_dir = os.path.join(app.root_path, 'uploads')
    return send_from_directory(upload_dir, filename)

# Serve uploaded cover images
@app.route('/api/uploads/images/<filename>', methods=['GET'])
def serve_uploaded_image(filename):
    upload_dir = os.path.join(app.root_path, 'uploads', 'images')
    return send_from_directory(upload_dir, filename)

# Serve uploaded avatars
@app.route('/api/uploads/avatars/<filename>', methods=['GET'])
def serve_avatar(filename):
    upload_dir = os.path.join(app.root_path, 'uploads', 'avatars')
    return send_from_directory(upload_dir, filename)

# Track server start time for uptime calculation
import time as _time
_server_start_time = _time.time()

@app.route('/', methods=['GET'])
def root():
    """Landing page — shows API status and basic info."""
    from db import get_connection
    import datetime

    uptime_secs = int(_time.time() - _server_start_time)
    hours, remainder = divmod(uptime_secs, 3600)
    minutes, seconds = divmod(remainder, 60)

    db_status = "connected"
    try:
        conn = get_connection()
        conn.close()
    except Exception:
        db_status = "disconnected"

    return jsonify({
        "app": "Wave Music API",
        "version": "1.0.0",
        "status": "🟢 running",
        "uptime": f"{hours}h {minutes}m {seconds}s",
        "database": db_status,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "endpoints": {
            "health": "/api/health",
            "auth": "/api/auth",
            "songs": "/api/songs",
            "playlists": "/api/playlists",
            "stats": "/api/stats",
            "jiosaavn": "/api/jiosaavn",
            "albums": "/api/albums",
            "admin": "/api/admin"
        },
        "docs": "Wave is a full-stack music streaming platform. This is the backend REST API."
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    from db import get_connection
    import datetime

    uptime_secs = int(_time.time() - _server_start_time)
    hours, remainder = divmod(uptime_secs, 3600)
    minutes, seconds = divmod(remainder, 60)

    db_status = "connected"
    try:
        conn = get_connection()
        conn.close()
    except Exception:
        db_status = "disconnected"

    return jsonify({
        "status": "healthy",
        "database": db_status,
        "uptime": f"{hours}h {minutes}m {seconds}s",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }), 200

print("\n================================")
print("   WAVE BACKEND STARTING UP")
print(f"   Environment: {os.getenv('FLASK_ENV', 'development')}")
print("================================\n")

if __name__ == '__main__':
    # When running locally, we bind to 0.0.0.0 so other devices on the network (Android) can connect
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=(os.getenv('FLASK_ENV') != 'production'))
