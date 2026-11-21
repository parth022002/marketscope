"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Scale, AlertCircle, ArrowUpRight, BarChart3, TrendingUp } from "lucide-react";
import { getPeerComparison, type PeerComparisonResponse } from "@/lib/api";
import NavigationShell from "@/components/NavigationShell";

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
    <NavigationShell activePath="/compare">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#132B4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#16C8D5] uppercase">
              <Scale size={14} /> Competitive Benchmarking
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Peer Comparison Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Evaluate direct sector rivals side-by-side across deterministic valuation multiples, capital efficiency, and solvency metrics.
            </p>
          </div>
        </div>

        {/* Anchor Selector */}
        <div className="p-4 rounded-2xl bg-[#0B1D38] border border-[#132B4F] flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 font-mono font-bold uppercase">
            Benchmark Anchor Company:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {QUICK_COMPANIES.map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={`px-3 py-1.5 rounded-xl font-bold transition border ${
                  selectedSymbol === sym
                    ? "bg-[#087BEE] border-[#087BEE] text-white shadow-sm"
                    : "bg-[#07152B] border-[#132B4F] text-slate-300 hover:text-white"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-[#F06464] text-xs">
            {error}
          </div>
        )}

        {/* Alignment Warnings */}
        {data && data.alignment_warnings.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#0B1D38] border border-blue-800/40 text-blue-200 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="text-[#16C8D5] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white mb-0.5">Period &amp; Accounting Basis Alignment Notice</strong>
              {data.alignment_warnings.map((w, i) => (
                <p key={i} className="text-slate-300 leading-relaxed">
                  {w}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#087BEE] border-t-transparent mb-3" />
            <p className="text-xs">Computing deterministic peer comparative multiples...</p>
          </div>
        )}

        {/* Peer Table */}
        {data && !loading && (
          <div className="overflow-x-auto rounded-2xl border border-[#132B4F] bg-[#0B1D38] shadow-sm p-5">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#132B4F] text-[11px] font-mono uppercase tracking-wider text-slate-400">
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
                      <div className="text-[10px] text-slate-400 font-normal truncate max-w-[140px]">
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
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono font-bold text-white">
                      ₹{p.market_cap.toLocaleString("en-IN")} Cr
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#07152B]/40">
                  <td className="py-3 px-4 font-medium text-slate-300">Trailing P/E Ratio</td>
                  {data.peers.map((p) => (
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono text-slate-200">
                      {p.pe_ratio !== null ? `${p.pe_ratio}x` : "—"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-300">Price to Book (P/B)</td>
                  {data.peers.map((p) => (
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono text-slate-200">
                      {p.pb_ratio}x
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#07152B]/40">
                  <td className="py-3 px-4 font-semibold text-[#39E85B]">Return on Equity (ROE)</td>
                  {data.peers.map((p) => (
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono font-bold text-[#39E85B]">
                      {p.roe}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-300">Return on Capital Employed (ROCE)</td>
                  {data.peers.map((p) => (
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono text-slate-200">
                      {p.roce}%
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#07152B]/40">
                  <td className="py-3 px-4 font-medium text-slate-300">Operating Profit Margin (OPM)</td>
                  {data.peers.map((p) => (
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono text-slate-200">
                      {p.operating_margin}%
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-3 px-4 font-medium text-slate-300">Debt to Equity</td>
                  {data.peers.map((p) => (
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono text-slate-200">
                      {p.debt_to_equity}x
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#07152B]/40">
                  <td className="py-3 px-4 font-semibold text-[#16C8D5]">Free Cash Flow (FCF)</td>
                  {data.peers.map((p) => (
                    <td key={p.symbol} className="py-3 px-4 text-right font-mono font-bold text-[#16C8D5]">
                      ₹{p.fcf.toLocaleString("en-IN")} Cr
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
