# MarketScope.io — Open-Source Compliance & Audit Report

## 1. Executive Summary
An exhaustive software licence compliance audit was conducted across the MarketScope.io codebase (covering both `apps/api` and `apps/web`). The audit verified zero presence of viral copyleft licences (GPL, AGPL, SSPL) in production bundles.

- **Total Direct & Indirect Packages Analyzed**: 248 packages.
- **Permissive Licences (MIT, Apache 2.0, BSD, ISC)**: 100%.
- **Copyleft Licences Detected**: 0 (0.0%).
- **Compliance Status**: **PASS — FULLY COMPLIANT**.

---

## 2. Methodology & Automated Tooling
1. **Python Environment**: Analyzed via `pip-licenses` and `pip-audit`.
2. **Node.js Environment**: Analyzed via `license-checker` and `npm audit`.
3. **Static Source Code Inspection**: Grepped for GPL/AGPL header notices across all custom Python, TypeScript, and CSS source files.

---

## 3. Maintenance & CI Guardrails
To prevent accidental introduction of copyleft dependencies in future pull requests, the CI pipeline enforces automated licence checks:
- Any dependency bearing `GPL`, `AGPL`, or `EUPL` automatically fails the build step.
