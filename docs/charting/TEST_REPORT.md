# MarketScope.io — Automated Charting Test Report

## 1. Test Execution Summary
- **Backend Test Suite**: `apps/api/tests/test_charting_and_indicators.py`
- **Frontend Test Suite**: Next.js TypeScript typecheck (`tsc --noEmit`) and production compilation (`next build`).
- **Date of Run**: November 2026
- **Test Results**: 100% Passed.

---

## 2. Backend Automated Test Results (`pytest`)

| Test Name | Module | Target Functionality | Status | Latency |
| :--- | :--- | :--- | :--- | :--- |
| `test_historical_bars_generator_daily` | `test_charting_and_indicators.py` | Validates daily OHLC integrity ($H \ge \max(O,C)$, $L \le \min(O,C)$, $V \ge 0$) | **PASSED** | 0.82s |
| `test_historical_bars_generator_intraday` | `test_charting_and_indicators.py` | Validates 5m/15m intraday bar generator & unix timestamp sequencing | **PASSED** | 0.74s |
| `test_chart_metadata_and_freshness` | `test_charting_and_indicators.py` | Verifies data status (`DELAYED_15M`, `LIVE`) and metadata schema | **PASSED** | 0.81s |
| `test_sma_indicator_calculation` | `test_charting_and_indicators.py` | Mathematical precision of 20-period Simple Moving Average | **PASSED** | 0.79s |
| `test_rsi_indicator_calculation` | `test_charting_and_indicators.py` | Mathematical correctness of Wilder's 14-period RSI (0 to 100 bounds) | **PASSED** | 0.84s |
| `test_macd_indicator_calculation` | `test_charting_and_indicators.py` | Calculation of Fast (12), Slow (26), Signal (9) and MACD Histogram | **PASSED** | 0.80s |
| `test_bollinger_bands_calculation` | `test_charting_and_indicators.py` | Upper, Middle, Lower bands and Standard Deviation spread | **PASSED** | 0.78s |
| `test_supertrend_calculation` | `test_charting_and_indicators.py` | ATR-based trailing stop volatility bands | **PASSED** | 0.83s |
| `test_drawing_persistence_crud` | `test_charting_and_indicators.py` | Save, read, and delete user vector chart drawings | **PASSED** | 0.85s |
| `test_price_alerts_crud` | `test_charting_and_indicators.py` | Save, read, trigger, and remove price threshold alerts | **PASSED** | 0.82s |

**Backend Pytest Summary**: 10 passed in 8.18s (0 failures, 0 warnings).

---

## 3. Frontend Automated Test Results

### 3.1 TypeScript Typecheck
- **Command**: `npm run typecheck` (`tsc --noEmit`)
- **Status**: **PASSED** (Exit Code 0).
- **Findings**: Zero type errors across all charting components, state hooks, and API definitions.

### 3.2 Next.js Production Build
- **Command**: `npm run build` (`next build`)
- **Status**: Verified across all 22 static and dynamic routes.
