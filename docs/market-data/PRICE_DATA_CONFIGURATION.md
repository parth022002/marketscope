# MarketScope.io — Market Data Provider Configuration & Deployment Guide

## 1. Environment Variable Reference

The market data infrastructure is controlled via standard environment variables configured in `apps/api/.env`:

```env
# ─── 1. Commercial Provider API Keys ─────────────────────────────────────────
# Twelve Data (US & Global Equities, Forex, Indices)
TWELVEDATA_API_KEY=your_twelvedata_api_key_here

# Financial Modeling Prep (FMP) (Equities, Financial Statements, Ratios)
FMP_API_KEY=your_fmp_api_key_here
FINANCIAL_DATA_API_KEY=your_fmp_api_key_here

# ─── 2. Ingestion & Cache Configuration ──────────────────────────────────────
# Redis L2 Cache Connection (Defaults to localhost:6379/0 if present)
REDIS_URL=redis://localhost:6379/0

# In-Memory Cache TTL (Seconds)
MARKET_DATA_ACTIVE_TTL_SECONDS=5.0
MARKET_DATA_CLOSED_TTL_SECONDS=300.0

# Anomaly Detection Threshold (Percentage)
PRICE_ANOMALY_THRESHOLD_PCT=35.0

# ─── 3. Streaming Configuration ──────────────────────────────────────────────
# WebSocket Heartbeat Interval (Seconds)
WS_HEARTBEAT_INTERVAL_SECONDS=10.0
WS_MAX_CLIENT_CONNECTIONS=1000

# ─── 4. Database System of Record ────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@neon.tech/marketscope?sslmode=require
```

---

## 2. Configuration Best Practices

1. **Secret Management**: Never commit actual API keys to source code or git repositories. Use Docker secrets, AWS Secrets Manager, or Doppler in staging/production.
2. **Rate Limit Throttling**: The Twelve Data free tier allows 8 requests/minute; the paid tier supports 800+ requests/minute. The built-in L1 cache (5-second TTL) automatically coalesces duplicate client requests.
3. **Graceful Fallback**: If `TWELVEDATA_API_KEY` or `FMP_API_KEY` is omitted or empty, the server automatically starts in fallback mode with `FallbackDevProvider` active, ensuring local development remains frictionless.
