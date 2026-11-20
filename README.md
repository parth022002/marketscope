# MarketScope.io — Financial Research & Intelligence Platform

> **An evidence-backed, research-first workspace for analyzing Indian listed companies.**  
> Built for investors, analysts, researchers, and students to discover companies, inspect canonical financial statements, understand metric calculations, verify source evidence, and maintain reproducible research records.

---

## 1. Product Mission & Boundaries

MarketScope.io is an **independent, decision-support and financial intelligence platform**.

### Core Product Principles
1. **Research-First:** Dedicated to fundamental analysis, valuation, and deep research, not high-frequency trading or speculative execution.
2. **Evidence-Backed Data:** Every financial fact and calculated metric is linked directly to official filings, report dates, and source providers.
3. **Deterministic & Transparent:** Zero black-box metrics. Every ratio displays its exact formula, input components, reporting period, and lineage.
4. **Reproducible Snapshots:** Research theses and financial states can be frozen into immutable, cryptographically verifiable snapshots.
5. **Strict Multi-Tenant Isolation:** User notes, custom watchlists, and research dossiers are strictly isolated by workspace.

### Strict Product Boundaries (What We Do Not Do)
- **No Brokerage Execution:** We do not connect to brokers or route stock orders.
- **No Custody of Funds:** We do not handle, hold, or transfer user funds.
- **No Automated Buy/Sell Advice:** We do not generate automated recommendations or guaranteed return predictions.
- **No Unlicensed Data Scraping:** We strictly enforce data rights and licensing agreements.

---

## 2. System Architecture

MarketScope.io is built as a **Modular Monolith** optimized for consistency, rapid development, and operational maintainability:

```
+───────────────────────────────────────────────────────────────────+
|                    EXPERIENCE LAYER (Next.js 15)                  |
|   - React 19, TypeScript, Tailwind CSS, Inter Typography          |
|   - Midnight Theme (#07152B, #0B1D38, #087BEE, #16C8D5, #39E85B)  |
|   - Discovery, Research Dossier, Evidence Inspector, Snapshots    |
+───────────────────────────────────────────────────────────────────+
                                  │ HTTPS / REST
                                  ▼
+───────────────────────────────────────────────────────────────────+
|               APPLICATION / DOMAIN LAYER (FastAPI Monolith)       |
|   - Modular Service Architecture (Python 3.11+, Pydantic v2)      |
|   - Instrument Registry & Canonical Disambiguation                |
|   - Deterministic Financial Metric Engine                         |
|   - Workspace Isolation & Provider Rights Enforcement             |
|   - Gated AI Research Synthesis (Phase 5)                         |
+───────────────────────────────────────────────────────────────────+
                                  │ Connection Pool / Redis
                                  ▼
+───────────────────────────────────────────────────────────────────+
|                     DATA & STORAGE LAYER                          |
|   - PostgreSQL 16+ (Neon Serverless) — Relational System of Record|
|   - Redis (Upstash) — Cache & Rate Limiting                       |
|   - Cloudflare R2 — Access-Controlled Filing Storage              |
+───────────────────────────────────────────────────────────────────+
```

---

## 3. Repository Structure

```
MarketScope.io Code/
├── apps/
│   ├── api/                     # FastAPI backend modular monolith
│   │   ├── app/
│   │   │   ├── api/             # REST API routers & route handlers
│   │   │   ├── core/            # Config, security, database connection
│   │   │   ├── domain/          # Pydantic schemas, entities, DTOs
│   │   │   ├── engine/          # Deterministic metric & snapshot calculation engine
│   │   │   ├── providers/       # BaseProvider & MockProvider adapters
│   │   │   └── services/        # Workspace, notes, rights, audit services
│   │   ├── tests/               # Unit, golden calculation, API, and tenancy tests
│   │   ├── requirements.txt     # Production dependencies
│   │   └── requirements-dev.txt # Development & testing dependencies
│   └── web/                     # Next.js 15 App Router web application
│       ├── src/
│       │   ├── app/             # App router pages & layouts
│       │   ├── components/      # UI components (dossier, tables, evidence drawer)
│       │   └── lib/             # API client, utility functions, theme tokens
│       ├── package.json         # Node.js dependencies
│       └── tsconfig.json        # TypeScript configuration
├── database/
│   └── schema/
│       └── 001_initial.sql      # Initial 14-table PostgreSQL foundation DDL
├── config/
│   └── integrations.example.yaml# Non-secret provider metadata & rate limits
├── docs/                        # Complete engineering & product documentation
│   ├── PROJECT_DOCUMENTATION_INVENTORY.md
│   ├── REQUIREMENTS_TRACEABILITY_MATRIX.md
│   ├── USER_INPUT_AND_CONFIGURATION_GUIDE.md
│   ├── CONFIGURATION_STATUS.md
│   ├── TECHNICAL_DECISIONS.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY_IMPLEMENTATION.md
│   ├── TESTING_STRATEGY.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── IMPLEMENTATION_STATUS.md
├── docker-compose.yml           # Local development stack (PostgreSQL + Redis)
├── .env.example                 # Master environment variable template
├── CHANGELOG.md                 # Project version history
└── README.md                    # This document
```

---

## 4. Quickstart Guide (Local Development)

### 1. Configure Local Environment
```bash
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

### 2. Start PostgreSQL & Redis
```bash
docker-compose up -d db redis
```

### 3. Launch the Backend API
```bash
cd apps/api
python -m venv .venv
# On Windows:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API runs on [http://localhost:8000](http://localhost:8000). Interactive docs at [http://localhost:8000/docs](http://localhost:8000/docs).

### 4. Launch the Web Frontend
```bash
cd apps/web
npm install
npm run dev
```
Web frontend runs on [http://localhost:3000](http://localhost:3000).

---

## 5. Master Documentation Index

- **Project Inventory & Authority:** [docs/PROJECT_DOCUMENTATION_INVENTORY.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/PROJECT_DOCUMENTATION_INVENTORY.md)
- **Requirements Traceability Matrix:** [docs/REQUIREMENTS_TRACEABILITY_MATRIX.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/REQUIREMENTS_TRACEABILITY_MATRIX.md)
- **User Input & Configuration Guide:** [docs/USER_INPUT_AND_CONFIGURATION_GUIDE.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/USER_INPUT_AND_CONFIGURATION_GUIDE.md)
- **Configuration Status Tracker:** [docs/CONFIGURATION_STATUS.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/CONFIGURATION_STATUS.md)
- **Architecture Decision Records (ADRs):** [docs/TECHNICAL_DECISIONS.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/TECHNICAL_DECISIONS.md)
- **System Architecture Blueprint:** [docs/ARCHITECTURE.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/ARCHITECTURE.md)
- **Database Schema & Entity Models:** [docs/DATABASE_SCHEMA.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/DATABASE_SCHEMA.md)
- **REST API Contracts:** [docs/API_DOCUMENTATION.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/API_DOCUMENTATION.md)
- **Security & Privacy Implementation:** [docs/SECURITY_IMPLEMENTATION.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/SECURITY_IMPLEMENTATION.md)
- **Testing & QA Strategy:** [docs/TESTING_STRATEGY.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/TESTING_STRATEGY.md)
- **Deployment & Runbooks:** [docs/DEPLOYMENT_GUIDE.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/DEPLOYMENT_GUIDE.md)
- **Implementation Status:** [docs/IMPLEMENTATION_STATUS.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/docs/IMPLEMENTATION_STATUS.md)
