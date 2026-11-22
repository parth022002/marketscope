# MarketScope.io — AI Data Privacy & Confidentiality Policy

## 1. Zero Model Training Policy
MarketScope.io maintains a strict zero-retention and zero-training agreement with upstream LLM providers (Google Vertex AI, Anthropic, OpenAI):
- **No Training on User Data**: User queries, watchlists, paper portfolios, and research notes are never used to train or fine-tune public foundation models.
- **Enterprise Ephemeral Processing**: All API calls utilize enterprise-tier endpoints where inputs and outputs are processed ephemerally in memory and discarded immediately upon completion.

---

## 2. In-Flight PII Redaction
Prior to dispatching any prompt or context payload to an LLM provider, all text passes through the `CentralAIOrchestrator._redact_pii()` filter:
- **Email Addresses**: Redacted to `[REDACTED_EMAIL]`.
- **Phone Numbers**: Redacted to `[REDACTED_PHONE]`.
- **Credit Card / PAN / Aadhaar Numbers**: Redacted to `[REDACTED_FINANCIAL_ID]`.
- **API Keys & Bearer Tokens**: Automatically detected and stripped.

---

## 3. Workspace Boundary Isolation
Multi-tenant isolation ensures that research notes and custom screener formulas created in one user workspace cannot be retrieved, indexed, or surfaced to another user workspace.
