"use client";

import { useState, useEffect } from "react";
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
  Activity,
  AlertTriangle,
  Clock,
  ExternalLink,
  Sliders,
  Cpu,
  FileCheck2,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getQIntelligenceScorecard,
  getStandardAIDossier,
  getMarketRegime,
  type QIntelligenceScorecard,
  type StandardResearchDossier,
  type RegimeStateOutput,
} from "@/lib/api";

const QUICK_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE" },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE" },
  { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "NSE" },
  { symbol: "INFY", name: "Infosys", exchange: "NSE" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ" },
];

const RESEARCH_MODULES = [
  {
    icon: Search,
    title: "Universal Stock Discovery",
    desc: "Search through all listed instruments across NSE, BSE, NASDAQ, and NYSE by symbol, ISIN, sector, or market cap.",
    href: "/stocks",
    badge: "5,000+ Stocks",
  },
  {
    icon: Filter,
    title: "Quantitative Screener",
    desc: "Build multi-factor investment screens across 15 audited financial metrics, including ROE, ROCE, Debt/Equity, and P/E.",
    href: "/screener",
    badge: "Filters",
  },
  {
    icon: LineChart,
    title: "Interactive Charts Terminal",
    desc: "HTML5 canvas charting powered by TradingView Lightweight Charts v5 with 14 technical indicators and drawing tools.",
    href: "/charts",
    badge: "Lightweight Charts v5",
  },
  {
    icon: BarChart2,
    title: "Peer Comparison Matrix",
    desc: "Benchmark companies side-by-side against industry peers across valuation multiples, margin profiles, and efficiency.",
    href: "/compare",
    badge: "Valuation",
  },
  {
    icon: Layers,
    title: "Derivatives & Market Flow",
    desc: "Analyze option chains, Black-Scholes Greeks, Max Pain levels, Futures Open Interest build-ups, and Mansfield RS.",
    href: "/derivatives",
    badge: "F&O Greeks",
  },
  {
    icon: Sparkles,
    title: "Strategy Backtesting",
    desc: "Simulate quantitative rules-based strategies with zero lookahead, 0.05% realistic slippage, and fee modeling.",
    href: "/backtesting",
    badge: "Zero-Lookahead",
  },
];

