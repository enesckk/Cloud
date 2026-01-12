"""
Base Cost Configuration

Defines base cost values for different company sizes.
Base cost is the starting point before multipliers are applied.
"""

BASE_COSTS = {
    "startup": 10000,      # $10,000
    "small": 50000,        # $50,000
    "medium": 200000,      # $200,000
    "enterprise": 500000   # $500,000
}

def get_base_cost(company_size: str) -> float:
    """
    Get base cost for company size.
    
    Args:
        company_size: One of startup, small, medium, enterprise
        
    Returns:
        Base cost value
        
    Raises:
        ValueError: If company_size is invalid
    """
    if company_size not in BASE_COSTS:
        raise ValueError(f"Invalid company size: {company_size}")
    return BASE_COSTS[company_size]
