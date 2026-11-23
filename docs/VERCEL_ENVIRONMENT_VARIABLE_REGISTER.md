# MarketScope.io — Definitive Vercel Environment Variable Register

**Platform:** Vercel Edge & Serverless Network  
**Target Application:** Frontend Web Application (`apps/web`)  
**Deployment URL:** `https://marketscope.io` / `https://marketscope-web.vercel.app`

---

## 1. Environment Variable Inventory & Classification

| Variable Name | Required | Classification | Scope / Environment | Verified Code Reference | Value Format / Description |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | **YES** | Public | Production, Preview, Dev | `apps/web/src/lib/api.ts#L2-L17` | `https://marketscope-api.onrender.com` (Target backend API) |
| `NEXT_PUBLIC_APP_URL` | **YES** | Public | Production, Preview, Dev | `apps/web/src/app/layout.tsx#L12` | `https://marketscope.io` (Public website root domain) |
| `NEXT_PUBLIC_APP_NAME` | Optional | Public | All Environments | `apps/web/src/config/env-validator.ts#L7` | Default: `MarketScope.io` |
| `NEXT_PUBLIC_WS_HOST` | Optional | Public | All Environments | `apps/web/src/lib/useMarketWebSocket.ts#L42` | `marketscope-api.onrender.com` (Auto-derived from API Base if omitted) |
| `API_INTERNAL_BASE_URL` | Optional | Private / Server | Server-side SSR | `apps/web/src/lib/api.ts#L5` | Internal direct service bridge for server-side fetches |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional | Public | Production, Preview, Dev | `apps/web/src/config/env-validator.ts#L8` | `pk_test_...` or `pk_live_...` (Clerk Authentication) |
| `CLERK_SECRET_KEY` | Optional | Secret / Private | Server-side only | `apps/web/src/middleware.ts` | `sk_test_...` or `sk_live_...` (Never expose via NEXT_PUBLIC) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Optional | Public | All Environments | Clerk route configuration | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Optional | Public | All Environments | Clerk route configuration | `/sign-up` |
| `NEXT_PUBLIC_AI_ENABLED` | Optional | Public | All Environments | `apps/web/src/config/env-validator.ts#L22` | Default: `true` (Toggles UI AI synthesis panels) |
| `NEXT_PUBLIC_DEVELOPER_NAME` | Optional | Public | All Environments | `apps/web/src/config/site.ts#L4` | `Parth` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional | Public | All Environments | `apps/web/src/config/site.ts#L5` | `support@marketscope.io` |

---

## 2. Vercel Project Settings Checklist

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web` (or root if monorepo auto-detected)
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`
- **Node.js Version:** `20.x` or `22.x`
- **Serverless Function Region:** `iad1` (Washington D.C.) or `sin1` (Singapore, closest to Neon DB)

---

## 3. Security Guidelines for Vercel

1. **Zero Secret Exposure:** Never prefix private API keys (e.g., `CLERK_SECRET_KEY`, database credentials, or AI provider keys) with `NEXT_PUBLIC_`.
2. **CORS Protocol Alignment:** Ensure `NEXT_PUBLIC_API_BASE_URL` uses strict `https://` in production so that WebSocket handshakes upgrade to `wss://` automatically without mixed-content blocking.
