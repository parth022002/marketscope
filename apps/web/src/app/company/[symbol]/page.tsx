"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
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
} from "lucide-react";
import { getDossier, getCompanyRatios, type Dossier, type CompanyRatios } from "@/lib/api";
import EvidenceDrawer from "@/components/EvidenceDrawer";
import ResearchNotesPanel from "@/components/ResearchNotesPanel";
import FinancialStatementsExplorer from "@/components/FinancialStatementsExplorer";
import SnapshotModal from "@/components/SnapshotModal";
import AddToWatchlistModal from "@/components/AddToWatchlistModal";
import AISynthesisPanel from "@/components/AISynthesisPanel";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "statements" | "valuation" | "notes" | "ai_synthesis">("overview");

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
    ])
      .then(([dossierData, ratiosData]) => {
        setDossier(dossierData);
        setRatios(ratiosData);
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
            href="/search"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#087BEE] text-white text-sm font-semibold hover:bg-[#0769cc] transition"
          >
            <ArrowLeft size={16} /> Return to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            Market<span>Scope</span>
          </div>
          <div className="brand-sub">FINANCIAL RESEARCH & INTELLIGENCE</div>
        </div>

        <div>
          <div className="nav-label">RESEARCH WORKSPACE</div>
          <nav className="nav">
            <Link href="/">Platform Overview</Link>
            <Link className="active" href="/search">
              Discover Companies
            </Link>
            <Link href="/compare">Peer Comparison</Link>
            <Link href="/screener">Fundamental Screener</Link>
            <Link href="/watchlists">Watchlists</Link>
            <Link href="/workspace">Workspace &amp; Privacy</Link>
          </nav>
        </div>

        <div className="sidebar-note">
          Evidence-first research workspace. Strictly read-only; no trade execution or broker routing.
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        {/* Top Bar with Clerk Identity */}
        <header className="topbar">
          <div className="flex items-center gap-3">
            <Link href="/search" className="flex items-center gap-1.5 text-xs text-[#16C8D5] hover:underline font-medium">
              <ArrowLeft size={14} /> Back to Search
            </Link>
            <span className="text-slate-600">|</span>
            <small className="text-slate-400 font-mono tracking-wider">
              {dossier.instrument.symbol} · {dossier.instrument.exchange}
            </small>
          </div>

          <div className="flex items-center gap-4">
            {dossier.instrument.data_status === "LIVE_MARKET" ? (
              <span className="tag text-[#39E85B] border-[#39E85B]/30 bg-[#39E85B]/10 flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39E85B] animate-pulse"></span>
                LIVE MARKET FEED
              </span>
            ) : (
              <span className="tag amber">SYNTHETIC DEMO</span>
            )}
            <Show when="signed-in">
              <div className="flex items-center gap-2 pl-3 border-l border-[#132B4F]">
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="text-xs px-3 py-1.5 rounded-lg bg-[#132B4F] text-slate-200 hover:text-white transition font-medium"
              >
                Sign In
              </Link>
            </Show>
          </div>
        </header>

        {/* Dossier Content */}
        <div className="content">
          <div className="eyebrow">
            {dossier.instrument.exchange} · {dossier.instrument.sector}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                {dossier.instrument.company_name}
              </h1>
              <p className="subtitle mt-1">
                Symbol: <strong className="text-white">{dossier.instrument.symbol}</strong> · Currency: {dossier.instrument.currency} · System of Record: Neon PostgreSQL
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
          <div className="flex flex-wrap items-center gap-2 my-4">
            {dossier.instrument.data_status === "LIVE_MARKET" ? (
              <span className="tag text-[#39E85B] border-[#39E85B]/30 bg-[#39E85B]/10 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39E85B]"></span>
                LIVE {dossier.instrument.exchange} DATA
              </span>
            ) : (
              <span className="tag amber">SYNTHETIC FIXTURES</span>
            )}
            <span className="tag text-[#16C8D5] border-[#16C8D5]/30 bg-[#16C8D5]/10 flex items-center gap-1 font-semibold">
              <Clock size={12} /> FRESHNESS: REAL-TIME (FMP / 12D)
            </span>
            <span className="tag text-[#16C8D5] border-[#16C8D5]/30 bg-[#16C8D5]/10">
              Interactive Evidence Lineage
            </span>
            <span className="tag text-[#39E85B] border-[#39E85B]/30 bg-[#39E85B]/10">
              Neon DB Backed
            </span>
          </div>

          {/* Dossier Tabs */}
          <div className="flex items-center gap-2 border-b border-[#132B4F] my-6 pb-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-[#087BEE] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Executive Overview
            </button>
            <button
              onClick={() => setActiveTab("statements")}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === "statements"
                  ? "bg-[#087BEE] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileSpreadsheet size={13} /> Financial Statements
            </button>
            <button
              onClick={() => setActiveTab("valuation")}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === "valuation"
                  ? "bg-[#087BEE] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp size={13} /> Valuation & Ratios
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === "notes"
                  ? "bg-[#087BEE] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen size={13} /> Research Notes
            </button>
            <button
              onClick={() => setActiveTab("ai_synthesis")}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1.5 ${
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
              {/* Research Overview */}
              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-5">
                <h2 className="text-base font-bold text-white mb-1">Company Executive Overview</h2>
                <p className="subtitle text-sm text-slate-300 leading-relaxed">{dossier.summary}</p>
              </div>

              {/* Metrics Section with Interactive Evidence Drawer Trigger */}
              <div className="section-head flex items-center justify-between mt-8 mb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Core Financial Metrics & Lineage</h2>
                  <span className="subtitle text-xs text-slate-400">
                    Click any metric card below to open the Evidence Inspector Drawer with formula inputs.
                  </span>
                </div>
                <span className="text-xs text-[#16C8D5] flex items-center gap-1 font-medium">
                  <Info size={13} /> Click to Inspect Lineage
                </span>
              </div>

              <div className="grid grid-3 gap-4">
                {dossier.metrics.map((metric) => (
                  <div
                    key={metric.metric_id}
                    onClick={() => setSelectedMetricId(metric.metric_id)}
                    className="card bg-[#0B1D38] border border-[#132B4F] hover:border-[#087BEE] cursor-pointer rounded-xl p-5 transition group relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="metric-label text-xs uppercase tracking-wider text-slate-400 font-semibold group-hover:text-[#16C8D5] transition">
                        {metric.label}
                      </div>
                      <ShieldCheck size={14} className="text-slate-500 group-hover:text-[#39E85B] transition" />
                    </div>

                    <div className="metric-value text-2xl font-extrabold text-white tabular-nums my-2">
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

              {/* Evidence and Provenance Summary */}
              <div className="section-head mt-8 mb-3">
                <h2 className="text-xl font-bold text-white">Source Filings & Provenance</h2>
              </div>

              <div className="space-y-3">
                {dossier.evidence.map((e) => (
                  <div key={e.evidence_id} className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-semibold text-white">{e.source_name}</strong>
                      <span className="tag amber text-xs">{e.quality_status}</span>
                    </div>
                    <p className="subtitle text-xs text-slate-300 mt-1">{e.note}</p>
                    <small className="muted text-[11px] text-slate-400 mt-2 block">
                      Retrieved: {new Date(e.retrieved_at).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Financial Statements Explorer (Phase 2) */}
          {activeTab === "statements" && (
            <FinancialStatementsExplorer symbol={dossier.instrument.symbol} />
          )}

          {/* Tab 3: Valuation & Ratios (Phase 2) */}
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

          {/* Tab 4: Workspace Notes */}
          {activeTab === "notes" && (
            <ResearchNotesPanel
              instrumentId={instrumentId}
              companyName={dossier.instrument.company_name}
            />
          )}

          {/* Tab 5: Gated AI Research Synthesis (MOD-17) */}
          {activeTab === "ai_synthesis" && (
            <AISynthesisPanel
              symbol={symbol}
              companyName={dossier.instrument.company_name}
            />
          )}

          <div className="notice my-8 p-4 rounded-xl bg-[#0B1D38] border border-amber-800/40 text-amber-200/90 text-xs leading-relaxed">
            {dossier.disclaimer}
          </div>
        </div>
      </main>

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
    </div>
  );
}
