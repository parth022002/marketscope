# MarketScope.io — Frontend Architecture

## 1. Overview
The frontend is built on **Next.js 15** utilizing the **App Router** paradigm with React 19, TypeScript, and Tailwind CSS.

## 2. Directory Structure
```
apps/web/src/
├── app/                  # Next.js App Router Pages (28 routes)
│   ├── layout.tsx        # Root layout, theme provider, Clerk provider
│   ├── page.tsx          # Market overview & dashboard
│   ├── charts/page.tsx   # Advanced full-screen multi-chart terminal
│   ├── stock/[symbol]/   # Dedicated stock research & chart hub
│   ├── screener/         # Universal stock screener
│   ├── derivatives/      # Options chain & futures build-up
│   ├── market-intelligence/ # Breadth & Mansfield RS
│   ├── backtesting/      # Strategy backtesting engine
│   ├── paper-trading/    # Virtual account simulator
│   ├── news/             # Verified financial news
│   ├── watchlist/        # User watchlists
│   ├── portfolio/        # Portfolio analytics
│   └── privacy-security-trust/ # Regulatory disclosures
├── components/           # Reusable UI components
│   ├── chart/            # StockChart, MultiChartGrid, DrawingToolbar
│   ├── layout/           # NavigationShell, Footer, Header
│   ├── screener/         # ScreenerFilters, ScreenerTable
│   ├── derivatives/      # OptionsChainTable, GreeksView
│   └── ui/               # Buttons, Modals, Cards, Badges, Tabs
└── lib/                  # Shared utilities and API client
    ├── api.ts            # Typed HTTP client to FastAPI backend
    ├── utils.ts          # Formatting, date helpers, number formatting
    └── types.ts          # Canonical TypeScript interfaces
```

## 3. Key Design Patterns
- **Lightweight Charts v5 Integration**: Encapsulated within `StockChart.tsx` using `useRef` and `useEffect` lifecycle hooks. Resizing is managed via `ResizeObserver`. Crosshair synchronization across multi-chart layouts is achieved via event dispatching.
- **Persistent State**: Chart layouts, indicator selections, active drawings, and watchlists are persisted to `localStorage` with background synchronization to the user's account in the backend database.
- **Responsive Layouts**: Fully responsive design supporting ultra-wide monitors (4K), desktop terminals (1080p), laptops, tablets, and mobile smartphones.
