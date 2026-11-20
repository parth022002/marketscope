-- Initial PostgreSQL schema for MarketScope.io.
-- This is a foundation schema. Apply future changes through versioned migrations.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_identity_id TEXT UNIQUE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_memberships (
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('OWNER','EDITOR','VIEWER','ADMIN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS issuers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT NOT NULL,
  country_code CHAR(2) NOT NULL DEFAULT 'IN',
  sector TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS instruments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer_id UUID NOT NULL REFERENCES issuers(id),
  symbol TEXT NOT NULL,
  exchange_code TEXT NOT NULL,
  instrument_type TEXT NOT NULL DEFAULT 'EQUITY',
  isin TEXT,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  listing_status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(exchange_code, symbol)
);

CREATE TABLE IF NOT EXISTS data_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'DEMO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES data_providers(id),
  market_code TEXT NOT NULL,
  field_scope JSONB NOT NULL DEFAULT '{}'::jsonb,
  permitted_purposes JSONB NOT NULL DEFAULT '[]'::jsonb,
  storage_allowed BOOLEAN NOT NULL DEFAULT false,
  redistribution_allowed BOOLEAN NOT NULL DEFAULT false,
  effective_from TIMESTAMPTZ,
  effective_until TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS financial_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID NOT NULL REFERENCES instruments(id),
  provider_id UUID REFERENCES data_providers(id),
  fact_key TEXT NOT NULL,
  value_numeric NUMERIC(28,8),
  value_text TEXT,
  unit TEXT NOT NULL,
  currency CHAR(3),
  period_start DATE,
  period_end DATE,
  period_type TEXT,
  reporting_basis TEXT,
  published_at TIMESTAMPTZ,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  quality_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  is_synthetic BOOLEAN NOT NULL DEFAULT false,
  source_locator TEXT,
  source_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financial_facts_instrument_period
  ON financial_facts(instrument_id, fact_key, period_end DESC);

CREATE TABLE IF NOT EXISTS metric_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT NOT NULL,
  label TEXT NOT NULL,
  formula_text TEXT NOT NULL,
  formula_version TEXT NOT NULL,
  unit TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(metric_key, formula_version)
);

CREATE TABLE IF NOT EXISTS metric_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id UUID NOT NULL REFERENCES instruments(id),
  metric_definition_id UUID NOT NULL REFERENCES metric_definitions(id),
  value_numeric NUMERIC(28,8),
  period_end DATE,
  calculation_inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  quality_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evidence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES data_providers(id),
  instrument_id UUID REFERENCES instruments(id),
  title TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_locator TEXT,
  published_at TIMESTAMPTZ,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  quality_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS research_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES instruments(id),
  author_user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  thesis TEXT,
  counterpoints TEXT,
  open_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  instrument_id UUID NOT NULL REFERENCES instruments(id),
  created_by UUID REFERENCES users(id),
  snapshot_label TEXT,
  data_as_of TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  checksum TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
