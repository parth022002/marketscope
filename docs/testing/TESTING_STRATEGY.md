# MarketScope.io — Testing Strategy

## 1. Multi-Tier Testing Pyramid
```
         [ End-to-End Tests ]
        Next.js Route Compilation
       28/28 Page Build Validation
   ─────────────────────────────────
      [ Integration Test Suite ]
       FastAPI TestClient + Pytest
      API Endpoints & Database Ops
   ─────────────────────────────────
       [ Domain Unit Test Suite ]
     Indicator Math, Greeks, Backtest
    Vectorized NumPy & SciPy Engines
```

## 2. Test Execution Guidelines
- **Unit Tests**: Zero network dependency. Execute mathematical verifications against fixed canonical arrays.
- **Integration Tests**: Verify FastAPI controllers, schema validations, query parameter handling, and error codes using `httpx.AsyncClient` or `starlette.testclient.TestClient`.
- **Frontend Build**: Execute `npm run build` to verify TypeScript typing, static route generation, and module bundling across all 28 Next.js pages.
