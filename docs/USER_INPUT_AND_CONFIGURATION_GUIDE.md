# MarketScope.io — User Input & Configuration Guide

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Audience:** Project Owner & Engineering Team  
**Purpose:** Comprehensive guide identifying every piece of configuration, credential, infrastructure choice, and market data license required to build, test, and operate MarketScope.io.

> **CRITICAL SECURITY RULE:**  
> **Never paste actual production secrets, private keys, or passwords into this document, documentation files, or any file committed to Git.**  
> All sensitive credentials must be set via local uncommitted environment files (`.env`, `.env.local`), cloud hosting environment variables (e.g., Vercel, Neon), or an approved secret manager.

---

## Quick Navigation
1. [Important Guidance for the Project Owner](#1-guidance-for-the-project-owner)
2. [Phase-by-Phase Information Requirements](#2-phase-by-phase-requirements)
3. [Project & Environment Information](#3-project--environment-information)
4. [Database Configuration (PostgreSQL / Neon)](#4-database-configuration)
5. [Authentication & Identity Configuration (Clerk / OIDC)](#5-authentication--identity-configuration)
6. [Financial Market Data Integrations & Rights Checklist](#6-financial-market-data-integrations)
7. [Infrastructure & Cloud Services](#7-infrastructure--cloud-services)
8. [AI & Intelligent Research Integrations (Gated / Future)](#8-ai--intelligent-research-integrations)
9. [Security, Encryption & Access Configuration](#9-security--access-configuration)
10. [User Input Status Tracker](#10-user-input-status-tracker)

---

## 1. Guidance for the Project Owner

As the Project Owner, you do **not** need to provide every external API key or third-party service credential today.

- **Phase 0 and Phase 1 require ZERO external API purchases or live market data keys.** Development proceeds immediately using an internal `MockProvider` and synthetic Indian equity fixtures (e.g. Reliance, TCS, Infosys).
- When a credential or configuration item is required, this guide explains:
  1. **Why it is needed.**
  2. **Where to obtain it.**
  3. **Whether a free tier exists.**
  4. **Whether paid subscriptions are involved.**
  5. **How to configure it safely.**
  6. **How to verify it works.**
  7. **When it is actually needed (Immediate vs. Later Phase).**

---

## 2. Phase-by-Phase Requirements

```
Phase 0: Project Discovery & Setup (Current)
  └── Required: Project metadata, local repo conventions (No external credentials needed).

Phase 1: Project Foundation & First Vertical Slice
  └── Required: Local PostgreSQL connection (Docker or local Postgres), Node.js & Python runtimes.
  └── Optional: Neon database connection, Clerk dev keys (local mock auth bypass is provided).

Phase 2: Financial Data & Metric Foundation
  └── Required: Test fixtures for canonical statements and golden metric calculations.

Phase 3: Core Research Platform
  └── Required: Workspace isolation parameters, watchlist quotas, snapshot storage config.

Phase 4: External Market Data & Production Infrastructure
  └── Required: Commercial market data vendor agreements (NSE/BSE/vendors), Cloudflare R2, Upstash Redis.

Phase 5: Gated AI Research Intelligence
  └── Required: LLM provider key (OpenAI/Anthropic/Gemini) subject to strict evaluation and citation policy.

Phase 6: Production Launch & Hardening
  └── Required: Production domain, SSL certificates, production Clerk/Neon/Vercel keys, Sentry DSN.
```

---

## 3. Project & Environment Information

| Field | Description | Dev Baseline (Default) | Staging / Prod Target |
|---|---|---|---|
| **Project Name** | Official name across code and UI | `MarketScope.io` | `MarketScope.io` |
| **GitHub Repository** | Version control repository URL | Local workspace | `https://github.com/<owner>/marketscope` |
| **Primary Market** | Regulatory and market jurisdiction | India (NSE / BSE) | India (NSE / BSE) |
| **Primary Domain** | Public production web address | `http://localhost:3000` | `https://marketscope.io` |
| **API Domain** | Backend API base address | `http://localhost:8000` | `https://api.marketscope.io` |
| **Frontend Host** | Web application hosting provider | Local Node.js | Vercel |
| **Backend Host** | FastAPI application hosting provider | Local Uvicorn | Render / AWS ECS / Fly.io / Neon Compute |

---

## 4. Database Configuration

MarketScope.io uses **PostgreSQL 16+** as its primary system of record. We recommend **Neon** for managed cloud deployments due to serverless autoscaling, instant branch environments for pull requests, and native connection pooling.

### Configuration Parameters
- `DATABASE_URL`: Connection string. Format: `postgresql+psycopg://<user>:<password>@<host>:<port>/<dbname>?sslmode=require`
- `DATABASE_POOL_URL`: Pooled connection string (PgBouncer) for serverless environments.
- `POSTGRES_DB`: Name of the database (`marketscope`).
- `POSTGRES_USER`: Database username (`marketscope`).
- `POSTGRES_PASSWORD`: Strong database password.

### Detailed Credential Profile: PostgreSQL / Neon
1. **Why it is needed:** Stores all user workspaces, instruments, canonical financial facts, metric definitions, calculated ratios, evidence links, research notes, and immutable snapshot payloads.
2. **Where to obtain it:** Sign up at [https://neon.tech](https://neon.tech) and create a project named `marketscope`.
3. **Free option available?** **Yes.** Neon provides a generous free tier (0.5 GiB storage, branch environments, pooled connections) suitable for all development and staging testing.
4. **Subscription cost:** Free tier is \$0/month. Production Scale plans start around \$19/month when scaling beyond free limits.
5. **How to configure:** Copy the connection string from the Neon dashboard and place it in `apps/api/.env` as `DATABASE_URL`.
6. **How to verify:** Run `python -m app.core.database_check` or run the database migration command `alembic upgrade head`.
7. **When needed:** Optional for Phase 0/1 (Docker Compose PostgreSQL works locally); mandatory for cloud deployment in Phase 4+.

---

## 5. Authentication & Identity Configuration

MarketScope.io uses **Clerk** (or an approved managed OIDC provider) to provide multi-factor authentication (MFA), passwordless email OTP, session revocation, and secure tenant identity tokens.

### Configuration Parameters
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Frontend publishable key (`pk_test_...` or `pk_live_...`).
- `CLERK_SECRET_KEY`: Backend API secret key (`sk_test_...` or `sk_live_...`).
- `CLERK_WEBHOOK_SECRET`: Secret used to verify webhook signatures from Clerk (`whsec_...`).
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Default sign-in route (`/sign-in`).
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Default registration route (`/sign-up`).
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: Landing page after login (`/workspace`).
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: Onboarding route after signup (`/workspace`).

### Detailed Credential Profile: Clerk Authentication
1. **Why it is needed:** Secures user workspaces, protects research notes and snapshots from unauthorized access, manages user sessions, and guarantees tenant isolation.
2. **Where to obtain it:** Create an account at [https://clerk.com](https://clerk.com) and create an application named `MarketScope`.
3. **Free option available?** **Yes.** Clerk provides a free development tier supporting up to 10,000 monthly active users, email OTP, and social logins.
4. **Subscription cost:** Free tier is \$0/month. Pro tiers start at \$25/month for custom domains and advanced security.
5. **How to configure:** Set publishable key in `apps/web/.env.local` and secret key in `apps/api/.env`.
6. **How to verify:** Attempt to log into the web frontend; verify that the backend receives a valid JWT and validates the user's workspace.
7. **When needed:** For Phase 1 local development, the platform includes `MOCK_AUTH_ENABLED=true` which bypasses Clerk and injects a local developer session. Clerk credentials are required before multi-user staging deployment.

---

## 6. Financial Market Data Integrations & Rights Checklist

> **LEGAL NOTICE & DATA INTEGRITY MANDATE:**  
> MarketScope.io strictly adheres to commercial licensing, data redistribution rules, and SEBI regulations.  
> **Do not scrape exchange websites, redistribute proprietary feeds without written agreements, or assume public data can be commercially monetized.**  
> Development begins with synthetic data via `MockProvider`. Live provider adapters will only be enabled after written rights approval.

### Provider Rights & Evaluation Matrix

| Category | Potential Source / Provider | Official Website & Docs | Licensing & Commercial Rights Status | Refresh Frequency | Intended Scope in MarketScope | Phase Required |
|---|---|---|---|---|---|---|
| **Internal Mock Provider** | `MockProvider` (Internal) | Built-in codebase | **Fully Approved.** Proprietary synthetic fixtures; zero licensing liability. | On-demand | Primary engine for Phase 0, 1, 2, 3 local development & demos. | **Phase 1 (Immediate)** |
| **Official Exchange Infrastructure** | National Stock Exchange (NSE India) | [nseindia.com](https://www.nseindia.com) | **Review Required.** Direct commercial market data feed requires formal data vendor agreement with NSE Data & Analytics Ltd. | EOD / 15-min delayed | Official Bhavcopy, traded volumes, 52-week ranges, corporate announcements. | Phase 4 |
| **Official Exchange Infrastructure** | Bombay Stock Exchange (BSE India) | [bseindia.com](https://www.bseindia.com) | **Review Required.** Requires commercial data redistribution contract with BSE Ltd. | EOD / Periodic | Secondary exchange listings, corporate filings, scrip codes. | Phase 4 |
| **Corporate Disclosures** | Ministry of Corporate Affairs (MCA) | [mca.gov.in](https://www.mca.gov.in) | **Government Open Data / MCA21.** Public access for filings; commercial bulk access via MCA services. | Periodic filings | Legal entity master, directors, authorized capital, charge registrations. | Phase 4 |
| **Financial Statements** | Curated Vendor / XBRL Processor | Vendors: CMIE Prowess, Accord Fintech, FactSet, or licensed XBRL feed | **Commercial Subscription.** Must explicitly permit cloud database storage, metric calculation, and web presentation. | Annual & Quarterly filings | Canonical Balance Sheets, Profit & Loss Statements, Cash Flow Statements. | Phase 4 |
| **Macroeconomic Data** | Reserve Bank of India (RBI) Database on Indian Economy | [dbie.rbi.org.in](https://dbie.rbi.org.in) | **Public Reference.** Free public data; attribution required. | Monthly / Quarterly | Repo rates, inflation (CPI/WPI), GDP growth trends, 10Y G-Sec yields. | Phase 4 |
| **Security Identifiers** | NSDL / CDSL (ISIN Master) | [nsdl.co.in](https://www.nsdl.co.in) | Public reference directories. | Periodic updates | Canonical ISIN resolution and verification. | Phase 4 |

### Standard Ingestion Checklist for Every Future Data Provider:
1. **Provider Name & Entity:** Full legal corporate name and jurisdiction.
2. **API Documentation:** OpenAPI / Swagger documentation link.
3. **Authentication:** API Key, mTLS, or OAuth 2.0 client credentials.
4. **Rate Limits:** Maximum requests per second, hour, and day.
5. **Redistribution Rights:** Does contract allow displaying raw data, derived metrics, or caching in our database?
6. **Attribution Requirements:** Exact copyright text, logo placement, or latency disclaimers required on screen.
7. **Data Freshness Contract:** Notification webhook or polling schedule for financial restatements and filing corrections.

---

## 7. Infrastructure & Cloud Services

| Service | Recommended Provider | Purpose | Free Tier Available? | Estimated Monthly Cost | Configuration Key(s) | Required Phase |
|---|---|---|---|---|---|---|
| **Web Hosting** | Vercel | Next.js serverless and edge hosting | Yes (Hobby tier free) | \$0 dev / \$20 pro | Vercel CLI / GitHub integration | Phase 4 |
| **Database** | Neon | Serverless PostgreSQL with branching | Yes (0.5 GiB free) | \$0 dev / \$19 scale | `DATABASE_URL` | Phase 1 (Optional) / Phase 4 |
| **In-Memory Cache & Rate Limiting** | Upstash Redis | API rate limiting, session cache, queue state | Yes (10k commands/day free) | \$0 dev / Pay-per-request | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Phase 3 |
| **Object Storage** | Cloudflare R2 | Filing PDF documents, snapshot exports, assets | Yes (10 GB storage free, \$0 egress) | \$0 dev / Negligible | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` | Phase 4 |
| **Background Queue** | Celery / Redis or Inngest | Async data ingestion and metric recomputations | Yes (Local Redis free) | \$0 dev / \$20+ | `REDIS_URL` or `INNGEST_SIGNING_KEY` | Phase 3 |
| **Error Monitoring** | Sentry | Full-stack exception tracking and tracing | Yes (5k errors/month free) | \$0 dev / \$26 team | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN` | Phase 4 |
| **Telemetry** | OpenTelemetry | Structured API performance tracing | Open source | \$0 | `OTEL_EXPORTER_OTLP_ENDPOINT` | Phase 6 |
| **Transactional Email** | Resend / Postmark | Workspace invites, password resets, alerts | Yes (Resend 3k emails/month free) | \$0 dev / \$20 | `RESEND_API_KEY` | Phase 4 |
| **Domain & DNS** | Cloudflare | DNS management, DDoS protection, edge caching | Yes (Free DNS & SSL) | Domain registration only | Cloudflare Name Servers | Phase 6 |

---

## 8. AI & Intelligent Research Integrations (Gated / Future)

> **STRICT POLICY:**  
> **All AI integrations are strictly DISABLED in Phase 0, 1, 2, and 3.**  
> AI features will only be activated in Phase 5 after explicit project owner approval, data rights verification, and evaluation against hallucination release benchmarks.

### Future Configuration Placeholders (Phase 5 Only)
- `AI_ENABLED`: Set to `false` (Mandatory default).
- `AI_PROVIDER`: `openai` | `anthropic` | `google`
- `AI_API_KEY`: API secret key.
- `AI_MODEL_NAME`: e.g. `gpt-4o`, `claude-3-5-sonnet`, `gemini-1.5-pro`
- `EMBEDDING_PROVIDER`: Provider for vector embeddings of filing text.
- `VECTOR_DB_URL`: Managed vector store (e.g. pgvector in Neon or Pinecone).
- `AI_STRICT_CITATION_POLICY`: `true` (Enforces that claims must have direct filing citations or abstain).

---

## 9. Security, Encryption & Access Configuration

### Environment Variables for Security Hardening
- `SECRET_KEY`: High-entropy 32-byte secret used for cryptographically signing application state (generate with `openssl rand -hex 32`).
- `SNAPSHOT_SIGNING_SALT`: Salt used for computing tamper-evident SHA-256 hashes of immutable research snapshots.
- `CORS_ORIGINS`: Comma-separated list of trusted origins (e.g. `http://localhost:3000,https://marketscope.io`). Never set to `*` with credentials.
- `RATE_LIMIT_PER_MINUTE`: Maximum permitted requests per IP/token on public search endpoints (Default: `60`).
- `AUDIT_LOG_ENABLED`: `true` (Enforces tamper-resistant database logging of user actions).

---

## 10. User Input Status Tracker

This tracker monitors the status of every configuration item throughout development.

| Configuration Item | Category | Required Phase | Mandatory? | Provided? | Status | Notes / Next Step |
|---|---|---|---|---|---|---|
| **Project Name & Authority Baseline** | Metadata | Phase 0 | Yes | Yes | **Approved** | MarketScope.io confirmed. PRD v1.0 authoritative. |
| **Local PostgreSQL / Docker** | Database | Phase 1 | Yes | Yes | **Configured** | Available in `docker-compose.yml`. |
| **Neon PostgreSQL Cloud URL** | Database | Phase 4 | No (Local DB in Phase 1) | No | **Not required yet** | Local DB active; Neon needed for staging/deploy. |
| **Mock Authentication Bypass** | Identity | Phase 1 | Yes | Yes | **Configured** | `MOCK_AUTH_ENABLED=true` enables instant offline dev. |
| **Clerk Publishable & Secret Keys** | Identity | Phase 4 | Yes (for Staging/Prod) | No | **Pending user input** | Needed before multi-user staging deployment. |
| **Synthetic Equity Fixtures** | Market Data | Phase 1 | Yes | Yes | **Configured** | Reliance, TCS, INFY fixtures ready in `MockProvider`. |
| **Licensed Exchange / Vendor Feed** | Market Data | Phase 4 | Yes (for Live Data) | No | **Pending user input** | Commercial data agreements required for live feeds. |
| **Cloudflare R2 Object Storage** | Storage | Phase 4 | No (Local FS in Phase 1) | No | **Not required yet** | Needed for cloud filing PDF storage. |
| **Upstash Redis Cache** | Cache / Queue| Phase 3 | No (Local Redis in Phase 1) | No | **Not required yet** | Docker Redis handles Phase 1 local development. |
| **Sentry DSN** | Monitoring | Phase 6 | No | No | **Not required yet** | Configure during production hardening. |
| **AI Provider Keys (OpenAI/Anthropic)**| Intelligence | Phase 5 | No (Strictly Gated) | No | **Not required yet** | AI is disabled in MVP 1.0 by architecture mandate. |
| **Production Domain & SSL** | DNS | Phase 6 | Yes (for Launch) | No | **Not required yet** | Will configure `marketscope.io` prior to launch. |

---

## 11. Step-by-Step Instructions for Providing Missing Information

When you are ready to configure any of the external services, follow these exact steps:

### How to set up Neon (PostgreSQL):
1. Navigate to [https://neon.tech](https://neon.tech) and create an account.
2. Click **Create Project**, enter name `marketscope`, select region `ap-southeast-1` (Singapore) or closest to India.
3. In the project dashboard, copy the **Connection string** (select `psycopg` or `URI`).
4. In your local `apps/api/.env`, update:
   ```bash
   DATABASE_URL="postgresql+psycopg://<user>:<password>@<host>/marketscope?sslmode=require"
   ```

### How to set up Clerk (Authentication):
1. Navigate to [https://clerk.com](https://clerk.com) and create an account.
2. Click **Add application**, enter `MarketScope.io`, choose **Email OTP** and optional Google login.
3. In Clerk Dashboard -> **API Keys**, copy:
   - **Publishable Key** -> place in `apps/web/.env.local` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
   - **Secret Key** -> place in `apps/api/.env` as `CLERK_SECRET_KEY`.
4. Turn off `MOCK_AUTH_ENABLED=false` once you wish to test real Clerk sign-ins.
