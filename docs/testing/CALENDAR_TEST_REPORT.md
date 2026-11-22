# Global Market Calendar Test Report

## 1. Test Summary
- **Test File**: `apps/api/tests/test_global_market_calendar.py`
- **Execution Engine**: Pytest with FastAPI TestClient
- **Total Tests**: 9 test suites
- **Passed**: 9/9 (100%)
- **Execution Duration**: < 0.8s

## 2. Test Cases Executed & Validated
1. `test_market_status_all_markets`: Validated that `GET /api/v1/calendar/markets/status` returns all tracked exchanges (NSE, BSE, MCX, RBI, NYSE, NASDAQ, LSE, TSE, HKEX) with valid session states.
2. `test_market_hours_directory`: Verified operating hours directory returns structured data with regular hours, pre-market, and lunch break fields for all international bourses.
3. `test_holiday_calendar_filters`: Verified filtering by year (2026), exchange (NSE, BSE, MCX), and category (`TRADING_HOLIDAY`, `BANKING_HOLIDAY`).
4. `test_bank_closing_distinction`: Verified that April 1 Annual Bank Closing correctly categorizes as `BANKING_HOLIDAY` under Section 25 of the Negotiable Instruments Act, maintaining trading operations on equity exchanges while suspending banking settlement.
5. `test_diwali_muhurat_special_session`: Verified that special trading session rules take precedence over weekend checks, ensuring Diwali Muhurat trading resolves correctly to `SPECIAL_SESSION` or `OPEN` rather than standard weekend `CLOSED`.
6. `test_mcx_dual_session_resolution`: Verified that on dual-session commodity holidays, morning session returns closed while evening session (17:00–23:30/23:55 IST) returns open.
7. `test_economic_and_corporate_events`: Validated events retrieval filtering across `CENTRAL_BANK`, `INFLATION`, `GDP`, `EARNINGS`, and `CORPORATE_ACTION`.
8. `test_upcoming_catalysts`: Confirmed high-impact catalyst retrieval with forecast, previous, and source attribution fields.
9. `test_calendar_user_preferences`: Validated `GET` and `PUT` user calendar preferences with custom followed markets and notification triggers.
