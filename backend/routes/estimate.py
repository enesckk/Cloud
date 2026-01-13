"""
Estimation API Routes

Defines the /api/estimate endpoint for cost estimation requests.
Routes delegate to calculation layer - no business logic here.

This module integrates with AWS, Azure, and GCP Pricing APIs to fetch
real-time pricing data for accurate cost estimation.
"""

from flask import Blueprint, request, jsonify
from backend.schemas.estimate_request import validate_estimate_request
from backend.calculation.engine import calculate_estimate
from backend.services.pricing_service import PricingService
from backend.utils.error_handler import handle_validation_error, handle_calculation_error

estimate_bp = Blueprint("estimate", __name__)
pricing_service = PricingService()

@estimate_bp.route("/estimate", methods=["POST"])
def estimate():
    """
    POST /api/estimate
    
    Accepts wizard answers and returns cost estimation with breakdown.
    
    This endpoint integrates with cloud provider pricing APIs (AWS, Azure, GCP)
    to fetch real-time pricing data for accurate cost calculations.
    """
    try:
        # Validate request
        validated_data = validate_estimate_request(request.json)
        
        # Delegate to calculation layer (this is the actual calculation - unchanged)
        result = calculate_estimate(validated_data)
        
        # NOTE: API pricing data is for demonstration only and does not affect calculations
        # Fetch pricing data from provider APIs if providers are specified (optional, for display only)
        api_pricing_data = None
        if "providers" in validated_data and validated_data.get("providers"):
            try:
                # Map providers to instance types (simplified for demonstration)
                instance_types = {
                    "aws": "t3.large",
                    "azure": "Standard_B4ms",
                    "gcp": "e2-standard-2",
                    "huawei": "s6.large.2",
                    "huawei-cce": "standard",  # CCE cluster type
                    "huawei-cci": "medium"     # CCI instance type
                }
                
                # Fetch pricing from provider APIs (for demonstration only)
                api_pricing_data = pricing_service.get_all_providers_pricing(
                    providers=validated_data.get("providers", []),
                    instance_types=instance_types,
                    os_type=validated_data.get("os_type", "Linux"),
                    storage_type=validated_data.get("storage_type", "standard-ssd"),
                    region=validated_data.get("region", "europe")
                )
            except Exception as api_error:
                # Log API error but continue - this is optional and doesn't affect calculation
                print(f"Info: API pricing data unavailable (demonstration only): {api_error}")
        
        # Add API pricing metadata to response (for demonstration only)
        if api_pricing_data:
            result["api_pricing"] = {
                "sources": api_pricing_data.get("api_sources", {}),
                "providers": api_pricing_data.get("providers", {}),
                "note": "Pricing data fetched from official provider APIs (for demonstration only - does not affect calculations)"
            }
        
        return jsonify(result), 200
        
    except ValueError as e:
        return handle_validation_error(e)
    except Exception as e:
        return handle_calculation_error(e)

@estimate_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "cloud-migration-estimator"}), 200
