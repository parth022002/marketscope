from datetime import datetime, timezone
from app.domain.schemas import (
    DossierResponse, EvidenceReference, InstrumentSummary, MetricValue
)

NOW = datetime.now(timezone.utc).isoformat()

_INSTRUMENTS = [
    InstrumentSummary(
        instrument_id="in-nse-reliance",
        symbol="RELIANCE",
        company_name="Reliance Industries Limited",
        exchange="NSE",
        sector="Energy / Retail / Digital Services",
    ),
    InstrumentSummary(
        instrument_id="in-nse-tcs",
        symbol="TCS",
        company_name="Tata Consultancy Services Limited",
        exchange="NSE",
        sector="Information Technology",
    ),
    InstrumentSummary(
        instrument_id="in-nse-infy",
        symbol="INFY",
        company_name="Infosys Limited",
        exchange="NSE",
        sector="Information Technology",
    ),
]

_METRICS = {
    "in-nse-reliance": [
        MetricValue(metric_id="revenue_growth", label="Revenue growth", value=8.4, unit="%", period="FY demo", formula_version="demo-1"),
        MetricValue(metric_id="roe", label="Return on equity", value=9.8, unit="%", period="FY demo", formula_version="demo-1"),
        MetricValue(metric_id="debt_equity", label="Debt / equity", value=0.42, unit="x", period="FY demo", formula_version="demo-1"),
    ],
    "in-nse-tcs": [
        MetricValue(metric_id="revenue_growth", label="Revenue growth", value=6.1, unit="%", period="FY demo", formula_version="demo-1"),
        MetricValue(metric_id="roe", label="Return on equity", value=48.2, unit="%", period="FY demo", formula_version="demo-1"),
        MetricValue(metric_id="debt_equity", label="Debt / equity", value=0.08, unit="x", period="FY demo", formula_version="demo-1"),
    ],
    "in-nse-infy": [
        MetricValue(metric_id="revenue_growth", label="Revenue growth", value=4.7, unit="%", period="FY demo", formula_version="demo-1"),
        MetricValue(metric_id="roe", label="Return on equity", value=29.5, unit="%", period="FY demo", formula_version="demo-1"),
        MetricValue(metric_id="debt_equity", label="Debt / equity", value=0.12, unit="x", period="FY demo", formula_version="demo-1"),
    ],
}


class MockProvider:
    provider_name = "MockProvider"

    def search_instruments(self, query: str) -> list[InstrumentSummary]:
        q = query.casefold().strip()
        if not q:
            return []
        return [
            item for item in _INSTRUMENTS
            if q in item.symbol.casefold() or q in item.company_name.casefold()
        ]

    def get_dossier(self, instrument_id: str) -> DossierResponse | None:
        instrument = next((x for x in _INSTRUMENTS if x.instrument_id == instrument_id), None)
        if instrument is None:
            return None
        return DossierResponse(
            instrument=instrument,
            summary="Illustrative company dossier generated from local synthetic fixtures. Replace only with rights-cleared, validated source data.",
            metrics=_METRICS.get(instrument_id, []),
            evidence=[
                EvidenceReference(
                    evidence_id=f"demo-source-{instrument_id}",
                    source_name="MarketScope synthetic fixture",
                    source_type="SYNTHETIC",
                    published_at=None,
                    retrieved_at=NOW,
                    quality_status="DEMO_ONLY",
                    note="Not an external source and not suitable for investment decisions.",
                )
            ],
            disclaimer="Synthetic demo data only. Not current market data, investment advice or a recommendation.",
        )
