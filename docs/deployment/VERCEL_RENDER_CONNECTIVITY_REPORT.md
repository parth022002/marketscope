# MarketScope.io — Vercel & Render Cross-Service Connectivity Report

## 1. Executive Summary

A critical objective of this audit was verifying reliable, low-latency, and secure cross-service communication between the frontend on **Vercel** (`*.vercel.app`) and the backend on **Render** (`marketscope-api.onrender.com`).

---

## 2. Identified Bottleneck: CORS Preflight Block (Resolved)

### The Root Cause
During cross-origin REST requests (`GET`, `POST`, `OPTIONS`) initiated by the browser client on Vercel to Render, browsers submit a CORS preflight `OPTIONS` request.
FastAPI's CORS middleware configuration in `apps/api/app/main.py` previously configured:
```python
allow_origin_regex=r"^https:\/\/.*\.onrender\.com$"
```
Because the Vercel frontend domain was `https://marketscope-web.vercel.app`, the preflight request failed with:
`Access to fetch at 'https://marketscope-api.onrender.com/...' from origin 'https://marketscope-web.vercel.app' has been blocked by CORS policy`.

### The Remediation
The CORS configuration in `apps/api/app/main.py` was updated to:
```python
allow_origin_regex=r"^https:\/\/.*(\.onrender\.com|\.vercel\.app)$"
```
This permanently allows:
- All Vercel production and preview deployment URLs (`*.vercel.app`)
- All Render preview and production URLs (`*.onrender.com`)
- Explicit origins listed in `CORS_ORIGINS` (`http://localhost:3000`, custom domains `marketscope.io`)

---

## 3. Communication Matrix

| Flow | Direction | Protocol | Security | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Client REST API** | Browser (Vercel) $\rightarrow$ Render | HTTPS (TLS 1.3) | CORS + Bearer Token | **VERIFIED** |
| **Real-Time Quotes** | Browser (Vercel) $\rightarrow$ Render | WSS (WebSocket TLS) | Secure Origin Check | **VERIFIED** |
| **SSR Data Fetching** | Next.js Server $\rightarrow$ Render | HTTPS (TLS 1.3) | Direct Server-to-Server | **VERIFIED** |
| **Database Queries** | Render $\rightarrow$ Neon PostgreSQL | TCP + Direct SSL | TLS 1.3 + Password | **VERIFIED** |
| **Identity Verification** | Render $\rightarrow$ Clerk API | HTTPS | API Secret Key | **VERIFIED** |
| **AI LLM Queries** | Render $\rightarrow$ Groq / Gemini | HTTPS | API Secret Key | **VERIFIED** |

---

## 4. End-to-End Verification Check

1. **Preflight OPTIONS Check:**
   `curl -X OPTIONS https://marketscope-api.onrender.com/api/v1/instruments/AAPL/quote -H "Origin: https://marketscope-web.vercel.app" -H "Access-Control-Request-Method: GET"`
   $\rightarrow$ Returns HTTP 200 with `Access-Control-Allow-Origin: https://marketscope-web.vercel.app`.
2. **WebSocket Handshake Check:**
   Vercel frontend opens `wss://marketscope-api.onrender.com/ws/quotes`.
   $\rightarrow$ Handshake accepted and live ticks stream.
3. **Admin Configuration Diagnostic:**
   Next.js admin page at `/admin` fetches `/api/v1/admin/config-diagnostics` cleanly without cross-origin exceptions.
