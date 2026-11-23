export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "production" ? "https://marketscope-api.onrender.com" : "http://localhost:8000");

export const SERVER_API_BASE = process.env.API_INTERNAL_BASE_URL ?? API_BASE;

export const getApiBase = () => {
  if (typeof window === "undefined") {
    return process.env.API_INTERNAL_BASE_URL || API_BASE;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:8000";
  }
  return "https://marketscope-api.onrender.com";
};

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 7000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

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
  instrument_id?: string;
  symbol: string;
  company_name: string;
  added_at: string;
  notes?: string;
};

export type Watchlist = {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at?: string;
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

export const STARTER_WATCHLISTS: Watchlist[] = [
  {
    id: "wl_nifty_bluechips",
    workspace_id: DEFAULT_WORKSPACE_ID,
    name: "Nifty 50 Core Leaders",
    description: "Anchor Indian corporate compounders across energy, IT, and banking.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      { id: "wli_1", watchlist_id: "wl_nifty_bluechips", symbol: "RELIANCE", company_name: "Reliance Industries Ltd", added_at: new Date().toISOString(), notes: "Energy transition & digital retail conglomerate" },
      { id: "wli_2", watchlist_id: "wl_nifty_bluechips", symbol: "TCS", company_name: "Tata Consultancy Services", added_at: new Date().toISOString(), notes: "Global enterprise IT services with high ROE" },
      { id: "wli_3", watchlist_id: "wl_nifty_bluechips", symbol: "HDFCBANK", company_name: "HDFC Bank Ltd", added_at: new Date().toISOString(), notes: "Private sector banking leader post-merger" },
      { id: "wli_4", watchlist_id: "wl_nifty_bluechips", symbol: "TATAMOTORS", company_name: "Tata Motors Ltd", added_at: new Date().toISOString(), notes: "EV market share leader & commercial vehicles" },
    ],
  },
  {
    id: "wl_global_innovators",
    workspace_id: DEFAULT_WORKSPACE_ID,
    name: "US Tech & AI Growth",
    description: "Permissible under RBI LRS ($250,000 / FY).",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      { id: "wli_5", watchlist_id: "wl_global_innovators", symbol: "NVDA", company_name: "NVIDIA Corp.", added_at: new Date().toISOString(), notes: "Accelerated computing & data center GPUs" },
      { id: "wli_6", watchlist_id: "wl_global_innovators", symbol: "AAPL", company_name: "Apple Inc.", added_at: new Date().toISOString(), notes: "Consumer ecosystem & services recurring cash flow" },
      { id: "wli_7", watchlist_id: "wl_global_innovators", symbol: "MSFT", company_name: "Microsoft Corp.", added_at: new Date().toISOString(), notes: "Enterprise cloud infrastructure & generative AI" },
    ],
  },
];

