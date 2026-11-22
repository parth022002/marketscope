# Engine Architecture Specification
**Platform:** MarketScope.io  

## 1. Engine Directory & Responsibilities
The platform operates 17 analytical, quantitative, intelligence, and data management engines:

```mermaid
graph LR
    subgraph Quant_Engines ["Quantitative Analysis Engines"]
        E1[calculations.py: 15 Financial Ratios & DCF]
        E2[technical_indicators.py: 14 Indicator Formulas]
        E3[derivatives_engine.py: Options Chain & Greeks]
        E4[risk_engine.py: VaR, CVaR, Sharpe, Drawdown]
        E5[regime_engine.py: Causal Market Regime Classifier]
        E6[anomaly_engine.py: Robust Z & MAD Diagnostics]
        E7[q_intelligence_ensemble.py: 9-Vector Master Scorecard]
    end

    subgraph Intel_Engines ["Market Intelligence Engines"]
        E8[market_intelligence.py: Breadth & Flow]
        E9[market_calendar.py: Multi-Exchange Session Status]
        E10[news_service.py: 7-Category Verified News]
        E11[ai_orchestrator.py: 14 Specialist Agents]
        E12[assistant_service.py: Research Chatbot]
    end

    subgraph Core_Engines ["Simulation & Data Engines"]
        E13[backtest_engine.py: Causal Strategy Simulator]
        E14[paper_trading_engine.py: Virtual Ledger MTM]
        E15[screener_engine.py: Universal Multi-Factor Screener]
        E16[global_instrument_master.py: Securities Resolver]
        E17[data_quality_engine.py: Provenance & Range Validator]
    end
```

## 2. Execution Contracts & Guarantees
- Every analytical engine provides typed Pydantic input and output schemas.
- Calculations execute with deterministic reproducibility.
- Zero future-lookahead bias is strictly maintained across regime detection, technical indicators, and backtesting.
