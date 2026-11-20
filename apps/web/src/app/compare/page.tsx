"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { Scale, AlertCircle, ArrowUpRight } from "lucide-react";
import { getPeerComparison, type PeerComparisonResponse } from "@/lib/api";

const QUICK_COMPANIES = ["TCS", "INFY", "RELIANCE", "TATAMOTORS"];

export default function ComparePage() {
  const [selectedSymbol, setSelectedSymbol] = useState("TCS");
  const [data, setData] = useState<PeerComparisonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getPeerComparison(selectedSymbol)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load peer comparison");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSymbol]);

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
            <Link className="active" href="/compare">
              Peer Comparison
            </Link>
            <Link href="/screener">Fundamental Screener</Link>
            <Link href="/watchlists">Watchlists</Link>
          </nav>
        </div>

        <div className="sidebar-note">
          Evidence-first research workspace. Strictly read-only; no trade execution or broker routing.
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="topbar">
          <div className="flex items-center gap-2">
            <strong>Peer Comparison Workspace</strong>
            <small className="text-slate-400 font-mono">· PHASE 3 BENCHMARKING</small>
          </div>

          <div className="flex items-center gap-3">
            <span className="tag text-[#16C8D5] border-[#16C8D5]/30 bg-[#16C8D5]/10">
              Comparative Analysis
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
            <Scale size={14} className="text-[#16C8D5]" /> Sector & Peer Benchmarking
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Compare Industry Peers Side-by-Side
          </h1>
          <p className="subtitle mt-1">
            Evaluate valuation multiples, profitability profiles, and leverage side-by-side with automatic accounting alignment warnings.
          </p>

          {/* Target Company Selector */}
          <div className="my-6 flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Benchmark Anchor:</span>
            {QUICK_COMPANIES.map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition border ${
                  selectedSymbol === sym
                    ? "bg-[#087BEE] border-[#087BEE] text-white"
                    : "bg-[#0B1D38] border-[#132B4F] text-slate-300 hover:text-white"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          {error && <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-[#F06464] text-xs">{error}</div>}

          {/* Basis Alignment Warnings */}
          {data && data.alignment_warnings.length > 0 && (
            <div className="my-5 p-4 rounded-xl bg-[#0B1D38] border border-blue-800/40 text-blue-200 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="text-[#16C8D5] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white mb-0.5">Period & Basis Alignment Notice</strong>
                {data.alignment_warnings.map((w, i) => (
                  <p key={i} className="text-slate-300 leading-relaxed">
                    {w}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {loading && (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#087BEE] border-t-transparent mb-3" />
              <p className="text-sm">Calculating comparative peer multiples...</p>
            </div>
          )}

          {data && !loading && (
            <div className="overflow-x-auto rounded-2xl border border-[#132B4F] bg-[#07152B] shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0B1D38] border-b border-[#132B4F] text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Metric / Dimension</th>
                    {data.peers.map((peer) => (
                      <th key={peer.symbol} className="py-3 px-4 text-right">
                        <Link
                          href={`/company/${peer.symbol.toLowerCase()}`}
                          className="text-white hover:text-[#16C8D5] inline-flex items-center gap-1 font-bold"
                        >
                          {peer.symbol} <ArrowUpRight size={12} />
                        </Link>
                        <div className="text-[10px] text-slate-400 font-normal lowercase tracking-normal truncate max-w-[140px]">
                          {peer.company_name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#132B4F]/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Market Capitalization</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums font-bold text-white">
                        ₹{p.market_cap.toLocaleString("en-IN")} Cr
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#0B1D38]/30">
                    <td className="py-3 px-4 font-medium text-slate-300">Trailing P/E Ratio</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {p.pe_ratio !== null ? `${p.pe_ratio}x` : "N/A"}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-300">Price to Book (P/B)</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {p.pb_ratio}x
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#0B1D38]/30">
                    <td className="py-3 px-4 font-semibold text-[#39E85B]">Return on Equity (ROE)</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums font-bold text-[#39E85B]">
                        {p.roe}%
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-300">Return on Capital Employed (ROCE)</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {p.roce}%
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#0B1D38]/30">
                    <td className="py-3 px-4 font-medium text-slate-300">Operating Profit Margin (OPM)</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {p.operating_margin}%
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-300">Debt to Equity</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums text-slate-200">
                        {p.debt_to_equity}x
                      </td>
                    ))}
                  </tr>

                  <tr className="bg-[#0B1D38]/30">
                    <td className="py-3 px-4 font-semibold text-[#16C8D5]">Free Cash Flow (FCF)</td>
                    {data.peers.map((p) => (
                      <td key={p.symbol} className="py-3 px-4 text-right tabular-nums font-bold text-[#16C8D5]">
                        ₹{p.fcf.toLocaleString("en-IN")} Cr
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
