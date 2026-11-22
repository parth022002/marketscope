# Chatbot Retrieval & Citation System Specification

## 1. Grounded RAG Architecture
The MarketScope Assistant enforces a zero-hallucination, grounded Retrieval-Augmented Generation (RAG) framework. Whenever the assistant presents empirical facts, financial metrics, regulatory policies, or market status states, every assertion must be anchored in verified source evidence.

## 2. Citation Model Structure
Every generated assistant message returns structured citation objects:
```json
{
  "citation_id": "cite-reliance-filing-01",
  "title": "Reliance Industries Limited Audited Financial Results",
  "source_name": "NSE Corporate Filings",
  "url": "https://www.nseindia.com/companies-listing/corporate-filings",
  "citation_type": "PRIMARY_FILING",
  "snippet": "ROCE calibrated at 14.2%, Debt-to-Equity at 0.38 as per audited annual report.",
  "timestamp": "2026-03-31T00:00:00Z"
}
```

## 3. Strict Boundary Between Facts & Reasoning
To maintain transparency:
- **Retrieved Facts**: Explicitly attributed to the underlying data provider or primary regulatory registry (NSE, BSE, SEBI, RBI, US SEC, BLS, BEA).
- **AI Synthesis / Analytical Interpretation**: Distinctly delineated in the prose using explanatory framing (e.g., *"Based on the reported debt-to-equity ratio of 0.38, the company maintains conservative financial leverage relative to capital-intensive peers..."*).
- **Direct External Links**: Each citation pill in the frontend chat panel is clickable, allowing users to verify claims against the original document source.

## 4. Conversation State & Feedback Loop
- **Persistent Conversation Threads**: Each conversation maintains a unique UUID `conversation_id` with ordered user and assistant messages.
- **Thread Management**: Users can create new threads, switch between sessions, or delete conversation history.
- **Feedback Mechanism**: Users can submit granular thumbs-up / thumbs-down ratings (`POST /api/v1/assistant/feedback`) with qualitative notes for continuous model evaluation and response auditing.
