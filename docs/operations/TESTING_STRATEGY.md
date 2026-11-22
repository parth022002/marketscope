# MarketScope.io — Master Testing Strategy & Quality Assurance

## 1. Testing Pyramid & Verification Framework
MarketScope.io adopts a comprehensive test automation strategy:

```
          / \
         / E2E \       Playwright / Cypress (Critical User Journeys)
        /-------\
       /  Integ  \     API Route Validation, DB & Cache Integration
      /-----------\
     /    Unit     \   NumPy Risk Formulas, Data Quality, Regime Logic
    +---------------+
```

---

## 2. Test Execution Commands & Suites
- **Backend Unit & Integration Suite**:
  ```bash
  apps/api/.venv/Scripts/python -m pytest apps/api/tests -v
  ```
  Covers: Data quality engine, quantitative factor scoring, risk engine, anomaly detection, AI orchestrator, middleware boundaries.
- **Frontend Verification & Type Checking**:
  ```bash
  npm --prefix apps/web run lint
  npm --prefix apps/web run build
  ```
  Validates TypeScript type safety, ESLint compliance, and Next.js bundle compilation.

---

## 3. Coverage Thresholds
- Core quantitative engines: >= 90% branch coverage.
- Middleware & security guards: 100% path coverage.
- API route contracts: 100% schema validation coverage via Pydantic response models.
