# Data Architecture & Lineage Specification
**Platform:** MarketScope.io  

## 1. End-to-End Data Lineage Pipeline

```
[Primary Filings / API Feeds]
             │
             ▼
[Data Ingestion Gateway] ──────► [Compute SHA-256 Lineage Hash]
             │
             ▼
[DataQualityEngine Validation]
  ├── Non-negative price validation
  ├── Circuit limit jump bounds (< 80%)
  └── Accounting equation reconciliation (Assets >= Equity + Debt)
             │
             ▼
[Tag Provenance & Freshness State]
  (LIVE, DELAYED, END_OF_DAY, HISTORICAL, CALIBRATED_EOD)
             │
             ▼
[PostgreSQL Database / Redis Cache]
             │
             ▼
[Analytical & Quantitative Engines]
  (Q-Intelligence, Risk, Regime, DCF, Indicators)
             │
             ▼
[API Gateway (Correlation ID & Security Headers)]
             │
             ▼
[User Interface (Freshness Badge & Source Attribution)]
```

## 2. Immutability & Provenance
Every financial statement, price snapshot, and research note records:
- Source publication timestamp and exchange jurisdiction.
- Authoritative provider name (e.g., NSE Filings, BSE Gazette, US SEC).
- Cryptographic HMAC-SHA256 checksum to prevent silent payload modification.
