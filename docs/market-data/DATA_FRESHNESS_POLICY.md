# MarketScope.io — Data Freshness & Provenance Policy

## 1. Transparency Commitment

MarketScope.io is committed to complete transparency regarding data freshness. The platform adheres strictly to the rule:
> **Never fabricate prices or claim that a price is real-time without evidence.**

Every displayed price is paired with a clear, color-coded status badge and timestamp indicating its exact provenance and delivery latency.

---

## 2. Delivery Status Classifications & UI Treatment

| Classification | Definition | Refresh Latency | Frontend UI Badge | Color Coding |
| :--- | :--- | :---: | :--- | :--- |
| **`REAL_TIME_EXCHANGE`** | Live tick from exchange direct feed or licensed real-time redistributor | $< 1\text{ s}$ | `LIVE` / Pulsing Dot | Emerald Green (`#10B981`) |
| **`DELAYED_15M`** | Standard delayed market data with 15-minute statutory exchange embargo | $15\text{ min}$ | `15M DELAYED` | Amber Yellow (`#F59E0B`) |
| **`END_OF_DAY`** | Official daily closing or settlement price after exchange session close | Static Daily | `EOD CLOSE` | Cyan Blue (`#06B6D4`) |
| **`CLOSED`** | Market session currently closed (outside trading hours or holiday) | Static Session | `CLOSED` | Slate Grey (`#64748B`) |
| **`SYNTHETIC_DEVELOPMENT`** | Deterministic simulation fixture for offline development or sandbox testing | Deterministic | `DEV / FIXTURE` | Purple (`#8B5CF6`) |

---

## 3. Stale Data Detection Rules

An active quote is flagged as `PROBABLE_STALE` under the following conditions:
1. **Regular Trading Session**: The exchange is in `REGULAR_OPEN` status, but the quote's matching engine timestamp has not updated for $> 180\text{ seconds}$ (liquid equities and indices) or $> 600\text{ seconds}$ (illiquid instruments).
2. **WebSocket Keepalive**: The client has not received a tick or heartbeat within $15\text{ seconds}$ of an open WebSocket stream. The UI transitions the status indicator from `STREAM LIVE` to `RECONNECTING...`.
3. **Session Rollover**: At session close (e.g. 15:30 IST for NSE), active streaming ceases, and quotes transition to `CLOSED` / `EOD` status.
