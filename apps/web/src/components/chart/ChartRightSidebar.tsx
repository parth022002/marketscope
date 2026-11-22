"use client";

import { useState } from "react";
import {
  List,
  BarChart2,
  Bell,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export interface WatchlistItem {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  exchange: string;
}

export interface InstrumentStats {
  symbol: string;
  name: string;
  exchange: string;
  assetClass: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  week52High: number;
  week52Low: number;
  volume: number;
  avgVolume30D: number;
  marketCap?: string;
  peRatio?: number;
  beta?: number;
  dataStatus?: string;
  marketStatus?: string;
  lastUpdated?: string;
}

export interface ChartAlertItem {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: "CROSSES_ABOVE" | "CROSSES_BELOW" | "GREATER_THAN" | "LESS_THAN";
  note?: string;
  createdAt: string;
}

interface ChartRightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  stats: InstrumentStats;
  alerts: ChartAlertItem[];
  onCreateAlert: (alert: Omit<ChartAlertItem, "id" | "createdAt">) => void;
  onDeleteAlert: (id: string) => void;
}

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { symbol: "NIFTY", name: "Nifty 50 Index", lastPrice: 25800.60, change: 286.30, changePercent: 1.12, exchange: "NSE" },
  { symbol: "BANKNIFTY", name: "Nifty Bank Index", lastPrice: 53635.20, change: 1572.20, changePercent: 2.49, exchange: "NSE" },
  { symbol: "SENSEX", name: "BSE Sensex Index", lastPrice: 83919.71, change: 897.96, changePercent: 1.08, exchange: "BSE" },
  { symbol: "RELIANCE", name: "Reliance Industries", lastPrice: 1377.50, change: 1.90, changePercent: 0.14, exchange: "NSE" },
  { symbol: "TCS", name: "Tata Consultancy Services", lastPrice: 4180.20, change: 45.30, changePercent: 1.10, exchange: "NSE" },
  { symbol: "INFY", name: "Infosys Ltd", lastPrice: 1885.60, change: -12.40, changePercent: -0.65, exchange: "NSE" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", lastPrice: 942.50, change: 18.20, changePercent: 1.97, exchange: "NSE" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", lastPrice: 1745.00, change: 8.50, changePercent: 0.49, exchange: "NSE" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", lastPrice: 1290.40, change: 14.20, changePercent: 1.11, exchange: "NSE" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", lastPrice: 1595.00, change: 22.00, changePercent: 1.40, exchange: "NSE" },
];

