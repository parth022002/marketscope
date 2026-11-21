# Automated Data Quality Validation & Cross-Provider Reconciliation

## 1. Validation Rules Engine

To protect researchers from data anomalies, corrupted feeds, or flash-crash spikes, the Data Quality Engine enforces real-time validation checks on all incoming market quotes:

1. **Price Boundary Check**:
   $$Price > 0$$
   Any quote with price $\le 0$ is rejected and triggers fallback resolution.

2. **Bid/Ask Spread Sanity**:
   $$Ask \ge Bid$$
   Crossed markets ($Bid > Ask$) are flagged as anomalies.

3. **Percentage Change Formula Integrity**:
   $$Change = Price - PreviousClose$$
   $$ChangePct = \left(\frac{Change}{PreviousClose}\right) \times 100$$
   Ensures zero floating-point drift using exact rounding to 2-4 decimal places.

4. **Flash Spike & Anomaly Detection**:
   $$\left|\frac{Price - PreviousClose}{PreviousClose}\right| > 0.35$$
   Any intraday price move exceeding 35% in an individual equity or index without a confirmed corporate action triggers anomaly review and requires secondary provider confirmation before display.

5. **Cross-Provider Price Reconciliation**:
   For dual-listed or concurrently reported tickers (e.g. Reliance on NSE vs BSE, or Gold on MCX vs COMEX converted to INR), prices are cross-compared to ensure arbitrage spreads remain within physical transport/tariff boundaries.

---

## 2. Freshness Monitoring & Quality Reports
The `/api/v1/data/quality` endpoint generates real-time health reports:
- Number of instruments monitored.
- Real-time streaming count vs. delayed count vs. EOD closed count.
- Provider response latency percentiles (P50, P95, P99).
- Total anomalies detected and suppressed in the last 24 hours.
