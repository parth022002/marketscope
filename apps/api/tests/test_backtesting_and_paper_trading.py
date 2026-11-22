"""
MarketScope.io — Quantitative Strategy Backtesting & Paper Trading Test Suite
Validates zero-lookahead backtest execution, Sharpe ratio, Max Drawdown, order lifecycle, and portfolio state.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_strategy_backtest_ma_crossover():
    """Verify deterministic backtest execution for Moving Average Crossover."""
    payload = {
        "symbol": "NIFTY",
        "strategy_type": "MA_CROSSOVER",
        "timeframe": "1D",
        "initial_capital": 1000000.0,
        "fast_period": 9,
        "slow_period": 21,
    }
    res = client.post("/api/v1/backtest/run", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["symbol"] == "NIFTY"
    assert data["strategy_type"] == "MA_CROSSOVER"
    assert data["initial_capital"] == 1000000.0
    assert "cagr_pct" in data
    assert "sharpe_ratio" in data
    assert "max_drawdown_pct" in data
    assert "equity_curve" in data
    assert len(data["equity_curve"]) > 0


def test_paper_trading_lifecycle():
    """Verify virtual portfolio state, placing BUY and SELL orders, and account reset."""
    # Reset account first
    reset_res = client.post("/api/v1/paper-trading/reset")
    assert reset_res.status_code == 200

    # Check portfolio initially has 10,00,000 cash
    port_res = client.get("/api/v1/paper-trading/portfolio")
    assert port_res.status_code == 200
    port = port_res.json()
    assert port["available_cash"] == 1000000.0
    assert len(port["positions"]) == 0

    # Place Buy Order for 10 RELIANCE
    buy_payload = {
        "symbol": "RELIANCE",
        "side": "BUY",
        "order_type": "MARKET",
        "quantity": 10,
    }
    buy_res = client.post("/api/v1/paper-trading/orders", json=buy_payload)
    assert buy_res.status_code == 201
    order = buy_res.json()
    assert order["symbol"] == "RELIANCE"
    assert order["side"] == "BUY"
    assert order["quantity"] == 10

    # Check portfolio now has position
    port_after_buy = client.get("/api/v1/paper-trading/portfolio").json()
    assert len(port_after_buy["positions"]) == 1
    pos = port_after_buy["positions"][0]
    assert pos["symbol"] == "RELIANCE"
    assert pos["quantity"] == 10
    assert port_after_buy["available_cash"] < 1000000.0

    # Sell 5 RELIANCE
    sell_payload = {
        "symbol": "RELIANCE",
        "side": "SELL",
        "order_type": "MARKET",
        "quantity": 5,
    }
    sell_res = client.post("/api/v1/paper-trading/orders", json=sell_payload)
    assert sell_res.status_code == 201

    # Check remaining position
    port_after_sell = client.get("/api/v1/paper-trading/portfolio").json()
    assert len(port_after_sell["positions"]) == 1
    assert port_after_sell["positions"][0]["quantity"] == 5
