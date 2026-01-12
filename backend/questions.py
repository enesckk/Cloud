"""
Question Metadata Model for Cloud Migration Cost Estimation System

This module defines the complete metadata structure for all 18 questions
used in the cloud migration cost estimation wizard.

Each question metadata includes:
- question_id: Unique identifier
- input_type: UI component type (slider, radio, checkbox, card)
- required: Whether the question is mandatory
- value_mapping: Maps frontend values to backend keys
- multiplier_key: Key to fetch multiplier from configuration
- explanation: Educational explanation of cost impact
- affects_base_cost: Whether this question affects base cost (only Company Size)
"""

QUESTIONS_METADATA = [
    {
        "question_id": "company_size",
        "input_type": "slider",
        "required": True,
        "value_mapping": {
            "0": "startup",
            "1": "small",
            "2": "medium",
            "3": "enterprise"
        },
        "multiplier_key": None,  # This affects base cost, not multiplier
        "explanation": "Larger companies have more infrastructure to migrate, requiring more resources and planning.",
        "affects_base_cost": True
    },
    {
        "question_id": "current_infrastructure_type",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "on-premise": "on_premise",
            "hybrid": "hybrid",
            "cloud-partial": "cloud_partial",
            "virtualized": "virtualized"
        },
        "multiplier_key": "INFRASTRUCTURE_TYPE_MULTIPLIER",
        "explanation": "Different infrastructure types require varying migration complexity and effort.",
        "affects_base_cost": False
    },
    {
        "question_id": "data_size",
        "input_type": "slider",
        "required": True,
        "value_mapping": {
            "0": "under_100gb",
            "1": "100gb_1tb",
            "2": "1tb_10tb",
            "3": "10tb_100tb",
            "4": "over_100tb"
        },
        "multiplier_key": "DATA_SIZE_MULTIPLIER",
        "explanation": "Larger data volumes increase transfer time, storage costs, and migration complexity.",
        "affects_base_cost": False
    },
    {
        "question_id": "database_complexity",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "simple": "simple",
            "moderate": "moderate",
            "complex": "complex",
            "enterprise": "enterprise"
        },
        "multiplier_key": "DATABASE_COMPLEXITY_MULTIPLIER",
        "explanation": "Complex databases require specialized migration strategies and may need downtime planning.",
        "affects_base_cost": False
    },
    {
        "question_id": "monthly_traffic",
        "input_type": "slider",
        "required": True,
        "value_mapping": {
            "0": "low",
            "1": "medium",
            "2": "high",
            "3": "very_high"
        },
        "multiplier_key": "TRAFFIC_VOLUME_MULTIPLIER",
        "explanation": "Higher traffic volumes require more robust infrastructure and scaling capabilities in the cloud.",
        "affects_base_cost": False
    },
    {
        "question_id": "application_architecture",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "monolithic": "monolithic",
            "microservices": "microservices",
            "serverless": "serverless",
            "mixed": "mixed"
        },
        "multiplier_key": "ARCHITECTURE_TYPE_MULTIPLIER",
        "explanation": "Different architectures have varying migration complexity; microservices may require more refactoring.",
        "affects_base_cost": False
    },
    {
        "question_id": "number_of_applications",
        "input_type": "slider",
        "required": True,
        "value_mapping": {
            "0": "1_5",
            "1": "6_20",
            "2": "21_50",
            "3": "51_100",
            "4": "over_100"
        },
        "multiplier_key": "APPLICATION_COUNT_MULTIPLIER",
        "explanation": "More applications increase coordination effort, testing requirements, and potential integration challenges.",
        "affects_base_cost": False
    },
    {
        "question_id": "operating_system_diversity",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "single": "single",
            "few": "few",
            "many": "many",
            "highly_diverse": "highly_diverse"
        },
        "multiplier_key": "OS_DIVERSITY_MULTIPLIER",
        "explanation": "Multiple operating systems require different migration strategies and may limit cloud service options.",
        "affects_base_cost": False
    },
    {
        "question_id": "security_requirements",
        "input_type": "checkbox",
        "required": True,
        "value_mapping": {
            "encryption": "encryption",
            "vpn": "vpn",
            "mfa": "mfa",
            "audit_logging": "audit_logging",
            "compliance_certifications": "compliance_certifications",
            "none": "none"
        },
        "multiplier_key": "SECURITY_REQUIREMENTS_MULTIPLIER",
        "explanation": "Advanced security requirements add configuration complexity and may require specialized cloud services.",
        "affects_base_cost": False
    },
    {
        "question_id": "compliance_requirements",
        "input_type": "checkbox",
        "required": True,
        "value_mapping": {
            "hipaa": "hipaa",
            "gdpr": "gdpr",
            "pci_dss": "pci_dss",
            "sox": "sox",
            "iso27001": "iso27001",
            "none": "none"
        },
        "multiplier_key": "COMPLIANCE_REQUIREMENTS_MULTIPLIER",
        "explanation": "Compliance requirements restrict available cloud services and regions, increasing migration complexity.",
        "affects_base_cost": False
    },
    {
        "question_id": "backup_disaster_recovery",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "basic": "basic",
            "standard": "standard",
            "advanced": "advanced",
            "enterprise": "enterprise"
        },
        "multiplier_key": "BACKUP_DR_MULTIPLIER",
        "explanation": "Comprehensive backup and disaster recovery solutions require additional cloud infrastructure and services.",
        "affects_base_cost": False
    },
    {
        "question_id": "availability_requirement",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "99.0": "99_0",
            "99.5": "99_5",
            "99.9": "99_9",
            "99.99": "99_99",
            "99.999": "99_999"
        },
        "multiplier_key": "AVAILABILITY_MULTIPLIER",
        "explanation": "Higher availability requirements demand redundant infrastructure and specialized configurations.",
        "affects_base_cost": False
    },
    {
        "question_id": "peak_load_variability",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "stable": "stable",
            "moderate": "moderate",
            "high": "high",
            "extreme": "extreme"
        },
        "multiplier_key": "PEAK_LOAD_MULTIPLIER",
        "explanation": "Variable peak loads require auto-scaling capabilities and may increase cloud infrastructure costs.",
        "affects_base_cost": False
    },
    {
        "question_id": "cicd_automation_level",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "none": "none",
            "basic": "basic",
            "moderate": "moderate",
            "advanced": "advanced"
        },
        "multiplier_key": "CICD_AUTOMATION_MULTIPLIER",
        "explanation": "Advanced CI/CD automation reduces manual migration effort but requires initial setup investment.",
        "affects_base_cost": False
    },
    {
        "question_id": "monitoring_logging_needs",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "basic": "basic",
            "standard": "standard",
            "advanced": "advanced",
            "enterprise": "enterprise"
        },
        "multiplier_key": "MONITORING_LOGGING_MULTIPLIER",
        "explanation": "Comprehensive monitoring and logging require additional cloud services and may increase ongoing costs.",
        "affects_base_cost": False
    },
    {
        "question_id": "team_cloud_experience",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "none": "none",
            "some": "some",
            "experienced": "experienced",
            "expert": "expert"
        },
        "multiplier_key": "TEAM_EXPERIENCE_MULTIPLIER",
        "explanation": "Less experienced teams may require training or consulting, adding to migration costs.",
        "affects_base_cost": False
    },
    {
        "question_id": "migration_timeline",
        "input_type": "slider",
        "required": True,
        "value_mapping": {
            "0": "1_3_months",
            "1": "3_6_months",
            "2": "6_12_months",
            "3": "over_12_months",
            "4": "flexible"
        },
        "multiplier_key": "TIMELINE_MULTIPLIER",
        "explanation": "Tighter timelines may require parallel workstreams and additional resources, increasing costs.",
        "affects_base_cost": False
    },
    {
        "question_id": "migration_strategy",
        "input_type": "radio",
        "required": True,
        "value_mapping": {
            "lift_shift": "lift_shift",
            "replatform": "replatform",
            "refactor": "refactor",
            "retire": "retire",
            "hybrid": "hybrid"
        },
        "multiplier_key": "MIGRATION_STRATEGY_MULTIPLIER",
        "explanation": "Different migration strategies have varying costs; refactoring is more expensive but offers better long-term value.",
        "affects_base_cost": False
    }
]


def get_question_by_id(question_id: str) -> dict:
    """
    Retrieve question metadata by question_id.
    
    Args:
        question_id: Unique identifier for the question
        
    Returns:
        Question metadata dictionary or None if not found
    """
    for question in QUESTIONS_METADATA:
        if question["question_id"] == question_id:
            return question
    return None


def get_all_question_ids() -> list:
    """
    Get list of all question IDs in order.
    
    Returns:
        List of question_id strings
    """
    return [q["question_id"] for q in QUESTIONS_METADATA]


def get_base_cost_question() -> dict:
    """
    Get the question that affects base cost (Company Size).
    
    Returns:
        Question metadata for company_size
    """
    return get_question_by_id("company_size")


def get_multiplier_questions() -> list:
    """
    Get all questions that affect cost via multipliers.
    
    Returns:
        List of question metadata dictionaries
    """
    return [q for q in QUESTIONS_METADATA if not q["affects_base_cost"]]
