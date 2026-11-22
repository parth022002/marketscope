"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Maximize2,
  Minimize2,
  Grid,
  Columns,
  Rows,
  Square,
  Search,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  BarChart2,
  Save,
} from "lucide-react";
import StockChart from "@/components/chart/StockChart";
import {
  getChartLayouts,
  saveChartLayout,
  type ChartLayoutItem,
} from "@/lib/api";

const QUICK_WATCHLIST = [
  { symbol: "NIFTY", name: "Nifty 50 Index", exchange: "NSE", price: "25,800.60", change: "+1.12%" },
  { symbol: "BANKNIFTY", name: "Nifty Bank Index", exchange: "NSE", price: "54,635.20", change: "+2.49%" },
  { symbol: "SENSEX", name: "BSE Sensex 30", exchange: "BSE", price: "83,919.71", change: "+1.08%" },
  { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", price: "1,377.50", change: "+0.14%" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE", price: "1,745.20", change: "+1.85%" },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", price: "4,210.00", change: "-0.45%" },
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE", price: "1,885.50", change: "+0.60%" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE", price: "1,260.40", change: "+1.92%" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", price: "$232.50", change: "+1.20%" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", price: "$141.20", change: "+3.85%" },
];

export default function ChartsTerminalPage() {
  const [layoutMode, setLayoutMode] = useState<"single" | "split_2h" | "split_2v" | "grid_4">("single");
  const [symbols, setSymbols] = useState<string[]>(["NIFTY", "BANKNIFTY", "RELIANCE", "TCS"]);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWatchlist, setShowWatchlist] = useState(true);
  const [savedLayouts, setSavedLayouts] = useState<ChartLayoutItem[]>([]);
  const [layoutName, setLayoutName] = useState("My Workspace");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getChartLayouts()
      .then((res) => setSavedLayouts(res))
      .catch(() => {});
  }, []);

  const handleSelectSymbol = (sym: string) => {
    const updated = [...symbols];
    updated[activeSlot] = sym;
    setSymbols(updated);
  };

  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      const saved = await saveChartLayout({
        name: layoutName,
        layout_type: layoutMode,
        active_symbols: symbols,
      });
      setSavedLayouts((prev) => [saved, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0A0E17] text-slate-100 overflow-hidden select-none">
      {/* ── TOP TERMINAL BAR ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-[#0F172A]/90 backdrop-blur z-20 gap-3">
        {/* Left: Active symbol & Quick Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs">
            <span className="font-bold text-sky-400 tracking-wider">
              {symbols[activeSlot] || "NIFTY"}
            </span>
            <span className="text-[10px] text-slate-400">SLOT {activeSlot + 1}</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Quick search symbol (e.g. INFY)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleSelectSymbol(searchQuery.trim().toUpperCase());
                  setSearchQuery("");
                }
              }}
              className="bg-slate-900/90 border border-slate-700/80 rounded px-2.5 py-1 text-xs w-48 focus:outline-none focus:border-sky-500 text-slate-200 placeholder-slate-500"
            />
          </div>

          <Link
            href={`/company/${symbols[activeSlot] || "NIFTY"}`}
            target="_blank"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-sky-400 px-2 py-1 rounded hover:bg-slate-800 transition"
            title="Open comprehensive stock fundamental dossier"
          >
            <span>Dossier</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Center: Multi-Chart Layout Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-800">
          <button
            onClick={() => setLayoutMode("single")}
            className={`p-1.5 rounded transition ${layoutMode === "single" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            title="Single Chart View"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayoutMode("split_2v")}
            className={`p-1.5 rounded transition ${layoutMode === "split_2v" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            title="2 Split Vertical Panes"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayoutMode("split_2h")}
            className={`p-1.5 rounded transition ${layoutMode === "split_2h" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            title="2 Split Horizontal Panes"
          >
            <Rows className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setLayoutMode("grid_4")}
            className={`p-1.5 rounded transition ${layoutMode === "grid_4" ? "bg-sky-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            title="4 Grid Chart Layout"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick actions & Watchlist Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick links to quantitative and screening engines */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 border-r border-slate-800 pr-2 mr-1">
            <Link href="/screener" className="px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200">
              Screener
            </Link>
            <Link href="/derivatives" className="px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200">
              Options
            </Link>
            <Link href="/market-intelligence" className="px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200">
              Market Flow
            </Link>
            <Link href="/backtesting" className="px-2 py-1 rounded hover:bg-slate-800 hover:text-slate-200">
              Backtesting
            </Link>
            <Link
              href="/acknowledgements"
              className="hidden xl:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 hover:text-sky-400 bg-slate-800/60"
              title="Charting powered by TradingView Lightweight Charts (Apache 2.0)"
            >
              Lightweight Charts™
            </Link>
          </div>

          <button
            onClick={handleSaveLayout}
            disabled={isSaving}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded text-slate-200 transition"
          >
            <Save className="w-3 h-3 text-sky-400" />
            <span>{isSaving ? "Saving..." : "Save Layout"}</span>
          </button>

          <button
            onClick={() => setShowWatchlist(!showWatchlist)}
            className={`p-1.5 rounded border text-xs transition ${showWatchlist ? "bg-sky-600/20 border-sky-500/50 text-sky-300" : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200"}`}
            title="Toggle Watchlist Bar"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE BODY ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Chart Canvas Area */}
        <div className="flex-1 h-full overflow-hidden p-1 bg-black/40">
          {layoutMode === "single" && (
            <div
              className={`w-full h-full rounded border ${activeSlot === 0 ? "border-sky-500/40" : "border-slate-800"}`}
              onClick={() => setActiveSlot(0)}
            >
              <StockChart
                symbol={symbols[0]}
                exchange="NSE"
                initialTimeframe="1D"
                onSymbolChange={(s) => {
                  const u = [...symbols];
                  u[0] = s;
                  setSymbols(u);
                }}
                className="h-full"
              />
            </div>
          )}

          {layoutMode === "split_2v" && (
            <div className="grid grid-cols-2 gap-1 w-full h-full">
              {[0, 1].map((slot) => (
                <div
                  key={slot}
                  onClick={() => setActiveSlot(slot)}
                  className={`w-full h-full rounded border overflow-hidden ${activeSlot === slot ? "border-sky-500/60 ring-1 ring-sky-500/30" : "border-slate-800"}`}
                >
                  <StockChart
                    symbol={symbols[slot]}
                    exchange="NSE"
                    initialTimeframe="1D"
                    onSymbolChange={(s) => {
                      const u = [...symbols];
                      u[slot] = s;
                      setSymbols(u);
                    }}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          )}

          {layoutMode === "split_2h" && (
            <div className="grid grid-rows-2 gap-1 w-full h-full">
              {[0, 1].map((slot) => (
                <div
                  key={slot}
                  onClick={() => setActiveSlot(slot)}
                  className={`w-full h-full rounded border overflow-hidden ${activeSlot === slot ? "border-sky-500/60 ring-1 ring-sky-500/30" : "border-slate-800"}`}
                >
                  <StockChart
                    symbol={symbols[slot]}
                    exchange="NSE"
                    initialTimeframe="1D"
                    onSymbolChange={(s) => {
                      const u = [...symbols];
                      u[slot] = s;
                      setSymbols(u);
                    }}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          )}

          {layoutMode === "grid_4" && (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  onClick={() => setActiveSlot(slot)}
                  className={`w-full h-full rounded border overflow-hidden ${activeSlot === slot ? "border-sky-500/60 ring-1 ring-sky-500/30" : "border-slate-800"}`}
                >
                  <StockChart
                    symbol={symbols[slot]}
                    exchange="NSE"
                    initialTimeframe="1D"
                    onSymbolChange={(s) => {
                      const u = [...symbols];
                      u[slot] = s;
                      setSymbols(u);
                    }}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT WATCHLIST SIDEBAR ─────────────────────────────────── */}
        {showWatchlist && (
          <aside className="w-64 border-l border-slate-800/90 bg-[#0B101D] flex flex-col z-10 shrink-0">
            <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Watchlist</span>
              <span className="text-[10px] text-slate-500">1-Click Slot Load</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {QUICK_WATCHLIST.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => handleSelectSymbol(item.symbol)}
                  className="w-full px-3 py-2 flex items-center justify-between hover:bg-slate-800/50 text-left transition group"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-sky-400">
                        {item.symbol}
                      </span>
                      <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">
                        {item.exchange}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {item.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-200 block">
                      {item.price}
                    </span>
                    <span
                      className={`text-[10px] font-mono ${item.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {item.change}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
              Clicking a symbol updates active Slot {activeSlot + 1}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
