# Floating AI Assistant Specification

## 1. Product Overview & User Interface
The MarketScope Floating AI Assistant (`FloatingAssistantChatbot.tsx`) is a persistent conversational research companion available across all application routes in the bottom-right viewport. It bridges platform support guidance with quantitative financial research, providing grounded market intelligence with full citation tracing.

## 2. Core Capabilities & Intent Modes
The assistant service routes user queries through an intent classifier supporting 6 operational categories:
1. `MARKET_STATUS`: Real-time session status, countdown to open/close, holiday disclosures, and market hours across NSE, BSE, MCX, NYSE, NASDAQ, and LSE.
2. `PLATFORM_SUPPORT`: Navigational assistance, feature explainers, and usage instructions for MarketScope screeners, lightweight charts, option chain Greeks, and canonical news.
3. `MARKET_EDUCATION`: Pedagogical breakdowns of financial concepts (e.g., ROCE vs ROE, Black-Scholes Greeks, Free Cash Flow Yield, Maximum Pain theory).
4. `COMPANY_RESEARCH`: Quantitative fundamental dossiers extracting audited financial ratios (P/E, EV/EBITDA, ROCE, Debt/Equity, Operating Margin), balance sheet quality, and official filing provenance.
5. `NEWS_ANALYSIS`: Synthesizing real-time regulatory filings, macroeconomic announcements, and corporate disclosures with direct source attribution.
6. `GENERAL_FINANCE`: Institutional financial principles and portfolio risk concepts.

## 3. Context Awareness Engine
The assistant automatically detects client-side context to provide immediate relevance:
- When on `/company/[symbol]` (e.g., `/company/reliance`), the assistant recognizes the active company and offers quick prompts tailored to that stock (e.g., "Analyze Reliance ROCE & Debt", "What are the latest filings?").
- When on `/charts`, it senses the charting canvas and indicator state.
- When on `/calendar`, it provides contextual explanations for upcoming catalysts.
- When on `/news`, it offers synthesis of breaking regulatory stories.

## 4. Safety Guardrails & Compliance
In strict adherence to financial technology compliance and SEC/SEBI non-custodial positioning:
- **No Guaranteed Returns**: The assistant never guarantees stock performance, price targets, or trading profits.
- **Non-Advisory Position**: Every response carries the standard non-custodial disclaimer: *"For research and educational purposes only. MarketScope does not provide investment advice or broker execution."*
- **No Fabricated Pricing**: All numerical data points are extracted from audited backend engine models. If an instrument is not covered, the system explicitly states coverage limits.
- **Prompt Injection Defense**: Sanitization filters strip out system prompt override attempts, roleplay attacks, or adversarial bypass directives.
