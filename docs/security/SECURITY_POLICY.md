# MarketScope.io — Security Policy

## 1. Vulnerability Reporting
Security researchers may report potential vulnerabilities to `security@marketscope.io`. Reports are acknowledged within 24 hours.

## 2. Infrastructure Security
- **Container Isolation**: Docker containers run as unprivileged `appuser` (UID 1001) with root privileges stripped.
- **TLS Standards**: HTTPS enforcement with TLS 1.3 preferred and TLS 1.2 minimum.
- **Dependency Auditing**: Automated continuous auditing via `npm audit` and `pip-audit`.
- **Secret Management**: Production secrets are injected dynamically via environment variables; never checked into version control.
