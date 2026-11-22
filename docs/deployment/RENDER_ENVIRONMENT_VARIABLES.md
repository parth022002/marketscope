# MarketScope.io — Render Environment Variables Reference

## 1. Backend Service (`marketscope-api`)

| Variable Name | Required | Default / Example Value | Description |
| :--- | :---: | :--- | :--- |
| `APP_ENV` | Yes | `production` | Enables production security mode, disables verbose debug traces. |
| `APP_NAME` | No | `MarketScope.io API` | Application identifier in headers and OpenAPI docs. |
| `APP_DEBUG` | No | `false` | When false, suppresses internal exception stack traces in HTTP responses. |
| `PORT` | Auto | `10000` (Render assigned) | Render dynamically injects this variable. The app binds to `0.0.0.0:$PORT`. |
| `DATABASE_URL` | Yes | `postgresql+psycopg://user:pass@ep-host.neon.tech/neondb?sslmode=require` | PostgreSQL connection string. Psycopg 3 dialect is auto-configured. |
| `DATABASE_POOL_URL`| No | *(optional)* | Neon connection pooler URL for high concurrency. |
| `SECRET_KEY` | Yes | *(Render auto-generates 32+ chars)* | High-entropy secret for internal signature generation. |
| `SNAPSHOT_SIGNING_SALT` | Yes | *(Render auto-generates 32+ chars)* | Cryptographic salt for immutable research snapshot hashes. |
| `API_CORS_ORIGINS` | No | `https://marketscope-web.onrender.com` | Comma-separated list of allowed frontend origins. |
| `CLERK_PUBLISHABLE_KEY`| Yes | `pk_live_...` or `pk_test_...` | Clerk client publishable key. |
| `CLERK_SECRET_KEY` | Yes | `sk_live_...` or `sk_test_...` | Clerk backend secret key for JWT verification. |
| `TWELVEDATA_API_KEY` | Yes | *(your TwelveData key)* | Market data feed for global stock and forex quotes. |
| `FMP_API_KEY` | Yes | *(your FMP key)* | Financial Modeling Prep feed for corporate financials & balance sheets. |
| `AI_ENABLED` | No | `true` | Enables financial news categorization and summary extraction. |
| `GROQ_API_KEY` | No | *(optional)* | High-speed LLM inference for news impact scoring. |
| `GEMINI_API_KEY` | No | *(optional)* | Google Gemini API key for news summarization. |
| `SENTRY_DSN` | No | *(optional)* | Error tracking and telemetry integration. |

---

## 2. Frontend Service (`marketscope-web`)

| Variable Name | Required | Default / Example Value | Description |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Next.js production build mode. |
| `NEXT_PUBLIC_APP_NAME` | No | `MarketScope.io` | UI branding name. |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | `https://marketscope-api.onrender.com` | Public HTTPS URL of the deployed FastAPI backend. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | `pk_live_...` | Public Clerk key for client authentication widgets. |
| `CLERK_SECRET_KEY` | Yes | `sk_live_...` | Clerk secret key for Next.js middleware and SSR token validation. |
| `NEXT_PUBLIC_AI_ENABLED` | No | `true` | Enables AI research features in client components. |
