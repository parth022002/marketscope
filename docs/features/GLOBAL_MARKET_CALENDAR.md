# Global Market Calendar Specification

## 1. Overview & Objective
MarketScope.io provides institutional-grade market schedule and catalyst tracking across domestic Indian and premier international financial markets. The Global Market Calendar engine delivers real-time session tracking, multi-category economic event feeds, and an authoritative master repository of official exchange trading holidays and banking closures.

## 2. Supported Exchanges & Market Scope
The system monitors continuous trading sessions and holiday schedules across 8 key financial bourses and institutions:
1. **NSE (National Stock Exchange of India)**: Equity, Equity Derivatives, Currency, Debt. Timezone: `Asia/Kolkata` (IST, UTC+5:30).
2. **BSE (Bombay Stock Exchange)**: Equities and Mutual Funds. Timezone: `Asia/Kolkata`.
3. **MCX (Multi Commodity Exchange of India)**: Bullion (Gold/Silver), Base Metals, Energy (Crude/Natural Gas). Unique dual-session operational model.
4. **RBI (Reserve Bank of India)**: Banking holidays declared under Section 25 of the Negotiable Instruments (NI) Act, 1881.
5. **NYSE (New York Stock Exchange)**: Cash Equities and Options. Timezone: `America/New_York` (EST/EDT, UTC-5/UTC-4).
6. **NASDAQ**: Electronic Equities and Indices. Timezone: `America/New_York`.
7. **LSE (London Stock Exchange)**: UK Main Market. Timezone: `Europe/London` (GMT/BST).
8. **TSE (Tokyo Stock Exchange)**: Japanese Equities. Timezone: `Asia/Tokyo` (JST, UTC+9). Features formal lunch break closures.
9. **HKEX (Hong Kong Exchanges and Clearing)**: Hong Kong Equities. Timezone: `Asia/Hong_Kong` (HKT, UTC+8).

## 3. Dedicated User Interface (`/calendar`)
The calendar interface provides four integrated operational views:
- **Economic & Corporate Catalysts**: Central bank interest rate decisions (RBI MPC, US Fed FOMC, BoE, ECB), inflation releases (CPI, WPI), GDP prints, quarterly earnings reports, and dividend/AGM corporate actions.
- **Global Trading Hours & Live Status**: Matrix view displaying local market time, user local time, pre-market, regular, break, and post-market hours, along with live countdown timers.
- **Official Exchange Holiday Database**: Authoritative calendar distinguishing between full trading closures, dual-session operations, special trading sessions, and banking settlement suspensions.
- **Alerts & Preferences**: Customizable user preferences for primary market focus, 12h/24h military time display, preferred timezone conversions, and high-impact event emphasis.

## 4. API Endpoints
- `GET /api/v1/calendar/markets/status`: Global multi-market real-time status summary.
- `GET /api/v1/calendar/markets/{market_id}`: Granular status and countdown for an individual exchange.
- `GET /api/v1/calendar/market-hours`: Operating hours directory across all tracked bourses.
- `GET /api/v1/calendar/holidays`: Filterable holiday repository by year, exchange, and closure category.
- `GET /api/v1/calendar/events`: Economic indicator and corporate event catalyst schedule.
- `GET /api/v1/calendar/upcoming`: Rapid retrieval of high-impact upcoming catalysts.
- `GET /api/v1/calendar/preferences`: User display preferences.
- `PUT /api/v1/calendar/preferences`: Update preferences.
