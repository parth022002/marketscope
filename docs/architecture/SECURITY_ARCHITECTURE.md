# Security Architecture Specification
**Platform:** MarketScope.io  
**Security Reference:** OWASP ASVS 4.0, API Security Top 10, LLM Top 10  

## 1. Security Architecture Diagram

```
                 Client Web Browser
                         │
                         ▼
        [SecurityHeadersMiddleware]
        ├── Content-Security-Policy (CSP)
        ├── Strict-Transport-Security (HSTS)
        ├── X-Content-Type-Options: nosniff
        └── X-Frame-Options: DENY
                         │
                         ▼
        [CorrelationIdMiddleware]
        └── Injects X-Request-ID & Tracks Response Time
                         │
                         ▼
        [CORS & Rate Limiter Middleware]
        ├── Production Allowed Origins
        └── Token-Bucket Rate Limiter
                         │
                         ▼
        [WorkspaceBoundaryGuard (IDOR Prevention)]
        └── Validates User Membership & Workspace Isolation
                         │
                         ▼
        [Input / Output Validation Layer]
        └── Pydantic v2 Schema Enforcement
                         │
                         ▼
        [AI Pre-Flight Sanitizer]
        ├── Strips Prompt Injections
        └── Redacts PII (Emails, Phones, Keys)
                         │
                         ▼
        [Deterministic Engine & Isolated Database]
```

## 2. Core Security Invariants
1. **Zero Secret Leakage**: No hardcoded secrets in source files or Git history.
2. **Untrusted Retrieval Sandboxing**: All web text, news, and filing text is parsed as untrusted input data, never executed as trusted prompt directives.
3. **Restricted Agent Tools**: AI agents have zero access to command shells, code runners, or live brokerage trade routing.
