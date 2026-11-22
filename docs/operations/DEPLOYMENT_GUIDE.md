# MarketScope.io — Deployment Guide (Render, Docker, Neon)

## 1. Render Deployment Architecture
MarketScope.io is designed for turnkey automated deployment on **Render** using either:
1. **Render Blueprint (`render.yaml`)**: Automatically provisions both the FastAPI backend and Next.js frontend services.
2. **Individual Render Web Services**: Configured manually in the Render Dashboard.

---

## 2. Deploying Backend API (`marketscope-api`)

### Option A: Using Docker (Recommended)
- **Service Type**: Web Service
- **Runtime**: Docker
- **Docker Context**: `./apps/api`
- **DockerfilePath**: `./apps/api/Dockerfile`
- **Health Check Path**: `/health`

### Option B: Using Native Python Runtime
- **Service Type**: Web Service
- **Runtime**: Python 3
- **Root Directory**: `apps/api` (or empty if using root `Procfile`)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`
- **Health Check Path**: `/health`

### Required Environment Variables for Backend:
- `APP_ENV`: `production`
- `DATABASE_URL`: Your Neon PostgreSQL connection string with `sslmode=require`.
- `SECRET_KEY`: High-entropy random 32+ character string.
- `TWELVEDATA_API_KEY`: Your TwelveData API key.
- `FMP_API_KEY`: Your FMP API key.
- `CLERK_SECRET_KEY`: Your Clerk Secret Key.

---

## 3. Deploying Frontend Web (`marketscope-web`)
- **Service Type**: Web Service
- **Runtime**: Node
- **Root Directory**: `apps/web`
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start`
- **Health Check Path**: `/`

### Required Environment Variables for Frontend:
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_BASE_URL`: Full URL of your deployed `marketscope-api` (e.g. `https://marketscope-api.onrender.com`).
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
- `CLERK_SECRET_KEY`: Your Clerk secret key.
