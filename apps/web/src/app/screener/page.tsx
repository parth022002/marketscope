"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Filter,
  SlidersHorizontal,
  ArrowUpRight,
  CheckCircle2,
  RotateCcw,
  Layers,
  Table as TableIcon,
  Download,
} from "lucide-react";
import {
  runScreener,
  getScreenerPresets,
  type ScreenerResultItem,
  type ScreenerPreset,
} from "@/lib/api";
import NavigationShell from "@/components/NavigationShell";
import MarketHeatmap from "@/components/MarketHeatmap";

export default function ScreenerPage() {
  const [presets, setPresets] = useState<ScreenerPreset[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "heatmap">("table");

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
    <NavigationShell activePath="/screener">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <Filter size={14} /> Fundamental Query Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Fundamental Stock Screener
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Filter Indian and global equities across canonical golden ratios, profitability metrics, cash flow conversion, and balance sheet solvency.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] text-xs shadow-xs">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <TableIcon size={13} /> Table View
            </button>
            <button
              onClick={() => setViewMode("heatmap")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === "heatmap"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers size={13} /> Heatmap View
            </button>
          </div>
        </div>

        {/* Thematic Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            PRE-BUILT THEMATIC SCREENS (TICKERTAPE BENCHMARK)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {presets.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`p-4 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-600/15 border-blue-500 text-blue-900 dark:text-white shadow-sm"
                      : "bg-white dark:bg-[#0B1930] border-slate-200 dark:border-[#162C4E] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start justify-between w-full">
                    <span className="font-bold text-xs">{preset.name}</span>
                    {isSelected && <CheckCircle2 size={14} className="text-blue-600 dark:text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Quantitative Sliders Form */}
        <form onSubmit={handleFilterSubmit} className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
            <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-blue-500" /> Custom Metric Thresholds
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold transition"
            >
              <RotateCcw size={12} /> Reset Criteria
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                SECTOR
              </label>
              <input
                type="text"
                placeholder="e.g. Energy, IT"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                MIN ROE (%)
              </label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={minRoe}
                onChange={(e) => setMinRoe(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                MAX P/E RATIO
              </label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={maxPe}
                onChange={(e) => setMaxPe(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                MAX DEBT / EQUITY
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 1.0"
                value={maxDebtEquity}
                onChange={(e) => setMaxDebtEquity(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                MIN OPM (%)
              </label>
              <input
                type="number"
                placeholder="e.g. 12"
                value={minOpm}
                onChange={(e) => setMinOpm(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              {loading ? "Running Query..." : "Execute Screen"}
            </button>
          </div>
        </form>

        {/* Results View (Table or Heatmap) */}
        {viewMode === "heatmap" ? (
          <div className="space-y-3">
            <MarketHeatmap initialUniverse="all" />
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] overflow-x-auto shadow-xs scrollbar-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                Found <strong className="text-slate-900 dark:text-white">{results.length}</strong> matching companies
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-3">SYMBOL &amp; COMPANY</th>
                  <th className="py-3 px-3">SECTOR</th>
                  <th className="py-3 px-3 text-right">MARKET CAP</th>
                  <th className="py-3 px-3 text-right">P/E RATIO</th>
                  <th className="py-3 px-3 text-right">ROE (%)</th>
                  <th className="py-3 px-3 text-right">OPM (%)</th>
                  <th className="py-3 px-3 text-right">DEBT/EQUITY</th>
                  <th className="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60">
                {results.map((item) => (
                  <tr key={item.symbol} className="hover:bg-slate-50 dark:hover:bg-[#10223B]/60 transition group cursor-pointer">
                    <td className="py-3 px-3">
                      <Link
                        href={`/company/${item.symbol.toLowerCase()}`}
                        className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 flex items-center gap-1.5 transition"
                      >
                        {item.symbol}
                      </Link>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.company_name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-[11px] font-mono">{item.sector}</td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                      ₹{item.market_cap.toLocaleString("en-IN")} Cr
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                      {item.pe_ratio !== null ? `${item.pe_ratio}x` : "—"}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {item.roe}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                      {item.operating_margin}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                      {item.debt_to_equity}x
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Link
                        href={`/company/${item.symbol.toLowerCase()}`}
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-blue-600/15 hover:bg-blue-600 text-blue-600 dark:text-white hover:text-white transition font-semibold"
                      >
                        Inspect <ArrowUpRight size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}

                {results.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                      No companies match the specified criteria. Try loosening the filter thresholds.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
