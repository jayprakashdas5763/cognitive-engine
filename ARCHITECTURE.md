# System Architecture & Design

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Browser (Client Layer)                     │
└─────────────────────────┬───────────────────────────────────────────────┘
                          │ HTTP/HTTPS
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │ React UI │   │Streamlit │   │  Mobile  │
    │(Next.js) │   │   App    │   │   App    │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │               │              │
         └───────────────┼──────────────┘
                         │ POST /chat + GET /health
                         ↓
    ┌────────────────────────────────────────────┐
    │      FastAPI Backend (Application Layer)   │
    │  ┌──────────────────────────────────────┐  │
    │  │   - CORS Middleware                  │  │
    │  │   - POST /chat endpoint              │  │
    │  │   - GET /health endpoint             │  │
    │  │   - Error handling & validation      │  │
    │  └──────────────────────────────────────┘  │
    └────┬─────────────────────────────────────┘
         │ graph.invoke(state)
         ↓
    ┌────────────────────────────────────────────┐
    │    LangGraph Workflow (Agent Layer)        │
    │  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
    │  │ Planner  │→ │ Executor │→ │Synthesiz│ │
    │  │  Node    │  │  Node    │  │ Node    │ │
    │  └──────────┘  └──────────┘  └─────────┘ │
    │     ↓              ↓              ↓       │
    │   Break      Execute &      Combine      │
    │   Goals      Loop Tasks     Results      │
    └────┬─────────────────────────────────────┘
         │
    ┌────┴────┬──────────┬────────────┐
    ↓         ↓          ↓            ↓
┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐
│ Mistral │ │  Tavily  │ │ LangChain│ │  File  │
│   LLM   │ │  Search  │ │  Tools   │ │ System │
└─────────┘ └──────────┘ └──────────┘ └────────┘
   (LLM)     (Web API)    (Utilities)  (Memory)
```

## Component Breakdown

### 1. Client Layer

#### React Frontend (Next.js)
- **Technology**: React 18, Next.js 14, TypeScript
- **State Management**: Zustand
- **UI Components**: Custom + Lucide icons
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS

**Key Components**:
- `ChatArea`: Main chat interface with input/output
- `CognitivePanel`: Real-time metrics display
- `Header`: Top navigation
- `Sidebar`: Navigation menu

#### Streamlit Frontend
- **Technology**: Streamlit (Python)
- **Purpose**: Simple, quick CLI interface
- **State**: Session state management
- **Output**: Text, metrics, downloads

### 2. API Layer (FastAPI)

```python
FastAPI Application
├── /chat (POST)
│   ├── Request: { message: string }
│   ├── Response: ChatResponse
│   └── Action: Invoke agent
├── /health (GET)
│   ├── Response: { status: "healthy" }
│   └── Action: Health check
├── /docs (GET)
│   ├── Response: Swagger UI
│   └── Action: Interactive API docs
└── /redoc (GET)
    ├── Response: ReDoc UI
    └── Action: Alternative API docs
```

**Middleware**:
- CORS (for cross-origin requests)
- Error handling
- Request validation (Pydantic)

### 3. Agent Layer (LangGraph)

```
┌─────────────────────────────────────────┐
│        LangGraph State Machine           │
└─────────────────────────────────────────┘
           ↓
      START STATE
           ↓
    ┌──────────────┐
    │    PLANNER   │
    │ - Parse goal │
    │ - Create     │
    │   tasks      │
    │ - Set todos  │
    └────┬─────────┘
         ↓
    ┌──────────────┐
    │   EXECUTOR   │ ← Loops until all done
    │ - Get task   │
    │ - Delegate   │
    │ - Run tools  │
    │ - Mark done  │
    └────┬─────────┘
         ↓ (all tasks done)
    ┌──────────────┐
    │ SYNTHESIZER  │
    │ - Read files │
    │ - Combine    │
    │   results    │
    │ - Final      │
    │   report     │
    └────┬─────────┘
         ↓
      END STATE
```

### 4. Tool Integration

#### Mistral LLM
- **Purpose**: Language understanding & generation
- **Used by**: Planner, Executor, Synthesizer
- **Models**: mistral-large, mistral-medium
- **API**: LangChain integration

#### Tavily Search
- **Purpose**: Web search for research
- **Used by**: Executor (via delegation)
- **Queries**: Search terms from tasks
- **API**: Tavily Python SDK

#### File System
- **Purpose**: Store intermediate results
- **Mechanism**: In-memory dict in state
- **Used by**: Executor (write), Synthesizer (read)

## Data Flow Sequences

### 1. User Request to Agent Response

```
1. User enters goal in UI
   ↓
