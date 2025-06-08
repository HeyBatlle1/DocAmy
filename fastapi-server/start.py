#!/usr/bin/env python3
"""
DocAmy FastAPI Server Startup Script
Ensures Python 3 compatibility and proper initialization
"""

import sys
import os
import subprocess
from pathlib import Path

def check_python_version():
    """Ensure we're running Python 3.8+"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python version: {sys.version}")

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import redis
        print("✅ All dependencies are installed")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Run: pip3 install -r requirements.txt")
        sys.exit(1)

def setup_environment():
    """Setup environment variables and configuration"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  Warning: .env file not found")
        print("Copy .env.example to .env and configure your settings")
        
    # Set default environment variables
    os.environ.setdefault("PYTHONPATH", str(Path(__file__).parent))
    os.environ.setdefault("HOST", "0.0.0.0")
    os.environ.setdefault("PORT", "8001")

def main():
    """Main startup function"""
    print("🚀 Starting DocAmy FastAPI Server...")
    
    # Checks
    check_python_version()
    check_dependencies()
    setup_environment()
    
    # Get configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8001))
    reload = os.getenv("DEBUG", "false").lower() == "true"
    
    print(f"📡 Server will start on http://{host}:{port}")
    print(f"📚 API docs will be available at http://{host}:{port}/docs")
    
    # Start the server
    try:
        import uvicorn
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=reload,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n🔄 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()