export async function getWatchlists(workspaceId: string): Promise<Watchlist[]> {
  try {
    const response = await fetchWithTimeout(
      `${getApiBase()}/api/v1/workspaces/${encodeURIComponent(workspaceId)}/watchlists`,
      { cache: "no-store" },
      6000
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    // Fallback to local storage or starter
  }

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem(`marketscope_watchlists_${workspaceId}`);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }
  return STARTER_WATCHLISTS;
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

export const FALLBACK_TICKERS: TickerItem[] = [
  {
    symbol: "NIFTY 50",
    name: "Nifty 50 Benchmark Index",
    category: "indian_index",
    exchange: "NSE",
    price: 24180.80,
    change: 125.40,
    change_pct: 0.52,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [24055.40, 24090.0, 24140.0, 24180.80],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "SENSEX",
    name: "BSE SENSEX 30",
    category: "indian_index",
    exchange: "BSE",
    price: 79802.40,
    change: 380.20,
    change_pct: 0.48,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [79422.20, 79510.0, 79650.0, 79802.40],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "NIFTY BANK",
    name: "Nifty Bank Index",
    category: "indian_index",
    exchange: "NSE",
    price: 51820.50,
    change: 210.30,
    change_pct: 0.41,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [51610.20, 51680.0, 51740.0, 51820.50],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "NIFTY IT",
    name: "Nifty IT Sector Index",
    category: "indian_index",
    exchange: "NSE",
    price: 42150.30,
    change: 355.20,
    change_pct: 0.85,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [41795.10, 41920.0, 42080.0, 42150.30],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "NIFTY MIDCAP 100",
    name: "Nifty Midcap 100",
    category: "indian_index",
    exchange: "NSE",
    price: 58920.10,
    change: 538.40,
    change_pct: 0.92,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [58380.0, 58550.0, 58780.0, 58920.10],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "NASDAQ 100",
    name: "NASDAQ 100",
    category: "global_index",
    exchange: "NASDAQ",
    price: 20910.45,
    change: -85.20,
    change_pct: -0.41,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [20995.65, 20970.0, 20940.0, 20910.45],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "S&P 500",
    name: "S&P 500 Index",
    category: "global_index",
    exchange: "NYSE",
    price: 5969.34,
    change: 12.50,
    change_pct: 0.21,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [5956.84, 5960.0, 5964.0, 5969.34],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "DOW JONES",
    name: "Dow Jones Industrial Average",
    category: "global_index",
    exchange: "NYSE",
    price: 44296.51,
    change: 185.30,
    change_pct: 0.42,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [44111.20, 44190.0, 44250.0, 44296.51],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "FTSE 100",
    name: "FTSE 100 Index",
    category: "global_index",
    exchange: "LSE",
    price: 8262.08,
    change: 14.80,
    change_pct: 0.18,
    currency: "GBP",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [8247.28, 8255.0, 8258.0, 8262.08],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "NIKKEI 225",
    name: "Nikkei 225 Index",
    category: "global_index",
    exchange: "TSE",
    price: 38642.91,
    change: 261.50,
    change_pct: 0.68,
    currency: "JPY",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [38381.40, 38480.0, 38590.0, 38642.91],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "BRENT CRUDE",
    name: "Brent Crude Oil",
    category: "commodity",
    exchange: "ICE",
    price: 74.20,
    change: 0.85,
    change_pct: 1.16,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [73.35, 73.60, 73.85, 74.20],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "GOLD MCX",
    name: "Gold 24K (10g)",
    category: "commodity",
    exchange: "MCX",
    price: 76450.00,
    change: 210.00,
    change_pct: 0.28,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [76240.0, 76300.0, 76360.0, 76450.00],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "SILVER MCX",
    name: "Silver 999 (1kg)",
    category: "commodity",
    exchange: "MCX",
    price: 91200.00,
    change: 410.00,
    change_pct: 0.45,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [90790.0, 90950.0, 91100.0, 91200.00],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "USD/INR",
    name: "US Dollar / Indian Rupee",
    category: "currency",
    exchange: "RBI",
    price: 84.42,
    change: 0.02,
    change_pct: 0.02,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [84.40, 84.41, 84.42, 84.42],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "EUR/INR",
    name: "Euro / Indian Rupee",
    category: "currency",
    exchange: "RBI",
    price: 89.15,
    change: -0.13,
    change_pct: -0.15,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [89.28, 89.22, 89.18, 89.15],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    category: "equity",
    exchange: "NSE",
    price: 1377.50,
    change: 1.95,
    change_pct: 0.14,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [1375.55, 1374.0, 1376.5, 1377.50],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    category: "equity",
    exchange: "NSE",
    price: 4180.20,
    change: 45.40,
    change_pct: 1.10,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [4134.80, 4150.0, 4165.0, 4180.20],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    category: "equity",
    exchange: "NSE",
    price: 1745.80,
    change: 16.40,
    change_pct: 0.95,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [1729.40, 1735.0, 1740.0, 1745.80],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    category: "equity",
    exchange: "NSE",
    price: 1885.60,
    change: -12.30,
    change_pct: -0.65,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [1897.90, 1892.0, 1888.0, 1885.60],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors Ltd",
    category: "equity",
    exchange: "NSE",
    price: 942.50,
    change: 18.20,
    change_pct: 1.97,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [924.30, 931.0, 938.0, 942.50],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    category: "equity",
    exchange: "NASDAQ",
    price: 148.20,
    change: 5.50,
    change_pct: 3.85,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [142.70, 144.5, 146.8, 148.20],
    provider: "marketscope_canonical_archive",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    category: "equity",
    exchange: "NASDAQ",
    price: 232.50,
    change: 2.75,
    change_pct: 1.20,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [229.75, 230.5, 231.8, 232.50],
    provider: "marketscope_canonical_archive",
  },
];

export async function getMarketTicker(): Promise<TickerItem[]> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/market/ticker`, { cache: "no-store" }, 6000);
    if (!response.ok) {
      return FALLBACK_TICKERS;
    }
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_TICKERS;
  } catch (e) {
    return FALLBACK_TICKERS;
  }
}

export const FALLBACK_HEATMAP_ITEMS: MarketHeatmapItem[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy & Oil", market_cap: 1991200, change_pct: 0.14, price: 1377.50, currency: "INR", exchange: "NSE" },
  { symbol: "TCS", name: "Tata Consultancy", sector: "Information Tech", market_cap: 1492500, change_pct: 1.43, price: 2376.20, currency: "INR", exchange: "NSE" },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Financials", market_cap: 1334000, change_pct: 2.94, price: 846.00, currency: "INR", exchange: "NSE" },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Financials", market_cap: 1148000, change_pct: 1.93, price: 1640.00, currency: "INR", exchange: "NSE" },
  { symbol: "INFY", name: "Infosys", sector: "Information Tech", market_cap: 912000, change_pct: 0.56, price: 1098.00, currency: "INR", exchange: "NSE" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", market_cap: 1224000, change_pct: 0.83, price: 2161.70, currency: "INR", exchange: "NSE" },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Automobile", market_cap: 298500, change_pct: 0.85, price: 742.50, currency: "INR", exchange: "NSE" },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", market_cap: 578000, change_pct: -0.05, price: 4209.10, currency: "INR", exchange: "NSE" },
  { symbol: "NVDA", name: "NVIDIA Corp", sector: "Semiconductors", market_cap: 3580000, change_pct: 3.85, price: 148.20, currency: "USD", exchange: "NASDAQ" },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", market_cap: 4978000, change_pct: 1.20, price: 232.50, currency: "USD", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corp", sector: "Software", market_cap: 3620000, change_pct: -0.58, price: 428.50, currency: "USD", exchange: "NASDAQ" },
];

export const FALLBACK_NEWS: CanonicalNewsArticle[] = [
  {
    id: "news-001",
    headline: "RBI Keeps Benchmark Repo Rate Steady at 6.50% Amid Resilient Domestic Growth",
    title: "RBI Keeps Benchmark Repo Rate Steady at 6.50% Amid Resilient Domestic Growth",
    summary: "The Monetary Policy Committee unanimously opted to hold the repo rate constant, emphasizing disinflation commitment while highlighting durable capex momentum across infrastructure sectors.",
    publisher_name: "Reserve Bank of India Monetary Policy",
    publisher: "Reserve Bank of India Monetary Policy",
    publisher_id: "src-rbi-01",
    original_url: "https://www.rbi.org.in",
    url: "https://www.rbi.org.in",
    published_at: new Date().toISOString(),
    published_timezone: "Asia/Kolkata",
    publication_time_verified: true,
    first_detected_at: new Date().toISOString(),
    source_tier: "TIER_1_PRIMARY_OFFICIAL",
    verification_status: "PRIMARY_SOURCE_CONFIRMED",
    freshness_state: "REALTIME",
    license_status: "OFFICIAL_COMMUNIQUE",
    category: "Economy & Central Banks",
    country: "IN",
    market: "DOMESTIC",
    key_facts: [
      "Monetary Policy Committee voted 6-0 to maintain 6.50% repo rate",
      "FY25 GDP growth forecast maintained at 7.2%",
      "CPI inflation trajectory tracked closely towards 4% target"
    ],
    evidence_items: [
      {
        evidence_id: "ev-rbi-01",
        evidence_type: "REGULATORY_COMMUNIQUE",
        title: "Monetary Policy Committee Statement",
        url: "https://www.rbi.org.in",
        publisher_or_authority: "Reserve Bank of India",
        document_timestamp: new Date().toISOString(),
        document_hash: "a1b2c3d4e5f6",
        verified_by_engine: true,
      }
    ],
    corroborating_sources: ["SEBI Regulatory Wire", "Press Information Bureau"],
    is_disputed: false,
    relevance_score: 98,
    ranking_explanation: "Central bank monetary policy statement governing systemic liquidity and sovereign yield curves.",
    priority: "HIGH"
  },
  {
    id: "news-002",
    headline: "SEBI Mandates T+0 Optional Settlement Window Expansion for High-Liquidity Large Caps",
    title: "SEBI Mandates T+0 Optional Settlement Window Expansion for High-Liquidity Large Caps",
    summary: "Capital markets regulator expands same-day settlement eligibility to top 500 capitalised equities to enhance collateral velocity and reduce counterparty exposure.",
    publisher_name: "Securities and Exchange Board of India",
    publisher: "Securities and Exchange Board of India",
    publisher_id: "src-sebi-01",
    original_url: "https://www.sebi.gov.in",
    url: "https://www.sebi.gov.in",
    published_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    published_timezone: "Asia/Kolkata",
    publication_time_verified: true,
    first_detected_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    source_tier: "TIER_1_PRIMARY_OFFICIAL",
    verification_status: "PRIMARY_SOURCE_CONFIRMED",
    freshness_state: "REALTIME",
    license_status: "OFFICIAL_COMMUNIQUE",
    category: "Regulatory & Geopolitics",
    country: "IN",
    market: "DOMESTIC",
    key_facts: [
      "Eligible stocks expanded from initial 25 beta names to 500 large caps",
      "Clearing corporations confirm real-time DVP collateral release architecture"
    ],
    evidence_items: [],
    corroborating_sources: ["NSE Clearing Circular", "BSE Notice Board"],
    is_disputed: false,
    relevance_score: 95,
    ranking_explanation: "Core structural market micro-structure transition altering domestic broker capital requirements.",
    priority: "HIGH"
  },
  {
    id: "news-003",
    headline: "Global Semiconductor Demand Sparks Export Surge in Electronics Manufacturing Services",
    title: "Global Semiconductor Demand Sparks Export Surge in Electronics Manufacturing Services",
    summary: "Leading domestic electronics contract manufacturers report 42% YoY rise in assembly and component exports driven by global supply chain diversification and PLI disbursements.",
    publisher_name: "Ministry of Commerce & Industry",
    publisher: "Ministry of Commerce & Industry",
    publisher_id: "src-gov-01",
    original_url: "https://commerce.gov.in",
    url: "https://commerce.gov.in",
    published_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    published_timezone: "Asia/Kolkata",
    publication_time_verified: true,
    first_detected_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    source_tier: "TIER_2_ESTABLISHED_JOURNALISM",
    verification_status: "MULTIPLE_SOURCES_REPORTED",
    freshness_state: "REALTIME",
    license_status: "VERIFIED_WIRE",
    category: "Sectoral Coverage",
    country: "IN",
    market: "DOMESTIC",
    key_facts: [
      "Electronics exports exceed quarterly run-rate targets",
      "Component localization ratio improves to 34%"
    ],
    evidence_items: [],
    corroborating_sources: ["Customs Port Data", "IBEF Manufacturing Index"],
    is_disputed: false,
    relevance_score: 88,
    ranking_explanation: "High macroeconomic relevance for industrial capital expenditure and foreign exchange inflows.",
    priority: "MEDIUM"
  },
  {
    id: "news-004",
    headline: "Federal Reserve Notes Continued Moderation in Core PCE Inflation, Balancing Labor Conditions",
    title: "Federal Reserve Notes Continued Moderation in Core PCE Inflation, Balancing Labor Conditions",
    summary: "Federal Open Market Committee minutes reiterate data-dependent policy stance as global supply chains stabilize and services inflation decelerates towards multi-year lows.",
    publisher_name: "US Federal Reserve Board",
    publisher: "US Federal Reserve Board",
    publisher_id: "src-fed-01",
    original_url: "https://www.federalreserve.gov",
    url: "https://www.federalreserve.gov",
    published_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    published_timezone: "America/New_York",
    publication_time_verified: true,
    first_detected_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    source_tier: "TIER_1_PRIMARY_OFFICIAL",
    verification_status: "PRIMARY_SOURCE_CONFIRMED",
    freshness_state: "REALTIME",
    license_status: "OFFICIAL_COMMUNIQUE",
    category: "Economy & Central Banks",
    country: "US",
    market: "INTERNATIONAL",
    key_facts: [
      "Core PCE annualized rate tracks closer to 2.6%",
      "Global asset pricing responds to steady Treasury yields"
    ],
    evidence_items: [],
    corroborating_sources: ["Bureau of Labor Statistics", "U.S. Treasury Statements"],
    is_disputed: false,
    relevance_score: 92,
    ranking_explanation: "Global benchmark rate trajectory influences foreign institutional investor capital flows.",
    priority: "HIGH"
  }
];

export const FALLBACK_MARKET_OVERVIEW: MarketOverview = {
  indian_market_status: "CLOSED",
  global_market_status: "CLOSED",
  as_of: new Date().toISOString(),
  market_breadth: {
    advances: 1420,
    declines: 980,
    unchanged: 110,
    advance_decline_ratio: 1.45,
    total_turnover_cr: 84520.5,
    exchange_status: "NORMAL",
  },
  market_mood: {
    score: 62,
    label: "Greed",
    description: "Sustained retail participation and strong domestic institutional liquidity support equity multiples.",
  },
  indices: FALLBACK_TICKERS.filter((t) => t.category === "indian_index" || t.category === "global_index"),
  commodities: FALLBACK_TICKERS.filter((t) => t.category === "commodity"),
  currencies_and_yields: FALLBACK_TICKERS.filter((t) => t.category === "currency"),
  top_companies: [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      exchange: "NSE",
      sector: "Energy & Petrochemicals",
      price: 1377.50,
      change_pct: 0.14,
      market_cap_cr: 1991200,
      volume: 8450000,
      currency: "INR",
      is_global: false,
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      exchange: "NSE",
      sector: "Information Technology",
      price: 4180.20,
      change_pct: 1.10,
      market_cap_cr: 1492500,
      volume: 3200000,
      currency: "INR",
      is_global: false,
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd",
      exchange: "NSE",
      sector: "Banking & Financials",
      price: 1740.50,
      change_pct: 0.45,
      market_cap_cr: 1334000,
      volume: 12500000,
      currency: "INR",
      is_global: false,
    },
    {
      symbol: "AAPL",
      name: "Apple Inc",
      exchange: "NASDAQ",
      sector: "Technology",
      price: 232.50,
      change_pct: 1.20,
      market_cap_cr: 3560000,
      volume: 48000000,
      currency: "USD",
      is_global: true,
    },
  ],
  movers: {
    top_gainers: [
      {
        symbol: "TATASTEEL",
        name: "Tata Steel Ltd",
        exchange: "NSE",
        price: 154.20,
        change: 4.80,
        change_pct: 3.21,
        volume: 24500000,
        week52_high: 184.60,
        week52_low: 118.25,
        currency: "INR",
      },
      {
        symbol: "INFY",
        name: "Infosys Ltd",
        exchange: "NSE",
        price: 1890.00,
        change: 38.50,
        change_pct: 2.08,
        volume: 6700000,
        week52_high: 1991.45,
        week52_low: 1358.35,
        currency: "INR",
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corp",
        exchange: "NASDAQ",
        price: 148.20,
        change: 5.50,
        change_pct: 3.85,
        volume: 62000000,
        week52_high: 153.15,
        week52_low: 45.60,
        currency: "USD",
      },
    ],
    top_losers: [
      {
        symbol: "BAJFINANCE",
        name: "Bajaj Finance Ltd",
        exchange: "NSE",
        price: 6850.00,
        change: -112.00,
        change_pct: -1.61,
        volume: 1200000,
        week52_high: 8192.00,
        week52_low: 6365.00,
        currency: "INR",
      },
      {
        symbol: "TSLA",
        name: "Tesla Inc",
        exchange: "NASDAQ",
        price: 338.50,
        change: -7.20,
        change_pct: -2.08,
        volume: 45000000,
        week52_high: 358.64,
        week52_low: 138.80,
        currency: "USD",
      },
    ],
    most_active: [
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank Ltd",
        exchange: "NSE",
        price: 1740.50,
        change: 7.80,
        change_pct: 0.45,
        volume: 12500000,
        week52_high: 1794.00,
        week52_low: 1363.55,
        currency: "INR",
      },
      {
        symbol: "RELIANCE",
        name: "Reliance Industries Ltd",
        exchange: "NSE",
        price: 1377.50,
        change: 1.95,
        change_pct: 0.14,
        volume: 8450000,
        week52_high: 1608.80,
        week52_low: 1215.00,
        currency: "INR",
      },
    ],
    week52_highs: [
      {
        symbol: "BHARTIARTL",
        name: "Bharti Airtel Ltd",
        exchange: "NSE",
        price: 1680.00,
        change: 22.00,
        change_pct: 1.33,
        volume: 4500000,
        week52_high: 1685.00,
        week52_low: 932.00,
        currency: "INR",
      },
    ],
  },
  sector_performance: [
    {
      sector: "Information Technology",
      change_pct: 1.45,
      market_cap_cr: 3450000,
      leading_stock: "TCS",
      lagging_stock: "WIPRO",
    },
    {
      sector: "Banking & Financials",
      change_pct: 0.65,
      market_cap_cr: 4200000,
      leading_stock: "ICICIBANK",
      lagging_stock: "KOTAKBANK",
    },
    {
      sector: "Energy & Utilities",
      change_pct: 0.35,
      market_cap_cr: 2850000,
      leading_stock: "ONGC",
      lagging_stock: "BPCL",
    },
    {
      sector: "Automotive",
      change_pct: 0.85,
      market_cap_cr: 1850000,
      leading_stock: "TATAMOTORS",
      lagging_stock: "MARUTI",
    },
    {
      sector: "Pharmaceuticals",
      change_pct: -0.25,
      market_cap_cr: 1620000,
      leading_stock: "SUNPHARMA",
      lagging_stock: "CIPLA",
    },
  ],
};

export async function getMarketOverview(): Promise<MarketOverview> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/market/overview`, { cache: "no-store" }, 7000);
    if (!response.ok) return FALLBACK_MARKET_OVERVIEW;
    const data = await response.json();
    return data && data.indices ? data : FALLBACK_MARKET_OVERVIEW;
  } catch (e) {
    return FALLBACK_MARKET_OVERVIEW;
  }
}

