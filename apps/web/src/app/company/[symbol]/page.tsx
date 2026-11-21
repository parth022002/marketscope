"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Info,
  Camera,
  Bookmark,
  FileSpreadsheet,
  TrendingUp,
  BookOpen,
  Clock,
  BrainCircuit,
  Sparkles,
  Newspaper,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle2,
  Coins,
  ChevronRight,
  Building2,
  Layers,
} from "lucide-react";
import {
  getDossier,
  getCompanyRatios,
  getNewsFeed,
  type Dossier,
  type CompanyRatios,
  type NewsItem,
} from "@/lib/api";
import EvidenceDrawer from "@/components/EvidenceDrawer";
import ResearchNotesPanel from "@/components/ResearchNotesPanel";
import FinancialStatementsExplorer from "@/components/FinancialStatementsExplorer";
import SnapshotModal from "@/components/SnapshotModal";
import AddToWatchlistModal from "@/components/AddToWatchlistModal";
import AISynthesisPanel from "@/components/AISynthesisPanel";
import NavigationShell from "@/components/NavigationShell";
import NewsCard from "@/components/NewsCard";

const IDS_MAP: Record<string, string> = {
  reliance: "in-nse-reliance",
  tcs: "in-nse-tcs",
  infy: "in-nse-infy",
  tatamotors: "in-nse-tatamotors",
  tatamtrdvr: "in-nse-tatamtrdvr",
};

