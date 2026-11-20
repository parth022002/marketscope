# Security, privacy and safety — implementation baseline

This file is a developer checklist, not a legal opinion or certification.

## Must implement before multi-user beta
- Managed OIDC authentication; secure sessions and logout.
- Server-side role and workspace authorization on every protected request.
- Tenant isolation tests and database-level controls where appropriate.
- MFA for privileged/admin roles.
- TLS in deployed environments; managed encryption at rest.
- Secret manager for production credentials; no secrets in source control or client bundles.
- Request validation, rate limits, security headers, CORS allowlist and safe error responses.
- Audit trail for privileged actions and material data changes.
- Data minimisation, retention schedule, export and deletion propagation.
- Backups, restore drills, monitoring and incident response.
- Dependency, container and secret scanning in CI.

## Financial-data integrity
- Record source, provider, retrieval time, publication time, period, unit, currency, reporting basis and entitlement.
- Preserve raw source references where contractually permitted.
- Label synthetic/demo data.
- Surface stale, missing, conflicting and restated facts.
- Never silently fill missing facts or convert units without recording the transformation.

## AI (disabled in initial build)
Before enabling AI: provider-rights review, privacy review, prompt-injection tests, retrieval isolation, claim-level citations, deterministic tool boundaries, evaluation benchmark, abstention policy, cost limits and auditability.

## Product safety
MarketScope is read-only research. No order submission, brokerage or custody. Avoid personalised investment instructions and guaranteed claims. Display appropriate disclosures and obtain legal review before external launch.

## Upload and export safety (future)
Validate file type and size, scan files, isolate processing, prevent path traversal and SSRF, and protect CSV exports from formula injection.
