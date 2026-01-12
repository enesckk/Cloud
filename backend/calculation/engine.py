"""
Calculation Engine

Core cost estimation logic.
Applies base cost and multipliers to compute final estimate.
Delegates breakdown generation to breakdown layer.
"""

from backend.config.base_costs import get_base_cost
from backend.config.multipliers import get_multiplier
from backend.config.cost_ranges import calculate_cost_range
from backend.breakdown.generator import generate_breakdown
from backend.questions import QUESTIONS_METADATA, get_base_cost_question

def calculate_estimate(validated_data: dict) -> dict:
    """
    Calculate cost estimate from validated request data.
    
    Args:
        validated_data: Validated and normalized request data
        
    Returns:
        Complete estimation result with cost, range, and breakdown
    """
    # Get base cost from company size
    base_cost_question = get_base_cost_question()
    company_size = validated_data[base_cost_question["question_id"]]
    base_cost = get_base_cost(company_size)
    
    # Apply multipliers
    final_cost = base_cost
    applied_multipliers = {}
    
    for question in QUESTIONS_METADATA:
        question_id = question["question_id"]
        
        # Skip base cost question (already applied)
        if question["affects_base_cost"]:
            continue
        
        # Get answer value
        answer_value = validated_data.get(question_id)
        if answer_value is None:
            continue
        
        # Get multiplier
        multiplier_key = question["multiplier_key"]
        if multiplier_key:
            multiplier = get_multiplier(multiplier_key, answer_value)
            final_cost *= multiplier
            applied_multipliers[question_id] = {
                "multiplier": multiplier,
                "answer": answer_value
            }
    
    # Calculate cost range
    cost_range = calculate_cost_range(final_cost)
    
    # Generate breakdown
    breakdown = generate_breakdown(
        validated_data,
        base_cost,
        applied_multipliers,
        final_cost
    )
    
    return {
        "cost_estimate": {
            "base_cost": round(base_cost, 2),
            "final_cost": cost_range["final_cost"],
            "min_cost": cost_range["min_cost"],
            "max_cost": cost_range["max_cost"],
            "currency": "USD"
        },
        "breakdown": breakdown,
        "metadata": {
            "total_questions": len(QUESTIONS_METADATA),
            "questions_answered": len(validated_data)
        }
    }
