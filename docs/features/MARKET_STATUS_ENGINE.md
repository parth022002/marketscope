# Market Status Engine Specification

## 1. Architectural Architecture & Session Resolution
The Market Status Engine (`app.engine.market_calendar`) calculates the authoritative, real-time operating state for every covered market bourse. Unlike naive static hour checks, the engine incorporates:
1. Multi-timezone transformations between local exchange time, Universal Coordinated Time (UTC), and client local time.
2. Holiday calendar evaluation with strict priority order.
3. Special trading sessions (e.g. Diwali Muhurat Trading occurring outside standard market days).
4. Dual-session commodity market mechanics (MCX morning vs. evening trading sessions).
5. Lunch break intervals (e.g., Tokyo Stock Exchange 11:30 - 12:30 JST).

## 2. Canonical Market Status Taxonomy
The engine outputs one of 10 strongly typed canonical states:
- `PRE_MARKET`: Order collection, matching, or price discovery phase prior to regular trading.
- `OPEN`: Continuous regular trading session actively executing trades.
- `BREAK`: Official mid-day exchange pause or lunch break (e.g. TSE, HKEX).
- `CLOSING_AUCTION`: End-of-day order accumulation and closing price determination.
- `POST_MARKET`: Post-close reporting, trade adjustment, or block deal execution.
- `CLOSED`: Standard out-of-hours state during regular business days or standard weekends.
- `HOLIDAY`: Full trading closure due to a gazetted public, national, or exchange holiday.
- `SPECIAL_SESSION`: Extraordinary scheduled trading session (e.g. Diwali Muhurat trading on weekends/evenings, disaster recovery mock trading).
- `EMERGENCY_CLOSED`: Extraordinary halt due to circuit breaker limits, technical disruption, or typhoon/extreme weather.
- `STATUS_UNAVAILABLE`: Fallback state when exchange connectivity or schedule data is unreachable.

## 3. High-Priority Special Case Handling
### A. Diwali Muhurat Trading Priority
Diwali Muhurat trading on the NSE and BSE typically takes place in the evening (e.g., 18:00 - 19:15 IST) and frequently coincides with a weekend (Saturday or Sunday). If the engine evaluated standard weekend closures first, Muhurat sessions would incorrectly report `CLOSED`. The engine specifically checks for `HolidayCategory.SPECIAL_SESSION` before the weekend check (`weekday in (5, 6)`), allowing special sessions to evaluate to `SPECIAL_SESSION` when the session window is active.

### B. Commodity Dual Sessions (MCX)
MCX observes distinct morning (09:00 - 17:00 IST) and evening (17:00 - 23:30/23:55 IST) trading sessions. On designated Indian holidays (e.g. Mahashivratri, Good Friday, Id-ul-Fitr, Bakrid, Ganesh Chaturthi, Diwali Balipratipada), the morning session is closed while the evening session is open to match international commodity trading hours (COMEX, NYMEX, LME). The engine accurately reflects this split:
- If current time is before 17:00 IST on a dual-session holiday, status is `HOLIDAY` with notice "MCX Evening Session opens at 17:00 IST".
- If current time is after 17:00 IST, status transitions to `OPEN`.

### C. Banking Closures vs. Stock Exchange Trading Holidays
On April 1 (Annual Bank Closing under NI Act), commercial banks, RTGS/NEFT clearing, and depository physical settlements are suspended. However, equity trading on NSE and BSE continues as a regular trading day. The engine explicitly classifies April 1 as `BANKING_HOLIDAY`, ensuring exchange trading status reports `OPEN` while settlement impact denotes `Settlement delayed to next working day`.
