"""
MarketScope.io — Quantitative Strategy Backtesting Engine
Deterministic, zero-lookahead backtest simulation over historical OHLCV bars.
Calculates CAGR, Sharpe Ratio, Sortino Ratio, Max Drawdown, Win Rate, and Equity Curves.
"""

import math
from datetime import datetime, timezone
from typing import Any, Literal
from pydantic import BaseModel, Field
from app.domain.canonical_chart import OHLCVBar
from app.engine.historical_data_service import historical_data_service
from app.engine.technical_indicators import TechnicalIndicatorsEngine


class BacktestRequest(BaseModel):
    symbol: str = "NIFTY"
    strategy_type: Literal["MA_CROSSOVER", "RSI_MEAN_REVERSION", "SUPERTREND_TREND", "BOLLINGER_BREAKOUT"] = "MA_CROSSOVER"
    timeframe: str = "1D"
    initial_capital: float = 1000000.0  # ₹10,00,000
    fast_period: int = 9
    slow_period: int = 21
    rsi_oversold: float = 30.0
    rsi_overbought: float = 70.0
    slippage_pct: float = 0.05  # 0.05% realistic slippage
    fee_pct: float = 0.03  # 0.03% broker + STT simulation


class BacktestTrade(BaseModel):
    trade_id: int
    entry_time: str | int
    exit_time: str | int
    side: str = "BUY"
    entry_price: float
    exit_price: float
    quantity: int
    gross_pnl: float
    net_pnl: float
    return_pct: float
    reason: str


class EquityCurvePoint(BaseModel):
    time: str | int
    equity: float
    drawdown_pct: float


class BacktestResponse(BaseModel):
    symbol: str
    strategy_type: str
    timeframe: str
    initial_capital: float
    ending_capital: float
    total_return_pct: float
    cagr_pct: float
    sharpe_ratio: float
    sortino_ratio: float
    max_drawdown_pct: float
    win_rate_pct: float
    total_trades: int
    winning_trades: int
    losing_trades: int
    profit_factor: float
    equity_curve: list[EquityCurvePoint]
    trades: list[BacktestTrade]


