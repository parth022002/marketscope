"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Layers,
  BarChart2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getOptionChain,
  getFuturesBuildup,
  type OptionChainResponse,
  type FuturesBuildupItem,
} from "@/lib/api";

const DERIVATIVE_UNDERLYINGS = [
  { symbol: "NIFTY", name: "NIFTY 50", type: "INDEX" },
  { symbol: "BANKNIFTY", name: "NIFTY BANK", type: "INDEX" },
  { symbol: "RELIANCE", name: "Reliance Industries", type: "STOCK" },
  { symbol: "HDFCBANK", name: "HDFC Bank", type: "STOCK" },
  { symbol: "TCS", name: "Tata Consultancy", type: "STOCK" },
  { symbol: "INFY", name: "Infosys", type: "STOCK" },
];

export default function DerivativesPage() {
  const [activeSymbol, setActiveSymbol] = useState("NIFTY");
  const [activeTab, setActiveTab] = useState<"chain" | "futures">("chain");
  const [chainData, setChainData] = useState<OptionChainResponse | null>(null);
  const [futuresData, setFuturesData] = useState<FuturesBuildupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getOptionChain(activeSymbol), getFuturesBuildup()])
      .then(([chain, futures]) => {
        setChainData(chain);
        setFuturesData(futures);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load derivatives data");
      })
      .finally(() => setLoading(false));
  }, [activeSymbol]);

  // Max OI for bar scaling
  const maxCallOi = chainData ? Math.max(...chainData.strikes.map((s) => s.call_oi), 1) : 1;
  const maxPutOi = chainData ? Math.max(...chainData.strikes.map((s) => s.put_oi), 1) : 1;

  return (
    <NavigationShell activePath="/derivatives">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <Activity size={14} /> Quantitative Derivatives &amp; Open Interest Suite
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Options Chain &amp; Futures Pulse
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Real-time strike ladder with Black-Scholes Greeks, Put-Call Ratio (PCR), Max Pain strikes, and 4-quadrant futures build-up analysis.
            </p>
          </div>

          {/* Underlying Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#0B1930] p-1 rounded-xl border border-slate-200 dark:border-[#162C4E]">
            {DERIVATIVE_UNDERLYINGS.map((u) => (
              <button
                key={u.symbol}
                onClick={() => setActiveSymbol(u.symbol)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSymbol === u.symbol
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {u.symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Top Quantitative KPI Cards */}
        {chainData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Spot Price</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5 block">
                ₹{chainData.spot_price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold font-mono">Verified EOD / Live</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Put-Call Ratio (PCR)</span>
              <span className="text-lg font-black font-mono text-sky-400 mt-0.5 block">
                {chainData.pcr.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {chainData.pcr > 1.2 ? "Bullish Accumulation" : chainData.pcr < 0.8 ? "Bearish Sentiment" : "Neutral / Balanced"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Max Pain Strike</span>
              <span className="text-lg font-black font-mono text-amber-400 mt-0.5 block">
                {chainData.max_pain.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Min Seller Loss Expiry Target</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ATM Strike</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5 block">
                {chainData.atm_strike.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Closest to Spot</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Call OI (Resistance)</span>
              <span className="text-lg font-black font-mono text-rose-400 mt-0.5 block">
                {(chainData.total_call_oi / 100000).toFixed(2)}L
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Ceiling Wall</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Put OI (Support)</span>
              <span className="text-lg font-black font-mono text-emerald-400 mt-0.5 block">
                {(chainData.total_put_oi / 100000).toFixed(2)}L
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Floor Wall</span>
            </div>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#162C4E] pb-2">
          <button
            onClick={() => setActiveTab("chain")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "chain"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers size={13} /> Option Chain Ladder
          </button>
          <button
            onClick={() => setActiveTab("futures")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === "futures"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart2 size={13} /> Futures Build-Up Quadrants
          </button>
        </div>

        {/* Tab 1: Option Chain Ladder */}
        {activeTab === "chain" && chainData && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] overflow-x-auto shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E] text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-white font-mono uppercase">
                  {chainData.underlying} Expiry: {chainData.expiry_date}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">
                  Yellow Tint = In-The-Money (ITM)
                </span>
              </div>
              <Link
                href={`/charts?symbol=${chainData.underlying}`}
                className="text-sky-500 hover:text-sky-400 flex items-center gap-1 text-xs font-semibold"
              >
                <span>Open in Chart Terminal</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#162C4E] text-[10px] text-slate-400 uppercase">
                  {/* CALLS */}
                  <th className="py-2.5 px-2 text-right bg-rose-500/5">CALL OI</th>
                  <th className="py-2.5 px-2 text-right bg-rose-500/5">OI CHG</th>
                  <th className="py-2.5 px-2 text-right bg-rose-500/5">VOLUME</th>
                  <th className="py-2.5 px-2 text-right bg-rose-500/5">IV (%)</th>
                  <th className="py-2.5 px-2 text-right bg-rose-500/5">DELTA</th>
                  <th className="py-2.5 px-2 text-right font-bold bg-rose-500/10 text-rose-400">CALL LTP</th>

                  {/* STRIKE */}
                  <th className="py-2.5 px-4 text-center font-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-x border-slate-200 dark:border-[#162C4E]">
                    STRIKE
                  </th>

                  {/* PUTS */}
                  <th className="py-2.5 px-2 text-left font-bold bg-emerald-500/10 text-emerald-400">PUT LTP</th>
                  <th className="py-2.5 px-2 text-left bg-emerald-500/5">DELTA</th>
                  <th className="py-2.5 px-2 text-left bg-emerald-500/5">IV (%)</th>
                  <th className="py-2.5 px-2 text-left bg-emerald-500/5">VOLUME</th>
                  <th className="py-2.5 px-2 text-left bg-emerald-500/5">OI CHG</th>
                  <th className="py-2.5 px-2 text-left bg-emerald-500/5">PUT OI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
                {chainData.strikes.map((s) => {
                  const isCallItm = s.strike < chainData.spot_price;
                  const isPutItm = s.strike > chainData.spot_price;
                  const isAtm = s.strike === chainData.atm_strike;
                  const isMaxPain = s.strike === chainData.max_pain;

                  return (
                    <tr
                      key={s.strike}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${
                        isAtm ? "bg-sky-500/10 font-bold" : ""
                      }`}
                    >
                      {/* CALL OI with visual bar */}
                      <td className={`py-1.5 px-2 text-right relative ${isCallItm ? "bg-amber-500/5" : ""}`}>
                        <div
                          className="absolute inset-y-0 right-0 bg-rose-500/15 pointer-events-none"
                          style={{ width: `${(s.call_oi / maxCallOi) * 100}%` }}
                        />
                        <span className="relative z-10">{s.call_oi.toLocaleString("en-IN")}</span>
                      </td>

                      <td className={`py-1.5 px-2 text-right ${isCallItm ? "bg-amber-500/5" : ""}`}>
                        <span className={s.call_oi_change >= 0 ? "text-emerald-500" : "text-rose-500"}>
                          {s.call_oi_change >= 0 ? `+${s.call_oi_change}` : s.call_oi_change}
                        </span>
                      </td>

                      <td className={`py-1.5 px-2 text-right text-slate-400 ${isCallItm ? "bg-amber-500/5" : ""}`}>
                        {s.call_volume.toLocaleString("en-IN")}
                      </td>

                      <td className={`py-1.5 px-2 text-right text-slate-400 ${isCallItm ? "bg-amber-500/5" : ""}`}>
                        {s.call_iv.toFixed(1)}%
                      </td>

                      <td className={`py-1.5 px-2 text-right text-slate-400 ${isCallItm ? "bg-amber-500/5" : ""}`}>
                        {s.call_delta.toFixed(2)}
                      </td>

                      <td className={`py-1.5 px-2 text-right font-bold text-slate-900 dark:text-white ${isCallItm ? "bg-amber-500/10 text-amber-300" : ""}`}>
                        ₹{s.call_ltp.toFixed(2)}
                      </td>

                      {/* STRIKE COLUMN */}
                      <td className="py-1.5 px-4 text-center font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-x border-slate-200 dark:border-[#162C4E]">
                        <div className="flex items-center justify-center gap-1.5">
                          <span>{s.strike.toLocaleString("en-IN")}</span>
                          {isAtm && (
                            <span className="px-1 py-0.2 text-[8px] bg-sky-600 text-white rounded font-sans">ATM</span>
                          )}
                          {isMaxPain && (
                            <span className="px-1 py-0.2 text-[8px] bg-amber-600 text-white rounded font-sans">PAIN</span>
                          )}
                        </div>
                      </td>

                      {/* PUTS */}
                      <td className={`py-1.5 px-2 text-left font-bold text-slate-900 dark:text-white ${isPutItm ? "bg-amber-500/10 text-amber-300" : ""}`}>
                        ₹{s.put_ltp.toFixed(2)}
                      </td>

                      <td className={`py-1.5 px-2 text-left text-slate-400 ${isPutItm ? "bg-amber-500/5" : ""}`}>
                        {s.put_delta.toFixed(2)}
                      </td>

                      <td className={`py-1.5 px-2 text-left text-slate-400 ${isPutItm ? "bg-amber-500/5" : ""}`}>
                        {s.put_iv.toFixed(1)}%
                      </td>

                      <td className={`py-1.5 px-2 text-left text-slate-400 ${isPutItm ? "bg-amber-500/5" : ""}`}>
                        {s.put_volume.toLocaleString("en-IN")}
                      </td>

                      <td className={`py-1.5 px-2 text-left ${isPutItm ? "bg-amber-500/5" : ""}`}>
                        <span className={s.put_oi_change >= 0 ? "text-emerald-500" : "text-rose-500"}>
                          {s.put_oi_change >= 0 ? `+${s.put_oi_change}` : s.put_oi_change}
                        </span>
                      </td>

                      {/* PUT OI with visual bar */}
                      <td className={`py-1.5 px-2 text-left relative ${isPutItm ? "bg-amber-500/5" : ""}`}>
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-500/15 pointer-events-none"
                          style={{ width: `${(s.put_oi / maxPutOi) * 100}%` }}
                        />
                        <span className="relative z-10">{s.put_oi.toLocaleString("en-IN")}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Futures Build-Up Quadrants */}
        {activeTab === "futures" && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] overflow-x-auto shadow-xs">
            <div className="pb-3 border-b border-slate-200 dark:border-[#162C4E] flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white font-mono uppercase">
                Active Derivatives Futures Contracts (OI &amp; Price Action Matrix)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Formula: Price Change x Open Interest Change
              </span>
            </div>

            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#162C4E] text-[10px] text-slate-400 uppercase font-mono">
                  <th className="py-2.5 px-3">CONTRACT</th>
                  <th className="py-2.5 px-3">EXPIRY</th>
                  <th className="py-2.5 px-3 text-right">LAST PRICE</th>
                  <th className="py-2.5 px-3 text-right">PRICE CHG (%)</th>
                  <th className="py-2.5 px-3 text-right">OPEN INTEREST</th>
                  <th className="py-2.5 px-3 text-right">OI CHG (%)</th>
                  <th className="py-2.5 px-3">CLASSIFICATION</th>
                  <th className="py-2.5 px-3">MARKET INTERPRETATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60">
                {futuresData.map((f) => {
                  let badgeColor = "bg-slate-800 text-slate-300";
                  if (f.classification === "LONG_BUILDUP") {
                    badgeColor = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
                  } else if (f.classification === "SHORT_BUILDUP") {
                    badgeColor = "bg-rose-500/15 text-rose-400 border border-rose-500/30";
                  } else if (f.classification === "SHORT_COVERING") {
                    badgeColor = "bg-sky-500/15 text-sky-400 border border-sky-500/30";
                  } else if (f.classification === "LONG_UNWINDING") {
                    badgeColor = "bg-amber-500/15 text-amber-400 border border-amber-500/30";
                  }

                  return (
                    <tr key={f.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-bold font-mono text-slate-900 dark:text-white">
                        {f.symbol} FUT
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{f.expiry}</td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-white">
                        ₹{f.last_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className={f.price_change >= 0 ? "text-emerald-500" : "text-rose-500"}>
                          {f.price_change >= 0 ? `+${f.price_change_pct}%` : `${f.price_change_pct}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-white">
                        {(f.open_interest / 100000).toFixed(2)}L
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span className={f.oi_change >= 0 ? "text-emerald-500" : "text-rose-500"}>
                          {f.oi_change >= 0 ? `+${f.oi_change_pct}%` : `${f.oi_change_pct}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${badgeColor}`}>
                          {f.classification.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-400">{f.interpretation}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
