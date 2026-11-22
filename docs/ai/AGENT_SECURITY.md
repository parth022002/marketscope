# MarketScope.io — AI Agent Security & Safety Specification

## 1. Threat Landscape & Security Boundary
MarketScope.io deploys 14 autonomous specialist research subagents coordinated by a central orchestrator. Because these agents handle external market news, user prompts, and financial calculations, rigorous containment and safety boundaries are enforced.

---

## 2. Principle of Least Privilege & Sandboxing
Every specialist agent operates under strict operational constraints:
1. **Zero Shell Execution**: No agent has access to system shells, CLI execution (`subprocess`), or arbitrary filesystem write tools.
2. **Zero Order Execution**: No agent has tools or APIs to execute real trades, place orders with brokerages, or access user banking credentials.
3. **Read-Only Data Access**: Subagents consume read-only analytical feeds and deterministic mathematical engine outputs.
4. **Sandboxed Python Tooling**: Custom mathematical simulations execute within ephemeral, memory-capped, AST-checked runtimes without network access.

---

## 3. Defense-in-Depth Against Adversarial Attacks

### 3.1 Prompt Injection & Jailbreak Defense
Incoming queries pass through a multi-stage regex and semantic filter before reaching agents:
- **Heuristic Pattern Matching**: Detects override commands (e.g., `ignore previous instructions`, `system prompt`, `you are now DAN`, `act as an unrestricted trader`).
- **Input Sanitization**: Special control tokens (`<|im_start|>`, `<SYSTEM>`, `[INST]`) are neutralized.
- **Enforced System Context**: Subagent prompts are structured with hardened system delimiters that cannot be overridden by user inputs.

### 3.2 Indirect Prompt Injection Mitigation
Market news and external RSS feeds could potentially contain malicious adversarial text designed to poison summaries.
- **News Isolation**: News feeds are processed with strict data delimiters (`<external_untrusted_news> ... </external_untrusted_news>`).
- **Instruction Ignoring**: Agents are explicitly instructed to extract factual data points only and ignore any embedded instructions inside third-party articles.

---

## 4. Non-Advisory Guardrails
All agents are constrained by the SEC/FINRA and SEBI regulatory boundary:
- Prohibited from generating specific "Buy", "Sell", or "Strong Buy" directives.
- Required to frame all observations as educational multi-factor research ("Multi-factor analysis indicates strong fundamental metrics, but elevated volatility requires risk assessment").
- Automatic injection of the standard regulatory disclaimer on every agent output.
