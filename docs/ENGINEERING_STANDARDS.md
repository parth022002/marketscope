# MarketScope.io — Professional Software Engineering Standards

**Document Classification:** Engineering Governance & Architecture Policy  
**Target Audience:** Core Contributors, Full-Stack Engineers, Quantitative Analysts & Reviewers  
**Effective Date:** November 2026 (Release 2.0-Production)  

---

## 1. Architecture & Maintainability

- **Separation of Concerns:** Strict decoupling between presentation (`apps/web`), business compute and quantitative modeling (`apps/api`), persistence (`Neon PostgreSQL`), and caching (`Redis`).
- **Single-Responsibility Principle:** Every service class in the backend (`MarketDataService`, `QIntelligenceService`, `IndicatorEngine`, `PaperTradingService`) encapsulates a single domain with isolated dependencies.
- **Dependency Inversion:** Providers implement abstract protocols (e.g., `BaseMarketDataProvider`) allowing drop-in substitution between TwelveData, FMP, yfinance, and offline test mocks without touching core domain services.
- **Clean Contracts:** API request and response bodies use strict Pydantic models with explicit field validations. Frontend TypeScript interfaces mirror these models exactly to ensure compile-time contract safety.
- **Backwards Compatibility:** API endpoints follow semantic `/api/v1/` routing. Additive schema enhancements preserve existing field definitions.

---

## 2. Frontend Engineering (Next.js 15 & React 19)

- **TypeScript Strict Mode:** Enforced across all client code with `noImplicitAny: true` and `strictNullChecks: true`.
- **Component Isolation & Reusability:** Modular UI components in `src/components/` with well-defined prop interfaces.
- **Defensive Layout Constraints:** Every route wrapper strictly includes `min-w-0 max-w-full w-full overflow-hidden` to prevent CSS flex blowout from horizontally scrolling ticker widgets or high-density data tables.
- **3D Background Layering:** The 3D Three.js canvas is anchored at `z-0` with `pointer-events-none` styling and soft opacity, ensuring analytical widgets (`z-10`) maintain high contrast and responsive touch/mouse events.
- **State & Connection Resilience:**
  - WebSocket streams use defensive reconnection limits (maximum 5 retries with exponential backoff).
  - Continuous 7–8 second interval polling fallback guarantees data freshness even if WebSockets are blocked by restrictive corporate firewalls or VPNs.
- **Accessibility & UX:** Semantic HTML elements, ARIA labels for charts and inputs, dark-mode contrast compliance, and full keyboard navigation support.

---

## 3. Backend Engineering (FastAPI & Python 3.12+)

- **Typing & Validation:** Python 3.12+ type hints with Pydantic v2 schemas for all inputs, outputs, query parameters, and path variables.
- **Structured Error Handling:** Standardized HTTP error responses (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`, `500 Internal Server Error`) accompanied by structured JSON payloads `{ "detail": "..." }`.
- **Non-Blocking External Calls:** All upstream financial HTTP requests are dispatched using asynchronous `httpx.AsyncClient` with explicit 5-second timeouts and retry policies.
- **Zero-Crash Lifespan:** Background tasks (e.g., live market quote sync) run within managed `asyncio` task wrappers inside the FastAPI lifespan handler, catching and logging network drops without crashing application startup.
- **Structured Logging:** Centralized logging with timestamped format, log level, module name, and sanitized request contexts.

---

## 4. Database Engineering (PostgreSQL & Neon Serverless)

- **Connection Management:** Async SQLAlchemy with `psycopg3` binary driver. Connection pool pre-pinging (`pool_pre_ping=True`) handles serverless cold starts and prevents stale connection timeouts.
- **Relational Integrity:** Foreign key constraints, cascading deletions, and uniqueness constraints on composite keys (e.g., `(user_id, symbol)` on watchlists).
- **Index Optimization:** B-Tree indexes on frequently queried columns (`symbol`, `updated_at`, `user_id`, `created_at`).
- **Safe Rollback & Transactions:** Explicit transactional boundaries using `with db.begin():` contexts to guarantee atomic writes for virtual portfolio order fills and balance updates.

---

## 5. Financial Data Engineering

- **Decimal Precision Standards:** Zero floating-point drift. All price changes, percentage returns, and currency conversions use Python's standard `Decimal` type with explicit `ROUND_HALF_UP` rounding:
  - Equities & Indices: 2 decimal places (`0.01`)
  - Sovereign Yields & Fixed Income: 3 decimal places (`0.001`)
  - Foreign Exchange (FX): 4 decimal places (`0.0001`)
- **Canonical Instrument Identifiers:** Tickers are disambiguated by exchange suffixes (e.g., `RELIANCE.NS` for NSE, `TMPV.NS` for Tata Motors, `AAPL` for NASDAQ).
- **Status Attribution:** Market data payloads distinguish between `LIVE`, `DELAYED` (15-min), `END_OF_DAY`, `HISTORICAL`, and `SYNTHETIC_MOCK`. Synthetic data is strictly forbidden from being represented as live exchange data.
- **OHLCV Integrity Checks:** Enforces strict candlestick invariants: `High >= Open`, `High >= Close`, `Low <= Open`, `Low <= Close`, `Volume >= 0`.

---

## 6. Quantitative Algorithm Engineering (Q-Intelligence)

- **Deterministic Multi-Factor Scoring:** The Q-Intelligence model evaluates four orthogonal factor sleeves with documented weights:
  1. *Fundamental Quality (35%):* ROCE, Operating Margin stability, Net Debt / EBITDA.
  2. *Growth Momentum (25%):* 3-Year CAGR Revenue, EPS acceleration.
  3. *Technical Trend (20%):* 20/50/200 EMA alignment, 14-day Wilder RSI momentum.
  4. *Sentiment & Catalysts (20%):* Analyst revision drift, news sentiment polarity.
- **Percentile Normalization:** Raw factor values are winsorized at 1st and 99th percentiles to eliminate outlier distortions and mapped to 0–100 percentile scores.
- **Survivorship & Look-Ahead Bias Prevention:** Historical factor calculations use point-in-time financial data matching the filing release date rather than restated future figures.
- **Realistic Backtesting Mechanics:** Paper trading and backtesting engines model realistic slippage (0.05%), exchange transaction fees, and liquidity constraints based on Average Daily Volume (ADV).
- **Non-Advisory Mandate:** Quantitative outputs are explicitly presented as statistical research metrics, accompanied by SEBI/SEC non-advisory compliance notices.
