# MarketScope.io — Master Environment Variable Register

This register details all 48+ audited environment variables across the 18 architectural categories of MarketScope.io.

---

## Category 1: Application Core & Runtime Metadata
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `APP_ENV` | Backend | string | `development` | No | Application environment (`development`, `production`, `test`). |
| `APP_NAME` | Backend | string | `MarketScope.io API` | No | Human-readable system name. |
| `APP_VERSION` | Backend | string | `1.0.0` | No | Semantic version tag. |
| `APP_DEBUG` | Backend | boolean | `true` | No | Enable verbose debug logging and traceback exposure. Must be `false` in production. |
| `PORT` | Backend | integer | `8000` | No | HTTP listener port (`8000` locally, `10000` on Render). |
| `HOST` | Backend | string | `0.0.0.0` | No | Network interface binding. |
| `SECRET_KEY` | Backend | string | `change_me_in_production` | **Yes** | Cryptographic key used for session hashing and token signing (min 32 chars). |
| `SNAPSHOT_SIGNING_SALT` | Backend | string | `salt_development` | **Yes** | Cryptographic salt for research snapshot checksums. |

---

## Category 2: Networking, Routing & CORS
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `API_BASE_URL` | Cross | string | `http://localhost:8000` | No | Absolute URL of the backend API service. |
| `WEB_BASE_URL` | Cross | string | `http://localhost:3000` | No | Absolute URL of the frontend web application. |
| `CORS_ORIGINS` | Backend | csv | `http://localhost:3000` | No | Comma-delimited list of permitted origins. Regex permits `*.vercel.app` & `*.onrender.com`. |
| `ALLOWED_HOSTS` | Backend | csv | `*` | No | Permitted HTTP Host headers. |

---

## Category 3: Database (PostgreSQL 16+ / Neon Serverless)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Backend | uri | None | **Yes** | Direct connection string for PostgreSQL / Neon (`postgresql+psycopg://...`). Direct SSL mode required. |
| `DATABASE_POOL_URL` | Backend | uri | None | **Yes** | Connection-pooled URL for high-concurrency serverless connections (e.g. PgBouncer / Neon pooler). |
| `DB_POOL_MIN_SIZE` | Backend | integer | `2` | No | Minimum connection pool size. |
| `DB_POOL_MAX_SIZE` | Backend | integer | `10` | No | Maximum connection pool size. |
| `DB_TIMEOUT_SECONDS` | Backend | integer | `15` | No | Timeout for queries before aborting. |

---

## Category 4: Cache & PubSub (Redis / Upstash)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `REDIS_URL` | Backend | uri | `redis://localhost:6379/0` | **Yes** | Redis / Upstash connection URI. In-memory fallback is active if unavailable. |
| `REDIS_TTL_QUOTES` | Backend | integer | `10` | No | Seconds to cache real-time stock quotes. |
| `REDIS_TTL_DISCOVERY` | Backend | integer | `300` | No | Seconds to cache stock search and discovery results. |
| `REDIS_TTL_RAG` | Backend | integer | `3600` | No | Seconds to cache LLM synthesis responses. |

---

## Category 5: Authentication & Identity (Clerk)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Both | string | None | No | Clerk public frontend key (`pk_test_...` or `pk_live_...`). |
| `CLERK_SECRET_KEY` | Both | string | None | **Yes** | Clerk private backend key (`sk_test_...` or `sk_live_...`). Never leak to browser. |
| `CLERK_WEBHOOK_SECRET` | Backend | string | None | **Yes** | HMAC signing secret for Clerk webhooks (`whsec_...`). |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Frontend | path | `/sign-in` | No | Client redirect route for authentication. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Frontend | path | `/sign-up` | No | Client redirect route for registration. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Frontend | path | `/workspace` | No | Post-login destination route. |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Frontend | path | `/workspace` | No | Post-registration destination route. |

---

## Category 6: Primary Financial Market Data (Twelve Data)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TWELVEDATA_API_KEY` | Backend | string | None | **Yes** | API key for Twelve Data real-time market data streaming and historical quotes. |
| `TWELVEDATA_BASE_URL` | Backend | url | `https://api.twelvedata.com` | No | Twelve Data REST endpoint base. |
| `TWELVEDATA_RATE_LIMIT` | Backend | integer | `8` | No | Max requests per minute allowed on tier. |

---

## Category 7: Secondary Financial Data (Financial Modeling Prep - FMP)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FMP_API_KEY` | Backend | string | None | **Yes** | Financial Modeling Prep API key for fundamentals, ratios, balance sheets. |
| `FMP_BASE_URL` | Backend | url | `https://financialmodelingprep.com/api/v3` | No | FMP API v3 base URL. |

---

## Category 8: Alternative / Institutional Data Providers (Licence Pending)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ALPHA_VANTAGE_API_KEY` | Backend | string | None | **Yes** | Optional institutional provider for technical indicators. |
| `FINNHUB_API_KEY` | Backend | string | None | **Yes** | Optional commercial provider for insider transactions and tick data. |
| `POLYGON_API_KEY` | Backend | string | None | **Yes** | Optional institutional provider for US market feeds. |
| `SEC_EDGAR_USER_AGENT` | Backend | string | `MarketScope.io admin@marketscope.io` | No | Declared User-Agent header required by SEC EDGAR fair-access policy. |

