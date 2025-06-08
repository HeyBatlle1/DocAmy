#!/bin/bash

# DocAmy FastAPI Server Startup Script
# Ensures Python 3 is used and handles environment setup

set -e

echo "🚀 DocAmy FastAPI Server Startup"
echo "================================"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    # Check if python points to Python 3
    PYTHON_VERSION=$(python -c "import sys; print(sys.version_info.major)")
    if [ "$PYTHON_VERSION" = "3" ]; then
        PYTHON_CMD="python"
    else
        echo "❌ Error: Python 3 is required but not found"
        echo "Please install Python 3.8 or higher"
        exit 1
    fi
else
    echo "❌ Error: Python is not installed"
    exit 1
fi

echo "✅ Using Python command: $PYTHON_CMD"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    $PYTHON_CMD -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
$PYTHON_CMD -m pip install --upgrade pip

# Install dependencies
if [ -f "requirements.txt" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
else
    echo "❌ Error: requirements.txt not found"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    if [ -f ".env.example" ]; then
        echo "📋 Copying .env.example to .env"
        cp .env.example .env
        echo "🔧 Please edit .env file with your configuration"
    fi
fi

# Start the server
echo "🚀 Starting FastAPI server..."
$PYTHON_CMD start.py