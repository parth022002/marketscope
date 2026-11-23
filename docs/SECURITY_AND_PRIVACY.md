# MarketScope.io — Security, Governance & Privacy Architecture

**Document Version:** 2.0-Production  
**Compliance Frameworks:** DPDP Act 2023, ISO 27001 Security Headers, OWASP Top 10

---

## 1. Core Security Controls

### A. Network & Transport Security
- **Strict HTTPS / TLS 1.3:** Enforced across Vercel frontend and Render backend.
- **WebSocket Upgrade Protection:** Enforced `wss://` on all remote deployments, eliminating insecure mixed-content handshakes.
- **Security Headers Middleware:** Implemented in `apps/api/app/core/middleware.py`:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Content-Security-Policy`: Restricts scripts, objects, and connect-src origins.
  - Correlation ID injection (`X-Correlation-ID`) across every request-response cycle for full traceability.

### B. Database & Secrets Protection
- **No In-Tree Secrets:** All sensitive credentials (`DATABASE_URL`, `SECRET_KEY`, API tokens) reside exclusively in deployment environment variables and are excluded from Git via `.gitignore`.
- **Serverless PostgreSQL SSL:** Forced `sslmode=require` with certificate validation on Neon serverless endpoints.
- **Parameterized SQL:** All relational queries run via SQLAlchemy ORM, eliminating SQL injection attack surfaces.

### C. Rate Limiting & Denial-of-Service Defense
- **Sliding-Window Rate Limiting:** Managed in `apps/api/app/core/middleware.py`, protecting public financial endpoints against scraping and DDoS exhaustion.
- **WebSocket Storm Prevention:** Capped reconnection retries at 5 attempts with exponential backoff in `apps/web/src/lib/useMarketWebSocket.ts`.

---

## 2. Privacy & DPDP Compliance (Digital Personal Data Protection)

1. **Right to Erasure & Export:**
   - Implemented `POST /api/v1/compliance/dpdp/export` for complete data portability.
   - Implemented `POST /api/v1/compliance/dpdp/purge` with cascade purging across user memberships, research notes, snapshots, and watchlists.
2. **Zero PII Leakage in AI Queries:**
   - Dedicated PII scrubbers sanitize queries before dispatching prompts to external LLMs.
