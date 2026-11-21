# Market Data Administration & Infrastructure Control Panel

## 1. Overview & Capabilities

The Market Data Administration Panel (`apps/web/src/app/admin/market-data/page.tsx`) provides operations, compliance, and engineering teams with continuous visibility into MarketScope's data ingestion pipeline:

```
+---------------------------------------------------------------------------------------+
|                       MARKETSCOPE MARKET DATA ADMINISTRATION                          |
|  Active Gateways: 6/6 Online  |  Avg Ingestion Latency: 235ms  |  Tracked: 124+ Assets |
+---------------------------------------------------------------------------------------+
|  PROVIDER GATEWAY       |  TIER       |  EXCHANGES       |  LATENCY  |  STATUS       |
|  Live Direct Engine     |  PARTNER    |  NSE, BSE, US... |  280 ms   |  HEALTHY      |
|  Twelve Data Gateway    |  COMMERCIAL |  NYSE, LSE, FX   |  420 ms   |  HEALTHY      |
|  Financial Modeling Prep|  COMMERCIAL |  SEC, Global     |  310 ms   |  HEALTHY      |
|  FRED St. Louis Fed     |  GOVT OPEN  |  US Treasury     |  195 ms   |  HEALTHY      |
|  AMFI Mutual Fund Portal|  GOVT OPEN  |  AMFI Members    |  120 ms   |  HEALTHY      |
|  RBI DBIE / FBIL Rates  |  GOVT OPEN  |  RBI Central Bank|  85 ms    |  HEALTHY      |
+---------------------------------------------------------------------------------------+
```

---

## 2. Key Monitoring Dimensions
1. **Provider Availability & Latency Benchmarks**: Millisecond-level tracking of HTTP socket response times and network roundtrips.
2. **Licensing Tiers & Permitted Distribution**: Continuous audit of partner, commercial, and government-open licenses.
3. **Ingestion Delivery Modes**: Real-time streaming (<1500ms), 15-minute delayed feeds, official daily fixings (RBI 13:30 IST), and daily EOD NAVs (AMFI 21:00 IST).
4. **Statutory Non-Brokerage Certification**: Transparently displays platform non-brokerage guarantees and compliance with RBI LRS, FEMA 1999, and SEBI regulations.
