# Autonomous Cognitive Engine - Full Stack

A production-ready autonomous AI agent system with React frontend, FastAPI backend, and LangGraph/LangChain workflow.

## Features

- **Intelligent Task Planning**: Breaks complex goals into manageable tasks
- **Multi-Agent Execution**: Executes tasks using specialized LangChain agents
- **Real-time Cognitive Panel**: Shows agent thinking, progress, confidence, and tools
- **Beautiful UI**: Next.js + React with Tailwind CSS and animations
- **Two Frontends**: Streamlit (simple) and React (advanced)
- **RESTful API**: FastAPI backend with automatic documentation
- **Production Ready**: CORS, error handling, environment configuration

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   React Frontend (Next.js)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ChatArea         CognitivePanel         Sidebar        │   │
│  │ (Chat UI)      (Live Metrics)         (Navigation)      │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ HTTP Requests
                                 ↓
┌──────────────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  POST /chat     GET /health     GET /docs              │   │
│  │  (Agent API)    (Health Check)  (API Docs)             │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ↓
┌──────────────────────────────────────────────────────────────────┐
│          LangGraph Agent Workflow                                │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐               │
│  │ Planner  │─────→│ Executor │─────→│Synthesizer│              │
│  └──────────┘      └──────────┘      └──────────┘              │
│         Task Plan      Task Loop        Final Report            │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ↓            ↓            ↓
              ┌─────────┐  ┌──────────┐  ┌────────┐
              │ Mistral │  │  Tavily  │  │ Tools  │
              │   LLM   │  │  Search  │  │System  │
              └─────────┘  └──────────┘  └────────┘
```

## Project Structure

```
autonomous-cognitive-engine/
├── backend/
│   ├── api.py                    # FastAPI application
│   ├── requirements.txt          # Backend dependencies
│   ├── .env                     # Backend environment variables
│   └── README.md                # Backend documentation
├── ui/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Main page
│   │   │   └── layout.tsx       # Root layout
│   │   ├── components/
│   │   │   ├── ChatArea.tsx     # Chat interface (API connected)
│   │   │   ├── CognitivePanel.tsx # Live metrics display
│   │   │   ├── Header.tsx       # Top navigation
│   │   │   └── Sidebar.tsx      # Side navigation
│   │   ├── store/
│   │   │   └── index.ts         # Zustand state management
│   │   ├── types/
│   │   │   └── api.ts           # TypeScript API types
│   │   └── styles/
│   ├── package.json
│   ├── .env.local              # Frontend environment variables
│   ├── next.config.js          # Next.js configuration
│   └── tsconfig.json           # TypeScript configuration
├── main.py                      # CLI entry point
├── graph.py                     # LangGraph workflow
├── state.py                     # State schema
├── app.py                       # Streamlit frontend
├── requirements.txt             # Python dependencies
├── .env                         # Root environment variables
├── .gitignore
└── README.md                    # This file
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Mistral API key
- Tavily API key

### Option 1: Full Stack (Recommended)

#### 1. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt
pip install -r backend/requirements.txt

# Create .env file with your API keys
cat > .env << EOF
MISTRAL_API_KEY=your_mistral_key_here
TAVILY_API_KEY=your_tavily_key_here
EOF

# Start backend
cd backend
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs

#### 2. Frontend Setup (in another terminal)

```bash
# Install Node dependencies
cd ui
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### Option 2: Streamlit Frontend (Simple)

```bash
# Install dependencies
pip install -r requirements.txt

# Configure .env
cat > .env << EOF
MISTRAL_API_KEY=your_mistral_key_here
TAVILY_API_KEY=your_tavily_key_here
EOF

# Start Streamlit app
streamlit run app.py
```

App will open at: **http://localhost:8501**

## API Documentation

### POST /chat

Send a goal to the agent and get a response with thinking process, progress, and tools used.

**Request**:
```json
{
  "message": "Research AI advancements in 2024 and create a summary"
}
```

**Response**:
```json
{
  "response": "# AI Advancements in 2024\n\n## Key Breakthroughs...",
  "goal": "Research AI advancements in 2024 and create a summary",
  "currentTask": "Synthesis: Compiling research results",
  "thinking": "Processed 8 tasks successfully.",
  "confidence": 92,
  "progress": 100,
  "tools": ["Planner", "Executor", "Synthesizer"]
}
```

**Error**:
```json
{
  "detail": "Error message"
}
```

### GET /health

Check if backend is running:

```json
{
  "status": "healthy"
}
```

### GET /docs

Interactive API documentation (Swagger UI).

### GET /redoc

Alternative API documentation (ReDoc).

## Environment Variables

### Root (.env)

```env
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### Backend (backend/.env)

```env
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=development
```

### Frontend (ui/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

### Running Individual Components

**Backend Only** (for testing/development):
```bash
cd backend
python -m uvicorn api:app --reload
```

