"""
Cloud Provider Pricing Service

Orchestrates API calls to AWS, Azure, and GCP pricing APIs.
This service acts as a unified interface for fetching pricing data from multiple providers.
"""

from typing import Dict, List, Optional, Any
from backend.services.aws_api_client import AWSPricingClient
from backend.services.azure_api_client import AzurePricingClient
from backend.services.gcp_api_client import GCPPricingClient
from backend.services.huawei_api_client import HuaweiPricingClient


class PricingService:
    """
    Unified pricing service that aggregates data from multiple cloud provider APIs.
    
    NOTE: This service is for demonstration purposes only.
    It does not affect actual cost calculations - those use database/provider configurations.
    """
    
    def __init__(self):
        self.aws_client = AWSPricingClient()
        self.azure_client = AzurePricingClient()
        self.gcp_client = GCPPricingClient()
        self.huawei_client = HuaweiPricingClient()
    
    def get_provider_pricing(
        self,
        provider: str,
        instance_type: str,
        os_type: str,
        storage_type: str,
        region: str
    ) -> Dict[str, Any]:
        """
        Get pricing for a specific provider.
        
        Args:
            provider: Provider name ('aws', 'azure', 'gcp')
            instance_type: Instance/machine type
            os_type: Operating system type
            storage_type: Storage type
            region: Region code
            
        Returns:
            Dictionary containing pricing information from provider API
        """
        if provider.lower() == "aws":
            compute_pricing = self.aws_client.get_compute_pricing(instance_type, os_type, region)
            storage_pricing = self.aws_client.get_storage_pricing(storage_type, region)
            region_multiplier = self.aws_client.get_region_multiplier(region)
            
        elif provider.lower() == "azure":
            compute_pricing = self.azure_client.get_compute_pricing(instance_type, os_type, region)
            storage_pricing = self.azure_client.get_storage_pricing(storage_type, region)
            region_multiplier = self.azure_client.get_region_multiplier(region)
            
        elif provider.lower() == "gcp":
            compute_pricing = self.gcp_client.get_compute_pricing(instance_type, os_type, region)
            storage_pricing = self.gcp_client.get_storage_pricing(storage_type, region)
            region_multiplier = self.gcp_client.get_region_multiplier(region)
            
        elif provider.lower() == "huawei":
            compute_pricing = self.huawei_client.get_compute_pricing(instance_type, os_type, region)
            storage_pricing = self.huawei_client.get_storage_pricing(storage_type, region)
            region_multiplier = self.huawei_client.get_region_multiplier(region)
            
        elif provider.lower() == "huawei-cce":
            # CCE uses cluster type instead of instance type
            compute_pricing = self.huawei_client.get_cce_pricing(instance_type, os_type, region)
            storage_pricing = self.huawei_client.get_storage_pricing(storage_type, region)
            region_multiplier = self.huawei_client.get_region_multiplier(region)
            
        elif provider.lower() == "huawei-cci":
            compute_pricing = self.huawei_client.get_cci_pricing(instance_type, os_type, region)
            storage_pricing = self.huawei_client.get_storage_pricing(storage_type, region)
            region_multiplier = self.huawei_client.get_region_multiplier(region)
            
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        return {
            "provider": provider,
            "compute": compute_pricing,
            "storage": storage_pricing,
            "region_multiplier": region_multiplier,
            "api_sources": {
                "compute_api": compute_pricing.get("metadata", {}).get("api_endpoint"),
                "storage_api": storage_pricing.get("metadata", {}).get("api_endpoint"),
                "last_updated": compute_pricing.get("metadata", {}).get("last_updated")
            }
        }
    
    def get_all_providers_pricing(
        self,
        providers: List[str],
        instance_types: Dict[str, str],
        os_type: str,
        storage_type: str,
        region: str
    ) -> Dict[str, Any]:
        """
        Get pricing for multiple providers simultaneously.
        
        Args:
            providers: List of provider names
            instance_types: Dictionary mapping provider to instance type
            os_type: Operating system type
            storage_type: Storage type
            region: Region code
            
        Returns:
            Dictionary containing pricing for all providers
        """
        results = {}
        
        for provider in providers:
            try:
                instance_type = instance_types.get(provider, "default")
                results[provider] = self.get_provider_pricing(
                    provider, instance_type, os_type, storage_type, region
                )
            except Exception as e:
                results[provider] = {
                    "error": str(e),
                    "provider": provider
                }
        
        return {
            "providers": results,
            "region": region,
            "os_type": os_type,
            "storage_type": storage_type
        }
