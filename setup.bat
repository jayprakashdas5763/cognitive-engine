@echo off
REM Autonomous Cognitive Engine - Quick Start Script (Windows)
REM This script sets up the project for local development

setlocal enabledelayedexpansion

echo.
echo 🚀 Autonomous Cognitive Engine - Setup
echo ======================================
echo.

REM Check prerequisites
echo 📋 Checking prerequisites...

python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm with Node.js.
    pause
    exit /b 1
)

echo ✅ Python:
python --version

echo ✅ Node.js:
node --version

echo ✅ npm:
npm --version

echo.

REM Create .env if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo MISTRAL_API_KEY=your_mistral_api_key_here
        echo TAVILY_API_KEY=your_tavily_api_key_here
    ) > .env
    echo ⚠️  Please edit .env and add your API keys
    echo.
)

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install requirements.txt
    pause
    exit /b 1
)

pip install -r backend/requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install backend/requirements.txt
    pause
    exit /b 1
)
echo ✅ Python dependencies installed
echo.

REM Install Node dependencies
echo 📦 Installing frontend dependencies...
cd ui
npm install >nul 2>&1
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend dependencies installed
echo.

REM Create ui\.env.local
if not exist ui\.env.local (
    echo 📝 Creating ui\.env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
    ) > ui\.env.local
    echo ✅ Frontend environment configured
    echo.
)

REM Create backend\.env if it doesn't exist
if not exist backend\.env (
    echo 📝 Creating backend\.env...
    (
        echo BACKEND_HOST=0.0.0.0
        echo BACKEND_PORT=8000
        echo ENVIRONMENT=development
    ) > backend\.env
    echo ✅ Backend environment configured
    echo.
)

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo.
echo 1. Edit .env and add your API keys:
echo    MISTRAL_API_KEY=your_key_here
echo    TAVILY_API_KEY=your_key_here
echo.
echo 2. Start the backend (Terminal 1):
echo    cd backend
echo    python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
echo.
echo 3. Start the frontend (Terminal 2):
echo    cd ui
echo    npm run dev
echo.
echo 4. Open in browser:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo Or use Docker Compose for easier setup:
echo    docker-compose up
echo.
pause
