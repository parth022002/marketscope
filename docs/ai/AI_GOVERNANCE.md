# MarketScope.io — AI Governance & Risk Management Framework

## 1. Principles of Financial AI Governance
Financial intelligence platforms demand rigorous governance to prevent misleading recommendations, financial loss, and regulatory non-compliance. MarketScope.io strictly adheres to five core governance pillars:
1. **Explainability & Model Transparency**: Every analytical score, risk metric, and synthetic insight must expose its contributing mathematical factors and input data sources.
2. **Deterministic Primacy**: Statistical and quantitative formulas (e.g., VaR, Sharpe, Piotroski F-Score, Altman Z-Score) are calculated via compiled mathematical engines (`scipy`, `numpy`) rather than estimated by LLMs.
3. **Traceable Grounding & Zero Hallucination**: AI outputs must link directly to auditable primary sources (SEC filings, verified wire news, official exchange tickers).
4. **Non-Custodial Non-Advisory Demarcation**: AI outputs are strictly educational research tools; no auto-execution or personalized investment advice is generated.
5. **Continuous Model Validation**: All prompt templates, agent system instructions, and routing trees undergo automated regression tests against synthetic adversarial prompts.

---

## 2. Regulatory Alignment & Compliance Mapping
MarketScope.io's AI governance aligns with major global AI and financial regulatory frameworks:
- **EU Artificial Intelligence Act (EU AI Act)**: Categorized as Limited / Specific Risk AI system. Implements transparency obligations, watermarking of AI-generated synthesis, and human-in-the-loop auditability.
- **US SEC & FINRA Guidelines (Reg BI & Rule 2210)**: Strict disclaimer enforcement prohibiting promissory language, unsubstantiated return projections, or obscured investment risks.
- **NIST AI Risk Management Framework (AI RMF 1.0)**: Systematic implementation of `Govern`, `Map`, `Measure`, and `Manage` functions across all 14 specialist research agents.

---

## 3. Human Oversight & Administrative Controls
The Administrative Control Centre (`/admin`) provides real-time operational visibility into:
- Total AI agent dispatches and token consumption.
- Triggered prompt injection alerts and blocked inputs.
- Source citation coverage percentage (rejecting dossiers where < 90% of facts lack primary source attribution).
- Circuit breaker controls to immediately suspend individual specialist agents.
