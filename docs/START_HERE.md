# Start here

1. Read `README.md`.
2. Copy `.env.example` to `.env`.
3. Run `docker compose up -d db redis`.
4. Start API from `apps/api`.
5. Start web from `apps/web`.
6. Test search with `TCS`.
7. Start the first vertical slice from `docs/DEVELOPMENT_ROADMAP.md`.

Do not begin by wiring live exchange data or AI. Establish instrument identity, fact provenance, deterministic metrics and tests first.
