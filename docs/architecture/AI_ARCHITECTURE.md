# AI Architecture Specification
**Platform:** MarketScope.io  

## 1. Central Multi-Agent Orchestrator
MarketScope deploys a centralized orchestration layer (`app.engine.ai_orchestrator`) coordinating 14 role-specific financial research agents:

```
                            ┌────────────────────────────┐
                            │    User / Chat Request     │
                            └─────────────┬──────────────┘
                                          │
                                          ▼
                            ┌────────────────────────────┐
                            │   PII & Injection Filter   │
                            └─────────────┬──────────────┘
                                          │
                                          ▼
                            ┌────────────────────────────┐
                            │     AI Orchestrator        │
                            └─────────────┬──────────────┘
                                          │
          ┌───────────────────────────────┴───────────────────────────────┐
          ▼                                                               ▼
┌────────────────────────┐                                    ┌────────────────────────┐
│ Fundamental Agent      │                                    │ Valuation Agent        │
│ (Audited Statement RAG)│                                    │ (DCF & WACC Models)    │
└─────────┬──────────────┘                                    └──────────┬─────────────┘
          │                                                              │
          ├───────────────────────────────┬──────────────────────────────┤
          ▼                               ▼                              ▼
┌────────────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│ Risk Analysis Agent    │    │ News Intelligence Agent│    │ Regime Detection Agent │
│ (VaR & Max Drawdown)   │    │ (Primary Filings & URL)│    │ (Causal Regime States) │
└─────────┬──────────────┘    └───────────┬────────────┘    └────────────┬───────────┘
          │                               │                              │
          └───────────────────────────────┼──────────────────────────────┘
                                          │
                                          ▼
                            ┌────────────────────────────┐
                            │ Research Synthesis Agent   │
                            │ (11-Part Standard Dossier) │
                            └─────────────┬──────────────┘
                                          │
                                          ▼
                            ┌────────────────────────────┐
                            │ Compliance & Citation Check│
                            └────────────────────────────┘
```

## 2. Multi-Model Provider Cascading
1. **Tier 1 (High Throughput)**: Groq Cloud API (LLaMA 3.3 70B Versatile) for low-latency synthesis.
2. **Tier 2 (Deep Reasoning)**: Google Gemini 1.5 Flash for multimodal document and filing exhibit parsing.
3. **Tier 3 (Alternative)**: OpenRouter API for redundant fallback across diverse model architectures.
4. **Tier 4 (Guaranteed Offline Resilience)**: In-house Deterministic Grounded RAG engine compiling audited financial ratios with exact formula citations.
