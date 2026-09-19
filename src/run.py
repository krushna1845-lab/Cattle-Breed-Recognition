#!/usr/bin/env python3
"""
BreedSight AI - Quick Run Script
Simple script to launch the application with error handling
"""

import sys
import subprocess
import importlib
import os

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'customtkinter',
        'PIL',
        'speech_recognition',
        'pyttsx3'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'PIL':
                importlib.import_module('PIL')
            else:
                importlib.import_module(package)
        except ImportError:
            missing_packages.append(package)
    
    return missing_packages

def install_missing_packages(packages):
    """Install missing packages"""
    print(f"Installing missing packages: {', '.join(packages)}")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install"
        ] + packages)
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    """Main function to run the application"""
    print("🚀 Starting BreedSight AI...")
    
    # Check Python version
    if sys.version_info < (3, 7):
        print("❌ Error: Python 3.7 or higher is required!")
        print(f"   Current version: {sys.version}")
        sys.exit(1)
    
    # Check dependencies
    missing = check_dependencies()
    if missing:
        print(f"⚠️  Missing dependencies: {', '.join(missing)}")
        print("🔧 Attempting to install missing packages...")
        
        if install_missing_packages(missing):
            print("✅ Dependencies installed successfully!")
        else:
            print("❌ Failed to install dependencies.")
            print("Please run: pip install -r requirements.txt")
            sys.exit(1)
    
    # Import and run the main application
    try:
        print("🎯 Launching BreedSight AI Application...")
        from main import main as app_main
        app_main()
    except ImportError as e:
        print(f"❌ Error importing main application: {e}")
        print("Please ensure main.py is in the current directory")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error running application: {e}")
        print("Please check the console output for more details")
        sys.exit(1)

if __name__ == "__main__":
    main()