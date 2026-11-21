# MarketScope.io — Phase 5: Frontend Market Data Integration Architecture

## 1. Principles of Frontend Market Data Consumption

To eliminate inconsistent prices, mismatched timestamps, and duplicate API network calls across different views, the MarketScope frontend enforces three architecture rules:

1. **Single Source of Truth**: Frontend components must NEVER call third-party market APIs (e.g., Yahoo Finance, Twelve Data, or FMP) directly from the browser. All market data flows strictly through the backend gateway (`/api/v1/market/*` and `/ws/v1/market-data`).
2. **Real-Time WebSocket Streaming with Fallback**: The client hook `useMarketWebSocket` establishes an asynchronous WebSocket connection for real-time tick streaming. If WebSockets are blocked (e.g. strict corporate proxy), the client falls back seamlessly to REST polling.
3. **Explicit Freshness Badges**: Every price display renders an unambiguous status badge (`LIVE`, `15M`, `CLOSED`, `EOD`, `DEV`) and currency indicator (`₹` for INR, `$` for USD).

---

## 2. Component Integration Matrix

| Frontend Component | File Path | Data Source | WebSocket Streaming | Status Badges Displayed |
|---|---|---|---|---|
| **Market Ticker Bar** | `apps/web/src/components/MarketTicker.tsx` | `/api/v1/market/ticker` + WebSocket | Yes (live tick merge) | `LIVE`, `15M`, `CLOSED`, `EOD`, `DEV` |
| **Market Overview Card**| `apps/web/src/components/MarketOverviewCard.tsx` | `/api/v1/market/overview` | Yes (prop passthrough) | `LIVE`, `15M`, `CLOSED`, `EOD`, `DEV` |
| **Index Performance Chart** | `apps/web/src/components/IndexPerformanceChart.tsx` | `/api/v1/market/overview` | Polling / Snapshot | Timeframe (1D, 1W, 1M, 1Y) with OHLC tooltip |
| **Top Companies Table**| `apps/web/src/components/TopCompaniesTable.tsx` | `/api/v1/market/overview` | Polling / Snapshot | Tabbed market cap, P/E, 24h Change |
| **Market Movers** | `apps/web/src/components/MarketMovers.tsx` | `/api/v1/market/overview` | Polling / Snapshot | Top Gainers, Losers, Most Active |
| **Company Page** | `apps/web/src/app/company/[symbol]/page.tsx` | `/api/v1/instruments/{id}/dossier` | REST Snapshot | Disclaimers, Sources, Regulatory filings |
| **Markets Hub** | `apps/web/src/app/markets/page.tsx` | `/api/v1/market/ticker` | Yes | Category tabs, sparklines, exchange pills |

---

## 3. The `useMarketWebSocket` Client Hook

Located at `apps/web/src/lib/useMarketWebSocket.ts`:
```typescript
const { isConnected, ticks, lastTickAt, subscribe } = useMarketWebSocket({
  symbols: ["NIFTY 50", "RELIANCE", "AAPL", "USD/INR"]
});
```

### Key Capabilities:
- **Automatic Reconnection**: Uses exponential backoff (`delay = min(1000 * 1.5^retry, 15000)` ms) upon network drop or server restart.
- **Dynamic Tick Merging**: Incoming `ticker_update` events update the internal state map `ticks[symbol]`, instantly reflecting new prices and percentage changes in subscribed components without re-rendering unrelated DOM trees.
- **Heartbeat & Keepalive**: Periodically handles ping/pong protocol frames to detect zombie TCP connections.
