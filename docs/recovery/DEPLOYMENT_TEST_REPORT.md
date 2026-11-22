# MarketScope.io — Deployment & Test Execution Report

## 1. Test Suite Summary

### Backend Pytest Suite
- **Command**: `apps/api/.venv/Scripts/python -m pytest apps/api/tests -q`
- **Total Tests Collected**: 109
- **Passed**: 109
- **Failed**: 0
- **Duration**: 5.87 seconds
- **Pass Rate**: **100%**

#### Test File Breakdown:
- `test_charting_and_indicators.py`: 15 passed (OHLC integrity, SMA, EMA, RSI, MACD, Bollinger, Supertrend, ADX, VWAP, ATR, OBV, drawings, layouts, alerts).
- `test_market_data_infrastructure.py`: 14 passed (Symbol resolution, ISIN lookup, quote models, currency conversion).
- `test_price_accuracy_and_reliability.py`: 12 passed (Price change calculation, zero division handling, spread validation).
- `test_stock_discovery_and_search.py`: 11 passed (Universal search, fuzzy matching, exchange filter).
- `test_news_intelligence_system.py`: 12 passed (Credibility tiers, evidence lineage, dispute tracking).
- `test_derivatives_engine.py`: 8 passed (Options chains, Greeks, Max Pain, PCR).
- `test_backtesting_and_paper_trading.py`: 10 passed (Backtest engine, virtual orders, portfolio balances).
- `test_screener_engine.py`: 6 passed (Multi-filter screening, sorting, pagination).
- `test_global_markets_expansion.py`: 9 passed (International equity profiles, forex rates, commodities).
- `test_api.py`, `test_phase2_phase3.py`, `test_phase4.py`, `test_phase5.py`, `test_phase6_hardening.py`, `test_vertical_slice.py`: 12 passed.

---

### Frontend Next.js Production Build
- **Command**: `npm --prefix apps/web run build`
- **Next.js Version**: 15.5.29
- **React Version**: 19.0.0
- **Total Routes Compiled**: 32 (Static & Dynamic)
- **Exit Code**: 0 (Clean Build)
- **Output Artifacts**: HTML pages, JS chunks, and SSR server handlers generated in `.next/`.

---

### Git & Remote Repository Status
- **Remote**: `https://github.com/parth022002/marketscope.git`
- **Branch**: `master`
- **Current Commit**: `5f8b172` (and recovery commit)
- **Working Tree**: Clean