2. UI creates ChatRequest: { message: "goal" }
   ↓
3. Fetch POST /chat
   ↓
4. Backend receives request
   ↓
5. Create AgentState:
   {
     messages: ["goal"],
     todos: [],
     current_task: "",
     files: {},
     results: []
   }
   ↓
6. graph.invoke(state)
   ↓
7. Planner Node:
   - Get goal from messages[-1]
   - Call Mistral to create tasks
   - Add todos to state
   ↓
8. Executor Node (loop):
   a. Find pending task
   b. Call delegate(task)
   c. Tool execution (search, etc.)
   d. Write result to file
   e. Mark task done
   f. Break, loop, or continue
   ↓
9. Synthesizer Node:
   - Read all files from state
   - Combine into final_report.txt
   ↓
10. Return updated state
    ↓
11. Build ChatResponse:
    {
      response: final_report,
      goal: original_message,
      currentTask: last_executed_task,
      thinking: process_summary,
      confidence: calculated_score,
      progress: calculated_percent,
      tools: [list_of_tools]
    }
    ↓
12. Send response to frontend
    ↓
13. Frontend updates Zustand store
    ↓
14. UI re-renders with new data
```

### 2. State Transformation Pipeline

```
Initial State:
{
  messages: ["Research AI in 2024"],
  todos: [],
  current_task: "",
  files: {},
  results: []
}

After Planner:
{
  messages: ["Research AI in 2024"],
  todos: [
    { id: 1, description: "Search AI breakthroughs", status: "pending" },
    { id: 2, description: "Summarize findings", status: "pending" },
    { id: 3, description: "Create report", status: "pending" }
  ],
  current_task: "",
  files: {},
  results: []
}

After Executor (iteration 1):
{
  messages: ["Research AI in 2024"],
  todos: [
    { id: 1, description: "...", status: "done" },
    { id: 2, description: "...", status: "pending" },
    { id: 3, description: "...", status: "pending" }
  ],
  current_task: "task_1",
  files: {
    "task_1.txt": "Search results..."
  },
  results: ["Search results..."]
}

After Executor (iteration 2 & 3):
{
  messages: ["Research AI in 2024"],
  todos: [
    { id: 1, description: "...", status: "done" },
    { id: 2, description: "...", status: "done" },
    { id: 3, description: "...", status: "done" }
  ],
  current_task: "task_3",
  files: {
    "task_1.txt": "...",
    "task_2.txt": "...",
    "task_3.txt": "..."
  },
  results: ["...", "...", "..."]
}

After Synthesizer:
{
  messages: ["Research AI in 2024"],
  todos: [all done],
  current_task: "task_3",
  files: {
    "task_1.txt": "...",
    "task_2.txt": "...",
    "task_3.txt": "...",
    "final_report.txt": "Combined results..."
  },
  results: ["...", "...", "..."]
}
```

## Request/Response Structure

### POST /chat

**Request**:
```json
{
  "message": "Research the latest AI breakthroughs and create a summary"
}
```

**Response** (Success - 200):
```json
{
  "response": "# AI Breakthroughs 2024\n\n## Overview\n...",
  "goal": "Research the latest AI breakthroughs and create a summary",
  "currentTask": "Synthesis: Compiling research into final report",
  "thinking": "Processed 8 tasks successfully. All research topics covered.",
  "confidence": 92,
  "progress": 100,
  "tools": ["Planner", "Executor", "Synthesizer", "Web Search", "LLM"]
}
```

**Response** (Error - 500):
```json
{
  "detail": "Error message describing what went wrong"
}
```

## Configuration & Environment

### Three-Tier Environment Variables

**Tier 1: Root `.env` (Agent/API Keys)**
```env
MISTRAL_API_KEY=sk-...
TAVILY_API_KEY=tvly-...
```

**Tier 2: Backend `backend/.env` (Server Config)**
```env
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
ENVIRONMENT=development
```

**Tier 3: Frontend `ui/.env.local` (Client Config)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment Architecture

### Local Development
```
Developer Machine
├── Terminal 1: python -m uvicorn backend.api:app --reload
├── Terminal 2: npm run dev (in ui/)
└── Browser: http://localhost:3000
```

### Docker Compose
```
Docker Host
├── Backend Container (8000)
├── Frontend Container (3000)
└── Shared Network: cognitive-network
```

### Cloud - Vercel + Render
```
Vercel (Frontend)           Render (Backend)
├── Next.js Build      └── FastAPI App
├── Edge Network           └── GPU/CPU Resources
└── CDN                     └── Auto Scaling
```

### Cloud - Railway
```
Railway Dashboard
├── Backend Service (auto-deployed on push)
├── Frontend Service (auto-deployed on push)
├── Environment Variables
└── Monitoring & Logs
```

## Performance Characteristics

### Response Time Breakdown

```
Total: ~10-30 seconds (depends on agent complexity)

