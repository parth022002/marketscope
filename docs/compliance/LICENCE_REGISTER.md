# MarketScope.io — Master Software Licence Register

## 1. Compliance Mandate & Permissive Licensing Policy
MarketScope.io maintains a strict permissive licensing policy. All software libraries, direct and transitive dependencies, fonts, and icons must be licensed under commercially permissive open-source licences (MIT, Apache 2.0, BSD-2-Clause, BSD-3-Clause, ISC, PSF, CC0-1.0).

**Strict Prohibition**: No copyleft (GPL v2/v3, AGPL v3, LGPL v3 with static linking) libraries are permitted in the codebase to eliminate viral licensing risks.

---

## 2. Core Backend Dependencies (Python)

| Library / Package | Version | Licence | Purpose | Copyleft Risk | Verified Date |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FastAPI** | 0.115.0+ | MIT | REST API Framework & Routing | Clean | 2026-11-22 |
| **Uvicorn** | 0.30.0+ | BSD-3-Clause | ASGI Web Server Implementation | Clean | 2026-11-22 |
| **Pydantic** | 2.9.0+ | MIT | Data Validation & Settings | Clean | 2026-11-22 |
| **SQLAlchemy** | 2.0.0+ | MIT | Database ORM & Session Engine | Clean | 2026-11-22 |
| **NumPy** | 2.1.0+ | BSD-3-Clause | Vectorized Numerical Operations | Clean | 2026-11-22 |
| **SciPy** | 1.14.0+ | BSD-3-Clause | Scientific & Statistical Risk Modeling | Clean | 2026-11-22 |
| **Pandas** | 2.2.0+ | BSD-3-Clause | Time-Series & Tabular Data Structures | Clean | 2026-11-22 |
| **Redis-py** | 5.0.0+ | MIT | In-Memory Caching & Rate Limiting | Clean | 2026-11-22 |
| **httpx** | 0.27.0+ | BSD-3-Clause | Async HTTP Client for Upstream APIs | Clean | 2026-11-22 |
| **PyYAML** | 6.0.0+ | MIT | Configuration Serialization | Clean | 2026-11-22 |
| **Python-Jose / Cryptography** | 3.3.0+ / 43.0+ | MIT / Apache-2.0 / BSD | JWT Verification & Hashing | Clean | 2026-11-22 |

---

## 3. Core Frontend Dependencies (TypeScript / React)

| Library / Package | Version | Licence | Purpose | Copyleft Risk | Verified Date |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Next.js** | 14.2.0+ | MIT | React Production Web Framework | Clean | 2026-11-22 |
| **React / React-DOM**| 18.3.0+ | MIT | UI Rendering & Component Model | Clean | 2026-11-22 |
| **Tailwind CSS** | 3.4.0+ | MIT | Utility-First Styling Framework | Clean | 2026-11-22 |
| **Lucide React** | 0.400.0+ | ISC | SVG Iconography System | Clean | 2026-11-22 |
| **Lightweight Charts**| 4.2.0+ | Apache-2.0 | TradingView Financial Interactive Charts| Clean | 2026-11-22 |
| **Three.js** | 0.165.0+ | MIT | 3D Canvas Graphics Engine | Clean | 2026-11-22 |
| **Clerk Nextjs** | 5.0.0+ | MIT | User Authentication & Session SDK | Clean | 2026-11-22 |
| **clsx / tailwind-merge**| 2.1.0+ / 2.3.0+| MIT | Classname Composition | Clean | 2026-11-22 |

---

## 4. Fonts, Icons & Assets

| Asset Group | Provider | Licence | Attribution Required | Attribution Implemented |
| :--- | :--- | :--- | :--- | :--- |
| **Geist Sans / Geist Mono** | Vercel | OFL-1.1 (SIL Open Font) | Yes (Preserved in CSS/Fonts) | Yes (`apps/web/src/app/layout.tsx`) |
| **Inter Font Family** | Rasmus Andersson | OFL-1.1 | Yes | Yes |
| **Lucide Icons** | Lucide Project | ISC Licence | Notice in documentation | Yes (`THIRD_PARTY_ATTRIBUTIONS.md`) |
| **Lightweight Charts** | TradingView | Apache-2.0 | Apache 2.0 Notice preservation | Yes (`THIRD_PARTY_ATTRIBUTIONS.md`) |
