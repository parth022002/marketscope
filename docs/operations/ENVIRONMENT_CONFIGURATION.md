# MarketScope.io — Environment Configuration Reference

## 1. Root `.env` / Container Environment Variables

### Core Application
- `APP_ENV`: Application environment (`development` or `production`). Default: `development`.
- `APP_NAME`: Display name of the application. Default: `MarketScope.io API`.
- `APP_DEBUG`: Toggle detailed debugging traces (`true` or `false`).
- `SECRET_KEY`: Minimum 32-character high-entropy secret string for internal token signing.
- `SNAPSHOT_SIGNING_SALT`: Salt used for deterministic snapshot verification hashing.
- `PORT`: Port on which the service binds (`8000` for backend API, `3000` for frontend web, or dynamically assigned by Render).

### Database Configuration (PostgreSQL / Neon)
- `DATABASE_URL`: Full PostgreSQL connection string using the modern `postgresql+psycopg://` driver scheme:
  ```
  postgresql+psycopg://user:password@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
  ```
- `DATABASE_POOL_URL`: Optional separate direct pooled connection string for serverless transaction pooling.

### Authentication (Clerk)
- `CLERK_PUBLISHABLE_KEY`: Public Clerk publishable key (`pk_test_...` or `pk_live_...`).
- `CLERK_SECRET_KEY`: Backend Clerk secret key (`sk_test_...` or `sk_live_...`).
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Frontend exposed Clerk publishable key.

### Market Data API Providers
- `TWELVEDATA_API_KEY`: API key for TwelveData (real-time and intraday global market time series).
- `FMP_API_KEY`: API key for Financial Modeling Prep (financial statements, balance sheets, ratios).
- `FINANCIAL_DATA_API_KEY`: Fallback provider key.
- `MARKET_DATA_PROVIDER`: Provider mode (`hybrid`, `twelvedata`, `fmp`, `offline`). Default: `hybrid`.

### Frontend Configuration (`apps/web/.env.local`)
- `NEXT_PUBLIC_API_BASE_URL`: Base URL of the backend API (e.g. `http://localhost:8000` or `https://marketscope-api.onrender.com`).
- `NEXT_PUBLIC_APP_NAME`: Display name in frontend headers (`MarketScope.io`).
- `NEXT_PUBLIC_AI_ENABLED`: Feature toggle for AI financial news summarization (`true` or `false`).
