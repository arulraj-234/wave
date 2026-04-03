from flask import Blueprint, request, jsonify
from db import execute_query, fetch_all
from middleware import token_required

issues_bp = Blueprint('issues', __name__)

@issues_bp.route('/', methods=['POST'])
@token_required
def report_issue(current_user):
    data = request.json
    description = data.get('description')
    error_log = data.get('error_log', '')
    
    if not description:
        return jsonify({"error": "Description is required"}), 400
        
    success = execute_query(
        "INSERT INTO issues (user_id, description, error_log) VALUES (%s, %s, %s)",
        (current_user['user_id'], description, error_log)
    )
    
    if success:
        return jsonify({"success": True, "message": "Issue reported successfully"}), 201
    return jsonify({"error": "Failed to report issue"}), 500

@issues_bp.route('/', methods=['GET'])
@token_required
def get_issues(current_user):
    if current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
        
    issues = fetch_all("""
        SELECT i.*, u.username, u.email 
        FROM issues i 
        LEFT JOIN users u ON i.user_id = u.user_id 
        ORDER BY i.created_at DESC
    """)
    return jsonify({"success": True, "issues": issues})

@issues_bp.route('/<int:issue_id>/resolve', methods=['PUT'])
@token_required
def toggle_resolve(current_user, issue_id):
    if current_user['role'] != 'admin':
        return jsonify({"error": "Unauthorized"}), 403
        
    data = request.json
    status = data.get('status')
    
    if status not in ['open', 'resolved']:
        return jsonify({"error": "Invalid status"}), 400
        
    success = execute_query(
        "UPDATE issues SET status = %s WHERE issue_id = %s",
        (status, issue_id)
    )
    
    if success:
        return jsonify({"success": True, "message": "Issue status updated"})
    return jsonify({"error": "Failed to update issue"}), 500
