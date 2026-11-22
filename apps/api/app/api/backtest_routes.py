"""
MarketScope.io — Quantitative Backtesting & Paper Trading API Routes
Provides endpoints for strategy backtests, virtual order execution, and paper portfolio tracking.
"""

from fastapi import APIRouter, HTTPException, status
from app.engine.backtest_engine import (
    backtest_engine,
    BacktestRequest,
    BacktestResponse,
)
from app.engine.paper_trading_engine import (
    paper_trading_engine,
    PaperOrderRequest,
    PaperOrder,
    PaperPortfolioResponse,
)

backtest_router = APIRouter(prefix="", tags=["Quantitative Backtesting & Paper Simulation"])


@backtest_router.post(
    "/backtest/run",
    response_model=BacktestResponse,
    summary="Execute Quantitative Strategy Backtest",
)
def run_strategy_backtest(payload: BacktestRequest):
    """Executes a rule-based deterministic backtest across historical candles with zero lookahead."""
    try:
        return backtest_engine.run_backtest(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@backtest_router.get(
    "/paper-trading/portfolio",
    response_model=PaperPortfolioResponse,
    summary="Get Virtual Paper Trading Portfolio",
)
def get_paper_portfolio():
    """Returns user's virtual paper cash, open positions, unrealized P&L, and order history."""
    return paper_trading_engine.get_portfolio()


@backtest_router.post(
    "/paper-trading/orders",
    response_model=PaperOrder,
    status_code=status.HTTP_201_CREATED,
    summary="Place Simulated Paper Trading Order",
)
def place_paper_order(payload: PaperOrderRequest):
    """Executes a simulated market or limit order with realistic fees and portfolio updates."""
    try:
        return paper_trading_engine.execute_order(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@backtest_router.post(
    "/paper-trading/reset",
    summary="Reset Virtual Paper Account",
)
def reset_paper_account():
    """Resets virtual paper trading account back to ₹10,00,000 cash and clears positions."""
    paper_trading_engine.reset_account()
    return {"status": "success", "message": "Paper account reset to ₹10,00,000 initial cash"}
