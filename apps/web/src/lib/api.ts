const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SERVER_API_BASE = process.env.API_INTERNAL_BASE_URL ?? API_BASE;
const getApiBase = () => (typeof window === "undefined" ? SERVER_API_BASE : API_BASE);

export const DEFAULT_WORKSPACE_ID = "11111111-1111-1111-1111-111111111111";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Instrument = {
  instrument_id: string;
  symbol: string;
  company_name: string;
  exchange: string;
  sector: string;
  currency: string;
  data_status: string;
  display_name?: string;
  company_id?: string;
  exchange_name?: string;
  country?: string;
  country_code?: string;
  security_type?: string;
  isin?: string | null;
  industry?: string;
  price?: number;
  change_pct?: number;
  market_cap?: number;
  market_cap_display?: string;
  score?: number;
  match_reason?: string;
  has_multiple_listings?: boolean;
};

export type Metric = {
  metric_id: string;
  label: string;
  value: number;
  unit: string;
  period: string;
  formula_version: string;
  data_status: string;
};

export type EvidenceItem = {
  evidence_id: string;
  source_name: string;
  source_type: string;
  published_at: string | null;
  retrieved_at: string;
  quality_status: string;
  note: string;
};

export type Dossier = {
  instrument: Instrument;
  summary: string;
  metrics: Metric[];
  evidence: EvidenceItem[];
  disclaimer: string;
};

export type InstrumentCandidate = {
  instrument_id: string;
  symbol: string;
  company_name: string;
  exchange_code: string;
  instrument_type: string;
  isin: string | null;
  currency: string;
  listing_status: string;
};

export type ResolveResponse = {
  query: string;
  resolved: boolean;
  requires_disambiguation: boolean;
  resolution_message: string;
  instrument: InstrumentCandidate | null;
  candidates: InstrumentCandidate[];
};

export type MetricComponentInput = {
  label: string;
  value: number;
  unit: string;
  reporting_period: string;
  source_filing: string;
};

export type MetricEvidenceDetail = {
  metric_id: string;
  label: string;
  value: number;
  unit: string;
  period: string;
  formula_expression: string;
  formula_version: string;
  quality_status: string;
  components: MetricComponentInput[];
  evidence: EvidenceItem[];
};

export type ResearchNote = {
  id: string;
  workspace_id: string;
  instrument_id: string;
  title: string;
  thesis: string | null;
  counterpoints: string | null;
  open_questions: string[];
  created_at: string;
  updated_at: string;
};

export type StatementLineItem = {
  line_item: string;
  fy22?: number | null;
  fy23?: number | null;
  fy24?: number | null;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  unit: string;
};

export type FinancialStatementsResponse = {
  symbol: string;
  company_name: string;
  statement_type: string;
  period_type: string;
  reporting_basis: string;
  periods: string[];
  items: StatementLineItem[];
  audit_status: string;
};

export type CompanyRatios = {
  symbol: string;
  company_name: string;
  sector: string;
  valuation: {
    pe_ratio: number | null;
    pb_ratio: number;
    ev_ebitda: number | null;
    market_cap: number;
    enterprise_value: number;
  };
  profitability: {
    roe: number;
    roce: number;
    operating_margin: number;
    net_margin: number;
  };
  solvency: {
    debt_to_equity: number;
    interest_coverage: number;
  };
  cash_flow: {
    fcf: number;
    fcf_yield: number;
    cfo_to_pat: number;
  };
};

export type PeerItem = {
  symbol: string;
  company_name: string;
  sector: string;
  market_cap: number;
  current_price: number;
  pe_ratio: number | null;
  pb_ratio: number;
  roe: number;
  roce: number;
  debt_to_equity: number;
  operating_margin: number;
  fcf: number;
};

export type PeerComparisonResponse = {
  target_symbol: string;
  sector: string;
  peers: PeerItem[];
  alignment_warnings: string[];
};

export type ScreenerCriteria = {
  sector?: string;
  exchange?: string;
  country?: string;
  market_cap_category?: string;
  min_market_cap?: number;
  min_roe?: number;
  max_pe?: number;
  min_pe?: number;
  max_pb?: number;
  min_pb?: number;
  max_debt_equity?: number;
  min_opm?: number;
  min_dividend_yield?: number;
  min_rsi?: number;
  max_rsi?: number;
  within_pct_52w_high?: number;
};

export type ScreenerResultItem = {
  symbol: string;
  company_name: string;
  sector: string;
  market_cap: number;
  pe_ratio: number | null;
  roe: number;
  debt_to_equity: number;
  operating_margin: number;
  exchange: string;
  price: number;
  change_pct: number;
  pb_ratio?: number | null;
  dividend_yield?: number | null;
  rsi_14?: number | null;
  week_52_high?: number;
  week_52_low?: number;
  market_cap_display?: string;
};

export type ScreenerResponse = {
  count: number;
  results: ScreenerResultItem[];
  applied_criteria: ScreenerCriteria;
};

export type ScreenerPreset = {
  id: string;
  name: string;
  description: string;
  criteria: ScreenerCriteria;
};

export type WatchlistItem = {
  id: string;
  watchlist_id: string;
  instrument_id: string;
  symbol: string;
  company_name: string;
  added_at: string;
};

export type Watchlist = {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  created_at: string;
  items: WatchlistItem[];
};

export type ResearchSnapshot = {
  id: string;
  workspace_id: string;
  instrument_id: string;
  snapshot_label: string;
  data_as_of: string;
  checksum: string;
  is_valid: boolean;
  created_at: string;
  payload: Record<string, unknown>;
};

// ─── API Functions ───────────────────────────────────────────────────────────

