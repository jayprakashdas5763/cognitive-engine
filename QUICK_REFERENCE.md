# Quick Reference Guide

Fast lookup for common commands and tasks.

## Starting Development

### Mac/Linux
```bash
# Full setup (one-time)
chmod +x setup.sh
./setup.sh

# Daily development
cd backend && python -m uvicorn api:app --reload &  # Terminal 1
cd ../ui && npm run dev                             # Terminal 2
```

### Windows
```bash
# Full setup (one-time)
setup.bat

# Daily development
cd backend && python -m uvicorn api:app --reload    # Terminal 1
cd ../ui && npm run dev                             # Terminal 2
```

### Docker (Easiest)
```bash
docker-compose up
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## API Testing

### Using curl
```bash
# Health check
curl http://localhost:8000/health

# Chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about AI"}'

# View API docs
curl http://localhost:8000/docs
```

### Using Python
```python
import requests

response = requests.post(
    "http://localhost:8000/chat",
    json={"message": "Your goal here"}
)
print(response.json())
```

### Using JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Your goal' })
});
const data = await response.json();
console.log(data);
```

## Environment Variables

### Check current values
```bash
# Show all env vars
printenv | grep -E 'MISTRAL|TAVILY|NEXT_PUBLIC'

# Or for specific ones
echo $MISTRAL_API_KEY
echo $TAVILY_API_KEY
```

### Update .env files
```bash
# Root .env (agent keys)
cat > .env << EOF
MISTRAL_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
EOF

# Frontend env
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > ui/.env.local

# Backend env
cat > backend/.env << EOF
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=development
EOF
```

## Frontend Development

### Development server
```bash
cd ui
npm run dev
# Visit http://localhost:3000
```

### Type checking
```bash
cd ui
npm run type-check
```

### Build for production
```bash
cd ui
npm run build
npm start
```

### Format & lint (if configured)
```bash
cd ui
npm run lint
npx prettier --write .
```

## Backend Development

### Development server with hot reload
```bash
cd backend
python -m uvicorn api:app --reload
# Visit http://localhost:8000/docs
```

### Debug mode
```bash
cd backend
python -m uvicorn api:app --reload --log-level debug
```

### Run tests (if configured)
```bash
cd backend
pytest tests/
```

### Install new packages
```bash
# Add to requirements.txt first
# Then:
pip install -r backend/requirements.txt
```

## Docker Commands

### Build images
```bash
# Backend
docker build -f Dockerfile.backend -t cognitive-engine-backend .

# Frontend
docker build -f ui/Dockerfile -t cognitive-engine-frontend .
```

### Run containers
```bash
# Backend
docker run -p 8000:8000 \
  -e MISTRAL_API_KEY=your_key \
  -e TAVILY_API_KEY=your_key \
  cognitive-engine-backend

# Frontend
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  cognitive-engine-frontend
```

### Docker Compose
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild images
docker-compose up --build
```

### Container management
```bash
# List running containers
docker ps

# View container logs
docker logs <container-id> -f

# Enter container shell
docker exec -it <container-id> /bin/bash

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# View container stats
docker stats
```

## Git Workflow

### Commit changes
```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Connect React frontend to backend API"

# Push
git push origin main
```

### View history
```bash
# Log
git log --oneline -10

# Diff
git diff HEAD~1

# Show commit
git show <commit-hash>
```

## Troubleshooting

### Connection issues
```bash
# Test backend is running
curl http://localhost:8000/health

# Test frontend is running
curl http://localhost:3000

# Check port is available
# Mac/Linux:
lsof -i :8000
lsof -i :3000

# Windows:
netstat -ano | findstr :8000
netstat -ano | findstr :3000
```

### Python issues
```bash
# Check Python version
python --version

# Check virtual environment
which python
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Check installed packages
pip list | grep langchain
```

### Node issues
```bash
# Check Node version
node --version
npm --version

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check installed packages
npm list
```

### API issues
```bash
# Check if running
curl http://localhost:8000/health

# View documentation
open http://localhost:8000/docs  # Mac
xdg-open http://localhost:8000/docs  # Linux
start http://localhost:8000/docs  # Windows

# Test POST endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Check logs for errors
# Terminal where you ran uvicorn
# Check for error messages
```

### Frontend issues
```bash
# Clear Next.js cache
cd ui
rm -rf .next

# Rebuild
npm run build

# Clear browser cache
# In DevTools: Command+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)

