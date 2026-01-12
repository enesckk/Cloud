"""
Error Handling Utilities

Standardized error response formatting for API endpoints.
"""

from flask import jsonify

def handle_validation_error(error: Exception) -> tuple:
    """
    Handle validation errors with standardized response.
    
    Args:
        error: Validation error exception
        
    Returns:
        JSON error response with 400 status
    """
    return jsonify({
        "error": "validation_error",
        "message": str(error),
        "status_code": 400
    }), 400

def handle_calculation_error(error: Exception) -> tuple:
    """
    Handle calculation errors with standardized response.
    
    Args:
        error: Calculation error exception
        
    Returns:
        JSON error response with 500 status
    """
    import traceback
    # Log the full error for debugging
    print(f"ERROR: {type(error).__name__}: {str(error)}")
    traceback.print_exc()
    
    # Return user-friendly error message
    error_message = str(error)
    if "connection" in error_message.lower() or "database" in error_message.lower():
        error_message = "Database connection error. Please check if PostgreSQL is running."
    
    return jsonify({
        "error": "server_error",
        "message": error_message,
        "status_code": 500
    }), 500
