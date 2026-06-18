# Verification Checklist

Use this checklist to verify everything is set up correctly.

## ✅ Pre-Flight Checks

- [ ] Python 3.8+ installed: `python --version`
- [ ] Node.js 18+ installed: `node --version`
- [ ] Git installed: `git --version`
- [ ] Mistral API key available
- [ ] Tavily API key available

## ✅ Files Created

### Backend Files
- [ ] `backend/api.py` exists
- [ ] `backend/requirements.txt` exists
- [ ] `backend/.env` exists
- [ ] `backend/README.md` exists

### Frontend Configuration
- [ ] `ui/.env.local` exists
- [ ] `ui/src/types/api.ts` exists

### Docker Files
- [ ] `docker-compose.yml` exists
- [ ] `Dockerfile.backend` exists
- [ ] `ui/Dockerfile` exists
- [ ] `.dockerignore` exists

### Setup Scripts
- [ ] `setup.sh` exists (Mac/Linux)
- [ ] `setup.bat` exists (Windows)

### Documentation
- [ ] `GETTING_STARTED.md` exists
- [ ] `FULL_STACK_README.md` exists
- [ ] `DEPLOYMENT_GUIDE.md` exists
- [ ] `ARCHITECTURE.md` exists
- [ ] `IMPLEMENTATION_SUMMARY.md` exists
- [ ] `QUICK_REFERENCE.md` exists
- [ ] `backend/README.md` exists

## ✅ Environment Configuration

### Root .env
- [ ] `.env` file created
- [ ] `MISTRAL_API_KEY=...` added
- [ ] `TAVILY_API_KEY=...` added

### Backend .env
- [ ] `backend/.env` file created
- [ ] Contains BACKEND_HOST (should be 0.0.0.0)
- [ ] Contains BACKEND_PORT (should be 8000)
- [ ] Contains ENVIRONMENT (should be development)

### Frontend .env
- [ ] `ui/.env.local` file created
- [ ] Contains `NEXT_PUBLIC_API_URL=http://localhost:8000`

## ✅ Code Changes

### ChatArea.tsx Updated
- [ ] Removed `setTimeout()` calls
- [ ] Removed hardcoded responses
- [ ] Added `API_BASE_URL` constant
- [ ] Added `fetch()` to `/chat` endpoint
- [ ] Added error handling
- [ ] Updates Zustand store with real data

## ✅ Dependencies Installed

### Python
- [ ] `pip install -r requirements.txt` completed
- [ ] `pip install -r backend/requirements.txt` completed
- [ ] FastAPI installed: `pip list | grep fastapi`
- [ ] Uvicorn installed: `pip list | grep uvicorn`
- [ ] Pydantic installed: `pip list | grep pydantic`

### Node.js
- [ ] `cd ui && npm install` completed
- [ ] No npm errors
- [ ] `node_modules/` directory exists

## ✅ Backend Startup

- [ ] Navigate to `backend/` directory
- [ ] Run: `python -m uvicorn api:app --reload`
- [ ] See: `INFO:     Uvicorn running on http://0.0.0.0:8000`
- [ ] No error messages

## ✅ Backend Health

- [ ] Open terminal/command prompt
- [ ] Run: `curl http://localhost:8000/health`
- [ ] See: `{"status":"healthy"}` response
- [ ] Browser: Visit http://localhost:8000 (should show 404 - normal)

## ✅ API Documentation

- [ ] Open browser
- [ ] Visit: http://localhost:8000/docs
- [ ] See: Swagger UI with API endpoints
- [ ] See: POST /chat endpoint
- [ ] See: GET /health endpoint
- [ ] See: Request/response schema

## ✅ Frontend Startup

- [ ] In new terminal, navigate to `ui/` directory
- [ ] Run: `npm run dev`
- [ ] See: `ready - started server on 0.0.0.0:3000`
- [ ] No error messages

## ✅ Frontend Load

- [ ] Open browser
- [ ] Visit: http://localhost:3000
- [ ] See: Chat interface loads
- [ ] See: CognitivePanel on right
- [ ] See: Sidebar on left
- [ ] See: Input field at bottom

## ✅ Integration Test

- [ ] Type goal in chat input: "Tell me about artificial intelligence"
- [ ] Click Send or press Enter
- [ ] See: User message appears in chat
- [ ] See: Loading indicator shows
- [ ] See: CognitivePanel updates with:
  - [ ] Goal updates
  - [ ] Progress bar shows movement
  - [ ] Thinking text updates
- [ ] See: Assistant response appears
- [ ] See: Loading indicator disappears
- [ ] See: Full CognitivePanel data:
  - [ ] Current Task
  - [ ] Confidence score
  - [ ] Progress percentage
  - [ ] Tools used

## ✅ Error Handling

- [ ] Disconnect internet
- [ ] Try to send message
- [ ] See: Error message in chat
- [ ] See: Error logged in browser console (F12)
- [ ] Reconnect internet
- [ ] Retry sending
- [ ] Works again

