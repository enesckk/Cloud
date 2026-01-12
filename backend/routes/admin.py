"""
Admin API Routes

Handles admin operations for users, education, and providers management.
"""

from flask import Blueprint, request, jsonify
from backend.database.connection import get_db
from backend.database.repositories import (
    UserRepository,
    EducationRepository,
    ProviderRepository,
    AnalysisRepository
)
from backend.utils.error_handler import handle_calculation_error
from backend.utils.admin_auth import require_admin

admin_bp = Blueprint("admin", __name__)

# ==================== USER MANAGEMENT ====================

@admin_bp.route("/users", methods=["GET"])
@require_admin
def list_users():
    """Get all users (admin only)."""
    try:
        db = next(get_db())
        users = UserRepository.get_all(db)
        
        return jsonify({
            "users": [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/users/<user_id>", methods=["GET"])
@require_admin
def get_user(user_id: str):
    """Get user by ID (admin only)."""
    try:
        db = next(get_db())
        user = UserRepository.get_by_id(db, user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"user": user.to_dict()}), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/users", methods=["POST"])
@require_admin
def create_user():
    """Create a new user (admin only)."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        title = data.get("title")
        is_admin = data.get("is_admin", False)
        
        if not email or not password or not name:
            return jsonify({"error": "Email, password, and name are required"}), 400
        
        db = next(get_db())
        
        # Check if user exists
        existing_user = UserRepository.get_by_email(db, email)
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 400
        
        # Create user
        user = UserRepository.create(db, email, password, name, title)
        
        # Set admin status if requested
        if is_admin:
            UserRepository.update(db, user.id, is_admin=True)
            user = UserRepository.get_by_id(db, user.id)
        
        return jsonify({
            "message": "User created successfully",
            "user": user.to_dict()
        }), 201
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/users/<user_id>", methods=["PUT"])
@require_admin
def update_user(user_id: str):
    """Update user (admin only)."""
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
        if "password" in data:
            updates["password"] = data["password"]
        if "is_admin" in data:
            updates["is_admin"] = data["is_admin"]
        
        user = UserRepository.update(db, user_id, **updates)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "message": "User updated successfully",
            "user": user.to_dict()
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@require_admin
def delete_user(user_id: str):
    """Delete user (admin only)."""
    try:
        db = next(get_db())
        success = UserRepository.delete(db, user_id)
        
        if not success:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return handle_calculation_error(e)

# ==================== EDUCATION MANAGEMENT ====================

@admin_bp.route("/education", methods=["GET"])
@require_admin
def list_education():
    """Get all education content (admin only)."""
    try:
        active_only = request.args.get("active_only", "false").lower() == "true"
        db = next(get_db())
        education = EducationRepository.get_all(db, active_only=active_only)
        
        return jsonify({
            "education": [edu.to_dict() for edu in education]
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/education/<education_id>", methods=["GET"])
@require_admin
def get_education(education_id: str):
    """Get education by ID (admin only)."""
    try:
        db = next(get_db())
        education = EducationRepository.get_by_id(db, education_id)
        
        if not education:
            return jsonify({"error": "Education content not found"}), 404
        
        return jsonify({"education": education.to_dict()}), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/education", methods=["POST"])
@require_admin
def create_education():
    """Create education content (admin only)."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        title = data.get("title")
        description = data.get("description")
        type = data.get("type")
        category = data.get("category")
        level = data.get("level")
        
        if not all([title, description, type, category, level]):
            return jsonify({
                "error": "title, description, type, category, and level are required"
            }), 400
        
        db = next(get_db())
        # Generate ID if not provided
        education_id = data.get("id")
        if not education_id:
            import secrets
            education_id = f"edu_{secrets.token_hex(12)}"
        
        education = EducationRepository.create(
            db,
            title=title,
            description=description,
            type=type,
            category=category,
            level=level,
            full_content=data.get("full_content"),
            duration=data.get("duration"),
            provider=data.get("provider"),
            tags=data.get("tags"),
            url=data.get("url"),
            education_id=education_id
        )
        
        return jsonify({
            "message": "Education content created successfully",
            "education": education.to_dict()
        }), 201
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/education/<education_id>", methods=["PUT"])
@require_admin
def update_education(education_id: str):
    """Update education content (admin only)."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        db = next(get_db())
        
        updates = {}
        allowed_fields = [
            "title", "description", "full_content", "type", "category",
            "level", "duration", "provider", "tags", "url", "is_active"
        ]
        
        for field in allowed_fields:
            if field in data:
                updates[field] = data[field]
        
        education = EducationRepository.update(db, education_id, **updates)
        
        if not education:
            return jsonify({"error": "Education content not found"}), 404
        
        return jsonify({
            "message": "Education content updated successfully",
            "education": education.to_dict()
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/education/<education_id>", methods=["DELETE"])
@require_admin
def delete_education(education_id: str):
    """Delete education content (admin only)."""
    try:
        db = next(get_db())
        success = EducationRepository.delete(db, education_id)
        
        if not success:
            return jsonify({"error": "Education content not found"}), 404
        
        return jsonify({"message": "Education content deleted successfully"}), 200
    except Exception as e:
        return handle_calculation_error(e)

# ==================== PROVIDER MANAGEMENT ====================

@admin_bp.route("/providers", methods=["GET"])
@require_admin
def list_providers():
    """Get all providers (admin only)."""
    try:
        active_only = request.args.get("active_only", "false").lower() == "true"
        db = next(get_db())
        providers = ProviderRepository.get_all(db, active_only=active_only)
        
        return jsonify({
            "providers": [provider.to_dict() for provider in providers]
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/providers/<provider_id>", methods=["GET"])
@require_admin
def get_provider(provider_id: str):
    """Get provider by ID (admin only)."""
    try:
        db = next(get_db())
        provider = ProviderRepository.get_by_id(db, provider_id)
        
        if not provider:
            return jsonify({"error": "Provider not found"}), 404
        
        return jsonify({"provider": provider.to_dict()}), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/providers", methods=["POST"])
@require_admin
def create_provider():
    """Create provider (admin only)."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        name = data.get("name")
        display_name = data.get("display_name")
        short_name = data.get("short_name")
        
        if not all([name, display_name, short_name]):
            return jsonify({
                "error": "name, display_name, and short_name are required"
            }), 400
        
        db = next(get_db())
        
        # Check if provider exists
        existing_provider = ProviderRepository.get_by_name(db, name)
        if existing_provider:
            return jsonify({"error": "Provider with this name already exists"}), 400
        
        provider = ProviderRepository.create(
            db,
            name=name,
            display_name=display_name,
            short_name=short_name,
            compute_rates=data.get("compute_rates"),
            storage_rates=data.get("storage_rates"),
            region_multipliers=data.get("region_multipliers"),
            available_regions=data.get("available_regions"),
            color=data.get("color"),
            logo=data.get("logo"),
            description=data.get("description"),
            features=data.get("features")
        )
        
        return jsonify({
            "message": "Provider created successfully",
            "provider": provider.to_dict()
        }), 201
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/providers/<provider_id>", methods=["PUT"])
@require_admin
def update_provider(provider_id: str):
    """Update provider (admin only)."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        db = next(get_db())
        
        updates = {}
        allowed_fields = [
            "name", "display_name", "short_name", "compute_rates",
            "storage_rates", "region_multipliers", "available_regions",
            "color", "logo", "description", "is_active", "features"
        ]
        
        for field in allowed_fields:
            if field in data:
                updates[field] = data[field]
        
        provider = ProviderRepository.update(db, provider_id, **updates)
        
        if not provider:
            return jsonify({"error": "Provider not found"}), 404
        
        return jsonify({
            "message": "Provider updated successfully",
            "provider": provider.to_dict()
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@admin_bp.route("/providers/<provider_id>", methods=["DELETE"])
@require_admin
def delete_provider(provider_id: str):
    """Delete provider (admin only)."""
    try:
        db = next(get_db())
        success = ProviderRepository.delete(db, provider_id)
        
        if not success:
            return jsonify({"error": "Provider not found"}), 404
        
        return jsonify({"message": "Provider deleted successfully"}), 200
    except Exception as e:
        return handle_calculation_error(e)

# ==================== ANALYSIS STATISTICS ====================

@admin_bp.route("/analyses/count", methods=["GET"])
@require_admin
def count_analyses():
    """Get total count of all analyses (admin only)."""
    try:
        db = next(get_db())
        count = AnalysisRepository.count_all(db)
        
        return jsonify({
            "count": count
        }), 200
    except Exception as e:
        return handle_calculation_error(e)
