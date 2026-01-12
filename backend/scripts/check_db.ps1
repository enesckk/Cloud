# Database Tables Check Script (PowerShell for Windows)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "DATABASE TABLES CHECK (PostgreSQL CLI)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Database connection details
$DB_HOST = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$DB_PORT = if ($env:DB_PORT) { $env:DB_PORT } else { "5432" }
$DB_NAME = if ($env:DB_NAME) { $env:DB_NAME } else { "cloudguide_db" }
$DB_USER = if ($env:DB_USER) { $env:DB_USER } else { "cloudguide_user" }
$DB_PASSWORD = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "cloudguide_pass" }

Write-Host "Connecting to database: $DB_NAME@$DB_HOST:$DB_PORT" -ForegroundColor Yellow
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "✗ psql command not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL client tools or use Python script instead:" -ForegroundColor Yellow
    Write-Host "  python -m backend.database.check_tables" -ForegroundColor Green
    exit 1
}

# Set password environment variable
$env:PGPASSWORD = $DB_PASSWORD

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "LISTING ALL TABLES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# List all tables
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "USERS TABLE STRUCTURE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Show users table structure
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d users"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "ANALYSES TABLE STRUCTURE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Show analyses table structure
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d analyses"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "RECORD COUNTS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Count records
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION ALL SELECT 'analyses', COUNT(*) FROM analyses;"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✓ Check completed!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
