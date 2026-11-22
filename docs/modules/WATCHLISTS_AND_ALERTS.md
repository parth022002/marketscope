# MarketScope.io — Watchlists & Alerts Module

## 1. Overview
The Watchlists & Alerts module provides real-time tracking of customized baskets of securities, with instant price change calculations, daily high/low markers, and user-configurable price alert thresholds.

## 2. Capabilities
- **Multi-Watchlist Management**: Create, rename, reorder, and delete named watchlists (e.g. "Nifty 50 Core", "Breakout Watch", "High Dividend").
- **Real-Time Price Updates**: Lightweight polling and WebSocket listeners stream updated LTP and % change into the UI.
- **Price Alerts**: Set trigger conditions (Price Above, Price Below, Daily % Gain > X) with persistent storage in PostgreSQL.
