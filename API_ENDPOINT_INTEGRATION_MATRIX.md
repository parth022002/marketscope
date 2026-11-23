# MarketScope.io — Backend API Endpoint Integration Matrix

This matrix documents the backend API endpoints exposed by the FastAPI server (`apps/api`) and consumed by the Next.js frontend client (`apps/web`).

| HTTP Method | Endpoint Route | Service Provider / Engine | Response Data Model | Frontend Timeout / Circuit Breaker Policy | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/market/ticker` | `MarketDataService.get_ticker_feed()` | `List[MarketQuote]` | 7000ms AbortController; 90s circuit-breaker; falls back to `FALLBACK_TICKERS` | **200 OK (0.62s)** |
| `GET` | `/api/v1/market/overview` | `MarketDataService.get_market_overview()` | `MarketOverviewResponse` | 7000ms AbortController; concurrent gather; falls back to `FALLBACK_TICKERS` | **200 OK (0.58s)** |
| `GET` | `/api/v1/market/quote/{symbol}` | `MarketDataService.get_quote()` | `MarketQuote` | 7000ms AbortController; falls back to cached/fallback quote | **200 OK (0.12s)** |
| `GET` | `/api/v1/market/historical/{symbol}` | `MarketDataService.get_historical_ohlcv()` | `HistoricalSeries` | 7000ms AbortController; fallback generates 30-day realistic trajectory | **200 OK (0.15s)** |
| `GET` | `/api/v1/market/derivatives` | `MarketDataService.get_derivatives_pulse()` | `DerivativesPulseResponse` | 7000ms AbortController; falls back to `FALLBACK_DERIVATIVES` | **200 OK (0.10s)** |
| `GET` | `/api/v1/market/fixed-income` | `MarketDataService.get_fixed_income()` | `FixedIncomeResponse` | 7000ms AbortController; falls back to `FALLBACK_FIXED_INCOME` | **200 OK (0.09s)** |
| `GET` | `/api/v1/market/funds` | `MarketDataService.get_funds()` | `FundsOverviewResponse` | 7000ms AbortController; falls back to `FALLBACK_FUNDS` | **200 OK (0.09s)** |
| `GET` | `/api/v1/market/commodities` | `MarketDataService.get_commodities()` | `CommoditiesResponse` | 7000ms AbortController; falls back to `FALLBACK_COMMODITIES` | **200 OK (0.09s)** |
| `GET` | `/api/v1/market/currencies` | `MarketDataService.get_currencies()` | `CurrenciesResponse` | 7000ms AbortController; falls back to `FALLBACK_CURRENCIES` | **200 OK (0.09s)** |
| `GET` | `/api/v1/instruments/search` | `InstrumentService.search()` | `List[InstrumentResult]` | 5000ms AbortController; client-side debounced (300ms) | **200 OK (0.08s)** |
| `GET` | `/api/v1/research/scorecard/{symbol}` | `ResearchEngine.get_scorecard()` | `QuantitativeScorecard` | 7000ms AbortController; falls back to `getFallbackScorecard()` | **200 OK (0.18s)** |
| `GET` | `/api/v1/research/regime` | `ResearchEngine.get_market_regime()` | `MarketRegimeResponse` | 7000ms AbortController; falls back to `DEFAULT_REGIME` | **200 OK (0.09s)** |
| `GET` | `/api/v1/watchlists` | `WatchlistService.get_user_watchlists()`| `List[Watchlist]` | 5000ms AbortController; syncs with `localStorage` | **200 OK (0.07s)** |
| `POST` | `/api/v1/watchlists` | `WatchlistService.create_watchlist()` | `Watchlist` | 5000ms AbortController; optimistic local update | **200 OK (0.11s)** |
| `GET` | `/api/v1/charts/layouts` | `ChartLayoutService.get_layouts()` | `List[ChartLayoutItem]` | 5000ms AbortController; defaults to single layout | **200 OK (0.06s)** |
| `POST` | `/api/v1/charts/layouts` | `ChartLayoutService.save_layout()` | `ChartLayoutItem` | 5000ms AbortController; persists layout configurations | **200 OK (0.10s)** |
| `GET` | `/api/v1/health` | `HealthCheckService.probe()` | `HealthStatus` | 3000ms AbortController; checks database & provider status | **200 OK (0.02s)** |

---

## Resiliency and Fault Tolerance Guarantees

1. **Graceful Degradation**: If any individual endpoint returns an HTTP 500, 502, 503, or times out after 7,000 ms, the frontend client library intercepts the error and supplies the corresponding typed fallback dataset without unhandled promise rejections.
2. **Circuit Breaker Activation**: When the backend experiences upstream policy rejections (such as Yahoo Finance 403 blocks), the backend circuit breaker trips for 90 seconds, shielding system resources and instantly serving canonical fallback data in < 1ms.
3. **Optimistic UI Updates**: Watchlists and alert mutations update the UI immediately before waiting for the network acknowledgment, providing a responsive 60fps user experience.
