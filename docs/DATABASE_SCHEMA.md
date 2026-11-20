# MarketScope.io — Database Schema Documentation

**Document Version:** 1.0  
**Date:** 19 November 2026  
**Database Engine:** PostgreSQL 16+ (Local & Neon Serverless)  
**Migration Baseline:** `database/schema/001_initial.sql`

---

## 1. Schema Architecture & Entity Relationship Overview

MarketScope.io's database is structured into four primary functional clusters:
1. **Multi-Tenant Identity & Access:** `workspaces`, `users`, `workspace_memberships`
2. **Instrument & Issuer Registry:** `issuers`, `instruments`
3. **Data Providers & Entitlements:** `data_providers`, `provider_entitlements`
4. **Financial Core & Evidence:** `financial_facts`, `metric_definitions`, `metric_observations`, `evidence_items`
5. **Research Workspace:** `research_notes`, `research_snapshots`, `audit_events`

```
  [workspaces] ─────────────┬─────────────► [workspace_memberships] ◄────────────── [users]
        │                   │
        │                   ├─────────────► [research_notes]
        │                   │
        │                   ├─────────────► [research_snapshots]
        │                   │
        │                   └─────────────► [audit_events]
        ▼
  [issuers] ───────────────► [instruments]
                                    │
                                    ├─────────────► [financial_facts] ◄──── [data_providers]
                                    │                      │
                                    ├─────────────► [evidence_items]
                                    │                      │
                                    └─────────────► [metric_observations] ◄── [metric_definitions]
```

---

## 2. Table Specifications

### 2.1 Identity & Workspaces

#### `workspaces`
Represents an isolated tenant workspace. All user research assets belong to a workspace.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique workspace identifier |
| `name` | `TEXT` | `NOT NULL` | Display name of the workspace |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Creation timestamp |

#### `users`
Global user profile originating from the managed identity provider (Clerk/OIDC).
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Internal user identifier |
| `external_identity_id` | `TEXT` | `UNIQUE` | Clerk / OIDC Subject identifier (`sub`) |
| `email` | `TEXT` | `NULLABLE` | Verified email address |
| `display_name` | `TEXT` | `NULLABLE` | User full name or handle |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | User record creation timestamp |

#### `workspace_memberships`
Role-Based Access Control (RBAC) linking users to workspaces.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `workspace_id` | `UUID` | `REFERENCES workspaces(id) ON DELETE CASCADE` | Parent workspace |
| `user_id` | `UUID` | `REFERENCES users(id) ON DELETE CASCADE` | Member user |
| `role` | `TEXT` | `NOT NULL CHECK (role IN ('owner','admin','member','viewer'))` | RBAC role |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Membership creation date |
| *Composite PK* | `(workspace_id, user_id)` | `PRIMARY KEY` | Unique membership per workspace |

---

### 2.2 Issuers & Instruments

#### `issuers`
Corporate legal entity issuing equity or debt securities.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Internal issuer ID |
| `legal_name` | `TEXT` | `NOT NULL` | Registered legal corporate name |
| `country` | `TEXT` | `NOT NULL DEFAULT 'IN'` | Country of incorporation (ISO 3166-1) |
| `cin` | `TEXT` | `UNIQUE` | Corporate Identification Number (MCA India) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Record creation timestamp |

#### `instruments`
Tradable financial instrument or listed equity class.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Internal canonical instrument ID |
| `issuer_id` | `UUID` | `REFERENCES issuers(id) ON DELETE RESTRICT` | Associated corporate issuer |
| `symbol` | `TEXT` | `NOT NULL` | Exchange ticker symbol (e.g. `RELIANCE`, `TCS`) |
| `exchange` | `TEXT` | `NOT NULL` | Exchange code (`NSE`, `BSE`) |
| `isin` | `TEXT` | `NULLABLE` | International Securities Identification Number |
| `security_type` | `TEXT` | `NOT NULL DEFAULT 'COMMON_EQUITY'` | Asset type classification |
| `sector` | `TEXT` | `NULLABLE` | Industry / sector classification |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Record creation timestamp |
| *Composite Unique* | `(symbol, exchange)` | `UNIQUE` | Prevents ticker collision on same exchange |

---

### 2.3 Data Providers & Rights

#### `data_providers`
Registered data source or commercial vendor.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Unique provider key (`mock`, `nse_official`, etc.) |
| `name` | `TEXT` | `NOT NULL` | Provider display name |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Provider registration timestamp |

#### `provider_entitlements`
Machine-enforced rights matrix per data provider and dataset.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique entitlement record ID |
| `provider_id` | `TEXT` | `REFERENCES data_providers(id) ON DELETE CASCADE` | Target data provider |
| `data_domain` | `TEXT` | `NOT NULL` | Domain (`FINANCIAL_STATEMENTS`, `EOD_PRICES`) |
| `can_display` | `BOOLEAN` | `NOT NULL DEFAULT false` | Permission to render in web UI |
| `can_export` | `BOOLEAN` | `NOT NULL DEFAULT false` | Permission to include in CSV/PDF exports |
| `can_derive_metrics` | `BOOLEAN` | `NOT NULL DEFAULT false` | Permission to compute formulas over raw data |
| `can_ai_train` | `BOOLEAN` | `NOT NULL DEFAULT false` | Permission to use in LLM context/RAG |
| `valid_until` | `TIMESTAMPTZ` | `NULLABLE` | Commercial license expiration date |

---

### 2.4 Financial Facts, Metrics & Evidence

