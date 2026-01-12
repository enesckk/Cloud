# Database Schema Documentation

## Overview

PostgreSQL database schema for Cloud Migration Guide project.

## Tables

### 1. `users` Table

Stores user authentication and profile information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR | PRIMARY KEY, INDEXED | Unique user identifier |
| `email` | VARCHAR | UNIQUE, NOT NULL, INDEXED | User email address (unique) |
| `password_hash` | VARCHAR | NOT NULL | Hashed password (SHA256) |
| `name` | VARCHAR | NOT NULL | User full name |
| `title` | VARCHAR | NULL | User job title/position |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | ON UPDATE NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `email` for fast lookups

**Example Data:**
```sql
INSERT INTO users (id, email, password_hash, name, title) 
VALUES (
  'user_abc123',
  'john@example.com',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbd62a11ef721d1542d8', -- 'password' hashed
  'John Doe',
  'IT Manager'
);
```

---

### 2. `analyses` Table

Stores cost analysis reports and estimations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR | PRIMARY KEY | Unique analysis identifier |
| `user_id` | VARCHAR | NOT NULL, INDEXED | Foreign key to `users.id` |
| `title` | VARCHAR | NOT NULL | Analysis title/name |
| `config` | JSON | NOT NULL | Infrastructure configuration (vcpu, ram, storage, os, diskType, useCase, region, providers) |
| `estimates` | JSON | NOT NULL | Cost estimates array (provider, instanceType, monthlyCost, yearlyCost, isMostEconomical) |
| `trends` | JSON | NULL | Cost trends over time (optional) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Analysis creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | ON UPDATE NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Index on `user_id` for fast user queries

**Foreign Keys:**
- `user_id` → `users.id` (CASCADE on delete)

**JSON Structure Examples:**

**config:**
```json
{
  "vcpu": 4,
  "ram": 16,
  "storage": 256,
  "os": "ubuntu-lts",
  "diskType": "premium-ssd",
  "useCase": "web-app",
  "region": "us-east-1",
  "providers": ["aws", "azure", "gcp"]
}
```

**estimates:**
```json
[
  {
    "provider": "aws",
    "instanceType": "t3.xlarge",
    "monthlyCost": 150.50,
    "yearlyCost": 1806.00,
    "isMostEconomical": true
  },
  {
    "provider": "azure",
    "instanceType": "Standard_D4s_v3",
    "monthlyCost": 165.75,
    "yearlyCost": 1989.00,
    "isMostEconomical": false
  }
]
```

**trends:**
```json
[
  {"month": "2024-01", "cost": 150.50, "provider": "aws"},
  {"month": "2024-02", "cost": 152.30, "provider": "aws"},
  {"month": "2024-03", "cost": 151.80, "provider": "aws"}
]
```

---

## SQL Create Statements

### Create Users Table
```sql
CREATE TABLE users (
    id VARCHAR NOT NULL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    title VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
```

### Create Analyses Table
```sql
CREATE TABLE analyses (
    id VARCHAR NOT NULL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    config JSON NOT NULL,
    estimates JSON NOT NULL,
    trends JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_analyses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_analyses_user_id ON analyses(user_id);
```

---

## Relationships

```
users (1) ────< (many) analyses
```

- One user can have many analyses
- When a user is deleted, all their analyses are deleted (CASCADE)

---

## Database Connection

**Default Connection String:**
```
postgresql://cloudguide_user:cloudguide_pass@localhost:5432/cloudguide_db
```

**Environment Variable:**
```bash
DATABASE_URL=postgresql://cloudguide_user:cloudguide_pass@localhost:5432/cloudguide_db
```

---

## Checking Tables

### Using Python Script
```bash
cd backend
python database/check_tables.py
```

### Using PostgreSQL CLI
```bash
# Connect to database
psql -h localhost -p 5432 -U cloudguide_user -d cloudguide_db

# List tables
\dt

# Describe table structure
\d users
\d analyses

# Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM analyses;
```

### Using Docker
```bash
# If using Docker Compose
docker-compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\dt"
docker-compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\d users"
docker-compose exec postgres psql -U cloudguide_user -d cloudguide_db -c "\d analyses"
```

---

## Initialization

Tables are automatically created when:
1. Flask app starts (via `init_db()` in `app.py`)
2. Running migration script: `python -m backend.database.migrations.init_db`
3. Docker Compose starts (via command in `docker-compose.yml`)

---

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` for timezone-aware storage
- JSON columns allow flexible schema for config, estimates, and trends
- Foreign key constraint ensures data integrity
- Indexes optimize query performance for email lookups and user-specific analyses
