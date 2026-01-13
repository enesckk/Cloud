"""
Cloud Provider API Services

This module contains API clients for AWS, Azure, GCP, and Huawei pricing APIs.
These services simulate real API calls for academic demonstration purposes.
Note: These are for demonstration only and do not affect actual calculations.
"""

from backend.services.aws_api_client import AWSPricingClient
from backend.services.azure_api_client import AzurePricingClient
from backend.services.gcp_api_client import GCPPricingClient
from backend.services.huawei_api_client import HuaweiPricingClient

__all__ = [
    "AWSPricingClient",
    "AzurePricingClient",
    "GCPPricingClient",
    "HuaweiPricingClient",
]
