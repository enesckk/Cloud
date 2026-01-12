"""
Admin Authentication Middleware

Checks if user is admin before allowing access to admin routes.
"""

from functools import wraps
from flask import request, jsonify
from backend.database.connection import get_db
from backend.database.repositories import UserRepository


def require_admin(f):
    """Decorator to require admin access."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get user_id from request (should be passed as query param or in body)
        user_id = request.args.get("user_id") or (request.json and request.json.get("user_id"))
        
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
        
        db = next(get_db())
        user = UserRepository.get_by_id(db, user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        if not user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
