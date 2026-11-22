# MarketScope.io — Security, Privacy & Safety Requirements

## 1. Non-Custodial Architecture & Financial Safety
- **No Money Custody**: MarketScope.io never takes deposits, holds fiat or cryptocurrency balances, or executes live broker order routing.
- **Isolated Simulation Ledger**: Virtual paper trading trades and balances are strictly kept in an isolated database ledger and never mapped to external banking or brokerage APIs.
- **Educational Disclaimers**: Every screen displaying prices, technical indicators, or backtest results features prominent non-custodial educational disclosures compliant with SEBI and SEC guidelines.

## 2. Authentication & Authorization
- **Clerk Identity Management**: User authentication, session tokens, and multi-factor authentication are managed through Clerk.
- **JWT Verification**: Backend routes verify Clerk RS256 JWT signatures on protected endpoints.
- **CSRF & CORS**: Strict CORS whitelisting preventing unauthorized cross-origin API invocation.

## 3. Data Protection & Privacy
- **Zero Personally Identifiable Information (PII) Leakage**: User watchlists, alerts, and paper trades are strictly isolated per `user_id`.
- **Encryption in Transit**: Strict HTTPS / TLS 1.3 enforcement on all frontend and API endpoints.
- **Encryption at Rest**: PostgreSQL database connections use SSL (`sslmode=require`) to Neon serverless database.
- **Environment Secret Isolation**: Production credentials (API keys, DB URLs, Clerk secrets) are injected strictly via container environment variables and never logged or exposed in client bundles.

## 4. Input Validation & Content Security
- **Pydantic Validation**: Every API request payload is strictly validated using Pydantic v2 models with type bounds and regex constraints.
- **SQL Injection Prevention**: 100% parameterized queries via SQLAlchemy 2.0 ORM; raw string concatenation in SQL queries is prohibited.
- **XSS Mitigation**: Next.js React automatic output encoding and strict Content Security Policy (CSP) headers.
