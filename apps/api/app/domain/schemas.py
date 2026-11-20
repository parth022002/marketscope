from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class InstrumentSummary(BaseModel):
    instrument_id: str
    symbol: str
    company_name: str
    exchange: str
    sector: str
    currency: str = "INR"
    data_status: str = "SYNTHETIC_DEMO"


class MetricValue(BaseModel):
    metric_id: str
    label: str
    value: float
    unit: str
    period: str
    formula_version: str
    data_status: str = "SYNTHETIC_DEMO"


class EvidenceReference(BaseModel):
    evidence_id: str
    source_name: str
    source_type: str
    published_at: str | None = None
    retrieved_at: str
    quality_status: str
    note: str


class DossierResponse(BaseModel):
    instrument: InstrumentSummary
    summary: str
    metrics: list[MetricValue] = Field(default_factory=list)
    evidence: list[EvidenceReference] = Field(default_factory=list)
    disclaimer: str


# ─── New Vertical Slice Schemas ───────────────────────────────────────────────

class InstrumentCandidate(BaseModel):
    instrument_id: str
    symbol: str
    company_name: str
    exchange_code: str
    instrument_type: str = "EQUITY"
    isin: str | None = None
    currency: str = "INR"
    listing_status: str = "ACTIVE"


class InstrumentResolveResponse(BaseModel):
    query: str
    resolved: bool
    requires_disambiguation: bool
    resolution_message: str
    instrument: InstrumentCandidate | None = None
    candidates: list[InstrumentCandidate] = Field(default_factory=list)


class MetricComponentInput(BaseModel):
    label: str
    value: float
    unit: str
    reporting_period: str
    source_filing: str


class MetricEvidenceDetail(BaseModel):
    metric_id: str
    label: str
    value: float
    unit: str
    period: str
    formula_expression: str
    formula_version: str
    quality_status: str
    components: list[MetricComponentInput] = Field(default_factory=list)
    evidence: list[EvidenceReference] = Field(default_factory=list)


class ResearchNoteCreate(BaseModel):
    instrument_id: str
    title: str = Field(min_length=1, max_length=200)
    thesis: str = Field(default="", max_length=10000)
    counterpoints: str = Field(default="", max_length=10000)
    open_questions: list[str] = Field(default_factory=list)


class ResearchNoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    thesis: str | None = None
    counterpoints: str | None = None
    open_questions: list[str] | None = None


class ResearchNoteResponse(BaseModel):
    id: str
    workspace_id: str
    instrument_id: str
    author_user_id: str | None = None
    title: str
    thesis: str | None = None
    counterpoints: str | None = None
    open_questions: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


# ─── Phase 2 & 3 Schemas ──────────────────────────────────────────────────────

class StatementLineItem(BaseModel):
    line_item: str
    fy22: float | None = None
    fy23: float | None = None
    fy24: float | None = None
    q1: float | None = None
    q2: float | None = None
    q3: float | None = None
    q4: float | None = None
    unit: str = "INR Cr"


class FinancialStatementsResponse(BaseModel):
    symbol: str
    company_name: str
    statement_type: str  # "income_statement" | "balance_sheet" | "cash_flow"
    period_type: str     # "annual" | "quarterly"
    reporting_basis: str # "CONSOLIDATED" | "STANDALONE"
    periods: list[str]
    items: list[StatementLineItem]
    audit_status: str = "AUDITED_IND_AS"


class CompanyRatiosResponse(BaseModel):
    symbol: str
    company_name: str
    sector: str
    valuation: dict[str, float | None]
    profitability: dict[str, float | None]
    solvency: dict[str, float | None]
    cash_flow: dict[str, float | None]


class PeerComparisonItem(BaseModel):
    symbol: str
    company_name: str
    sector: str
    market_cap: float
    current_price: float
    pe_ratio: float | None
    pb_ratio: float
    roe: float
    roce: float
    debt_to_equity: float
    operating_margin: float
    fcf: float


class PeerComparisonResponse(BaseModel):
    target_symbol: str
    sector: str
    peers: list[PeerComparisonItem]
    alignment_warnings: list[str] = Field(default_factory=list)


class ScreenerCriteria(BaseModel):
    sector: str | None = None
    min_market_cap: float | None = None
    min_roe: float | None = None
    max_pe: float | None = None
    max_debt_equity: float | None = None
    min_opm: float | None = None


class ScreenerResultItem(BaseModel):
    symbol: str
    company_name: str
    sector: str
    market_cap: float
    pe_ratio: float | None
    roe: float
    debt_to_equity: float
    operating_margin: float


class ScreenerResponse(BaseModel):
    count: int
    results: list[ScreenerResultItem]
    applied_criteria: ScreenerCriteria


class WatchlistItemResponse(BaseModel):
    id: str
    watchlist_id: str
    instrument_id: str
    symbol: str
    company_name: str
    added_at: datetime


class WatchlistCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=500)


class WatchlistResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    description: str | None = None
    created_at: datetime
    items: list[WatchlistItemResponse] = Field(default_factory=list)


class WatchlistItemCreate(BaseModel):
    symbol: str
    notes: str = ""


class ResearchSnapshotCreate(BaseModel):
    instrument_id: str
    snapshot_label: str = Field(min_length=1, max_length=150)
    thesis: str = ""


class ResearchSnapshotResponse(BaseModel):
    id: str
    workspace_id: str
    instrument_id: str
    snapshot_label: str
    data_as_of: datetime
    checksum: str
    is_valid: bool
    created_at: datetime
    payload: dict[str, Any]


# ─── Phase 4 Schemas: Freshness & DPDP Compliance ─────────────────────────────

class DataFreshnessResponse(BaseModel):
    symbol: str
    exchange: str
    currency: str
    market_status: str
    quote_freshness: str
    filings_freshness: str
    staleness_score: float
    last_quote_time: datetime
    last_audit_time: str
    active_tier: str
    entitlements: list[str]


class DPDPDataExportRequest(BaseModel):
    workspace_id: str


class DPDPDataExportResponse(BaseModel):
    workspace_id: str
    exported_at: datetime
    notes_count: int
    snapshots_count: int
    watchlists_count: int
    data: dict[str, Any]


class DPDPPurgeRequest(BaseModel):
    workspace_id: str
    confirmation_phrase: str = Field(description="Must equal 'PURGE_ALL_DATA'")


class DPDPPurgeResponse(BaseModel):
    status: str
    message: str
    workspace_id: str
    purged_at: datetime
    records_deleted: dict[str, int]


