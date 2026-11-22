# Security Gap Analysis
**Platform:** MarketScope.io  
**Security Standard:** OWASP Top 10 (2021), OWASP API Security Top 10 (2023), OWASP LLM Top 10 (2025)  
**Evaluation Date:** November 2026  

---

## 1. Threat Profile & Vulnerability Matrix

| Vulnerability Category | OWASP Ref | Current Mitigation Status | Gap / Risk Identified | Required Security Control |
|---|---|---|---|---|
| **Broken Object Level Authorization (BOLA/IDOR)** | API1:2023 | `PARTIALLY_MITIGATED` | Workspace notes and snapshots accept UUIDs. If a user queries another workspace's UUID, authorization must be validated against `workspace_memberships`. | Implement strict `verify_workspace_access(user_id, workspace_id, required_role)` dependency on all workspace endpoints. |
| **Broken Authentication** | API2:2023 | `MITIGATED` | Managed Clerk OIDC handles password hashing, MFA, and session tokens. No plaintext passwords stored locally. | Ensure JWT signature verification and session revocation validation on backend. |
| **Broken Object Property Level Authorization** | API3:2023 | `MITIGATED` | Pydantic v2 schemas strictly validate incoming request payloads and strip unknown fields. | Maintain strict response schemas preventing leakage of internal DB keys. |
| **Unrestricted Resource Consumption** | API4:2023 | `PARTIALLY_MITIGATED` | Rate limiter exists (`rate_limiter.py`), but limits are per-IP rather than per-user / per-workspace quotas. | Add per-user token and request quotas in addition to global IP rate limiting. |
| **Broken Function Level Authorization** | API5:2023 | `PARTIALLY_MITIGATED` | Administrative routes exist in routes (`/admin/market-data`). Needs explicit `ADMIN` role requirement. | Enforce `require_role(["ADMIN", "SUPERADMIN"])` dependency on all `/admin/*` routes. |
| **Server-Side Request Forgery (SSRF)** | API7:2023 | `MITIGATED` | External HTTP requests (FMP, TwelveData, Groq) use hardcoded base URLs from config. No user-supplied URLs fetched directly. | Enforce strict allowlist on any future external webhook or document ingestion URLs. |
| **Security Misconfiguration** | API8:2023 | `PARTIALLY_MITIGATED` | CORS regex allows `onrender.com` subdomains and localhost in dev. Secret keys configured via `.env`. | Add security response headers (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS`). |
| **Prompt Injection & Model Manipulation** | LLM01:2025 | `MITIGATED` | System prompt instruction/data separation implemented in `assistant_service.py` with adversarial keyword filtering. | Formalize untrusted data sandboxing across all retrieved news and external filing exhibits. |
| **Sensitive Information Disclosure (LLM)** | LLM06:2025 | `MITIGATED` | PII and private keys are never included in LLM context. Non-advisory disclaimer enforced on all outputs. | Add automated regex-based PII redaction layer prior to outbound AI provider calls. |

---

## 2. Hardening Measures to Implement
1. **Security Headers Middleware**: Inject `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`.
2. **Resource Boundary Enforcer**: Universal `WorkspaceBoundaryGuard` ensuring users can only read, mutate, or export artifacts belonging to workspaces where they hold active membership.
3. **AI Context Sanitizer**: Pre-flight scanner stripping email addresses, phone numbers, API keys, and prompt override commands before routing prompts to LLMs.