export async function searchInstruments(
  query: string,
  options?: {
    exchange?: string;
    country?: string;
    sector?: string;
    limit?: number;
  }
): Promise<Instrument[]> {
  const params = new URLSearchParams({ q: query });
  if (options?.exchange) params.set("exchange", options.exchange);
  if (options?.country) params.set("country", options.country);
  if (options?.sector) params.set("sector", options.sector);
  if (options?.limit) params.set("limit", String(options.limit));

  const response = await fetch(
    `${getApiBase()}/api/v1/instruments/search?${params.toString()}`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Unable to search instruments");
  const data = await response.json();
  return (data.items || []) as Instrument[];
}

export async function resolveInstrument(query: string, exchange?: string): Promise<ResolveResponse> {
  let url = `${getApiBase()}/api/v1/instruments/resolve?q=${encodeURIComponent(query)}`;
  if (exchange) url += `&exchange=${encodeURIComponent(exchange)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to resolve instrument");
  return response.json();
}

export async function getDossier(id: string): Promise<Dossier> {
  const response = await fetch(
    `${getApiBase()}/api/v1/instruments/${encodeURIComponent(id)}/dossier`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Unable to load company dossier");
  return response.json() as Promise<Dossier>;
}

export async function getMetricEvidence(instrumentId: string, metricId: string): Promise<MetricEvidenceDetail> {
  const response = await fetch(
    `${getApiBase()}/api/v1/instruments/${encodeURIComponent(instrumentId)}/metrics/${encodeURIComponent(metricId)}/evidence`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Unable to load metric evidence");
  return response.json();
}

export async function getFinancialStatements(
  symbol: string,
  statementType = "income_statement",
  periodType = "annual",
  reportingBasis = "CONSOLIDATED"
): Promise<FinancialStatementsResponse> {
  const url = `${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/statements?statement_type=${encodeURIComponent(statementType)}&period_type=${encodeURIComponent(periodType)}&reporting_basis=${encodeURIComponent(reportingBasis)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load financial statements");
  return response.json();
}

export async function getCompanyRatios(symbol: string): Promise<CompanyRatios> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/ratios`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to load financial ratios");
  return response.json();
}

export async function getPeerComparison(symbol: string): Promise<PeerComparisonResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/peers`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to load peer comparison");
  return response.json();
}

export async function runScreener(criteria: ScreenerCriteria): Promise<ScreenerResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/screener/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(criteria),
  });
  if (!response.ok) throw new Error("Failed to execute fundamental screen");
  return response.json();
}

export async function getScreenerPresets(): Promise<ScreenerPreset[]> {
  const response = await fetch(`${getApiBase()}/api/v1/screener/presets`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load screener presets");
  const data = await response.json();
  return data.presets;
}

export async function getWorkspaceNotes(workspaceId: string, instrumentId?: string): Promise<ResearchNote[]> {
  let url = `${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/notes`;
  if (instrumentId) url += `?instrument_id=${encodeURIComponent(instrumentId)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to fetch research notes");
  return response.json();
}

export async function createWorkspaceNote(
  workspaceId: string,
  note: { instrument_id: string; title: string; thesis?: string; counterpoints?: string; open_questions?: string[] }
): Promise<ResearchNote> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Unable to save research note");
  return response.json();
}

export async function deleteWorkspaceNote(workspaceId: string, noteId: string): Promise<void> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/notes/${encodeURIComponent(noteId)}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Unable to delete research note");
}

export async function getWatchlists(workspaceId: string): Promise<Watchlist[]> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/watchlists`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to fetch watchlists");
  return response.json();
}

export async function createWatchlist(workspaceId: string, payload: { name: string; description?: string }): Promise<Watchlist> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/watchlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to create watchlist");
  return response.json();
}

export async function addWatchlistItem(workspaceId: string, watchlistId: string, payload: { symbol: string; notes?: string }): Promise<WatchlistItem> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/watchlists/${encodeURIComponent(watchlistId)}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to add ticker to watchlist");
  return response.json();
}

export async function deleteWatchlistItem(workspaceId: string, watchlistId: string, itemId: string): Promise<void> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/watchlists/${encodeURIComponent(watchlistId)}/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Unable to delete watchlist item");
}

export async function createSnapshot(workspaceId: string, payload: { instrument_id: string; snapshot_label: string; thesis?: string }): Promise<ResearchSnapshot> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/snapshots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to create research snapshot");
  return response.json();
}

export async function getSnapshot(workspaceId: string, snapshotId: string): Promise<ResearchSnapshot> {
  const response = await fetch(`${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/snapshots/${encodeURIComponent(snapshotId)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve research snapshot");
  return response.json();
}

// ─── Phase 4: Data Quality & DPDP Privacy ────────────────────────────────────

export type DataFreshness = {
  symbol: string;
  exchange: string;
  currency: string;
  market_status: string;
  quote_freshness: string;
  filings_freshness: string;
  staleness_score: number;
  last_quote_time: string;
  last_audit_time: string;
  active_tier: string;
  entitlements: string[];
};

export type DPDPDataExportResponse = {
  workspace_id: string;
  exported_at: string;
  notes_count: number;
  snapshots_count: number;
  watchlists_count: number;
  data: Record<string, any>;
};

export type DPDPPurgeResponse = {
  status: string;
  message: string;
  workspace_id: string;
  purged_at: string;
  records_deleted: {
    notes: number;
    snapshots: number;
    watchlists: number;
    watchlist_items: number;
  };
};

export async function getDataFreshness(symbol: string): Promise<DataFreshness> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/freshness`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve data freshness");
  return response.json();
}

export async function exportUserData(workspaceId: string): Promise<DPDPDataExportResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/compliance/dpdp/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace_id: workspaceId }),
  });
  if (!response.ok) throw new Error("Unable to export user data");
  return response.json();
}

