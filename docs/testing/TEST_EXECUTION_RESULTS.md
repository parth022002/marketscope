# MarketScope.io — Test Execution Results

## Test Run Summary
- **Execution Date**: 2026-11-22
- **Test Runner**: Pytest 9.2.0 (Python 3.15.1)
- **Environment**: Automated CI Harness & Multi-DB Test Fixtures
- **Status**: **106 PASSED, 0 FAILED, 0 REGRESSIONS (100% PASS RATE)**
- **Duration**: 5.56 seconds

## Detailed Test Suite Breakdown

| Test Suite File | Tests Collected | Passed | Failed | Coverage Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `test_api.py` | 4 | 4 | 0 | Health check, universal search, research disclaimer, 404 handling. |
| `test_backtesting_and_paper_trading.py` | 2 | 2 | 0 | Strategy MA crossover causality, virtual paper trading order fill lifecycle. |
| `test_charting_and_indicators.py` | 12 | 12 | 0 | OHLCV daily/intraday bars, SMA, RSI, MACD, Bollinger, Supertrend, drawing annotations, layout persistence. |
| `test_derivatives_engine.py` | 4 | 4 | 0 | Black-Scholes Greeks bounds, options chain ladder, futures build-up, market flow intelligence. |
| `test_global_markets_expansion.py` | 12 | 12 | 0 | Exchange registry, investment access engine rules, universal search, derivatives pulse, FX, commodities. |
| `test_market_data_infrastructure.py` | 12 | 12 | 0 | Market calendars (NSE, US, Forex), float precision, anomaly detection, fallback provider, ticker REST & WS. |
| `test_news_intelligence_system.py` | 12 | 12 | 0 | Timestamp preservation, entity resolution, causal market impact, news API integration. |
| `test_phase2_phase3.py` | 8 | 8 | 0 | Financial statements (annual/quarterly), golden financial ratios, peer comparison, screener presets, watchlists. |
| `test_phase4.py` | 5 | 5 | 0 | Data freshness, Indian equity feeds, DPDP user data export and purge cascade. |
| `test_phase5.py` | 3 | 3 | 0 | Grounded financial research synthesis, unknown symbol abstention, custom focus analysis. |
| `test_phase6_hardening.py` | 2 | 2 | 0 | Deep health probe, sliding-window rate limiter under traffic. |
| `test_price_accuracy_and_reliability.py` | 9 | 9 | 0 | Decimal precision, MCX gold parity, yield normalization, currency conversion, boundary validation. |
| `test_redesign_endpoints.py` | 6 | 6 | 0 | Market ticker, overview, heatmap, news feeds, calendar events. |
| `test_screener_engine.py` | 3 | 3 | 0 | Presets endpoint, ROE/Debt multi-factor query, Sector/PE query. |
| `test_stock_discovery_and_search.py` | 11 | 11 | 0 | Exchange registry, exact symbol, company name, ISIN, cross-listing, dynamic dossier generation. |
| `test_vertical_slice.py` | 4 | 4 | 0 | Instrument resolution, metric evidence detail, research notes CRUD. |
| **Total** | **106** | **106** | **0** | **Complete System Verification** |

---

## Frontend Compilation Verification
- **Command**: `npm run build`
- **Target**: `apps/web` (Next.js 15.2.8, React 19.0.0, TypeScript 5.8.2)
- **Result**: **28 / 28 routes compiled successfully with 0 TypeScript or linting errors**.
