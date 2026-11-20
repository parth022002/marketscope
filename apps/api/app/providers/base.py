from typing import Protocol
from app.domain.schemas import InstrumentSummary, DossierResponse


class MarketDataProvider(Protocol):
    provider_name: str

    def search_instruments(self, query: str) -> list[InstrumentSummary]: ...
    def get_dossier(self, instrument_id: str) -> DossierResponse | None: ...
