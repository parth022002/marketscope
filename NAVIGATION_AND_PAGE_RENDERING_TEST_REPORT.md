# MarketScope.io — Navigation & Page Rendering Test Report

**Test Run Date:** November 23, 2026  
**Environment:** Next.js 15.5 Production Build (`http://localhost:3000`) & Local FastAPI Backend (`http://127.0.0.1:8000`)  
**Test Suite:** Playwright Automated E2E Navigation & Component Verification  

---

## 1. Test Methodology

Each core application route was verified through headless browser automation:
1. Navigated directly to the URL route.
2. Verified HTTP response status `200 OK`.
3. Asserted presence and visibility of the `NavigationShell` (left sidebar & header).
4. Asserted presence and visibility of route-specific main content containers.
5. Monitored console messages for unhandled runtime exceptions, React hydration errors, or WebSocket reconnection floods.
6. Triggered user interactions (switching tabs, clicking watchlist buttons, searching tickers).

---

## 2. Test Execution Results

| Route Tested | HTTP Status | Shell Visible | Main Content Rendered | Data Displayed | Console Errors | Verdict |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/overview` | 200 | YES | YES | Indices, chart, heatmap, news | 0 | **PASS** |
| `/markets` | 200 | YES | YES | 4 asset classes, mood, movers | 0 | **PASS** |
| `/discover` | 200 | YES | YES | Stock screener cards & filters | 0 | **PASS** |
| `/watchlists` | 200 | YES | YES | Watchlists, symbols, metrics | 0 | **PASS** |
| `/portfolio` | 200 | YES | YES | Valuation KPIs, holdings table | 0 | **PASS** |
| `/research` | 200 | YES | YES | Financial models & statements | 0 | **PASS** |
| `/charts` | 200 | YES | YES | Multi-pane charts & watchlist | 0 | **PASS** |
| `/intelligence`| 200 | YES | YES | AI research terminal & prompts | 0 | **PASS** |
| `/alerts` | 200 | YES | YES | Alert rules & history log | 0 | **PASS** |
| `/help` | 200 | YES | YES | API guide & documentation | 0 | **PASS** |
| `/settings` | 200 | YES | YES | Configuration form controls | 0 | **PASS** |

---

## 3. Real-Time WebSocket Verification

- **Connection Test:** Initiated WebSocket connection to `ws://localhost:8000/ws/v1/market-data`.
- **Message Delivery:** Successfully received live price updates across test symbols.
- **Error Monitoring:** Zero occurrences of `ERR_INSUFFICIENT_RESOURCES` or socket storms.
- **Fallback Verification:** When backend was intentionally stopped, the application seamlessly switched to static canonical snapshots and continued rendering with no UI freezing.
