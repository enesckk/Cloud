# Backend Architecture Documentation

## Overview

This backend implements a stateless, rule-based cost estimation engine for cloud migration analysis. The architecture follows strict separation of concerns and is designed for academic clarity and maintainability.

## Folder Structure

```
backend/
├── app.py                      # Flask application entry point
├── questions.py                # Question metadata model (18 questions)
├── routes/                     # API routing layer
│   ├── __init__.py
│   └── estimate.py            # /api/estimate endpoint
├── schemas/                    # Request validation layer
│   ├── __init__.py
│   └── estimate_request.py   # Input validation and normalization
├── config/                     # Configuration layer
│   ├── __init__.py
│   ├── base_costs.py          # Base cost definitions by company size
│   ├── multipliers.py          # Cost multiplier definitions
│   └── cost_ranges.py         # Min/max cost range configuration
├── calculation/                # Calculation layer
│   ├── __init__.py
│   └── engine.py              # Core cost computation logic
├── breakdown/                  # Breakdown & explanation layer
│   ├── __init__.py
│   └── generator.py           # Cost impact breakdown generation
├── utils/                      # Utility layer
│   ├── __init__.py
│   └── error_handler.py       # Standardized error responses
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
└── README.md                   # Project documentation
```

## Layer Responsibilities

### 1. Application Entry Point (`app.py`)
- Initializes Flask application
- Configures CORS for frontend integration
- Registers blueprints
- No business logic

### 2. Routing Layer (`routes/`)
- Defines API endpoints (`/api/estimate`, `/api/health`)
- Delegates to validation and calculation layers
- Returns JSON responses
- No business logic

### 3. Schema & Validation Layer (`schemas/`)
- Validates incoming request structure
- Ensures all 18 questions are present
- Normalizes input values using question metadata
- Maps frontend values to backend keys
- Raises `ValueError` for invalid inputs

### 4. Configuration Layer (`config/`)
- **Base Costs**: Defines starting costs by company size
- **Multipliers**: Defines cost multipliers for each question answer
- **Cost Ranges**: Defines percentage deviations for min/max calculation
- All values are constants - no calculation logic

### 5. Calculation Layer (`calculation/`)
- Retrieves base cost based on company size
- Applies multipliers from configuration
- Computes final cost: `FinalCost = BaseCost × (Product of Multipliers)`
- Calculates min/max cost range
- Delegates breakdown generation

### 6. Breakdown & Explanation Layer (`breakdown/`)
- Tracks cost impact per question
- Generates human-readable explanations
- Formats answers for display
- Determines impact direction (increase/decrease/neutral)

### 7. Utility Layer (`utils/`)
- Error handling and response formatting
- Helper functions for normalization
- Reusable utilities

## Data Flow

```
Frontend Request
    ↓
routes/estimate.py (validate request exists)
    ↓
schemas/estimate_request.py (validate & normalize)
    ↓
calculation/engine.py (compute cost)
    ├── config/base_costs.py (get base cost)
    ├── config/multipliers.py (get multipliers)
    ├── config/cost_ranges.py (calculate range)
    └── breakdown/generator.py (generate breakdown)
    ↓
JSON Response to Frontend
```

## Key Design Principles

1. **Separation of Concerns**: Each layer has a single, clear responsibility
2. **Configuration-Driven**: Business rules are in config files, not code
3. **Stateless**: No session or state management - each request is independent
4. **Explainable**: Every cost impact is tracked and explained
5. **Academic-Friendly**: Structure is easy to explain in thesis documentation

## Cost Calculation Formula

```
BaseCost = get_base_cost(company_size)
FinalCost = BaseCost × ∏(multipliers)
MinCost = FinalCost × (1 - 0.20)  # 20% below
MaxCost = FinalCost × (1 + 0.30)   # 30% above
```

## Extension Points

- **New Questions**: Add to `questions.py` and corresponding multiplier in `config/multipliers.py`
- **New Multipliers**: Add to `config/multipliers.py` without changing calculation logic
- **New Endpoints**: Add to `routes/` without affecting existing logic
- **New Breakdown Formats**: Extend `breakdown/generator.py` without changing calculation
