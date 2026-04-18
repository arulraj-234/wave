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

# ==================== [ ROADMAP FEATURES ] ====================

@admin_bp.route('/roadmap', methods=['GET'])
def get_roadmap():
    features = fetch_all("SELECT * FROM roadmap_features ORDER BY created_at DESC")
    return jsonify({"features": features}), 200

@admin_bp.route('/roadmap', methods=['POST'])
@admin_required
def create_roadmap_feature():
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    status = data.get('status', 'planned')
    
    if not title:
        return jsonify({"error": "Title is required"}), 400
        
    feature_id = execute_query(
        "INSERT INTO roadmap_features (title, description, status) VALUES (%s, %s, %s)",
        (title, description, status)
    )
    return jsonify({"message": "Feature added", "feature_id": feature_id}), 201

@admin_bp.route('/roadmap/<int:feature_id>', methods=['PUT', 'PATCH'])
@admin_required
def update_roadmap_feature(feature_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    status = data.get('status')
    
    feature = fetch_all("SELECT * FROM roadmap_features WHERE feature_id = %s", (feature_id,))
    if not feature:
         return jsonify({"error": "Feature not found"}), 404
         
    new_title = title if title is not None else feature[0]['title']
    new_desc = description if description is not None else feature[0]['description']
    new_status = status if status is not None else feature[0]['status']
    
    execute_query(
        "UPDATE roadmap_features SET title = %s, description = %s, status = %s WHERE feature_id = %s",
        (new_title, new_desc, new_status, feature_id)
    )
    return jsonify({"message": "Feature updated successfully"}), 200

@admin_bp.route('/roadmap/<int:feature_id>', methods=['DELETE'])
@admin_required
def delete_roadmap_feature(feature_id):
    execute_query("DELETE FROM roadmap_features WHERE feature_id = %s", (feature_id,))
    return jsonify({"message": "Feature deleted successfully"}), 200
