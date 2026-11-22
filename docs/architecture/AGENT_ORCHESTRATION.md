# Agent Orchestration & Permissions Specification
**Platform:** MarketScope.io  

## 1. Specialist Agent Directory & Permitted Toolsets

| Agent ID | Agent Role | Responsibility Scope | Permitted Tool Allowlists | Strictly Prohibited Capabilities |
|---|---|---|---|---|
| `agt_market_research` | Market Research Specialist | Macro breadth and sector relative strength | `get_market_overview`, `get_market_breadth` | Shell, Trade Routing, Arbitrary Code |
| `agt_company_research` | Company Research Specialist | Corporate structure, segments, ISINs | `resolve_instrument`, `get_company_profile` | Shell, Trade Routing, Arbitrary Code |
| `agt_fundamental_analysis` | Fundamental Analysis Specialist | Audited Ind AS/IFRS financials and 15 ratios | `calculate_financial_ratios`, `get_financial_statements` | Shell, Trade Routing, Arbitrary Code |
| `agt_valuation` | Valuation Specialist | DCF intrinsic modeling, WACC sensitivity | `calculate_dcf`, `get_valuation_multiples` | Shell, Trade Routing, Arbitrary Code |
| `agt_technical_analysis` | Technical Analysis Specialist | Candlestick patterns and technical indicators | `calculate_indicators`, `get_ohlcv_series` | Shell, Trade Routing, Arbitrary Code |
| `agt_quantitative_research` | Quantitative Research Specialist | Q-Intelligence multi-factor scorecards | `evaluate_q_intelligence` | Shell, Trade Routing, Arbitrary Code |
| `agt_risk_analysis` | Risk Analysis Specialist | Value at Risk (VaR), CVaR, Beta, Drawdowns | `calculate_risk_metrics` | Shell, Trade Routing, Arbitrary Code |
| `agt_news_intelligence` | News Intelligence Specialist | Regulatory filing verification and clustering | `get_news_feed`, `get_article_dossier` | Shell, Trade Routing, Arbitrary Code |
| `agt_macro_research` | Macro Research Specialist | Central bank interest rate decisions, CPI | `get_macro_events`, `get_calendar_events` | Shell, Trade Routing, Arbitrary Code |
| `agt_global_markets` | Global Markets Specialist | International bourses and session schedules | `get_global_market_status` | Shell, Trade Routing, Arbitrary Code |
| `agt_derivatives` | Derivatives Specialist | Options Greeks, Max Pain, futures build-up | `get_options_chain`, `get_derivatives_pulse` | Shell, Trade Routing, Arbitrary Code |
| `agt_portfolio_research` | Portfolio Research Specialist | Virtual paper trading exposure and backtests | `get_paper_portfolio`, `run_backtest` | Real Order Routing, Broker APIs |
| `agt_compliance` | Compliance Specialist | Non-advisory guardrails and disclaimer checks | `validate_disclaimer` | Shell, Trade Routing, Arbitrary Code |
| `agt_research_synthesis` | Research Synthesis Coordinator | Assembles 11-part structured dossier | `assemble_dossier` | Shell, Trade Routing, Arbitrary Code |
