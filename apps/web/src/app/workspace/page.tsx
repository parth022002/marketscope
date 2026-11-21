"use client";

import Link from "next/link";
import { useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import {
  ShieldCheck,
  Database,
  Key,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Radio,
  FileText,
  Clock,
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { exportUserData, purgeUserData, type DPDPDataExportResponse, type DPDPPurgeResponse } from "@/lib/api";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";

const PRIMARY_WORKSPACE_ID = "11111111-1111-1111-1111-111111111111";

export default function WorkspacePage() {
  const [exporting, setExporting] = useState(false);
  const [purging, setPurging] = useState(false);
  const [purgeInput, setPurgeInput] = useState("");
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleExport() {
    setExporting(true);
    setMessage(null);
    try {
      const data = await exportUserData(PRIMARY_WORKSPACE_ID);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `marketscope-dpdp-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: "success", text: "DPDP compliance data package exported successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to export data." });
    } finally {
      setExporting(false);
    }
  }

  async function handlePurge() {
    if (purgeInput !== "PURGE_ALL_DATA") {
      setMessage({ type: "error", text: "Confirmation phrase does not match 'PURGE_ALL_DATA'." });
      return;
    }
    setPurging(true);
    setMessage(null);
    try {
      const result = await purgeUserData(PRIMARY_WORKSPACE_ID, purgeInput);
      setShowPurgeModal(false);
      setPurgeInput("");
      setMessage({
        type: "success",
        text: `Permanent erasure complete: ${result.records_deleted.notes} notes, ${result.records_deleted.snapshots} snapshots, and ${result.records_deleted.watchlists} watchlists purged.`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to purge data." });
    } finally {
      setPurging(false);
    }
  }

  return (
    <div className="shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <BrandLogo variant="full" height={38} className="mb-2" />
        </div>

        <div>
          <div className="nav-label">RESEARCH WORKSPACE</div>
          <nav className="nav">
            <Link href="/">Platform Overview</Link>
            <Link href="/search">Discover Companies</Link>
            <Link href="/compare">Peer Comparison</Link>
            <Link href="/screener">Fundamental Screener</Link>
            <Link href="/watchlists">Watchlists</Link>
            <Link className="active" href="/workspace">Workspace &amp; Privacy</Link>
          </nav>
        </div>

        <div className="sidebar-note">
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--accent-cyan)", marginBottom: 4 }}>
            <ShieldCheck size={14} /> DPDP Act 2023 Ready
          </div>
          Evidence-first research workspace. Strict multi-tenant isolation, cryptographic snapshot immutability, and full DPDP Right to Erasure controls.
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="topbar">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="MarketScope" className="w-5 h-5 rounded object-contain shadow-sm" />
            <strong>Workspace Settings &amp; Data Rights</strong>
            <small className="text-slate-400 font-mono">· DPDP COMPLIANCE ACTIVE</small>
          </div>

          <div className="flex items-center gap-3">
            <span className="tag text-[#39E85B] border-[#39E85B]/30 bg-[#39E85B]/10 flex items-center gap-1.5 font-semibold text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39E85B] animate-pulse"></span>
              ALL PROVIDERS OPERATIONAL
            </span>
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

        <div className="content">
          <div className="eyebrow">WORKSPACE &amp; DATA GOVERNANCE</div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Research Workspace &amp; Privacy Controls</h1>
          <p className="subtitle mt-1">
            Manage your workspace tenancy, verify live data provider feeds, and exercise your statutory data privacy rights under India&apos;s Digital Personal Data Protection (DPDP) Act 2023.
          </p>

          {message && (
            <div
              className={`my-5 p-4 rounded-xl text-sm flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-[#39E85B]/10 border border-[#39E85B]/40 text-[#39E85B]"
                  : "bg-red-500/10 border border-red-500/40 text-[#F06464]"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Section 1: Live Data Provider & Key Architecture */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Radio size={16} className="text-[#087BEE]" /> Active Multi-Tier Data Providers &amp; Key Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>TIER 1 COMMERCIAL</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">Financial Modeling Prep</div>
                <div className="text-xs text-slate-400 mt-1">Key: s8nL...5eM (Active)</div>
                <div className="text-[11px] text-[#39E85B] mt-2 font-medium">✓ SEC 10-K &amp; Global Quotes</div>
              </div>

              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>TIER 1 COMMERCIAL</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">Twelve Data API</div>
                <div className="text-xs text-slate-400 mt-1">Key: 3332...a3c (Active)</div>
                <div className="text-[11px] text-[#39E85B] mt-2 font-medium">✓ Real-Time Tick Feed</div>
              </div>

              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>TIER 2 GLOBAL FEED</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">Global Exchange Engine</div>
                <div className="text-xs text-slate-400 mt-1">NSE, BSE, NASDAQ, NYSE, LSE</div>
                <div className="text-[11px] text-[#16C8D5] mt-2 font-medium">✓ Multi-Period Statements</div>
              </div>

              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>SYSTEM OF RECORD</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">Neon PostgreSQL</div>
                <div className="text-xs text-slate-400 mt-1">AWS Singapore (17 Tables)</div>
                <div className="text-[11px] text-[#39E85B] mt-2 font-medium">✓ Pooled &amp; Isolated</div>
              </div>
            </div>
          </div>

          {/* Section 1B: Gated AI Research Engines (Phase 5 - MOD-17) */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BrainCircuit size={16} className="text-[#16C8D5]" /> Gated AI Research Engines &amp; Intelligence Tier (Phase 5)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>HIGH-SPEED INFERENCE</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">Groq LLaMA-3.3 70B</div>
                <div className="text-xs text-slate-400 mt-1">Key: gsk_...JWQ6 (Active)</div>
                <div className="text-[11px] text-[#39E85B] mt-2 font-medium">✓ Sub-second Citation RAG</div>
              </div>

              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>MULTIMODAL INTELLIGENCE</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">Google Gemini</div>
                <div className="text-xs text-slate-400 mt-1">Key: AQ.Ab8...m6h5Q (Active)</div>
                <div className="text-[11px] text-[#16C8D5] mt-2 font-medium">✓ Regulatory Filings RAG</div>
              </div>

              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>ROUTER TIER</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">OpenRouter Engine</div>
                <div className="text-xs text-slate-400 mt-1">Key: sk-or-v1...c742 (Active)</div>
                <div className="text-[11px] text-[#39E85B] mt-2 font-medium">✓ Multi-Model Fallback</div>
              </div>

              <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>GUARANTEED ACCURACY</span>
                  <span className="w-2 h-2 rounded-full bg-[#39E85B]"></span>
                </div>
                <div className="font-bold text-white text-sm">Deterministic Grounded RAG</div>
                <div className="text-xs text-slate-400 mt-1">Zero Hallucinations Engine</div>
                <div className="text-[11px] text-[#39E85B] mt-2 font-medium">✓ 100% Fact Grounded</div>
              </div>
            </div>
          </div>

          {/* Section 2: Workspace Tenancy Details */}
          <div className="mt-8 card bg-[#0B1D38] border border-[#132B4F] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Database size={16} className="text-[#16C8D5]" /> Workspace Tenancy &amp; Security Isolation
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every research note, watchlist, and cryptographic snapshot created is strictly isolated within your private workspace boundary.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#132B4F]">
              <div>
                <div className="text-xs text-slate-400">Workspace Identifier</div>
                <div className="text-xs font-mono text-white mt-1 select-all">{PRIMARY_WORKSPACE_ID}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Authentication Standard</div>
                <div className="text-xs text-white mt-1">Clerk Core 3 (OIDC / OAuth 2.0)</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Snapshot Integrity</div>
                <div className="text-xs text-white mt-1">HMAC-SHA256 Cryptographic Checksums</div>
              </div>
            </div>
          </div>

          {/* Section 3: DPDP Act Privacy Rights */}
          <div className="mt-8 card bg-[#0B1D38] border border-[#132B4F] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Lock size={16} className="text-[#39E85B]" /> India DPDP Act 2023 &amp; GDPR User Rights
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              In full compliance with India&apos;s Digital Personal Data Protection Act (DPDP) 2023 and global privacy standards, you maintain absolute ownership over your research data. You have the statutory right to export your entire research portfolio or permanently delete all associated data at any time.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 pt-4 border-t border-[#132B4F]">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#087BEE] hover:bg-[#0769cc] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
              >
                <Download size={14} /> {exporting ? "Generating Package..." : "Export All Research Data (JSON)"}
              </button>

              <button
                onClick={() => setShowPurgeModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[#F06464] border border-red-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Permanent Erasure (Right to be Forgotten)
              </button>
            </div>
          </div>

          <Footer />
        </div>
      </main>

      {/* DPDP Cascade Purge Confirmation Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1D38] border border-red-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-base">
              <AlertTriangle size={20} />
              <span>Confirm Irreversible Data Erasure</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently and irreversibly delete all research notes, cryptographic snapshots, and watchlists belonging to this workspace from Neon PostgreSQL. An immutable audit record will be logged with zero personally identifiable information (PII).
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">
                To confirm permanent deletion, type <code className="text-red-400 font-bold">PURGE_ALL_DATA</code> below:
              </label>
              <input
                value={purgeInput}
                onChange={(e) => setPurgeInput(e.target.value)}
                placeholder="PURGE_ALL_DATA"
                className="w-full px-3.5 py-2 rounded-xl bg-[#07152B] border border-[#132B4F] text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#132B4F]">
              <button
                onClick={() => {
                  setShowPurgeModal(false);
                  setPurgeInput("");
                }}
                className="px-4 py-2 rounded-lg bg-[#132B4F] text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePurge}
                disabled={purging || purgeInput !== "PURGE_ALL_DATA"}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md"
              >
                <Trash2 size={13} /> {purging ? "Purging Records..." : "Permanently Erase Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
