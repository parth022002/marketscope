"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { ArrowLeft, ShieldCheck, Info } from "lucide-react";
import { getDossier, type Dossier } from "@/lib/api";
import EvidenceDrawer from "@/components/EvidenceDrawer";
import ResearchNotesPanel from "@/components/ResearchNotesPanel";

const IDS_MAP: Record<string, string> = {
  reliance: "in-nse-reliance",
  tcs: "in-nse-tcs",
  infy: "in-nse-infy",
  tatamotors: "in-nse-tatamotors",
  tatamtrdvr: "in-nse-tatamtrdvr",
};

export default function CompanyPage() {
  const params = useParams();
  const symbol = (params?.symbol as string)?.toLowerCase() || "";
  const instrumentId = IDS_MAP[symbol] || `in-nse-${symbol}`;

  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);

  useEffect(() => {
    if (!instrumentId) return;
    setLoading(true);
    getDossier(instrumentId)
      .then((data) => setDossier(data))
      .catch(() => setError("Company dossier not found or API service offline."))
      .finally(() => setLoading(false));
  }, [instrumentId]);

  if (loading) {
    return (
      <div className="shell flex items-center justify-center min-h-screen bg-[#07152B] text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#087BEE] border-t-transparent mb-3" />
          <p className="text-sm text-slate-400">Loading research dossier for {symbol.toUpperCase()}...</p>
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
            <Link href="/search">Peer Comparison</Link>
            <Link href="/search">Watchlists & Screens</Link>
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
            <span className="tag amber">SYNTHETIC DEMO</span>
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
          <h1 className="text-3xl font-extrabold text-white mt-1">
            {dossier.instrument.company_name}
          </h1>
          <p className="subtitle mt-1">
            Symbol: <strong className="text-white">{dossier.instrument.symbol}</strong> · Currency: {dossier.instrument.currency} · System of Record: Neon PostgreSQL
          </p>

          <div className="flex items-center gap-2 my-4">
            <span className="tag amber">SYNTHETIC FIXTURES</span>
            <span className="tag text-[#16C8D5] border-[#16C8D5]/30 bg-[#16C8D5]/10">
              Interactive Evidence Lineage
            </span>
            <span className="tag text-[#39E85B] border-[#39E85B]/30 bg-[#39E85B]/10">
              Neon DB Backed
            </span>
          </div>

          {/* Research Overview */}
          <div className="card my-5 bg-[#0B1D38] border border-[#132B4F] rounded-xl p-5">
            <h2 className="text-base font-bold text-white mb-1">Company Executive Overview</h2>
            <p className="subtitle text-sm text-slate-300 leading-relaxed">{dossier.summary}</p>
          </div>

          {/* Metrics Section with Interactive Evidence Drawer Trigger */}
          <div className="section-head flex items-center justify-between mt-8 mb-3">
            <div>
              <h2 className="text-xl font-bold text-white">Financial Metrics & Valuation</h2>
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

          {/* Workspace Research Notes Panel Connected to Neon */}
          <ResearchNotesPanel
            instrumentId={instrumentId}
            companyName={dossier.instrument.company_name}
          />

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
    </div>
  );
}
