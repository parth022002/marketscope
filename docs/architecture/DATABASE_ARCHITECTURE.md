# MarketScope.io — Database Architecture

## 1. Overview
MarketScope.io uses **PostgreSQL 16** (hosted on **Neon Serverless**) managed via **SQLAlchemy 2.0** and **Alembic** migrations.

## 2. Relational Schema Design
```mermaid
erDiagram
    INSTRUMENTS ||--o{ QUOTES : has
    INSTRUMENTS ||--o{ FUNDAMENTALS : has
    INSTRUMENTS ||--o{ NEWS_ARTICLES : mentions
    USERS ||--o{ WATCHLISTS : owns
    USERS ||--o{ CHART_LAYOUTS : saves
    USERS ||--o{ PAPER_ACCOUNTS : owns
    PAPER_ACCOUNTS ||--o{ PAPER_POSITIONS : holds
    PAPER_ACCOUNTS ||--o{ PAPER_ORDERS : executes

    INSTRUMENTS {
        string symbol PK
        string exchange_id
        string company_name
        string isin
        string sector
        string industry
        string country
    }
    QUOTES {
        string symbol FK
        datetime timestamp PK
        float open
        float high
        float low
        float close
        bigint volume
        string provenance
    }
    USERS {
        string user_id PK
        string email
        string clerk_id
        datetime created_at
    }
    CHART_LAYOUTS {
        string id PK
        string user_id FK
        string name
        string layout_mode
        json slots_data
        datetime updated_at
    }
```

## 3. Indexing & Optimization Strategy
- **Composite Index**: `(symbol, timestamp DESC)` on `QUOTES` table to provide O(log N) bar retrieval for charting.
- **Trigram Search Index**: `GIN` trigram indexes on `INSTRUMENTS.company_name` and `INSTRUMENTS.symbol` for instant sub-10ms universal search queries.
- **Connection Pool Tuning**: `pool_pre_ping=True`, `pool_recycle=300`, `pool_size=5`, `max_overflow=10`, and `connect_timeout=5` prevent dropped connections when Neon PostgreSQL resumes from idle sleep.
