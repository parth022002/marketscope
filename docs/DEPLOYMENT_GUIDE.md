# MarketScope.io — Deployment & Operations Guide

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Status:** Approved Operational Blueprint  
**Target Environments:** Local Dev, Cloud Staging, Production

---

## 1. Environments Overview

| Environment | Frontend Host | Backend API Host | Database | Cache | Auth Mode | Purpose |
|---|---|---|---|---|---|---|
| **Local Dev** | Node.js (`localhost:3000`) | Uvicorn (`localhost:8000`) | Local PostgreSQL (Docker) | Local Redis (Docker) | Mock Bypass (`MOCK_AUTH_ENABLED=true`) | Rapid feature iteration without external dependencies |
| **Cloud Staging** | Vercel (Preview Branch) | Render / Neon Compute / Fly.io | Neon Serverless (Branch DB) | Upstash Redis (Staging) | Clerk Dev Tenant | Pre-release QA, stakeholder review, cross-tenant testing |
| **Production** | Vercel (`marketscope.io`) | Dedicated Container / Cloud VM | Neon Production (Multi-AZ) | Upstash Redis (Prod) | Clerk Production Tenant (MFA) | General availability for verified researchers |

---

## 2. Local Development Quickstart

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- Python 3.11+
- Docker & Docker Compose (for local PostgreSQL and Redis)

### Step 1: Clone and Configure Environment
```bash
# In repository root:
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

### Step 2: Start Background Infrastructure (PostgreSQL & Redis)
```bash
docker-compose up -d db redis
```
This launches:
- PostgreSQL 16 on `localhost:5432` with database `marketscope`.
- Initializes schema automatically via `./database/schema/001_initial.sql`.
- Redis on `localhost:6379`.

### Step 3: Start the Backend API
```bash
cd apps/api
# Create virtual environment:
python -m venv .venv
# Activate virtual environment (Windows PowerShell):
.venv\Scripts\Activate.ps1
# (Linux/macOS: source .venv/bin/activate)

pip install -r requirements.txt
pip install -r requirements-dev.txt

# Run FastAPI server with auto-reload:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API is accessible at `http://localhost:8000`. OpenAPI docs available at `http://localhost:8000/docs`.

### Step 4: Start the Frontend Application
```bash
cd apps/web
npm install
npm run dev
```
Frontend is accessible at `http://localhost:3000`.

---

## 3. Database Migration Procedures

- Schema migrations are managed via **Alembic** in `apps/api`.
- Never modify existing production schema files directly; always generate a versioned migration.
```bash
# Create a new migration after model changes:
alembic revision --autogenerate -m "add_watchlist_table"

# Apply pending migrations:
alembic upgrade head

# Rollback one migration:
alembic downgrade -1
```

---

## 4. Staging & Production Deployment Checklist

1. [ ] **Environment Secrets:** Verify that all production secrets (`DATABASE_URL`, `CLERK_SECRET_KEY`, `SECRET_KEY`, `SNAPSHOT_SIGNING_SALT`) are configured in Vercel and backend host environment variables.
2. [ ] **Auth Mode:** Verify `MOCK_AUTH_ENABLED` is set to `false`.
3. [ ] **AI Gating:** Verify `AI_ENABLED` is set to `false`.
4. [ ] **CORS Configuration:** Verify `API_CORS_ORIGINS` is restricted strictly to `https://marketscope.io`.
5. [ ] **Database Connection Pooling:** Verify serverless environments use Neon's pooled connection string (`DATABASE_POOL_URL`).
6. [ ] **Health Check:** Confirm `GET /health` returns `200 OK` and database is connected.
7. [ ] **Audit Logging:** Confirm `audit_events` table is receiving operational logs.