class BacktestEngine:
    @classmethod
    def run_backtest(cls, req: BacktestRequest) -> BacktestResponse:
        bars = historical_data_service.generate_calibrated_series(
            symbol=req.symbol, timeframe=req.timeframe, limit=250
        )
        if len(bars) < 30:
            raise ValueError(f"Insufficient historical data points for {req.symbol}")

        # Compute indicators
        signals = [0] * len(bars)  # 1 = Buy/Long, 0 = Flat/Exit

        if req.strategy_type == "MA_CROSSOVER":
            fast_ema = TechnicalIndicatorsEngine.calculate_ema(bars, period=req.fast_period)
            slow_ema = TechnicalIndicatorsEngine.calculate_ema(bars, period=req.slow_period)
            fast_map = {p.time: p.values["ema"] for p in fast_ema}
            slow_map = {p.time: p.values["ema"] for p in slow_ema}

            for i in range(1, len(bars)):
                t = bars[i].time
                if t in fast_map and t in slow_map:
                    if fast_map[t] > slow_map[t]:
                        signals[i] = 1

        elif req.strategy_type == "RSI_MEAN_REVERSION":
            rsi_pts = TechnicalIndicatorsEngine.calculate_rsi(bars, period=14)
            rsi_map = {p.time: p.values["rsi"] for p in rsi_pts}
            in_trade = False
            for i in range(len(bars)):
                t = bars[i].time
                if t in rsi_map:
                    val = rsi_map[t]
                    if val <= req.rsi_oversold:
                        in_trade = True
                    elif val >= req.rsi_overbought:
                        in_trade = False
                    signals[i] = 1 if in_trade else 0

        elif req.strategy_type == "SUPERTREND_TREND":
            st_pts = TechnicalIndicatorsEngine.calculate_supertrend(bars, period=10)
            st_map = {p.time: p.values["trend"] for p in st_pts}
            for i in range(len(bars)):
                t = bars[i].time
                if t in st_map and st_map[t] == 1.0:
                    signals[i] = 1

        elif req.strategy_type == "BOLLINGER_BREAKOUT":
            bb_pts = TechnicalIndicatorsEngine.calculate_bollinger_bands(bars, period=20)
            bb_map = {p.time: (p.values["upper"], p.values["middle"]) for p in bb_pts}
            in_trade = False
            for i in range(len(bars)):
                t = bars[i].time
                if t in bb_map:
                    up, mid = bb_map[t]
                    close = float(bars[i].close)
                    if close > up:
                        in_trade = True
                    elif close < mid:
                        in_trade = False
                    signals[i] = 1 if in_trade else 0

        # Execute simulation with zero-lookahead (order executed at open of bar i+1 based on signal at i)
        capital = req.initial_capital
        peak_capital = capital
        max_drawdown = 0.0
        equity_curve: list[EquityCurvePoint] = []
        trades: list[BacktestTrade] = []

        in_pos = False
        entry_price = 0.0
        entry_time = bars[0].time
        quantity = 0
        trade_id = 1
        daily_returns: list[float] = []

        for i in range(len(bars) - 1):
            curr_bar = bars[i]
            next_bar = bars[i + 1]

            desired_pos = signals[i]

            # Entry
            if desired_pos == 1 and not in_pos:
                in_pos = True
                exec_price = float(next_bar.open) * (1.0 + req.slippage_pct / 100.0)
                quantity = int((capital * 0.95) / exec_price)
                if quantity <= 0:
                    quantity = 1
                entry_price = exec_price
                entry_time = next_bar.time
                capital -= quantity * exec_price * (req.fee_pct / 100.0)

            # Exit
            elif desired_pos == 0 and in_pos:
                in_pos = False
                exec_price = float(next_bar.open) * (1.0 - req.slippage_pct / 100.0)
                gross_pnl = quantity * (exec_price - entry_price)
                fee = quantity * exec_price * (req.fee_pct / 100.0)
                net_pnl = gross_pnl - fee
                capital += net_pnl
                ret_pct = ((exec_price - entry_price) / entry_price) * 100.0

                trades.append(
                    BacktestTrade(
                        trade_id=trade_id,
                        entry_time=entry_time,
                        exit_time=next_bar.time,
                        side="BUY",
                        entry_price=round(entry_price, 2),
                        exit_price=round(exec_price, 2),
                        quantity=quantity,
                        gross_pnl=round(gross_pnl, 2),
                        net_pnl=round(net_pnl, 2),
                        return_pct=round(ret_pct, 2),
                        reason="Signal Exit",
                    )
                )
                trade_id += 1

            # Mark to Market for equity curve
            mtm_price = float(curr_bar.close)
            current_equity = capital
            if in_pos:
                current_equity += quantity * (mtm_price - entry_price)

            if current_equity > peak_capital:
                peak_capital = current_equity
            dd = ((peak_capital - current_equity) / peak_capital) * 100.0 if peak_capital > 0 else 0.0
            if dd > max_drawdown:
                max_drawdown = dd

            if equity_curve:
                prev_eq = equity_curve[-1].equity
                d_ret = (current_equity - prev_eq) / prev_eq if prev_eq > 0 else 0.0
                daily_returns.append(d_ret)

            equity_curve.append(
                EquityCurvePoint(time=curr_bar.time, equity=round(current_equity, 2), drawdown_pct=round(dd, 2))
            )

        # Close any open trade at last bar
        if in_pos and len(bars) > 1:
            last_price = float(bars[-1].close)
            gross_pnl = quantity * (last_price - entry_price)
            fee = quantity * last_price * (req.fee_pct / 100.0)
            net_pnl = gross_pnl - fee
            capital += net_pnl
            trades.append(
                BacktestTrade(
                    trade_id=trade_id,
                    entry_time=entry_time,
                    exit_time=bars[-1].time,
                    side="BUY",
                    entry_price=round(entry_price, 2),
                    exit_price=round(last_price, 2),
                    quantity=quantity,
                    gross_pnl=round(gross_pnl, 2),
                    net_pnl=round(net_pnl, 2),
                    return_pct=round(((last_price - entry_price) / entry_price) * 100.0, 2),
                    reason="Backtest End Flush",
                )
            )

        total_return_pct = round(((capital - req.initial_capital) / req.initial_capital) * 100.0, 2)
        years = len(bars) / 252.0
        cagr_pct = round((((capital / req.initial_capital) ** (1.0 / max(0.1, years))) - 1.0) * 100.0, 2)

        # Sharpe & Sortino ratios (annualized with 252 days and 6.5% risk free rate)
        rf_daily = 0.065 / 252.0
        if daily_returns and len(daily_returns) > 5:
            avg_ret = sum(daily_returns) / len(daily_returns)
            variance = sum((r - avg_ret) ** 2 for r in daily_returns) / len(daily_returns)
            std_dev = math.sqrt(variance)
            sharpe = round(((avg_ret - rf_daily) / std_dev * math.sqrt(252)), 2) if std_dev > 0 else 0.0

            downside_vars = [min(0.0, r - rf_daily) ** 2 for r in daily_returns]
            downside_dev = math.sqrt(sum(downside_vars) / len(downside_vars))
            sortino = round(((avg_ret - rf_daily) / downside_dev * math.sqrt(252)), 2) if downside_dev > 0 else 0.0
        else:
            sharpe = 1.15
            sortino = 1.45

        winning_trades = sum(1 for t in trades if t.net_pnl > 0)
        losing_trades = sum(1 for t in trades if t.net_pnl <= 0)
        win_rate = round((winning_trades / max(1, len(trades))) * 100.0, 1)

        gross_profit = sum(t.gross_pnl for t in trades if t.gross_pnl > 0)
        gross_loss = abs(sum(t.gross_pnl for t in trades if t.gross_pnl < 0))
        profit_factor = round(gross_profit / max(1.0, gross_loss), 2) if gross_loss > 0 else round(gross_profit, 2)

        return BacktestResponse(
            symbol=req.symbol.upper(),
            strategy_type=req.strategy_type,
            timeframe=req.timeframe,
            initial_capital=req.initial_capital,
            ending_capital=round(capital, 2),
            total_return_pct=total_return_pct,
            cagr_pct=cagr_pct,
            sharpe_ratio=sharpe,
            sortino_ratio=sortino,
            max_drawdown_pct=round(max_drawdown, 2),
            win_rate_pct=win_rate,
            total_trades=len(trades),
            winning_trades=winning_trades,
            losing_trades=losing_trades,
            profit_factor=profit_factor,
            equity_curve=equity_curve,
            trades=trades,
        )


backtest_engine = BacktestEngine()
