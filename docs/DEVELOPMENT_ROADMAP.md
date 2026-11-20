# Development roadmap

## Sprint 0 — foundation
- Confirm repo conventions, environment, formatting and CI.
- Establish database migration strategy.
- Add security headers, configuration validation and structured logging.
- Record architecture decision records.

## Sprint 1 — first vertical slice
- Instrument search and identity resolution.
- Dossier API and UI.
- Synthetic financial facts.
- Fact provenance and data-status labels.
- API and UI tests.

## Sprint 2 — financial data foundation
- Canonical financial statement schema.
- Period/basis/currency normalisation.
- Provider adapter contract and rights registry.
- Import validation and data-quality tests.

## Sprint 3 — metric engine
- Versioned metric catalogue.
- Deterministic calculation functions.
- Formula/unit/period compatibility checks.
- Regression fixtures.

## Sprint 4 — evidence and research memory
- Evidence inspector.
- Counter-evidence records.
- Notes, thesis and immutable research snapshots.
- Snapshot comparison.

## Sprint 5 — discovery workflows
- Screener filters and saved screens.
- Peer comparison.
- Watchlists and research journal.

## Sprint 6 — release hardening
- Authentication and workspace isolation.
- Security/privacy test suite.
- Monitoring, backup and restore.
- Provider rights and legal review.
- Usability and accessibility validation.

AI and production market-data integrations are separate gated tracks, not prerequisites for the first vertical slice.
