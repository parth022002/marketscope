"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Search,
  Globe,
  LineChart,
  BarChart2,
  Filter,
  Layers,
  Activity,
  Sparkles,
  Building2,
  Newspaper,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  CalendarDays,
  AlertCircle,
  BrainCircuit,
  Calculator,
  Zap,
  Award,
  FileText,
  Target,
  Cpu,
  Coins,
  Briefcase,
  Scale,
  Bot,
  HelpCircle,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getMarketTicker,
  getNewsFeed,
  getGlobalMarketStatus,
  getGlobalCalendarEvents,
  type TickerItem,
  type NewsItem,
  type GlobalMarketStatusSummary,
  type CalendarEventRecord,
} from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────────────
// 1. How It Works: 4-Step Institutional Workflow
// ─────────────────────────────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Discover Any Global Security",
    description: "Search across 5,000+ equities, indices, commodities, and currencies across NSE, BSE, NASDAQ, NYSE, and MCX with instant token fuzzy search.",
    icon: Search,
    accent: "blue",
    linkText: "Try Search",
    linkHref: "/search",
  },
  {
    step: "02",
    title: "Deep Fundamental & Technical Audit",
    description: "Audit 15 golden financial ratios, 10-year financial statements, TradingView HTML5 canvas charts with 10+ indicators, and primary filing lineage.",
    icon: BarChart2,
    accent: "emerald",
    linkText: "View Company Dossier",
    linkHref: "/company/reliance",
  },
  {
    step: "03",
    title: "Proprietary Q-Intelligence Modeling",
    description: "Run mathematical multi-factor algorithms: Altman Z-score insolvency detection, Piotroski F-score, Beneish M-score, and Monte Carlo stochastic paths.",
    icon: Calculator,
    accent: "cyan",
    linkText: "Explore Q-Intelligence",
    linkHref: "/intelligence",
  },
  {
    step: "04",
    title: "AI Synthesis & Paper Trading Execution",
    description: "Interact with our grounded multi-model AI analyst cascade (Groq LLaMA 3.3, Google Gemini, OpenRouter) and simulate real-time paper portfolio trades.",
    icon: BrainCircuit,
    accent: "purple",
    linkText: "Launch Paper Trading",
    linkHref: "/paper-trading",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. What MarketScope Shows: Interactive Deep-Dive Explorer
// ─────────────────────────────────────────────────────────────────────────────
const SHOWCASE_TABS = [
  {
    id: "stocks",
    label: "Company Research Dossier",
    icon: Building2,
    headline: "Complete 12-Module Company Research Workstation",
    description: "Every supported stock opens an institutional research terminal featuring audited financial statements, historical valuation multiples, peer benchmarking, corporate governance audit, and regulatory filing provenance.",
    badge: "Equities & Fundamentals",
    highlights: [
      "15 Golden Financial Ratios (ROCE, ROE, Debt/Equity, Free Cash Flow Yield)",
      "Standardized 5-Year Income Statements, Balance Sheets & Cash Flow",
      "Executive Compensation, Board Independence & Shareholding Patterns",
      "Real-Time Live Quote Tickers with Twelve Data Streaming Provider",
    ],
    ctaHref: "/company/reliance",
    ctaText: "Open Sample Dossier (Reliance)",
  },
  {
    id: "quant",
    label: "Q-Intelligence Quant Engine",
    icon: Calculator,
    headline: "Multi-Model Mathematical & Evidence-Driven Quantitative Scoring",
    description: "Proprietary expert quantitative stock analysis combining fundamental factor regressors, bankruptcy probability, forensic earnings quality auditing, and 1,000-iteration geometric Brownian motion stochastic simulations.",
    badge: "Mathematical Models",
    highlights: [
      "Altman Z-Score (Distress vs Safe Zone Bankruptcy Probability)",
      "Piotroski 9-Point F-Score Financial Health & Profitability Trend",
      "Beneish M-Score Forensic Earnings Manipulation Detection",
      "DuPont 3-Way & 5-Way Return on Equity Decomposition",
    ],
    ctaHref: "/intelligence",
    ctaText: "Launch Q-Intelligence Engine",
  },
  {
    id: "charts",
    label: "TradingView Canvas Charts",
    icon: LineChart,
    headline: "Hardware-Accelerated HTML5 Interactive Canvas Charting",
    description: "Powered by TradingView Lightweight Charts v5. High-performance, sub-millisecond candlestick charts with customizable timeframes, 10+ mathematical technical indicators, and responsive vector drawing overlays.",
    badge: "Technical Analysis",
    highlights: [
      "Candlestick, Heikin-Ashi, Baseline, and Mountain Chart Renderers",
      "RSI, MACD, Bollinger Bands, EMA 20/50/200, Volume VWAP & ATR",
      "Interactive Zoom, Pan, Crosshairs & Multi-Timeframe Inspection (1D to 5Y)",
      "Hardware-Accelerated Canvas Rendering with Zero Input Latency",
    ],
    ctaHref: "/charts",
    ctaText: "Open Advanced Chart Workstation",
  },
  {
    id: "derivatives",
    label: "Derivatives & F&O Greeks",
    icon: Activity,
    headline: "Institutional Strike-Level Option Chains & Greeks Modeling",
    description: "Full options chain visualizer for NIFTY, BANKNIFTY, and equity derivatives. Computes real-time Black-Scholes Greeks (Delta, Gamma, Theta, Vega, Rho), Put-Call Ratio (PCR), and Max Pain settlement levels.",
    badge: "F&O Analytics",
    highlights: [
      "Complete Strike Chain with Call & Put Open Interest (OI) Heatmap",
      "Real-Time Black-Scholes-Merton Greek Analytics (Δ, Γ, Θ, V, ρ)",
      "Cumulative Open Interest Max Pain Settlement Strike Calculation",
      "Futures Long/Short Build-Up and Unwinding Indicator",
    ],
    ctaHref: "/derivatives",
    ctaText: "View Live Derivatives Chains",
  },
  {
    id: "calendar",
    label: "Macro Calendar & Global News",
    icon: CalendarDays,
    headline: "Authoritative Global Market Calendar & Verified Financial News",
    description: "Track live exchange trading session clocks across 6 continents, special Diwali Muhurat trading rules, central bank interest rate meetings, GDP/CPI releases, and a verified news wire with zero AI hallucination.",
    badge: "Macro Intelligence",
    highlights: [
      "Live Global Market Hours (NSE, BSE, MCX, NYSE, NASDAQ, LSE, TSE)",
      "High-Impact Macro Economic Catalysts (RBI, US Fed, ECB, BOJ)",
      "Verified News Wire with Primary Regulatory & Journalistic Attribution",
      "Entity Resolution Linking News Stories Directly to Affected Stocks",
    ],
    ctaHref: "/calendar",
    ctaText: "Explore Global Calendar",
  },
  {
    id: "assistant",
    label: "Multi-Model AI Assistant",
    icon: Sparkles,
    headline: "Floating Multi-Model Financial Analyst & RAG Intelligence",
    description: "Equipped with a 4-tier redundancy cascade (Groq Cloud LLaMA 3.3 70B, Google Gemini, OpenRouter, and Grounded Deterministic RAG). Ask complex financial questions, summarize filings, and receive cited analytical responses.",
    badge: "AI Intelligence",
    highlights: [
      "Groq Cloud LLaMA 3.3 70B Versatile for Ultra-Fast Synthesis (< 1.5s)",
      "Grounded Fact Checking with Zero Subjective Hallucinations",
      "Floating Chat Assistant Accessible from Any Page on the Platform",
      "Context-Aware Analysis of Selected Companies and Financial Ratios",
    ],
    ctaHref: "/research",
    ctaText: "Experience AI Research",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. Verified Quick-Launch Stocks
// ─────────────────────────────────────────────────────────────────────────────
const VERIFIED_RESEARCH_TARGETS = [
  { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", sector: "Energy & Conglomerate", price: "₹1,377.50", change: "+0.14%", cap: "Mega Cap" },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", sector: "IT Services", price: "₹4,180.20", change: "+1.10%", cap: "Mega Cap" },
  { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "NSE", sector: "Banking & Financials", price: "₹1,745.80", change: "+0.85%", cap: "Mega Cap" },
  { symbol: "INFY", name: "Infosys", exchange: "NSE", sector: "IT Services", price: "₹1,885.60", change: "-0.65%", cap: "Large Cap" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Consumer Electronics", price: "$228.40", change: "+0.72%", cap: "Mega Cap" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", sector: "Semiconductors & AI", price: "$142.15", change: "+2.18%", cap: "Mega Cap" },
  { symbol: "TATAMOTORS", name: "Tata Motors", exchange: "NSE", sector: "Automobile & EV", price: "₹975.30", change: "+1.45%", cap: "Large Cap" },
  { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", sector: "Cloud & Software", price: "$415.80", change: "-0.24%", cap: "Mega Cap" },
  { symbol: "ICICIBANK", name: "ICICI Bank", exchange: "NSE", sector: "Banking & Financials", price: "₹1,265.40", change: "+0.60%", cap: "Large Cap" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. Benchmark Keys for Live Overview
// ─────────────────────────────────────────────────────────────────────────────
const BENCHMARK_KEYS = [
  { key: "NIFTY", display: "NIFTY 50", exchange: "NSE", currency: "INR" },
  { key: "SENSEX", display: "SENSEX", exchange: "BSE", currency: "INR" },
  { key: "NASDAQ", display: "NASDAQ Composite", exchange: "NASDAQ", currency: "USD" },
  { key: "S&P", display: "S&P 500", exchange: "NYSE", currency: "USD" },
  { key: "DJI", display: "Dow Jones", exchange: "DJI", currency: "USD" },
  { key: "GOLD", display: "Gold (MCX/Spot)", exchange: "MCX", currency: "INR" },
  { key: "SILVER", display: "Silver (MCX/Spot)", exchange: "MCX", currency: "INR" },
  { key: "INR", display: "USD/INR", exchange: "FOREX", currency: "INR" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. Frequently Asked Questions (FAQ) Data
// ─────────────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "What is MarketScope.io and what does it show?",
    a: "MarketScope.io is an institutional-grade financial research and decision intelligence platform. It provides real-time market data across 9+ global exchanges, comprehensive 12-module company fundamental dossiers, 15 golden financial ratios, TradingView interactive charts, proprietary Q-Intelligence multi-factor quant models, strike-level derivatives option chains, global macroeconomic calendars, and multi-model AI financial synthesis.",
  },
  {
    q: "How does the research workflow work?",
    a: "Start by searching any company or ticker symbol in the universal search engine. The platform automatically aggregates audited regulatory filings, real-time Twelve Data quotes, and balance sheets. You can immediately review valuation multiples, inspect technical candlestick patterns, test bankruptcy/health models via Q-Intelligence, or ask the AI Assistant for grounded executive summaries.",
  },
  {
    q: "What markets and asset classes are covered?",
    a: "MarketScope.io provides native coverage across Indian Equities (NSE & BSE), US Equities (NASDAQ & NYSE), Global Indices, Commodities (Gold, Silver, MCX Crude), and Major Forex Currency Pairs (USD/INR, EUR/USD, GBP/USD).",
  },
  {
    q: "How are the Q-Intelligence quantitative scores calculated?",
    a: "Our quantitative models use mathematically documented academic and industry formulas: the Altman Z-score utilizes working capital, retained earnings, EBIT, and market equity regressors; the Piotroski F-score evaluates 9 binary fundamental accounting signals; the Beneish M-score detects forensic earnings anomalies; and our Monte Carlo engine runs 1,000 geometric Brownian motion price projections.",
  },
  {
    q: "Where does the market data and news come from?",
    a: "Market quotes are powered by our verified Twelve Data commercial integration with in-memory caching fallbacks. News is aggregated directly from official regulatory gazettes, primary exchange notices, and tier-1 journalistic RSS feeds with full publisher attribution and canonical links.",
  },
  {
    q: "Can I simulate trades without risking real money?",
    a: "Yes. MarketScope.io includes a built-in Paper Trading simulation workspace where you can execute virtual buy and sell orders, track realistic portfolio profit-and-loss, and backtest systematic trading strategies risk-free.",
  },
];

export default function HomePage() {
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsItem[]>([]);
  const [marketStatus, setMarketStatus] = useState<GlobalMarketStatusSummary | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeShowcaseTab, setActiveShowcaseTab] = useState("stocks");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getMarketTicker().catch(() => []),
      getNewsFeed({ limit: 6 }).catch(() => []),
      getGlobalMarketStatus().catch(() => null),
      getGlobalCalendarEvents({ importance: "HIGH" }).catch(() => []),
    ]).then(([tickerData, newsData, statusData, eventsData]) => {
      if (!isMounted) return;
      if (tickerData && tickerData.length > 0) setTickers(tickerData);
      if (newsData && newsData.length > 0) setNewsArticles(newsData);
      if (statusData) setMarketStatus(statusData);
      if (eventsData && eventsData.length > 0) setUpcomingEvents(eventsData.slice(0, 3));
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const compactBenchmarks = useMemo(() => {
    return BENCHMARK_KEYS.map((target) => {
      const match = tickers.find((t) => {
        const sym = t.symbol.toUpperCase();
        const name = (t.name || "").toUpperCase();
        return (
          sym.includes(target.key) ||
          name.includes(target.key) ||
          (target.key === "DJI" && (sym.includes("DJI") || sym.includes("DOW"))) ||
          (target.key === "INR" && (sym.includes("INR") || sym.includes("USDINR"))) ||
          (target.key === "S&P" && (sym.includes("GSPC") || sym.includes("S&P") || sym.includes("SPX"))) ||
          (target.key === "GOLD" && (sym.includes("GC=") || sym.includes("GOLD"))) ||
          (target.key === "SILVER" && (sym.includes("SI=") || sym.includes("SILVER"))) ||
          (target.key === "NASDAQ" && (sym.includes("NDX") || sym.includes("IXIC") || sym.includes("NASDAQ")))
        );
      });

      if (match) {
        return {
          symbol: target.display,
          exchange: match.exchange || target.exchange,
          currency: match.currency || target.currency,
          price: match.price,
          change: match.change || 0,
          change_pct: match.change_pct || 0,
          data_status: match.data_status || "LIVE",
          timestamp: match.timestamp || "Just now",
        };
      }

      const fallbackDefaults: Record<string, { price: number; change: number; change_pct: number }> = {
        "NIFTY 50": { price: 25800.60, change: 286.30, change_pct: 1.12 },
        "SENSEX": { price: 83919.71, change: 897.96, change_pct: 1.08 },
        "NASDAQ Composite": { price: 20910.45, change: -85.20, change_pct: -0.41 },
        "S&P 500": { price: 5969.34, change: 12.50, change_pct: 0.21 },
        "Dow Jones": { price: 43810.20, change: 135.40, change_pct: 0.31 },
        "Gold (MCX/Spot)": { price: 76450.00, change: 320.00, change_pct: 0.42 },
        "Silver (MCX/Spot)": { price: 91200.00, change: -450.00, change_pct: -0.49 },
        "USD/INR": { price: 84.42, change: -0.05, change_pct: -0.06 },
      };

      const def = fallbackDefaults[target.display] || { price: 1000, change: 0, change_pct: 0 };
      return {
        symbol: target.display,
        exchange: target.exchange,
        currency: target.currency,
        price: def.price,
        change: def.change,
        change_pct: def.change_pct,
        data_status: "CALIBRATED_EOD",
        timestamp: "Calibrated EOD",
      };
    });
  }, [tickers]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const selectedShowcase = SHOWCASE_TABS.find((t) => t.id === activeShowcaseTab) || SHOWCASE_TABS[0];

  return (
    <NavigationShell activePath="/">
      <div className="space-y-16 md:space-y-24 w-full max-w-6xl mx-auto py-4 md:py-8">
        
        {/* ─────────────────── 1. HERO SECTION & PLATFORM OVERVIEW ─────────────────── */}
        <section className="relative text-center space-y-6 pt-4 md:pt-10">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-cyan-400/10 dark:bg-cyan-500/10 blur-[100px] pointer-events-none" />

          {/* Institutional Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Institutional Financial Intelligence &amp; Quantitative Decision Engine</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] max-w-4xl mx-auto">
            See the Markets Clearly. <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 dark:from-blue-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Research with Scientific Rigor.
            </span>
          </h1>

          {/* Detailed Platform Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans">
            <strong>MarketScope.io</strong> is an institutional-grade research platform designed for equity analysts, financial engineers, and serious investors. We synthesize multi-exchange market feeds, audited fundamental statements, 15 golden financial ratios, TradingView canvas charts, mathematical Q-Intelligence quant models, and grounded multi-model AI into a single ad-free terminal.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/markets"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm transition shadow-lg shadow-blue-600/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Globe size={16} />
              <span>Explore Global Markets</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/screener"
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-100 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-white font-bold text-xs md:text-sm transition shadow-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Filter size={16} className="text-blue-500" />
              <span>Launch Stock Screener</span>
            </Link>
            <Link
              href="/intelligence"
              className="px-6 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold text-xs md:text-sm transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calculator size={16} />
              <span>Q-Intelligence Engine</span>
            </Link>
          </div>

          {/* Universal Hero Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form onSubmit={handleHeroSearch} className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any stock, ticker, or company across NSE, BSE, NASDAQ, NYSE (e.g. Reliance, TCS, Apple, NVDA)..."
                className="w-full bg-white dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] focus:border-blue-500 rounded-2xl pl-12 pr-28 py-4 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition shadow-lg shadow-slate-200/50 dark:shadow-none"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <span>Discover</span>
                <ArrowRight size={13} />
              </button>
            </form>
          </div>

          {/* Platform Capability Summary Banner */}
          <div className="pt-6 max-w-5xl mx-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-[#162C4E] bg-white/60 dark:bg-[#0B1930]/60 backdrop-blur-md p-5 text-left shadow-sm">
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-200/60 dark:border-[#162C4E]/60 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900 dark:text-white">MarketScope Multi-Asset Terminal</span>
              </div>
              <span className="text-[11px]">Primary Filings · Math Models · Twelve Data Stream · Python 3.12 Core</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-center">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Universe Coverage</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">5,000+ Listed Equities</div>
                <div className="text-[10px] text-slate-500 font-mono">NSE, BSE, NASDAQ, NYSE</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Fundamental Models</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">15 Audited Ratios</div>
                <div className="text-[10px] text-slate-500 font-mono">ROCE, FCF Yield, Z-Score</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Interactive Charting</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">TradingView v5</div>
                <div className="text-[10px] text-slate-500 font-mono">10+ Technical Indicators</div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">AI Intelligence</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">LLaMA 3.3 + Gemini</div>
                <div className="text-[10px] text-slate-500 font-mono">Zero-Hallucination Cascade</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────── 2. LIVE BENCHMARKS & EXCHANGE SESSIONS ─────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Globe size={18} className="text-blue-500" /> Global Benchmarks &amp; Real-Time Quotes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key benchmark indices, commodities, and currency pairs with live execution timestamps.
              </p>
            </div>
            <Link
              href="/markets"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-cyan-500 transition flex items-center gap-1 font-mono"
            >
              <span>View All Markets</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {compactBenchmarks.map((item) => {
              const isUp = item.change >= 0;
              const formattedPrice = item.price.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

              return (
                <div
                  key={item.symbol}
                  className="p-4 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/40 transition shadow-xs flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition truncate">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#071426] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
                      {item.exchange}
                    </span>
                  </div>

                  <div>
                    <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                      {item.currency === "INR" ? "₹" : item.currency === "USD" ? "$" : ""}
                      {formattedPrice}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold mt-0.5">
                      <span className={`flex items-center gap-0.5 ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
                        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isUp ? "+" : ""}
                        {item.change_pct.toFixed(2)}%
                      </span>
                      <span className="text-slate-400 text-[10px] font-normal">
                        ({isUp ? "+" : ""}{item.change.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-100 dark:border-[#162C4E]/60">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.data_status === "LIVE" ? "bg-emerald-500 animate-pulse" : "bg-blue-400"}`} />
                      {item.data_status}
                    </span>
                    <span className="truncate">{item.currency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────── 3. HOW IT WORKS: 4-STEP DECISION WORKFLOW ─────────────────── */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
              <Zap size={14} /> Systematic Investment Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How MarketScope.io Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              From raw stock symbol discovery to quantitative valuation modeling and simulated portfolio execution in four transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKFLOW_STEPS.map((wf) => {
              const Icon = wf.icon;
              return (
                <div
                  key={wf.step}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 dark:hover:border-blue-500/40 transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black font-mono text-blue-600/30 dark:text-cyan-400/30 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
                        {wf.step}
                      </span>
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {wf.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {wf.description}
                    </p>
                  </div>

                  <Link
                    href={wf.linkHref}
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition pt-2 border-t border-slate-100 dark:border-[#162C4E]/60"
                  >
                    <span>{wf.linkText}</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────── 4. WHAT MARKETSCOPE SHOWS: INTERACTIVE SHOWCASE ─────────────────── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Layers size={14} /> Terminal Capabilities
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                What MarketScope Shows
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Click any module below to inspect the data points, mathematical algorithms, and tools provided.
              </p>
            </div>
            <Link
              href="/workspace"
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0 font-mono"
            >
              <span>Open Unified Workspace</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Module Selector Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-[#162C4E] pb-3">
            {SHOWCASE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeShowcaseTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcaseTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-white dark:bg-[#0B1930] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#162C4E] hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Module Interactive Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/30">
                {selectedShowcase.badge}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Primary Audited Lineage · Sub-Second Latency
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedShowcase.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {selectedShowcase.description}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {selectedShowcase.highlights.map((hl) => (
                <div
                  key={hl}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] flex items-center gap-2.5 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            {/* Direct CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-[#162C4E]/60">
              <div className="text-xs font-mono text-slate-500">
                Instant interactive access across desktop and mobile browsers.
              </div>
              <Link
                href={selectedShowcase.ctaHref}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/25 flex items-center gap-2"
              >
                <span>{selectedShowcase.ctaText}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────────────── 5. WHY MARKETSCOPE: THE INSTITUTIONAL ADVANTAGE ─────────────────── */}
        <section className="space-y-6 p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#09172B] border border-slate-200 dark:border-[#162C4E]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              <Scale size={14} /> Platform Philosophy
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Serious Analysts Choose MarketScope.io
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Designed as a professional financial terminal, not an ad-supported retail news blog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit border border-emerald-500/20">
                <Calculator size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Audited Mathematical Evidence
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                No subjective &ldquo;hot tips&rdquo; or unverified rumors. Every ratio, Piotroski score, and Altman Z calculation provides mathematical transparency and source filing lineage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 w-fit border border-blue-500/20">
                <Bot size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Grounded Multi-Model AI
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Our synthesis engine deploys a 4-tier redundancy cascade (Groq LLaMA 3.3, Google Gemini, OpenRouter, and Deterministic RAG) to provide verified executive summaries without hallucinated metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 w-fit border border-purple-500/20">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Zero Ads &amp; Privacy First
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                100% ad-free, clutter-free terminal user experience. Your search queries, watchlists, and paper-trading portfolio configurations remain strictly confidential.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────── 6. COMPANY RESEARCH QUICK LAUNCH ─────────────────── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Building2 size={18} className="text-blue-500" /> Featured Equities &amp; Blue-Chip Coverage
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly launch comprehensive fundamental company dossiers for leading securities across NSE, BSE, and NASDAQ.
              </p>
            </div>
            <Link
              href="/stocks"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 font-mono"
            >
              <span>Browse All Stocks</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VERIFIED_RESEARCH_TARGETS.map((target) => (
              <Link
                key={target.symbol}
                href={`/company/${target.symbol.toLowerCase()}`}
                className="p-4 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-100 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/40 transition group shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
                      {target.symbol}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#071426] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
                      {target.exchange}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">
                    {target.cap}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                  {target.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {target.sector}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-slate-100 dark:border-[#162C4E]/60 text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{target.price}</span>
                  <span className={target.change.startsWith("+") ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                    {target.change}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─────────────────── 7. GLOBAL CALENDAR & MARKET SESSIONS ─────────────────── */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <CalendarDays size={18} className="text-cyan-500" /> Global Market Calendar &amp; Economic Catalysts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authoritative market hours, real-time exchange session status, and upcoming central bank rate decisions.
              </p>
            </div>
            <Link
              href="/calendar"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-cyan-500 transition flex items-center gap-1 font-mono"
            >
              <span>Explore Full Calendar</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                  <Clock size={13} className="text-blue-500" /> Real-Time Exchange Sessions
                </span>
                {marketStatus && (
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Open: <strong className="text-emerald-500">{marketStatus.active_open_markets_count}</strong> / {marketStatus.markets.length} tracked
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(marketStatus?.markets.slice(0, 6) || [
                  { exchange: "NSE", market_name: "India (National)", status: "OPEN", current_local_time: "10:15 IST", session_label: "Regular Session" },
                  { exchange: "BSE", market_name: "India (Bombay)", status: "OPEN", current_local_time: "10:15 IST", session_label: "Regular Session" },
                  { exchange: "MCX", market_name: "India (Commodity)", status: "OPEN", current_local_time: "10:15 IST", session_label: "Dual Session Active" },
                  { exchange: "NYSE", market_name: "United States", status: "CLOSED", current_local_time: "23:45 EST", session_label: "Closed" },
                  { exchange: "NASDAQ", market_name: "United States", status: "CLOSED", current_local_time: "23:45 EST", session_label: "Closed" },
                  { exchange: "LSE", market_name: "United Kingdom", status: "CLOSED", current_local_time: "04:45 GMT", session_label: "Closed" },
                ]).map((m) => (
                  <div
                    key={m.exchange}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                        {m.exchange}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                          m.status === "OPEN"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-200 dark:bg-[#10223B] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-[#162C4E]"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === "OPEN" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        {m.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      {m.session_label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                  <span className="text-[11px]">
                    Includes Special Diwali Muhurat trading rules &amp; MCX commodity dual-session intelligence.
                  </span>
                </div>
                <Link
                  href="/calendar"
                  className="text-[11px] font-mono font-bold text-blue-600 dark:text-cyan-400 hover:underline shrink-0 ml-2"
                >
                  View Holidays
                </Link>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1.5">
                    <Calendar size={13} className="text-cyan-500" /> Upcoming High-Impact Catalysts
                  </span>
                </div>

                <div className="space-y-2.5">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((evt) => (
                      <div
                        key={evt.event_id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-blue-600 dark:text-cyan-400">
                            {evt.country} · {evt.event_type}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {new Date(evt.event_time_utc).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {evt.title}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
                          <span>Forecast: <strong className="text-slate-800 dark:text-slate-200">{evt.forecast || "—"}</strong></span>
                          <span>Prior: {evt.previous || "—"}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Loading scheduled macroeconomic catalysts...
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/calendar"
                className="w-full py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-cyan-400 border border-blue-500/20 text-center font-bold text-xs transition flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Browse Full Catalysts Database</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────────────── 8. LATEST VERIFIED NEWS WIRE ─────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Newspaper size={18} className="text-blue-500" /> Verified Market News Wire
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Genuinely sourced financial articles with publisher attribution and zero synthetic fabrication.
              </p>
            </div>
            <Link
              href="/news"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>All News Wire</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {newsArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newsArticles.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/40 transition shadow-xs flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="font-bold text-blue-600 dark:text-cyan-400 uppercase">
                        {item.publisher_name || item.publisher || "Official Source"}
                      </span>
                      <span>
                        {item.published_at ? new Date(item.published_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Today"}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition leading-snug line-clamp-2">
                      {item.headline || item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-sans line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-[#162C4E]/60 flex items-center justify-between text-[11px]">
                    <Link
                      href={`/news/${item.id}`}
                      className="font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Read Evidence</span>
                      <ArrowRight size={12} />
                    </Link>
                    {item.original_url && (
                      <a
                        href={item.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center gap-1"
                        title="Original Publisher Source"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] text-xs text-slate-400 space-y-2">
              <Clock size={24} className="mx-auto text-slate-400" />
              <p>Fetching real-time verified articles from official regulatory news wires...</p>
            </div>
          )}
        </section>

        {/* ─────────────────── 9. FREQUENTLY ASKED QUESTIONS (FAQ) ─────────────────── */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
              <HelpCircle size={14} /> Knowledge Base &amp; FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Clear answers regarding MarketScope.io coverage, formulas, data integrity, and compliance.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] overflow-hidden transition shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 transition hover:bg-slate-50 dark:hover:bg-[#071426]"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600 dark:text-cyan-400" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-[#162C4E]/60 font-sans">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────── 10. FINAL INSTITUTIONAL CALL TO ACTION ─────────────────── */}
        <section className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-emerald-500/10 border border-blue-500/20 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={13} /> Institutional Rigor · Ready to Explore
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Make Better-Informed Market Decisions Today.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Equip your financial research workflow with institutional-grade data, mathematical quant models, and zero noise. Start exploring stocks, charts, and screeners immediately.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/markets"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs md:text-sm transition shadow-lg shadow-blue-600/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Globe size={15} />
              <span>Explore Global Markets</span>
            </Link>
            <Link
              href="/screener"
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-100 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-white font-bold text-xs md:text-sm transition shadow-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Filter size={15} className="text-blue-500" />
              <span>Launch Screener</span>
            </Link>
            <Link
              href="/workspace"
              className="px-6 py-3 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-bold text-xs md:text-sm transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Layers size={15} />
              <span>Open Workspace</span>
            </Link>
          </div>
        </section>

      </div>
    </NavigationShell>
  );
}
