# Global Market Calendars & Multi-Timezone Architecture

## 1. Multi-Timezone Engine

Financial markets operate across disparate timezones and calendar regimes:
- **India Standard Time (IST / UTC+05:30)**: NSE, BSE, MCX, NCDEX, RBI, AMFI.
- **Eastern Time (EST/EDT / UTC-05:00 / UTC-04:00)**: NYSE, NASDAQ, CME, NYMEX, COMEX, CBOE.
- **Greenwich Mean Time (GMT/BST / UTC+00:00 / UTC+01:00)**: LSE, ICE.
- **Central European Time (CET/CEST / UTC+01:00 / UTC+02:00)**: XETRA, Euronext, SIX.
- **Japan Standard Time (JST / UTC+09:00)**: TSE.
- **Hong Kong Time (HKT / UTC+08:00)**: HKEX.

`MarketCalendarService` computes session states using exact timezone offsets, daylight saving adjustments, and exchange trading calendars.

---

## 2. Holiday Calendars & Session State Transitions
Every market quote evaluated in MarketScope computes one of six distinct session states:
1. `REGULAR_SESSION`: Trading active within official exchange hours.
2. `PRE_OPEN`: Pre-market order accumulation and discovery auction.
3. `POST_CLOSE`: Post-closing settlement and volume-weighted average price discovery.
4. `CLOSED`: Outside regular trading sessions on business days.
5. `WEEKEND`: Exchange closed for standard weekend.
6. `HOLIDAY`: Exchange closed for statutory holiday (e.g. Diwali, Independence Day, Thanksgiving, Christmas).

When a market transitions to `CLOSED` or `HOLIDAY`, the last traded price is locked, percentage change is calculated against the official previous settlement price, and the quote is tagged with `data_status: "EOD_CLOSED"`.