## ✅ API Response Structure

- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Send a message
- [ ] Find `/chat` request
- [ ] Response should have:
  - [ ] `response` (string)
  - [ ] `goal` (string)
  - [ ] `currentTask` (string)
  - [ ] `thinking` (string)
  - [ ] `confidence` (number 0-100)
  - [ ] `progress` (number 0-100)
  - [ ] `tools` (array)

## ✅ Zustand Store

- [ ] Open browser console (F12)
- [ ] Type: `console.log(useStore.getState())`
- [ ] See: Store structure with:
  - [ ] messages array
  - [ ] cognitive object
  - [ ] sidebarOpen boolean
  - [ ] cognitiveOpen boolean

## ✅ Docker Setup

- [ ] `docker --version` works
- [ ] `docker-compose --version` works
- [ ] Run: `docker-compose up`
- [ ] Wait ~30 seconds
- [ ] See: Both services starting
- [ ] Open http://localhost:3000
- [ ] See: Frontend loads
- [ ] See: Backend works

## ✅ Type Safety

- [ ] `ui/src/types/api.ts` exists
- [ ] Contains: `ChatRequest` interface
- [ ] Contains: `ChatResponse` interface
- [ ] Frontend uses these types
- [ ] No TypeScript errors: `npm run type-check`

## ✅ Documentation

- [ ] Read `GETTING_STARTED.md`
- [ ] Read `QUICK_REFERENCE.md`
- [ ] Bookmark relevant docs
- [ ] Know where to find answers

## ✅ Deployment Ready

- [ ] Can build frontend: `npm run build` (in ui/)
- [ ] Can create Docker image: `docker build -f Dockerfile.backend .`
- [ ] Know deployment platform choice
- [ ] Have deployment guide ready

## ✅ Performance Check

- [ ] Message sends within 30 seconds
- [ ] No console errors
- [ ] No network errors
- [ ] CPU usage reasonable (<50%)
- [ ] Memory usage reasonable (<1GB)

## 🎯 Final Verification

Run this complete flow once:

1. **Backend alone**:
   ```bash
   cd backend
   python -m uvicorn api:app --reload
   # In another terminal:
   curl http://localhost:8000/health
   # Should return: {"status": "healthy"}
   ```

2. **Frontend alone**:
   ```bash
   cd ui
   npm run dev
   # Visit: http://localhost:3000
   # Should load without errors
   ```

3. **Full integration**:
   ```bash
   # Terminal 1: Backend
   cd backend && python -m uvicorn api:app --reload
   
   # Terminal 2: Frontend
   cd ui && npm run dev
   
   # Browser: http://localhost:3000
   # Send a test message
   # Verify CognitivePanel updates
   ```

4. **API documentation**:
   ```bash
   # Visit: http://localhost:8000/docs
   # Try the POST /chat endpoint
   # See the response
   ```

## 🚨 If Something Fails

### Backend won't start
1. Check port 8000 is free: `lsof -i :8000`
2. Check .env has API keys: `cat .env`
3. Check dependencies: `pip list | grep -E 'fastapi|uvicorn'`
4. Reinstall: `pip install -r backend/requirements.txt --force-reinstall`

### Frontend won't load
1. Check Node version: `node --version` (should be 18+)
2. Delete cache: `cd ui && rm -rf .next node_modules && npm install`
3. Check env file: `cat ui/.env.local`
4. Check port 3000 is free: `lsof -i :3000`

### API calls fail
1. Check backend is running: `curl http://localhost:8000/health`
2. Check CORS errors in console (F12)
3. Check `ui/.env.local` has correct API URL
4. Check network tab in DevTools (F12)

### Type errors
1. Check `ui/src/types/api.ts` exists
2. Run: `npm run type-check`
3. Fix errors shown
4. Rebuild

## 📊 Success Indicators

You'll know everything is working when:

- ✅ Backend responds to http://localhost:8000/health
- ✅ Frontend loads at http://localhost:3000
- ✅ You can send a message to the agent
- ✅ CognitivePanel shows live data
- ✅ Assistant response appears in chat
- ✅ No errors in browser console (F12)
- ✅ No errors in terminal running backend
- ✅ API documentation available at /docs
- ✅ Docker Compose starts all services
- ✅ All environment variables are set

## 📝 Notes

- First message might take 10-30 seconds (agent planning)
- Subsequent messages might be faster or slower depending on task complexity
- API keys must be valid (not just placeholders)
- Backend must be running for frontend to work
- Both must be running for full integration test

## ✅ Sign-Off

When all checks pass:
- **System is ready for development** ✨
- **System is ready for testing** 🧪
- **System is ready for deployment** 🚀

Proceed to QUICK_REFERENCE.md for common tasks or DEPLOYMENT_GUIDE.md to go live!
