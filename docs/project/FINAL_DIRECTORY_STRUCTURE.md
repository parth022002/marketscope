# MarketScope.io — Final Directory Structure

```
MarketScope.io Code/
├── .github/                      # CI/CD Workflows
│   └── workflows/
│       └── ci.yml                # Automated test and build verification
├── apps/
│   ├── api/                      # FastAPI Modular Monolith (Backend)
│   │   ├── app/
│   │   │   ├── api/              # Route Controllers (REST & WebSocket)
│   │   │   │   ├── routes.py     # Core market data, search, fundamentals
│   │   │   │   ├── chart_routes.py # Bars, indicators, layout persistence
│   │   │   │   ├── derivatives_routes.py # Options chain, Greeks, futures
│   │   │   │   ├── backtest_routes.py # Strategy backtesting & paper trading
│   │   │   │   └── websocket_routes.py # Real-time quote streaming
│   │   │   ├── core/             # Configuration, DB connection pooling, seeds
│   │   │   ├── engine/           # Pure analytical calculation engines
│   │   │   │   ├── canonical_chart.py # Chart bars & layout manager
│   │   │   │   ├── technical_indicators.py # 14 technical indicator formulas
│   │   │   │   ├── screener_engine.py # Multi-metric instrument screener
│   │   │   │   ├── derivatives_engine.py # Black-Scholes Greeks & Options ladder
│   │   │   │   ├── market_flow_engine.py # Market breadth & Mansfield RS
│   │   │   │   ├── backtest_engine.py # Causal backtesting simulator
│   │   │   │   ├── paper_trading_engine.py # Virtual account order fill ledger
│   │   │   │   └── news_engine.py # News ingestion & provenance verification
│   │   │   ├── models/           # SQLAlchemy ORM models
│   │   │   └── main.py           # FastAPI application entrypoint & /health
│   │   ├── tests/                # Pytest automated test suite (21 tests)
│   │   ├── Dockerfile            # Multi-stage production container
│   │   ├── Procfile              # Render / Heroku process declaration
│   │   ├── requirements.txt      # Python dependencies
│   │   └── start.sh              # Unix container start script
│   └── web/                      # Next.js 15 Web Application (Frontend)
│       ├── src/
│       │   ├── app/              # Next.js App Router (28 pages)
│       │   │   ├── charts/       # Full-screen multi-chart terminal
│       │   │   ├── stock/[symbol]/ # Dedicated stock research & chart hub
│       │   │   ├── screener/     # Universal stock screener & CSV export
│       │   │   ├── derivatives/  # Options chain & futures build-up
│       │   │   ├── market-intelligence/ # Breadth & Mansfield RS
│       │   │   ├── backtesting/  # Strategy backtesting engine
│       │   │   ├── paper-trading/ # Virtual account simulator
│       │   │   ├── news/         # Verified financial news
│       │   │   ├── watchlist/    # User watchlists
│       │   │   └── privacy-security-trust/ # Regulatory disclosures
│       │   ├── components/       # UI components (StockChart, DrawingToolbar)
│       │   └── lib/              # API client, types, utilities
│       ├── package.json          # Node.js dependencies
│       └── Dockerfile            # Production web container
├── config/                       # Central application configuration
├── database/                     # PostgreSQL schema definitions & migrations
├── docs/                         # Consolidated Documentation Hierarchy
│   ├── README.md                 # Documentation Index & Navigation Map
│   ├── project/                  # Project management & completion reports
│   ├── requirements/             # Functional & security requirements
│   ├── architecture/             # System, frontend, backend, database ADRs
│   ├── modules/                  # Detailed module specifications (12 modules)
│   ├── data/                     # Data providers, rights, freshness standards
│   ├── security/                 # Security policy, privacy, threat model
│   ├── testing/                  # Test strategy, test cases, execution reports
│   └── operations/               # Setup, environment config, deployment guide
├── scripts/                      # Utility and verification scripts
├── .env.example                  # Safe configuration template
├── .gitignore                    # Standard git ignore patterns
├── docker-compose.yml            # Local multi-service orchestration
├── Procfile                      # Root Render process declaration
├── README.md                     # Root project documentation
├── render.yaml                   # Automated Render Blueprint definition
├── requirements.txt              # Root Python dependency pointer
└── start.sh                      # Root startup script
```
