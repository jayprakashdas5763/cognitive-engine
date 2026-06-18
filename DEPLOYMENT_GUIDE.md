# Deployment Guide

Complete instructions for deploying the Autonomous Cognitive Engine to production.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
   - [Vercel + Render](#vercel--render)
   - [Railway](#railway)
   - [Heroku](#heroku)
   - [AWS](#aws)
4. [Production Checklist](#production-checklist)
5. [Monitoring & Maintenance](#monitoring--maintenance)

## Local Development Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- Git
- Mistral API key
- Tavily API key

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd autonomous-cognitive-engine
```

### Step 2: Set Up Environment Variables

```bash
# Create root .env file
cat > .env << 'EOF'
MISTRAL_API_KEY=your_mistral_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
EOF
```

### Step 3: Install Dependencies

```bash
# Install Python dependencies (root)
pip install -r requirements.txt

# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
cd ui
npm install
cd ..
```

### Step 4: Set Up Frontend Environment

```bash
# In ui directory
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

### Step 5: Run Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd ui
npm run dev
```

**Terminal 3 (Optional) - Streamlit**:
```bash
streamlit run app.py
```

### Access Points

- React Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Streamlit: http://localhost:8501

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Quick Start with Docker Compose

```bash
# Clone repository
git clone <repository-url>
cd autonomous-cognitive-engine

# Create .env file
cat > .env << 'EOF'
MISTRAL_API_KEY=your_mistral_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
ENVIRONMENT=development
EOF

# Start services
docker-compose up

# In another terminal, verify services are running
curl http://localhost:8000/health
curl http://localhost:3000
```

### Using Docker Directly

#### Build Backend Image

```bash
docker build -f Dockerfile.backend -t cognitive-engine-backend .
docker run -p 8000:8000 \
  -e MISTRAL_API_KEY=your_key \
  -e TAVILY_API_KEY=your_key \
  cognitive-engine-backend
```

#### Build Frontend Image

```bash
cd ui
docker build -t cognitive-engine-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  cognitive-engine-frontend
```

### Docker Compose for Production

Update `docker-compose.yml` for production:

```yaml
version: '3.8'

services:
  backend:
    image: cognitive-engine-backend:latest
    restart: always
    environment:
      - ENVIRONMENT=production
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
      - TAVILY_API_KEY=${TAVILY_API_KEY}
    ports:
      - "8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: cognitive-engine-frontend:latest
    restart: always
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

Deploy:
```bash
docker-compose up -d
```

## Cloud Deployment

### Vercel + Render

This setup deploys the frontend on Vercel (free) and backend on Render (free tier available).

#### Step 1: Deploy Backend to Render

1. **Create Render Account**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Choose Python environment

3. **Configure Service**:
   - Name: `cognitive-engine-backend`
   - Environment: `Python 3.11`
   - Build command: `pip install -r requirements.txt && pip install -r backend/requirements.txt`
   - Start command: `cd backend && python -m uvicorn api:app --host 0.0.0.0 --port 8000`

4. **Set Environment Variables**:
   - MISTRAL_API_KEY: `your_key`
   - TAVILY_API_KEY: `your_key`
   - ENVIRONMENT: `production`

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (~5-10 minutes)
   - Get backend URL: `https://cognitive-engine-backend.onrender.com`

#### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**:
   - Click "New Project"
   - Select GitHub repository
   - Set root directory: `ui`

3. **Configure Project**:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

4. **Set Environment Variables**:
   - NEXT_PUBLIC_API_URL: `https://cognitive-engine-backend.onrender.com`

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (~5 minutes)
   - Get frontend URL: `https://your-project.vercel.app`

#### Step 3: Update Backend CORS

Update `backend/api.py` CORS configuration:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",
        "https://www.your-project.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
```

### Railway

Railway offers free tier with $5/month credits.

#### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

#### Step 2: Add Services

**Backend**:
- Add service from repository
- Set service name: `backend`
- Variables:
  - PORT: `8000`
  - MISTRAL_API_KEY: `your_key`
  - TAVILY_API_KEY: `your_key`
  - ENVIRONMENT: `production`
- Start command: `cd backend && python -m uvicorn api:app --host 0.0.0.0 --port $PORT`

**Frontend**:
- Add service from repository
- Set service name: `frontend`
- Root directory: `ui`
- Variables:
  - NEXT_PUBLIC_API_URL: `https://backend-url-from-railway.railway.app`

#### Step 3: Deploy

- Railway automatically deploys on push
- Monitor deployments in dashboard

### Heroku (Deprecated but still available)

Note: Heroku discontinued free tier. Use Render or Railway instead.

### AWS

#### Option 1: Elastic Container Service (ECS)

1. **Create ECR Repositories**:
```bash
aws ecr create-repository --repository-name cognitive-engine-backend
aws ecr create-repository --repository-name cognitive-engine-frontend
```

2. **Build and Push Images**:
```bash
# Backend
docker build -f Dockerfile.backend -t cognitive-engine-backend .
docker tag cognitive-engine-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/cognitive-engine-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/cognitive-engine-backend:latest

# Frontend
cd ui
docker build -t cognitive-engine-frontend .
docker tag cognitive-engine-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/cognitive-engine-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/cognitive-engine-frontend:latest
```

3. **Create ECS Cluster**:
```bash
aws ecs create-cluster --cluster-name cognitive-engine
```

4. **Create Task Definitions and Services**:
   - Use AWS Console or CloudFormation
   - Configure container definitions
   - Set environment variables
   - Map ports

#### Option 2: EC2

1. **Launch EC2 Instance**:
   - Ubuntu 22.04 LTS
   - Security group: Allow ports 80, 443, 3000, 8000

2. **Install Docker**:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo usermod -aG docker $USER
```

3. **Clone and Deploy**:
```bash
git clone <repository-url>
cd autonomous-cognitive-engine
sudo docker-compose up -d
```

#### Option 3: Lambda + API Gateway

For serverless deployment (complex setup):
- Use AWS SAM for backend
- CloudFront for frontend
- API Gateway for routing
- RDS for persistence (if needed)

## Production Checklist

### Security

- [ ] Use HTTPS everywhere
- [ ] Generate strong API keys
- [ ] Store secrets in environment variables (not code)
- [ ] Enable CORS for specific domains only
- [ ] Add rate limiting to API endpoints
- [ ] Implement request validation
- [ ] Use security headers (HTTPS, CSP, X-Frame-Options)
- [ ] Enable CORS to specific frontend domain

### Performance

- [ ] Enable caching headers
- [ ] Use CDN for frontend assets
- [ ] Optimize Docker images (use alpine)
- [ ] Enable database connection pooling
- [ ] Monitor API response times
- [ ] Set up auto-scaling

### Reliability

- [ ] Set up health checks
- [ ] Configure auto-restart policies
- [ ] Create database backups
- [ ] Implement error handling and logging
- [ ] Set up uptime monitoring
- [ ] Create runbooks for common issues

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Enable application logging
- [ ] Monitor resource usage
- [ ] Track API usage metrics
- [ ] Set up alerts for failures

### Code Quality

- [ ] Enable TypeScript strict mode
- [ ] Run linting checks
- [ ] Run unit tests
- [ ] Set up CI/CD pipeline
- [ ] Code review process
- [ ] Update dependencies regularly

## Monitoring & Maintenance

### Logging

**Backend Logs**:
```bash
# Docker Compose
docker-compose logs backend -f

# Docker
docker logs container-name -f
```

**Frontend Logs**:
```bash
# Browser console (F12)
# Vercel dashboard for production logs
```

### Health Checks

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000
```

### Debugging

**Backend Issues**:
```bash
# Check if service is running
docker ps

# View logs
docker logs <container-id> -f

# Enter container
docker exec -it <container-id> /bin/bash
```

**Frontend Issues**:
- Check browser console (F12)
- Check network tab
- Verify API URL in environment variables
- Check CORS errors

### Updating

**Update Backend Code**:
```bash
cd backend
git pull
docker-compose up -d --build backend
```

**Update Frontend Code**:
```bash
cd ui
git pull
docker-compose up -d --build frontend
```

### Scaling

**Vertical Scaling** (more powerful machine):
- Increase instance size
- Increase resources

**Horizontal Scaling** (multiple instances):
- Use load balancer
- Deploy multiple backend/frontend instances
- Use managed database

### Cost Optimization

- **Render**: ~$5-15/month for paid tier
- **Vercel**: Free for frontend, pay for overage
- **Railway**: ~$5-50/month depending on usage
- **AWS**: Variable, use calculator for estimates

## Troubleshooting Deployment

### Backend not starting

```bash
# Check logs
docker logs cognitive-engine-backend

# Common issues:
# - Missing environment variables: Add MISTRAL_API_KEY and TAVILY_API_KEY
# - Port already in use: Change port in docker-compose.yml
# - Dependencies missing: Rebuild image
```

### Frontend can't connect to backend

```
# Check NEXT_PUBLIC_API_URL
# Should be: https://your-backend-url (in production)

# Check CORS headers
curl -H "Origin: https://your-frontend-url" \
     -H "Access-Control-Request-Method: POST" \
     https://your-backend-url/chat
```

### API responses slow

- Check Mistral API status
- Check Tavily API rate limits
- Add caching layer
- Optimize LangGraph workflow
- Increase backend resources

### High memory usage

- Check Docker memory limits
- Optimize agent task planning
- Clear old logs/cache
- Monitor with `docker stats`

## Security Best Practices

1. **Never commit secrets to Git**:
   - Use `.env` files (in .gitignore)
   - Use environment variable secrets in CI/CD

2. **API Key Management**:
   - Rotate keys regularly
   - Use service-specific keys
   - Monitor API usage

3. **CORS Configuration**:
   - Restrict to specific domains
   - Use only POST/GET for API
   - Validate requests

4. **Rate Limiting**:
   ```python
   from slowapi import Limiter
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   
   @app.post("/chat")
   @limiter.limit("10/minute")
   async def chat(request: ChatRequest):
       ...
   ```

5. **HTTPS Everywhere**:
   - Use SSL/TLS certificates
   - Force HTTPS redirects
   - Use secure cookies

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://railway.app/docs
- **Docker Docs**: https://docs.docker.com
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Next.js Docs**: https://nextjs.org/docs

## Next Steps

1. Choose deployment platform (Render + Vercel recommended)
2. Set up git repository
3. Follow platform-specific instructions
4. Monitor and maintain production environment
5. Iterate based on usage metrics
