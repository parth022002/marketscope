# MarketScope.io — Production Deployment Guide

## 1. Overview

MarketScope.io utilizes a decoupled cloud architecture:
- **Frontend:** Hosted on Vercel Edge Network.
- **Backend:** Containerized FastAPI service hosted on Render.
- **Database:** Neon Serverless PostgreSQL with connection pooling.
- **Cache:** Upstash Redis (optional).

---

## 2. Vercel Deployment (Frontend)

### Setup Steps
1. Navigate to the **Vercel Dashboard** and click **"Add New Project"**.
2. Connect your GitHub repository (`MarketScope.io`).
3. Set the **Root Directory** to `apps/web`.
4. Configure the **Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `pnpm run build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
5. Configure Environment Variables in Project Settings:
   - `NEXT_PUBLIC_API_BASE_URL`: `https://marketscope-api.onrender.com`
   - `NEXT_PUBLIC_APP_URL`: `https://marketscope.io`
   - `NEXT_PUBLIC_APP_NAME`: `MarketScope.io`
   - `NEXT_PUBLIC_AI_ENABLED`: `true`
6. Click **Deploy**.

---

## 3. Render Deployment (Backend)

### Setup Steps
1. Navigate to the **Render Dashboard** and select **"New Web Service"**.
2. Connect your GitHub repository.
3. Choose **Docker** as the Environment runtime.
4. Set **Root Directory** to root or configure:
   - Dockerfile Path: `./Dockerfile` or `apps/api/Dockerfile`
   - Docker Context: `.`
5. Configure Instance Specifications:
   - Plan: Standard or Starter
   - Port: `10000` (Render binds to `0.0.0.0:${PORT}`)
6. Configure Environment Variables in the Environment tab:
   - `APP_ENV`: `production`
   - `APP_DEBUG`: `false`
   - `PORT`: `10000`
   - `SECRET_KEY`: `[Generated 64-char key]`
   - `DATABASE_URL`: `postgresql+psycopg://[user]:[password]@[host]/[dbname]?sslmode=require`
   - `CORS_ORIGINS`: `https://marketscope.io,https://www.marketscope.io,https://marketscope-web.vercel.app`
   - `TWELVEDATA_API_KEY`: `[TwelveData API Key]`
   - `FMP_API_KEY`: `[Financial Modeling Prep API Key]`
7. Click **Create Web Service**.

---

## 4. Local Development Docker Compose Setup

Run the full stack locally with one command:
```bash
docker-compose up --build
```
- Frontend will be available at: `http://localhost:3000`
- Backend API will be available at: `http://localhost:8000`
- Swagger Documentation: `http://localhost:8000/docs`
