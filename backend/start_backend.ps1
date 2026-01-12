# Backend Start Script for Windows PowerShell

Write-Host "Starting CloudGuide Backend..." -ForegroundColor Green
Write-Host ""

# Get script directory and go to parent
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Set-Location $projectRoot

Write-Host "Project root: $projectRoot" -ForegroundColor Cyan
Write-Host ""

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python: $pythonVersion" -ForegroundColor Cyan
} catch {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    exit 1
}

# Check database
Write-Host "Checking database..." -ForegroundColor Cyan
$dbRunning = wsl docker ps --filter "name=cloudguide" 2>&1 | Select-String "cloudguide_postgres"
if (-not $dbRunning) {
    Write-Host "Starting database..." -ForegroundColor Yellow
    wsl bash -c "cd /mnt/c/Users/Dell/Downloads/cloud/backend && docker compose up -d postgres"
    Start-Sleep -Seconds 3
}

# Start backend
Write-Host ""
Write-Host "Starting Flask backend on http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

python -m backend.app
