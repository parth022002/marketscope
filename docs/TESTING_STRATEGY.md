# MarketScope.io — Automated Testing & Quality Assurance Strategy

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Status:** Approved QA Blueprint  
**Standard:** PRD §22 & Security §15

---

## 1. Testing Philosophy & Pyramid

Financial intelligence products cannot tolerate arithmetic inaccuracies, tenant data leakage, or silent calculation errors. Every feature merged into MarketScope.io must be verified through automated tests executing in a clean environment.

```
                  ┌───────────────────────┐
                  │   End-to-End Tests    │  (Playwright: Critical Journeys)
                  ├───────────────────────┤
                  │   Integration Tests   │  (FastAPI + PostgreSQL + Tenancy)
                  ├───────────────────────┤
                  │ Golden Calculation    │  (Deterministic Metric Verification)
                  ├───────────────────────┤
                  │      Unit Tests       │  (Pydantic Schemas, Adapters, Libs)
                  └───────────────────────┘
```

---

## 2. Test Suites & Categorization

### 2.1 Backend Unit & Schema Tests (`apps/api/tests/unit`)
- Validates Pydantic schema validation, bounds checking, and default values.
- Validates provider adapter contracts and error translation.
- Validates cryptographic hashing functions for research snapshots.

### 2.2 Golden Calculation Test Suite (`apps/api/tests/golden`)
- Verifies every mathematical formula in `metric_definitions` against hand-verified financial test fixtures.
- Test cases include:
  - Positive earnings, negative earnings (losses).
  - High debt, zero debt, net cash companies.
  - Zero denominator handling (prevents `ZeroDivisionError`; yields `null` with explicit division warning).
  - Exact precision matching up to 4 decimal places.

### 2.3 API Contract & Integration Tests (`apps/api/tests/api`)
- Executes HTTP requests against FastAPI endpoints using `httpx.AsyncClient` or `TestClient`.
- Validates:
  - `/health` endpoint.
  - `/api/v1/instruments/search` (exact matches, partial matches, no results).
  - `/api/v1/instruments/{id}/dossier` (structure, status badges, currency labels).
  - `/api/v1/metrics/{id}/evidence` (derivation inputs and filing links).
  - Research note CRUD and snapshot generation.

### 2.4 Multi-Tenant Workspace Isolation Tests (`apps/api/tests/security`)
- Automated cross-tenant matrix:
  - Setup: Provisions `Workspace Alpha` (User A) and `Workspace Beta` (User B).
  - Scenario 1: User A creates a research note in Workspace Alpha.
  - Scenario 2: User B sends `GET /workspaces/{Alpha_ID}/notes/{Note_ID}` with User B's token.
  - Verification: Asserts response is strictly `403 Forbidden` or `404 Not Found`.
  - Scenario 3: User B attempts to overwrite or delete User A's snapshot. Asserts action fails immediately and generates an audit event.

### 2.5 Frontend Component & Accessibility Tests (`apps/web/tests`)
- Validates Next.js UI rendering with React Testing Library.
- Verifies:
  - Midnight brand theme tokens applied correctly.
  - Semantic negative red (`#F06464`) used for losses instead of green.
  - Tabular numerals enabled on financial data columns.
  - WCAG 2.2 AA contrast compliance using `axe-core`.
  - Loading, empty, and error state transitions.

---

## 3. Test Execution Commands

```bash
# Backend test execution (from apps/api):
pytest -v --tb=short

# Run with coverage report:
pytest --cov=app --cov-report=term-missing

# Run security tenancy tests specifically:
pytest tests/security/test_tenancy.py -v

# Run golden calculation tests specifically:
pytest tests/golden/ -v

# Frontend typecheck and linting (from apps/web):
npm run typecheck
npm run lint
```

---

## 4. Release Gates & Definition of Done

A feature is considered **DONE** only when:
1. All unit and API integration tests pass locally and in CI.
2. Golden calculation tests pass with zero discrepancy against benchmark values.
3. Multi-tenant isolation is verified for any new workspace-scoped resource.
4. Input validation and error handling are implemented and tested.
5. Code meets PEP 8 / ESLint standards and typechecks cleanly without `any` overrides.
6. Documentation in `docs/` is updated to reflect any API or schema additions.
