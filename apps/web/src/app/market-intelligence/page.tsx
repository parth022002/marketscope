"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ArrowUpRight,
  BarChart2,
  Gauge,
  Compass,
  Zap,
  Target,
  ShieldAlert,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getMarketFlowIntelligence,
  type MarketFlowResponse,
} from "@/lib/api";

export default function MarketIntelligencePage() {
  const [data, setData] = useState<MarketFlowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMarketFlowIntelligence()
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load market flow intelligence");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <NavigationShell activePath="/market-intelligence">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <Sparkles size={14} /> Market Flow &amp; Algorithmic Radar (VerquoAI Benchmark)
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Market Flow &amp; Relative Strength
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Real-time market breadth metrics, Mansfield Relative Strength sector rotation matrices, and rule-based quantitative setup signals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/charts"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <BarChart2 size={13} /> Open Charts Terminal
            </Link>
          </div>
        </div>

        {/* Top Market Breadth Overview */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Advance/Decline Breadth */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Advance / Decline Breadth</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black font-mono text-emerald-500">{data.advances}</span>
                  <span className="text-xs text-slate-400">Advances</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-2xl font-black font-mono text-rose-500">{data.declines}</span>
                  <span className="text-xs text-slate-400">Declines</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(data.advances / (data.advances + data.declines)) * 100}%` }}
                  />
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${(data.declines / (data.advances + data.declines)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>A/D Ratio: {data.ad_ratio}x</span>
                  <span className="font-bold text-emerald-400">BULLISH SKEW</span>
                </div>
              </div>
            </div>

            {/* Benchmark Momentum */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Benchmark Spot Trend</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    ₹{data.nifty_spot.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-500">
                    +{data.nifty_change_pct}%
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">
                Trading comfortably above 20 &amp; 50 EMA daily ribbons.
              </div>
            </div>

            {/* 52-Week Highs vs Lows */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">52-Week Extrema</span>
                <div className="mt-2 flex items-baseline gap-3">
                  <div>
                    <span className="text-2xl font-black font-mono text-emerald-400">{data.highs_52w}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">New Highs</span>
                  </div>
                  <span className="text-slate-400">vs</span>
                  <div>
                    <span className="text-2xl font-black font-mono text-rose-400">{data.lows_52w}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">New Lows</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-emerald-500 font-mono mt-2">
                Strong expansion in leadership participation.
              </div>
            </div>

            {/* Sentiment Meter */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Market Structure Regime</span>
                <div className="mt-2">
                  <span className="text-xl font-black font-mono text-sky-400 uppercase">
                    {data.market_sentiment}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 font-sans mt-2">
                Risk-on environment with defensive rotation in FMCG &amp; IT.
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Layout: Sector Rotation & Algorithmic Radar */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sector Rotation Table (7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
                <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Compass size={14} className="text-blue-500" /> Sector Relative Strength (Mansfield RS)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Benchmark: NIFTY 50</span>
              </div>

              <table className="w-full text-xs text-left font-mono mt-2">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-[10px] text-slate-400 uppercase">
                    <th className="py-2.5 px-3">SECTOR</th>
                    <th className="py-2.5 px-2 text-right">1D CHG</th>
                    <th className="py-2.5 px-2 text-right">1W CHG</th>
                    <th className="py-2.5 px-2 text-right">1M CHG</th>
                    <th className="py-2.5 px-2 text-right">MANSFIELD RS</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-2 text-right">TOP DRIVER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-[11px]">
                  {data.sector_leadership.map((s) => {
                    let statusColor = "bg-slate-800 text-slate-300";
                    if (s.momentum_status === "LEADING") statusColor = "bg-emerald-500/15 text-emerald-400";
                    else if (s.momentum_status === "IMPROVING") statusColor = "bg-sky-500/15 text-sky-400";
                    else if (s.momentum_status === "WEAKENING") statusColor = "bg-amber-500/15 text-amber-400";
                    else if (s.momentum_status === "LAGGING") statusColor = "bg-rose-500/15 text-rose-400";

                    return (
                      <tr key={s.sector} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-white font-sans">
                          {s.sector}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={s.change_pct_1d >= 0 ? "text-emerald-500" : "text-rose-500"}>
                            {s.change_pct_1d >= 0 ? `+${s.change_pct_1d}%` : `${s.change_pct_1d}%`}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={s.change_pct_1w >= 0 ? "text-emerald-500" : "text-rose-500"}>
                            {s.change_pct_1w >= 0 ? `+${s.change_pct_1w}%` : `${s.change_pct_1w}%`}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={s.change_pct_1m >= 0 ? "text-emerald-500" : "text-rose-500"}>
                            {s.change_pct_1m >= 0 ? `+${s.change_pct_1m}%` : `${s.change_pct_1m}%`}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-sky-400">
                          {s.relative_strength > 0 ? `+${s.relative_strength}` : s.relative_strength}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColor}`}>
                            {s.momentum_status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-bold text-slate-900 dark:text-white">
                          <Link href={`/company/${s.top_driver.toLowerCase()}`} className="hover:text-sky-400">
                            {s.top_driver}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quantitative Setup Radar (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
                  <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-500" /> Algorithmic Intraday Radar
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Live Rule Scanners</span>
                </div>

                <div className="space-y-3 mt-3">
                  {data.setup_radar.map((setup) => (
                    <div
                      key={setup.symbol}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-sky-500/50 transition flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                              {setup.symbol}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                              {setup.timeframe}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                              {setup.direction}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold text-sky-400 block mt-0.5">
                            {setup.setup_name}
                          </span>
                        </div>

                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {(setup.confidence * 100).toFixed(0)}% Conf
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {setup.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono">
                        <div>
                          <span className="text-slate-400">Trigger: </span>
                          <span className="font-bold text-slate-200">₹{setup.trigger_price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">SL: </span>
                          <span className="text-rose-400">₹{setup.stop_loss.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Target: </span>
                          <span className="text-emerald-400">₹{setup.target_price.toFixed(2)}</span>
                        </div>
                        <Link
                          href={`/charts?symbol=${setup.symbol}`}
                          className="text-sky-400 hover:underline font-sans font-bold flex items-center gap-0.5"
                        >
                          Chart <ArrowUpRight size={10} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
