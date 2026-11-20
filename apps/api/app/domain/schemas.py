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
