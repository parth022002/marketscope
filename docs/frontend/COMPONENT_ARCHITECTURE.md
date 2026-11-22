# MarketScope.io — Component Architecture Specification

## 1. Directory Structure

```
apps/web/src/
  ├── app/                  # Next.js 15 App Router pages
  │     ├── page.tsx        # Overview / Main Dashboard
  │     ├── markets/        # Multi-Asset Market Hub
  │     ├── discover/       # Universal Discovery Hub
  │     ├── portfolio/      # Virtual Risk & Portfolio Desk
  │     ├── intelligence/   # Unified Multi-Model Intelligence
  │     ├── charts/         # Advanced Charting Terminal
  │     ├── alerts/         # Price & Indicator Alert Center
  │     ├── settings/       # Preferences & Display Settings
  │     ├── help/           # Platform Guide & Glossary
  │     └── company/[symbol]/# Company Research Dossier
  ├── components/
  │     ├── NavigationShell.tsx  # Fixed Sidebar & Header Shell
  │     ├── AnimatedBackground.tsx # 3D Perspective Isometric Canvas
  │     ├── BrandLogo.tsx        # Vector Brand Icon & Typography
  │     ├── MarketTicker.tsx     # Real-time Stream Ticker Tape
  │     ├── Footer.tsx           # Institutional Navigation Footer
  │     ├── ThemeProvider.tsx    # Theme State Context
  │     └── chart/
  │           ├── StockChart.tsx          # Lightweight Charts Core Canvas
  │           ├── ChartToolbar.tsx        # Timeframe & Series Switcher
  │           ├── ChartIndicatorsModal.tsx# 18 Technical Indicators Selector
  │           └── ChartDrawingOverlay.tsx # Vector Drawing Engine
  └── lib/
        ├── api.ts              # Strongly Typed Backend REST Client
        └── useMarketWebSocket.ts# Real-time WebSocket Gateway Hook
```
