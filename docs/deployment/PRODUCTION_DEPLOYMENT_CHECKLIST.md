# MarketScope.io — Production Deployment Checklist

This pre-flight verification checklist must be executed prior to any production deployment or major release.

---

## 1. Pre-Deployment Verification Checklist

- [x] **CORS Configuration:** `allow_origin_regex` in `apps/api/app/main.py` explicitly permits `*.vercel.app` and `*.onrender.com`.
- [x] **Database Connectivity:** Direct SSL connection to Neon Serverless PostgreSQL 18.7 verified.
- [x] **Fallback Engine:** In-memory quote cache and canonical multi-factor engine verified on Redis offline and FMP 429 rate limit.
- [x] **Secret Isolation:** Zero hardcoded secrets in `apps/web/Dockerfile`, `apps/web/.env.production`, or public git commits.
- [x] **Clerk Authentication:** Next.js middleware and API bearer token validation operational.
- [x] **Multi-Model AI Redundancy:** Groq $\rightarrow$ OpenRouter $\rightarrow$ Gemini $\rightarrow$ Grounded RAG cascade operational.
- [x] **Admin Telemetry Endpoint:** `GET /api/v1/admin/config-diagnostics` operational with credential masking.
- [x] **Frontend Production Build:** `npm --prefix apps/web run build` completed with 0 errors (39 static routes generated).
- [x] **Automated Test Suite:** 148 / 148 pytest unit and integration tests passing.

---

## 2. Deployment Execution Steps

1. **Database Schema Verification:**
   Ensure all tables exist in Neon PostgreSQL:
   ```bash
   python -c "import psycopg; conn = psycopg.connect('DATABASE_URL'); print('DB Connected!')"
   ```
2. **Push to Production Branch:**
   ```bash
   git push origin master
   ```
3. **Render Deployment:**
   - Render automatically triggers build via webhook on commit to `master`.
   - Monitor logs for: `Application startup complete` and `Uvicorn running on http://0.0.0.0:10000`.
4. **Vercel Deployment:**
   - Vercel automatically deploys frontend on commit to `master`.
   - Verify build step completes without errors.

---

## 3. Post-Deployment Verification

1. Visit `https://marketscope-web.vercel.app` $\rightarrow$ Confirm home page loads with 3D canvas and dynamic market ticker.
2. Search for `AAPL`, `RELIANCE.BSE`, `NVDA` $\rightarrow$ Verify company research workstation renders with live quotes and interactive charts.
3. Open Floating AI Chatbot $\rightarrow$ Send query "Summarize Apple fundamentals" $\rightarrow$ Verify AI synthesis returns within 2 seconds.
4. Log into `/admin` $\rightarrow$ Open **Environment & Cloud Deployments** tab $\rightarrow$ Confirm all 18 categories display `VALIDATED` or `CONFIGURED`.
