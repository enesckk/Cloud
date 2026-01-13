"""
Pricing API Routes

Provides endpoints to fetch real-time pricing data from cloud provider APIs.
This demonstrates integration with AWS, Azure, GCP, and Huawei pricing APIs.

NOTE: These endpoints are for demonstration purposes only.
They do not affect actual cost calculations - those use database/provider configurations.
"""

from flask import Blueprint, request, jsonify
from backend.services.pricing_service import PricingService
from backend.utils.error_handler import handle_calculation_error

pricing_bp = Blueprint("pricing", __name__)
pricing_service = PricingService()

@pricing_bp.route("/pricing/provider/<provider>", methods=["GET"])
def get_provider_pricing(provider: str):
    """
    GET /api/pricing/provider/<provider>
    
    Fetch real-time pricing data from a specific cloud provider API.
    
    Query Parameters:
        - instance_type: Instance/machine type (e.g., 't3.large', 'Standard_B4ms')
        - os_type: Operating system ('Linux' or 'Windows')
        - storage_type: Storage type ('standard-hdd', 'standard-ssd', etc.)
        - region: Region code (e.g., 'us-east-1', 'eastus', 'us-central1')
    
    Example:
        GET /api/pricing/provider/aws?instance_type=t3.large&os_type=Linux&storage_type=standard-ssd&region=us-east-1
    """
    try:
        instance_type = request.args.get("instance_type", "t3.large")
        os_type = request.args.get("os_type", "Linux")
        storage_type = request.args.get("storage_type", "standard-ssd")
        region = request.args.get("region", "us-east-1")
        
        pricing_data = pricing_service.get_provider_pricing(
            provider=provider,
            instance_type=instance_type,
            os_type=os_type,
            storage_type=storage_type,
            region=region
        )
        
        return jsonify({
            "success": True,
            "data": pricing_data,
            "message": f"Pricing data fetched from {provider.upper()} API"
        }), 200
        
    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
    except Exception as e:
        return handle_calculation_error(e)

@pricing_bp.route("/pricing/compare", methods=["POST"])
def compare_provider_pricing():
    """
    POST /api/pricing/compare
    
    Compare pricing across multiple cloud providers.
    
    Request Body:
        {
            "providers": ["aws", "azure", "gcp"],
            "instance_types": {
                "aws": "t3.large",
                "azure": "Standard_B4ms",
                "gcp": "e2-standard-2"
            },
            "os_type": "Linux",
            "storage_type": "standard-ssd",
            "region": "europe"
        }
    """
    try:
        data = request.json or {}
        
        providers = data.get("providers", ["aws", "azure", "gcp"])
        instance_types = data.get("instance_types", {
            "aws": "t3.large",
            "azure": "Standard_B4ms",
            "gcp": "e2-standard-2"
        })
        os_type = data.get("os_type", "Linux")
        storage_type = data.get("storage_type", "standard-ssd")
        region = data.get("region", "europe")
        
        pricing_data = pricing_service.get_all_providers_pricing(
            providers=providers,
            instance_types=instance_types,
            os_type=os_type,
            storage_type=storage_type,
            region=region
        )
        
        return jsonify({
            "success": True,
            "data": pricing_data,
            "message": "Pricing comparison fetched from provider APIs"
        }), 200
        
    except Exception as e:
        return handle_calculation_error(e)
