# MarketScope.io — Backend Architecture

## 1. Overview
The backend is built with **FastAPI** (Python 3.12+), designed as a high-throughput, low-latency asynchronous API service.

## 2. Package Architecture
```
apps/api/app/
├── api/                  # API Route Controllers
│   ├── routes.py         # Instruments, quotes, fundamentals, news, search
│   ├── chart_routes.py   # Historical bars, indicators, layout persistence
│   ├── derivatives_routes.py # Options chain, Black-Scholes Greeks, futures
│   ├── backtest_routes.py # Backtesting simulator & paper trading
│   └── websocket_routes.py # Real-time quote streaming
├── core/                 # Core System Configuration & Plumbing
│   ├── config.py         # Pydantic Settings with env validation
│   ├── database.py       # SQLAlchemy 2.0 Engine & Sessionmaker
│   └── seed.py           # Initial instrument & data seeding
├── engine/               # Pure Domain Analytical Engines
│   ├── canonical_chart.py # OHLCV aggregation & layout management
│   ├── technical_indicators.py # 14 indicator mathematical formulas
│   ├── screener_engine.py # Multi-metric instrument filtering
│   ├── derivatives_engine.py # Black-Scholes Greeks & Options ladder
│   ├── market_flow_engine.py # Advance/decline & Mansfield RS
│   ├── backtest_engine.py # Causal backtesting simulator
│   ├── paper_trading_engine.py # Virtual account order fill ledger
│   └── news_engine.py    # News ingestion & provenance verification
└── models/               # SQLAlchemy ORM Models
    └── schema.py         # Instruments, quotes, watchlists, users, layouts
```

## 3. Concurrency & Performance
- **Uvicorn ASGI**: Multi-worker asynchronous process model.
- **Connection Pooling**: SQLAlchemy pool pre-ping enabled with 300-second recycling and 5-second connection timeout, specifically optimized for serverless PostgreSQL providers like Neon.
- **Vectorized Math**: NumPy-based calculation for technical indicators, Black-Scholes formulas, and backtest portfolio equity curves.
