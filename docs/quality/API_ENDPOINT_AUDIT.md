# MarketScope.io — API Endpoint Audit

## 1. Overview
This register catalogs all implemented API routes in the MarketScope.io FastAPI backend (`apps/api`), documenting HTTP methods, paths, request/response models, and authentication requirements.

---

## 2. API Endpoint Directory

### Core System & Health Endpoints
| HTTP Method | Route | Description | Auth Required | Response Model |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/health` | Process liveness & version | No | `{"status":"ok", ...}` |
| `GET` | `/health/live` | Process liveness check | No | `{"status":"alive", ...}` |
| `GET` | `/health/ready` | Database readiness & latency probe | No | `{"status":"ready", "database":{...}}` |

### Market Data, Instruments & Discovery
| HTTP Method | Route | Description | Auth Required | Response Model |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/search` | Universal instrument search (symbol, name, ISIN) | No | `list[InstrumentSearchItem]` |
| `GET` | `/api/v1/instruments` | Catalog of exchange-listed instruments | No | `list[GlobalInstrument]` |
| `GET` | `/api/v1/instruments/{id}` | Detailed instrument metadata | No | `InstrumentDetail` |
| `GET` | `/api/v1/exchanges` | Supported stock exchanges registry | No | `list[ExchangeInfo]` |
| `GET` | `/api/v1/market-overview` | Index quotes, gainers, losers | No | `MarketOverviewResponse` |
| `GET` | `/api/v1/market-ticker` | Real-time quote ticker strip | No | `list[MarketQuote]` |

### Fundamental Research & Statements
| HTTP Method | Route | Description | Auth Required | Response Model |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/company/{id}/dossier` | Complete 6-pillar fundamental dossier | No | `CompanyDossier` |
| `GET` | `/api/v1/company/{id}/financial-statements`| 5-year Income, Balance Sheet, Cash Flow | No | `FinancialStatementsResponse` |
| `GET` | `/api/v1/company/{id}/ratios` | Historical valuation and profitability ratios | No | `CompanyRatiosResponse` |
| `GET` | `/api/v1/company/{id}/peer-comparison` | Peer valuation and growth matrix | No | `PeerComparisonResponse` |

### Universal Screener
| HTTP Method | Route | Description | Auth Required | Response Model |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/screener/presets` | Prebuilt thematic screens | No | `list[ScreenerPreset]` |
| `POST` | `/api/v1/screener/run` | Execute screener filtering query | No | `ScreenerResponse` |
| `POST` | `/api/v1/screener/query` | Custom matrix criteria screener | No | `ScreenerResponse` |

### Interactive Charting & Multi-Chart Layouts
| HTTP Method | Route | Description | Auth Required | Response Model |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/chart/bars` | OHLCV historical bars (1m, 5m, 1D, etc.) | No | `ChartBarsResponse` |
| `GET` | `/api/v1/chart/package` | Combined bars + computed indicators | No | `ChartPackageResponse` |
| `GET` | `/api/v1/chart/indicators`| Indicator series calculation | No | `IndicatorSeriesResponse` |
| `GET` | `/api/v1/chart/layouts` | Get saved user multi-chart layouts | Yes | `list[ChartLayout]` |
| `POST` | `/api/v1/chart/layouts` | Save or update multi-chart layout | Yes | `ChartLayout` |
| `DELETE`| `/api/v1/chart/layouts/{id}`| Delete multi-chart layout | Yes | `{"status":"deleted"}` |

### Derivatives & Market Intelligence
| HTTP Method | Route | Description | Auth Required | Response Model |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/derivatives/options-chain` | Strike ladder, OI, Greeks (Delta, Gamma, etc.)| No | `OptionsChainResponse` |
| `GET` | `/api/v1/derivatives/futures-buildup` | 4-Quadrant futures build-up radar | No | `FuturesBuildupResponse` |
| `GET` | `/api/v1/market-flow/pulse` | Breadth ratio & Mansfield Relative Strength | No | `MarketFlowPulseResponse` |

### Quantitative Backtesting & Paper Trading
| HTTP Method | Route | Description | Auth Required | Response Model |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/backtest/run` | Strategy backtest simulator (cagr, mdd, sharpe)| No | `BacktestResponse` |
| `GET` | `/api/v1/paper-trading/account` | Virtual paper trading account balance & MTM | Yes | `PaperAccountResponse` |
| `POST` | `/api/v1/paper-trading/orders` | Execute simulated Market/Limit order | Yes | `PaperOrderResponse` |
| `POST` | `/api/v1/paper-trading/reset` | Reset virtual account balance to ₹10,00,000 | Yes | `PaperAccountResponse` |

### Real-Time Streaming
| Protocol | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `WebSocket` | `/ws/quotes` | Sub-second real-time market quote streaming | No |
