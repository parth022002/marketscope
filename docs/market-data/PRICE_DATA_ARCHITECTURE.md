# MarketScope.io — Price Data Architecture & Ingestion Pipeline

## 1. System Overview & Core Principles

MarketScope.io's price data architecture is designed from the ground up for high reliability, verifiable provenance, and absolute numerical precision. As an institutional-grade research platform complying with SEBI non-brokerage guidelines and DPDP Act 2023, the system adheres to four uncompromised design tenets:

1. **Zero Fabrication Policy**: Synthetic development fixtures are strictly partitioned and visibly flagged as `SYNTHETIC_DEVELOPMENT`. No live claim is ever rendered without cryptographic provider provenance and timestamp proof.
2. **Fixed-Point Numerical Exactness**: All financial price calculations (absolute change, percentage change, multi-currency conversion, lot sizing) are executed using Python's `Decimal` and IEEE-754 fixed-precision standards to eliminate floating-point drift.
3. **Multi-Tier Cascade with Transparent Fallback**: Ingestion prioritizes direct exchange feeds, cascades to authorized commercial vendors (Twelve Data, FMP), and gracefully falls back to calibrated reference models if networks or quotas fail.
4. **Dual-Timestamp Auditability**: Every incoming tick records both the upstream exchange matching engine timestamp (`timestamp`) and the internal ingestion gateway timestamp (`received_at`).

---

## 2. End-to-End Data Pipeline Architecture

```
                                [Global & Domestic Exchanges]
                             (NSE, BSE, MCX, NASDAQ, NYSE, LME)
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
            [Primary Exchange Feed]                     [Licensed Commercial APIs]
           (LiveExchangeProvider / FX)                  (Twelve Data / FMP Cloud)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                ┌─────────────────────────┐
                                │   Ingestion Gateway     │
                                │ (app/providers/base.py) │
                                └────────────┬────────────┘
                                             ▼
                                ┌─────────────────────────┐
                                │   Instrument Identity   │
                                │        Resolver         │
                                │ (instrument_resolver.py)│
                                └────────────┬────────────┘
                                             ▼
                                ┌─────────────────────────┐
                                │   Decimal Calculation   │
                                │    & Validation Engine  │
                                │(price_calculation_serv) │
                                └────────────┬────────────┘
                                             ▼
                                ┌─────────────────────────┐
                                │   Canonical Price Model │
                                │   (canonical_price.py)  │
                                └────────────┬────────────┘
                                             ▼
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
              [L1 In-Memory Cache]                       [L2 Redis Shared Cache]
             (Active TTL: 5s / 300s)                     (Cross-Worker Cluster)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                ┌─────────────────────────┐
                                │   Market Data Service   │
                                │ (market_data_service.py)│
                                └────────────┬────────────┘
                                             ▼
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             [FastAPI REST Engine]                      [WebSocket Broadcast Hub]
            (/api/v1/market/overview)                   (/ws/market/stream)
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                [Next.js Institutional Frontend]
                         (MarketTicker, OverviewCard, PerformanceChart)
```

---

## 3. Layer Breakdown

### A. Ingestion Gateway & Identity Resolver
- Normalizes disparate vendor symbologies (e.g. `^NSEI`, `NSE:NIFTY`, `NIFTY50`) into canonical symbols (`NIFTY 50`).
- Disambiguates complex multi-market instruments (e.g. COMEX Gold `GC=F` in USD/oz vs MCX Gold `GOLDM` in INR/10g).
- Normalizes scaling quirks (e.g. CBOE `^TNX` yield quote scaled by 10x is normalized to true percentage yield).

### B. Validation & Anomaly Guard
- Evaluates OHLC logical consistency: $Low \le Open, Close \le High$.
- Prevents division by zero on IPO or split-adjusted previous closes.
- Flags and logs price jump anomalies (>35% absolute swing from previous close) into an auditable administrative telemetry log.

### C. Multi-Tier Caching & Deduplication
- **L1 In-Memory Cache**: High-concurrency `CachedQuote` structure keyed by `SYMBOL:EXCHANGE`. Open market TTL is 5.0 seconds; closed market / weekend TTL is 300.0 seconds.
- **L2 Distributed Redis Cache**: Key namespace `marketscope:quote:{KEY}` with atomic TTL expiry for horizontally scaled worker nodes.

### D. Streaming & Consumption
- Non-blocking asynchronous FastAPI background publisher.
- WebSocket stream `/ws/market/stream` broadcasting JSON delta ticks with sequence numbers and heartbeat ping/pong keepalive.
