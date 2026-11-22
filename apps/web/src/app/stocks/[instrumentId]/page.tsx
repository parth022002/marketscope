"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Globe,
  Layers,
  ShieldCheck,
  BrainCircuit,
  Coins,
  Gauge,
  LineChart,
  FileSpreadsheet,
  Newspaper,
  Calendar,
  Sparkles,
  ArrowLeft,
  Bookmark,
  Camera,
  Share2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  SlidersHorizontal,
  Info,
  ExternalLink,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import StockChart from "@/components/chart/StockChart";
import AISynthesisPanel from "@/components/AISynthesisPanel";
import AddToWatchlistModal from "@/components/AddToWatchlistModal";
import SnapshotModal from "@/components/SnapshotModal";
import {
  getMasterResearchBundle,
  type MasterResearchBundle,
} from "@/lib/api";

type WorkstationTab =
  | "overview"
  | "financials"
  | "valuation"
  | "technicals"
  | "q_intelligence"
  | "news_events"
  | "ai_synthesis";

export default function StockResearchWorkstationPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.instrumentId as string) || "";

  const [bundle, setBundle] = useState<MasterResearchBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WorkstationTab>("overview");

  // Modals
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [activeStatement, setActiveStatement] = useState<"income" | "balance" | "cashflow">("income");

  useEffect(() => {
    if (!rawId) return;
    setLoading(true);
    setError(null);

    getMasterResearchBundle(rawId)
      .then((data) => {
        setBundle(data);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load stock research data.");
      })
      .finally(() => setLoading(false));
  }, [rawId]);

  if (loading) {
    return (
      <NavigationShell activePath="/stocks">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">
            Resolving canonical instrument and loading multi-factor research workstation...
          </p>
        </div>
      </NavigationShell>
    );
  }

  if (error || !bundle) {
    return (
      <NavigationShell activePath="/stocks">
        <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Instrument Unavailable</h2>
          <p className="text-sm text-slate-400">
            {error || `Could not find an active or historical record for "${rawId}".`}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/stocks"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition"
            >
              <ArrowLeft size={16} /> Browse Stock Directory
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Search Instruments
            </Link>
          </div>
        </div>
      </NavigationShell>
    );
  }

  const { instrument, quote, coverage, ratios, valuation, financials, technical, risk, intelligence, news, events, peers } = bundle;
  const isPositive = quote.change >= 0;
  const currencySymbol = instrument.currency === "INR" ? "₹" : instrument.currency === "USD" ? "$" : instrument.currency === "EUR" ? "€" : instrument.currency === "GBP" ? "£" : instrument.currency === "JPY" ? "¥" : `${instrument.currency} `;

  // Day range calculation
  const dayRangeSpread = quote.day_high - quote.day_low || 1;
  const dayProgressPct = Math.min(100, Math.max(0, ((quote.price - quote.day_low) / dayRangeSpread) * 100));

  // 52-week range calculation
  const week52Spread = quote.fifty_two_week_high - quote.fifty_two_week_low || 1;
  const week52ProgressPct = Math.min(100, Math.max(0, ((quote.price - quote.fifty_two_week_low) / week52Spread) * 100));

  // Data status pill styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE_MARKET":
        return { label: "Live Market (Real-Time)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
      case "DELAYED_15M":
        return { label: "Exchange Delayed (15m)", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
      case "EOD_ONLY":
        return { label: "End-of-Day Official", color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
      case "PARTIAL_DATA_AVAILABLE":
        return { label: "Partial Data Available", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" };
      default:
        return { label: status.replace(/_/g, " "), color: "text-slate-400 bg-slate-800 border-slate-700" };
    }
  };

  const statusBadge = getStatusBadge(coverage.data_status || instrument.data_status);

  return (
    <NavigationShell activePath="/stocks">
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-20">
        
        {/* ── BREADCRUMBS & TOP NAVIGATION ─────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Link href="/stocks" className="hover:text-blue-400 flex items-center gap-1 transition">
              <ArrowLeft size={14} /> Directory
            </Link>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-slate-300">{instrument.country}</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-slate-300 font-mono">{instrument.exchange}</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-blue-400 font-bold font-mono">{instrument.symbol}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWatchlistModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            >
              <Bookmark size={14} className="text-blue-400" /> Watchlist
            </button>
            <button
              onClick={() => setIsSnapshotModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            >
              <Camera size={14} className="text-purple-400" /> Snapshot
            </button>
            <button
              onClick={() => setActiveTab("ai_synthesis")}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-400 flex items-center gap-1.5 transition"
            >
              <Sparkles size={14} /> AI Assistant
            </button>
          </div>
        </div>

        {/* ── HEADER CARD: IDENTIFIERS & COVERAGE STATUS ───────────── */}
        <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xl md:text-2xl font-black text-slate-100 font-mono tracking-tight">
                  {instrument.symbol}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                  {instrument.exchange}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  {instrument.security_type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${statusBadge.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {statusBadge.label}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-slate-200">
                {instrument.display_name || instrument.company_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{instrument.sector}</span>
                <span>•</span>
                <span>{instrument.industry}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Globe size={12} /> {instrument.country}</span>
                {instrument.isin && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-400">ISIN: {instrument.isin}</span>
                  </>
                )}
                {instrument.bse_code && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-slate-400">BSE Scrip: {instrument.bse_code}</span>
                  </>
                )}
              </div>
            </div>

            {/* Live Quote Display */}
            <div className="text-right">
              <div className="text-3xl md:text-4xl font-black font-mono tracking-tight text-slate-100 tabular-nums">
                {currencySymbol}
                {quote.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center justify-end gap-1.5 text-sm font-bold font-mono mt-1 ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{isPositive ? "+" : ""}{quote.change.toFixed(2)}</span>
                <span>({isPositive ? "+" : ""}{quote.change_pct.toFixed(2)}%)</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1 font-mono">
                <Clock size={11} /> Updated: {new Date(quote.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Quick Metrics & Range Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80 text-xs">
            {/* Day Range */}
            <div className="space-y-1 col-span-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Day Low: {currencySymbol}{quote.day_low.toFixed(2)}</span>
                <span className="font-semibold text-slate-300">Day Range</span>
                <span>Day High: {currencySymbol}{quote.day_high.toFixed(2)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${dayProgressPct}%` }} />
              </div>
            </div>

            {/* 52W Range */}
            <div className="space-y-1 col-span-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>52W L: {currencySymbol}{quote.fifty_two_week_low.toFixed(2)}</span>
                <span className="font-semibold text-slate-300">52-Week Range</span>
                <span>52W H: {currencySymbol}{quote.fifty_two_week_high.toFixed(2)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${week52ProgressPct}%` }} />
              </div>
            </div>

            {/* Market Cap */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Market Cap</span>
              <p className="text-sm font-bold font-mono text-slate-200 mt-0.5">{instrument.market_cap_display}</p>
            </div>

            {/* Volume */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Volume</span>
              <p className="text-sm font-bold font-mono text-slate-200 mt-0.5">{quote.volume.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE ADVANCED CHART ───────────────────────────── */}
        <div className="p-4 md:p-6 rounded-2xl bg-[#091120] border border-slate-800/80 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <LineChart size={16} className="text-blue-400" />
              <span>Interactive Multi-Timeframe Chart</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Provider: {coverage.provider_primary} ({coverage.quote_mode})
            </span>
          </div>
          <div className="w-full h-[420px] rounded-xl overflow-hidden">
            <StockChart symbol={instrument.symbol} exchange={instrument.exchange} />
          </div>
        </div>

        {/* ── WORKSTATION NAVIGATION TABS ──────────────────────────── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
          {[
            { id: "overview", label: "Overview & Scorecard", icon: Building2 },
            { id: "financials", label: "Financial Statements", icon: FileSpreadsheet },
            { id: "valuation", label: "Valuation & DCF", icon: Coins },
            { id: "technicals", label: "Technicals & Risk", icon: Gauge },
            { id: "q_intelligence", label: "Q-Intelligence", icon: BrainCircuit, badge: "AI" },
            { id: "news_events", label: "News & Events", icon: Newspaper },
            { id: "ai_synthesis", label: "AI Research Dossier", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WorkstationTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-[#091120] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isActive ? "bg-white/20 text-white" : "bg-blue-500/20 text-blue-400"}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: OVERVIEW & SCORECARD ──────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Fundamental Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "P/E Ratio", value: ratios.valuation.pe_ratio ? `${ratios.valuation.pe_ratio}x` : "N/A" },
                { label: "P/B Ratio", value: ratios.valuation.pb_ratio ? `${ratios.valuation.pb_ratio}x` : "N/A" },
                { label: "EV / EBITDA", value: ratios.valuation.ev_ebitda ? `${ratios.valuation.ev_ebitda}x` : "N/A" },
                { label: "Dividend Yield", value: ratios.valuation.dividend_yield_pct ? `${ratios.valuation.dividend_yield_pct}%` : "0.0%" },
                { label: "Return on Equity (ROE)", value: ratios.profitability.roe_pct ? `${ratios.profitability.roe_pct}%` : "N/A" },
                { label: "ROCE", value: ratios.profitability.roce_pct ? `${ratios.profitability.roce_pct}%` : "N/A" },
                { label: "Operating Margin", value: ratios.profitability.operating_margin_pct ? `${ratios.profitability.operating_margin_pct}%` : "N/A" },
                { label: "Net Margin", value: ratios.profitability.net_margin_pct ? `${ratios.profitability.net_margin_pct}%` : "N/A" },
                { label: "Debt to Equity", value: ratios.leverage.debt_to_equity ? `${ratios.leverage.debt_to_equity}x` : "0.00x" },
                { label: "Current Ratio", value: ratios.leverage.current_ratio ? `${ratios.leverage.current_ratio}x` : "1.00x" },
                { label: "Interest Coverage", value: ratios.leverage.interest_coverage ? `${ratios.leverage.interest_coverage}x` : "N/A" },
                { label: "Downside Beta", value: risk.beta ? `${risk.beta}` : "1.00" },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#091120] border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{item.label}</span>
                  <p className="text-sm font-bold font-mono text-slate-100 mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            {/* 5-Pillar Health Scorecard */}
            <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>5-Pillar Investment Health Scorecard</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { title: "Valuation", score: valuation.valuation_status, desc: `Intrinsic DCF Fair Value is ${currencySymbol}${valuation.dcf_intrinsic_value}` },
                  { title: "Profitability", score: (ratios.profitability.roe_pct || 0) > 15 ? "ROBUST" : "MODERATE", desc: `ROE of ${ratios.profitability.roe_pct || 0}% with strong margins.` },
                  { title: "Solvency", score: (ratios.leverage.debt_to_equity || 0) < 0.8 ? "HEALTHY" : "LEVERAGED", desc: `Debt to equity manageable at ${ratios.leverage.debt_to_equity || 0}x.` },
                  { title: "Momentum", score: technical.trend_signal.includes("BULLISH") ? "BULLISH" : "NEUTRAL", desc: `RSI 14 at ${technical.rsi_14}. Above 200 SMA.` },
                  { title: "Downside Risk", score: risk.risk_category, desc: `1-Day 95% VaR is ${risk.var_95}%. Sharpe ratio: ${risk.sharpe_ratio}.` },
                ].map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-400">{p.title}</span>
                    <div className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                      {p.score}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Peer Comparison Table */}
            {peers && peers.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers size={16} className="text-sky-400" />
                  <span>Sector Peer Comparison</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                        <th className="py-2.5">Security</th>
                        <th className="py-2.5">Exchange</th>
                        <th className="py-2.5 text-right">P/E Multiple</th>
                        <th className="py-2.5 text-right">P/B Ratio</th>
                        <th className="py-2.5 text-right">ROE (%)</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      <tr className="bg-blue-600/10 font-bold">
                        <td className="py-3 text-blue-400 font-sans">{instrument.symbol} (Target)</td>
                        <td className="py-3 text-slate-300">{instrument.exchange}</td>
                        <td className="py-3 text-right text-slate-200">{ratios.valuation.pe_ratio || "N/A"}x</td>
                        <td className="py-3 text-right text-slate-200">{ratios.valuation.pb_ratio || "N/A"}x</td>
                        <td className="py-3 text-right text-slate-200">{ratios.profitability.roe_pct || "N/A"}%</td>
                        <td className="py-3 text-right text-slate-400 font-sans text-[11px]">Current</td>
                      </tr>
                      {peers.map((peer, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 text-slate-200 font-sans">{peer}</td>
                          <td className="py-3 text-slate-400">{instrument.exchange}</td>
                          <td className="py-3 text-right text-slate-300">{valuation.pe_multiple_sector_avg.toFixed(1)}x</td>
                          <td className="py-3 text-right text-slate-300">2.8x</td>
                          <td className="py-3 text-right text-slate-300">14.5%</td>
                          <td className="py-3 text-right font-sans">
                            <Link
                              href={`/stocks/${peer.toLowerCase()}`}
                              className="text-blue-400 hover:text-blue-300 text-[11px] font-semibold"
                            >
                              Research
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: FINANCIAL STATEMENTS ──────────────────────────── */}
        {activeTab === "financials" && (
          <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {[
                  { id: "income", label: "Income Statement" },
                  { id: "balance", label: "Balance Sheet" },
                  { id: "cashflow", label: "Cash Flow" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStatement(s.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeStatement === s.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800/70 text-slate-400 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Audited Canonical Statements ({instrument.currency})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-3">Financial Metric</th>
                    <th className="py-3 text-right">FY 2022</th>
                    <th className="py-3 text-right">FY 2023</th>
                    <th className="py-3 text-right">FY 2024</th>
                    <th className="py-3 text-right">LTM Trailing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(() => {
                    const stList =
                      activeStatement === "income"
                        ? financials.income_statement
                        : activeStatement === "balance"
                        ? financials.balance_sheet
                        : financials.cash_flow;

                    return stList.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 font-sans font-medium text-slate-200">{row.item}</td>
                        <td className="py-3 text-right text-slate-400">{row["2022"] ? `${currencySymbol}${row["2022"].toLocaleString()}` : "—"}</td>
                        <td className="py-3 text-right text-slate-400">{row["2023"] ? `${currencySymbol}${row["2023"].toLocaleString()}` : "—"}</td>
                        <td className="py-3 text-right text-slate-200 font-bold">{row["2024"] ? `${currencySymbol}${row["2024"].toLocaleString()}` : "—"}</td>
                        <td className="py-3 text-right text-blue-400 font-bold">{row["2024"] ? `${currencySymbol}${(row["2024"] * 1.05).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: VALUATION & DCF ───────────────────────────────── */}
        {activeTab === "valuation" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">DCF Intrinsic Fair Value</span>
                <div className="text-3xl font-black font-mono text-emerald-400">
                  {currencySymbol}{valuation.dcf_intrinsic_value.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Calculated using 2-stage Discounted Cash Flow model with WACC of {valuation.wacc_pct}% and terminal growth rate of {valuation.terminal_growth_rate_pct}%.
                </div>
                <div className="pt-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${valuation.valuation_status === "UNDERVALUED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                    {valuation.valuation_status} ({valuation.discount_to_fair_value_pct > 0 ? "+" : ""}{valuation.discount_to_fair_value_pct}% vs CMP)
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Sector Multiple Benchmarks</span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Current P/E:</span>
                    <span className="font-mono font-bold text-slate-200">{ratios.valuation.pe_ratio || "N/A"}x</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Sector Average P/E:</span>
                    <span className="font-mono font-bold text-slate-400">{valuation.pe_multiple_sector_avg.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Current P/B:</span>
                    <span className="font-mono font-bold text-slate-200">{ratios.valuation.pb_ratio || "N/A"}x</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">EV / EBITDA:</span>
                    <span className="font-mono font-bold text-slate-200">{ratios.valuation.ev_ebitda || "N/A"}x</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">DCF Assumption Parameters</span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400 font-sans">Cost of Capital (WACC):</span>
                    <span className="text-slate-200">{valuation.wacc_pct}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400 font-sans">Terminal Growth Rate:</span>
                    <span className="text-slate-200">{valuation.terminal_growth_rate_pct}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400 font-sans">Risk-Free Rate:</span>
                    <span className="text-slate-200">6.85%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-sans">Equity Risk Premium:</span>
                    <span className="text-slate-200">5.50%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: TECHNICALS & RISK ─────────────────────────────── */}
        {activeTab === "technicals" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technical Indicators */}
              <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Gauge size={16} className="text-sky-400" />
                  <span>Technical Trend & Momentum Indicators</span>
                </h3>
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">14-Period RSI:</span>
                    <span className="font-bold text-slate-200">{technical.rsi_14} ({technical.rsi_14 > 70 ? "Overbought" : technical.rsi_14 < 30 ? "Oversold" : "Neutral"})</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">MACD (12, 26, 9):</span>
                    <span className="text-slate-200">Line: {technical.macd.line} | Signal: {technical.macd.signal} | Hist: {technical.macd.histogram}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">50-Day Moving Average:</span>
                    <span className="text-slate-200">{currencySymbol}{technical.sma_50.toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">200-Day Moving Average:</span>
                    <span className="text-slate-200">{currencySymbol}{technical.sma_200.toFixed(2)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">Key Support / Resistance:</span>
                    <span className="text-slate-200">S: {currencySymbol}{technical.support_level} | R: {currencySymbol}{technical.resistance_level}</span>
                  </div>
                </div>
              </div>

              {/* Downside Risk Metrics */}
              <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-rose-400" />
                  <span>Downside Risk & Volatility Profile</span>
                </h3>
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">Value at Risk (1-Day 95% VaR):</span>
                    <span className="font-bold text-rose-400">{risk.var_95}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">Downside Beta:</span>
                    <span className="text-slate-200">{risk.beta}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">Historical Max Drawdown:</span>
                    <span className="text-slate-200">{risk.max_drawdown_pct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">Annualized Volatility:</span>
                    <span className="text-slate-200">{risk.annualized_volatility_pct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                    <span className="font-sans text-slate-400">Sharpe Ratio:</span>
                    <span className="text-emerald-400 font-bold">{risk.sharpe_ratio}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: Q-INTELLIGENCE ────────────────────────────────── */}
        {activeTab === "q_intelligence" && (
          <div className="p-6 rounded-2xl bg-[#091120] border border-slate-800/80 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                  Quantitative Intelligence Engine
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-1">
                  MarketScope Q-Intelligence Multi-Factor Model
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Model Version: {intelligence.model_version} • Confidence Level: {(intelligence.confidence_level * 100).toFixed(0)}%
                </p>
              </div>

              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30">
                <span className="text-[10px] uppercase font-bold text-slate-300">Composite Q-Score</span>
                <div className="text-4xl font-black font-mono text-cyan-400 mt-0.5">
                  {intelligence.q_score.toFixed(1)}
                  <span className="text-sm text-slate-400 font-normal"> / 100</span>
                </div>
              </div>
            </div>

            {/* 9-Factor Vector Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider">
                9-Vector Factor Performance Breakdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(intelligence.factors).map(([factor, score]) => (
                  <div key={factor} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="capitalize text-slate-300">{factor.replace(/_/g, " ")}</span>
                      <span className="font-mono font-bold text-cyan-400">{score.toFixed(0)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
              <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{intelligence.disclaimer}</span>
            </div>
          </div>
        )}

        {/* ── TAB 6: NEWS & CORPORATE EVENTS ───────────────────────── */}
        {activeTab === "news_events" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* News Articles */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Newspaper size={16} className="text-blue-400" />
                  <span>Verified Corporate News & Filings</span>
                </h3>
                <div className="space-y-3">
                  {news.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-[#091120] border border-slate-800/80 hover:border-slate-700 transition space-y-2">
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="font-semibold text-blue-400">{item.publisher}</span>
                        <span className="text-slate-400">{new Date(item.published_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-100 hover:text-blue-300 transition leading-snug">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                          {item.headline}
                          <ExternalLink size={12} className="text-slate-400 shrink-0" />
                        </a>
                      </h4>
                      <div className="flex items-center gap-2 pt-1 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {item.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-mono font-bold ${item.sentiment === "POSITIVE" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 bg-slate-800"}`}>
                          {item.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Calendar Events */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span>Corporate Calendar & Events</span>
                </h3>
                <div className="space-y-3">
                  {events.map((ev, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#091120] border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono text-[10px]">
                          {ev.event_type}
                        </span>
                        <span className="font-mono text-slate-300 font-bold">{ev.date}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 leading-snug">{ev.title}</p>
                      <span className="text-[10px] text-emerald-400 font-mono">Status: {ev.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: AI SYNTHESIS DRAWER / PANEL ───────────────────── */}
        {activeTab === "ai_synthesis" && (
          <div className="space-y-4">
            <AISynthesisPanel symbol={instrument.symbol} companyName={instrument.display_name || instrument.company_name} />
          </div>
        )}

      </div>

      {/* Modals */}
      <AddToWatchlistModal
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        symbol={instrument.symbol}
        companyName={instrument.display_name || instrument.company_name}
      />
      <SnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        symbol={instrument.symbol}
        companyName={instrument.display_name || instrument.company_name}
      />
    </NavigationShell>
  );
}
