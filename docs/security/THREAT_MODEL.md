# MarketScope.io — Threat Model & Security Architecture

## 1. Threat Vectors & Mitigations
| Threat Vector | Potential Impact | Implemented Mitigation |
| :--- | :--- | :--- |
| **Cross-Site Scripting (XSS)** | Token theft, session hijacking | React automatic output sanitization, strict CSP headers. |
| **SQL Injection (SQLi)** | Database breach, data alteration | 100% parameterized queries via SQLAlchemy 2.0 ORM. |
| **Denial of Service (DoS)** | Resource exhaustion, downtime | Connection pooling, query timeout limits (5s), rate-limiting. |
| **Unauthorized Data Access** | Access to another user's paper portfolio | Clerk JWT authentication with user-scoped database queries (`WHERE user_id = :uid`). |
| **Market Data Poisoning** | Display of false prices | Multi-provider cross-validation, outlier detection thresholds (rejecting single-tick >50% price spikes). |
