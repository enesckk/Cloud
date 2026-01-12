"""
Public Provider API Routes

Defines public endpoints for accessing provider information.
Available to all authenticated users (not just admins).
"""

from flask import Blueprint, request, jsonify
from backend.database.connection import get_db
from backend.database.repositories import ProviderRepository
from backend.utils.error_handler import handle_calculation_error

providers_bp = Blueprint("providers", __name__)

@providers_bp.route("/providers", methods=["GET"])
def list_providers():
    """Get all active providers (public endpoint for all users)."""
    try:
        active_only = request.args.get("active_only", "true").lower() == "true"
        db = next(get_db())
        providers = ProviderRepository.get_all(db, active_only=active_only)
        
        return jsonify({
            "providers": [provider.to_dict() for provider in providers]
        }), 200
    except Exception as e:
        return handle_calculation_error(e)

@providers_bp.route("/providers/<provider_id>", methods=["GET"])
def get_provider(provider_id: str):
    """Get provider by ID (public endpoint for all users)."""
    try:
        db = next(get_db())
        provider = ProviderRepository.get_by_id(db, provider_id)
        
        if not provider:
            return jsonify({"error": "Provider not found"}), 404
        
        return jsonify({
            "provider": provider.to_dict()
        }), 200
    except Exception as e:
        return handle_calculation_error(e)
