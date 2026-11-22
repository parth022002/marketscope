"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  TrendingUp,
  BarChart2,
  LineChart,
  FileSpreadsheet,
  Globe,
  ArrowRight,
  Sparkles,
  Building2,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const VERIFIED_RESEARCH_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", sector: "Energy & Conglomerate", exchange: "NSE", mcap: "₹19.4L Cr", pe: 24.2, roe: "14.8%" },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd", sector: "IT Services", exchange: "NSE", mcap: "₹15.2L Cr", pe: 28.5, roe: "48.2%" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking & Financials", exchange: "NSE", mcap: "₹13.1L Cr", pe: 18.9, roe: "16.4%" },
  { symbol: "INFY", name: "Infosys Ltd", sector: "IT Services", exchange: "NSE", mcap: "₹7.8L Cr", pe: 26.1, roe: "31.5%" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Banking & Financials", exchange: "NSE", mcap: "₹9.2L Cr", pe: 17.4, roe: "18.2%" },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Consumer Tech", exchange: "NASDAQ", mcap: "$3.45T", pe: 33.2, roe: "147.2%" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Enterprise Software & Cloud", exchange: "NASDAQ", mcap: "$3.15T", pe: 34.8, roe: "38.5%" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Semiconductors & AI", exchange: "NASDAQ", mcap: "$3.52T", pe: 52.4, roe: "115.4%" },
];

const RESEARCH_MODULES = [
  {
    icon: Search,
    title: "Universal Stock Discovery",
    desc: "Search and filter through all listed instruments across NSE, BSE, NASDAQ, and NYSE by symbol, ISIN, sector, or market cap.",
    href: "/stocks",
    badge: "Database",
  },
  {
    icon: Filter,
    title: "Quantitative Screener",
    desc: "Build multi-factor investment screens across 15 audited financial metrics, including ROE, ROCE, Debt/Equity, P/E, and Free Cash Flow.",
    href: "/screener",
    badge: "Filters",
  },
  {
    icon: LineChart,
    title: "Interactive Charts Terminal",
    desc: "HTML5 canvas charting powered by TradingView Lightweight Charts v5 with 10 technical indicators and vector drawing tools.",
    href: "/charts",
    badge: "Technical",
  },
  {
    icon: BarChart2,
    title: "Peer Comparison Matrix",
    desc: "Benchmark companies side-by-side against industry peers across valuation multiples, margin profiles, and operational efficiency.",
    href: "/compare",
    badge: "Valuation",
  },
  {
    icon: Layers,
    title: "Derivatives & Market Flow",
    desc: "Analyze option chains, Black-Scholes Greeks, Max Pain levels, Futures Open Interest build-ups, and Mansfield Relative Strength.",
    href: "/derivatives",
    badge: "F&O Pulse",
  },
  {
    icon: Sparkles,
    title: "Strategy Backtesting",
    desc: "Simulate quantitative rules-based strategies (MA Crossover, RSI Reversion, Supertrend) with zero lookahead and realistic slippage.",
    href: "/backtesting",
    badge: "Simulation",
  },
];

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <NavigationShell activePath="/research">
      <div className="max-w-6xl mx-auto space-y-12 py-4">
        {/* Research Hero Header */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
            <Sparkles size={13} /> Institutional Research Workstation
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Research &amp; Analysis
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Deep fundamental metrics, primary regulatory filing evidence, quantitative screeners, and interactive charting in one unified environment.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="pt-3 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any stock by name, symbol, or ISIN (e.g. TCS, Reliance, AAPL)..."
                className="w-full bg-white dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] focus:border-blue-500 rounded-2xl pl-12 pr-28 py-3.5 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/30 flex items-center gap-1"
              >
                <span>Search</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </section>

        {/* Research Capabilities Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500" /> Research Intelligence Modules
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Institutional-grade analytical tools built for evidence-backed market research.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESEARCH_MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.title}
                  href={mod.href}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/40 transition group shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-105 transition">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#071426] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
                        {mod.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
                      {mod.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 pt-2 border-t border-slate-100 dark:border-[#162C4E]/60">
                    <span>Open Module</span>
                    <ChevronRight size={13} className="group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Verified Research Company Targets */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Building2 size={18} className="text-cyan-500" /> Featured Company Research Dossiers
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified financial statements, 15 golden ratios, and interactive charts.
              </p>
            </div>
            <Link
              href="/stocks"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All Stocks</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {VERIFIED_RESEARCH_STOCKS.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/company/${stock.symbol.toLowerCase()}`}
                className="p-4 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/40 transition group shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
                    {stock.symbol}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#071426] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
                    {stock.exchange}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {stock.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-[#162C4E]/60">
                  <span>P/E: <strong className="text-slate-700 dark:text-slate-200">{stock.pe}</strong></span>
                  <span>ROE: <strong className="text-emerald-500">{stock.roe}</strong></span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Non-Custodial Research Disclaimer */}
        <section className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-start gap-2.5">
          <ShieldCheck size={18} className="shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Educational &amp; Analytical Research Notice:</strong> MarketScope.io is an independent market intelligence platform. All financial models, ratios, and backtest results are for informational research purposes only and do not constitute financial advice or trade recommendations.
          </p>
        </section>
      </div>
    </NavigationShell>
  );
}
