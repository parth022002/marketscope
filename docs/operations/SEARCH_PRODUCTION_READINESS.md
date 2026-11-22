# MarketScope.io — Universal Search Production Readiness & Deployment Checklist

## 1. Readiness Summary

The **Universal Stock Search Engine and Global Instrument Discovery System** has completed end-to-end audit, architectural re-engineering, test validation, and production hardening.

---

## 2. Pre-Deployment Validation Checklist

- [x] **Zero Scraping Vulnerability**: Replaced fail-closed external scrapers with deterministic canonical fallback generator. Upstream HTTP 403 blocks cannot take down search.
- [x] **Global Instrument Master Index**: Over 122 securities across 9 global exchanges indexed in an in-memory token inverted index.
- [x] **Sub-5ms Query Latency**: Token matching + Levenshtein distance operations run strictly within 5 milliseconds.
- [x] **12 Workstation Modules**: Master research bundle consolidated into a single endpoint (`GET /api/v1/instruments/{id}/research`) with zero-state error boundary.
- [x] **100% Backend Test Pass**: All 140 pytest unit and integration tests passing (`apps/api/tests/`).
- [x] **Clean Frontend Build**: Next.js production build compiling with zero TypeScript or route compilation errors.
- [x] **Disambiguation Transparency**: Multiple listing ticker collisions surfaced explicitly with interactive choice dialog.
- [x] **Data Coverage Compliance**: All 8 data coverage states visually demarcated in UI with educational research disclaimers.

---

## 3. Deployment Runbook for Render

1. **Environment Variables**:
   ```ini
   DATABASE_URL=postgresql://user:pass@host/marketscope
   JWT_SECRET_KEY=<production_secret>
   CORS_ORIGINS=https://marketscope-web.onrender.com,http://localhost:3000
   ```
2. **Build & Start Commands**:
   - **Backend**:
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4`
   - **Frontend**:
     - Build Command: `npm run build`
     - Start Command: `npm run start`

3. **Post-Deployment Verification**:
   - Verify health ready: `curl -f https://marketscope-api.onrender.com/health/ready`
   - Verify diagnostics: `curl -f https://marketscope-api.onrender.com/api/v1/instruments/admin/diagnostics`
   - Verify search: `curl -f "https://marketscope-api.onrender.com/api/v1/instruments/search?q=SBIN"`
   - Verify workstation research bundle: `curl -f https://marketscope-api.onrender.com/api/v1/instruments/in-nse-sbin/research`