export async function purgeUserData(workspaceId: string, confirmationPhrase: string): Promise<DPDPPurgeResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/compliance/dpdp/purge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ workspace_id: workspaceId, confirmation_phrase: confirmationPhrase }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Unable to purge user data");
  }
  return response.json();
}

// ─── Phase 5: Gated AI Research Synthesis (MOD-17) ────────────────────────────

export type AISynthesisCitation = {
  citation_id: string;
  fact_or_ratio: string;
  period: string;
  value: string;
  source_formula_or_filing: string;
};

export type AISynthesis = {
  symbol: string;
  company_name: string;
  status: "SUCCESS" | "ABSTAINED";
  executive_summary: string;
  key_fundamental_strengths: string[];
  key_fundamental_risks: string[];
  valuation_and_solvency_assessment: string;
  citations: AISynthesisCitation[];
  grounding_score: number;
  model_used: string;
  provider: string;
  generated_at: string;
  disclaimer: string;
};

export async function getAISynthesis(
  symbol: string,
  focus?: string,
  provider: string = "auto"
): Promise<AISynthesis> {
  const queryParams = new URLSearchParams();
  if (focus) queryParams.set("focus", focus);
  if (provider) queryParams.set("provider", provider);

  const url = `${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/ai-synthesis?${queryParams.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve AI research synthesis");
  return response.json();
}

export async function requestAISynthesis(
  symbol: string,
  focusTopic?: string,
  providerPreference: string = "auto"
): Promise<AISynthesis> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/ai-synthesis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      focus_topic: focusTopic,
      provider_preference: providerPreference,
    }),
  });
  if (!response.ok) throw new Error("Unable to generate AI synthesis");
  return response.json();
}

// ─── Phase 6: Deep Health & Telemetry ─────────────────────────────────────────

export type ServiceComponentHealth = {
  name: string;
  status: "HEALTHY" | "DEGRADED" | "OFFLINE";
  latency_ms: number | null;
  details: string | null;
};

export type DeepHealthResponse = {
  status: "HEALTHY" | "DEGRADED";
  service: string;
  environment: string;
  timestamp: string;
  components: ServiceComponentHealth[];
};

export async function getDeepHealth(): Promise<DeepHealthResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/health/deep`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve deep health telemetry");
  return response.json();
}

// ─── Master Redesign: Ticker, Market Overview, News & Calendar ───────────────

export type TickerItem = {
  symbol: string;
  name: string;
  category: "indian_index" | "global_index" | "commodity" | "currency" | "yield" | string;
  exchange: string;
  price: number;
  change: number;
  change_pct: number;
  currency: string;
  market_status: "OPEN" | "CLOSED" | "PRE_MARKET" | "AFTER_HOURS" | "PRE_OPEN" | "POST_CLOSE" | "HOLIDAY" | string;
  data_status: "LIVE" | "DELAYED_15M" | "EOD" | "CLOSED" | "SYNTHETIC" | "SYNTHETIC_DEVELOPMENT" | string;
  sparkline: number[];
  timestamp?: string;
  provider?: string;
};

export type MarketBreadth = {
  advances: number;
  declines: number;
  unchanged: number;
  advance_decline_ratio: number;
  total_turnover_cr: number;
  exchange_status: string;
};

export type MarketMood = {
  score: number;
  label: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";
  description: string;
};

export type TopCompanyItem = {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change_pct: number;
  market_cap_cr: number;
  volume: number;
  currency: string;
  is_global: boolean;
};

export type MarketMoverItem = {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
  change: number;
  change_pct: number;
  volume: number;
  week52_high: number;
  week52_low: number;
  currency: string;
};

export type SectorPerformanceItem = {
  sector: string;
  change_pct: number;
  market_cap_cr: number;
  leading_stock: string;
  lagging_stock: string;
};

export type MarketOverview = {
  indian_market_status: string;
  global_market_status: string;
  as_of: string;
  market_breadth: {
    advances: number;
    declines: number;
    unchanged: number;
    advance_decline_ratio: number;
    total_turnover_cr: number;
    exchange_status: string;
  };
  market_mood: MarketMood;
  indices: TickerItem[];
  commodities: TickerItem[];
  currencies_and_yields: TickerItem[];
  top_companies: TopCompanyItem[];
  movers: {
    top_gainers: MarketMoverItem[];
    top_losers: MarketMoverItem[];
    most_active: MarketMoverItem[];
    week52_highs: MarketMoverItem[];
  };
  sector_performance: SectorPerformanceItem[];
};

export type MarketHeatmapItem = {
  symbol: string;
  name: string;
  sector: string;
  market_cap: number;
  change_pct: number;
  price: number;
  currency: string;
  exchange: string;
};

export type NewsEntity = {
  type: string;
  name: string;
  symbol: string | null;
  exchange?: string | null;
  isin?: string | null;
  relevance_pct?: number;
};

export type NewsEvidence = {
  evidence_id: string;
  evidence_type: string;
  title: string;
  url: string;
  publisher_or_authority: string;
  document_timestamp: string;
  document_hash: string | null;
  verified_by_engine: boolean;
};

export type NewsCorrection = {
  correction_id: string;
  article_id: string;
  corrected_at: string;
  correction_type: string;
  original_text: string;
  corrected_text: string;
  publisher_notice_url?: string | null;
  reason: string;
};

export type MarketTransmissionChannel = {
  channel: string;
  description: string;
  impact_type: "confirmed" | "implication" | string;
  affected_instruments: string[];
  affected_sectors: string[];
};

export type MarketImpactAnalysis = {
  headline_implication: string;
  direct_reported_impact: string;
  transmission_channels: MarketTransmissionChannel[];
  historical_precedent?: string | null;
  uncertainty_qualification: string;
};

