const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SERVER_API_BASE = process.env.API_INTERNAL_BASE_URL ?? API_BASE;
const getApiBase = () => (typeof window === "undefined" ? SERVER_API_BASE : API_BASE);

export const DEFAULT_WORKSPACE_ID = "11111111-1111-1111-1111-111111111111";

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
