# MarketScope.io — Security Incident Response Plan (SIRP)

## 1. Overview & Incident Classification
This document details MarketScope.io's formal procedures for detecting, containing, eradicating, and recovering from security incidents.

### Incident Severity Levels

| Severity | Definition | Examples | SLA (Ack / Resolution) |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Active compromise of database, unauthorized access to user portfolios, or core platform unavailability | Database exfiltration, credential leak in production | 15 min / 4 hours |
| **SEV-2 (High)** | Degradation of critical security controls or partial system compromise | Failed authentication provider, detected prompt injection bypass | 30 min / 12 hours |
| **SEV-3 (Medium)** | Non-exploitable vulnerability or minor localized defect | Non-critical header misconfiguration, transient rate-limit anomaly | 2 hours / 48 hours |
| **SEV-4 (Low)** | Minor compliance alert or informational observation | Documentation discrepancy, dependency deprecation notice | 24 hours / 14 days |

---

## 2. Six-Phase Response Lifecycle

```
+---------------+     +---------------+     +---------------+
| 1. DETECTION  | --> | 2. TRIAGE     | --> | 3. CONTAINMENT|
| Monitoring    |     | Severity Tag  |     | Isolate Node  |
| Alerting      |     | Incident Team |     | Revoke Tokens |
+---------------+     +---------------+     +---------------+
                            |
                            v
+---------------+     +---------------+     +---------------+
| 6. POST-MORTEM| <-- | 5. RECOVERY   | <-- | 4. ERADICATION|
| Root Cause    |     | Restore Data  |     | Patch Code    |
| Action Items  |     | Verify Health |     | Rotate Secrets|
+---------------+     +---------------+     +---------------+
```

### Phase 1: Detection & Alerting
- Real-time alerts triggered by Prometheus/Grafana anomaly rules and log aggregation.
- Immediate notification dispatched to the Security On-Call Engineer via PagerDuty/Slack.

### Phase 2: Triage & Incident Declaration
- Verification of authentic attack vs. false positive.
- Declaration of incident severity and creation of a dedicated incident war room.

### Phase 3: Containment
- **Short-Term Containment**: Isolate affected application containers, blacklist offending IP ranges via Cloudflare, and revoke compromised API keys or user session tokens.
- **Long-Term Containment**: Deploy hotfix firewall rules and suspend compromised integration points.

### Phase 4: Eradication
- Identify the root vulnerability (code flaw, dependency vulnerability, or misconfiguration).
- Apply security patches and verify zero backdoor presence.
- Rotate all infrastructure and third-party API credentials.

### Phase 5: Recovery
- Re-enable services in staging, run automated test suites (`pytest`, `npm test`), and validate database integrity.
- Deploy to production under heightened telemetry monitoring.

### Phase 6: Post-Mortem & Remediation
- Publish a blameless post-mortem document within 72 hours of incident resolution.
- Track preventative engineering action items in the production backlog.