1. Network latency: ~100-500ms
2. Backend processing:
   - Planner node: ~2-5s (LLM call)
   - Executor loop (per task): ~3-10s
     - Task delegation: ~1-2s
     - Tool execution: ~2-8s
       - Web search: ~1-5s
       - LLM processing: ~1-3s
   - Synthesizer node: ~1-2s
3. Response serialization: ~50-100ms
```

### Memory Usage

```
Backend: ~200-500MB
- FastAPI framework: ~50MB
- LangGraph: ~30MB
- Agent state: ~50-100MB (varies)
- LLM client: ~50MB
- Web search client: ~20MB

Frontend: ~50-100MB (typical)
- React/Next.js: ~30MB
- Dependencies: ~20-50MB
- State: ~5MB
```

## Security Considerations

### 1. API Security
- ✅ HTTPS in production
- ✅ CORS restricted by domain
- ✅ Request validation (Pydantic)
- ✅ Rate limiting (optional)
- ✅ Error messages don't leak internals

### 2. Authentication (Future)
- JWT tokens for API
- User sessions
- API key management

### 3. Data Security
- No sensitive data in logs
- Environment variables for secrets
- Database encryption (if added)
- HTTPS everywhere

### 4. Infrastructure Security
- VPC for backend
- Security groups for ports
- DDoS protection (CDN)
- Regular updates

## Scaling Strategy

### Horizontal Scaling
```
Load Balancer
├── Backend Instance 1 (8000)
├── Backend Instance 2 (8001)
├── Backend Instance 3 (8002)
└── Shared Database (future)
```

### Vertical Scaling
```
Upgrade Instance:
- More CPU cores
- More RAM
- GPU for LLM (optional)
```

### Agent Optimization
```
1. Cache task results
2. Batch multiple queries
3. Parallel task execution
4. Optimize LLM prompts
5. Reduce tool calls
```

## Monitoring & Observability

### Metrics to Track
```
Backend:
- Request latency (p50, p95, p99)
- Error rate
- CPU usage
- Memory usage
- API call counts
- Database connections

Frontend:
- Page load time
- Time to interactive
- API call success rate
- User interactions
- Error tracking

Agent:
- Task execution time
- Tool call frequency
- Token usage
- Model call costs
```

### Logging Strategy
```
Levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

Logs capture:
- Request/response
- Error stack traces
- Performance metrics
- External API calls
- Agent decisions

Storage: File/Cloud (CloudWatch, Datadog, etc.)
```

## Error Handling Strategy

```
Client Layer:
└── try/catch in fetch
    └── Show error message to user
    └── Log to console
    └── Update Zustand error state

API Layer:
└── HTTPException with status code
    └── Include error detail
    └── Log to backend
    └── Return JSON error

Agent Layer:
└── Exception in node
    └── Propagate to API
    └── API catches and formats
    └── Return to client
```

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic agent execution
- ✅ Real-time UI updates
- ✅ Single backend instance

### Phase 2 (Next)
- [ ] Streaming responses (SSE/WebSocket)
- [ ] Message persistence (database)
- [ ] User authentication
- [ ] Conversation history

### Phase 3 (Advanced)
- [ ] Multi-user support
- [ ] Collaborative features
- [ ] Custom agent configuration
- [ ] Advanced analytics

### Phase 4 (Enterprise)
- [ ] Multi-tenancy
- [ ] White-label solution
- [ ] Advanced security
- [ ] SLA guarantees

## Technology Stack Summary

### Backend
- **Framework**: FastAPI (Python web framework)
- **Server**: Uvicorn (ASGI server)
- **Agent**: LangGraph (workflow orchestration)
- **LLM**: LangChain + Mistral AI
- **Tools**: Tavily (web search)
- **Validation**: Pydantic

### Frontend
- **Framework**: Next.js 14 (React meta-framework)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Development**: Local machine
- **Deployment**: Vercel (frontend) + Render (backend)
- **CI/CD**: GitHub Actions (optional)

### External Services
- **LLM**: Mistral AI (API)
- **Search**: Tavily (API)

## Conclusion

The system is designed for scalability, maintainability, and ease of deployment. The separation of concerns (client, API, agent) allows for independent evolution of each component. The choice of mature, well-supported technologies ensures long-term viability and community support.
