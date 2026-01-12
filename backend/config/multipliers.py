"""
Multiplier Configuration

Defines cost multipliers for each question answer.
Multipliers are applied multiplicatively to base cost.
Values > 1.0 increase cost, values < 1.0 decrease cost.
"""

MULTIPLIERS = {
    # Infrastructure Type
    "INFRASTRUCTURE_TYPE_MULTIPLIER": {
        "on_premise": 1.2,
        "hybrid": 1.1,
        "cloud_partial": 0.95,
        "virtualized": 1.0
    },
    
    # Data Size
    "DATA_SIZE_MULTIPLIER": {
        "under_100gb": 0.9,
        "100gb_1tb": 1.0,
        "1tb_10tb": 1.15,
        "10tb_100tb": 1.3,
        "over_100tb": 1.5
    },
    
    # Database Complexity
    "DATABASE_COMPLEXITY_MULTIPLIER": {
        "simple": 0.95,
        "moderate": 1.0,
        "complex": 1.2,
        "enterprise": 1.4
    },
    
    # Traffic Volume
    "TRAFFIC_VOLUME_MULTIPLIER": {
        "low": 0.9,
        "medium": 1.0,
        "high": 1.2,
        "very_high": 1.4
    },
    
    # Architecture Type
    "ARCHITECTURE_TYPE_MULTIPLIER": {
        "monolithic": 1.0,
        "microservices": 1.15,
        "serverless": 1.1,
        "mixed": 1.2
    },
    
    # Application Count
    "APPLICATION_COUNT_MULTIPLIER": {
        "1_5": 0.95,
        "6_20": 1.0,
        "21_50": 1.15,
        "51_100": 1.3,
        "over_100": 1.5
    },
    
    # OS Diversity
    "OS_DIVERSITY_MULTIPLIER": {
        "single": 0.95,
        "few": 1.0,
        "many": 1.15,
        "highly_diverse": 1.3
    },
    
    # Security Requirements (checkbox - sum of selected)
    "SECURITY_REQUIREMENTS_MULTIPLIER": {
        "encryption": 1.05,
        "vpn": 1.03,
        "mfa": 1.02,
        "audit_logging": 1.04,
        "compliance_certifications": 1.1,
        "none": 1.0
    },
    
    # Compliance Requirements (checkbox - sum of selected)
    "COMPLIANCE_REQUIREMENTS_MULTIPLIER": {
        "hipaa": 1.15,
        "gdpr": 1.12,
        "pci_dss": 1.18,
        "sox": 1.1,
        "iso27001": 1.08,
        "none": 1.0
    },
    
    # Backup & DR
    "BACKUP_DR_MULTIPLIER": {
        "basic": 0.95,
        "standard": 1.0,
        "advanced": 1.15,
        "enterprise": 1.3
    },
    
    # Availability
    "AVAILABILITY_MULTIPLIER": {
        "99_0": 1.0,
        "99_5": 1.05,
        "99_9": 1.15,
        "99_99": 1.3,
        "99_999": 1.5
    },
    
    # Peak Load Variability
    "PEAK_LOAD_MULTIPLIER": {
        "stable": 0.95,
        "moderate": 1.0,
        "high": 1.15,
        "extreme": 1.3
    },
    
    # CI/CD Automation
    "CICD_AUTOMATION_MULTIPLIER": {
        "none": 1.1,
        "basic": 1.05,
        "moderate": 1.0,
        "advanced": 0.95
    },
    
    # Monitoring & Logging
    "MONITORING_LOGGING_MULTIPLIER": {
        "basic": 0.98,
        "standard": 1.0,
        "advanced": 1.1,
        "enterprise": 1.25
    },
    
    # Team Experience
    "TEAM_EXPERIENCE_MULTIPLIER": {
        "none": 1.2,
        "some": 1.1,
        "experienced": 1.0,
        "expert": 0.95
    },
    
    # Timeline
    "TIMELINE_MULTIPLIER": {
        "1_3_months": 1.3,
        "3_6_months": 1.15,
        "6_12_months": 1.0,
        "over_12_months": 0.95,
        "flexible": 0.9
    },
    
    # Migration Strategy
    "MIGRATION_STRATEGY_MULTIPLIER": {
        "lift_shift": 1.0,
        "replatform": 1.15,
        "refactor": 1.4,
        "retire": 0.5,
        "hybrid": 1.2
    }
}

def get_multiplier(multiplier_key: str, answer_value: str) -> float:
    """
    Get multiplier value for a given question answer.
    
    Args:
        multiplier_key: Key from question metadata
        answer_value: Normalized answer value
        
    Returns:
        Multiplier value (default 1.0 if not found)
    """
    if multiplier_key not in MULTIPLIERS:
        return 1.0
    
    multiplier_map = MULTIPLIERS[multiplier_key]
    
    # Handle checkbox (list of values)
    if isinstance(answer_value, list):
        # For checkboxes, sum the multipliers (compound effect)
        total = 1.0
        for val in answer_value:
            if val in multiplier_map:
                total *= multiplier_map[val]
        return total
    
    # Single value
    return multiplier_map.get(answer_value, 1.0)
