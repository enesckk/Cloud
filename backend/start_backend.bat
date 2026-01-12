@echo off
echo Starting CloudGuide Backend...
echo.

cd /d "%~dp0"
cd ..

echo Current directory: %CD%
echo.

echo Starting Flask backend...
python -m backend.app

pause
