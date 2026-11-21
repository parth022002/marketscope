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
  min_market_cap?: number;
  min_roe?: number;
  max_pe?: number;
  max_debt_equity?: number;
  min_opm?: number;
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

export async function searchInstruments(query: string): Promise<Instrument[]> {
  const response = await fetch(
    `${getApiBase()}/api/v1/instruments/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Unable to search instruments");
  const data = await response.json();
  return data.items as Instrument[];
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
  category: "indian_index" | "global_index" | "commodity" | "currency" | "yield";
  exchange: string;
  price: number;
  change: number;
  change_pct: number;
  currency: string;
  market_status: "OPEN" | "CLOSED" | "PRE_MARKET" | "AFTER_HOURS";
  data_status: "LIVE" | "DELAYED_15M" | "EOD" | "SYNTHETIC";
  sparkline: number[];
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
};

export type NewsTransmissionChannel = {
  channel: string;
  description: string;
  impact_type: "confirmed" | "implication";
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  publisher: string;
  published_at: string;
  updated_at: string | null;
  url: string;
  category: string;
  country: string;
  priority: "BREAKING" | "CRITICAL" | "HIGH" | "MEDIUM" | "GENERAL" | "LOW";
  relevance_score: number;
  impact_level: "HIGH" | "MEDIUM" | "LOW";
  entities: NewsEntity[];
  corroborating_sources: string[];
  cluster_id: string | null;
  key_facts?: string[];
  affected_instruments?: string[];
  affected_sectors?: string[];
  transmission_channels?: NewsTransmissionChannel[];
  historical_context?: string | null;
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
  query?: string;
  symbol?: string;
}): Promise<NewsItem[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.priority) query.set("priority", params.priority);
  if (params?.country) query.set("country", params.country);
  if (params?.query) query.set("query", params.query);
  if (params?.symbol) query.set("symbol", params.symbol);

  const url = `${getApiBase()}/api/v1/news?${query.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news intelligence feed");
  return response.json();
}

export async function getNewsStory(id: string): Promise<NewsItem> {
  const response = await fetch(`${getApiBase()}/api/v1/news/${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve news story");
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


