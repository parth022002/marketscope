# MarketScope.io — Known Limitations & Technical Blockers

This document transparently records all known technical limitations, infrastructure constraints, and external dependencies currently impacting market data operations.

---

## 1. Technical & Commercial Blockers

### Blocker 1: Licensed Real-Time Indian Equity Feed (NSE / BSE L1)
- **Status**: `BLOCKED` (Pending Commercial Subscription)
- **Description**: Accessing direct, un-delayed real-time Indian equities (L1 ticks for NIFTY 50 and NSE stocks) requires a commercial agreement with an authorized vendor such as TrueData or direct NSE Data & Analytics licensing.
- **Current Operational Mitigation**:
  - The provider adapter structure (`MarketDataProvider`) and configuration placeholders (`TRUEDATA_API_USER`, `TRUEDATA_API_PASSWORD`) are fully implemented.
  - Indian index levels are queried through Twelve Data commercial REST endpoints (`NIFTY 50:NSE`, `SENSEX:BSE`).
  - Where live feed credentials are not active, items are explicitly marked with `data_status="DELAYED_15M"` or `data_status="SYNTHETIC_DEVELOPMENT"`.

### Blocker 2: Vendor Rate Limits on Free Tier Keys
- **Status**: `OPERATIONAL MITIGATION IN PLACE`
- **Description**: Standard Twelve Data free/starter tiers enforce 8 API calls per minute.
- **Mitigation**:
  - `MarketDataService` enforces a strict L1 In-Memory TTL Cache (5 seconds during open market hours, 300 seconds during closed sessions).
  - Multi-symbol queries are batched in a single HTTP request (up to 20 symbols per call).
  - Multiple concurrent frontend clients consume quotes via the central WebSocket broadcast gateway without issuing duplicate external HTTP calls.

---

## 2. Known System Limitations

1. **Intraday Order Book L2/L3 (Market Depth)**:
   - MarketScope currently ingests Level 1 (LTP, Day High, Day Low, Volume, Prev Close). Full 5-depth or 20-depth order books are not streamed to the frontend, as MarketScope is a research and intelligence platform, not an active execution trading terminal.
2. **Options & Futures Chains**:
   - The current Instrument Master focuses on spot indices, equities, commodities, and currencies. Full derivative Greek modeling (Delta, Gamma, Vega) and options strike matrices are reserved for Phase 8 expansion.
3. **Sandbox Offline Test Database**:
   - In sandboxed environments without public internet access, unit tests cannot resolve remote Neon PostgreSQL DNS (`[Errno 11001] getaddrinfo failed`). In production and CI/CD, local Docker PostgreSQL or container networking resolves seamlessly.
