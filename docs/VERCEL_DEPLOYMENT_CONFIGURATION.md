# MarketScope.io — Vercel Deployment Configuration

**Platform:** Vercel Edge Network  
**Target:** Frontend Web Application (`apps/web`)  
**Framework:** Next.js 15 (App Router)  
**Node.js Runtime:** 20.x  
**Package Manager:** `pnpm` (or `npm`)  

---

## 1. Vercel Project Settings

| Configuration Key | Required Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `Next.js` | Auto-detected by Vercel |
| **Root Directory** | `apps/web` | Essential for monorepo configuration |
| **Build Command** | `pnpm run build` | Compiles 40 static & dynamic routes |
| **Output Directory** | `.next` | Default Next.js production build output |
| **Install Command** | `pnpm install` | Fast dependency resolution with lockfile |
| **Node.js Version** | `20.x` | Matches production target |

---

## 2. Environment Variables Register for Vercel

Configure these under **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable Name | Environment Target | Required | Recommended Production Value | Description |
| :--- | :---: | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | Production & Preview | **YES** | `https://marketscope-api.onrender.com` | Public base URL for the backend API hosted on Render. |
| `NEXT_PUBLIC_APP_URL` | Production | **YES** | `https://marketscope.io` | Canonical domain for CORS and metadata links. |
| `NEXT_PUBLIC_APP_NAME` | All | No | `MarketScope.io` | Display name of the application. |
| `NEXT_PUBLIC_WS_HOST` | Production | No | `marketscope-api.onrender.com` | Custom WebSocket host for direct socket feeds. |
| `NEXT_PUBLIC_AI_ENABLED` | All | No | `true` | Toggles conversational AI assistant capabilities. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | All | Optional | `pk_live_...` or `pk_test_...` | Clerk authentication publishable frontend token. |
| `CLERK_SECRET_KEY` | Production | Optional | `sk_live_...` or `sk_test_...` | Clerk backend secret key (server-only; do NOT expose with NEXT_PUBLIC_). |

---

## 3. Deployment & CI/CD Coordination

- **Automated Deployments:** Connected to the `master` branch of `https://github.com/parth1511/marketscope.git`. Every push to `master` initiates a Vercel build.
- **Preview Deployments:** Pull requests trigger isolated preview environments for pre-merge testing.
- **Health Check Route:** Verify post-deployment status at `https://marketscope.io/` or `https://marketscope-web.vercel.app/overview`.
