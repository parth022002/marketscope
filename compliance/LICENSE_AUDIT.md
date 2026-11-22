# MarketScope.io — Repository-Wide License Audit & Project License Recommendation

## 1. Executive Summary

A comprehensive licensing audit was conducted across the MarketScope.io codebase, covering:
- **Frontend Dependencies**: 352 direct and transitive npm packages.
- **Backend Dependencies**: 49 direct and transitive Python packages.
- **Data Providers & APIs**: NSE, BSE, MCX, FRED, Yahoo Finance, Alpha Vantage.
- **Visual & Typography Assets**: TradingView Lightweight Charts, Lucide Icons, Geist Font.
- **Cloud Infrastructure Services**: Render, Neon PostgreSQL, Clerk Auth, Sentry.

---

## 2. Dependency Audit Results

### License Distribution
- **MIT License**: ~73% of dependencies (React, Next.js, FastAPI, Pydantic, SQLAlchemy, Tailwind CSS, Redis).
- **Apache License 2.0**: ~19% of dependencies (TradingView Lightweight Charts, TypeScript, ESLint, Requests, Packaging).
- **BSD 2-Clause / 3-Clause**: ~6% of dependencies (Starlette, Uvicorn, HTTPX, NumPy, Pandas, Click, Dotenv).
- **ISC License**: ~1% of dependencies (Lucide Icons).
- **LGPL 3.0**: ~0.7% of dependencies (Psycopg 3 database driver; dynamically linked, non-infective).
- **SIL Open Font License 1.1**: Geist Typography family.
- **Strong Copyleft (GPL / AGPL)**: **0 violations detected** in runtime production dependencies.

---

## 3. Project License Recommendation (Phase 3 Evaluation)

Before establishing the primary license for MarketScope.io, three structural models were evaluated:

### Option A: Proprietary Commercial License (RECOMMENDED)
- **Applicability**: Preserves full intellectual property rights for MarketScope.io proprietary financial models, screener engines, proprietary user interfaces, and brand trademarks.
- **Third-Party Compatibility**: 100% compatible. Permissive open-source libraries (MIT, Apache 2.0, BSD, ISC) explicitly allow incorporation into proprietary commercial applications provided original copyright notices and licenses are preserved.
- **Weak Copyleft Boundary**: The use of `psycopg` (LGPL-3.0) via dynamic Python imports is fully compliant with proprietary distribution, as MarketScope.io does not modify or statically compile psycopg into a single binary.

### Option B: Apache License, Version 2.0
- **Applicability**: If the platform owners decide to make the entire research platform open-source.
- **Advantages**: Provides express patent grants and protects contributors from patent claims while allowing commercial use.
- **Trade-offs**: Enables external parties to fork and self-host the core application codebase.

### Option C: MIT License
- **Applicability**: Maximum permissiveness if full community open-source distribution is preferred.
- **Trade-offs**: Does not include express patent licenses.

### Final Recommendation
MarketScope.io should maintain a **Proprietary All-Rights-Reserved License** for its proprietary source code, design assets, and brand marks, while maintaining complete open-source transparency for all third-party dependencies via [THIRD_PARTY_NOTICES.md](file:///c:/Users/parth/OneDrive/Desktop/MarketScope.io/MarketScope.io%20Code/THIRD_PARTY_NOTICES.md) and the dedicated `/acknowledgements` and `/licenses` application pages.
