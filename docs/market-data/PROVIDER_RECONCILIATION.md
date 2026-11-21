# MarketScope.io — Multi-Provider Cross-Reconciliation & Discrepancy Policy

## 1. Multi-Provider Ingestion Hierarchy

MarketScope.io ingests price information from primary and secondary authorized providers to ensure continuous service availability and data integrity:

```
Tier 1 (Primary): LiveExchangeProvider (Direct Exchange / FX Rate Engine)
       │ (On error, timeout > 1.5s, or symbol unsupported)
       ▼
Tier 2 (Secondary): Twelve Data Enterprise REST & WebSocket API
       │ (On rate limit 429, auth failure, or 404)
       ▼
Tier 3 (Tertiary): Financial Modeling Prep (FMP) Commercial API
       │ (On upstream outage or network isolation)
       ▼
Tier 4 (Fallback): Deterministic Synthetic Reference Engine (synthetic_dev)
```

---

## 2. Cross-Provider Price Reconciliation Protocol

To verify price accuracy across providers, the platform conducts periodic background reconciliation comparisons:

1. **Reconciliation Tolerance Band**:
   $$\text{Spread} = \frac{|P_{\text{vendor\_A}} - P_{\text{vendor\_B}}|}{\min(P_{\text{vendor\_A}}, P_{\text{vendor\_B}})}$$
   - **Equities & Indices**: Spread tolerance is $\le 0.15\%$ (accounting for feed delay differences).
   - **Commodities & Forex**: Spread tolerance is $\le 0.10\%$.
   - **Sovereign Yields**: Spread tolerance is $\le 2\text{ bps}$ ($0.02\%$).

2. **Conflict Resolution Rules**:
   - If Spread $\le \text{Tolerance}$: Primary feed is marked `RECONCILED` and served.
   - If Spread $> \text{Tolerance}$:
     - If one provider reports an exchange timestamp significantly newer than the other ($> 15\text{ minutes}$), the newer timestamp takes precedence.
     - If timestamps are identical, the exchange primary feed (`LiveExchangeProvider`) takes precedence.
     - An alert is logged to `_anomaly_log` for administrative investigation.

---

## 3. Disconnection & Circuit Breakers

When an upstream commercial provider fails:
- Three consecutive network timeouts or HTTP 5xx responses trip the provider circuit breaker for 60 seconds.
- Traffic automatically shifts to the next tier without frontend downtime.
- In offline development or sandbox testing environments with network restrictions, the platform engages Tier 4 with explicit `SYNTHETIC_DEVELOPMENT` telemetry.
