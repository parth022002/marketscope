# MarketScope.io — Configuration Status Tracker

**Current Date:** 20 November 2026  
**Active Phase:** Phase 1 (Foundation & Integrations Complete)  
**Tracked Items Count:** 17  
**Operational Status:** ALL CREDENTIALS & INTEGRATIONS CONFIGURED & VERIFIED

---

## Configuration Matrix

| Key / Variable | Category | Phase Required | Mandatory for Dev? | Mandatory for Prod? | Current Status | Active Value / Mode | Notes |
|---|---|---|---|---|---|---|---|
| `GITHUB_REPO` | Source Control | Phase 0 | Yes | Yes | **Configured & Linked** | `https://github.com/parth022002/marketscope.git` | Git repo initialized; origin set |
| `DATABASE_URL` | Database | Phase 1 | Yes | Yes | **Configured** | Neon Direct (`ep-young-waterfall-bitep0rn...`) | Direct connection string active |
| `DATABASE_POOL_URL` | Database | Phase 4 | No | Yes | **Configured** | Neon Pooled (`ep-young-waterfall-bitep0rn-pooler...`) | PgBouncer pooler active |
| `UPSTASH_REDIS` | Cache / Skills | Phase 1 | Yes | Yes | **Installed & Configured** | MCP server & Agent skills installed | `C:\Users\parth\.gemini\skills\upstash` |
| `CLERK_APP_ID` | Identity | Phase 1 | Yes | Yes | **Active & Verified** | `app_3MM9kR6zjk1ZzCJ9wEw6KJ2WvOh` | `clerk doctor` passed 100% |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Identity | Phase 1 | Yes | Yes | **Active & Verified** | `pk_test_c2luZ3VsYXItamVubmV0...` | Installed in Next.js web app |
| `CLERK_SECRET_KEY` | Identity | Phase 1 | Yes | Yes | **Active & Verified** | `sk_test_Hbx0Vx46E7bXlCjV...` | Configured in root & api envs |
| `CLERK_NEXTJS_SDK` | Identity | Phase 1 | Yes | Yes | **Installed & Built** | `@clerk/nextjs ^7.10.5` | Production build verified |
| `SENTRY_ORG` | Monitoring | Phase 6 | No | Yes | **Configured** | `flexconvert` | Sentry organization set |
| `SENTRY_PROJECT` | Monitoring | Phase 6 | No | Yes | **Configured** | `marketscope` | Sentry project set |
| `OPENROUTER_API_KEY` | Intelligence | Phase 5 | No | Optional | **Configured (Gated)** | `sk-or-v1-56d765...` | Saved in uncommitted local envs |
| `GROQ_API_KEY` | Intelligence | Phase 5 | No | Optional | **Configured (Gated)** | `gsk_R2sf40wEip6Z...` | Saved in uncommitted local envs |
| `GEMINI_API_KEY` | Intelligence | Phase 5 | No | Optional | **Configured (Gated)** | `AQ.Ab8RN6KAWhpQ...` | Saved in uncommitted local envs |
| `AI_ENABLED` | Intelligence | Phase 5 | No | Optional | **Configured (Disabled)** | `false` (Gated by architecture policy) | Gated until Phase 5 release |
| `APP_ENV` | Core | Phase 1 | Yes | Yes | **Configured** | `development` | Local development mode |
| `SECRET_KEY` | Security | Phase 1 | Yes | Yes | **Configured** | Local 32-byte secret | Cryptographic signing key |
| `MARKET_DATA_PROVIDER` | Market Data | Phase 1 | Yes | Yes | **Configured** | `mock` (`MockProvider` with Reliance, TCS, INFY) | Synthetic Indian equity fixtures |
| `CORS_ORIGINS` | Security | Phase 1 | Yes | Yes | **Configured** | `http://localhost:3000,http://127.0.0.1:3000` | Local frontend dev origins |

---

## Action Summary

1. **GitHub:** Git repository initialized in `MarketScope.io Code` and origin set to `https://github.com/parth022002/marketscope.git`.
2. **Neon PostgreSQL:** Direct and pooled connection strings added to `.env` and `apps/api/.env`.
3. **Upstash:** Setup executed successfully via `npx -y upstash setup --yes --gemini`. MCP server and skills installed to `C:\Users\parth\.gemini\settings.json` and `C:\Users\parth\.gemini\skills\upstash`.
4. **Clerk:** `@clerk/nextjs` installed and verified. Middleware, `<ClerkProvider>`, `<Show>`, sign-in, and sign-up routes built and passing. All 8 Clerk agent skills installed. `clerk doctor` passed with 0 errors.
5. **AI Providers (OpenRouter, Groq, Gemini):** Keys securely added to local `.env` and `apps/api/.env`. They remain gated (`AI_ENABLED=false`) until Phase 5.
6. **Sentry:** Org `flexconvert` and Project `marketscope` configured for Next.js monitoring.
