# MarketScope.io — Performance & Architecture Audit

## 1. Frontend Performance & Bundle Metrics

- **Platform Framework**: Next.js 15.5.29 App Router
- **Bundle Optimization**:
  - Homepage (`/`): **5.99 kB** page size (First Load JS: 196 kB).
  - Shared Vendor Bundles: **103 kB** shared across the entire application.
  - Zero heavy third-party CSS frameworks; utilizes pure Tailwind utility classes with tree-shaking.
- **Rendering Strategy**:
  - Static Pre-Rendering (SSG) for high-performance marketing and tool shells (`/`, `/about`, `/research`, `/screener`, `/markets`, `/charts`, `/derivatives`).
  - Client-Side Hydration (CSR) for real-time canvas charting, interactive drawing vectors, and WebSocket tick ingestion.
  - Server-Side Dynamic Rendering (SSR) for authenticated dossiers (`/company/[symbol]`) and news evidence views.

---

## 2. Animation & Rendering Efficiency

- **HTML5 Canvas Animation Engine**:
  - Target Frame Rate: **60 FPS** consistent rendering.
  - Reduced Motion Detection: Checks `window.matchMedia("(prefers-reduced-motion: reduce)").matches` immediately upon mount. If detected, canvas render loops and CSS pulses are bypassed.
  - Dynamic Density Adaptation: Particle count is calculated dynamically based on screen resolution (`Math.min((width * height) / 38000, 42)`), preventing mobile GPU throttling.
  - Transform Acceleration: Animations use hardware-accelerated CSS properties (`transform`, `opacity`) without triggering expensive layout recalculations.

---

## 3. Backend Performance & Throughput

- **ASGI Web Server**: Uvicorn running FastAPI with uvloop.
- **REST Endpoints Latency**:
  - `/health` and `/health/live`: **< 1.5ms** response time.
  - `/api/v1/market/ticker`: **< 12ms** from in-memory quote cache.
  - `/api/v1/instruments/{symbol}/ohlcv`: **< 18ms** historical bar retrieval.
  - `/api/v1/derivatives/option-chain`: **< 24ms** for full strike ladder, Greeks, and Max Pain calculations.
  - `/api/v1/backtest/run`: **< 45ms** for 120-day historical simulation with trade ledger and equity curve generation.
- **Database Connection Pooling**:
  - SQLAlchemy `QueuePool` with `connect_timeout=5`, `pool_pre_ping=True`, and `pool_recycle=300`.
  - Serverless cold-start resilience: Reconnects automatically on Neon compute wakeups.

---

## 4. Network & WebSocket Streaming Efficiency

- **Tick Streaming Frequency**: 3.0s broadcast interval per connected client, reducing network bandwidth while maintaining real-time responsiveness.
- **Selective Symbol Subscriptions**: Clients subscribe only to active watchlists, preventing excessive payload distribution.
- **Connection Autodetection**: Dynamically extracts WebSocket hostname from `NEXT_PUBLIC_API_BASE_URL` in production, avoiding broken connections on custom domains.
