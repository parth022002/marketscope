# MarketScope.io — Vercel Deployment Audit

## 1. Overview & Architecture

The MarketScope.io frontend is hosted on **Vercel** (`marketscope-web.vercel.app`), built with **Next.js 15.2**, React 19, Tailwind CSS, Lucide icons, and Lightweight Charts.

- **Deployment Platform:** Vercel (Edge & Serverless Node.js 20.x runtime)
- **Framework:** Next.js 15.2 (App Router)
- **Static Page Generation:** 39 pre-rendered routes verified
- **Root Directory:** `apps/web`

---

## 2. Configuration Analysis (`vercel.json`)

The project configuration in `vercel.json` and `apps/web/next.config.ts` was audited:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

### Key Audit Points:
1. **API Proxying vs Direct Communication:**
   - The frontend communicates with the backend via `NEXT_PUBLIC_API_BASE_URL`.
   - In production on Vercel, this is set to `https://marketscope-api.onrender.com`.
   - In local development, it defaults to `http://localhost:8000`.
2. **Security Headers:**
   - `X-Frame-Options: SAMEORIGIN` prevents clickjacking attacks.
   - `X-Content-Type-Options: nosniff` prevents MIME-sniffing exploits.
   - `Referrer-Policy: strict-origin-when-cross-origin` protects sensitive URL paths.
3. **Clerk Middleware:**
   - `middleware.ts` guards protected routes (`/workspace`, `/portfolio`, `/admin`, `/alerts`) while maintaining public access to marketing, research, and documentation pages (`/`, `/explore`, `/company/*`, `/docs/*`).

---

## 3. Required Vercel Environment Variables

To ensure 100% operational integrity on Vercel, the following variables must be configured in **Vercel Project Settings $\rightarrow$ Environment Variables**:

| Variable | Target | Recommended Production Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | Production | `MarketScope.io` | Client application display name |
| `NEXT_PUBLIC_API_BASE_URL` | Production | `https://marketscope-api.onrender.com` | Render backend API endpoint |
| `NEXT_PUBLIC_WS_HOST` | Production | `marketscope-api.onrender.com` | WebSocket host for real-time streaming |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Production | `pk_live_...` (or test key during staging) | Clerk client authentication key |
| `CLERK_SECRET_KEY` | Production | `sk_live_...` (or test key during staging) | Clerk server-side secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Production | `/sign-in` | Clerk sign-in path |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Production | `/sign-up` | Clerk sign-up path |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Production | `/workspace` | Post-auth landing route |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Production | `/workspace` | Post-auth landing route |
| `NEXT_PUBLIC_AI_ENABLED` | Production | `true` | Enables AI research features |

---

## 4. Build & Deployment Verification

- **Automated Next.js Production Build:** Completed successfully.
- **Output:** 39 static routes generated cleanly.
- **Zero TypeScript errors** and **Zero ESLint breaking violations**.