export default function ChartRightSidebar({
  isOpen,
  onToggle,
  activeSymbol,
  onSelectSymbol,
  stats,
  alerts,
  onCreateAlert,
  onDeleteAlert,
}: ChartRightSidebarProps) {
  const [activeTab, setActiveTab] = useState<"watchlist" | "overview" | "alerts">("overview");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(DEFAULT_WATCHLIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [newSymbolInput, setNewSymbolInput] = useState("");

  // Alert Form State
  const [alertPrice, setAlertPrice] = useState<string>(stats.price.toFixed(2));
  const [alertCondition, setAlertCondition] = useState<ChartAlertItem["condition"]>("CROSSES_ABOVE");
  const [alertNote, setAlertNote] = useState("");

  if (!isOpen) {
    return (
      <div className="flex flex-col items-center py-3 bg-[#071426] border-l border-[#162C4E] w-10 shrink-0 select-none z-20">
        <button
          onClick={onToggle}
          title="Open Side Panel"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1930] transition"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="w-5 h-px bg-[#162C4E] my-2" />
        <button
          onClick={() => {
            setActiveTab("overview");
            onToggle();
          }}
          title="Details & Market Stats"
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-[#0B1930] transition"
        >
          <BarChart2 size={16} />
        </button>
        <button
          onClick={() => {
            setActiveTab("watchlist");
            onToggle();
          }}
          title="Watchlist"
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-[#0B1930] transition"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => {
            setActiveTab("alerts");
            onToggle();
          }}
          title="Price Alerts"
          className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-[#0B1930] transition relative"
        >
          <Bell size={16} />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
      </div>
    );
  }

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbolInput.trim()) return;
    const sym = newSymbolInput.trim().toUpperCase();
    if (!watchlist.some((w) => w.symbol === sym)) {
      setWatchlist([
        ...watchlist,
        {
          symbol: sym,
          name: sym + " Equities",
          lastPrice: stats.price,
          change: 0,
          changePercent: 0,
          exchange: "NSE",
        },
      ]);
    }
    setNewSymbolInput("");
  };

  const handleCreateAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(alertPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;
    onCreateAlert({
      symbol: activeSymbol,
      targetPrice: priceNum,
      condition: alertCondition,
      note: alertNote.trim() || undefined,
    });
    setAlertNote("");
  };

  const isPositive = stats.change >= 0;
  const dayRangePct =
    stats.high > stats.low
      ? Math.max(0, Math.min(100, ((stats.price - stats.low) / (stats.high - stats.low)) * 100))
      : 50;

  const week52RangePct =
    stats.week52High > stats.week52Low
      ? Math.max(0, Math.min(100, ((stats.price - stats.week52Low) / (stats.week52High - stats.week52Low)) * 100))
      : 50;

  const volRatio = stats.avgVolume30D > 0 ? (stats.volume / stats.avgVolume30D) * 100 : 100;

  return (
    <div className="flex flex-col w-80 md:w-88 shrink-0 bg-[#071426] border-l border-[#162C4E] h-full select-none text-xs font-mono z-20 overflow-hidden">
      {/* Top Sidebar Header & Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#162C4E] bg-[#09182E]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              activeTab === "overview"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-400 hover:text-white hover:bg-[#0B1930]"
            }`}
          >
            <BarChart2 size={13} />
            <span>Details</span>
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              activeTab === "watchlist"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-400 hover:text-white hover:bg-[#0B1930]"
            }`}
          >
            <List size={13} />
            <span>Watchlist</span>
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
              activeTab === "alerts"
                ? "bg-blue-600 text-white font-bold"
                : "text-slate-400 hover:text-white hover:bg-[#0B1930]"
            }`}
          >
            <Bell size={13} />
            <span>Alerts</span>
            {alerts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40">
                {alerts.length}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={onToggle}
          title="Collapse Panel"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1930] transition"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ==================== TAB 1: OVERVIEW & STATS ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Primary Header Card (from screenshot) */}
            <div className="p-3.5 rounded-xl bg-[#0B1930] border border-[#162C4E] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base tracking-wide">{stats.symbol}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#10223B] text-cyan-400 border border-[#162C4E]">
                      {stats.assetClass || "Stock"} · {stats.exchange}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans truncate max-w-[200px]">
                    {stats.name}
                  </div>
                </div>

                {/* Data freshness indicator */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>{stats.dataStatus || "15 min delayed"}</span>
                </div>
              </div>

              {/* Price & Change Block */}
              <div className="pt-1">
                <div className="text-2xl font-black tracking-tight text-white">
                  ₹{stats.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold mt-0.5 ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  <span>
                    {isPositive ? "+" : ""}
                    {stats.change.toFixed(2)} ({isPositive ? "+" : ""}
                    {stats.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Market Status & Timestamp */}
              <div className="flex items-center justify-between pt-2 border-t border-[#162C4E] text-[10px] text-slate-400 font-sans">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>{stats.marketStatus || "Market closed"}</span>
                </span>
                <span>{stats.lastUpdated || "Nov 21, 15:30 IST"}</span>
              </div>
            </div>

            {/* Volume vs 30D Average Bar (TradingView screenshot layout) */}
            <div className="p-3 rounded-xl bg-[#0B1930] border border-[#162C4E] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-400 font-sans">Volume: </span>
                  <span className="text-white font-bold font-mono">
                    {(stats.volume / 1e6).toFixed(2)}M
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Avg. Vol (30D): </span>
                  <span className="text-slate-300 font-bold font-mono">
                    {(stats.avgVolume30D / 1e6).toFixed(2)}M
                  </span>
                </div>
              </div>

              {/* Comparative Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-[#162C4E] overflow-hidden flex">
                <div
                  className="h-full bg-cyan-400 transition-all rounded-full"
                  style={{ width: `${Math.min(100, volRatio)}%` }}
                />
              </div>
            </div>

            {/* Day Range Slider Bar */}
            <div className="p-3 rounded-xl bg-[#0B1930] border border-[#162C4E] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Day Range</span>
                <span className="text-cyan-400 font-bold">₹{stats.price.toFixed(2)}</span>
              </div>
              <div className="relative w-full h-1.5 rounded-full bg-[#162C4E]">
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-blue-600 shadow"
                  style={{ left: `${dayRangePct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>L: ₹{stats.low.toFixed(2)}</span>
                <span>H: ₹{stats.high.toFixed(2)}</span>
              </div>
            </div>

            {/* 52-Week Range Slider Bar */}
            <div className="p-3 rounded-xl bg-[#0B1930] border border-[#162C4E] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>52-Week Range</span>
              </div>
              <div className="relative w-full h-1.5 rounded-full bg-[#162C4E]">
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#0B1930] shadow"
                  style={{ left: `${week52RangePct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>52W L: ₹{stats.week52Low.toFixed(2)}</span>
                <span>52W H: ₹{stats.week52High.toFixed(2)}</span>
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div className="p-3 rounded-xl bg-[#0B1930] border border-[#162C4E] space-y-2">
              <div className="text-[11px] font-bold text-slate-300 font-sans uppercase tracking-wider">
                Key Market Statistics
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-1.5 rounded bg-[#071426] border border-[#162C4E]">
                  <span className="text-slate-400 font-sans">Open</span>
                  <span className="font-bold text-white">₹{stats.open.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-[#071426] border border-[#162C4E]">
                  <span className="text-slate-400 font-sans">Prev Close</span>
                  <span className="font-bold text-white">₹{stats.prevClose.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-[#071426] border border-[#162C4E]">
                  <span className="text-slate-400 font-sans">Market Cap</span>
                  <span className="font-bold text-white">{stats.marketCap || "₹18.64T"}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-[#071426] border border-[#162C4E]">
                  <span className="text-slate-400 font-sans">P/E Ratio</span>
                  <span className="font-bold text-white">{stats.peRatio ? stats.peRatio.toFixed(1) : "24.6"}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-[#071426] border border-[#162C4E]">
                  <span className="text-slate-400 font-sans">Beta (1Y)</span>
                  <span className="font-bold text-white">{stats.beta ? stats.beta.toFixed(2) : "1.08"}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-[#071426] border border-[#162C4E]">
                  <span className="text-slate-400 font-sans">Exchange</span>
                  <span className="font-bold text-cyan-400">{stats.exchange}</span>
                </div>
              </div>
            </div>

            {/* News Snippet Card (from screenshot bottom right) */}
            <div className="p-3 rounded-xl bg-[#09182E] border border-[#162C4E] space-y-1 text-slate-300">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-blue-400 font-sans">Verified News</span>
                <span>8 hours ago</span>
              </div>
              <p className="text-xs font-sans text-slate-200 line-clamp-2 leading-relaxed">
                Rollover Data | What monthly expiry tells you about next month: Strategic derivatives analysis
              </p>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: WATCHLIST ==================== */}
        {activeTab === "watchlist" && (
          <div className="space-y-3">
            {/* Search filter */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0B1930] border border-[#162C4E] text-white text-xs outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddSymbol} className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Add symbol (e.g. SBIN)"
                value={newSymbolInput}
                onChange={(e) => setNewSymbolInput(e.target.value)}
                className="flex-1 px-2.5 py-1 rounded-lg bg-[#0B1930] border border-[#162C4E] text-white text-[11px] outline-none uppercase placeholder:normal-case placeholder-slate-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
              >
                <Plus size={12} />
                <span>Add</span>
              </button>
            </form>

            {/* Watchlist Table */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Symbol</span>
                <div className="flex items-center gap-4">
                  <span>Last</span>
                  <span>Chg%</span>
                </div>
              </div>

              {filteredWatchlist.map((item) => {
                const isItemPos = item.change >= 0;
                const isCurrent = item.symbol.toUpperCase() === activeSymbol.toUpperCase();

                return (
                  <div
                    key={item.symbol}
                    onClick={() => onSelectSymbol(item.symbol)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                      isCurrent
                        ? "bg-blue-600/20 border border-blue-500/40 text-white"
                        : "bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span className={isCurrent ? "text-cyan-400" : "text-white"}>{item.symbol}</span>
                        <span className="text-[9px] text-slate-500">{item.exchange}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans truncate max-w-[110px]">
                        {item.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-white">
                        ₹{item.lastPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-[10px] font-bold ${
                          isItemPos ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isItemPos ? "+" : ""}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ALERTS ==================== */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {/* Create Alert Form */}
            <form onSubmit={handleCreateAlertSubmit} className="p-3 rounded-xl bg-[#0B1930] border border-[#162C4E] space-y-2.5">
              <div className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                <Bell size={14} className="text-amber-400" />
                <span>Create Price Alert for {activeSymbol}</span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Target Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#071426] border border-[#162C4E] text-white text-xs outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Condition</label>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="w-full px-2 py-1.5 rounded-lg bg-[#071426] border border-[#162C4E] text-slate-200 text-xs outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="CROSSES_ABOVE">Crosses Above (↑)</option>
                  <option value="CROSSES_BELOW">Crosses Below (↓)</option>
                  <option value="GREATER_THAN">Greater Than (≥)</option>
                  <option value="LESS_THAN">Less Than (≤)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Breakout retest level"
                  value={alertNote}
                  onChange={(e) => setAlertNote(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#071426] border border-[#162C4E] text-white text-xs outline-none focus:border-amber-400 placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Set Alert</span>
              </button>
            </form>

            {/* Active Alerts List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 font-sans">
                <span>Active Alerts ({alerts.length})</span>
              </div>

              {alerts.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0B1930] border border-[#162C4E] text-center text-slate-400 text-xs">
                  No active alerts. Create one above to monitor key price triggers.
                </div>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1930] border border-[#162C4E]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{al.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          {al.condition.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-cyan-400 mt-0.5">
                        ₹{al.targetPrice.toFixed(2)}
                      </div>
                      {al.note && <div className="text-[10px] text-slate-400 font-sans mt-0.5">{al.note}</div>}
                    </div>

                    <button
                      onClick={() => onDeleteAlert(al.id)}
                      title="Delete Alert"
                      className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-[#071426] transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
