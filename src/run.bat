@echo off
echo ===============================================
echo        BreedSight AI - Desktop Application
echo ===============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

REM Check if main.py exists
if not exist "main.py" (
    echo ❌ main.py not found in current directory
    echo Please run this script from the BreedSight AI folder
    pause
    exit /b 1
)

echo ✅ Python found
echo 🚀 Starting BreedSight AI...
echo.

REM Run the application
python run.py

REM Pause if there was an error
if errorlevel 1 (
    echo.
    echo ❌ Application exited with an error
    pause
)

echo.
echo 👋 Thank you for using BreedSight AI!
pause