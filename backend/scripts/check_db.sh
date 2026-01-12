#!/bin/bash
# Database Tables Check Script (PostgreSQL CLI)

echo "============================================================"
echo "DATABASE TABLES CHECK (PostgreSQL CLI)"
echo "============================================================"
echo ""

# Database connection details
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-cloudguide_db}"
DB_USER="${DB_USER:-cloudguide_user}"
DB_PASSWORD="${DB_PASSWORD:-cloudguide_pass}"

# Export password for psql
export PGPASSWORD=$DB_PASSWORD

echo "Connecting to database: $DB_NAME@$DB_HOST:$DB_PORT"
echo ""

# Check connection
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\conninfo" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "✗ Failed to connect to database!"
    echo ""
    echo "Make sure:"
    echo "  1. PostgreSQL is running"
    echo "  2. Database credentials are correct"
    echo "  3. Database exists"
    exit 1
fi

echo ""
echo "============================================================"
echo "LISTING ALL TABLES"
echo "============================================================"
echo ""

# List all tables
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

echo ""
echo "============================================================"
echo "USERS TABLE STRUCTURE"
echo "============================================================"
echo ""

# Show users table structure
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d users"

echo ""
echo "============================================================"
echo "ANALYSES TABLE STRUCTURE"
echo "============================================================"
echo ""

# Show analyses table structure
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d analyses"

echo ""
echo "============================================================"
echo "RECORD COUNTS"
echo "============================================================"
echo ""

# Count records
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'analyses', COUNT(*) FROM analyses;"

echo ""
echo "============================================================"
echo "✓ Check completed!"
echo "============================================================"
