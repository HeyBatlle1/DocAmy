@echo off
REM DocAmy FastAPI Server Startup Script for Windows
REM Ensures Python 3 is used and handles environment setup

echo 🚀 DocAmy FastAPI Server Startup
echo ================================

REM Check if Python 3 is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo ✅ Found Python version: %PYTHON_VERSION%

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️  Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
if exist "requirements.txt" (
    echo 📥 Installing dependencies...
    pip install -r requirements.txt
) else (
    echo ❌ Error: requirements.txt not found
    pause
    exit /b 1
)

REM Check for .env file
if not exist ".env" (
    echo ⚠️  Warning: .env file not found
    if exist ".env.example" (
        echo 📋 Copying .env.example to .env
        copy .env.example .env
        echo 🔧 Please edit .env file with your configuration
    )
)

REM Start the server
echo 🚀 Starting FastAPI server...
python start.py

pause