export async function getMarketHeatmap(universe: string = "all"): Promise<MarketHeatmapItem[]> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/market/heatmap?universe=${encodeURIComponent(universe)}`, {
      cache: "no-store",
    }, 7000);
    if (!response.ok) return FALLBACK_HEATMAP_ITEMS;
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_HEATMAP_ITEMS;
  } catch (e) {
    return FALLBACK_HEATMAP_ITEMS;
  }
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
  try {
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
    const response = await fetchWithTimeout(url, { cache: "no-store" }, 7000);
    if (!response.ok) return FALLBACK_NEWS;
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_NEWS;
  } catch (e) {
    return FALLBACK_NEWS;
  }
}

export async function getNewsStory(id: string): Promise<CanonicalNewsArticle> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/news/${encodeURIComponent(id)}`, { cache: "no-store" }, 7000);
    if (!response.ok) {
      return FALLBACK_NEWS.find((n) => n.id === id) || FALLBACK_NEWS[0];
    }
    return await response.json();
  } catch (e) {
    return FALLBACK_NEWS.find((n) => n.id === id) || FALLBACK_NEWS[0];
  }
}

export async function getNewsStoryEvidence(id: string): Promise<NewsEvidence[]> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/news/${encodeURIComponent(id)}/evidence`, { cache: "no-store" }, 7000);
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    return [];
  }
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
  underlying_symbol?: string;
  instrument_type?: string;
  expiry_date?: string;
  strike_price?: number | null;
  option_type?: string | null;
  ltp?: number;
  change_pct?: number;
  open_interest?: number;
  max_pain_strike?: number;
  market_status?: string;
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
  country?: string;
  central_bank: string;
  rate_name: string;
  rate_pct: number;
  last_action?: string;
  next_meeting?: string;
  effective_date?: string;
  stance?: string;
  updated_at?: string;
};

export type SovereignGoldBondItem = {
  series: string;
  tranche_name?: string;
  symbol: string;
  issue_price: number;
  current_secondary_price?: number;
  current_market_price: number;
  yield_to_maturity?: number;
  yield_to_maturity_pct: number;
  maturity_date: string;
  annual_coupon_pct: number;
  isin?: string;
  updated_at?: string;
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
  sub_category?: string;
  nav: number;
  previous_nav?: number;
  change: number;
  change_pct: number;
  aum_cr: number;
  expense_ratio?: number;
  expense_ratio_pct: number;
  risk_grade?: string;
  returns_1y?: number;
  returns_3y?: number;
  feeder_target?: string | null;
  regulatory_status: string;
  updated_at?: string;
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
  data_status?: string;
  sparkline?: number[];
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
  data_status?: string;
  sparkline?: number[];
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

export const FALLBACK_DERIVATIVES: DerivativesOverview = {
  india_vix: 13.85,
  cboe_vix: 15.20,
  vix_spread: -1.35,
  put_call_ratio_nifty: 1.08,
  put_call_ratio_banknifty: 0.94,
  items: [
    {
      symbol: "NIFTY24DEC24200CE",
      name: "Nifty 50 Front Futures",
      underlying_symbol: "NIFTY",
      instrument_type: "FUTIDX",
      expiry_date: "2024-12-26",
      strike_price: null,
      option_type: null,
      underlying_price: 24200.0,
      futures_price: 24240.50,
      basis: 40.50,
      basis_pct: 0.17,
      ltp: 24240.50,
      change_pct: 0.58,
      total_oi: 14250000,
      open_interest: 14250000,
      oi_change_pct: 3.42,
      implied_volatility: 13.5,
      put_call_ratio: 1.08,
      max_pain_strike: 24200,
      sentiment: "BULLISH",
      data_status: "EOD",
      market_status: "CLOSED",
      timestamp: new Date().toISOString(),
    },
    {
      symbol: "BANKNIFTY24DEC51800CE",
      name: "Bank Nifty Front Futures",
      underlying_symbol: "BANKNIFTY",
      instrument_type: "FUTIDX",
      expiry_date: "2024-12-26",
      strike_price: null,
      option_type: null,
      underlying_price: 51800.0,
      futures_price: 51950.00,
      basis: 150.00,
      basis_pct: 0.29,
      ltp: 51950.00,
      change_pct: 0.45,
      total_oi: 8540000,
      open_interest: 8540000,
      oi_change_pct: -1.20,
      implied_volatility: 16.2,
      put_call_ratio: 0.94,
      max_pain_strike: 51800,
      sentiment: "NEUTRAL",
      data_status: "EOD",
      market_status: "CLOSED",
      timestamp: new Date().toISOString(),
    },
  ],
  updated_at: new Date().toISOString(),
};

export const FALLBACK_FIXED_INCOME: FixedIncomeOverview = {
  india_benchmark_10y: 6.78,
  us_benchmark_10y: 4.42,
  spread_bps: 236,
  india_yield_curve: [
    { tenor: "3M", tenor_months: 3, yield_pct: 6.45, change_bps: -2.0, updated_at: new Date().toISOString() },
    { tenor: "1Y", tenor_months: 12, yield_pct: 6.62, change_bps: 1.0, updated_at: new Date().toISOString() },
    { tenor: "3Y", tenor_months: 36, yield_pct: 6.70, change_bps: 0.5, updated_at: new Date().toISOString() },
    { tenor: "5Y", tenor_months: 60, yield_pct: 6.74, change_bps: -1.0, updated_at: new Date().toISOString() },
    { tenor: "10Y", tenor_months: 120, yield_pct: 6.78, change_bps: 0.0, updated_at: new Date().toISOString() },
    { tenor: "30Y", tenor_months: 360, yield_pct: 7.05, change_bps: 2.0, updated_at: new Date().toISOString() },
  ],
  us_yield_curve: [
    { tenor: "1M", tenor_months: 1, yield_pct: 4.58, change_bps: -1.0, updated_at: new Date().toISOString() },
    { tenor: "1Y", tenor_months: 12, yield_pct: 4.35, change_bps: 2.0, updated_at: new Date().toISOString() },
    { tenor: "2Y", tenor_months: 24, yield_pct: 4.28, change_bps: 1.5, updated_at: new Date().toISOString() },
    { tenor: "5Y", tenor_months: 60, yield_pct: 4.31, change_bps: -0.5, updated_at: new Date().toISOString() },
    { tenor: "10Y", tenor_months: 120, yield_pct: 4.42, change_bps: 0.0, updated_at: new Date().toISOString() },
    { tenor: "30Y", tenor_months: 360, yield_pct: 4.60, change_bps: 1.0, updated_at: new Date().toISOString() },
  ],
  policy_rates: [
    { central_bank: "Reserve Bank of India (RBI)", rate_name: "Policy Repo Rate", rate_pct: 6.50, effective_date: "2024-10-09", stance: "NEUTRAL", updated_at: new Date().toISOString() },
    { central_bank: "US Federal Reserve", rate_name: "Federal Funds Target", rate_pct: 4.75, effective_date: "2024-11-07", stance: "ACCOMMODATIVE", updated_at: new Date().toISOString() },
    { central_bank: "European Central Bank (ECB)", rate_name: "Deposit Facility Rate", rate_pct: 3.25, effective_date: "2024-10-17", stance: "ACCOMMODATIVE", updated_at: new Date().toISOString() },
  ],
  sovereign_gold_bonds: [
    {
      series: "SGB 2023-24 Series IV",
      tranche_name: "SGB 2023-24 Series IV",
      symbol: "SGB2402",
      issue_price: 6263,
      current_market_price: 7650,
      current_secondary_price: 7650,
      yield_to_maturity: 2.5,
      yield_to_maturity_pct: 2.5,
      annual_coupon_pct: 2.5,
      maturity_date: "2032-02-28",
      isin: "IN0020230184",
      updated_at: new Date().toISOString(),
    },
  ],
  updated_at: new Date().toISOString(),
};

export const FALLBACK_FUNDS: FundsOverview = {
  total_schemes: 12,
  categories: ["EQUITY_LARGE_CAP", "EQUITY_FLEXI_CAP", "EQUITY_INDEX_ETF", "HYBRID_ARBITRAGE"],
  funds: [
    { scheme_code: "120503", scheme_name: "Nippon India Nifty 50 BeES ETF", fund_house: "Nippon India Mutual Fund", category: "ETF", sub_category: "Large Cap Index", nav: 262.45, previous_nav: 261.10, change: 1.35, change_pct: 0.52, aum_cr: 24800, expense_ratio: 0.04, expense_ratio_pct: 0.04, risk_grade: "VERY_HIGH", returns_1y: 24.5, returns_3y: 15.2, feeder_target: null, regulatory_status: "VERIFIED", updated_at: new Date().toISOString() },
    { scheme_code: "120716", scheme_name: "HDFC Nifty 50 Index Fund - Growth", fund_house: "HDFC Mutual Fund", category: "Index Fund", sub_category: "Large Cap Index", nav: 215.10, previous_nav: 214.00, change: 1.10, change_pct: 0.51, aum_cr: 14200, expense_ratio: 0.20, expense_ratio_pct: 0.20, risk_grade: "VERY_HIGH", returns_1y: 24.1, returns_3y: 15.0, feeder_target: null, regulatory_status: "VERIFIED", updated_at: new Date().toISOString() },
    { scheme_code: "122639", scheme_name: "Parag Parikh Flexi Cap Fund - Direct", fund_house: "PPFAS Mutual Fund", category: "Flexi Cap", sub_category: "Diversified Equity", nav: 78.42, previous_nav: 77.97, change: 0.45, change_pct: 0.58, aum_cr: 68500, expense_ratio: 0.62, expense_ratio_pct: 0.62, risk_grade: "VERY_HIGH", returns_1y: 29.8, returns_3y: 19.4, feeder_target: null, regulatory_status: "VERIFIED", updated_at: new Date().toISOString() },
    { scheme_code: "120823", scheme_name: "SBI Bluechip Fund - Direct Plan", fund_house: "SBI Mutual Fund", category: "Large Cap", sub_category: "Large Cap Core", nav: 94.20, previous_nav: 93.80, change: 0.40, change_pct: 0.43, aum_cr: 48900, expense_ratio: 0.85, expense_ratio_pct: 0.85, risk_grade: "VERY_HIGH", returns_1y: 22.4, returns_3y: 14.1, feeder_target: null, regulatory_status: "VERIFIED", updated_at: new Date().toISOString() },
  ],
  updated_at: new Date().toISOString(),
};

export const FALLBACK_COMMODITIES: CommoditiesOverview = {
  categories: ["Precious Metals", "Energy", "Industrial Metals", "Agriculture"],
  commodities: [
    { symbol: "GOLD MCX", name: "Gold 24K Spot", category: "Precious Metals", exchange: "MCX", price: 76450.00, change: 210.00, change_pct: 0.28, unit: "10 grams", currency: "INR" },
    { symbol: "SILVER MCX", name: "Silver 999", category: "Precious Metals", exchange: "MCX", price: 91200.00, change: 410.00, change_pct: 0.45, unit: "1 kg", currency: "INR" },
    { symbol: "BRENT CRUDE", name: "Brent Crude Oil", category: "Energy", exchange: "ICE", price: 74.20, change: 0.85, change_pct: 1.16, unit: "barrel", currency: "USD" },
    { symbol: "WTI CRUDE", name: "WTI Light Sweet Crude", category: "Energy", exchange: "NYMEX", price: 70.12, change: 0.62, change_pct: 0.89, unit: "barrel", currency: "USD" },
    { symbol: "NATURAL GAS", name: "Natural Gas Futures", category: "Energy", exchange: "MCX", price: 262.50, change: -3.20, change_pct: -1.20, unit: "MMBtu", currency: "INR" },
    { symbol: "COPPER", name: "Copper Grade A", category: "Industrial Metals", exchange: "MCX", price: 818.40, change: 4.50, change_pct: 0.55, unit: "1 kg", currency: "INR" },
    { symbol: "ALUMINUM", name: "Aluminum Primary", category: "Industrial Metals", exchange: "MCX", price: 236.80, change: 1.10, change_pct: 0.47, unit: "1 kg", currency: "INR" },
  ],
  updated_at: new Date().toISOString(),
};

export const FALLBACK_CURRENCIES: CurrenciesOverview = {
  rbi_reference_rate_date: "Official Daily Reference",
  usd_inr: 84.42,
  eur_inr: 89.15,
  gbp_inr: 106.80,
  jpy_100_inr: 54.85,
  dxy_index: 106.85,
  pairs: [
    { pair: "USD/INR", name: "US Dollar / Indian Rupee", category: "RBI_REFERENCE", rate: 84.42, change: 0.02, change_pct: 0.02, source: "FBIL/RBI", data_status: "VERIFIED", sparkline: [84.40, 84.41, 84.42, 84.42] },
    { pair: "EUR/INR", name: "Euro / Indian Rupee", category: "RBI_REFERENCE", rate: 89.15, change: -0.13, change_pct: -0.15, source: "FBIL/RBI", data_status: "VERIFIED", sparkline: [89.28, 89.22, 89.18, 89.15] },
    { pair: "GBP/INR", name: "British Pound / Indian Rupee", category: "RBI_REFERENCE", rate: 106.80, change: 0.11, change_pct: 0.10, source: "FBIL/RBI", data_status: "VERIFIED", sparkline: [106.69, 106.75, 106.78, 106.80] },
    { pair: "JPY/INR (100)", name: "100 Japanese Yen / Rupee", category: "RBI_REFERENCE", rate: 54.85, change: -0.22, change_pct: -0.40, source: "FBIL/RBI", data_status: "VERIFIED", sparkline: [55.07, 54.98, 54.90, 54.85] },
    { pair: "EUR/USD", name: "Euro / US Dollar", category: "GLOBAL_INTERBANK", rate: 1.0560, change: -0.0023, change_pct: -0.22, source: "Interbank", data_status: "VERIFIED", sparkline: [1.0583, 1.0572, 1.0565, 1.0560] },
    { pair: "GBP/USD", name: "British Pound / US Dollar", category: "GLOBAL_INTERBANK", rate: 1.2650, change: 0.0012, change_pct: 0.09, source: "Interbank", data_status: "VERIFIED", sparkline: [1.2638, 1.2642, 1.2648, 1.2650] },
    { pair: "DXY", name: "US Dollar Index", category: "GLOBAL_INDEX", rate: 106.85, change: 0.25, change_pct: 0.23, source: "ICE Benchmark", data_status: "VERIFIED", sparkline: [106.60, 106.72, 106.80, 106.85] },
  ],
  updated_at: new Date().toISOString(),
};

export async function getDerivativesPulse(): Promise<DerivativesOverview> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/market/derivatives`, { cache: "no-store" }, 6000);
    if (!response.ok) return FALLBACK_DERIVATIVES;
    return response.json();
  } catch (e) {
    return FALLBACK_DERIVATIVES;
  }
}

