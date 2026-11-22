# Calendar, Chatbot & News Integration Specification

## 1. Cross-Module System Synthesis
The three newly developed systems operate in cohesive synergy:

```
                          ┌─────────────────────────────────────┐
                          │     Floating AI Research Chatbot    │
                          │   (Context-Aware, Multi-Intent)     │
                          └──────────┬──────────────┬───────────┘
                                     │              │
                   Queries Market    │              │ Queries Catalysts
                   & Regulatory News │              │ & Session Status
                                     ▼              ▼
       ┌───────────────────────────────┐          ┌──────────────────────────────┐
       │   Global News Intelligence    │◄────────►│    Global Market Calendar    │
       │  (7 Taxonomies, Verification) │          │  (Holidays, Sessions, Hours) │
       └───────────────────────────────┘          └──────────────────────────────┘
                       │                                         │
                       └───────────────────┬─────────────────────┘
                                           │
                                           ▼
                       ┌───────────────────────────────────────┐
                       │   MarketScope Unified Web Platform   │
                       │   - Navigation Header Status Widget   │
                       │   - Homepage Calendar & Catalysts     │
                       │   - Dedicated /calendar Workspace     │
                       │   - Verified /news Feed & Dossiers    │
                       └───────────────────────────────────────┘
```

## 2. Key Integration Workflows
1. **Calendar + News**: When viewing high-impact economic catalysts (e.g. RBI MPC Rate Decision or US FOMC), users can directly navigate to verified regulatory news coverage and policy statement analyses.
2. **Chatbot + Calendar**: The chatbot detects queries such as *"Is the Indian stock market open today?"*, *"When is the next US Fed meeting?"*, or *"Is NSE open on April 1?"*, dynamically querying the authoritative calendar engine to deliver instant, contextual answers.
3. **Chatbot + News**: When asked *"What are the latest developments with Reliance or RBI regulations?"*, the assistant performs grounded retrieval across recent canonical news articles, providing direct article citations and source links.
4. **Chatbot + Company Research**: On company pages (`/company/[symbol]`), the assistant automatically extracts audited financial ratios and recent filings for that specific stock symbol.
