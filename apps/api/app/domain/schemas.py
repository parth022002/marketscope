from datetime import datetime
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
