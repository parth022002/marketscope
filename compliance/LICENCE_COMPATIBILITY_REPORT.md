# MarketScope.io — License Compatibility & Legal Analysis Report

## 1. Compatibility Matrix

MarketScope.io combines proprietary source code with multiple open-source software libraries. This report evaluates the legal compatibility between the primary proprietary license and third-party license obligations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MarketScope.io Platform                         │
│             (Proprietary / Commercial All Rights Reserved)              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      ▼                            ▼                            ▼
┌─────────────┐             ┌─────────────┐             ┌─────────────┐
│ Permissive  │             │ Permissive  │             │Weak Copyleft│
│  (MIT/ISC)  │             │(Apache-2.0) │             │ (LGPL-3.0)  │
│  Next.js    │             │ Lightweight │             │   Psycopg   │
│   FastAPI   │             │   Charts    │             │  (Dynamic)  │
│  Pydantic   │             │ TypeScript  │             │             │
└─────────────┘             └─────────────┘             └─────────────┘
```

---

## 2. In-Depth Compatibility Analysis

### 1. MIT & ISC Compatibility
- **Obligations**: Retain copyright notice and license disclaimer.
- **Compatibility with Proprietary Code**: **100% Compatible**. MIT and ISC do not impose reciprocal licensing ("copyleft") on surrounding code.
- **Implementation**: Complied with via `THIRD_PARTY_NOTICES.md` and application `/licenses` page.

### 2. Apache License 2.0 Compatibility
- **Obligations**: Retain copyright notice, license copy, and provide a `NOTICE` file acknowledging TradingView's copyright.
- **Patent Grant**: Apache 2.0 provides an express patent license from contributors to users.
- **Compatibility with Proprietary Code**: **100% Compatible**. Does not require the consuming application's source code to be open-sourced.
- **Implementation**: Complied with via root `NOTICE` and `THIRD_PARTY_NOTICES.md`.

### 3. LGPL-3.0 Compatibility (Psycopg 3)
- **Obligations**: If modified, LGPL source code must be disclosed. Consumers must be allowed to replace the library with a custom version.
- **Dynamic Linking Analysis**: MarketScope.io consumes `psycopg` solely through standard Python `import psycopg` statements as a standalone dependency. It does not modify psycopg source code or statically link it into a proprietary binary executable.
- **Compatibility**: **100% Compatible** under established open-source legal interpretation for dynamically imported interpreted libraries.
- **Implementation**: Psycopg source code link (https://github.com/psycopg/psycopg) provided in acknowledgements.

---

## 3. High-Risk License Screening (GPL / AGPL / SSPL)

- Automated scanning using `scripts/licensing/generate_license_report.py` verified that **zero GPL, AGPL, or SSPL libraries** are present in production dependencies.
- Any future pull request introducing a strong copyleft package will trigger a failure in the automated licensing CI check.