export default function ResearchPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("RELIANCE");
  const [searchQuery, setSearchQuery] = useState("");
  const [scorecard, setScorecard] = useState<QIntelligenceScorecard | null>(null);
  const [dossier, setDossier] = useState<StandardResearchDossier | null>(null);
  const [regime, setRegime] = useState<RegimeStateOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getQIntelligenceScorecard(selectedSymbol).catch(() => null),
      getStandardAIDossier(selectedSymbol).catch(() => null),
      getMarketRegime("NIFTY 50").catch(() => null),
    ])
      .then(([qData, dData, rData]) => {
        if (qData) setScorecard(qData);
        if (dData) setDossier(dData);
        if (rData) setRegime(rData);
      })
      .finally(() => setLoading(false));
  }, [selectedSymbol]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedSymbol(searchQuery.trim().toUpperCase());
      setSearchQuery("");
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "STRONG":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "FAVORABLE":
        return "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
      case "BALANCED":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <NavigationShell activePath="/research">
      <div className="max-w-7xl mx-auto space-y-10 py-4 pb-16">
        
        {/* ─────────────────── Header & Search ─────────────────── */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Cpu size={14} /> Unified Institutional Research Workstation
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial Intelligence &amp; Quantitative Research
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Grounded multi-factor Q-Intelligence, audited financial ratios, causal market regime detection, and transparent 11-part AI research dossiers.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Analyze any stock (e.g. RELIANCE, TCS, HDFCBANK, INFY, AAPL)..."
                className="w-full bg-white dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] focus:border-blue-500 rounded-2xl pl-12 pr-28 py-3.5 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/30 flex items-center gap-1"
              >
                <span>Evaluate</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>

          {/* Quick Target Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Quick Targets:</span>
            {QUICK_STOCKS.map((s) => (
              <button
                key={s.symbol}
                onClick={() => setSelectedSymbol(s.symbol)}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition text-xs ${
                  selectedSymbol === s.symbol
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-[#0B1930] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#162C4E] hover:border-blue-400"
                }`}
              >
                {s.symbol}
              </button>
            ))}
          </div>
        </section>

        {/* ─────────────────── Live Market Regime Context Banner ─────────────────── */}
        {regime && (
          <section className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Activity size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Macro Market Regime</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">{regime.dominant_regime}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E]">
                Trend: <strong>{regime.trend_regime}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E]">
                Vol: <strong>{regime.volatility_regime}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E]">
                Risk: <strong className="text-emerald-500">{regime.risk_appetite}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Confidence: {(regime.regime_confidence * 100).toFixed(0)}%
              </span>
            </div>
          </section>
        )}

        {/* ─────────────────── Q-Intelligence Ensemble Scorecard ─────────────────── */}
        <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#162C4E]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase">
                <Sparkles size={14} /> MarketScope Q-Intelligence v3.0 Ensemble
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {scorecard?.company_name || selectedSymbol} ({selectedSymbol})
              </h2>
            </div>

            {scorecard && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Composite Q-Score</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {scorecard.composite_q_score}
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getRatingBadge(scorecard.composite_rating)}`}>
                      {scorecard.composite_rating}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
              Calculating 9-vector quantitative ensemble scores...
            </div>
          ) : scorecard ? (
            <div className="space-y-6">
              {/* Factor Contribution Matrix */}
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase pb-3">
                  Ensemble Factor Breakdown &amp; Attribution Weights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {scorecard.factor_breakdown.map((f) => (
                    <div
                      key={f.factor_name}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{f.factor_name}</span>
                        <span className="text-blue-600 dark:text-cyan-400 font-bold">{f.raw_score}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-[#10223B] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-cyan-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, f.raw_score)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {f.key_driver}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Risk Factors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Quantitative Strengths
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {scorecard.top_strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase flex items-center gap-1.5">
                    <AlertTriangle size={13} /> Risk &amp; Uncertainty Factors
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {scorecard.top_risks.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* ─────────────────── Standard 11-Part AI Research Dossier ─────────────────── */}
        {dossier && (
          <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
              <div className="flex items-center gap-2">
                <FileCheck2 size={18} className="text-cyan-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Multi-Agent Grounded Research Dossier
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                100% Traceable Lineage
              </span>
            </div>

            {/* Executive Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Executive Summary</span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans font-medium">
                {dossier.executive_summary}
              </p>
            </div>

            {/* Verified Facts & Analytical Findings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase">
                  Verified Empirical Facts
                </span>
                <ul className="space-y-1.5">
                  {dossier.verified_facts.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-slate-200">
                      <CheckCircle2 size={13} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase">
                  Analytical Findings &amp; Transmission
                </span>
                <ul className="space-y-1.5">
                  {dossier.analytical_findings.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-slate-200">
                      <Sparkles size={13} className="text-cyan-500 shrink-0 mt-0.5" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Traceable Citations Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#162C4E]/60 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase block font-semibold">
                Traceable Regulatory &amp; Model Citations
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {dossier.source_citations.map((c) => (
                  <a
                    key={c.citation_id}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-50 dark:bg-[#071426] hover:bg-slate-100 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
                  >
                    <span className="font-bold text-blue-600 dark:text-cyan-400">[{c.citation_id}]</span>
                    <span>{c.source_name}</span>
                    <ExternalLink size={10} className="text-slate-400" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─────────────────── Research Modules Grid ─────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles size={18} className="text-blue-500" /> Specialized Research Engines
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

        {/* ─────────────────── Non-Custodial Research Notice ─────────────────── */}
        <section className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-slate-700 dark:text-slate-300 text-xs flex items-start gap-3">
          <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong>Compliance Notice:</strong> MarketScope.io is an independent financial technology and quantitative research platform. All analytical outputs, factor models, and backtesting metrics are generated for educational and analytical decision support only. We do not provide personalized investment advice, guaranteed return forecasts, or brokerage trade execution.
          </p>
        </section>
      </div>
    </NavigationShell>
  );
}
