from flask import Blueprint, jsonify
from db import execute_query, fetch_all
from middleware import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    query = "SELECT user_id, username, email, first_name, last_name, role, created_at FROM users"
    users = fetch_all(query)
    return jsonify({"users": users}), 200

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    query = "DELETE FROM users WHERE user_id = %s"
    if execute_query(query, (user_id,)):
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"error": "Failed to delete user"}), 500

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    # Real counts from database
    user_count = fetch_all("SELECT COUNT(*) as count FROM users")[0]['count']
    song_count = fetch_all("SELECT COUNT(*) as count FROM songs")[0]['count']
    stream_count = fetch_all("SELECT COUNT(*) as count FROM streams")[0]['count']
    
    return jsonify({
        "users": user_count,
        "songs": song_count,
        "streams": stream_count,
        "status": "Healthy"
    }), 200

@admin_bp.route('/songs', methods=['GET'])
def get_all_songs():
    songs = fetch_all("SELECT * FROM songs")
    return jsonify({"songs": songs}), 200
