from functools import wraps
from flask import request, jsonify
import jwt
from config import Config

def token_required(f):
    """Decorator to verify JWT token on protected routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Allow preflight requests to succeed instantly
        if request.method == 'OPTIONS':
            return jsonify({}), 200

        # Prioritize the Authorization Bearer token header over cookies,
        # as split-domain architectures (Vercel to Render) primarily use explicit headers.
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        # Fallback to cookies only if no Bearer header is present
        if not token:
            token = request.cookies.get('token')

        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401
        
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            request.current_user = data
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
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