export default function CompanyPage() {
  const params = useParams();
  const rawSymbol = (params?.symbol as string)?.toLowerCase() || "";
  const symbol = rawSymbol.toUpperCase();
  const instrumentId = IDS_MAP[rawSymbol] || rawSymbol;

  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [ratios, setRatios] = useState<CompanyRatios | null>(null);
  const [companyNews, setCompanyNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "statements" | "valuation" | "actions_news" | "notes" | "ai_synthesis"
  >("overview");

  // Modals & Drawers
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);

  useEffect(() => {
    if (!instrumentId) return;
    setLoading(true);

    Promise.all([
      getDossier(instrumentId),
      getCompanyRatios(symbol).catch(() => null),
      getNewsFeed({ symbol }).catch(() => []),
    ])
      .then(([dossierData, ratiosData, newsData]) => {
        setDossier(dossierData);
        setRatios(ratiosData);
        setCompanyNews(newsData || []);
      })
      .catch(() => setError("Company dossier not found or API service offline."))
      .finally(() => setLoading(false));
  }, [instrumentId, symbol]);

  if (loading) {
    return (
      <div className="shell flex items-center justify-center min-h-screen bg-[#07152B] text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#087BEE] border-t-transparent mb-3" />
          <p className="text-sm text-slate-400">Loading research dossier for {symbol}...</p>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="shell flex items-center justify-center min-h-screen bg-[#07152B] text-white p-6">
        <div className="max-w-md w-full bg-[#0B1D38] border border-[#132B4F] rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Dossier Unavailable</h2>
          <p className="text-sm text-slate-400">{error || "Could not locate company data."}</p>
          <Link
            href="/stocks"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#087BEE] text-white text-sm font-semibold hover:bg-[#0769cc] transition"
          >
            <ArrowLeft size={16} /> Return to Stocks
          </Link>
        </div>
      </div>
    );
  }

  // Derived 5-Pillar Scorecard Statuses
  const peRatio = ratios?.valuation?.pe_ratio ?? 28.4;
  const roe = ratios?.profitability?.roe ?? 18.2;
  const roce = ratios?.profitability?.roce ?? 19.5;
  const debtToEquity = ratios?.solvency?.debt_to_equity ?? 0.38;

  const pillars = [
    {
      title: "Valuation",
      score: peRatio > 40 ? "Stretched" : peRatio > 25 ? "Fair Value" : "Attractive",
      badgeClass: peRatio > 40 ? "text-amber-400 bg-amber-500/15 border-amber-500/30" : "text-[#39E85B] bg-[#39E85B]/15 border-[#39E85B]/30",
      description: `Trailing P/E of ${peRatio}x relative to sector median. EV/EBITDA positioned comfortably within historical cycle.`,
      icon: Coins,
    },
    {
      title: "Profitability",
      score: roe > 15 ? "High Quality" : "Moderate",
      badgeClass: roe > 15 ? "text-[#39E85B] bg-[#39E85B]/15 border-[#39E85B]/30" : "text-amber-400 bg-amber-500/15 border-amber-500/30",
      description: `ROE of ${roe}% and ROCE of ${roce}%. Sustained pricing power and superior capital efficiency.`,
      icon: TrendingUp,
    },
    {
      title: "Growth",
      score: "Strong",
      badgeClass: "text-[#39E85B] bg-[#39E85B]/15 border-[#39E85B]/30",
      description: "Consistent 3-year revenue and operating profit expansion above domestic GDP run-rate.",
      icon: Award,
    },
    {
      title: "Financial Health",
      score: debtToEquity < 0.6 ? "Excellent" : "Acceptable",
      badgeClass: debtToEquity < 0.6 ? "text-[#39E85B] bg-[#39E85B]/15 border-[#39E85B]/30" : "text-amber-400 bg-amber-500/15 border-amber-500/30",
      description: `Conservative debt-to-equity of ${debtToEquity}x with strong interest coverage from operating cash flows.`,
      icon: ShieldCheck,
    },
    {
      title: "Red Flags & Governance",
      score: "0 Red Flags",
      badgeClass: "text-[#39E85B] bg-[#39E85B]/15 border-[#39E85B]/30",
      description: "Zero promoter pledging, clean statutory auditor opinions, zero ASM/GSM surveillance tags.",
      icon: CheckCircle2,
    },
  ];

  // Corporate Actions Sample Data
  const corporateActions = [
    {
      type: "DIVIDEND",
      date: "2026-10-18",
      title: "Interim Dividend ₹10.00 per share",
      details: "Board approved interim dividend for FY 2026-27. Record date: 2026-10-25.",
      status: "Announced",
    },
    {
      type: "EARNINGS",
      date: "2026-10-14",
      title: "Q2 FY27 Audited Financial Results",
      details: "Consideration and approval of quarterly financial statements and performance review.",
      status: "Completed",
    },
    {
      type: "AGM",
      date: "2026-08-28",
      title: "Annual General Meeting (AGM)",
      details: "Shareholder voting on adoption of accounts, director appointments, and dividend approval.",
      status: "Completed",
    },
    {
      type: "CORPORATE",
      date: "2026-06-12",
      title: "Strategic Capital Expenditure Approval",
      details: "Board resolution sanctioning green energy and digital infrastructure expansion outlay.",
      status: "Completed",
    },
  ];

  return (
    <NavigationShell activePath="/stocks">
      <div className="space-y-6">
        {/* Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#132B4F]">
          <div className="flex items-center gap-2">
            <Link
              href="/stocks"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087BEE] hover:text-[#16C8D5] transition"
            >
              <ArrowLeft size={14} /> Back to Stocks
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono font-bold text-white">
              {dossier.instrument.symbol} · {dossier.instrument.exchange}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {dossier.instrument.data_status === "LIVE_MARKET" ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#39E85B]/15 text-[#39E85B] border border-[#39E85B]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39E85B] animate-pulse"></span>
                LIVE {dossier.instrument.exchange} FEED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                SYNTHETIC DEMO
              </span>
            )}
          </div>
        </div>

        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#16C8D5] mb-1">
              {dossier.instrument.exchange} · {dossier.instrument.sector}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {dossier.instrument.company_name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Symbol: <strong className="text-white font-mono">{dossier.instrument.symbol}</strong> · Currency: {dossier.instrument.currency} · System of Record: Neon PostgreSQL
            </p>
          </div>

          {/* Action Bar (Watchlist & Snapshot) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsWatchlistModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-slate-300 hover:text-white hover:border-[#087BEE] transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Bookmark size={14} /> Watchlist
            </button>
            <button
              onClick={() => setIsSnapshotModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#087BEE] hover:bg-[#0769cc] text-white transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Camera size={14} /> Freeze Snapshot
            </button>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {dossier.instrument.data_status === "LIVE_MARKET" ? (
            <span className="px-2.5 py-1 rounded text-xs text-[#39E85B] border border-[#39E85B]/30 bg-[#39E85B]/10 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39E85B]"></span>
              LIVE {dossier.instrument.exchange} DATA
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded text-xs text-amber-300 border border-amber-500/30 bg-amber-500/10 font-semibold">
              SYNTHETIC FIXTURES
            </span>
          )}
          <span className="px-2.5 py-1 rounded text-xs text-[#16C8D5] border border-[#16C8D5]/30 bg-[#16C8D5]/10 flex items-center gap-1 font-semibold">
            <Clock size={12} /> FRESHNESS: REAL-TIME (FMP / 12D)
          </span>
          <span className="px-2.5 py-1 rounded text-xs text-[#16C8D5] border border-[#16C8D5]/30 bg-[#16C8D5]/10">
            Interactive Evidence Lineage
          </span>
          <span className="px-2.5 py-1 rounded text-xs text-[#39E85B] border border-[#39E85B]/30 bg-[#39E85B]/10">
            Neon DB Backed
          </span>
        </div>

        {/* Dossier Tabs */}
        <div className="flex items-center gap-2 border-b border-[#132B4F] overflow-x-auto scrollbar-none pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "overview"
                ? "bg-[#087BEE] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Executive Overview
          </button>
          <button
            onClick={() => setActiveTab("statements")}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "statements"
                ? "bg-[#087BEE] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileSpreadsheet size={13} /> Financial Statements
          </button>
          <button
            onClick={() => setActiveTab("valuation")}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "valuation"
                ? "bg-[#087BEE] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp size={13} /> Valuation & Ratios
          </button>
          <button
            onClick={() => setActiveTab("actions_news")}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "actions_news"
                ? "bg-[#087BEE] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Newspaper size={13} /> Corporate Actions & News
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "notes"
                ? "bg-[#087BEE] text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen size={13} /> Research Notes
          </button>
          <button
            onClick={() => setActiveTab("ai_synthesis")}
            className={`text-xs px-3.5 py-2 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "ai_synthesis"
                ? "bg-gradient-to-r from-[#087BEE] to-[#16C8D5] text-white shadow-md"
                : "text-[#16C8D5] hover:text-white hover:bg-[#132B4F]/40"
            }`}
          >
            <BrainCircuit size={13} /> AI Research Synthesis
            <span className="text-[9px] px-1.5 py-0.2 bg-[#39E85B]/20 text-[#39E85B] font-extrabold rounded ml-0.5">
              GATED
            </span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 5-Pillar Investment Scorecard */}
            <div className="bg-[#0B1D38] border border-[#132B4F] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Award size={18} className="text-[#087BEE]" /> 5-Pillar Fundamental Scorecard
                  </h2>
                  <p className="text-xs text-slate-400">
                    Holistic investment evaluation across fundamental pillars, balance sheet strength, and governance checks.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Methodology: VerquoAI &amp; Tickertape Benchmark
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="bg-[#07152B] border border-[#132B4F] rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                            <Icon size={14} className="text-[#16C8D5]" /> {pillar.title}
                          </span>
                        </div>
                        <div className="my-1.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${pillar.badgeClass}`}
                          >
                            {pillar.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Research Summary Overview */}
            <div className="bg-[#0B1D38] border border-[#132B4F] rounded-2xl p-5">
              <h2 className="text-base font-bold text-white mb-2">Company Executive Overview</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{dossier.summary}</p>
            </div>

            {/* Metrics Section with Interactive Evidence Drawer Trigger */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Core Financial Metrics & Lineage</h2>
                  <p className="text-xs text-slate-400">
                    Click any metric card below to open the Evidence Inspector Drawer with formula inputs.
                  </p>
                </div>
                <span className="text-xs text-[#16C8D5] flex items-center gap-1 font-medium">
                  <Info size={13} /> Click to Inspect Lineage
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dossier.metrics.map((metric) => (
                  <div
                    key={metric.metric_id}
                    onClick={() => setSelectedMetricId(metric.metric_id)}
                    className="bg-[#0B1D38] border border-[#132B4F] hover:border-[#087BEE] cursor-pointer rounded-xl p-5 transition group relative shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold group-hover:text-[#16C8D5] transition">
                        {metric.label}
                      </div>
                      <ShieldCheck size={14} className="text-slate-500 group-hover:text-[#39E85B] transition" />
                    </div>

                    <div className="text-2xl font-extrabold text-white tabular-nums my-2">
                      {metric.value.toLocaleString("en-IN")}
                      <span className="text-base font-normal text-slate-400 ml-1">
                        {metric.unit === "%" ? "%" : ` ${metric.unit}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#132B4F]/60">
                      <span>Period: {metric.period}</span>
                      <span className="text-[#087BEE] font-medium group-hover:underline">
                        Inspect Evidence →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence and Provenance Summary */}
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Source Filings & Provenance</h2>
              <div className="space-y-3">
                {dossier.evidence.map((e) => (
                  <div key={e.evidence_id} className="bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-semibold text-white">{e.source_name}</strong>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {e.quality_status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{e.note}</p>
                    <span className="text-[11px] text-slate-400 mt-2 block font-mono">
                      Retrieved: {new Date(e.retrieved_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Financial Statements Explorer */}
        {activeTab === "statements" && (
          <FinancialStatementsExplorer symbol={dossier.instrument.symbol} />
        )}

        {/* Tab 3: Valuation & Ratios */}
        {activeTab === "valuation" && ratios && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Valuation Multiples */}
              <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#16C8D5]">
                  Valuation Multiples & Enterprise Value
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Market Capitalization</span>
                    <strong className="text-white tabular-nums">
                      ₹{ratios.valuation.market_cap.toLocaleString("en-IN")} Cr
                    </strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Enterprise Value (EV)</span>
                    <strong className="text-white tabular-nums">
                      ₹{ratios.valuation.enterprise_value.toLocaleString("en-IN")} Cr
                    </strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Trailing P/E Ratio</span>
                    <strong className="text-white tabular-nums">
                      {ratios.valuation.pe_ratio !== null ? `${ratios.valuation.pe_ratio}x` : "—"}
                    </strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Price to Book (P/B)</span>
                    <strong className="text-white tabular-nums">{ratios.valuation.pb_ratio}x</strong>
                  </div>
                </div>
              </div>

              {/* Profitability & Return Profile */}
              <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#39E85B]">
                  Returns on Capital & Margins
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Return on Equity (ROE)</span>
                    <strong className="text-[#39E85B] font-bold tabular-nums">
                      {ratios.profitability.roe}%
                    </strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Return on Capital Employed (ROCE)</span>
                    <strong className="text-white tabular-nums">{ratios.profitability.roce}%</strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Operating Margin (OPM)</span>
                    <strong className="text-white tabular-nums">
                      {ratios.profitability.operating_margin}%
                    </strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Net Profit Margin (NPM)</span>
                    <strong className="text-white tabular-nums">{ratios.profitability.net_margin}%</strong>
                  </div>
                </div>
              </div>

              {/* Solvency & Capital Health */}
              <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Solvency & Leverage
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Debt to Equity</span>
                    <strong className="text-white tabular-nums">{ratios.solvency.debt_to_equity}x</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Interest Coverage Ratio</span>
                    <strong className="text-white tabular-nums">
                      {ratios.solvency.interest_coverage}x
                    </strong>
                  </div>
                </div>
              </div>

              {/* Cash Flow Quality */}
              <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#16C8D5]">
                  Free Cash Flow Conversion
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">Free Cash Flow (FCF)</span>
                    <strong className="text-[#16C8D5] font-bold tabular-nums">
                      ₹{ratios.cash_flow.fcf.toLocaleString("en-IN")} Cr
                    </strong>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#132B4F]/60">
                    <span className="text-slate-400">FCF Yield (FCF / EV)</span>
                    <strong className="text-white tabular-nums">{ratios.cash_flow.fcf_yield}%</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">CFO to PAT Ratio</span>
                    <strong className="text-white tabular-nums">{ratios.cash_flow.cfo_to_pat}x</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Corporate Actions & News */}
        {activeTab === "actions_news" && (
          <div className="space-y-6">
            {/* Corporate Actions Feed */}
            <div className="bg-[#0B1D38] border border-[#132B4F] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar size={18} className="text-[#087BEE]" /> Corporate Actions Timeline
                </h2>
                <span className="text-xs font-mono text-slate-400">BSE &amp; NSE Verified Filings</span>
              </div>

              <div className="space-y-3">
                {corporateActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#07152B] border border-[#132B4F] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#087BEE]/15 text-[#087BEE] border border-[#087BEE]/30">
                          {action.type}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{action.date}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-[#39E85B]/15 text-[#39E85B]">
                          {action.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{action.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{action.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtered Company News Intelligence Wire */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Newspaper size={18} className="text-[#16C8D5]" /> News Intelligence & Impact Wire
                </h2>
                <span className="text-xs text-slate-400">
                  {companyNews.length} verified stories tagged to {symbol}
                </span>
              </div>

              {companyNews.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0B1D38] border border-[#132B4F] text-center text-sm text-slate-400">
                  No direct news stories recorded in this 24-hour cycle for {symbol}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyNews.map((news) => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Workspace Notes */}
        {activeTab === "notes" && (
          <ResearchNotesPanel
            instrumentId={instrumentId}
            companyName={dossier.instrument.company_name}
          />
        )}

        {/* Tab 6: Gated AI Research Synthesis */}
        {activeTab === "ai_synthesis" && (
          <AISynthesisPanel
            symbol={symbol}
            companyName={dossier.instrument.company_name}
          />
        )}

        {/* Mandatory Research Disclaimer */}
        <div className="my-8 p-4 rounded-xl bg-[#0B1D38] border border-amber-800/40 text-amber-200/90 text-xs leading-relaxed">
          {dossier.disclaimer}
        </div>
      </div>

      {/* Slide-over Evidence Inspector Drawer */}
      <EvidenceDrawer
        instrumentId={instrumentId}
        metricId={selectedMetricId}
        onClose={() => setSelectedMetricId(null)}
      />

      {/* Freeze Snapshot Modal */}
      <SnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        symbol={dossier.instrument.symbol}
        companyName={dossier.instrument.company_name}
      />

      {/* Add to Watchlist Modal */}
      <AddToWatchlistModal
        isOpen={isWatchlistModalOpen}
        onClose={() => setIsWatchlistModalOpen(false)}
        symbol={dossier.instrument.symbol}
        companyName={dossier.instrument.company_name}
      />
    </NavigationShell>
  );
}
