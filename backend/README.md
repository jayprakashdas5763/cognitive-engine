# Autonomous Cognitive Engine - Backend

FastAPI backend for the Autonomous Cognitive Engine that connects the React frontend to the LangGraph/LangChain agent workflow.

## Project Structure

```
backend/
├── api.py              # FastAPI application with /chat endpoint
├── requirements.txt    # Python dependencies
├── .env               # Environment variables
└── README.md          # This file
```

## Installation

### Prerequisites

- Python 3.8+
- pip or conda
- Backend environment setup (parent directory dependencies)

### Backend Setup

1. **Install backend dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Install parent project dependencies** (from project root):
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   Edit `backend/.env`:
   ```env
   BACKEND_HOST=0.0.0.0
   BACKEND_PORT=8000
   ENVIRONMENT=development
   ```

## Running the Backend

### Development

Start the FastAPI server with hot-reload:

```bash
cd backend
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Production

Using gunicorn (recommended for production):

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 backend.api:app
```

## API Endpoints

### POST /chat

Execute a goal through the cognitive agent.

**Request**:
```json
{
  "message": "Research AI advancements in 2024 and create a summary"
}
```

**Response**:
```json
{
  "response": "Final report with comprehensive findings...",
  "goal": "Research AI advancements in 2024 and create a summary",
  "currentTask": "Synthesis: Combining research results",
  "thinking": "Processed 12 tasks successfully.",
  "confidence": 92,
  "progress": 100,
  "tools": ["Planner", "Executor", "Synthesizer"]
}
```

**Error Response**:
```json
{
  "detail": "Error message describing what went wrong"
}
```

### GET /health

Health check endpoint.

**Response**:
```json
{
  "status": "healthy"
}
```

### GET /docs

Interactive API documentation (Swagger UI).

### GET /redoc

Alternative API documentation (ReDoc).

## Frontend Configuration

The React frontend needs to know the backend URL. Configure via environment variables:

### ui/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Environment Variables

- **Development**: `http://localhost:8000`
- **Staging**: `https://api-staging.yourdomain.com`
- **Production**: `https://api.yourdomain.com`

## CORS Configuration

The backend is configured with permissive CORS for development:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Production CORS

Update CORS configuration for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://www.yourdomain.com",
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
```

## Deployment

### Option 1: Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Option 2: Render

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt && pip install -r backend/requirements.txt`
4. Set start command: `cd backend && python -m uvicorn api:app --host 0.0.0.0 --port 8000`

### Option 3: Vercel + External Backend

**Backend (FastAPI on Render/Railway)**:
- Deploy backend separately
- Use backend URL in Vercel environment variables

**Frontend (Next.js on Vercel)**:
```
NEXT_PUBLIC_API_URL=https://your-backend.render.com
```

### Option 4: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t cognitive-engine-backend .
docker run -p 8000:8000 cognitive-engine-backend
```

## Troubleshooting

### Connection Issues

**Frontend can't reach backend**:
- Check `NEXT_PUBLIC_API_URL` in `ui/.env.local`
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Ensure firewall allows connections to port 8000

### API Errors

**500 Internal Server Error**:
- Check backend terminal for error messages
- Verify agent dependencies are installed: `pip install langchain langgraph langchain-community`
- Check `.env` file in project root for API keys (MISTRAL_API_KEY, TAVILY_API_KEY)

**CORS Errors**:
- Browser blocks requests due to CORS
- Ensure backend has CORS middleware configured
- Check allowed origins match frontend URL

### Performance Issues

- Backend processing takes long time: Agent might be making external API calls
- Check Tavily API rate limits
- Monitor backend logs for bottlenecks

## Development Tips

### Testing the API

Using curl:

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about AI"}'
```

Using Python:

```python
import requests

response = requests.post(
    "http://localhost:8000/chat",
    json={"message": "Tell me about AI"}
)
print(response.json())
```

### Monitoring

View API docs while running:
- Navigate to http://localhost:8000/docs
- Try API endpoints directly from browser
- View response schema and examples

### Debugging

Enable debug logging in `api.py`:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Architecture

```
React Frontend (Next.js)
        ↓
CORS-enabled FastAPI Backend
        ↓
LangGraph Workflow
  ├─ Planner Node
  ├─ Executor Node (loops until done)
  └─ Synthesizer Node
        ↓
LangChain + Tools
  ├─ Mistral AI (LLM)
  ├─ Tavily Search (Web Search)
  └─ File System Tools
```

## Environment Variables

### Backend (.env)

```env
BACKEND_HOST=0.0.0.0          # Server host
BACKEND_PORT=8000             # Server port
ENVIRONMENT=development       # development | staging | production
```

### Frontend (ui/.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000    # Backend URL
```

### Root Project (.env)

```env
MISTRAL_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

## API Response Data Flow

```
User Message
    ↓
/chat POST endpoint
    ↓
LangGraph Agent Execution
    ├─ Planner creates task plan
    ├─ Executor runs tasks iteratively
    └─ Synthesizer combines results
    ↓
ChatResponse JSON
    ├─ response: final report
    ├─ goal: original request
    ├─ currentTask: last executed task
    ├─ thinking: processing info
    ├─ confidence: 0-100 confidence score
    ├─ progress: 0-100 completion %
    └─ tools: list of tools used
    ↓
Frontend Updates Zustand Store
    ├─ Adds assistant message to chat
    ├─ Updates cognitive panel with live data
    └─ Displays progress indicators
```

## Production Checklist

- [ ] Update CORS origins for production domain
- [ ] Set `ENVIRONMENT=production` in backend .env
- [ ] Use environment variables for all secrets (API keys)
- [ ] Enable HTTPS for all connections
- [ ] Set up error logging and monitoring
- [ ] Add rate limiting to `/chat` endpoint
- [ ] Test with production-like data volumes
- [ ] Set up database for persistent state (optional)
- [ ] Configure auto-scaling if needed
- [ ] Set up CI/CD pipeline

## Performance Optimization

- Backend response time depends on agent complexity
- Consider caching frequently asked questions
- Monitor token usage and API call counts
- Implement request queuing for high load
- Use streaming responses for large outputs (future enhancement)

## License

MIT

## Support

For issues or questions:
1. Check API documentation at `/docs`
2. Review backend logs in terminal
3. Check frontend console for errors
4. Verify environment variables are set correctly
