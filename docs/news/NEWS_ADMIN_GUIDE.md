# MarketScope.io — News Intelligence Administration & Moderation Guide

## 1. Administrative Overview

The News Intelligence Monitor (`/admin/news`) provides administrative operators with real-time operational control over source ingestion, licensing approvals, pipeline health, automated fact-checking logs, and user dispute moderation.

---

## 2. Key Administrative Consoles

### 2.1 Source Health & Rate Limit Telemetry
- Inspect active ingestion status across NSE, BSE, SEBI, RBI, PIB, SEC EDGAR, Reuters, Mint, and commercial APIs.
- Monitor provider API rate-limit utilization and circuit breaker status.
- Manually trigger an immediate out-of-band ingestion run for breaking events.

### 2.2 License & Rights Management Console
- Review pending news sources awaiting legal classification.
- Toggle source activation: `APPROVED_FOR_PRODUCTION`, `APPROVED_WITH_RESTRICTIONS`, or `DISABLED`.
- Enforce copyright compliance and non-full-text display boundaries.

### 2.3 Dispute & Moderation Queue
- View, investigate, and resolve user-submitted discrepancy reports.
- Issue formal corrections or retractions with automated audit trail logging.
- Correct misplaced entity tags or misattributed company symbols.
