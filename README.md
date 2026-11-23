# MarketScope.io — Institutional Financial Intelligence & Quantitative Research Platform

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen.svg)](https://github.com/parth1511/marketscope/actions)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue?logo=python)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?logo=postgresql)](https://neon.tech)
[![Tests Passing](https://img.shields.io/badge/Tests-148%2F148_Passing-success)](tests/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

MarketScope.io is an AI-powered financial intelligence, quantitative factor modeling, and multi-asset research terminal engineered for institutional hedge funds, equity research analysts, quantitative developers, and active market participants.

The platform bridges real-time exchange feeds, multi-decade balance sheet fundamentals, interactive technical indicators, proprietary quantitative scoring, and grounded AI copilot intelligence into a unified, ultra-responsive workspace.

---

## 📸 Platform Interface & Live Visuals

| Overview Dashboard | Markets Hub |
| :---: | :---: |
| ![Overview Dashboard](docs/assets/screenshots/02-overview.png) | ![Markets Hub](docs/assets/screenshots/03-markets.png) |

| Stock Research Dossier | Pro Charting Terminal |
| :---: | :---: |
| ![Stock Research Dossier](docs/assets/screenshots/06-company-research.png) | ![Pro Charting Terminal](docs/assets/screenshots/07-advanced-charts.png) |

| Q-Intelligence Quantitative Ensemble | AI Financial Assistant |
| :---: | :---: |
| ![Q-Intelligence](docs/assets/screenshots/09-q-intelligence.png) | ![AI Assistant](docs/assets/screenshots/10-ai-research.png) |

---

## ⚡ Core Capabilities

- **Institutional Market Ticker & Streaming Feeds:** Real-time benchmark quotes (NIFTY 50, SENSEX, NIFTY BANK, NASDAQ, S&P 500) synchronized via WebSocket broadcaster and backed by persistent storage in Neon PostgreSQL.
- **Stock Research Dossier:** 10-year audited financial statement models (Income Statement, Balance Sheet, Cash Flow), segment disclosures, peer multiples, and DuPont return decomposition.
- **Pro Charting Terminal:** Interactive OHLCV candlesticks with multi-interval aggregation (1m to 1d), technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands, ATR, Supertrend), user drawings, and layout persistence.
- **Q-Intelligence Scoring Engine:** Proprietary multi-factor scoring model synthesizing Fundamental Quality (35%), Growth Momentum (25%), Technical Trend (20%), and Sentiment (20%) into a normalized 0–100 percentile score.
- **AI Research Assistant:** Autonomous research copilot grounded in live company filings and financial metrics with strict citation attribution and PII privacy filters.
- **Virtual Paper Trading:** Simulated execution engine supporting Market and Limit order lifecycles, real-time P&L tracking, cash balance management, and transaction histories.
- **Institutional Screener:** Multi-variable filter scanning thousands of global and Indian equities across valuation multiples, growth rates, and profitability thresholds.
- **Verified Financial News:** Curated real-time feed with automated factual verification markers, entity sentiment classification, and macroeconomic impact tags.

---

## 🏛️ System Architecture

```mermaid
graph TD
    Client["Client Browser (Desktop / Tablet)"]
    Vercel["Frontend: Vercel Edge Network (Next.js 15 App Router)"]
    Render["Backend: Render Cloud (FastAPI Container)"]
    Neon["Database: Neon Serverless PostgreSQL"]
    Redis["Cache: In-Memory / Upstash Redis"]
    DataFeeds["Market Providers (TwelveData, FMP, yfinance)"]
    AIProviders["LLM Providers (Google Gemini, OpenRouter)"]

    Client -->|HTTPS / WSS| Vercel
    Vercel -->|REST API / WSS| Render
    Render -->|SQLAlchemy Async / psycopg| Neon
    Render -->|Key-Value Caching| Redis
    Render -->|Live Ingestion & Sync| DataFeeds
    Render -->|Context Grounding| AIProviders
```

---

## ⚙️ Environment Configuration Registers

For comprehensive environment variable registers, security specifications, and setup instructions, refer to:
- [docs/VERCEL_ENVIRONMENT_VARIABLE_REGISTER.md](docs/VERCEL_ENVIRONMENT_VARIABLE_REGISTER.md)
- [docs/RENDER_ENVIRONMENT_VARIABLE_REGISTER.md](docs/RENDER_ENVIRONMENT_VARIABLE_REGISTER.md)
- [docs/ENVIRONMENT_VARIABLE_REGISTER.md](docs/ENVIRONMENT_VARIABLE_REGISTER.md)

### Vercel (Frontend) Key Variables

| Variable | Purpose | Required | Example |
| :--- | :--- | :---: | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | Public API endpoint of backend | **Yes** | `https://marketscope-api.onrender.com` |
| `NEXT_PUBLIC_APP_URL` | Canonical frontend domain | **Yes** | `https://marketscope.io` |
| `NEXT_PUBLIC_APP_NAME` | Display platform name | No | `MarketScope.io` |
| `NEXT_PUBLIC_AI_ENABLED` | Enable AI assistant features | No | `true` |

### Render (Backend) Key Variables

| Variable | Purpose | Required | Example |
| :--- | :--- | :---: | :--- |
| `PORT` | Container binding port | **Yes** | `10000` (injected by Render) |
| `APP_ENV` | Environment stage | **Yes** | `production` |
| `SECRET_KEY` | JWT signing secret | **Yes** | `[Minimum 32-character high-entropy key]` |
| `DATABASE_URL` | Neon PostgreSQL connection | **Yes** | `postgresql+psycopg://user:pass@host/db?sslmode=require` |
| `CORS_ORIGINS` | Permitted client origins | **Yes** | `https://marketscope.io,https://marketscope-web.vercel.app` |
| `TWELVEDATA_API_KEY` | TwelveData market feed | **Yes** | `[Your API Key]` |
| `FMP_API_KEY` | Financial Modeling Prep | **Yes** | `[Your API Key]` |

---

## 🚀 Quickstart & Local Setup

### Option 1: Docker Compose (Recommended)

Clone the repository and launch the full stack locally:
```bash
git clone https://github.com/parth1511/marketscope.git
cd marketscope
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### Option 2: Manual Local Scaffolding

#### 1. Backend Setup
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup
```bash
cd apps/web
pnpm install
pnpm run dev
```

---

## 🧪 Testing & Validation

MarketScope.io is backed by an automated test suite verifying business logic, financial formulas, database models, and API endpoints:

```bash
# Run backend pytest suite (148 tests)
cd apps/api
pytest tests -v

# Run frontend typecheck & production build
cd apps/web
pnpm run build
```

---

## 📚 Documentation Reference Library

- [Final Project Report](docs/FINAL_PROJECT_REPORT.md) — Complete 25-chapter institutional project report
- [Master Task Audit Matrix](docs/FINAL_PROJECT_TASK_AUDIT.md) — Comprehensive feature implementation & verification register
- [Engineering Standards](docs/ENGINEERING_STANDARDS.md) — Full-stack architecture, coding, and quantitative standards
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md) — High-level architecture, component boundaries, and data flow
- [API Reference](docs/API_REFERENCE.md) — Full REST & WebSocket specification
- [Automated Test & QA Report](docs/TEST_REPORT.md) — 148 backend tests, 40 Next.js routes, and CycloneDX SBOM results
- [Production Readiness Report](docs/PRODUCTION_READINESS_REPORT.md) — Enterprise readiness audit and executive sign-off
- [Vercel Deployment Configuration](docs/VERCEL_DEPLOYMENT_CONFIGURATION.md) — Edge SSR deployment specification & register
- [Render Deployment Configuration](docs/RENDER_DEPLOYMENT_CONFIGURATION.md) — Containerized FastAPI web service specification & register
- [Cross-Platform Environment Variables](docs/ENVIRONMENT_VARIABLE_REGISTER.md) — Unified environment variable reference
- [Data Providers & Licensing](docs/DATA_PROVIDER_AND_LICENSING_REGISTER.md) — Vendor licenses, attribution, and SEBI disclosures
- [Security & Privacy](docs/SECURITY_AND_PRIVACY.md) — Security posture, DPDP Act 2023 & GDPR compliance
- [Repository Cleanup Report](docs/REPOSITORY_CLEANUP_REPORT.md) — Governance purge and asset retention record
- [Known Limitations & Roadmap](docs/KNOWN_LIMITATIONS_AND_ROADMAP.md) — Coverage boundaries and Horizon 2/3 roadmap

---

## ⚖️ Regulatory & Investment Disclaimers

> **SEBI Non-Advisory Notice:** MarketScope.io is an educational, analytical, and quantitative research technology platform. It is not registered as an Investment Adviser or Research Analyst with the Securities and Exchange Board of India (SEBI) or the U.S. Securities and Exchange Commission (SEC). Nothing published on this platform constitutes personalized financial, investment, legal, or tax advice. Market participants must perform independent due diligence and consult certified financial planners before executing live transactions.

---

## 📄 License & Intellectual Property

MarketScope.io is open-sourced under the [MIT License](LICENSE).  
Copyright © 2026 MarketScope.io Contributors. All rights reserved.
