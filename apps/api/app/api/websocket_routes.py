"""
MarketScope.io — Real-Time Market Data WebSocket Streaming Gateway
Provides low-latency tick broadcasting, symbol subscriptions, and heartbeats.
"""

import asyncio
import json
import logging
from typing import Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.engine.market_data_service import market_data_service

logger = logging.getLogger(__name__)
ws_router = APIRouter()


class MarketDataConnectionManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.subscriptions: dict[WebSocket, set[str]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        self.subscriptions[websocket] = set()
        market_data_service.register_ws_connection()
        logger.info(f"WebSocket client connected. Total active: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        self.subscriptions.pop(websocket, None)
        market_data_service.unregister_ws_connection()
        logger.info(f"WebSocket client disconnected. Total active: {len(self.active_connections)}")

    def subscribe(self, websocket: WebSocket, symbols: list[str]):
        if websocket in self.subscriptions:
            clean_syms = {s.upper().strip() for s in symbols if s}
            self.subscriptions[websocket].update(clean_syms)

    def unsubscribe(self, websocket: WebSocket, symbols: list[str]):
        if websocket in self.subscriptions:
            clean_syms = {s.upper().strip() for s in symbols if s}
            self.subscriptions[websocket].difference_update(clean_syms)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_text(json.dumps(message))
        except Exception:
            pass

    async def broadcast(self, message: dict):
        payload = json.dumps(message)
        dead_connections = []
        for connection in list(self.active_connections):
            try:
                await connection.send_text(payload)
            except Exception:
                dead_connections.append(connection)

        for dead in dead_connections:
            self.disconnect(dead)


manager = MarketDataConnectionManager()


@ws_router.websocket("/ws/v1/market-data")
@ws_router.websocket("/api/v1/ws/market-data")
async def websocket_market_data_stream(websocket: WebSocket):
    """
    Sub-second real-time market data streaming endpoint.
    Supports subscriptions and periodic quote push.
    """
    await manager.connect(websocket)

    # Send initial connection confirmation with universe summary
    await manager.send_personal_message(
        {
            "type": "connection_established",
            "message": "Connected to MarketScope.io Real-Time Market Stream",
            "protocol_version": "1.0",
        },
        websocket,
    )

    async def quote_broadcaster():
        try:
            while websocket in manager.active_connections:
                # Fetch fresh quotes
                tickers = await market_data_service.get_ticker_feed()
                user_subs = manager.subscriptions.get(websocket, set())

                # If client subscribed to specific symbols, filter; otherwise send all core tickers
                if user_subs:
                    broadcast_items = [t for t in tickers if t.symbol.upper() in user_subs]
                else:
                    broadcast_items = tickers

                if broadcast_items:
                    await manager.send_personal_message(
                        {
                            "type": "ticker_update",
                            "count": len(broadcast_items),
                            "items": [item.model_dump() for item in broadcast_items],
                        },
                        websocket,
                    )
                await asyncio.sleep(3.0)  # Stream broadcast interval
        except asyncio.CancelledError:
            pass
        except Exception as e:
            logger.debug(f"Broadcast loop ended for client: {e}")

    broadcast_task = asyncio.create_task(quote_broadcaster())

    try:
        while True:
            text_data = await websocket.receive_text()
            try:
                data = json.loads(text_data)
                action = data.get("action", "").lower()

                if action == "ping":
                    await manager.send_personal_message({"type": "pong"}, websocket)
                elif action == "subscribe":
                    symbols = data.get("symbols", [])
                    manager.subscribe(websocket, symbols)
                    await manager.send_personal_message(
                        {"type": "subscribed", "symbols": list(manager.subscriptions[websocket])},
                        websocket,
                    )
                elif action == "unsubscribe":
                    symbols = data.get("symbols", [])
                    manager.unsubscribe(websocket, symbols)
                    await manager.send_personal_message(
                        {"type": "unsubscribed", "symbols": symbols},
                        websocket,
                    )
                elif action == "snapshot":
                    # Instant snapshot request
                    tickers = await market_data_service.get_ticker_feed()
                    await manager.send_personal_message(
                        {
                            "type": "snapshot",
                            "items": [item.model_dump() for item in tickers],
                        },
                        websocket,
                    )
            except json.JSONDecodeError:
                await manager.send_personal_message(
                    {"type": "error", "message": "Invalid JSON format"}, websocket
                )
    except WebSocketDisconnect:
        logger.info("Client disconnected normally from WebSocket")
    except Exception as e:
        logger.warning(f"WebSocket client loop exception: {e}")
    finally:
        broadcast_task.cancel()
        manager.disconnect(websocket)
