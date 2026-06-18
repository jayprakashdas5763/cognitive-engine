#!/bin/bash

# Autonomous Cognitive Engine - Quick Start Script
# This script sets up the project for local development

set -e

echo "🚀 Autonomous Cognitive Engine - Setup"
echo "======================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm with Node.js."
    exit 1
fi

echo "✅ Python: $(python3 --version)"
echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
MISTRAL_API_KEY=your_mistral_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
EOF
    echo "⚠️  Please edit .env and add your API keys"
    echo ""
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt > /dev/null 2>&1 || {
    echo "❌ Failed to install requirements.txt"
    exit 1
}

pip install -r backend/requirements.txt > /dev/null 2>&1 || {
    echo "❌ Failed to install backend/requirements.txt"
    exit 1
}
echo "✅ Python dependencies installed"
echo ""

# Install Node dependencies
echo "📦 Installing frontend dependencies..."
cd ui
npm install > /dev/null 2>&1 || {
    echo "❌ Failed to install frontend dependencies"
    exit 1
}
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Create ui/.env.local
if [ ! -f ui/.env.local ]; then
    echo "📝 Creating ui/.env.local..."
    cat > ui/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
    echo "✅ Frontend environment configured"
    echo ""
fi

# Create backend/.env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env..."
    cat > backend/.env << 'EOF'
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=development
EOF
    echo "✅ Backend environment configured"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Edit .env and add your API keys:"
echo "   MISTRAL_API_KEY=your_key_here"
echo "   TAVILY_API_KEY=your_key_here"
echo ""
echo "2. Start the backend (Terminal 1):"
echo "   cd backend"
echo "   python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "3. Start the frontend (Terminal 2):"
echo "   cd ui"
echo "   npm run dev"
echo ""
echo "4. Open in browser:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Or use Docker Compose for easier setup:"
echo "   docker-compose up"
echo ""
