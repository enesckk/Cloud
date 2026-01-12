"""
Cost Range Configuration

Defines percentage-based deviations for min/max cost calculation.
These percentages create optimistic (min) and conservative (max) estimates.
"""

# Percentage deviation from final cost
MIN_COST_DEVIATION = -0.20  # 20% below final cost (optimistic)
MAX_COST_DEVIATION = 0.30   # 30% above final cost (conservative)

def calculate_cost_range(final_cost: float) -> dict:
    """
    Calculate min and max cost range from final cost.
    
    Args:
        final_cost: Calculated final cost estimate
        
    Returns:
        Dictionary with min_cost and max_cost
    """
    min_cost = final_cost * (1 + MIN_COST_DEVIATION)
    max_cost = final_cost * (1 + MAX_COST_DEVIATION)
    
    return {
        "min_cost": round(min_cost, 2),
        "max_cost": round(max_cost, 2),
        "final_cost": round(final_cost, 2)
    }
