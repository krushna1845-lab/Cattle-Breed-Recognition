#!/usr/bin/env python3
"""
Setup script for BreedSight AI Python Application
"""

import subprocess
import sys
import platform
import os

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Python requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def install_system_dependencies():
    """Install system-specific dependencies"""
    system = platform.system()
    print(f"Detected system: {system}")
    
    if system == "Linux":
        print("Installing system dependencies for Linux...")
        try:
            # Install PortAudio for pyaudio
            subprocess.run(["sudo", "apt-get", "update"], check=True)
            subprocess.run(["sudo", "apt-get", "install", "-y", "portaudio19-dev", "python3-pyaudio"], check=True)
            print("✅ Linux system dependencies installed!")
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Warning: Could not install system dependencies: {e}")
            print("Please install manually: sudo apt-get install portaudio19-dev python3-pyaudio")
    
    elif system == "Darwin":  # macOS
        print("Installing system dependencies for macOS...")
        try:
            # Install PortAudio using Homebrew
            subprocess.run(["brew", "install", "portaudio"], check=True)
            print("✅ macOS system dependencies installed!")
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Warning: Could not install system dependencies: {e}")
            print("Please install manually: brew install portaudio")
    
    elif system == "Windows":
        print("Windows detected - pyaudio should install directly with pip")
        print("If you encounter issues, please install Visual C++ Build Tools")
    
    return True

def create_desktop_shortcut():
    """Create desktop shortcut (Linux/Windows)"""
    system = platform.system()
    
    if system == "Linux":
        desktop_path = os.path.expanduser("~/Desktop")
        if os.path.exists(desktop_path):
            shortcut_content = f"""[Desktop Entry]
Name=BreedSight AI
Comment=Cattle and Buffalo Breed Recognition
Exec=python3 {os.path.abspath('main.py')}
Icon=application-x-executable
Terminal=false
Type=Application
Categories=Application;
"""
            shortcut_path = os.path.join(desktop_path, "BreedSight-AI.desktop")
            try:
                with open(shortcut_path, 'w') as f:
                    f.write(shortcut_content)
                os.chmod(shortcut_path, 0o755)
                print(f"✅ Desktop shortcut created: {shortcut_path}")
            except Exception as e:
                print(f"⚠️  Could not create desktop shortcut: {e}")

def main():
    """Main setup function"""
    print("🚀 Setting up BreedSight AI Python Application...")
    print("=" * 50)
    
    # Check Python version
    python_version = sys.version_info
    if python_version < (3, 7):
        print("❌ Python 3.7 or higher is required!")
        sys.exit(1)
    
    print(f"✅ Python {python_version.major}.{python_version.minor} detected")
    
    # Install system dependencies
    install_system_dependencies()
    
    # Install Python requirements
    if not install_requirements():
        print("❌ Setup failed!")
        sys.exit(1)
    
    # Create desktop shortcut
    create_desktop_shortcut()
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\nTo run the application:")
    print("  python3 main.py")
    print("\nOr double-click the desktop shortcut (if created)")
    print("\n📚 Available features:")
    print("  • Image-based breed recognition")
    print("  • Voice commands (English, Hindi, Marathi)")
    print("  • Health analysis and reports")
    print("  • Milk yield analysis")
    print("  • Multi-language support")

if __name__ == "__main__":
    main()