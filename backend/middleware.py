from functools import wraps
from flask import request, jsonify
import jwt
from config import Config
from db import fetch_one

def token_required(f):
    """Decorator to verify JWT token on protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Support fallback checking for header (useful for certain mobile apps),
        # but prioritize secure HttpOnly cookie.
        token = request.cookies.get('token')

        if not token and 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            request.current_user = data
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        # Enforce single-session: check that this token's session_id
        # matches the active_session in the database. If not, another
        # device has logged in and this session is stale.
        session_id = data.get('session_id')
        if session_id:
            user = fetch_one(
                "SELECT active_session FROM users WHERE user_id = %s",
                (data.get('user_id'),)
            )
            if user and user.get('active_session') and user['active_session'] != session_id:
                return jsonify({"error": "Session expired — you logged in on another device"}), 401
        
        return f(*args, **kwargs)
    
    return decorated


def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.current_user.get('role') != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    
    return decorated


def artist_required(f):
    """Decorator to require artist or admin role"""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.current_user.get('role') not in ['artist', 'admin']:
            return jsonify({"error": "Artist access required"}), 403
        return f(*args, **kwargs)
    
    return decorated
