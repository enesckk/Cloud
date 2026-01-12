"""
Public Education API Routes

Handles public access to education content.
"""

from flask import Blueprint, request, jsonify
from backend.database.connection import get_db
from backend.database.repositories import EducationRepository
from backend.utils.error_handler import handle_calculation_error

education_bp = Blueprint("education", __name__)

@education_bp.route("", methods=["GET"])
def list_education():
    """Get all active education content (public)."""
    try:
        category = request.args.get("category")
        provider = request.args.get("provider")
        level = request.args.get("level")
        type_filter = request.args.get("type")
        
        db = next(get_db())
        education = EducationRepository.get_all(db, active_only=True)
        
        # Apply filters
        if category:
            education = [e for e in education if e.category == category]
        if provider:
            education = [e for e in education if e.provider == provider]
        if level:
            education = [e for e in education if e.level == level]
        if type_filter:
            education = [e for e in education if e.type == type_filter]
        
        return jsonify({
            "education": [edu.to_dict() for edu in education]
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@education_bp.route("/<education_id>", methods=["GET"])
def get_education(education_id: str):
    """Get education by ID (public, only active)."""
    try:
        db = next(get_db())
        education = EducationRepository.get_by_id(db, education_id)
        
        if not education:
            return jsonify({"error": "Education content not found"}), 404
        
        # Only return if active
        if not education.is_active:
            return jsonify({"error": "Education content not found"}), 404
        
        return jsonify({"education": education.to_dict()}), 200
    except Exception as e:
        return handle_calculation_error(e)
