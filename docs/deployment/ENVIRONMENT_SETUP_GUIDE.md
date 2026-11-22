# MarketScope.io — Environment Setup Guide

## 1. Prerequisites

Ensure you have the following installed on your development workstation:
- **Python 3.11+**
- **Node.js 20.x LTS** & **npm 10+**
- **Git**
- Optional: **Docker Desktop** (for local PostgreSQL and Redis)

---

## 2. Local Development Setup (Quickstart)

### Step 1: Clone Repository
```bash
git clone https://github.com/parth/MarketScope.io.git
cd "MarketScope.io"
```

### Step 2: Configure Environment Files
```bash
# Copy backend template
cp .env.development.example .env

# Copy frontend template
cp apps/web/.env.local.example apps/web/.env.local
```

### Step 3: Setup Backend Environment
```bash
cd apps/api
python -m venv .venv

# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cd ../..
```

### Step 4: Setup Frontend Environment
```bash
cd apps/web
npm install
cd ../..
```

### Step 5: Start Development Servers
In Terminal 1 (Backend):
```bash
cd apps/api
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

In Terminal 2 (Frontend):
```bash
cd apps/web
npm run dev
```

Visit `http://localhost:3000` in your browser. The backend API is available at `http://localhost:8000/docs`.

---

## 3. Production Deployment Configuration

### A. Render (Backend)
1. Go to **Dashboard $\rightarrow$ marketscope-api $\rightarrow$ Environment**.
2. Add all variables listed in `docs/deployment/RENDER_DEPLOYMENT_AUDIT.md`.
3. Set `DATABASE_URL` to your Neon direct SSL connection string.
4. Set `CORS_ORIGINS` to `https://marketscope-web.vercel.app,https://marketscope.io`.
5. Trigger manual deploy: **Manual Deploy $\rightarrow$ Deploy latest commit**.

### B. Vercel (Frontend)
1. Go to **Vercel Project Dashboard $\rightarrow$ Settings $\rightarrow$ Environment Variables**.
2. Add all variables listed in `docs/deployment/VERCEL_DEPLOYMENT_AUDIT.md`.
3. Set `NEXT_PUBLIC_API_BASE_URL` to `https://marketscope-api.onrender.com`.
4. Deploy latest git commit.
