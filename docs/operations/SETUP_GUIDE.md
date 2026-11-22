# MarketScope.io — Local Setup & Development Guide

## 1. Prerequisites
- **Node.js**: v20+ or v22 LTS
- **Python**: v3.12+ (tested up to 3.15)
- **Git**: Latest version
- **Database**: PostgreSQL 15+ (local or Neon serverless instance)

---

## 2. Step-by-Step Installation

### Step A: Clone & Environment Setup
```bash
git clone https://github.com/parth022002/MarketScope.io.git
cd "MarketScope.io Code"

# Copy environment template
cp .env.example .env
```

### Step B: Backend Setup (FastAPI)
```bash
cd apps/api

# Create and activate Python virtual environment
python -m venv .venv

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is now accessible at `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.

### Step C: Frontend Setup (Next.js 15)
Open a new terminal window:
```bash
cd apps/web

# Install npm dependencies
npm install

# Start Next.js development server
npm run dev
```
The web application is now accessible at `http://localhost:3000`.

---

## 3. Running Automated Tests
```bash
# Run backend pytest suite from root
apps/api/.venv/Scripts/python.exe -m pytest apps/api/tests/ -v

# Run frontend typecheck and build
cd apps/web
npm run typecheck
npm run build
```
