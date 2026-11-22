"""
MarketScope.io — Virtual Paper Trading & Simulated Brokerage Engine
Provides virtual portfolio balance, realistic simulated order execution (Market/Limit),
mark-to-market position tracking, and execution history.
"""

import uuid
from datetime import datetime, timezone
from typing import Literal
from pydantic import BaseModel, Field
from app.engine.derivatives_engine import DerivativesEngine


class PaperOrderRequest(BaseModel):
    symbol: str
    side: Literal["BUY", "SELL"]
    order_type: Literal["MARKET", "LIMIT"] = "MARKET"
    quantity: int
    limit_price: float | None = None


class PaperPosition(BaseModel):
    symbol: str
    quantity: int
    average_price: float
    current_price: float
    invested_amount: float
    current_value: float
    unrealized_pnl: float
    unrealized_pnl_pct: float


class PaperOrder(BaseModel):
    order_id: str
    symbol: str
    side: str
    order_type: str
    quantity: int
    executed_price: float
    fee: float
    total_amount: float
    status: str = "EXECUTED"
    timestamp: str


class PaperPortfolioResponse(BaseModel):
    account_id: str
    currency: str = "INR"
    initial_cash: float = 1000000.0  # ₹10,00,000
    available_cash: float
    invested_value: float
    total_portfolio_value: float
    total_unrealized_pnl: float
    total_realized_pnl: float
    positions: list[PaperPosition]
    recent_orders: list[PaperOrder]


class PaperTradingEngine:
    def __init__(self):
        self.reset_account()

    def reset_account(self):
        self.account_id = "paper_acc_default"
        self.initial_cash = 1000000.0
        self.available_cash = 1000000.0
        self.positions: dict[str, dict] = {}
        self.orders: list[PaperOrder] = []
        self.realized_pnl = 0.0

    def _get_current_price(self, symbol: str) -> float:
        sym = symbol.upper()
        if sym in DerivativesEngine.UNDERLYING_PRICES:
            return DerivativesEngine.UNDERLYING_PRICES[sym]
        return 1500.0

    def execute_order(self, req: PaperOrderRequest) -> PaperOrder:
        sym = req.symbol.upper()
        curr_price = self._get_current_price(sym)
        exec_price = req.limit_price if (req.order_type == "LIMIT" and req.limit_price) else curr_price

        # 0.03% transaction fee
        fee = round(req.quantity * exec_price * 0.0003, 2)
        total_trade_val = round(req.quantity * exec_price, 2)

        if req.side == "BUY":
            required_cash = total_trade_val + fee
            if required_cash > self.available_cash:
                raise ValueError(f"Insufficient cash: Required ₹{required_cash:,.2f}, Available ₹{self.available_cash:,.2f}")

            self.available_cash -= required_cash

            # Update position
            if sym in self.positions:
                existing_qty = self.positions[sym]["quantity"]
                existing_cost = existing_qty * self.positions[sym]["average_price"]
                new_qty = existing_qty + req.quantity
                new_avg = (existing_cost + total_trade_val) / new_qty
                self.positions[sym]["quantity"] = new_qty
                self.positions[sym]["average_price"] = round(new_avg, 2)
            else:
                self.positions[sym] = {
                    "quantity": req.quantity,
                    "average_price": round(exec_price, 2),
                }

        elif req.side == "SELL":
            if sym not in self.positions or self.positions[sym]["quantity"] < req.quantity:
                raise ValueError(f"Insufficient holdings in {sym} to sell {req.quantity} units")

            avg_cost = self.positions[sym]["average_price"]
            trade_realized_pnl = req.quantity * (exec_price - avg_cost) - fee
            self.realized_pnl += trade_realized_pnl

            self.available_cash += (total_trade_val - fee)
            self.positions[sym]["quantity"] -= req.quantity

            if self.positions[sym]["quantity"] <= 0:
                del self.positions[sym]

        order = PaperOrder(
            order_id=f"ord_{uuid.uuid4().hex[:10]}",
            symbol=sym,
            side=req.side,
            order_type=req.order_type,
            quantity=req.quantity,
            executed_price=round(exec_price, 2),
            fee=fee,
            total_amount=total_trade_val,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        self.orders.insert(0, order)
        return order

    def get_portfolio(self) -> PaperPortfolioResponse:
        pos_list: list[PaperPosition] = []
        invested_val = 0.0
        total_unrealized_pnl = 0.0

        for sym, pos_data in self.positions.items():
            qty = pos_data["quantity"]
            avg_p = pos_data["average_price"]
            curr_p = self._get_current_price(sym)

            invested = qty * avg_p
            cur_val = qty * curr_p
            unreal_pnl = cur_val - invested
            unreal_pct = ((curr_p - avg_p) / avg_p) * 100.0 if avg_p > 0 else 0.0

            invested_val += invested
            total_unrealized_pnl += unreal_pnl

            pos_list.append(
                PaperPosition(
                    symbol=sym,
                    quantity=qty,
                    average_price=avg_p,
                    current_price=curr_p,
                    invested_amount=round(invested, 2),
                    current_value=round(cur_val, 2),
                    unrealized_pnl=round(unreal_pnl, 2),
                    unrealized_pnl_pct=round(unreal_pct, 2),
                )
            )

        total_portfolio_val = self.available_cash + (invested_val + total_unrealized_pnl)

        return PaperPortfolioResponse(
            account_id=self.account_id,
            currency="INR",
            initial_cash=self.initial_cash,
            available_cash=round(self.available_cash, 2),
            invested_value=round(invested_val, 2),
            total_portfolio_value=round(total_portfolio_val, 2),
            total_unrealized_pnl=round(total_unrealized_pnl, 2),
            total_realized_pnl=round(self.realized_pnl, 2),
            positions=pos_list,
            recent_orders=self.orders[:30],
        )


paper_trading_engine = PaperTradingEngine()
