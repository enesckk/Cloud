"""
Request Schema & Validation

Validates incoming estimation requests and normalizes input values.
Ensures all 18 questions are present and properly formatted.
"""

from backend.questions import QUESTIONS_METADATA, get_question_by_id

def validate_estimate_request(request_data: dict) -> dict:
    """
    Validate and normalize estimation request.
    
    Args:
        request_data: Raw JSON request from frontend
        
    Returns:
        Normalized and validated request dictionary
        
    Raises:
        ValueError: If validation fails
    """
    if not request_data:
        raise ValueError("Request body is required")
    
    validated = {}
    
    # Validate each question
    for question in QUESTIONS_METADATA:
        question_id = question["question_id"]
        input_type = question["input_type"]
        required = question["required"]
        value_mapping = question["value_mapping"]
        
        # Check if question is present
        if question_id not in request_data:
            if required:
                raise ValueError(f"Missing required question: {question_id}")
            continue
        
        raw_value = request_data[question_id]
        
        # Validate based on input type
        if input_type == "checkbox":
            # Checkbox returns list
            if not isinstance(raw_value, list):
                raise ValueError(f"Question {question_id} must be a list (checkbox)")
            # Map each value
            validated[question_id] = [
                value_mapping.get(str(val), val) for val in raw_value
            ]
        else:
            # Radio, slider, card return single value
            if isinstance(raw_value, list) and len(raw_value) > 0:
                raw_value = raw_value[0]
            
            mapped_value = value_mapping.get(str(raw_value), raw_value)
            validated[question_id] = mapped_value
    
    return validated
