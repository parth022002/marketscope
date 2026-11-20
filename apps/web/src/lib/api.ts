const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const SERVER_API_BASE = process.env.API_INTERNAL_BASE_URL ?? API_BASE;
const getApiBase = () => (typeof window === "undefined" ? SERVER_API_BASE : API_BASE);

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

export type Dossier = {
  instrument: Instrument;
  summary: string;
  metrics: Metric[];
  evidence: {
    evidence_id: string;
    source_name: string;
    source_type: string;
    published_at: string | null;
    retrieved_at: string;
    quality_status: string;
    note: string;
  }[];
  disclaimer: string;
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

export async function getDossier(id: string): Promise<Dossier> {
  const response = await fetch(
    `${getApiBase()}/api/v1/instruments/${encodeURIComponent(id)}/dossier`,
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Unable to load company dossier");
  return response.json() as Promise<Dossier>;
}