# Check environment variable
echo "process.env.NEXT_PUBLIC_API_URL" in browser console
```

## Deployment

### Render (Backend)
```bash
# Push to GitHub triggers deployment
git push origin main

# Check status: https://dashboard.render.com

# View logs in dashboard

# Manual restart: Click "Manual Deploy" in dashboard
```

### Vercel (Frontend)
```bash
# Push to GitHub triggers deployment
git push origin main

# Check status: https://vercel.com/dashboard

# Set environment variables:
# NEXT_PUBLIC_API_URL=https://your-backend.render.com
```

### Local Docker deployment
```bash
# Create .env with secrets
echo "MISTRAL_API_KEY=..." > .env
echo "TAVILY_API_KEY=..." >> .env

# Deploy
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Performance

### Measure API response time
```bash
# Using curl
time curl http://localhost:8000/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Using Apache Bench
ab -n 10 -c 1 -p data.json -T application/json http://localhost:8000/chat
```

### Monitor resource usage
```bash
# Docker
docker stats

# System
# Mac: Activity Monitor
# Linux: top, htop
# Windows: Task Manager
```

### Check bundle size
```bash
cd ui
npm run build
# Check .next/static/ directory

# Use npm package analyzer
npx webpack-bundle-analyzer .next/static
```

## Database (if added)

### PostgreSQL
```bash
# Connect to database
psql -U user -d database

# Common commands
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM users;  # Query
```

### MongoDB
```bash
# Connect
mongosh

# Common commands
show dbs
use database_name
db.collection.find()
```

## Monitoring & Logging

### View application logs
```bash
# Backend
tail -f backend/logs/app.log

# Frontend (browser console)
# F12 or right-click → Inspect → Console
```

### Setup error tracking (Sentry example)
```bash
# Install
pip install sentry-sdk

# Add to backend/api.py
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

## Performance Optimization

### Frontend
```bash
# Analyze bundle
npm run build
npm install -g serve
serve -s out

# Use React DevTools
# Install: chrome.google.com/webstore

# Profile performance
# F12 → Performance tab
```

### Backend
```bash
# Profile with cProfile
python -m cProfile -s cumulative backend/api.py

# Use memory_profiler
pip install memory-profiler
python -m memory_profiler backend/api.py
```

## Updates & Dependencies

### Update packages
```bash
# Python
pip install --upgrade pip
pip install -U -r requirements.txt

# Node
npm update
npm outdated  # Check for updates
```

### Check for security vulnerabilities
```bash
# Python
pip audit

# Node
npm audit

# Fix automatically
npm audit fix
```

## Useful Links

- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Mistral Console: https://console.mistral.ai
- Tavily: https://tavily.com

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Port 8000 already in use" | `lsof -i :8000` then `kill -9 <PID>` |
| "ModuleNotFoundError" | `pip install -r requirements.txt` |
| "Cannot GET /" | Frontend not running or wrong URL |
| "CORS error" | Check backend CORS config and API URL |
| "API timeout" | Mistral/Tavily might be slow, add retry logic |
| "No module named 'langchain'" | `pip install langchain langgraph` |
| "npm not found" | Install Node.js from nodejs.org |
| "Docker permission denied" | `sudo usermod -aG docker $USER` |

## Tips & Tricks

### Faster development
```bash
# Use environment variables for quick switches
export NEXT_PUBLIC_API_URL=http://localhost:8000

# Create aliases
alias dev-backend="cd ~/path && python -m uvicorn backend.api:app --reload"
alias dev-frontend="cd ~/path/ui && npm run dev"
```

### Quick testing
```bash
# Save curl commands to file
cat > test_api.sh << 'EOF'
#!/bin/bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
EOF

chmod +x test_api.sh
./test_api.sh
```

### Debugging
```bash
# Add console logs in React
console.log('Debug:', value);

# Add print in Python
print(f"Debug: {value}")

# Use debugger
# React: debugger; in code
# Python: import pdb; pdb.set_trace()
```

## One-Liners

```bash
# Start everything at once
docker-compose up &

# Kill all node processes
killall node

# Remove Docker containers
docker rm $(docker ps -a -q)

# Check if ports are free
netstat -tuln | grep -E ':3000|:8000'

# View git branches
git branch -a

# Reset hard to last commit
git reset --hard HEAD~1
```

## Help Commands

```bash
# FastAPI help
python -m uvicorn --help

# Next.js help
npx next --help

# Docker help
docker --help

# Docker Compose help
docker-compose --help

# Git help
git help

# pip help
pip --help
```
