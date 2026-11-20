"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { Filter, SlidersHorizontal, ArrowUpRight, CheckCircle2, RotateCcw } from "lucide-react";
import { runScreener, getScreenerPresets, type ScreenerResultItem, type ScreenerPreset } from "@/lib/api";

export default function ScreenerPage() {
  const [presets, setPresets] = useState<ScreenerPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Filter States
  const [sector, setSector] = useState("");
  const [minRoe, setMinRoe] = useState<number | "">("");
  const [maxPe, setMaxPe] = useState<number | "">("");
  const [maxDebtEquity, setMaxDebtEquity] = useState<number | "">("");
  const [minOpm, setMinOpm] = useState<number | "">("");

  const [results, setResults] = useState<ScreenerResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load presets
  useEffect(() => {
    getScreenerPresets()
      .then((data) => {
        setPresets(data);
        if (data.length > 0) {
          applyPreset(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  async function executeScreen(criteria: {
    sector?: string;
    min_roe?: number;
    max_pe?: number;
    max_debt_equity?: number;
    min_opm?: number;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await runScreener({
        sector: criteria.sector || undefined,
        min_roe: criteria.min_roe !== undefined ? Number(criteria.min_roe) : undefined,
        max_pe: criteria.max_pe !== undefined ? Number(criteria.max_pe) : undefined,
        max_debt_equity: criteria.max_debt_equity !== undefined ? Number(criteria.max_debt_equity) : undefined,
        min_opm: criteria.min_opm !== undefined ? Number(criteria.min_opm) : undefined,
      });
      setResults(res.results);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to run screener";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset: ScreenerPreset) {
    setActivePresetId(preset.id);
    setMinRoe(preset.criteria.min_roe !== undefined ? preset.criteria.min_roe : "");
    setMaxPe(preset.criteria.max_pe !== undefined ? preset.criteria.max_pe : "");
    setMaxDebtEquity(preset.criteria.max_debt_equity !== undefined ? preset.criteria.max_debt_equity : "");
    setMinOpm(preset.criteria.min_opm !== undefined ? preset.criteria.min_opm : "");
    setSector(preset.criteria.sector || "");

    executeScreen({
      sector: preset.criteria.sector,
      min_roe: preset.criteria.min_roe,
      max_pe: preset.criteria.max_pe,
      max_debt_equity: preset.criteria.max_debt_equity,
      min_opm: preset.criteria.min_opm,
    });
  }

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActivePresetId(null);
    executeScreen({
      sector,
      min_roe: minRoe !== "" ? minRoe : undefined,
      max_pe: maxPe !== "" ? maxPe : undefined,
      max_debt_equity: maxDebtEquity !== "" ? maxDebtEquity : undefined,
      min_opm: minOpm !== "" ? minOpm : undefined,
    });
  }

  function handleReset() {
    setActivePresetId(null);
    setSector("");
    setMinRoe("");
    setMaxPe("");
    setMaxDebtEquity("");
    setMinOpm("");
    executeScreen({});
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
            <Link href="/search">Discover Companies</Link>
            <Link href="/compare">Peer Comparison</Link>
            <Link className="active" href="/screener">
              Fundamental Screener
            </Link>
            <Link href="/watchlists">Watchlists</Link>
          </nav>
        </div>

        <div className="sidebar-note">
          Evidence-first research workspace. Strictly read-only; no trade execution or broker routing.
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="topbar">
          <div className="flex items-center gap-2">
            <strong>Fundamental Stock Screener</strong>
            <small className="text-slate-400 font-mono">· PHASE 3 QUERY ENGINE</small>
          </div>

          <div className="flex items-center gap-3">
            <span className="tag text-[#39E85B] border-[#39E85B]/30 bg-[#39E85B]/10">
              Deterministic Filters
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
          <div className="eyebrow flex items-center gap-1.5">
            <Filter size={14} className="text-[#39E85B]" /> Quantitative Fundamental Screening
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Filter the Indian Equity Universe
          </h1>
          <p className="subtitle mt-1">
            Screen companies using verified balance sheet, return on capital, and valuation thresholds.
          </p>

          {/* Screener Presets */}
          <div className="my-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Curated Screening Presets:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`p-4 rounded-xl text-left border transition ${
                    activePresetId === preset.id
                      ? "bg-[#0B1D38] border-[#087BEE] shadow-lg ring-1 ring-[#087BEE]"
                      : "bg-[#0B1D38]/60 border-[#132B4F] hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm text-white font-bold">{preset.name}</strong>
                    {activePresetId === preset.id && <CheckCircle2 size={15} className="text-[#087BEE]" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Filter Form */}
          <form onSubmit={handleFilterSubmit} className="my-6 p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#132B4F]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#16C8D5] flex items-center gap-1.5">
                <SlidersHorizontal size={14} /> Custom Fundamental Parameters
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Min ROE (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={minRoe}
                  onChange={(e) => setMinRoe(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 15.0"
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-xs focus:outline-none focus:border-[#087BEE]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Max P/E Multiple</label>
                <input
                  type="number"
                  step="0.1"
                  value={maxPe}
                  onChange={(e) => setMaxPe(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 35.0"
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-xs focus:outline-none focus:border-[#087BEE]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Max Debt / Equity (x)</label>
                <input
                  type="number"
                  step="0.05"
                  value={maxDebtEquity}
                  onChange={(e) => setMaxDebtEquity(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 0.50"
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-xs focus:outline-none focus:border-[#087BEE]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Min Operating Margin (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={minOpm}
                  onChange={(e) => setMinOpm(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 15.0"
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-xs focus:outline-none focus:border-[#087BEE]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-[#087BEE] hover:bg-[#0769cc] text-white text-xs font-semibold transition"
              >
                {loading ? "Running Screen..." : "Apply Screen Filters"}
              </button>
            </div>
          </form>

          {error && <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-[#F06464] text-xs">{error}</div>}

          {/* Results Table */}
          <div className="section-head flex items-center justify-between mt-8 mb-4">
            <h2>Matching Candidates ({results.length})</h2>
            <span className="tag amber">Ind AS Verified Universe</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#132B4F] bg-[#07152B] shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0B1D38] border-b border-[#132B4F] text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Company / Symbol</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-right">P/E Multiple</th>
                  <th className="py-3 px-4 text-right">ROE (%)</th>
                  <th className="py-3 px-4 text-right">Operating Margin</th>
                  <th className="py-3 px-4 text-right">Debt / Equity</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132B4F]/60 text-slate-300">
                {results.map((item) => (
                  <tr key={item.symbol} className="hover:bg-[#0B1D38]/50 transition">
                    <td className="py-3.5 px-4">
                      <strong className="text-white block text-sm">{item.symbol}</strong>
                      <span className="text-xs text-slate-400">{item.company_name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">{item.sector}</td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-white font-medium">
                      ₹{item.market_cap.toLocaleString("en-IN")} Cr
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      {item.pe_ratio !== null ? `${item.pe_ratio}x` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums font-bold text-[#39E85B]">
                      {item.roe}%
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-200">
                      {item.operating_margin}%
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-200">
                      {item.debt_to_equity}x
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/company/${item.symbol.toLowerCase()}`}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-[#132B4F] text-[#16C8D5] hover:text-white transition font-medium"
                      >
                        Inspect <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}

                {results.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      No companies match the specified criteria. Try loosening the filter thresholds.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
