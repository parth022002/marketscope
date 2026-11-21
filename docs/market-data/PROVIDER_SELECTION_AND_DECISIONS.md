# MarketScope.io — Phase 1: Provider Selection & Architectural Decisions

## 1. Executive Summary

Selecting data providers for an India-first financial research platform involves balancing licensing compliance, instrument breadth, delivery mode (WebSocket vs REST), and budget. 
No single vendor provides complete, affordable global multi-asset coverage with website redistribution rights. Consequently, MarketScope.io employs a **Hybrid Multi-Vendor Architecture**:

- **Global Quotes, FX & US Equities**: Twelve Data (Tier 1 REST & WebSocket)
- **Financial Statements, Ratios & Fundamentals**: Financial Modeling Prep (FMP Professional)
- **Indian Real-Time Tick Pipeline (Targeted Production)**: TrueData / Licensed Authorized Vendor
- **Local Development & Offline Testing**: Deterministic Fallback Engine (Strictly labeled `SYNTHETIC_DEVELOPMENT`)

---

## 2. Selection Decision Matrix by Asset Class

| Asset Class | Primary Selected Vendor | Secondary / Fallback Vendor | Delivery Mechanism | Freshness State Enforced |
|---|---|---|---|---|
| **Indian Equities (NSE/BSE)** | Licensed Vendor (TrueData) / FMP | Twelve Data / EOD Bhavcopy | WebSocket L1 / REST | `LIVE` (during session) / `DELAYED_15M` / `CLOSED` |
| **Indian Indices (NIFTY, SENSEX)**| Twelve Data (`:NSE`, `:BSE`) | FMP (`^NSEI`, `^BSESN`) | REST / WebSocket | `LIVE` / `DELAYED_15M` / `CLOSED` |
| **US Equities (NASDAQ/NYSE)** | Twelve Data | Financial Modeling Prep (FMP) | REST / WebSocket | `LIVE` / `DELAYED_15M` / `CLOSED` |
| **Global Benchmark Indices** | Twelve Data | FMP | REST | `DELAYED_15M` / `CLOSED` |
| **Commodities (MCX & Global)** | Twelve Data (`XAU/USD`, `BRENT`) | FMP | REST / WebSocket | `LIVE` / `DELAYED_15M` / `CLOSED` |
| **Forex Pairs (USD/INR, EUR/INR)**| Twelve Data | FMP FX | REST / WebSocket | `LIVE` (24/5) / `CLOSED` (Weekend) |
| **Sovereign Yields (10Y)** | Twelve Data (`TNX`) / Central Bank | Internal Benchmark Fixings | REST / Daily Cache | `LIVE` / `EOD` |
| **Financial Statements (Ind AS)**| FMP (US/Global) / Canonical Ind AS | Manual Filing DB | REST API / PostgreSQL | `HISTORICAL` |

---

## 3. Detailed Architectural Decisions (ADRs)

### ADR-01: Rejecting Scraping for Production Data
- **Decision**: Avoid unauthorized web scraping of NSE/BSE public web portals.
- **Rationale**: Exchange web scraping is subject to IP rate limits, CAPTCHA blocks, legal liability under exchange terms of service, and sudden layout breakages.
- **Impact**: All exchange data must flow through compliant commercial APIs or licensed vendor redistribution channels.

### ADR-02: Truth in Labeling Over Simulated "Activity"
- **Decision**: Never disguise delayed or synthetic test fixtures as live exchange data.
- **Rationale**: Financial analysts rely on timestamps and provenance. Labeling a 15-minute delayed price or static fixture as "LIVE" creates legal liability and destroys research credibility.
- **Impact**: Any quote outside trading hours is marked `CLOSED` or `EOD`. Free-tier uncredentialed feeds are marked `DELAYED_15M`. Offline test fixtures are marked `SYNTHETIC_DEVELOPMENT`.

### ADR-03: Modular Provider Adapter Pattern
- **Decision**: All provider integrations must implement `BaseMarketDataProvider`.
- **Rationale**: Isolates vendor-specific JSON schema differences (e.g. Twelve Data's `close` vs FMP's `price`).
- **Impact**: Upgrading or swapping vendors requires editing only the vendor adapter, leaving business logic and frontends completely untouched.

### ADR-04: Tiered L1/L2 Caching for Rate-Limit Preservation
- **Decision**: Implement L1 In-Memory TTL caching (5s live / 300s closed) and L2 Redis caching.
- **Rationale**: Commercial market data APIs charge per call or enforce strict requests-per-minute limits.
- **Impact**: A 5-second TTL cache absorbs 95% of redundant concurrent user requests during market hours.
