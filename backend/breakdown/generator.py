"""
Breakdown & Explanation Generator

Generates human-readable cost impact breakdown per question.
Tracks which questions increase, decrease, or maintain cost.
"""

from backend.questions import get_question_by_id

def generate_breakdown(
    validated_data: dict,
    base_cost: float,
    applied_multipliers: dict,
    final_cost: float
) -> list:
    """
    Generate cost impact breakdown for each question.
    
    Args:
        validated_data: All question answers
        base_cost: Starting base cost
        applied_multipliers: Dictionary of applied multipliers per question
        final_cost: Final calculated cost
        
    Returns:
        List of breakdown items, one per question
    """
    breakdown = []
    cumulative_cost = base_cost
    
    for question_id, multiplier_data in applied_multipliers.items():
        question = get_question_by_id(question_id)
        if not question:
            continue
        
        multiplier = multiplier_data["multiplier"]
        answer = multiplier_data["answer"]
        
        # Calculate cost impact
        cost_before = cumulative_cost
        cumulative_cost *= multiplier
        cost_impact = cumulative_cost - cost_before
        
        # Determine impact direction
        if multiplier > 1.0:
            impact_direction = "increase"
        elif multiplier < 1.0:
            impact_direction = "decrease"
        else:
            impact_direction = "neutral"
        
        # Format answer for display
        display_answer = format_answer_for_display(question_id, answer)
        
        breakdown.append({
            "question_id": question_id,
            "question_title": format_question_title(question_id),
            "user_answer": display_answer,
            "multiplier": round(multiplier, 3),
            "cost_impact": round(cost_impact, 2),
            "impact_direction": impact_direction,
            "explanation": question["explanation"]
        })
    
    return breakdown

def format_question_title(question_id: str) -> str:
    """
    Format question_id into human-readable title.
    
    Args:
        question_id: Question identifier
        
    Returns:
        Formatted title string
    """
    # Convert snake_case to Title Case
    return question_id.replace("_", " ").title()

def format_answer_for_display(question_id: str, answer) -> str:
    """
    Format answer value for human-readable display.
    
    Args:
        question_id: Question identifier
        answer: Answer value (string or list)
        
    Returns:
        Formatted answer string
    """
    if isinstance(answer, list):
        # For checkboxes, join with commas
        formatted = [a.replace("_", " ").title() for a in answer]
        return ", ".join(formatted)
    
    # Single value
    return str(answer).replace("_", " ").title()
