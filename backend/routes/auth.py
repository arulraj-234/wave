from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import datetime
import os
from db import execute_query, fetch_one
from config import Config

auth_bp = Blueprint('auth', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_bp.route('/register', methods=['POST'])
def register():
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

    hashed_password = generate_password_hash(password)

    # Check if user exists
    existing_user = fetch_one("SELECT user_id FROM users WHERE email = %s OR username = %s", (email, username))
    if existing_user:
        return jsonify({"error": "User with this email or username already exists"}), 409

    # Artist and Admin accounts bypass onboarding by default
    is_onboarded = True if role in ['artist', 'admin'] else False

    query = """
        INSERT INTO users (username, email, hashed_password, first_name, last_name, role, gender, dob, onboarding_completed)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    user_id = execute_query(query, (username, email, hashed_password, first_name, last_name, role, gender, dob, is_onboarded))

    if user_id:
        if role == 'artist':
            profile_query = "INSERT INTO artist_profiles (user_id) VALUES (%s)"
            execute_query(profile_query, (user_id,))
            
        import jwt
        import datetime
        from config import Config
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'role': role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm="HS256")
            
        response = jsonify({
            "message": "User registered successfully", 
            "user": {
                "id": user_id,
                "username": username,
                "first_name": first_name,
                "email": email,
                "role": role,
                "onboarding_completed": is_onboarded
            }
        })
        # Set HttpOnly cookie instead of sending token in body
        is_production = os.environ.get('FLASK_ENV') == 'production'
        response.set_cookie(
            'token', token,
            httponly=True,
            secure=is_production, # Only require HTTPS in production
            samesite='Lax' if not is_production else 'Strict',
            max_age=24*60*60 # 1 day
        )
        return response, 201
    else:
        return jsonify({"error": "Failed to register user"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    login_id = data.get('login_id') or data.get('email')
    password = data.get('password')

    if not login_id or not password:
        return jsonify({"error": "Missing email/username or password"}), 400

    user = fetch_one("SELECT * FROM users WHERE email = %s OR username = %s", (login_id, login_id))

    if user and check_password_hash(user['hashed_password'], password):
        # Extract onboarding state directly from dict (1/0 to true/false)
        is_onboarded = bool(user.get('onboarding_completed', False))
        
        token = jwt.encode({
            'user_id': user['user_id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm="HS256")
        
        response = jsonify({
            "message": "Login successful",
            "user": {
                "id": user['user_id'],
                "username": user['username'],
                "first_name": user['first_name'],
                "email": user['email'],
                "role": user['role'],
                "onboarding_completed": is_onboarded
            }
        })
        # Set HttpOnly cookie
        is_production = os.environ.get('FLASK_ENV') == 'production'
        response.set_cookie(
            'token', token,
            httponly=True,
            secure=is_production, # Only require HTTPS in production
            samesite='Lax' if not is_production else 'Strict',
            max_age=24*60*60 # 1 day
        )
        return response, 200

    return jsonify({"error": "Invalid email or password"}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"message": "Logout successful"})
    # Clear the HttpOnly cookie
    response.set_cookie('token', '', httponly=True, expires=0)
    return response, 200

@auth_bp.route('/onboarding', methods=['POST'])
def complete_onboarding():
    data = request.json
    user_id = data.get('user_id')
    genres = data.get('genres', [])
    languages = data.get('languages', [])
    artists = data.get('artists', [])

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

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
def update_profile():
    data = request.json
    user_id = data.get('user_id')
    username = data.get('username')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    avatar_url = data.get('avatar_url')

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

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
        
        upload_folder = os.path.join('uploads', 'avatars')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        
        # Return the public URL
        avatar_url = f"/api/uploads/avatars/{filename}"
        return jsonify({"success": True, "avatar_url": avatar_url}), 200
    
    return jsonify({"error": "File type not allowed"}), 400
