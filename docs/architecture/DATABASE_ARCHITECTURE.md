# Database Architecture Specification
**Platform:** MarketScope.io  
**Database Engine:** PostgreSQL 16 (Neon Serverless Compatible)  

## 1. Relational Entity-Relationship Diagram

```mermaid
erDiagram
    WORKSPACES ||--o{ WORKSPACE_MEMBERSHIPS : contains
    USERS ||--o{ WORKSPACE_MEMBERSHIPS : holds
    ISSUERS ||--o{ INSTRUMENTS : lists
    INSTRUMENTS ||--o{ FINANCIAL_FACTS : records
    DATA_PROVIDERS ||--o{ PROVIDER_ENTITLEMENTS : grants
    DATA_PROVIDERS ||--o{ FINANCIAL_FACTS : supplies
    METRIC_DEFINITIONS ||--o{ METRIC_OBSERVATIONS : calculates
    INSTRUMENTS ||--o{ METRIC_OBSERVATIONS : measures
    WORKSPACES ||--o{ RESEARCH_NOTES : owns
    WORKSPACES ||--o{ RESEARCH_SNAPSHOTS : preserves
    WORKSPACES ||--o{ WATCHLISTS : maintains
    WATCHLISTS ||--o{ WATCHLIST_ITEMS : contains
    WORKSPACES ||--o{ SAVED_SCREENS : saves

    WORKSPACES {
        uuid id PK
        text name
        timestamptz created_at
    }
    USERS {
        uuid id PK
        text external_identity_id
        text email
        text display_name
    }
    INSTRUMENTS {
        uuid id PK
        uuid issuer_id FK
        text symbol
        text exchange_code
        text isin
        text currency
    }
    FINANCIAL_FACTS {
        uuid id PK
        uuid instrument_id FK
        text fact_key
        numeric value_numeric
        text unit
        timestamptz period_end
    }
    RESEARCH_SNAPSHOTS {
        uuid id PK
        uuid workspace_id FK
        jsonb payload
        text checksum
        timestamptz data_as_of
    }
```

## 2. Pooling & Resilience Configuration
- Managed via `app.core.database.py` with SQLAlchemy 2.0 and modern Psycopg 3.
- `pool_size=5`, `max_overflow=10`, `pool_recycle=300`, `pool_pre_ping=True` preventing stale pooled connections on serverless Neon.
- Serverless SSL enforcement (`sslmode=require` for neon.tech).