---

## Category 9: AI Synthesis — Groq Cloud (LLaMA-3.3 70B)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | Backend | string | None | **Yes** | Groq Cloud API key for ultra-fast LLaMA-3.3-70B-Versatile model synthesis. |
| `GROQ_MODEL` | Backend | string | `llama-3.3-70b-versatile` | No | Targeted high-performance model identifier. |
| `AI_ENABLED` | Both | boolean | `true` | No | Master feature toggle for AI assistant and Q-Intelligence synthesis. |

---

## Category 10: AI Synthesis — Google Gemini (Flash / Pro)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Backend | string | None | **Yes** | Google Gemini API key for multimodal reasoning and comprehensive analysis. |
| `GEMINI_MODEL` | Backend | string | `gemini-1.5-flash` | No | Gemini target model identifier. |

---

## Category 11: AI Synthesis — OpenRouter AI Gateway
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `OPENROUTER_API_KEY` | Backend | string | None | **Yes** | Multi-model redundant API gateway key. |
| `OPENROUTER_MODEL` | Backend | string | `meta-llama/llama-3.3-70b-instruct` | No | OpenRouter routed model identifier. |

---

## Category 12: Worldwide News & Sentiment Intelligence
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEWS_API_KEY` | Backend | string | None | **Yes** | Optional commercial news aggregator key (NewsAPI / GNews). |
| `FINANCIAL_NEWS_CACHE_MINUTES` | Backend | integer | `15` | No | Invalidation window for cached financial headlines. |
| `NEWS_SENTIMENT_THRESHOLD` | Backend | float | `0.15` | No | Minimum polarity score to trigger bullish/bearish classification. |

---

## Category 13: Global Macroeconomic & Economic Calendar
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FRED_API_KEY` | Backend | string | None | **Yes** | Federal Reserve Economic Data API key for US macro rates. |
| `TRADING_ECONOMICS_KEY` | Backend | string | None | **Yes** | Commercial calendar data provider key. |
| `CALENDAR_LOOKAHEAD_DAYS` | Backend | integer | `30` | No | Days forward to project earnings, splits, and central bank meetings. |

---

## Category 14: Multi-Factor Quantitative Engine (Q-Intelligence)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Q_INTEL_SAMPLE_WINDOW_DAYS` | Backend | integer | `756` | No | Historical trading days for rolling covariance and factor regressors (3 years). |
| `Q_INTEL_RISK_FREE_RATE` | Backend | float | `0.0425` | No | Benchmark risk-free interest rate (4.25% 10Y US Treasury). |
| `Q_INTEL_CONFIDENCE_THRESHOLD` | Backend | float | `0.65` | No | Minimum statistical confidence score to issue algorithmic signals. |
| `Q_INTEL_MONTE_CARLO_SIMS` | Backend | integer | `1000` | No | Number of geometric Brownian motion stochastic paths to project. |

---

## Category 15: Frontend Client Exposure (`NEXT_PUBLIC_*`)
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_NAME` | Frontend | string | `MarketScope.io` | No | Client application banner title. |
| `NEXT_PUBLIC_APP_TAGLINE` | Frontend | string | `Financial Research & Intelligence` | No | Marketing tagline. |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend | url | `http://localhost:8000` | No | Render API production URL or localhost. |
| `NEXT_PUBLIC_WS_HOST` | Frontend | host | `localhost:8000` | No | Host header for WebSocket market streaming. |
| `NEXT_PUBLIC_AI_ENABLED` | Frontend | boolean | `true` | No | Client flag enabling AI assistant floating bubble and analyst tabs. |

---

## Category 16: Observability, Logging & Error Tracking
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SENTRY_DSN` | Backend | uri | None | **Yes** | Sentry error monitoring DSN for backend exceptions. |
| `NEXT_PUBLIC_SENTRY_DSN` | Frontend | uri | None | No | Sentry browser-side error reporting DSN. |
| `LOG_LEVEL` | Backend | string | `INFO` | No | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`). |
| `ENABLE_STRUCTURED_JSON_LOGS` | Backend | boolean | `false` | No | Output RFC-compliant structured JSON for cloud log ingestion. |

---

## Category 17: Security, Rate Limiting & Auditing
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RATE_LIMIT_PER_MINUTE` | Backend | integer | `120` | No | Standard endpoint rate limit per IP. |
| `RATE_LIMIT_AI_PER_MINUTE` | Backend | integer | `30` | No | Constrained rate limit for intensive LLM synthesis endpoints. |
| `ENABLE_SECURITY_HEADERS` | Backend | boolean | `true` | No | Enforces HSTS, X-Content-Type-Options, CSP, and X-Frame-Options. |
| `ADMIN_KEY` | Backend | string | None | **Yes** | Bearer secret for administrative diagnostic and maintenance endpoints. |

---

## Category 18: Deployment Target Specific Configuration
| Variable | Scope | Type | Default | Secret? | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RENDER_SERVICE_ID` | Backend | string | None | No | Render deployment tracking ID. |
| `VERCEL_ENV` | Frontend | string | `production` | No | Injected by Vercel (`production`, `preview`, `development`). |