#### `financial_facts`
Normalized raw data points extracted from official company filings.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Canonical fact ID |
| `instrument_id` | `UUID` | `REFERENCES instruments(id) ON DELETE RESTRICT` | Associated instrument |
| `fact_key` | `TEXT` | `NOT NULL` | Canonical metric key (`revenue`, `net_income`) |
| `fact_value` | `NUMERIC` | `NOT NULL` | Exact reported numeric value |
| `currency` | `TEXT` | `NOT NULL DEFAULT 'INR'` | Currency code (ISO 4217) |
| `period_type` | `TEXT` | `NOT NULL CHECK (period_type IN ('ANNUAL','QUARTER'))` | Statement period type |
| `fiscal_period` | `TEXT` | `NOT NULL` | Period identifier (e.g. `FY2025`, `Q3FY2025`) |
| `reporting_basis` | `TEXT` | `NOT NULL CHECK (reporting_basis IN ('CONSOLIDATED','STANDALONE'))` | Accounting reporting basis |
| `data_status` | `TEXT` | `NOT NULL DEFAULT 'SYNTHETIC_DEMO'` | Status (`VERIFIED`, `ESTIMATED`, `STALE`, etc.) |
| `provider_id` | `TEXT` | `REFERENCES data_providers(id)` | Source data provider |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Ingestion timestamp |

#### `metric_definitions`
Governed catalog of deterministic mathematical formulas.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | `PRIMARY KEY` | Versioned metric key (`roe_v1`, `pe_ratio_v1`) |
| `name` | `TEXT` | `NOT NULL` | Human-readable metric title |
| `formula_description` | `TEXT` | `NOT NULL` | Plain-English calculation explanation |
| `unit` | `TEXT` | `NOT NULL` | Unit of output (`%`, `x`, `INR`, `ratio`) |
| `formula_expression` | `TEXT` | `NOT NULL` | Machine-evaluable expression |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Definition creation date |

#### `metric_observations`
Computed ratio results linking formulas to instruments and periods.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Calculated observation ID |
| `instrument_id` | `UUID` | `REFERENCES instruments(id) ON DELETE CASCADE` | Target instrument |
| `metric_id` | `TEXT` | `REFERENCES metric_definitions(id)` | Applied formula definition |
| `calculated_value` | `NUMERIC` | `NOT NULL` | Computed numeric output |
| `period` | `TEXT` | `NOT NULL` | Evaluated period |
| `formula_version` | `TEXT` | `NOT NULL` | Version tag of formula applied |
| `data_status` | `TEXT` | `NOT NULL DEFAULT 'SYNTHETIC_DEMO'` | Quality and verification state |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Calculation execution timestamp |

#### `evidence_items`
Source provenance linking facts and metrics to source filing documents.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique evidence record ID |
| `fact_id` | `UUID` | `REFERENCES financial_facts(id) ON DELETE CASCADE` | Associated financial fact |
| `source_name` | `TEXT` | `NOT NULL` | Name of source document (e.g. `Annual Report 2024-25`) |
| `source_type` | `TEXT` | `NOT NULL` | Document category (`ANNUAL_REPORT`, `BSE_FILING`) |
| `source_url` | `TEXT` | `NULLABLE` | Direct link to filing PDF or official archive |
| `published_at` | `TIMESTAMPTZ` | `NULLABLE` | Official publication date by issuer/exchange |
| `retrieved_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Timestamp when MarketScope ingested record |
| `quality_status` | `TEXT` | `NOT NULL DEFAULT 'VERIFIED'` | Source validation rating |

---

### 2.5 Research Workspace & Audit

#### `research_notes`
Workspace-scoped user research notes, theses, and counter-evidence.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique note ID |
| `workspace_id` | `UUID` | `REFERENCES workspaces(id) ON DELETE CASCADE` | Owning workspace |
| `author_user_id` | `UUID` | `REFERENCES users(id) ON DELETE SET NULL` | Note author |
| `instrument_id` | `UUID` | `REFERENCES instruments(id) ON DELETE CASCADE` | Tagged company/instrument |
| `title` | `TEXT` | `NOT NULL` | Note headline |
| `content` | `TEXT` | `NOT NULL` | Markdown formatted note body |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Last update timestamp |

#### `research_snapshots`
Cryptographically frozen, immutable dossiers.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique snapshot ID |
| `workspace_id` | `UUID` | `REFERENCES workspaces(id) ON DELETE CASCADE` | Owning workspace |
| `instrument_id` | `UUID` | `REFERENCES instruments(id) ON DELETE CASCADE` | Snapped company |
| `snapshot_name` | `TEXT` | `NOT NULL` | User label for snapshot |
| `payload` | `JSONB` | `NOT NULL` | Complete frozen state of dossier, facts, and metrics |
| `payload_hash` | `TEXT` | `NOT NULL` | SHA-256 cryptographic hash of canonical payload |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Freeze timestamp |

#### `audit_events`
Append-only audit trail for security and data compliance.
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Audit event ID |
| `workspace_id` | `UUID` | `NULLABLE REFERENCES workspaces(id) ON DELETE SET NULL` | Target workspace context |
| `actor_user_id` | `UUID` | `NULLABLE REFERENCES users(id) ON DELETE SET NULL` | Acting user |
| `event_type` | `TEXT` | `NOT NULL` | Action code (`USER_LOGIN`, `NOTE_DELETE`) |
| `resource_type` | `TEXT` | `NOT NULL` | Target resource (`NOTE`, `SNAPSHOT`, `WORKSPACE`) |
| `resource_id` | `TEXT` | `NULLABLE` | Identifier of affected entity |
| `payload` | `JSONB` | `DEFAULT '{}'` | Metadata and action details (PII redacted) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Immutably recorded event time |
