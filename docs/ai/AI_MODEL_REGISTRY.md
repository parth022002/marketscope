# MarketScope.io — AI Model Registry & Inventory

## 1. Executive Overview
MarketScope.io deploys a multi-model, multi-tiered AI architecture designed for low-latency financial analytics, grounded retrieval-augmented generation (RAG), and deterministic quantitative orchestration. To prevent vendor lock-in and optimize unit economics, MarketScope.io supports both primary Frontier LLMs and local fallback quantized models.

---

## 2. Model Inventory & Specification Matrix

| Model Tier | Model Identifier | Primary Provider | Context Window | Target Latency (p95) | Primary Role | Fallback Model |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Frontier Synthesis** | `gemini-1.5-pro-002` / `claude-3-5-sonnet` | Google Cloud / Anthropic | 128k - 200k tokens | < 1,800 ms | Comprehensive 11-part dossier generation, multi-source conflict reconciliation | `gemini-1.5-flash` |
| **Tier 2: Fast Agent Routing** | `gemini-1.5-flash` / `gpt-4o-mini` | Google Cloud / OpenAI | 64k - 128k tokens | < 450 ms | 14 specialist subagent task execution, prompt routing, intent triage | `mistral-small` |
| **Tier 3: Local / On-Prem Fallback** | `llama-3.1-8b-instruct-q4` | Ollama / vLLM (Self-hosted) | 8k tokens | < 300 ms | Air-gapped fundamental summarization, offline development mode | Rule-based parser |
| **Tier 4: Financial Embedding** | `text-embedding-004` / `bge-base-en-v1.5` | Google Cloud / HuggingFace | 2,048 tokens / 768 dims | < 80 ms | Vector search over SEC 10-K/10-Q filings, earnings transcripts, verified news | TF-IDF BM25 fallback |

---

## 3. Deployment & Runtime Configuration
- **API Key & Credential Isolation**: Managed via encrypted environment variables (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) and accessed via the centralized Settings abstraction (`app.core.config.get_settings()`).
- **Temperature & Determinism Policy**:
  - Quantitative Synthesis & Dossiers: `temperature = 0.1`, `top_p = 0.95` (minimizes hallucinatory drift).
  - Categorization & Agent Intent Routing: `temperature = 0.0` (strict deterministic classification).
  - Conversational Explanations: `temperature = 0.3` (fluid explanations maintaining factual rigor).
- **Rate-Limiting & Quota Throttling**:
  - Token bucket rate limiter enforced per provider per minute.
  - Automatic exponential backoff with jitter on HTTP 429 and 503 error codes.

---

## 4. Evaluation & Degradation Policy
When upstream frontier model providers experience degraded latency (>5,000 ms) or connectivity disruption, the Central AI Orchestrator automatically falls back to deterministic mathematical calculations (`q_intelligence_ensemble.py`, `risk_engine.py`) and presents verifiable analytical tables with an explicit warning banner: `[DEGRADED_MODE: DETERMINISTIC_ENGINE_ACTIVE]`.
