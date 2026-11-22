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
  BarChart2,
  TrendingUp,
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
  const [exchange, setExchange] = useState("");
  const [sector, setSector] = useState("");
  const [marketCapCat, setMarketCapCat] = useState("");
  const [minRoe, setMinRoe] = useState<number | "">("");
  const [maxPe, setMaxPe] = useState<number | "">("");
  const [maxPb, setMaxPb] = useState<number | "">("");
  const [maxDebtEquity, setMaxDebtEquity] = useState<number | "">("");
  const [minOpm, setMinOpm] = useState<number | "">("");
  const [minDivYield, setMinDivYield] = useState<number | "">("");
  const [minRsi, setMinRsi] = useState<number | "">("");
  const [maxRsi, setMaxRsi] = useState<number | "">("");

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
    exchange?: string;
    sector?: string;
    market_cap_category?: string;
    min_roe?: number;
    max_pe?: number;
    max_pb?: number;
    max_debt_equity?: number;
    min_opm?: number;
    min_dividend_yield?: number;
    min_rsi?: number;
    max_rsi?: number;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await runScreener({
        exchange: criteria.exchange || undefined,
        sector: criteria.sector || undefined,
        market_cap_category: criteria.market_cap_category || undefined,
        min_roe: criteria.min_roe !== undefined ? Number(criteria.min_roe) : undefined,
        max_pe: criteria.max_pe !== undefined ? Number(criteria.max_pe) : undefined,
        max_pb: criteria.max_pb !== undefined ? Number(criteria.max_pb) : undefined,
        max_debt_equity: criteria.max_debt_equity !== undefined ? Number(criteria.max_debt_equity) : undefined,
        min_opm: criteria.min_opm !== undefined ? Number(criteria.min_opm) : undefined,
        min_dividend_yield: criteria.min_dividend_yield !== undefined ? Number(criteria.min_dividend_yield) : undefined,
        min_rsi: criteria.min_rsi !== undefined ? Number(criteria.min_rsi) : undefined,
        max_rsi: criteria.max_rsi !== undefined ? Number(criteria.max_rsi) : undefined,
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
    const crit = preset.criteria || {};
    setMinRoe(crit.min_roe !== undefined ? crit.min_roe : "");
    setMaxPe(crit.max_pe !== undefined ? crit.max_pe : "");
    setMaxPb(crit.max_pb !== undefined ? crit.max_pb : "");
    setMaxDebtEquity(crit.max_debt_equity !== undefined ? crit.max_debt_equity : "");
    setMinOpm(crit.min_opm !== undefined ? crit.min_opm : "");
    setMinDivYield(crit.min_dividend_yield !== undefined ? crit.min_dividend_yield : "");
    setMinRsi(crit.min_rsi !== undefined ? crit.min_rsi : "");
    setMaxRsi(crit.max_rsi !== undefined ? crit.max_rsi : "");
    setSector(crit.sector || "");
    setExchange(crit.exchange || "");

    executeScreen(crit);
  }

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActivePresetId(null);
    executeScreen({
      exchange: exchange || undefined,
      sector: sector || undefined,
      market_cap_category: marketCapCat || undefined,
      min_roe: minRoe !== "" ? Number(minRoe) : undefined,
      max_pe: maxPe !== "" ? Number(maxPe) : undefined,
      max_pb: maxPb !== "" ? Number(maxPb) : undefined,
      max_debt_equity: maxDebtEquity !== "" ? Number(maxDebtEquity) : undefined,
      min_opm: minOpm !== "" ? Number(minOpm) : undefined,
      min_dividend_yield: minDivYield !== "" ? Number(minDivYield) : undefined,
      min_rsi: minRsi !== "" ? Number(minRsi) : undefined,
      max_rsi: maxRsi !== "" ? Number(maxRsi) : undefined,
    });
  }

  function handleReset() {
    setActivePresetId(null);
    setExchange("");
    setSector("");
    setMarketCapCat("");
    setMinRoe("");
    setMaxPe("");
    setMaxPb("");
    setMaxDebtEquity("");
    setMinOpm("");
    setMinDivYield("");
    setMinRsi("");
    setMaxRsi("");
    executeScreen({});
  }

  function exportToCsv() {
    if (!results.length) return;
    const headers = [
      "Symbol",
      "Company Name",
      "Exchange",
      "Sector",
      "Price",
      "Change %",
      "Market Cap",
      "P/E",
      "P/B",
      "ROE %",
      "OPM %",
      "Debt/Equity",
      "Div Yield %",
      "RSI 14",
    ];
    const rows = results.map((r) => [
      r.symbol,
      `"${r.company_name}"`,
      r.exchange,
      `"${r.sector}"`,
      r.price,
      r.change_pct,
      r.market_cap,
      r.pe_ratio ?? "",
      r.pb_ratio ?? "",
      r.roe,
      r.operating_margin,
      r.debt_to_equity,
      r.dividend_yield ?? "",
      r.rsi_14 ?? "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marketscope_screener_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <NavigationShell activePath="/screener">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <Filter size={14} /> Fundamental &amp; Quantitative Query Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Universal Stock Screener
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Screen multi-exchange securities across valuation multiples (P/E, P/B), capital efficiency (ROE, ROCE), leverage, technical momentum (RSI), and 52-week price channels.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCsv}
              disabled={results.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1930] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>

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
                <Layers size={13} /> Heatmap
              </button>
            </div>
          </div>
        </div>

        {/* Thematic Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            PRE-BUILT THEMATIC STRATEGIES (TICKERTAPE &amp; QUANTITATIVE REFERENCE)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {presets.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between shadow-xs ${
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
              <SlidersHorizontal size={14} className="text-blue-500" /> Multi-Criteria Filter Matrix
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold transition"
            >
              <RotateCcw size={12} /> Reset All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                EXCHANGE
              </label>
              <select
                value={exchange}
                onChange={(e) => setExchange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">All Exchanges</option>
                <option value="NSE">NSE (India)</option>
                <option value="BSE">BSE (India)</option>
                <option value="NASDAQ">NASDAQ (US)</option>
                <option value="NYSE">NYSE (US)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                SECTOR
              </label>
              <input
                type="text"
                placeholder="e.g. Energy, IT, Bank"
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
                MAX P/E
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
                MAX DEBT/EQUITY
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 0.8"
                value={maxDebtEquity}
                onChange={(e) => setMaxDebtEquity(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                MIN DIV YIELD (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 1.5"
                value={minDivYield}
                onChange={(e) => setMinDivYield(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              {loading ? "Screening Universe..." : "Execute Screen"}
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
                Found <strong className="text-slate-900 dark:text-white">{results.length}</strong> matching securities
              </span>
              <span className="text-[11px] text-slate-400">
                Prices and ratios audited against verified market database
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-3">SYMBOL &amp; COMPANY</th>
                  <th className="py-3 px-3">EXCHANGE</th>
                  <th className="py-3 px-3">SECTOR</th>
                  <th className="py-3 px-3 text-right">PRICE</th>
                  <th className="py-3 px-3 text-right">CHG %</th>
                  <th className="py-3 px-3 text-right">MARKET CAP</th>
                  <th className="py-3 px-3 text-right">P/E</th>
                  <th className="py-3 px-3 text-right">ROE</th>
                  <th className="py-3 px-3 text-right">OPM</th>
                  <th className="py-3 px-3 text-right">D/E</th>
                  <th className="py-3 px-3 text-right">DIV YIELD</th>
                  <th className="py-3 px-3 text-right">RSI (14)</th>
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
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate max-w-[150px]">
                        {item.company_name}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                        {item.exchange}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-[11px]">
                      {item.sector}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-white tabular-nums">
                      {item.price ? `₹${item.price.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span className={(item.change_pct ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"}>
                        {(item.change_pct ?? 0) >= 0 ? `+${(item.change_pct ?? 0).toFixed(2)}%` : `${(item.change_pct ?? 0).toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-white tabular-nums">
                      {item.market_cap_display || `₹${item.market_cap.toLocaleString("en-IN")} Cr`}
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
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                      {item.dividend_yield ? `${item.dividend_yield}%` : "—"}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                      {item.rsi_14 ?? "—"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/charts?symbol=${item.symbol}`}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                          title="Open in Charting Terminal"
                        >
                          <BarChart2 size={11} />
                        </Link>
                        <Link
                          href={`/company/${item.symbol.toLowerCase()}`}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-blue-600/15 hover:bg-blue-600 text-blue-600 dark:text-cyan-400 hover:text-white transition font-semibold"
                          title="View Comprehensive Fundamental Dossier"
                        >
                          Dossier <ArrowUpRight size={11} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {results.length === 0 && !loading && (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-400 text-xs">
                      No securities match the specified criteria. Try loosening the filter thresholds.
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