export type CanonicalNewsArticle = {
  id: string;
  headline: string;
  title?: string;
  summary: string;
  publisher_name: string;
  publisher?: string;
  publisher_id: string;
  original_url: string;
  url?: string;
  author?: string | null;
  published_at: string;
  published_timezone: string;
  publication_time_verified: boolean;
  first_detected_at: string;
  last_updated_at?: string | null;
  source_tier: "TIER_1_PRIMARY_OFFICIAL" | "TIER_2_ESTABLISHED_JOURNALISM" | "TIER_3_SECONDARY_INDUSTRY" | "TIER_4_UNVERIFIED" | string;
  verification_status: "PRIMARY_SOURCE_CONFIRMED" | "MULTIPLE_SOURCES_REPORTED" | "SINGLE_CREDIBLE_SOURCE" | "DEVELOPING_STORY" | "DISPUTED" | "UNVERIFIED" | "CORRECTED" | "RETRACTED" | string;
  freshness_state: string;
  license_status: string;
  category: string;
  secondary_categories?: string[];
  country: string;
  market: string;
  asset_classes?: string[];
  related_entities?: NewsEntity[];
  entities?: NewsEntity[];
  key_facts: string[];
  evidence_items: NewsEvidence[];
  corroborating_sources: string[];
  cluster_id?: string | null;
  is_disputed: boolean;
  dispute_details?: string | null;
  correction_history?: NewsCorrection[];
  relevance_score: number;
  ranking_explanation: string;
  market_impact?: MarketImpactAnalysis | null;
  priority?: "BREAKING" | "CRITICAL" | "HIGH" | "MEDIUM" | "GENERAL" | "LOW" | string;
  impact_level?: "HIGH" | "MEDIUM" | "LOW" | string;
  transmission_channels?: MarketTransmissionChannel[];
  affected_instruments?: string[];
  affected_sectors?: string[];
  historical_context?: string | null;
};

// NewsItem is an alias for CanonicalNewsArticle to preserve backward compatibility
export type NewsItem = CanonicalNewsArticle;

export type NewsSourceItem = {
  source_id: string;
  name: string;
  tier: string;
  category: string;
  country: string;
  official_website: string;
  feed_url?: string | null;
  license_status: string;
  is_active: boolean;
  status: string;
  latency_ms: number;
  last_successful_fetch?: string | null;
  articles_ingested_24h: number;
};

export type UserDisputeReport = {
  report_id: string;
  article_id: string;
  submitted_at: string;
  report_category: string;
  description: string;
  evidence_url?: string | null;
  status: string;
};

export type NewsAdminStats = {
  active_sources_count: number;
  disabled_sources_count: number;
  total_articles_ingested_24h: number;
  primary_source_confirmed_pct: number;
  disputed_articles_count: number;
  unresolved_user_reports: number;
  circuit_breakers_tripped: number;
  pipeline_health: string;
  timestamp: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  event_type: "MACRO" | "EARNINGS" | "CORPORATE_ACTION";
  country: string;
  event_date: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
  actual: string | null;
  forecast: string | null;
  previous: string | null;
  symbol: string | null;
  notes: string | null;
};

