# MarketScope.io — Backend Validation & Test Report

## 1. Test Execution Summary

- **Test Runner**: Pytest 9.2.0
- **Python Version**: Python 3.12 (Production) / Python 3.15.1 (Local venv)
- **Total Tests Executed**: **106 tests**
- **Passed**: **106 tests (100% pass rate)**
- **Failed**: **0 tests**
- **Execution Time**: **6.70 seconds**

---

## 2. Test Suite Breakdown by Functional Area

### A. Market Data Infrastructure (`test_market_data_infrastructure.py`)
- `test_market_calendar_nse_regular_session`: Confirms trading hours 09:15–15:30 IST. **PASSED**
- `test_market_calendar_nse_pre_open`: Confirms pre-open hours 09:00–09:15 IST. **PASSED**
- `test_market_calendar_nse_weekend_closed`: Confirms Saturday/Sunday market closure. **PASSED**
- `test_market_calendar_nse_holiday`: Confirms Diwali/Republic Day market holidays. **PASSED**
- `test_market_calendar_us_regular_session`: Confirms NYSE/NASDAQ regular hours. **PASSED**
- `test_price_change_precision_no_float_drift`: Confirms decimal rounding to 2/4 decimal places. **PASSED**
- `test_price_jump_anomaly_detection`: Flags abnormal 30%+ single-tick spikes. **PASSED**
- `test_fallback_provider_strictly_flags_synthetic`: Confirms offline fallbacks are tagged `SYNTHETIC_DEVELOPMENT`. **PASSED**
- `test_market_ticker_rest_endpoint`: Confirms continuous ticker quotes return 200 OK. **PASSED**
- `test_market_overview_rest_endpoint`: Confirms market pulse, movers, and sentiment return 200 OK. **PASSED**
- `test_market_instruments_catalog_endpoint`: Confirms canonical registry returns 200 OK. **PASSED**
- `test_data_quality_report_endpoint`: Confirms provider latency & quality telemetry. **PASSED**

### B. Interactive Charting & Indicators (`test_charting_and_indicators.py`)
- `test_ohlcv_daily_integrity`: Validates High >= Open/Close and Low <= Open/Close boundaries. **PASSED**
- `test_ohlcv_intraday_timestamps`: Confirms chronological bar ordering with zero time travel. **PASSED**
- `test_chart_package_endpoint`: Validates full chart payload with exchange timezone. **PASSED**
- `test_indicator_sma_calculation`: Mathematical verification of 14-period Simple Moving Average. **PASSED**
- `test_indicator_rsi_wilder_bounds`: Mathematical verification of 14-period RSI bounded within [0, 100]. **PASSED**
- `test_indicator_macd_and_histogram`: Mathematical verification of 12/26/9 MACD and signal line. **PASSED**
- `test_indicator_bollinger_bands`: Verification of 20-period SMA ± 2 standard deviations. **PASSED**
- `test_indicator_supertrend`: Confirms trend-following ATR bands and directional flips. **PASSED**
- `test_user_drawing_annotations_lifecycle`: CRUD verification of user geometric drawings. **PASSED**
- `test_price_alerts_lifecycle`: Creation, trigger condition check, and deletion of price alerts. **PASSED**
- `test_chart_layouts_lifecycle`: Persistence of Single, 2-Split, and 4-Grid workspaces. **PASSED**

### C. Derivatives & Market Flow (`test_derivatives_engine.py`)
- `test_black_scholes_greeks_bounds`: Confirms Call Delta [0, 1] and Put Delta [-1, 0]. **PASSED**
- `test_option_chain_endpoint`: Returns strike ladders, PCR, and Max Pain for underlying. **PASSED**
- `test_futures_buildup_endpoint`: 4-quadrant OI build-up classification across contracts. **PASSED**
- `test_market_flow_intelligence_endpoint`: Advance/Decline breadth and Mansfield RS return 200 OK. **PASSED**

### D. Quantitative Backtesting & Paper Trading (`test_backtesting_and_paper_trading.py`)
- `test_strategy_backtest_ma_crossover`: Zero-lookahead backtest with realistic slippage and trade ledger. **PASSED**
- `test_paper_trading_lifecycle`: Virtual account order placement, fee deduction, and balance reset. **PASSED**

### E. Stock Discovery & Search (`test_stock_discovery_and_search.py`)
- `test_exchange_registry_coverage`: Verifies NSE, BSE, NASDAQ, and NYSE metadata. **PASSED**
- `test_exact_symbol_search`: Validates instantaneous symbol match (e.g. `RELIANCE`). **PASSED**
- `test_company_name_search`: Validates fuzzy company name lookup. **PASSED**
- `test_isin_search`: Validates 12-character ISIN resolution (`INE002A01018`). **PASSED**
- `test_cross_listing_and_share_classes`: Validates multi-exchange listing disambiguation. **PASSED**
- `test_dynamic_dossier_arbitrary_stock`: Dynamic generation of 15 golden ratios from statements. **PASSED**

### F. Compliance & Privacy (`test_phase4.py`)
- `test_data_freshness_endpoint`: Returns data provenance tag and last-updated timestamp. **PASSED**
- `test_dpdp_user_data_export`: Generates full machine-readable JSON data export. **PASSED**
- `test_dpdp_purge_phrase_mismatch`: Enforces explicit confirmation phrase before deletion. **PASSED**
- `test_dpdp_purge_cascade_success`: Cascading permanent deletion of user notes, watchlists, and history. **PASSED**
