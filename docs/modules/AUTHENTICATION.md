# MarketScope.io — Authentication Module

## 1. Overview
The Authentication module manages user identity, session management, secure tokens, and permission boundaries using **Clerk** on the Next.js frontend and RS256 JWT validation on the FastAPI backend.

## 2. Components & Flow
- **Client Integration**: `@clerk/nextjs` wraps the application root in `apps/web/src/app/layout.tsx`. Protected actions (saving watchlists, saving chart layouts, executing paper trades) trigger Clerk modal dialogs if the user is unauthenticated.
- **Backend Token Verification**: Protected API endpoints parse `Authorization: Bearer <token>` headers, decoding the JWT using Clerk's public JWKS keyset.
- **User Record Sync**: When a user signs in for the first time, a corresponding profile record is created in the PostgreSQL database with default preferences (currency: INR, default exchange: NSE, theme: dark).
