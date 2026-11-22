# Technical Debt Register
**Platform:** MarketScope.io  
**Audit Date:** November 2026  
**Status:** Actionable Prioritization Matrix  

---

## 1. Technical Debt Item Inventory

| Debt ID | Subsystem | Description of Debt / Inefficiency | Risk Level | Impact on Production | Recommended Remediation |
|---|---|---|---|---|---|
| **TD-01** | AI & Agents | Agent logic is split across `assistant_service.py` and `ai_synthesis.py` without a formal multi-agent orchestration coordinator. | **Medium** | Redundant prompt construction and lack of formal communication contracts between specialist research agents. | Implement centralized `AIOrchestrator` with isolated 14 specialist agent definitions and shared research context. |
| **TD-02** | Analytics | Risk, Regime, and Anomaly computations are scattered across `market_intelligence.py`, `derivatives_engine.py`, and `calculations.py`. | **Medium** | Missing dedicated VaR/CVaR endpoints, formal filtered regime state tracking, and MAD anomaly detection. | Consolidate into dedicated domain engines: `RiskAnalysisEngine`, `MarketRegimeEngine`, `AnomalyDetectionEngine`, and `QIntelligenceEnsemble`. |
| **TD-03** | Database | Database migrations are stored in raw SQL scripts (`001_initial.sql`, `002_phase3_workspace.sql`) rather than managed Alembic version files. | **Medium** | Manual schema migrations risk drift during team deployments or CI/CD branch merges. | Standardize schema migrations with versioned migration runners and automated schema validation. |
| **TD-04** | Caching | Redis URL is configured in `core/config.py`, but endpoints fallback to in-memory event buses and dictionary caches. | **Low** | Higher database load during high concurrency multi-user sessions on Render. | Wire Redis client wrapper for distributed response caching, rate limiting, and ephemeral token blacklists. |
| **TD-05** | Security | IAM roles exist in SQL (`workspace_memberships`), but route-level FastAPI dependencies do not uniformly enforce fine-grained permissions. | **High** | Potential risk of horizontal privilege escalation (IDOR) if workspace ID is supplied without ownership verification. | Implement server-side RBAC dependency `require_permission(Action, Resource)` and workspace ownership validator. |
| **TD-06** | Data Quality | Data quality status is tagged as `UNVERIFIED` in initial seeds without an automated quality reconciliation pipeline. | **Medium** | Lack of automated cross-provider outlier detection and historical continuity checks. | Build `DataQualityEngine` checking range, missing values, duplicates, and corporate action adjustments. |
| **TD-07** | Observability | Structured logging exists in some engines, but HTTP requests lack uniform correlation IDs and OpenTelemetry traces. | **Low** | Debugging distributed requests between Next.js frontend and FastAPI backend requires log matching by timestamp. | Add `CorrelationIdMiddleware` injecting `X-Request-ID` and structured JSON logs. |

---

## 2. Priority Remediation Plan
1. **Immediate Phase (Architecture & Security)**: Implement server-side RBAC, workspace boundary verification, and request correlation IDs (Remediates TD-05 & TD-07).
2. **Analytical Phase**: Centralize `RiskAnalysisEngine`, `MarketRegimeEngine`, `AnomalyDetectionEngine`, and `QIntelligenceEnsemble` (Remediates TD-02).
3. **AI Orchestration Phase**: Implement central `AIOrchestrator` with 14 specialist agents and model registry (Remediates TD-01).
4. **Data & Quality Phase**: Implement `DataQualityEngine` and Redis caching (Remediates TD-04 & TD-06).
