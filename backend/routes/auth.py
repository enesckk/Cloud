"""
Authentication API Routes

Handles user registration, login, and profile management.
"""

from flask import Blueprint, request, jsonify
from backend.database.connection import get_db
from backend.database.repositories import UserRepository
from backend.utils.error_handler import handle_validation_error, handle_calculation_error

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        title = data.get("title")
        
        if not email or not password or not name:
            return jsonify({"error": "Email, password, and name are required"}), 400
        
        db = next(get_db())
        
        # Check if user exists
        existing_user = UserRepository.get_by_email(db, email)
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 400
        
        # Create user
        user = UserRepository.create(db, email, password, name, title)
        
        return jsonify({
            "message": "User created successfully",
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        return handle_calculation_error(e)

@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and return user data."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        db = next(get_db())
        
        # Authenticate
        user = UserRepository.authenticate(db, email, password)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return handle_calculation_error(e)

@auth_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id: str):
    """Get user profile."""
    try:
        db = next(get_db())
        user = UserRepository.get_by_id(db, user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"user": user.to_dict()}), 200
        
    except Exception as e:
        return handle_calculation_error(e)

@auth_bp.route("/profile/<user_id>", methods=["PUT"])
def update_profile(user_id: str):
    """Update user profile."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        db = next(get_db())
        
        updates = {}
        if "email" in data:
            updates["email"] = data["email"]
        if "name" in data:
            updates["name"] = data["name"]
        if "title" in data:
            updates["title"] = data["title"]
        
        user = UserRepository.update(db, user_id, **updates)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return handle_calculation_error(e)

@auth_bp.route("/profile/<user_id>/password", methods=["PUT"])
def update_password(user_id: str):
    """Update user password."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        current_password = data.get("current_password")
        new_password = data.get("new_password")
        
        if not current_password or not new_password:
            return jsonify({"error": "Current password and new password are required"}), 400
        
        db = next(get_db())
        
        # Verify current password
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        from backend.database.repositories import verify_password
        if not verify_password(current_password, user.password_hash):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        # Update password
        updated_user = UserRepository.update(db, user_id, password=new_password)
        
        return jsonify({
            "message": "Password updated successfully"
        }), 200
        
    except Exception as e:
        return handle_calculation_error(e)
