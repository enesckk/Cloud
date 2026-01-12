"""
Analyses API Routes

Handles CRUD operations for cost analyses and reports.
"""

from flask import Blueprint, request, jsonify
from backend.database.connection import get_db
from backend.database.repositories import AnalysisRepository
from backend.utils.error_handler import handle_validation_error, handle_calculation_error

analyses_bp = Blueprint("analyses", __name__)

@analyses_bp.route("", methods=["GET"])
def list_analyses():
    """Get all analyses for a user."""
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "user_id parameter is required"}), 400
        
        db = next(get_db())
        analyses = AnalysisRepository.get_by_user(db, user_id)
        
        return jsonify({
            "analyses": [analysis.to_dict() for analysis in analyses]
        }), 200
        
    except Exception as e:
        return handle_calculation_error(e)

@analyses_bp.route("/<analysis_id>", methods=["GET"])
def get_analysis(analysis_id: str):
    """Get a specific analysis by ID."""
    try:
        db = next(get_db())
        analysis = AnalysisRepository.get_by_id(db, analysis_id)
        
        if not analysis:
            return jsonify({"error": "Analysis not found"}), 404
        
        return jsonify({"analysis": analysis.to_dict()}), 200
        
    except Exception as e:
        return handle_calculation_error(e)

@analyses_bp.route("", methods=["POST"])
def create_analysis():
    """Create a new analysis."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        user_id = data.get("user_id")
        title = data.get("title")
        config = data.get("config")
        estimates = data.get("estimates")
        trends = data.get("trends")
        
        if not user_id or not title or not config or not estimates:
            return jsonify({
                "error": "user_id, title, config, and estimates are required"
            }), 400
        
        db = next(get_db())
        analysis = AnalysisRepository.create(
            db, user_id, title, config, estimates, trends
        )
        
        return jsonify({
            "message": "Analysis created successfully",
            "analysis": analysis.to_dict()
        }), 201
        
    except Exception as e:
        return handle_calculation_error(e)

@analyses_bp.route("/<analysis_id>", methods=["PUT"])
def update_analysis(analysis_id: str):
    """Update an analysis."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body required"}), 400
        
        db = next(get_db())
        
        updates = {}
        if "title" in data:
            updates["title"] = data["title"]
        if "config" in data:
            updates["config"] = data["config"]
        if "estimates" in data:
            updates["estimates"] = data["estimates"]
        if "trends" in data:
            updates["trends"] = data["trends"]
        
        analysis = AnalysisRepository.update(db, analysis_id, **updates)
        
        if not analysis:
            return jsonify({"error": "Analysis not found"}), 404
        
        return jsonify({
            "message": "Analysis updated successfully",
            "analysis": analysis.to_dict()
        }), 200
        
    except Exception as e:
        return handle_calculation_error(e)

@analyses_bp.route("/<analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id: str):
    """Delete an analysis."""
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "user_id parameter is required"}), 400
        
        db = next(get_db())
        success = AnalysisRepository.delete(db, analysis_id, user_id)
        
        if not success:
            return jsonify({"error": "Analysis not found or unauthorized"}), 404
        
        return jsonify({"message": "Analysis deleted successfully"}), 200
        
    except Exception as e:
        return handle_calculation_error(e)