**Frontend Only** (requires backend running):
```bash
cd ui
npm run dev
```

**Streamlit** (standalone):
```bash
streamlit run app.py
```

### Frontend Development

```bash
cd ui

# Start dev server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build
npm start
```

### Backend Development

```bash
cd backend

# Development with hot reload
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000

# View API docs
# Visit http://localhost:8000/docs
```

## Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend (Vercel)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.render.com
   ```
4. Deploy

#### Backend (Render)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command:
   ```
   pip install -r requirements.txt && pip install -r backend/requirements.txt
   ```
4. Set start command:
   ```
   cd backend && python -m uvicorn api:app --host 0.0.0.0 --port 8000
   ```
5. Set environment variables (MISTRAL_API_KEY, TAVILY_API_KEY)
6. Deploy

### Option 2: Docker (Full Stack)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
      - TAVILY_API_KEY=${TAVILY_API_KEY}
      - ENVIRONMENT=production

  frontend:
    build:
      context: ./ui
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
```

Deploy:
```bash
docker-compose up
```

### Option 3: Railway

1. Connect GitHub to Railway
2. Add backend and frontend services
3. Set environment variables
4. Deploy

## API Keys

### Mistral AI

1. Visit [Mistral Console](https://console.mistral.ai/)
2. Create API key
3. Add to `.env`: `MISTRAL_API_KEY=your_key`

### Tavily

1. Visit [Tavily](https://tavily.com/)
2. Sign up and get API key
3. Add to `.env`: `TAVILY_API_KEY=your_key`

## Troubleshooting

### Frontend can't connect to backend

1. Ensure backend is running: `http://localhost:8000`
2. Check `ui/.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check browser console for CORS errors
4. Verify firewall allows port 8000

### Agent takes too long

- Mistral API might be slow
- Tavily search might be rate-limited
- Check API status pages
- View backend logs for errors

### API Keys not working

1. Verify keys are in `.env` (root directory)
2. Check API key format (no extra spaces)
3. Test API key directly with providers
4. Ensure environment variables are loaded

### Port already in use

- Backend: `lsof -i :8000` (macOS/Linux) or `netstat -ano | findstr :8000` (Windows)
- Frontend: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)

## Performance Tips

1. **Frontend**:
   - Components use React.memo where needed
   - Zustand for efficient state management
   - Framer Motion for smooth animations

2. **Backend**:
   - Uvicorn with workers for production
   - Connection pooling for external APIs
   - Caching for repeated queries

3. **Agent**:
   - Optimize task planning
   - Limit tool usage
   - Monitor token consumption

## Production Checklist

- [ ] Set `ENVIRONMENT=production` in backend
- [ ] Update CORS origins in `backend/api.py`
- [ ] Use production-grade database
- [ ] Enable HTTPS everywhere
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Test with production-like load
- [ ] Set up auto-scaling
- [ ] Configure backups
- [ ] Create CI/CD pipeline
- [ ] Set up error tracking (Sentry)
- [ ] Monitor API usage and costs

## Support & Documentation

- **Backend API Docs**: http://localhost:8000/docs
- **Backend README**: [backend/README.md](backend/README.md)
- **Frontend Structure**: See `ui/` directory

## License

MIT

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

## Architecture Deep Dive

### Data Flow

1. User enters goal in ChatArea
2. Sends POST request to `/chat` with message
3. Backend creates initial state with message
4. LangGraph executes workflow:
   - **Planner**: Breaks goal into tasks (todos)
   - **Executor**: Runs tasks in loop until all done
   - **Synthesizer**: Combines results into final report
5. Backend returns ChatResponse with:
   - Final report
   - Progress metrics
   - Tools used
   - Confidence score
6. Frontend updates Zustand store
7. Components re-render with new data
8. Message added to chat history
9. CognitivePanel shows live metrics

### State Management

**Zustand Store** (`ui/src/store/index.ts`):
```typescript
{
  messages: Message[],
  cognitive: {
    goal: string,
    currentTask: string,
    thinking: string,
    tools: string[],
    confidence: number,
    progress: number
  },
  sidebarOpen: boolean,
  cognitiveOpen: boolean
}
```

### Component Hierarchy

```
layout.tsx
└── app/page.tsx
    ├── Header
    ├── Sidebar
    ├── ChatArea
    │   ├── Message List
    │   └── Input Area
    └── CognitivePanel
        ├── Goal Display
        ├── Current Task
        ├── Reasoning
        ├── Tool Usage
        ├── Confidence Bar
        └── Progress Bar
```

## Future Enhancements

- [ ] WebSocket support for real-time streaming
- [ ] Message persistence (database)
- [ ] User authentication
- [ ] Multi-user support
- [ ] Advanced analytics
- [ ] Custom agent configuration
- [ ] Model selection UI
- [ ] Response caching
- [ ] Conversation history export
- [ ] Advanced security features
