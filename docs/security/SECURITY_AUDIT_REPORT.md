# MarketScope.io — Security Audit Report

## 1. Executive Summary
A comprehensive security review was conducted across the MarketScope.io codebase covering authentication, authorization, injection risks, data privacy, secrets hygiene, and container hardening.

---

## 2. Threat Vector Audits & Mitigations

### 2.1 Non-Custodial Boundaries & Financial Protection
- **No Money Custody**: MarketScope.io strictly operates as an educational and analytical research platform. It does not accept cash deposits, hold user funds, or interface with live broker routing APIs.
- **Isolated Simulation Ledger**: Virtual paper trading accounts operate entirely on an in-memory / relational sandbox with zero connection to financial accounts.

### 2.2 Authentication & Session Security
- **Clerk Identity Service**: Authentication is powered by Clerk using industry-standard OAuth2/OIDC, PKCE, and RS256 signed JWT tokens.
- **Backend Token Validation**: Protected FastAPI endpoints decode and verify Clerk JWT signatures using Clerk JWKS endpoints.
- **Workspace Data Isolation**: All user-specific entities (watchlists, alerts, notes, layouts) are strictly partitioned by `user_id` or `workspace_id`. Cross-tenant data leaks are mathematically prevented by parameterized `WHERE user_id = :uid` clauses.

### 2.3 Injection & Input Sanitization
- **SQL Injection**: 100% prevented via SQLAlchemy 2.0 ORM parameterized queries. Zero raw SQL string interpolation is used.
- **Cross-Site Scripting (XSS)**: React 19 / Next.js automatic contextual HTML escaping prevents script injection. Client input strings are validated via TypeScript interfaces and Pydantic v2 regex boundaries.
- **Cross-Origin Resource Sharing (CORS)**: Strict CORS policy in `CORSMiddleware` allows only verified origins (`localhost`, `marketscope.io`, and `*.onrender.com`). Arbitrary wildcard `*` origins are disabled in production mode (`APP_ENV=production`).

### 2.4 Container & Cloud Infrastructure
- **Non-Root Execution**: Docker container runs as unprivileged user `appuser` (UID 1001, GID 1001).
- **Secrets Hygiene**: No production API keys, database credentials, or secret keys are committed into version control. `.env.example` contains only safe placeholder templates.
- **Health Check Safety**: Process liveness `/health` does not require database authentication, preventing DoS cascades during database cold starts.
