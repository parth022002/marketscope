# MarketScope.io — Privacy & Data Retention Policy

## 1. Data Minimization Principles
MarketScope.io operates on strict data minimization principles. We collect and retain only the minimal data necessary to deliver financial analytics, user watchlist persistence, and research history.

---

## 2. Data Categories & Retention Schedules

| Data Category | Specific Items | Retention Period | Storage Location & Encryption |
| :--- | :--- | :--- | :--- |
| **User Identity** | User ID, Name, Email, Workspace ID | Active account duration + 30 days upon deletion | Clerk Identity Vault (AES-256) |
| **User Research State** | Watchlists, custom screener presets, paper portfolios | Until deleted by user | PostgreSQL (Encrypted at rest) |
| **Market Data Cache** | OHLCV prices, quote ticks, order book snapshots | In-memory: 60s; EOD Bars: 10 years | Redis / PostgreSQL |
| **AI Research Dossiers** | Generated 11-part dossiers, factor breakdowns | 90 days rolling retention | PostgreSQL (JSONB partition) |
| **Security & Access Logs** | IP address, User-Agent, Request ID, API endpoints | 90 days (Compliance requirement) | Encrypted Log Aggregation |

---

## 3. User Data Rights & GDPR/CCPA Compliance
- **Right to Access (GDPR Art. 15 / CCPA)**: Users can export all research notes, watchlists, and activity history in structured JSON format via `/api/user/export`.
- **Right to Erasure / Right to be Forgotten (GDPR Art. 17)**: Users may request account deletion. All associated watchlists, portfolios, and research records are hard-deleted within 30 days.
- **No Third-Party Sale of Data**: MarketScope.io does not sell, rent, or monetize user research habits, search queries, or portfolio compositions to hedge funds, advertisers, or third-party brokers.
