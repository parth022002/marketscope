# MarketScope.io — Performance Optimisation & Latency Tuning

## 1. Frontend Performance & Core Web Vitals
MarketScope.io targets top-tier Core Web Vitals:
- **Largest Contentful Paint (LCP)**: < 1.2s via Next.js SSR and font preloading (`next/font`).
- **First Input Delay (FID) / Interaction to Next Paint (INP)**: < 50ms through debounce optimization on ticker search inputs.
- **Cumulative Layout Shift (CLS)**: < 0.01 with fixed aspect-ratio containers for TradingView and Three.js canvases.

---

## 2. Backend & Quantitative Engine Optimisation
- **Vectorized Calculations**: All risk models, regime indicators, and anomaly scoring run on vectorized NumPy and SciPy operations rather than Python loops.
- **Multi-Level Caching**:
  - L1 (FastAPI Process Cache): In-memory LRU cache for high-frequency ticker metadata (TTL: 10s).
  - L2 (Redis Cluster): Shared cache for company financial statements, SEC filings, and Q-Scores (TTL: 3,600s).
- **Asynchronous I/O**: Upstream market data and news RSS feeds are fetched in parallel using `httpx.AsyncClient` with connection pooling.
