"""
MarketScope.io — Derivatives & Market Flow Intelligence API Routes
Provides endpoints for Option Chains, Greeks, PCR, Max Pain, Futures Build-Up, and Market Breadth.
"""

from fastapi import APIRouter, Query
from app.engine.derivatives_engine import (
    derivatives_engine,
    OptionChainResponse,
    FuturesBuildupItem,
)
from app.engine.market_flow_engine import (
    market_flow_engine,
    MarketFlowResponse,
)

derivatives_router = APIRouter(prefix="", tags=["Derivatives & Market Intelligence"])


@derivatives_router.get(
    "/derivatives/option-chain",
    response_model=OptionChainResponse,
    summary="Get Option Chain with Greeks and Max Pain",
)
def get_option_chain(symbol: str = Query("NIFTY", description="Underlying symbol (e.g. NIFTY, BANKNIFTY, RELIANCE)")):
    """Returns real-time strike-level option chain, PCR, Max Pain, and Black-Scholes Greeks."""
    return derivatives_engine.get_option_chain(symbol)


@derivatives_router.get(
    "/derivatives/futures-buildup",
    response_model=list[FuturesBuildupItem],
    summary="Get Futures Open Interest Build-Up Classification",
)
def get_futures_buildup():
    """Returns 4-quadrant futures build-up analysis across major benchmark and stock contracts."""
    return derivatives_engine.get_futures_buildup()


@derivatives_router.get(
    "/market/flow-intelligence",
    response_model=MarketFlowResponse,
    summary="Get Market Breadth, Sector Relative Strength & Setup Radar",
)
def get_market_flow_intelligence():
    """Returns advance/decline breadth, sector Mansfield relative strength, and quantitative setup radar."""
    return market_flow_engine.get_market_flow()
