from flask import Blueprint, request, jsonify
from db import execute_query, fetch_all, fetch_one
from middleware import token_required

playlists_bp = Blueprint('playlists', __name__)

@playlists_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_playlists(user_id):
    query = "SELECT * FROM playlists WHERE user_id = %s"
    playlists = fetch_all(query, (user_id,))
    return jsonify({"playlists": playlists}), 200

@playlists_bp.route('', methods=['POST'])
@token_required
def create_playlist():
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    user_id = data.get('user_id')
    is_public = data.get('is_public', True)
    
    if not title or not user_id:
        return jsonify({"error": "Missing required fields"}), 400

    query = "INSERT INTO playlists (user_id, title, description, is_public) VALUES (%s, %s, %s, %s)"
    result = execute_query(query, (user_id, title, description, is_public))
    if result:
        return jsonify({"message": "Playlist created successfully", "playlist_id": result}), 201
    return jsonify({"error": "Failed to create playlist"}), 500

@playlists_bp.route('/<int:playlist_id>/songs', methods=['POST'])
def add_song_to_playlist(playlist_id):
    data = request.json
    song_id = data.get('song_id')
    
    if not song_id:
        return jsonify({"error": "Missing song_id"}), 400
        
    query = "INSERT INTO playlist_songs (playlist_id, song_id) VALUES (%s, %s)"
    if execute_query(query, (playlist_id, song_id)):
        return jsonify({"message": "Song added to playlist"}), 201
    return jsonify({"error": "Failed to add song to playlist"}), 500

@playlists_bp.route('/<int:playlist_id>/songs/<int:song_id>', methods=['DELETE'])
def remove_song_from_playlist(playlist_id, song_id):
    query = "DELETE FROM playlist_songs WHERE playlist_id = %s AND song_id = %s"
    if execute_query(query, (playlist_id, song_id)):
        return jsonify({"message": "Song removed from playlist"}), 200
    return jsonify({"error": "Failed to remove song"}), 500

@playlists_bp.route('/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    query = "DELETE FROM playlists WHERE playlist_id = %s"
    if execute_query(query, (playlist_id,)):
        return jsonify({"message": "Playlist deleted successfully"}), 200
    return jsonify({"error": "Failed to delete playlist"}), 500

@playlists_bp.route('/<int:playlist_id>', methods=['PUT'])
def update_playlist(playlist_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    
    if not title:
        return jsonify({"error": "Title is required"}), 400
    
    query = "UPDATE playlists SET title = %s, description = %s WHERE playlist_id = %s"
    if execute_query(query, (title, description or '', playlist_id)):
        return jsonify({"message": "Playlist updated successfully"}), 200
    return jsonify({"error": "Failed to update playlist"}), 500

@playlists_bp.route('/<int:playlist_id>', methods=['GET'])
def get_playlist_details(playlist_id):
    # Fetch playlist metadata
    playlist = fetch_one("SELECT * FROM playlists WHERE playlist_id = %s", (playlist_id,))
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404
        
    # Fetch songs in playlist
    query = """
        SELECT s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre,
               u.username as artist_name
        FROM songs s
        JOIN playlist_songs ps ON s.song_id = ps.song_id
        JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        WHERE ps.playlist_id = %s
        ORDER BY ps.added_at ASC
    """
    songs = fetch_all(query, (playlist_id,))
    playlist['songs'] = songs
    return jsonify({"playlist": playlist}), 200

# ── Liked Saavn Playlists ────────────────────────────────────

@playlists_bp.route('/liked/<int:user_id>', methods=['GET'])
def get_liked_playlists(user_id):
    query = "SELECT * FROM liked_playlists WHERE user_id = %s ORDER BY liked_at DESC"
    playlists = fetch_all(query, (user_id,))
    return jsonify({"playlists": playlists}), 200

@playlists_bp.route('/liked', methods=['POST'])
@token_required
def like_saavn_playlist():
    data = request.json
    user_id = data.get('user_id')
    saavn_id = data.get('saavn_playlist_id')
    title = data.get('title')
    image = data.get('cover_image_url')
    
    if not user_id or not saavn_id:
        return jsonify({"error": "Missing required fields"}), 400
        
    query = """
        INSERT IGNORE INTO liked_playlists (user_id, saavn_playlist_id, title, cover_image_url)
        VALUES (%s, %s, %s, %s)
    """
    if execute_query(query, (user_id, saavn_id, title, image)):
        return jsonify({"message": "Playlist liked"}), 201
    return jsonify({"message": "Already liked or error"}), 200

@playlists_bp.route('/liked/<saavn_id>', methods=['DELETE'])
@token_required
def unlike_saavn_playlist(saavn_id):
    user_id = request.current_user.get('user_id')  # From token_required
    query = "DELETE FROM liked_playlists WHERE user_id = %s AND saavn_playlist_id = %s"
    if execute_query(query, (user_id, saavn_id)):
        return jsonify({"message": "Playlist unliked"}), 200
    return jsonify({"error": "Failed to unlike"}), 500
