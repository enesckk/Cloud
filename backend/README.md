# Cloud Migration Cost Estimation Backend

Flask-based, stateless, rule-based cost estimation engine for academic cloud migration analysis.

## Architecture Overview

This backend follows a clean, modular architecture with strict separation of concerns:

- **Routing Layer**: API endpoint definitions
- **Schema & Validation**: Request validation and input normalization
- **Configuration Layer**: Base costs, multipliers, and question metadata
- **Calculation Layer**: Core cost computation logic
- **Breakdown & Explanation**: Cost impact tracking and human-readable explanations
- **Database Layer**: PostgreSQL database with SQLAlchemy ORM
- **Utility Layer**: Helper functions and normalization

## Technology Stack

- **Python 3.11**
- **Flask 3.0** - Web framework
- **PostgreSQL 15** - Relational database
- **SQLAlchemy 2.0** - ORM
- **Docker** - Containerization

## Setup Instructions

### Prerequisites

- Python 3.11+
- PostgreSQL 15+ (or Docker)
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Initialize database:**
   ```bash
   python -m backend.database.migrations.init_db
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

### Docker Setup

1. **Start services:**
   ```bash
   docker-compose up -d
   ```

2. **Check logs:**
   ```bash
   docker-compose logs -f backend
   ```

3. **Stop services:**
   ```bash
   docker-compose down
   ```

## Database Schema

### Users Table
- `id` (String, Primary Key)
- `email` (String, Unique, Indexed)
- `password_hash` (String)
- `name` (String)
- `title` (String, Optional)
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

### Analyses Table
- `id` (String, Primary Key)
- `user_id` (String, Foreign Key -> users.id, Indexed)
- `title` (String)
- `config` (JSON)
- `estimates` (JSON)
- `trends` (JSON, Optional)
- `created_at` (DateTime, Auto)
- `updated_at` (DateTime, Auto)

## Checking Database Tables

### Method 1: Python Script (Recommended)
```bash
python -m backend.database.check_tables
```

### Method 2: PostgreSQL CLI
```bash
# Linux/Mac
./backend/scripts/check_db.sh

# Windows PowerShell
.\backend\scripts\check_db.ps1
```

### Method 3: Direct PostgreSQL Connection
```bash
# Connect to database
psql -h localhost -p 5432 -U cloudguide_user -d cloudguide_db

# List tables
\dt

# Show table structure
\d users
\d analyses

# Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM analyses;
```

### Method 4: Docker Exec
```bash
# If using Docker Compose
docker-compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\dt"
docker-compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\d users"
docker-compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\d analyses"
```

## API Endpoints

### Estimation
- `POST /api/estimate` - Calculate cost estimate
- `GET /api/health` - Health check

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/<user_id>` - Get user profile
- `PUT /api/auth/profile/<user_id>` - Update user profile
- `PUT /api/auth/profile/<user_id>/password` - Update password

### Analyses
- `GET /api/analyses?user_id=<id>` - List user analyses
- `GET /api/analyses/<id>` - Get analysis by ID
- `POST /api/analyses` - Create new analysis
- `PUT /api/analyses/<id>` - Update analysis
- `DELETE /api/analyses/<id>?user_id=<id>` - Delete analysis

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
FLASK_ENV=development
FLASK_DEBUG=True
```

## Folder Structure

```
backend/
├── app.py                      # Flask application entry point
├── questions.py                # Question metadata model
├── routes/                     # API routing layer
│   ├── estimate.py            # Estimation endpoints
│   ├── auth.py                # Authentication endpoints
│   └── analyses.py            # Analysis CRUD endpoints
├── schemas/                    # Request validation layer
├── config/                     # Configuration layer
├── calculation/                # Calculation layer
├── breakdown/                  # Breakdown & explanation layer
├── database/                   # Database layer
│   ├── connection.py          # Database connection
│   ├── models.py              # SQLAlchemy models
│   ├── repositories.py        # Data access layer
│   └── migrations/            # Database migrations
├── utils/                      # Utility layer
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
├── docker-compose.yml         # Docker Compose setup
└── README.md                   # This file
```
