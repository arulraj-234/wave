from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import datetime
import os
import uuid
from db import execute_query, fetch_one
from config import Config

auth_bp = Blueprint('auth', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

from middleware import token_required

# We cannot run the limiter inline via request cleanly without complex wrapper logic,
# so we will use a simpler custom local rate limiter check for these 2 routes
# since blueprint decorators clash with preflight OPTIONS and app.py decorators are messy.
import time
from collections import defaultdict
auth_limits = defaultdict(list)

def enforce_auth_rate_limit():
    ip = request.remote_addr
    now = time.time()
    # Keep only requests from the last 60 seconds
    auth_limits[ip] = [t for t in auth_limits[ip] if now - t < 60]
    if len(auth_limits[ip]) >= 5:
        return jsonify({"error": "Too many requests"}), 429
    auth_limits[ip].append(now)
    return None

@auth_bp.route('/register', methods=['POST'])
def register():
    limit_err = enforce_auth_rate_limit()
    if limit_err: return limit_err

    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')
    role = data.get('role', 'listener')
    gender = data.get('gender', 'prefer_not_to_say')
    dob = data.get('dob')
    if not dob:
        dob = None

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields: username, email, password"}), 400

    if not first_name or not first_name.strip():
        return jsonify({"error": "First name is required"}), 400

    hashed_password = generate_password_hash(password)

    # Check for specific duplicate conflicts
    existing_username = fetch_one("SELECT user_id FROM users WHERE username = %s", (username,))
    if existing_username:
        return jsonify({"error": "Username is already taken"}), 409

    existing_email = fetch_one("SELECT user_id FROM users WHERE email = %s", (email,))
    if existing_email:
        return jsonify({"error": "An account with this email already exists"}), 409

    # Artist and Admin accounts bypass onboarding by default
    is_onboarded = True if role in ['artist', 'admin'] else False

    query = """
        INSERT INTO users (username, email, hashed_password, first_name, last_name, role, gender, dob, onboarding_completed)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    user_id = execute_query(query, (username, email, hashed_password, first_name.strip(), last_name.strip(), role, gender, dob, is_onboarded))

    if user_id:
        if role == 'artist':
            profile_query = "INSERT INTO artist_profiles (user_id) VALUES (%s)"
            execute_query(profile_query, (user_id,))
            
        import jwt
        import datetime
        from config import Config
        session_id = str(uuid.uuid4())
        execute_query("UPDATE users SET active_session = %s WHERE user_id = %s", (session_id, user_id))
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'role': role,
            'session_id': session_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, Config.SECRET_KEY, algorithm="HS256")
            
        response = jsonify({
            "message": "User registered successfully", 
            "token": token,
            "user": {
                "id": user_id,
                "username": username,
                "first_name": first_name,
                "email": email,
                "role": role,
                "onboarding_completed": is_onboarded
            }
        })
        # Set HttpOnly cookie as a backup for same-domain deployments,
        # but primarily rely on the token returned in the JSON body for split-domain Vercel/Render.
        is_production = os.environ.get('FLASK_ENV') == 'production'
        response.set_cookie(
            'token', token,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=24*60*60 # 1 day
        )
        return response, 201
    else:
        return jsonify({"error": "Failed to register user"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    limit_err = enforce_auth_rate_limit()
    if limit_err: return limit_err

    data = request.json
    login_id = data.get('login_id') or data.get('email')
    password = data.get('password')
    force_login = data.get('force_login', False)

    if not login_id or not password:
        return jsonify({"error": "Missing email/username or password"}), 400

    user = fetch_one("SELECT * FROM users WHERE email = %s OR username = %s", (login_id, login_id))

    if not user:
        return jsonify({"error": "No account found with that email or username"}), 404

    if not check_password_hash(user['hashed_password'], password):
        return jsonify({"error": "Incorrect password"}), 401

    # We skip session_conflict check and allow force_login silently

    # Extract onboarding state directly from dict (1/0 to true/false)
    is_onboarded = bool(user.get('onboarding_completed', False))
    
    session_id = str(uuid.uuid4())
    execute_query("UPDATE users SET active_session = %s WHERE user_id = %s", (session_id, user['user_id']))
    
    token = jwt.encode({
        'user_id': user['user_id'],
        'email': user['email'],
        'role': user['role'],
        'session_id': session_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
    }, Config.SECRET_KEY, algorithm="HS256")
    
    response = jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user['user_id'],
            "username": user['username'],
            "first_name": user['first_name'],
            "email": user['email'],
            "role": user['role'],
            "onboarding_completed": is_onboarded
        }
    })
    # Set HttpOnly cookie as a backup
    is_production = os.environ.get('FLASK_ENV') == 'production'
    response.set_cookie(
        'token', token,
        httponly=True,
        secure=True,
        samesite='None',
        max_age=24*60*60 # 1 day
    )
    return response, 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Clear active session in DB if we have a valid token
    token = request.cookies.get('token')
    if not token and 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    if token:
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            execute_query("UPDATE users SET active_session = NULL WHERE user_id = %s", (data.get('user_id'),))
        except:
            pass
    response = jsonify({"message": "Logout successful"})
    # Clear the HttpOnly cookie (must match the SameSite/Secure params it was set with)
    response.set_cookie('token', '', httponly=True, secure=True, samesite='None', expires=0)
    return response, 200

@auth_bp.route('/check-username/<username>', methods=['GET'])
def check_username(username):
    """Check if a username is available"""
    existing = fetch_one("SELECT user_id FROM users WHERE username = %s", (username,))
    return jsonify({"available": existing is None}), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def me():
    user_id = request.current_user.get('user_id')
    session_id = request.current_user.get('session_id')
    user = fetch_one("SELECT user_id, username, email, role, avatar_url, first_name, last_name, onboarding_completed, active_session FROM users WHERE user_id = %s", (user_id,))
    if user:
        # Enforce concurrent session: if this token's session_id doesn't match, kick them out
        if session_id and user.get('active_session') and user['active_session'] != session_id:
            return jsonify({"error": "Session expired — you logged in on another device"}), 401
        is_onboarded = bool(user.get('onboarding_completed', False))
        return jsonify({
            "success": True,
            "user": {
                "id": user['user_id'],
                "username": user['username'],
                "email": user['email'],
                "role": user['role'],
                "avatar_url": user['avatar_url'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "onboarding_completed": is_onboarded
            }
        }), 200
    return jsonify({"error": "User not found"}), 404

@auth_bp.route('/onboarding', methods=['POST'])
@token_required
def complete_onboarding():
    data = request.json
    user_id = request.current_user.get('user_id')  # From JWT, not request body
    genres = data.get('genres', [])
    languages = data.get('languages', [])
    artists = data.get('artists', [])

    try:
        # Clear existing preferences just in case it's a retry
        execute_query("DELETE FROM user_preferences WHERE user_id = %s", (user_id,))
        
        # Batch insert
        for g in genres:
            execute_query("INSERT INTO user_preferences (user_id, preference_type, preference_value) VALUES (%s, %s, %s)", (user_id, 'genre', g))
        for l in languages:
            execute_query("INSERT INTO user_preferences (user_id, preference_type, preference_value) VALUES (%s, %s, %s)", (user_id, 'language', l))
        for a in artists:
            execute_query("INSERT INTO user_preferences (user_id, preference_type, preference_value) VALUES (%s, %s, %s)", (user_id, 'artist', a))
            
        # Mark as completed
        execute_query("UPDATE users SET onboarding_completed = TRUE WHERE user_id = %s", (user_id,))
        
        return jsonify({"success": True, "message": "Onboarding completed successfully"}), 200
    except Exception as e:
        print(f"Onboarding error: {e}")
        return jsonify({"error": "Failed to save preferences"}), 500

@auth_bp.route('/profile', methods=['POST'])
@token_required
def update_profile():
    data = request.json
    user_id = request.current_user.get('user_id')  # From JWT, not request body
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    avatar_url = data.get('avatar_url')

    update_fields = []
    params = []

    if username:
        update_fields.append("username = %s")
        params.append(username)
    if first_name is not None:
        update_fields.append("first_name = %s")
        params.append(first_name)
    if last_name is not None:
        update_fields.append("last_name = %s")
        params.append(last_name)
    if avatar_url:
        update_fields.append("avatar_url = %s")
        params.append(avatar_url)

    if not update_fields:
        return jsonify({"error": "No fields to update"}), 400

    query = f"UPDATE users SET {', '.join(update_fields)} WHERE user_id = %s"
    params.append(user_id)

    try:
        execute_query(query, tuple(params))
        # Fetch updated user
        user = fetch_one("SELECT user_id, username, email, role, avatar_url, first_name, last_name FROM users WHERE user_id = %s", (user_id,))
        if user:
            # Normalize avatar_url for frontend if needed (though here we just return as is)
            return jsonify({"success": True, "message": "Profile updated", "user": {
                "id": user['user_id'],
                "username": user['username'],
                "email": user['email'],
                "role": user['role'],
                "avatar_url": user['avatar_url'],
                "first_name": user['first_name'],
                "last_name": user['last_name']
            }}), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        print(f"Profile update error: {e}")
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to filename to avoid collisions and cache issues
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{filename}"
        
        from storage import upload_file_to_supabase
        public_url = upload_file_to_supabase(file, f"avatars/{filename}")
        
        if not public_url:
            upload_folder = os.path.join(current_app.root_path, 'uploads', 'avatars')
            os.makedirs(upload_folder, exist_ok=True)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            public_url = f"/api/uploads/avatars/{filename}"
            
        avatar_url = public_url
        return jsonify({"success": True, "avatar_url": avatar_url}), 200
    
    return jsonify({"error": "File type not allowed"}), 400
