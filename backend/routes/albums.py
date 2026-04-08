from flask import Blueprint, request, jsonify
import os
import datetime
from werkzeug.utils import secure_filename
from db import execute_query, fetch_all, fetch_one

# Ensure upload directory exists
IMAGE_UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'images')
os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)

albums_bp = Blueprint('albums', __name__)

@albums_bp.route('/artist/<int:user_id>', methods=['GET'])
def get_artist_albums(user_id):
    """Get all albums for a specific artist (by user_id)"""
    # Find the artist_id for this user
    artist_prof = fetch_one("SELECT artist_id FROM artist_profiles WHERE user_id = %s", (user_id,))
    if not artist_prof:
        return jsonify({"albums": []}), 200
        
    artist_id = artist_prof['artist_id']
    query = """
        SELECT a.album_id, a.title, a.cover_image_url, a.release_date, a.created_at,
               COUNT(s.song_id) as track_count
        FROM albums a
        LEFT JOIN songs s ON a.album_id = s.album_id
        WHERE a.artist_id = %s
        GROUP BY a.album_id
        ORDER BY a.created_at DESC
    """
    albums = fetch_all(query, (artist_id,))
    return jsonify({"albums": albums}), 200

@albums_bp.route('', methods=['POST'])
def create_album():
    """Create a new album"""
    title = request.form.get('title')
    user_id = request.form.get('user_id')
    release_date = request.form.get('release_date') or datetime.date.today().isoformat()
    
    if not title or not user_id:
        return jsonify({"error": "Missing title or user_id"}), 400

    # Verify uploader is an artist or admin
    user = fetch_one("SELECT role, username FROM users WHERE user_id = %s", (user_id,))
    if not user or user['role'] not in ['artist', 'admin']:
        return jsonify({"error": "Unauthorized. Only artists and admins can create albums."}), 403

    # Get artist_id
    artist_prof = fetch_one("SELECT artist_id FROM artist_profiles WHERE user_id = %s", (user_id,))
    if not artist_prof:
        # If they don't have an artist profile yet, create one
        artist_id = execute_query("INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)", (user_id, "System Generated Profile", False))
    else:
        artist_id = artist_prof['artist_id']

    # Handle Cover Image Upload
    cover_image_url = None
    if 'cover_image_file' in request.files:
        file = request.files['cover_image_file']
        if file.filename != '':
            filename = secure_filename(file.filename)
            unique_filename = f"album_{user_id}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
            from storage import upload_file_to_supabase
            s_url = upload_file_to_supabase(file, f"images/{unique_filename}")
            if s_url:
                cover_image_url = s_url
            else:
                filepath = os.path.join(IMAGE_UPLOAD_FOLDER, unique_filename)
                file.seek(0)
                file.save(filepath)
                cover_image_url = f"/api/uploads/images/{unique_filename}"
            
    # Insert album
    album_id = execute_query(
        "INSERT INTO albums (artist_id, title, cover_image_url, release_date) VALUES (%s, %s, %s, %s)",
        (artist_id, title, cover_image_url, release_date)
    )
    
    # Return the created album data
    album_data = fetch_one("SELECT * FROM albums WHERE album_id = %s", (album_id,))
    return jsonify({"message": "Album created successfully", "album": album_data}), 201
