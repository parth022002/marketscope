# Licence and Open-Source Compliance Audit
**Platform:** MarketScope.io  
**Audit Standard:** Software Bill of Materials (SBOM), Permissive Licensing, Fair Use Attribution  
**Evaluation Date:** November 2026  

---

## 1. Open-Source Dependency Licensing Review

### Frontend Dependencies (`apps/web/package.json`)
- **Next.js (15.5.29)**: MIT License (Permissive). Commercial and private use permitted.
- **React & React-DOM (19.0.0)**: MIT License (Permissive).
- **TradingView Lightweight Charts (v5.3.0)**: Apache License 2.0 (Permissive with patent grant). Self-hosted HTML5 canvas library, strictly compliant without TradingView logo branding restrictions of the proprietary Advanced Charting library.
- **Lucide React**: ISC License (Permissive, equivalent to MIT/BSD).
- **Tailwind CSS**: MIT License (Permissive).
- **Clerk Next.js SDK**: MIT License (Permissive).
- **Canvas Confetti**: MIT License (Permissive).

### Backend Dependencies (`apps/api/requirements.txt`)
- **FastAPI (0.115.0)**: MIT License (Permissive).
- **Uvicorn**: BSD 3-Clause License (Permissive).
- **SQLAlchemy (2.0.x)**: MIT License (Permissive).
- **Psycopg 3 (psycopg[binary])**: LGPL with runtime exception / BSD compatible (Permissive for dynamic linking).
- **Pydantic (v2.x)**: MIT License (Permissive).
- **NumPy**: BSD 3-Clause License (Permissive).
- **Pandas**: BSD 3-Clause License (Permissive).
- **HTTPX**: BSD 3-Clause License (Permissive).
- **PyYAML**: MIT License (Permissive).
- **Pytest**: MIT License (Permissive).

---

## 2. Intellectual Property & Fair Use Guardrails
1. **Zero Full-Text Copyright Infringement**: Journalistic articles are never reproduced in full. MarketScope provides concise 2-sentence summaries, structured key facts, and direct hyperlinks to original publishers.
2. **Statutory Public Disclosures**: Company filings submitted to SEBI, NSE, BSE, and the US SEC are treated as public domain regulatory disclosures under applicable open access legislation.
3. **No Trademark Misrepresentation**: MarketScope displays exchange and regulatory names solely for identification and attribution purposes under nominative fair use doctrine.
4. **Copyleft Freedom**: No GPLv3 or AGPLv3 viral copyleft libraries are utilized in backend or frontend dependencies, protecting proprietary financial algorithms and enterprise codebases.