export async function getMarketTicker(): Promise<TickerItem[]> {
  const response = await fetch(`${getApiBase()}/api/v1/market/ticker`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve global market ticker feed");
  return response.json();
}

export async function getMarketOverview(): Promise<MarketOverview> {
  const response = await fetch(`${getApiBase()}/api/v1/market/overview`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve market overview");
  return response.json();
}

export async function getMarketHeatmap(universe: string = "all"): Promise<MarketHeatmapItem[]> {
  const response = await fetch(`${getApiBase()}/api/v1/market/heatmap?universe=${encodeURIComponent(universe)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve market heatmap data");
  return response.json();
}

export async function getNewsFeed(params?: {
  category?: string;
  priority?: string;
  country?: string;
  market?: string;
  query?: string;
  symbol?: string;
  verification_status?: string;
  source_tier?: string;
  limit?: number;
  page?: number;
}): Promise<CanonicalNewsArticle[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.priority) query.set("priority", params.priority);
  if (params?.country) query.set("country", params.country);
  if (params?.market) query.set("market", params.market);
  if (params?.query) query.set("query", params.query);
  if (params?.symbol) query.set("symbol", params.symbol);
  if (params?.verification_status) query.set("verification_status", params.verification_status);
  if (params?.source_tier) query.set("source_tier", params.source_tier);
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.page) query.set("page", params.page.toString());

  const url = `${getApiBase()}/api/v1/news?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news intelligence feed");
  return response.json();
}

export async function getNewsStory(id: string): Promise<CanonicalNewsArticle> {
  const response = await fetch(`${getApiBase()}/api/v1/news/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news story");
  return response.json();
}

export async function getNewsStoryEvidence(id: string): Promise<NewsEvidence[]> {
  const response = await fetch(`${getApiBase()}/api/v1/news/${encodeURIComponent(id)}/evidence`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news story evidence");
  return response.json();
}

export async function getNewsStoryHistory(id: string): Promise<NewsCorrection[]> {
  const response = await fetch(`${getApiBase()}/api/v1/news/${encodeURIComponent(id)}/history`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news story history");
  return response.json();
}

export async function getNewsSources(): Promise<NewsSourceItem[]> {
  const response = await fetch(`${getApiBase()}/api/v1/news/sources`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news sources");
  return response.json();
}

export async function getNewsHealth(): Promise<Record<string, unknown>> {
  const response = await fetch(`${getApiBase()}/api/v1/news/health`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news pipeline health");
  return response.json();
}

export async function submitDisputeReport(payload: {
  article_id: string;
  report_category: string;
  description: string;
  evidence_url?: string;
}): Promise<UserDisputeReport> {
  const response = await fetch(`${getApiBase()}/api/v1/news/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to submit dispute report");
  return response.json();
}

export async function getNewsAdminStats(): Promise<NewsAdminStats> {
  const response = await fetch(`${getApiBase()}/api/v1/admin/news/monitor`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news admin monitor stats");
  return response.json();
}

export async function getCalendarEvents(eventType?: string): Promise<CalendarEvent[]> {
  const query = new URLSearchParams();
  if (eventType) query.set("event_type", eventType);

  const url = `${getApiBase()}/api/v1/calendar/events?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve calendar events");
  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Charting, OHLCV, Drawing Tools & Alerts Types & Methods
// ─────────────────────────────────────────────────────────────────────────────

export type ChartBar = {
  time: number | string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type ChartDataResponse = {
  instrument_id: string;
  symbol: string;
  exchange: string;
  currency: string;
  timeframe: string;
  data_status: string;
  data_source: string;
  last_timestamp: string;
  exchange_timezone: string;
  bars: ChartBar[];
};

export type UserChartDrawing = {
  drawing_id: string;
  instrument_id: string;
  timeframe: string;
  tool_type: string;
  points: { time: number | string; price: number }[];
  style: Record<string, unknown>;
  created_at: string;
};

export type PriceAlert = {
  alert_id: string;
  instrument_id: string;
  symbol: string;
  condition_type: "CROSS_ABOVE" | "CROSS_BELOW" | "PCT_CHANGE_ABOVE" | "PCT_CHANGE_BELOW" | "VOLUME_ABOVE";
  target_value: number;
  current_value?: number | null;
  is_active: boolean;
  triggered_at?: string | null;
  note?: string | null;
  created_at: string;
};

export async function getInstrumentOHLCV(symbol: string, timeframe = "1D", limit = 120): Promise<ChartBar[]> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/ohlcv?timeframe=${encodeURIComponent(timeframe)}&limit=${limit}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve instrument OHLCV bars");
  return response.json();
}

export async function getInstrumentChart(symbol: string, timeframe = "1D", limit = 120): Promise<ChartDataResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(symbol)}/chart?timeframe=${encodeURIComponent(timeframe)}&limit=${limit}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve instrument chart data");
  return response.json();
}

export async function getUserDrawings(instrumentId: string, timeframe?: string): Promise<UserChartDrawing[]> {
  let url = `${getApiBase()}/api/v1/chart/drawings?instrument_id=${encodeURIComponent(instrumentId)}`;
  if (timeframe) url += `&timeframe=${encodeURIComponent(timeframe)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return [];
  return response.json();
}

export async function saveUserDrawing(payload: {
  instrument_id: string;
  timeframe: string;
  tool_type: string;
  points: { time: number | string; price: number }[];
  style?: Record<string, unknown>;
}): Promise<UserChartDrawing> {
  const response = await fetch(`${getApiBase()}/api/v1/chart/drawings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to save chart drawing");
  return response.json();
}

export async function deleteUserDrawing(drawingId: string): Promise<void> {
  await fetch(`${getApiBase()}/api/v1/chart/drawings/${encodeURIComponent(drawingId)}`, {
    method: "DELETE",
  });
}

export async function getUserAlerts(symbol?: string): Promise<PriceAlert[]> {
  let url = `${getApiBase()}/api/v1/alerts`;
  if (symbol) url += `?symbol=${encodeURIComponent(symbol)}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return [];
  return response.json();
}

export async function createUserAlert(payload: {
  instrument_id: string;
  symbol: string;
  condition_type: string;
  target_value: number;
  note?: string;
}): Promise<PriceAlert> {
  const response = await fetch(`${getApiBase()}/api/v1/alerts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to create price alert");
  return response.json();
}

export async function deleteUserAlert(alertId: string): Promise<void> {
  await fetch(`${getApiBase()}/api/v1/alerts/${encodeURIComponent(alertId)}`, {
    method: "DELETE",
  });
}

export type ChartLayoutItem = {
  layout_id: string;
  user_id: string;
  name: string;
  layout_type: "single" | "split_2h" | "split_2v" | "grid_4";
  active_symbols: string[];
  indicators: Record<string, unknown>[];
  timeframe: string;
  updated_at: string;
};

export async function getChartLayouts(userId = "default_user"): Promise<ChartLayoutItem[]> {
  const response = await fetch(`${getApiBase()}/api/v1/chart/layouts?user_id=${encodeURIComponent(userId)}`, {
    cache: "no-store",
  });
  if (!response.ok) return [];
  return response.json();
}

export async function saveChartLayout(payload: {
  name: string;
  layout_type: string;
  active_symbols: string[];
  indicators?: Record<string, unknown>[];
  timeframe?: string;
}): Promise<ChartLayoutItem> {
  const response = await fetch(`${getApiBase()}/api/v1/chart/layouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Unable to save chart layout");
  return response.json();
}

export async function deleteChartLayout(layoutId: string): Promise<void> {
  await fetch(`${getApiBase()}/api/v1/chart/layouts/${encodeURIComponent(layoutId)}`, {
    method: "DELETE",
  });
}


export type InstrumentMasterItem = {
  instrument_id: string;
  symbol: string;
  display_name: string;
  exchange: string;
  asset_class: string;
  currency: string;
  isin: string | null;
  bse_scrip_code: string | null;
  primary_vendor: string;
  supported_vendors: string[];
};

export type ProviderHealthItem = {
  provider_name: string;
  status: string;
  latency_ms: number;
  last_checked: string;
  error_message: string | null;
  rate_limit_remaining: number | null;
};

export type DataQualityReport = {
  status: string;
  providers: ProviderHealthItem[];
  total_instruments_monitored: number;
  live_streaming_count: number;
  delayed_count: number;
  eod_closed_count: number;
  anomaly_count: number;
  active_websocket_connections: number;
  timestamp: string;
};

export async function getMarketInstruments(): Promise<InstrumentMasterItem[]> {
  const response = await fetch(`${getApiBase()}/api/v1/market/instruments`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve instrument catalog");
  return response.json();
}

export async function getDataQualityReport(): Promise<DataQualityReport> {
  const response = await fetch(`${getApiBase()}/api/v1/data/quality`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve data quality report");
  return response.json();
}

// ─── Universal Global Markets Expansion Types & API Client ──────────────────

export type TradingHours = {
  open_time: string;
  close_time: string;
  pre_open_time: string | null;
  post_close_time: string | null;
  utc_offset: string;
};

export type ExchangeMetadata = {
  exchange_id: string;
  name: string;
  mic: string;
  country: string;
  country_code: string;
  region: string;
  trading_currency: string;
  settlement_currency: string;
  timezone: string;
  trading_hours: TradingHours;
  asset_classes: string[];
  data_licensing_status: string;
  website: string;
  status: string;
  notes: string;
};

export type RegulatoryAccess = {
  status: string;
  display_badge: string;
  description: string;
  governing_framework: string;
  permitted_route: string;
  key_conditions: string[];
  disclaimer: string;
};

export type UniversalInstrument = {
  instrument_id: string;
  symbol: string;
  alt_symbols: string[];
  name: string;
  asset_class: string;
  instrument_type: string;
  country: string;
  country_code: string;
  region: string;
  exchange: string;
  mic: string;
  trading_currency: string;
  settlement_currency: string;
  isin: string | null;
  bse_scrip_code: string | null;
  price_precision: number;
  tick_size: number;
  timezone: string;
  market_calendar: string;
  trading_status: string;
  historical_data_available: boolean;
  streaming_available: boolean;
  data_delivery_mode: string;
  data_licensing_status: string;
  investment_access_status: string;
  permitted_investment_route: string;
  regulatory_details: RegulatoryAccess | null;
  notes: string;
};

export type UniversalSearchResponse = {
  query: string;
  count: number;
  results: UniversalInstrument[];
};

export type DerivativesPulseItem = {
  symbol: string;
  name: string;
  underlying_price: number;
  futures_price: number;
  basis: number;
  basis_pct: number;
  implied_volatility: number;
  put_call_ratio: number;
  total_oi: number;
  oi_change_pct: number;
  sentiment: string;
  data_status: string;
  timestamp: string;
};

export type DerivativesOverview = {
  india_vix: number;
  cboe_vix: number;
  vix_spread: number;
  put_call_ratio_nifty: number;
  put_call_ratio_banknifty: number;
  items: DerivativesPulseItem[];
  updated_at: string;
};

export type YieldCurvePoint = {
  tenor: string;
  tenor_months: number;
  yield_pct: number;
  change_bps: number;
  updated_at: string;
};

export type CentralBankPolicyRate = {
  country: string;
  central_bank: string;
  rate_name: string;
  rate_pct: number;
  last_action: string;
  next_meeting: string;
};

export type SovereignGoldBondItem = {
  series: string;
  symbol: string;
  issue_price: number;
  current_market_price: number;
  yield_to_maturity_pct: number;
  maturity_date: string;
  annual_coupon_pct: number;
};

export type FixedIncomeOverview = {
  india_benchmark_10y: number;
  us_benchmark_10y: number;
  spread_bps: number;
  india_yield_curve: YieldCurvePoint[];
  us_yield_curve: YieldCurvePoint[];
  policy_rates: CentralBankPolicyRate[];
  sovereign_gold_bonds: SovereignGoldBondItem[];
  updated_at: string;
};

export type FundMarketItem = {
  scheme_code: string;
  scheme_name: string;
  fund_house: string;
  category: string;
  sub_category: string;
  nav: number;
  previous_nav: number;
  change: number;
  change_pct: number;
  aum_cr: number;
  expense_ratio_pct: number;
  feeder_target: string | null;
  regulatory_status: string;
  updated_at: string;
};

export type FundsOverview = {
  total_schemes: number;
  categories: string[];
  funds: FundMarketItem[];
  updated_at: string;
};

export type CommodityItem = {
  symbol: string;
  name: string;
  category: string;
  exchange: string;
  price: number;
  change: number;
  change_pct: number;
  unit: string;
  currency: string;
  data_status: string;
  sparkline: number[];
};

export type CommoditiesOverview = {
  categories: string[];
  commodities: CommodityItem[];
  updated_at: string;
};

export type CurrencyItem = {
  pair: string;
  name: string;
  category: string;
  rate: number;
  change: number;
  change_pct: number;
  source: string;
  data_status: string;
  sparkline: number[];
};

export type CurrenciesOverview = {
  rbi_reference_rate_date: string;
  usd_inr: number;
  eur_inr: number;
  gbp_inr: number;
  jpy_100_inr: number;
  dxy_index: number;
  pairs: CurrencyItem[];
  updated_at: string;
};

export type ProviderCapability = {
  provider_id: string;
  name: string;
  tier: string;
  supported_asset_classes: string[];
  supported_exchanges: string[];
  live_streaming_capable: boolean;
  rate_limit_per_min: number | string;
  data_lag: string;
  status: string;
  latency_ms: number;
  compliance_classification: string;
};

export type AdminProvidersOverview = {
  total_providers: number;
  active_providers: number;
  providers: ProviderCapability[];
  engine_mode: string;
  updated_at: string;
};

export async function getGlobalExchanges(region?: string, countryCode?: string, assetClass?: string): Promise<ExchangeMetadata[]> {
  const query = new URLSearchParams();
  if (region) query.set("region", region);
  if (countryCode) query.set("country_code", countryCode);
  if (assetClass) query.set("asset_class", assetClass);

  const url = `${getApiBase()}/api/v1/market/exchanges?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve global exchanges registry");
  return response.json();
}

export async function getUniversalInstruments(params?: {
  asset_class?: string;
  country?: string;
  region?: string;
  exchange?: string;
  access_status?: string;
  limit?: number;
}): Promise<UniversalInstrument[]> {
  const query = new URLSearchParams();
  if (params?.asset_class) query.set("asset_class", params.asset_class);
  if (params?.country) query.set("country", params.country);
  if (params?.region) query.set("region", params.region);
  if (params?.exchange) query.set("exchange", params.exchange);
  if (params?.access_status) query.set("access_status", params.access_status);
  if (params?.limit) query.set("limit", String(params.limit));

  const url = `${getApiBase()}/api/v1/market/instruments/universal?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve universal instruments");
  return response.json();
}

export async function getUniversalInstrumentDetail(id: string): Promise<UniversalInstrument> {
  const response = await fetch(`${getApiBase()}/api/v1/market/instruments/universal/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve instrument detail");
  return response.json();
}

export async function searchUniversalInstruments(q: string, assetClass?: string, exchange?: string): Promise<UniversalSearchResponse> {
  const query = new URLSearchParams({ q });
  if (assetClass) query.set("asset_class", assetClass);
  if (exchange) query.set("exchange", exchange);

  const url = `${getApiBase()}/api/v1/market/universal-search?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to perform universal search");
  return response.json();
}

export async function getDerivativesPulse(): Promise<DerivativesOverview> {
  const response = await fetch(`${getApiBase()}/api/v1/market/derivatives`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve derivatives pulse");
  return response.json();
}

export async function getFixedIncomeOverview(): Promise<FixedIncomeOverview> {
  const response = await fetch(`${getApiBase()}/api/v1/market/fixed-income`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve fixed income overview");
  return response.json();
}

export async function getFundsOverview(category?: string): Promise<FundsOverview> {
  const query = new URLSearchParams();
  if (category) query.set("category", category);

  const url = `${getApiBase()}/api/v1/market/funds?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve funds overview");
  return response.json();
}

export async function getCommoditiesOverview(): Promise<CommoditiesOverview> {
  const response = await fetch(`${getApiBase()}/api/v1/market/commodities`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve commodities overview");
  return response.json();
}

export async function getCurrenciesOverview(): Promise<CurrenciesOverview> {
  const response = await fetch(`${getApiBase()}/api/v1/market/currencies`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve currencies overview");
  return response.json();
}

export async function getAdminProviders(): Promise<AdminProvidersOverview> {
  const response = await fetch(`${getApiBase()}/api/v1/market/admin/providers`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve admin providers status");
  return response.json();
}

export type StockDiscoveryItem = {
  instrument_id: string;
  symbol: string;
  name: string;
  display_name: string;
  company_id: string;
  exchange: string;
  exchange_name: string;
  country: string;
  country_code: string;
  currency: string;
  security_type: string;
  isin: string | null;
  sector: string;
  industry: string;
  price: number;
  change_pct: number;
  market_cap: number;
  market_cap_display: string;
  market_cap_category: string;
  pe_ratio: number | null;
  pb_ratio: number | null;
  roe_pct: number | null;
  week_52_high: number;
  week_52_low: number;
  volume: number;
  data_status: string;
  has_multiple_listings: boolean;
  total_listings: number;
};

export type StockDiscoveryResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  filters_applied: Record<string, any>;
  results: StockDiscoveryItem[];
};

export type CompanyListingItem = {
  instrument_id: string;
  symbol: string;
  exchange: string;
  exchange_name: string;
  country: string;
  currency: string;
  security_type: string;
  isin: string | null;
  price: number;
  change_pct: number;
  market_cap_display: string;
  data_status: string;
};

export type CompanyListingsResponse = {
  company_id: string;
  company_name: string;
  count: number;
  listings: CompanyListingItem[];
};

export type MarketCoverageResponse = {
  total_instruments: number;
  total_companies: number;
  active_listings: number;
  exchanges_covered: number;
  by_exchange: Record<string, number>;
  by_country: Record<string, number>;
  by_sector: Record<string, number>;
  cross_listings_count: number;
  timestamp: string;
  status: string;
  providers: any[];
};

export async function getStockDiscovery(params?: {
  exchange?: string;
  country?: string;
  sector?: string;
  market_cap_category?: string;
  security_type?: string;
  listing_status?: string;
  search?: string;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  page_size?: number;
}): Promise<StockDiscoveryResponse> {
  const query = new URLSearchParams();
  if (params?.exchange) query.set("exchange", params.exchange);
  if (params?.country) query.set("country", params.country);
  if (params?.sector) query.set("sector", params.sector);
  if (params?.market_cap_category) query.set("market_cap_category", params.market_cap_category);
  if (params?.security_type) query.set("security_type", params.security_type);
  if (params?.listing_status) query.set("listing_status", params.listing_status);
  if (params?.search) query.set("search", params.search);
  if (params?.sort_by) query.set("sort_by", params.sort_by);
  if (params?.sort_dir) query.set("sort_dir", params.sort_dir);
  if (params?.page) query.set("page", String(params.page));
  if (params?.page_size) query.set("page_size", String(params.page_size));

  const url = `${getApiBase()}/api/v1/market/stock-discovery?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to discover stocks");
  return response.json();
}

export async function getCompanyListings(companyId: string): Promise<CompanyListingsResponse> {
  const url = `${getApiBase()}/api/v1/companies/${encodeURIComponent(companyId)}/listings`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve company listings");
  return response.json();
}

export async function getMarketCoverage(): Promise<MarketCoverageResponse> {
  const url = `${getApiBase()}/api/v1/market/coverage`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve market coverage");
  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Derivatives & Quantitative Intelligence Types & API Calls
// ─────────────────────────────────────────────────────────────────────────────

export type OptionStrikeItem = {
  strike: number;
  call_oi: number;
  call_oi_change: number;
  call_volume: number;
  call_iv: number;
  call_ltp: number;
  call_delta: number;
  put_ltp: number;
  put_iv: number;
  put_volume: number;
  put_oi_change: number;
  put_oi: number;
  put_delta: number;
  gamma: number;
  vega: number;
};

export type OptionChainResponse = {
  underlying: string;
  spot_price: number;
  expiry_date: string;
  pcr: number;
  max_pain: number;
  total_call_oi: number;
  total_put_oi: number;
  atm_strike: number;
  strikes: OptionStrikeItem[];
  status: string;
  timestamp: string;
};

export type FuturesBuildupItem = {
  symbol: string;
  expiry: string;
  last_price: number;
  price_change: number;
  price_change_pct: number;
  open_interest: number;
  oi_change: number;
  oi_change_pct: number;
  classification: "LONG_BUILDUP" | "SHORT_BUILDUP" | "SHORT_COVERING" | "LONG_UNWINDING";
  interpretation: string;
  volume: number;
};

export type SectorLeadershipItem = {
  sector: string;
  change_pct_1d: number;
  change_pct_1w: number;
  change_pct_1m: number;
  relative_strength: number;
  top_driver: string;
  momentum_status: "LEADING" | "WEAKENING" | "LAGGING" | "IMPROVING";
};

export type SetupRadarItem = {
  symbol: string;
  company_name: string;
  sector: string;
  timeframe: string;
  setup_name: string;
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  description: string;
  trigger_price: number;
  stop_loss: number;
  target_price: number;
};

export type MarketFlowResponse = {
  advances: number;
  declines: number;
  unchanged: number;
  ad_ratio: number;
  market_sentiment: "BULLISH" | "CAUTIOUS_BULLISH" | "NEUTRAL" | "BEARISH";
  nifty_spot: number;
  nifty_change_pct: number;
  highs_52w: number;
  lows_52w: number;
  sector_leadership: SectorLeadershipItem[];
  setup_radar: SetupRadarItem[];
};

export async function getOptionChain(symbol = "NIFTY"): Promise<OptionChainResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/derivatives/option-chain?symbol=${encodeURIComponent(symbol)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve option chain");
  return response.json();
}

export async function getFuturesBuildup(): Promise<FuturesBuildupItem[]> {
  const response = await fetch(`${getApiBase()}/api/v1/derivatives/futures-buildup`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve futures buildup data");
  return response.json();
}

export async function getMarketFlowIntelligence(): Promise<MarketFlowResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/market/flow-intelligence`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve market flow intelligence");
  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Backtesting & Paper Trading Types & API Calls
// ─────────────────────────────────────────────────────────────────────────────

export type BacktestTrade = {
  trade_id: number;
  entry_time: string | number;
  exit_time: string | number;
  side: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  gross_pnl: number;
  net_pnl: number;
  return_pct: number;
  reason: string;
};

export type EquityCurvePoint = {
  time: string | number;
  equity: number;
  drawdown_pct: number;
};

export type BacktestResponse = {
  symbol: string;
  strategy_type: string;
  timeframe: string;
  initial_capital: number;
  ending_capital: number;
  total_return_pct: number;
  cagr_pct: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  max_drawdown_pct: number;
  win_rate_pct: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  profit_factor: number;
  equity_curve: EquityCurvePoint[];
  trades: BacktestTrade[];
};

export type PaperPosition = {
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  invested_amount: number;
  current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
};

export type PaperOrder = {
  order_id: string;
  symbol: string;
  side: "BUY" | "SELL";
  order_type: "MARKET" | "LIMIT";
  quantity: number;
  executed_price: number;
  fee: number;
  total_amount: number;
  status: string;
  timestamp: string;
};

export type PaperPortfolioResponse = {
  account_id: string;
  currency: string;
  initial_cash: number;
  available_cash: number;
  invested_value: number;
  total_portfolio_value: number;
  total_unrealized_pnl: number;
  total_realized_pnl: number;
  positions: PaperPosition[];
  recent_orders: PaperOrder[];
};

export async function runBacktest(payload: {
  symbol: string;
  strategy_type: string;
  timeframe?: string;
  initial_capital?: number;
  fast_period?: number;
  slow_period?: number;
  rsi_oversold?: number;
  rsi_overbought?: number;
  slippage_pct?: number;
  fee_pct?: number;
}): Promise<BacktestResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/backtest/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Backtest failed" }));
    throw new Error(err.detail || "Backtest execution error");
  }
  return response.json();
}

export async function getPaperPortfolio(): Promise<PaperPortfolioResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/paper-trading/portfolio`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve paper portfolio");
  return response.json();
}

export async function placePaperOrder(payload: {
  symbol: string;
  side: "BUY" | "SELL";
  order_type?: "MARKET" | "LIMIT";
  quantity: number;
  limit_price?: number;
}): Promise<PaperOrder> {
  const response = await fetch(`${getApiBase()}/api/v1/paper-trading/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Order failed" }));
    throw new Error(err.detail || "Unable to place simulated order");
  }
  return response.json();
}

export async function resetPaperAccount(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${getApiBase()}/api/v1/paper-trading/reset`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Unable to reset paper trading account");
  return response.json();
}