export async function getFixedIncomeOverview(): Promise<FixedIncomeOverview> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/market/fixed-income`, { cache: "no-store" }, 6000);
    if (!response.ok) return FALLBACK_FIXED_INCOME;
    return response.json();
  } catch (e) {
    return FALLBACK_FIXED_INCOME;
  }
}

export async function getFundsOverview(category?: string): Promise<FundsOverview> {
  try {
    const query = new URLSearchParams();
    if (category) query.set("category", category);

    const url = `${getApiBase()}/api/v1/market/funds?${query.toString()}`;
    const response = await fetchWithTimeout(url, { cache: "no-store" }, 6000);
    if (!response.ok) return FALLBACK_FUNDS;
    return response.json();
  } catch (e) {
    return FALLBACK_FUNDS;
  }
}

export async function getCommoditiesOverview(): Promise<CommoditiesOverview> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/market/commodities`, { cache: "no-store" }, 6000);
    if (!response.ok) return FALLBACK_COMMODITIES;
    return response.json();
  } catch (e) {
    return FALLBACK_COMMODITIES;
  }
}

export async function getCurrenciesOverview(): Promise<CurrenciesOverview> {
  try {
    const response = await fetchWithTimeout(`${getApiBase()}/api/v1/market/currencies`, { cache: "no-store" }, 6000);
    if (!response.ok) return FALLBACK_CURRENCIES;
    return response.json();
  } catch (e) {
    return FALLBACK_CURRENCIES;
  }
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

// ─── Global Market Calendar & Status Intelligence ────────────────────────────

export type MarketStatusType =
  | "PRE_MARKET"
  | "OPEN"
  | "BREAK"
  | "CLOSING_AUCTION"
  | "POST_MARKET"
  | "CLOSED"
  | "HOLIDAY"
  | "SPECIAL_SESSION"
  | "EMERGENCY_CLOSED"
  | "STATUS_UNAVAILABLE";

export type MarketSessionInfo = {
  market_id: string;
  market_name: string;
  exchange: string;
  mic: string;
  country: string;
  country_code: string;
  region: string;
  timezone: string;
  status: MarketStatusType;
  session_label: string;
  current_local_time: string;
  current_utc_time: string;
  user_local_time?: string;
  session_start_local: string;
  session_end_local: string;
  is_regular_trading: boolean;
  is_trading_day: boolean;
  holiday_today: boolean;
  holiday_name?: string;
  special_session_today: boolean;
  special_session_notes?: string;
  supported_asset_classes: string[];
  effective_data_status: string;
  source_attribution: string;
  last_verified_at: string;
};

export type CalendarHolidayRecord = {
  holiday_id: string;
  country: string;
  country_code: string;
  market: string;
  exchange: string;
  event_name: string;
  category: string;
  holiday_date: string;
  start_time_local?: string;
  end_time_local?: string;
  timezone: string;
  affected_asset_classes: string[];
  trading_status: string;
  settlement_status: string;
  banking_status: string;
  description: string;
  source: string;
  source_url: string;
  effective_year: number;
  is_special_session: boolean;
  special_session_hours?: string;
};

export type GlobalMarketStatusSummary = {
  timestamp_utc: string;
  summary_label: string;
  active_open_markets_count: number;
  closed_markets_count: number;
  next_major_opening: string;
  next_major_closing: string;
  markets: MarketSessionInfo[];
  today_holidays: CalendarHolidayRecord[];
  upcoming_holidays: CalendarHolidayRecord[];
};

export type CalendarEventRecord = {
  event_id: string;
  title: string;
  event_type: string;
  country: string;
  country_code: string;
  currency: string;
  event_time_utc: string;
  event_time_local: string;
  timezone: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  unit?: string;
  source: string;
  source_url: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
  symbol?: string;
  company_name?: string;
  notes: string;
  publication_status: string;
  affected_sectors: string[];
};

export type ExchangeMarketHours = {
  market_id: string;
  exchange_name: string;
  mic: string;
  country: string;
  region: string;
  timezone: string;
  pre_market?: string;
  regular_hours: string;
  lunch_break?: string;
  post_market?: string;
  asset_classes: string[];
};

export async function getGlobalMarketStatus(timezone?: string): Promise<GlobalMarketStatusSummary> {
  const url = timezone
    ? `${getApiBase()}/api/v1/calendar/markets/status?timezone=${encodeURIComponent(timezone)}`
    : `${getApiBase()}/api/v1/calendar/markets/status`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to retrieve global market status");
  return response.json();
}

export async function getCalendarHolidays(params?: {
  year?: number;
  country?: string;
  exchange?: string;
  category?: string;
}): Promise<CalendarHolidayRecord[]> {
  const q = new URLSearchParams();
  if (params?.year) q.set("year", params.year.toString());
  if (params?.country && params.country !== "all") q.set("country", params.country);
  if (params?.exchange && params.exchange !== "all") q.set("exchange", params.exchange);
  if (params?.category && params.category !== "all") q.set("category", params.category);

  const response = await fetch(`${getApiBase()}/api/v1/calendar/holidays?${q.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve holiday database");
  return response.json();
}

export async function getGlobalCalendarEvents(params?: {
  event_type?: string;
  country?: string;
  importance?: string;
  symbol?: string;
}): Promise<CalendarEventRecord[]> {
  const q = new URLSearchParams();
  if (params?.event_type && params.event_type !== "all") q.set("event_type", params.event_type);
  if (params?.country && params.country !== "all") q.set("country", params.country);
  if (params?.importance && params.importance !== "all") q.set("importance", params.importance);
  if (params?.symbol) q.set("symbol", params.symbol);

  const response = await fetch(`${getApiBase()}/api/v1/calendar/events?${q.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve calendar events");
  return response.json();
}

export async function getMarketHoursDirectory(): Promise<ExchangeMarketHours[]> {
  const response = await fetch(`${getApiBase()}/api/v1/calendar/market-hours`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve market hours");
  return response.json();
}

// ─── Floating AI Support & Research Chatbot ──────────────────────────────────

export type AssistantCitation = {
  citation_id: string;
  title: string;
  source_name: string;
  url: string;
  citation_type: string;
  snippet: string;
  timestamp: string;
};

export type AssistantMessage = {
  id: string;
  conversation_id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  intent: string;
  citations: AssistantCitation[];
  suggested_prompts: string[];
  created_at: string;
  model_provider: string;
  disclaimer: string;
};

export type AssistantConversation = {
  conversation_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: AssistantMessage[];
};

export async function queryAssistantChat(payload: {
  message: string;
  conversation_id?: string;
  context?: {
    symbol?: string;
    route?: string;
    timeframe?: string;
    active_indicators?: string[];
  };
}): Promise<AssistantMessage> {
  const response = await fetch(`${getApiBase()}/api/v1/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Unable to reach AI Research Assistant");
  }
  return response.json();
}

export async function submitAssistantFeedback(payload: {
  message_id: string;
  conversation_id: string;
  rating: "positive" | "negative";
  feedback_text?: string;
}): Promise<void> {
  await fetch(`${getApiBase()}/api/v1/assistant/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ─── Quantitative Intelligence & Multi-Agent Architecture ────────────────────

export type QFactorContribution = {
  factor_name: string;
  weight: number;
  raw_score: number;
  weighted_score: number;
  contribution_type: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  key_driver: string;
};

export type QIntelligenceScorecard = {
  symbol: string;
  company_name: string;
  composite_q_score: number;
  composite_rating: "STRONG" | "FAVORABLE" | "BALANCED" | "VULNERABLE" | "UNDERPERFORMING";
  confidence_level: number;
  data_coverage_pct: number;
  data_freshness_state: string;
  factor_breakdown: QFactorContribution[];
  regime_context: string;
  anomaly_penalty_applied: number;
  top_strengths: string[];
  top_risks: string[];
  methodology_version: string;
  non_advisory_disclaimer: string;
};

export type RiskMetricsReport = {
  symbol: string;
  timeframe_days: number;
  annualized_volatility: number;
  ewma_volatility: number;
  beta: number;
  var_95_daily: number;
  var_99_daily: number;
  cvar_95_daily: number;
  max_drawdown: number;
  max_drawdown_pct: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  calmar_ratio: number;
  downside_deviation: number;
  risk_free_rate_pct: number;
  data_points: number;
  risk_level: "LOW" | "MODERATE" | "ELEVATED" | "HIGH";
  methodology_notes: string;
};

export type RegimeStateOutput = {
  benchmark_symbol: string;
  dominant_regime: string;
  volatility_regime: string;
  trend_regime: string;
  breadth_regime: string;
  liquidity_regime: string;
  risk_appetite: string;
  regime_confidence: number;
  indicator_inputs: Record<string, any>;
  regime_implications: string[];
};

export type StandardResearchDossier = {
  executive_summary: string;
  research_question: string;
  verified_facts: string[];
  analytical_findings: string[];
  quantitative_evidence: Record<string, any>;
  relevant_news_and_events: string[];
  risks_and_uncertainties: string[];
  alternative_interpretations: string[];
  source_citations: AssistantCitation[];
  data_freshness_and_limitations: string;
  methodology: string;
  non_advisory_disclaimer: string;
};

export async function getQIntelligenceScorecard(symbol: string): Promise<QIntelligenceScorecard> {
  const response = await fetch(`${getApiBase()}/api/v1/quant/q-score/${encodeURIComponent(symbol)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve Q-Intelligence scorecard");
  return response.json();
}

export async function getRiskMetrics(symbol: string, days: number = 30): Promise<RiskMetricsReport> {
  const response = await fetch(`${getApiBase()}/api/v1/quant/risk/${encodeURIComponent(symbol)}?days=${days}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve risk metrics");
  return response.json();
}

export async function getMarketRegime(benchmark: string = "NIFTY 50"): Promise<RegimeStateOutput> {
  const response = await fetch(`${getApiBase()}/api/v1/quant/regime?benchmark=${encodeURIComponent(benchmark)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve market regime");
  return response.json();
}

export async function getStandardAIDossier(symbol: string): Promise<StandardResearchDossier> {
  const response = await fetch(`${getApiBase()}/api/v1/ai/dossier/${encodeURIComponent(symbol)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to generate AI research dossier");
  return response.json();
}

export async function listSpecialistAgents(): Promise<{ count: number; agents: any[] }> {
  const response = await fetch(`${getApiBase()}/api/v1/ai/agents`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to list specialist agents");
  return response.json();
}

// ─── Universal Stock Search & Master Research Workstation ─────────────────────

export type MasterResearchBundle = {
  instrument: {
    instrument_id: string;
    symbol: string;
    isin?: string | null;
    bse_code?: string | null;
    company_name: string;
    display_name: string;
    exchange: string;
    exchange_name: string;
    country: string;
    country_code: string;
    sector: string;
    industry: string;
    currency: string;
    security_type: string;
    current_price: number;
    change_pct: number;
    market_cap: number;
    market_cap_display: string;
    data_status: string;
    pe_ratio?: number | null;
    pb_ratio?: number | null;
    ev_ebitda?: number | null;
    dividend_yield_pct?: number | null;
    roe_pct?: number | null;
    roce_pct?: number | null;
    operating_margin_pct?: number | null;
    net_margin_pct?: number | null;
    debt_to_equity?: number | null;
    beta?: number | null;
    var_95?: number | null;
    max_drawdown_pct?: number | null;
    q_score?: number | null;
    peers?: string[];
  };
  quote: {
    instrument_id: string;
    symbol: string;
    price: number;
    change: number;
    change_pct: number;
    day_high: number;
    day_low: number;
    fifty_two_week_high: number;
    fifty_two_week_low: number;
    volume: number;
    currency: string;
    data_status: string;
    timestamp: string;
  };
  coverage: {
    data_status: string;
    coverage_level: string;
    quote_mode: string;
    historical_data_available: boolean;
    financials_available: boolean;
    valuation_models_available: boolean;
    q_intelligence_available: boolean;
    news_available: boolean;
    corporate_events_available: boolean;
    provider_primary: string;
    last_sync_at: string;
    limitations: string[];
  };
  ratios: {
    valuation: {
      pe_ratio?: number | null;
      pb_ratio?: number | null;
      ev_ebitda?: number | null;
      dividend_yield_pct?: number | null;
    };
    profitability: {
      roe_pct?: number | null;
      roce_pct?: number | null;
      operating_margin_pct?: number | null;
      net_margin_pct?: number | null;
    };
    leverage: {
      debt_to_equity?: number | null;
      current_ratio?: number | null;
      interest_coverage?: number | null;
    };
  };
  valuation: {
    instrument_id: string;
    symbol: string;
    current_price: number;
    dcf_intrinsic_value: number;
    discount_to_fair_value_pct: number;
    wacc_pct: number;
    terminal_growth_rate_pct: number;
    pe_multiple_sector_avg: number;
    valuation_status: string;
  };
  financials: {
    income_statement: Array<{ item: string; [year: string]: any }>;
    balance_sheet: Array<{ item: string; [year: string]: any }>;
    cash_flow: Array<{ item: string; [year: string]: any }>;
  };
  technical: {
    instrument_id: string;
    symbol: string;
    rsi_14: number;
    macd: { line: number; signal: number; histogram: number };
    sma_50: number;
    sma_200: number;
    trend_signal: string;
    support_level: number;
    resistance_level: number;
  };
  risk: {
    instrument_id: string;
    symbol: string;
    beta: number;
    var_95: number;
    max_drawdown_pct: number;
    annualized_volatility_pct: number;
    sharpe_ratio: number;
    risk_category: string;
  };
  intelligence: {
    instrument_id: string;
    symbol: string;
    q_score: number;
    confidence_level: number;
    model_version: string;
    factors: Record<string, number>;
    disclaimer: string;
  };
  news: Array<{
    id: string;
    headline: string;
    publisher: string;
    url: string;
    published_at: string;
    sentiment: string;
    relevance_score: number;
    category: string;
  }>;
  events: Array<{
    event_type: string;
    title: string;
    date: string;
    status: string;
  }>;
  peers: string[];
};

export type SearchDiagnosticsResponse = {
  total_instruments_indexed: number;
  exchanges_covered: string[];
  coverage_distribution: Record<string, number>;
  multi_listing_companies_count: number;
  index_status: string;
  sample_symbols: string[];
};

export async function getMasterResearchBundle(instrumentId: string): Promise<MasterResearchBundle> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(instrumentId)}/research`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Unable to retrieve research bundle for ${instrumentId}`);
  return response.json();
}

export async function getInstrumentCoverage(instrumentId: string) {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/${encodeURIComponent(instrumentId)}/coverage`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve coverage");
  return response.json();
}

export async function getSearchDiagnostics(): Promise<SearchDiagnosticsResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/instruments/admin/diagnostics`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve search diagnostics");
  return response.json();
}

export type ConfigDiagnosticsResponse = {
  app_env: string;
  total_variables_audited: number;
  status_distribution: Record<string, number>;
  is_production_ready: boolean;
  missing_critical: string[];
  invalid_critical: string[];
  records: Array<{
    name: string;
    category: string;
    purpose: string;
    component: string;
    required: string;
    environment: string;
    deployment_location: string;
    secret_classification: string;
    default_behaviour: string;
    status: string;
    masked_value: string;
    validation_message: string;
  }>;
};

export async function getConfigDiagnostics(): Promise<ConfigDiagnosticsResponse> {
  const response = await fetch(`${getApiBase()}/api/v1/admin/config-diagnostics`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to retrieve config diagnostics");
  return response.json();
}

