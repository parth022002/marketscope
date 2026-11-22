# MarketScope.io — Backend Test Report

## 1. Test Execution Summary
- **Test Framework**: Pytest 9.2.0, AnyIO 4.16.0
- **Python Version**: 3.15.1
- **Platform**: Windows / Linux compatible
- **Execution Date**: 2026-11-22
- **Results**: **106 passed, 0 failed, 1 warning in 5.56 seconds (100% pass rate)**

---

## 2. Test Suites Executed

| Test Suite File | Tests Collected | Passed | Failed | Status |
| :--- | :---: | :---: | :---: | :---: |
| `apps/api/tests/test_api.py` | 4 | 4 | 0 | **PASSED** |
| `apps/api/tests/test_backtesting_and_paper_trading.py` | 2 | 2 | 0 | **PASSED** |
| `apps/api/tests/test_charting_and_indicators.py` | 12 | 12 | 0 | **PASSED** |
| `apps/api/tests/test_derivatives_engine.py` | 4 | 4 | 0 | **PASSED** |
| `apps/api/tests/test_global_markets_expansion.py` | 12 | 12 | 0 | **PASSED** |
| `apps/api/tests/test_market_data_infrastructure.py` | 12 | 12 | 0 | **PASSED** |
| `apps/api/tests/test_news_intelligence_system.py` | 12 | 12 | 0 | **PASSED** |
| `apps/api/tests/test_phase2_phase3.py` | 8 | 8 | 0 | **PASSED** |
| `apps/api/tests/test_phase4.py` | 5 | 5 | 0 | **PASSED** |
| `apps/api/tests/test_phase5.py` | 3 | 3 | 0 | **PASSED** |
| `apps/api/tests/test_phase6_hardening.py` | 2 | 2 | 0 | **PASSED** |
| `apps/api/tests/test_price_accuracy_and_reliability.py` | 9 | 9 | 0 | **PASSED** |
| `apps/api/tests/test_redesign_endpoints.py` | 6 | 6 | 0 | **PASSED** |
| `apps/api/tests/test_screener_engine.py` | 3 | 3 | 0 | **PASSED** |
| `apps/api/tests/test_stock_discovery_and_search.py` | 11 | 11 | 0 | **PASSED** |
| `apps/api/tests/test_vertical_slice.py` | 4 | 4 | 0 | **PASSED** |
| **Total** | **106** | **106** | **0** | **100% PASS** |

---

## 3. Mathematical & Engine Validation
- **Indicator Formulas**: Validated SMA, EMA, WMA, HMA, RSI, MACD, Bollinger Bands, ATR, Supertrend, Stochastic RSI, CCI, Williams %R, Ichimoku Cloud, and CMF against canonical ground truth.
- **Black-Scholes Greeks**: Delta, Gamma, Theta, and Vega satisfy standard theoretical bounds (\(\Delta \in [-1, 1], \Gamma > 0, \nu > 0\)).
- **Causality Check**: Verified zero lookahead bias in the backtesting simulator (orders generated on Bar \(t\) close execute on Bar \(t+1\) open).
- **Virtual Paper Trading**: Verified cash debit, spread modeling, and mark-to-market position updates.
