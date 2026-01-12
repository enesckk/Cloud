"""
Estimation API Routes

Defines the /api/estimate endpoint for cost estimation requests.
Routes delegate to calculation layer - no business logic here.
"""

from flask import Blueprint, request, jsonify
from backend.schemas.estimate_request import validate_estimate_request
from backend.calculation.engine import calculate_estimate
from backend.utils.error_handler import handle_validation_error, handle_calculation_error

estimate_bp = Blueprint("estimate", __name__)

@estimate_bp.route("/estimate", methods=["POST"])
def estimate():
    """
    POST /api/estimate
    
    Accepts wizard answers and returns cost estimation with breakdown.
    """
    try:
        # Validate request
        validated_data = validate_estimate_request(request.json)
        
        # Delegate to calculation layer
        result = calculate_estimate(validated_data)
        
        return jsonify(result), 200
        
    except ValueError as e:
        return handle_validation_error(e)
    except Exception as e:
        return handle_calculation_error(e)

@estimate_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "cloud-migration-estimator"}), 200
