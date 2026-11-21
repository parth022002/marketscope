# MarketScope.io — Market Calendar, Holiday & Timezone Engine

## 1. Multi-Exchange Timezone Coordination

MarketScope.io orchestrates market calendar resolution across global financial centers using `apps/api/app/engine/market_calendar.py`. All internal system operations operate on UTC timestamps, while exchange sessions are evaluated in their respective local timezones.

---

## 2. Supported Exchange Schedules

| Exchange Code | Full Name | Location | Local Timezone | Standard Trading Hours (Local) | Standard Trading Hours (UTC) |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **NSE** | National Stock Exchange | Mumbai, India | `Asia/Kolkata` (IST, UTC+5:30) | 09:15 - 15:30 | 03:45 - 10:00 |
| **BSE** | Bombay Stock Exchange | Mumbai, India | `Asia/Kolkata` (IST, UTC+5:30) | 09:15 - 15:30 | 03:45 - 10:00 |
| **MCX** | Multi Commodity Exchange | Mumbai, India | `Asia/Kolkata` (IST, UTC+5:30) | 09:00 - 23:30 / 23:55 | 03:30 - 18:00 / 18:25 |
| **NASDAQ** | Nasdaq Stock Market | New York, USA | `America/New_York` (EST/EDT) | 09:30 - 16:00 | 14:30 - 21:00 (EDT) |
| **NYSE** | New York Stock Exchange | New York, USA | `America/New_York` (EST/EDT) | 09:30 - 16:00 | 14:30 - 21:00 (EDT) |
| **LSE** | London Stock Exchange | London, UK | `Europe/London` (GMT/BST) | 08:00 - 16:30 | 08:00 - 16:30 (GMT) |
| **XETRA** | Deutsche Börse | Frankfurt, Germany | `Europe/Berlin` (CET/CEST) | 09:00 - 17:30 | 08:00 - 16:30 (CET) |
| **TSE** | Tokyo Stock Exchange | Tokyo, Japan | `Asia/Tokyo` (JST, UTC+9:00) | 09:00 - 15:30 (Lunch break) | 00:00 - 06:30 |
| **HKEX** | Hong Kong Exchanges | Hong Kong | `Asia/Hong_Kong` (HKT, UTC+8:00) | 09:30 - 16:00 | 01:30 - 08:00 |
| **FOREX** | Global Currency Market | Global (Continuous) | UTC | 24 Hours (Sun 22:00 - Fri 22:00) | Continuous |

---

## 3. Session State Resolution Logic

For any given instrument and timestamp:
1. **Weekend Check**: If local day is Saturday or Sunday, status is `WEEKEND`.
2. **Holiday Check**: Checked against exchange official holiday calendars (e.g. Diwali Laxmi Pujan, Independence Day, Christmas, New Year's Day). If matching, status is `HOLIDAY`.
3. **Pre-Market Window**:
   - NSE/BSE: 09:00 - 09:08 IST (Order collection) and 09:08 - 09:15 IST (Order matching).
   - US Markets: 04:00 - 09:30 EST.
4. **Regular Session**:
   - `is_regular_trading = True`. Cache TTL set to 5 seconds.
5. **Post-Market / Closing Session**:
   - NSE/BSE: 15:40 - 16:00 IST.
6. **Closed Session**:
   - Outside above hours. Cache TTL set to 300 seconds.
