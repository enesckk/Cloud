# Backend Quick Start Script for Windows

Write-Host "Starting CloudGuide Backend..." -ForegroundColor Green
Write-Host ""

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python: $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.11 or later" -ForegroundColor Yellow
    exit 1
}

# Change to backend directory
$backendDir = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendDir)) {
    Write-Host "ERROR: Backend directory not found!" -ForegroundColor Red
    exit 1
}

Set-Location $backendDir

# Check if dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Cyan
try {
    python -c "import flask" 2>&1 | Out-Null
    Write-Host "Dependencies: OK" -ForegroundColor Green
} catch {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Check database connection
Write-Host "Checking database..." -ForegroundColor Cyan
$dbRunning = wsl docker ps --filter "name=cloudguide" 2>&1 | Select-String "cloudguide_postgres"
if ($dbRunning) {
    Write-Host "Database: Running" -ForegroundColor Green
} else {
    Write-Host "WARNING: Database container not running!" -ForegroundColor Yellow
    Write-Host "Starting database..." -ForegroundColor Yellow
    wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose up -d postgres"
    Start-Sleep -Seconds 3
}

# Start backend
Write-Host ""
Write-Host "Starting Flask backend on http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

python app.py
