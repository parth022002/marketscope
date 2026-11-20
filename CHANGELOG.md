# Changelog — MarketScope.io

All notable changes to the **MarketScope.io** codebase and documentation are recorded here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), adhering to Semantic Versioning.

---

## [0.2.0] — 2026-11-20 (Phase 1: Integrations & Authentication Integration)

### Added
- **Clerk Authentication SDK Integration:** Installed `@clerk/nextjs` (v7.10.5 Core 3) into `apps/web`.
- **Clerk Route Architecture:** Added `src/middleware.ts`, `/sign-in/[[...sign-in]]`, `/sign-up/[[...sign-up]]`, and wrapped root application layout with `<ClerkProvider>`.
- **Interactive Auth Controls:** Integrated `<Show when="signed-out">`, `<SignInButton>`, `<SignUpButton>`, `<Show when="signed-in">`, and `<UserButton />` wrapped in `<Suspense>`.
- **Clerk Agent Skills:** Installed 8 Clerk skills (`clerk-backend-api`, `clerk-cli`, `clerk-custom-ui`, `clerk-nextjs-patterns`, `clerk-orgs`, `clerk-setup`, `clerk-testing`, `clerk-webhooks`) for Antigravity and Gemini.
- **Clerk Health Verification:** `clerk doctor` executed with 100% checks passing. Linked to application `MarketScope` (`app_3MM9kR6zjk1ZzCJ9wEw6KJ2WvOh`).
- **Midnight Brand System Implemented:** Upgraded `apps/web/src/app/globals.css` with the official Midnight palette (`#07152B`, `#0B1D38`, `#087BEE`, `#16C8D5`, `#39E85B`, `#F06464`) and Inter typography with tabular numerals.
- **Upstash Ecosystem:** Installed remote Upstash MCP server and Agent skills (`upstash setup --yes --gemini`).
- **Database Vault:** Configured Neon Serverless PostgreSQL (Direct and Pooled connection strings) in `.env` and `apps/api/.env`.
- **AI Credentials Vault:** Configured OpenRouter, Groq, and Gemini API keys in local uncommitted environment files (gated until Phase 5).
- **GitHub Link:** Initialized dedicated Git repository linked to `https://github.com/parth022002/marketscope.git`.

---

## [0.1.0] — 2026-11-19 (Phase 0: Project Discovery & Development Baseline)

### Added
- **Project Documentation Inventory:** Created `docs/PROJECT_DOCUMENTATION_INVENTORY.md` cataloging all 7 uploaded specifications and establishing the authoritative document hierarchy.
- **Requirements Traceability Matrix:** Created `docs/REQUIREMENTS_TRACEABILITY_MATRIX.md` mapping PRD functional modules, security controls, and design requirements to backlog tickets (MS-001 through MS-025).
- **Architecture Decision Records:** Created `docs/TECHNICAL_DECISIONS.md` recording ADR-001 through ADR-010.
- **User Input & Configuration Guide:** Created `docs/USER_INPUT_AND_CONFIGURATION_GUIDE.md` detailing all credentials, providers, and setup steps organized by phase.
- **Configuration Status Tracker:** Created `docs/CONFIGURATION_STATUS.md`.
- **Safe Environment Templates:** Created `.env.example`, `apps/web/.env.local.example`, `apps/api/.env.example`, and `config/integrations.example.yaml`.
- **Master Engineering Specs:** Created `docs/ARCHITECTURE.md`, `docs/DATABASE_SCHEMA.md`, `docs/API_DOCUMENTATION.md`, `docs/SECURITY_IMPLEMENTATION.md`, `docs/TESTING_STRATEGY.md`, and `docs/DEPLOYMENT_GUIDE.md`.
- **Implementation Status:** Created `docs/IMPLEMENTATION_STATUS.md`.
