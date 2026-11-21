# Known Limitations & Continuous Enhancement Roadmap

## 1. Provider-Specific Technical Constraints

1. **Free Tier Twelve Data Indian Equities Restriction**:
   - *Limitation*: Twelve Data returns HTTP 404 for Indian stock tickers on free developer tier API keys.
   - *Mitigation*: MarketScope routes domestic Indian equities and indices through `LiveExchangeProvider` (`yf.fast_info`) which delivers real-time market data without commercial plan restrictions.

2. **Official AMFI NAV Ingestion Cadence**:
   - *Limitation*: Mutual fund Net Asset Values (NAVs) are declared by Asset Management Companies (AMCs) once per business day around 21:00–23:00 IST in accordance with SEBI guidelines; intraday real-time NAV calculation is only available for exchange-traded ETFs (e.g., NIFTYBEES).
   - *Mitigation*: Mutual funds are clearly timestamped with the official valuation date and labeled as `DOMESTIC_ACCESS (Daily NAV)`.

3. **RBI Reference Rates Frequency**:
   - *Limitation*: The Reserve Bank of India / FBIL publishes official foreign exchange reference benchmarks once daily at approximately 13:30 IST.
   - *Mitigation*: Currencies tab displays both the official statutory RBI reference rate (for tax/remittance benchmarking) alongside continuous interbank streaming FX rates.

4. **Terminal Sandbox Network Isolation**:
   - *Limitation*: In local sandboxed development environments where outbound external network sockets are blocked by policy, external network queries to Neon PostgreSQL or external APIs will fail with address resolution errors (`getaddrinfo failed`).
   - *Mitigation*: All core market intelligence services, calculations, regulatory engines, and fallback repositories operate independently in offline / micro-cached modes.

---

## 2. Enhancement Roadmap
- **Phase 13**: Direct FIX / FAST protocol connector integration for institutional colocation data feeds.
- **Phase 14**: Machine-learning driven macroeconomic sentiment score overlays across global news streams.
- **Phase 15**: Advanced Option Chain visualization with live Black-Scholes Greeks calculations (Delta, Gamma, Theta, Vega) for domestic NIFTY & BANKNIFTY contracts.
