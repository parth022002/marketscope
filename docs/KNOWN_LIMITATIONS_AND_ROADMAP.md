# MarketScope.io — Known Limitations & Technical Roadmap

## 1. Known Coverage Limitations & Trade-Offs

1. **Market Holiday Trading Gaps:** Real-time exchange WebSocket streams for Indian (NSE/BSE) and US (NYSE/NASDAQ) markets operate during regional exchange hours. Outside trading windows, the system serves the last recorded closing prices persisted in Neon PostgreSQL.
2. **Third-Party API Rate Limits:** Free-tier or starter API keys for TwelveData (8 requests/min) and FMP are protected via Redis/memory caching and background sync intervals (15s minimum).
3. **Historical Tick Granularity:** Sub-minute tick-level historical data is computationally intensive; intraday charts support 1m, 5m, 15m, and 1h aggregated intervals.

---

## 2. Product Roadmap (Horizons 2 & 3)

### Horizon 2: Advanced Intelligence & Collaboration (Q1–Q2 2027)
- **Direct Broker Execution:** Integration with Zerodha Kite Connect, Upstox, and Interactive Brokers for live 1-click trade routing.
- **Algorithmic Backtesting Studio:** Visual strategy builder with Python code generation and walk-forward optimization.
- **Institutional PDF Export:** Generation of institutional equity research memos with custom watermarks and analyst notes.

### Horizon 3: Decentralized & Global Multi-Asset Expansion (Q3–Q4 2027)
- **Multi-Tenant Org Workspaces:** Team research hubs, compliance audit logs, and shared analyst watchlists.
- **Alternative Data Feeds:** Satellite imagery analysis, supply-chain graphs, and patent filings intelligence.
- **Autonomous Hedging Copilot:** Automated risk balancing and options strategy recommendation engine.
