import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from routes.auth import auth_bp
from routes.songs import songs_bp
from routes.playlists import playlists_bp
from routes.admin import admin_bp
from routes.stats import stats_bp
from routes.albums import albums_bp
from routes.jiosaavn import jiosaavn_bp

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
import re
import os

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

# Build a list of exact strings and compiled regular expressions which is the
# strictly typed format that Flask-Cors actually expects internally.
cors_origins = [
    *allowed_origins,
    re.compile(r"^https?://(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$")
]

CORS(app, supports_credentials=True, origins=cors_origins)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')

app.register_blueprint(songs_bp, url_prefix='/api/songs')
app.register_blueprint(playlists_bp, url_prefix='/api/playlists')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(stats_bp, url_prefix='/api/stats')
app.register_blueprint(albums_bp, url_prefix='/api/albums')
app.register_blueprint(jiosaavn_bp, url_prefix='/api/jiosaavn')

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

@app.route('/api/health', methods=['GET'])
def health_check():
    from db import get_connection
    try:
        conn = get_connection()
        conn.close()
        return jsonify({"status": "healthy", "database": "connected"}), 200
    except Exception:
        return jsonify({"status": "healthy", "database": "disconnected"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
