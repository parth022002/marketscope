# MarketScope.io — Product Requirements Specification

## 1. Functional Requirements

### 1.1 Universal Instrument Discovery & Search
- Users must be able to search across all supported exchanges (NSE, BSE, NASDAQ, NYSE, LSE) by ticker symbol, company name, or ISIN.
- Autocomplete search must return results within 100ms, displaying exchange badges, asset type, and current quote snapshot.

### 1.2 Interactive Financial Charting
- Support candlestick, bar, line, and area chart formats across standard timeframes (1m, 5m, 15m, 1D, 1W).
- Provide 14 standard technical indicators (SMA, EMA, WMA, HMA, RSI, MACD, Bollinger Bands, ATR, Supertrend, Stochastic RSI, CCI, Williams %R, Ichimoku Cloud, Keltner Channels, Chaikin Money Flow).
- Support drawing annotations: Trend Line, Horizontal Ray, Fibonacci Retracement, Rectangle, Price Range, Text Note.
- Support multi-chart grid views (1x, 2H, 2V, 4-grid) with persistent storage per user.

### 1.3 Fundamental Analysis & Financial Statements
- Deliver a 6-pillar fundamental health scorecard: Valuation, Growth, Profitability, Financial Health, Red Flags, and Ownership.
- Present standardized financial statements: Income Statement, Balance Sheet, and Cash Flow Statement (annual and quarterly).
- Display peer valuation comparison matrix with P/E, P/B, EV/EBITDA, and Dividend Yield.

### 1.4 Derivatives & Market Intelligence
- Real-time strike-level options chain with Call and Put Open Interest (OI), Volume, IV, and Black-Scholes Greeks (Delta, Gamma, Theta, Vega).
- Calculate Put-Call Ratio (PCR) and Max Pain strike.
- Futures build-up classification across 4 quadrants: Long Build-up, Short Build-up, Short Covering, Long Unwinding.
- Market-wide advance/decline breadth and Mansfield Relative Strength analysis against benchmark (NIFTY 50).

### 1.5 Strategy Backtesting & Virtual Paper Trading
- Causal, zero-lookahead backtesting simulation with realistic slippage (0.05%) and exchange turnover fees (0.03%).
- Calculate CAGR, Annualized Volatility, Sharpe Ratio, Sortino Ratio, and Maximum Drawdown.
- Virtual paper trading account initialized with ₹10,00,000 cash balance, supporting Market and Limit order simulation with mark-to-market portfolio revaluation.

### 1.6 Verified Financial News Intelligence
- News ingestion from verified primary and official secondary financial publishers.
- Zero synthetic news generation or fabricated quotes.
- Machine-learning market impact scoring with primary source citations.

---

## 2. Non-Functional Requirements
- **Performance**: P95 backend response time under 200ms; sub-second initial client page paint.
- **Reliability**: 99.9% uptime target with automated health probes and graceful degradation during external provider outages.
- **Security**: Strict non-custodial boundaries; Clerk JWT authentication with role-based access control; TLS 1.3 encryption in transit; encrypted secrets at rest.
- **Compliance & Transparency**: Explicit data provenance tagging on every quote (`LIVE`, `DELAYED_15M`, `CALIBRATED_EOD`); SEBI/SEC educational disclaimers.
