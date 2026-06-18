# 🚀 Complete Setup & Deployment Guide

## Project Structure Overview

```
autonomous-cognitive-engine/
├── main.py                          # Original CLI interface
├── app.py                           # Streamlit GUI
├── graph.py                         # LangGraph engine
├── DESIGN_SPECIFICATION.md          # Complete design docs
│
└── ui/                              # Next.js React application
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── postcss.config.js
    ├── README.md
    │
    └── src/
        ├── app/
        │   ├── layout.tsx           # Root layout
        │   ├── page.tsx             # Main page
        │   └── globals.css          # Global styles
        │
        ├── components/
        │   ├── Header.tsx           # Navigation
        │   ├── Sidebar.tsx          # Left sidebar
        │   ├── ChatArea.tsx         # Chat interface
        │   └── CognitivePanel.tsx   # Thinking visualization
        │
        └── store/
            └── index.ts             # Zustand state
```

---

## Quick Start

### Option 1: Run Full Stack (Recommended)

#### Backend (Python)

```bash
# Install dependencies
python -m pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your API keys
MISTRAL_API_KEY=your_key
TAVILY_API_KEY=your_key

# Run the engine
python main.py
```

#### Frontend (React/Next.js)

```bash
# Navigate to UI directory
cd ui

# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

---

### Option 2: Streamlit Interface (Quick Demo)

```bash
# Install Streamlit
python -m pip install streamlit

# Run
streamlit run app.py

# Opens http://localhost:8501
```

---

## Production Deployment

### Frontend Deployment (Vercel - Recommended)

1. **Push to GitHub**
   ```bash
   cd ui
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Configure Environment**
   - Add `NEXT_PUBLIC_API_URL` in Vercel dashboard
   - Set to your backend URL

### Backend Deployment

#### Option A: Render (Free tier available)

1. Create `render.yaml`:
   ```yaml
   services:
     - type: web
       name: cognitive-engine
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: gunicorn main:app
       envVars:
         - key: MISTRAL_API_KEY
           sync: false
         - key: TAVILY_API_KEY
           sync: false
   ```

2. Push to GitHub and connect to Render

#### Option B: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

#### Option C: Docker + AWS ECS/GCP Cloud Run

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and push:
```bash
docker build -t cognitive-engine .
docker tag cognitive-engine:latest <registry>/cognitive-engine:latest
docker push <registry>/cognitive-engine:latest
```

---

## API Integration

### Connect Frontend to Backend

Update `ui/src/components/ChatArea.tsx`:

```typescript
const handleSend = async () => {
  if (!input.trim()) return;

  addMessage({
    id: Date.now().toString(),
    role: 'user',
    content: input,
    timestamp: new Date(),
  });

  setInput('');
  setLoading(true);

  try {
    // Call your backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/execute`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: input }),
      }
    );

    const result = await response.json();

    // Update cognitive panel with real data
    setCognitive({
      goal: input,
      progress: result.progress,
      thinking: result.thinking,
      tools: result.tools,
    });

    // Add assistant response
    addMessage({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.response,
      timestamp: new Date(),
    });

    setLoading(false);
  } catch (error) {
    console.error('Error:', error);
    setLoading(false);
  }
};
```

### Backend API Endpoints

Create `backend/api.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from graph import build_graph

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = build_graph()

@app.post("/api/execute")
async def execute(request: dict):
    goal = request.get("goal")
    
    state = {
        "messages": [goal],
        "todos": [],
        "current_task": "",
        "files": {},
        "results": []
    }
    
    result = graph.invoke(state)
    
    return {
        "goal": goal,
        "response": result["files"].get("final_report.txt", ""),
        "progress": 100,
        "thinking": "Complete",
        "tools": ["research", "summarize"],
    }

# Run with: uvicorn api:app --reload
```

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Backend (.env)
```
MISTRAL_API_KEY=your_key
TAVILY_API_KEY=your_key
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
```

---

## Monitoring & Debugging

### Development

```bash
# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint

# Build optimized bundle
npm run build
```

### Logs

Frontend (Next.js):
```bash
npm run dev  # See console output
```

Backend (Python):
```bash
# Enable verbose logging
PYTHONUNBUFFERED=1 python main.py
```

---

## Performance Optimization

### Frontend
- Enable ISR (Incremental Static Regeneration)
- Compress images
- Code splitting
- Lazy load components

### Backend
- Cache LLM responses
- Use connection pooling
- Implement rate limiting
- Monitor token usage

---

## Testing

### Frontend Tests
```bash
npm install --save-dev vitest @testing-library/react
npm run test
```

### Backend Tests
```bash
pip install pytest pytest-asyncio
pytest
```

---

## Troubleshooting

### "API connection failed"
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running
- Check CORS configuration

### "Out of memory"
- Increase Node.js heap: `NODE_OPTIONS=--max_old_space_size=4096 npm run dev`
- Check for memory leaks in WebSocket

### "Slow responses"
- Profile with Chrome DevTools
- Check network tab
- Monitor backend latency

---

## Maintenance Checklist

- [ ] Update dependencies monthly: `npm update`
- [ ] Monitor API costs
- [ ] Backup vector database
- [ ] Review logs for errors
- [ ] Test keyboard shortcuts
- [ ] Check accessibility (axe DevTools)
- [ ] Performance audit (Lighthouse)
- [ ] Security scan (npm audit)

---

## Next Steps

1. **Implement Backend Integration**
   - Create FastAPI routes
   - Add WebSocket for streaming
   - Implement authentication

2. **Add Advanced Features**
   - Multi-agent swarm visualization
   - Memory graph explorer
   - Knowledge base management
   - Analytics dashboard

3. **Enhance UX**
   - Add command palette (Cmd+K)
   - Implement code execution
   - Add file management
   - Voice input/output

4. **Scalability**
   - Implement worker queues (Celery)
   - Add caching layer (Redis)
   - Use vector database (Pinecone/Weaviate)
   - Set up monitoring (Sentry/New Relic)

---

## Support

For issues or questions:
1. Check DESIGN_SPECIFICATION.md for architecture
2. Review component READMEs in ui/
3. Check implementation status
4. Debug with browser DevTools

---

*Ready for production deployment. Customize and scale as needed.*
