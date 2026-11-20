from fastapi import APIRouter, HTTPException, Query
from app.providers.mock_provider import MockProvider

router = APIRouter()
provider = MockProvider()


@router.get("/instruments/search")
def search_instruments(q: str = Query(min_length=1, max_length=80)):
    results = provider.search_instruments(q)
    return {"items": [item.model_dump() for item in results], "count": len(results)}


@router.get("/instruments/{instrument_id}/dossier")
def get_dossier(instrument_id: str):
    result = provider.get_dossier(instrument_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Instrument not found")
    return result.model_dump()
