# MarketScope.io — Phase 4: Data Quality, Validation Rules & Market Calendar

## 1. Overview & Operational Integrity

Financial decision-making relies strictly on data integrity. A single malformed quote (such as an extra zero from floating point representation, an unadjusted stock split, or an inverted sign) degrades user trust and invalidates quantitative analysis.

This document defines MarketScope's end-to-end data validation engine, mathematical precision standards, session calendars, and automated anomaly detection systems.

---

## 2. Ingestion Validation Rules

Every quote entering MarketScope from any upstream adapter must pass the automated validation pipeline before being admitted to the cache or broadcast over WebSockets.

### Rule 1: Non-Zero & Positive Price Rule
- `price > 0.0` (equities, indices, commodities, currencies).
- Exception: Extreme derivative or energy contracts that can technically settle negative (e.g. WTI April 2020) are flagged and isolated; spot equities must NEVER be zero or negative.
- If `price <= 0`, the quote is discarded and an anomaly event is logged.

### Rule 2: Upper / Lower Circuit & Jump Anomaly Filter
- For Indian equities, SEBI mandates dynamic circuit bands: typically 5%, 10%, or 20% depending on the surveillance category (ASM/GSM) and F&O inclusion.
- **Rule**: If `abs(change_pct) > 25.0%` for an equity within a single session without a verified corporate action or index event:
  - The quote is flagged as `SUSPECT_PRICE_JUMP`.
  - It is cross-checked against secondary vendors (FMP / TrueData) before replacing the display price.
  - Prevents erroneous vendor bad ticks (e.g., flash crash artifacts or vendor feed errors) from corrupting user portfolios and screeners.

### Rule 3: Mathematical Consistency of Change & Change %
- Floating point arithmetic (IEEE 754) introduces drift (e.g., `24480.20 - 24367.80 = 112.40000000000327`).
- In MarketScope, all price deltas are computed using Python `Decimal` or strict fixed-precision rounding:
  $$\Delta = \text{round}(P_{\text{current}} - P_{\text{previous\_close}}, 4)$$
  $$\Delta\% = \text{round}\left(\frac{\Delta}{P_{\text{previous\_close}}} \times 100, 4\right)$$
- If the incoming vendor payload contains a `change` or `change_pct` that deviates from the calculated value by more than $0.05\%$, the backend recalculates and overwrites it with the true mathematical value.

### Rule 4: Bid-Ask Spread Validity
- For quotes containing order book L1 data:
  $$\text{Bid} \le \text{Ask}$$
  $$\text{Spread} = \text{Ask} - \text{Bid} \ge 0$$
- If $\text{Bid} > \text{Ask}$ (a crossed book), the quote is marked as an exchange auction anomaly or stale order book.

### Rule 5: Tick Size Alignment
- Indian Equities (NSE/BSE): Valid prices must align with exchange tick sizes (standard 0.05 INR for stocks > 15 INR, 0.01 INR for sub-penny stocks).

---

## 3. Freshness Classification State Machine

Every instrument display is assigned one of five unambiguous data states:

| State | Definition | Visual Indicator | Criteria |
|---|---|---|---|
| `LIVE` | Real-time exchange stream | **Green Pulse Badge (`LIVE`)** | Timestamp within 30 seconds of current UTC, during exchange open hours, from licensed real-time feed. |
| `DELAYED_15M` | Free/Standard tier vendor feed | **Amber Badge (`15M DELAY`)** | Exchange rules mandate 15-minute delay for uncredentialed/public redistribution feeds. |
| `CLOSED` | Regular session completed | **Slate/Muted Badge (`CLOSED`)** | Exchange trading day has concluded. Displays official final closing price. |
| `EOD` | End-Of-Day settlement record | **Blue Badge (`EOD`)** | Official closing price from bhavcopy or official exchange closing report. |
| `SYNTHETIC_DEVELOPMENT` | Local offline / unit test fixtures | **Purple Badge (`DEV MOCK`)** | Explicitly flagged for local developer environments when no API keys are present. **Never disguised as live.** |

---

## 4. Multi-Exchange Trading Hours & Calendar Matrix

### 4.1 Exchange Session Schedules

| Exchange | Time Zone | Pre-Open / Pre-Market | Regular Trading Session | Post-Closing Session |
|---|---|---|---|---|
| **NSE (India)** | IST (UTC+5:30) | 09:00 — 09:15 IST | **09:15 — 15:30 IST** | 15:40 — 16:00 IST |
| **BSE (India)** | IST (UTC+5:30) | 09:00 — 09:15 IST | **09:15 — 15:30 IST** | 15:40 — 16:00 IST |
| **MCX (Commodities)** | IST (UTC+5:30) | N/A | **09:00 — 23:30 / 23:55 IST** | N/A |
| **NYSE / NASDAQ (US)** | EST/EDT (UTC-5 / -4) | 04:00 — 09:30 EST | **09:30 — 16:00 EST** | 16:00 — 20:00 EST |
| **LSE (UK)** | GMT/BST (UTC+0 / +1) | 07:50 — 08:00 GMT | **08:00 — 16:30 GMT** | 16:30 — 16:35 GMT |
| **FOREX / FX** | UTC | N/A | **Sun 22:00 UTC — Fri 22:00 UTC (24/5)** | N/A |

### 4.2 Indian Market Holidays (NSE / BSE Calendar 2026/2027)
Trading is closed on Saturdays, Sundays, and official national clearing holidays:
- Republic Day (Jan 26)
- Mahashivratri (Feb/Mar)
- Holi (Mar)
- Good Friday (Mar/Apr)
- Dr. Ambedkar Jayanti (Apr 14)
- Ram Navami / Mahavir Jayanti (Apr)
- Maharashtra Day (May 01)
- Bakri Id / Eid-ul-Adha (Jun)
- Muharram (Jul)
- Independence Day (Aug 15)
- Mahatma Gandhi Jayanti (Oct 02)
- Dussehra (Oct)
- Diwali Laxmi Pujan (*Special 1-hour Muhurat Trading Session in evening, otherwise closed*)
- Diwali Balipratipada (Oct/Nov)
- Gurunanak Jayanti (Nov)
- Christmas (Dec 25)

---

## 5. Automated Data Quality Monitoring & Health API

MarketScope provides an operational data quality health endpoint:
`GET /api/v1/data/quality`

This endpoint monitors:
1. **Provider Uptime & Latency**: Round-trip response time (ms) for Twelve Data, FMP, and licensed feeds.
2. **Staleness Metrics**: Count of instruments whose last tick is older than session limits.
3. **Reconciliation Discrepancies**: Variance between primary and secondary feeds.
4. **WebSocket Active Connections**: Real-time connected clients receiving broadcast updates.
