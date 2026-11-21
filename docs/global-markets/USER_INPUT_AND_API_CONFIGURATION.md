# User Input & API Configuration Guide

## 1. Environment Variables & Gateway Configuration

To configure commercial API gateways in deployment, configure the following variables in `apps/api/.env`:

```env
# ─── Commercial Market Data Gateways ──────────────────────────────────────────
TWELVEDATA_API_KEY=your_twelvedata_api_key_here
FMP_API_KEY=your_financial_modeling_prep_api_key_here

# ─── Live Market Data Engine Mode ─────────────────────────────────────────────
# Options: HYBRID_LIVE (default), DEMO_FALLBACK, ENTERPRISE_DIRECT
MARKET_DATA_ENGINE_MODE=HYBRID_LIVE

# ─── Micro-Cache Expiry Policies (Seconds) ────────────────────────────────────
MARKET_CACHE_EQUITY_TTL=5
MARKET_CACHE_COMMODITY_TTL=10
MARKET_CACHE_BONDS_TTL=300
MARKET_CACHE_FUNDS_TTL=3600

# ─── Statutory & Regulatory Flags ─────────────────────────────────────────────
STRICT_NON_BROKERAGE_MODE=true
ENABLE_FEMA_DERIVATIVES_RESTRICTION_BADGES=true
ENABLE_LRS_TAX_DISCLOSURES=true
```

---

## 2. Testing Free vs Enterprise Credentials
- **Twelve Data Free Key**: Twelve Data free keys restrict access to US exchanges and Forex; Indian symbols (`.NS`, `.BO`) return HTTP 404. MarketScope automatically handles this by routing Indian equities to `LiveExchangeProvider`.
- **FMP Free Key**: Supports US and international equity financial statements. Quotes route to `/stable/quote`.
- **No Credentials Required for Core Intelligence**: `LiveExchangeProvider`, AMFI NAVs, RBI Reference Rates, and FRED Sovereign Yields require zero third-party API keys and function out-of-the-box.
