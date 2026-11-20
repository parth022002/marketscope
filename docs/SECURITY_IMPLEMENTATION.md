# MarketScope.io — Security, Privacy & Safety Implementation Specification

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Status:** Approved Implementation Baseline  
**Governing Standard:** MarketScope Security, Privacy & Safety Requirements v1.0

---

## 1. Security Architecture & Threat Principles

MarketScope.io is designed around a zero-trust model for multi-tenant financial data:
1. **Server-Side Authorization Everywhere:** The web frontend is an untrusted client. Every API request is verified independently for user identity, workspace membership, and data entitlements.
2. **Tenant Data Isolation:** User research assets (notes, watchlists, snapshots) are strictly isolated by `workspace_id`. Cross-tenant data leakage is prevented via parameterized SQL queries and database constraints.
3. **Data Protection & Privacy (DPDP Act 2023/2025):** We collect the minimum necessary personal data. All user notes and workspace data are subject to complete cascade deletion upon user request.
4. **Append-Only Tamper-Resistant Auditing:** All authentication, workspace membership mutations, data deletion requests, and administrative operations are recorded immutably in `audit_events`.
5. **Fail-Closed Financial Rights Engine:** Financial data fields are only displayed or exported if an active, valid entitlement exists in `provider_entitlements`. If rights cannot be verified, access is denied by default.

---

## 2. Authentication & Session Security

- **Managed OIDC Integration:** In production and cloud staging, authentication is delegated to Clerk (or an approved OIDC provider). The API verifies the cryptographic signature (RS256), token expiration (`exp`), issuer (`iss`), and audience (`aud`).
- **Local Development Bypass:** For completely offline, credential-free development, the backend provides `MOCK_AUTH_ENABLED=true`. In this mode, a synthetic developer identity (`dev_user_001`) with a synthetic workspace (`dev_workspace_001`) is injected via FastAPI dependency injection.
- **Session Controls:**
  - Production sessions use secure HTTP-only cookies with `SameSite=Lax` and `Secure=true`.
  - Absolute session expiration is enforced at 14 days, with idle timeout at 24 hours.
  - Revoked sessions at the identity provider are immediately blocked from accessing protected endpoints.

---

## 3. Multi-Tenant Workspace Isolation

### Architecture Rules
1. **Workspace Keying:** Every table containing user-generated data (`research_notes`, `research_snapshots`, `watchlists`) contains a non-nullable `workspace_id` foreign key referencing `workspaces(id)`.
2. **Repository Layer Enforcement:** Every data-access function requires `workspace_id` as a mandatory parameter:
   ```python
   # Correct: Explicitly scoped to active workspace
   stmt = select(ResearchNote).where(
       ResearchNote.workspace_id == current_workspace_id,
       ResearchNote.id == note_id
   )
   ```
3. **Automated Cross-Tenant Penetration Matrix:**
   - Test suite `tests/security/test_tenancy.py` explicitly provisions Workspace A (User A) and Workspace B (User B).
   - Verifies that User A attempting to read, update, or delete User B's note or snapshot receives an immediate `404 Not Found` or `403 Forbidden`.
   - Verifies that raw database IDs from Workspace B are never leaked in error messages.

---

## 4. Cryptography & Data Integrity

- **TLS in Transit:** All network traffic between client, API, database, and cache is encrypted using TLS 1.3.
- **Managed Encryption at Rest:** Database storage volumes (Neon/AWS RDS) and Cloudflare R2 buckets utilize AES-256 encryption at rest.
- **Snapshot Immutability:** Research snapshots serialize their JSON payload with sorted keys, compute an HMAC-SHA256 hash using `SNAPSHOT_SIGNING_SALT`, and store the digest. Any tampering with the payload in storage invalidates the cryptographic signature upon inspection.

---

## 5. Input Validation & Error Handling

- **Strict Schema Enforcement:** All API endpoints validate request payloads using Pydantic v2 models with explicit bounds (`min_length`, `max_length`, regex patterns, numeric ranges).
- **SQL Injection Prevention:** All SQL queries use SQLAlchemy parameterized statements or standard ORM mappings. Zero raw string interpolation is permitted.
- **Cross-Site Scripting (XSS):** Web client utilizes React's auto-escaping JSX engine. Any rendered markdown in research notes is sanitized via an approved DOMPurify/rehype-sanitize pipeline.
- **Safe Error Envelopes:** Internal stack traces, database schema details, and server paths are suppressed in production mode (`APP_DEBUG=false`). Clients receive structured error envelopes with sanitized user-facing messages.

---

## 6. Audit Logging & DPDP Compliance

- **Audit Event Schema:** `audit_events` stores `workspace_id`, `actor_user_id`, `event_type`, `resource_type`, `resource_id`, and `payload`.
- **Zero PII Logging:** Secrets, passwords, session tokens, PAN cards, and personal contact info are strictly prohibited from telemetry logs.
- **Right to Erasure (DPDP Act):** The user account deletion service cascades deletions across `workspace_memberships`, `research_notes`, and `research_snapshots`. Audit records retain only an anonymized tombstone record.
