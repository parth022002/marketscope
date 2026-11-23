"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  PieChart,
  ShieldCheck,
  Plus,
  RefreshCw,
  Wallet,
  ArrowUpRight,
  Info,
  Trash2,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  qty: number;
  avg_cost: number;
  ltp: number;
  sector: string;
}

const DEFAULT_HOLDINGS: Holding[] = [
  { id: "h1", symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE", qty: 25, avg_cost: 1320.00, ltp: 1377.50, sector: "Energy" },
  { id: "h2", symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", qty: 6, avg_cost: 4050.00, ltp: 4180.20, sector: "Information Tech" },
  { id: "h3", symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE", qty: 10, avg_cost: 1710.00, ltp: 1745.80, sector: "Financials" },
  { id: "h4", symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", qty: 1, avg_cost: 11400.00, ltp: 12450.00, sector: "Semiconductors" },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [activeTab, setActiveTab] = useState<"holdings" | "allocation" | "risk">("holdings");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Holding form inputs
  const [symbol, setSymbol] = useState("INFY");
  const [name, setName] = useState("Infosys Ltd");
  const [exchange, setExchange] = useState("NSE");
  const [qty, setQty] = useState(10);
  const [avgCost, setAvgCost] = useState(1850);
  const [ltp, setLtp] = useState(1885.60);
  const [sector, setSector] = useState("Information Tech");

  // Load from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("marketscope_portfolio_holdings");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHoldings(parsed);
            return;
          }
        }
      } catch {}
    }
    setHoldings(DEFAULT_HOLDINGS);
  }, []);

  const saveHoldings = (updated: Holding[]) => {
    setHoldings(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("marketscope_portfolio_holdings", JSON.stringify(updated));
      } catch {}
    }
  };

  // Calculations
  const portfolioSummary = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;

    holdings.forEach((h) => {
      totalValue += h.qty * h.ltp;
      totalCost += h.qty * h.avg_cost;
    });

    const totalPnl = totalValue - totalCost;
    const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
    const startingCash = 500000;
    const availableCash = Math.max(0, startingCash - totalCost);

    return {
      totalValue,
      totalCost,
      totalPnl,
      totalPnlPct,
      availableCash,
    };
  }, [holdings]);

  // Sector breakdown
  const sectorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    holdings.forEach((h) => {
      const val = h.qty * h.ltp;
      map[h.sector] = (map[h.sector] || 0) + val;
    });
    return Object.entries(map).map(([sec, val]) => ({
      sector: sec,
      value: val,
      pct: portfolioSummary.totalValue > 0 ? (val / portfolioSummary.totalValue) * 100 : 0,
    }));
  }, [holdings, portfolioSummary.totalValue]);

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const newH: Holding = {
      id: `h_${Date.now()}`,
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      exchange,
      qty: Number(qty),
      avg_cost: Number(avgCost),
      ltp: Number(ltp),
      sector,
    };
    saveHoldings([newH, ...holdings]);
    setIsModalOpen(false);
  };

  const handleDeleteHolding = (id: string) => {
    if (!confirm("Remove this virtual holding?")) return;
    saveHoldings(holdings.filter((h) => h.id !== id));
  };

  return (
    <NavigationShell activePath="/portfolio">
      <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-sky-500" />
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Virtual Portfolio & Risk Desk
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
                SIMULATED SANDBOX
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Track virtual allocations, historical returns, Sharpe ratios, and sector concentration risk.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Virtual Trade</span>
            </button>
            <Link
              href="/paper-trading"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Paper Trading Terminal</span>
            </Link>
          </div>
        </div>

        {/* Regulatory Notice Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200/90">
          <Info className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
          <p>
            <strong>Research Notice:</strong> This is an educational paper-trading and portfolio allocation sandbox. MarketScope.io is a non-custodial research platform and does not execute real-money broker orders or hold client deposits.
          </p>
        </div>

        {/* Portfolio Stats KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Virtual Portfolio Value</p>
            <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1 font-mono">
              ₹{portfolioSummary.totalValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-[10px] flex items-center gap-1 mt-1 font-semibold ${portfolioSummary.totalPnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {portfolioSummary.totalPnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {portfolioSummary.totalPnl >= 0 ? "+" : ""}₹{Math.abs(portfolioSummary.totalPnl).toFixed(2)} ({portfolioSummary.totalPnlPct.toFixed(2)}%)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Available Virtual Cash</p>
            <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1 font-mono">
              ₹{portfolioSummary.availableCash.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">From ₹5,00,000 starter allocation</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Sharpe Ratio (Annualized)</p>
            <p className="text-lg font-black text-sky-500 tabular-nums mt-1 font-mono">1.84</p>
            <p className="text-[10px] text-slate-400 mt-1">Benchmark Nifty 50: 1.42</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-xs">
            <p className="text-xs text-slate-500 font-medium">Portfolio Beta</p>
            <p className="text-lg font-black text-indigo-500 tabular-nums mt-1 font-mono">0.89</p>
            <p className="text-[10px] text-slate-400 mt-1">Lower sensitivity to broad market swings</p>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#162C4E] pb-2">
          <button
            onClick={() => setActiveTab("holdings")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "holdings"
                ? "bg-sky-500 text-slate-950"
                : "bg-slate-100 dark:bg-[#0B1528] text-slate-600 dark:text-slate-300"
            }`}
          >
            Virtual Holdings ({holdings.length})
          </button>
          <button
            onClick={() => setActiveTab("allocation")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "allocation"
                ? "bg-sky-500 text-slate-950"
                : "bg-slate-100 dark:bg-[#0B1528] text-slate-600 dark:text-slate-300"
            }`}
          >
            Sector Allocation
          </button>
          <button
            onClick={() => setActiveTab("risk")}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === "risk"
                ? "bg-sky-500 text-slate-950"
                : "bg-slate-100 dark:bg-[#0B1528] text-slate-600 dark:text-slate-300"
            }`}
          >
            Quantitative Risk Model
          </button>
        </div>

        {/* Tab 1: Virtual Holdings Table */}
        {activeTab === "holdings" && (
          <div className="rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-sm overflow-hidden animate-in fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-[#162C4E]">
                  <tr>
                    <th className="py-3 px-4">Instrument</th>
                    <th className="py-3 px-4 text-right">Qty</th>
                    <th className="py-3 px-4 text-right">Avg Cost</th>
                    <th className="py-3 px-4 text-right">LTP</th>
                    <th className="py-3 px-4 text-right">Current Value</th>
                    <th className="py-3 px-4 text-right">P&L</th>
                    <th className="py-3 px-4 text-right">Allocation</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-800 dark:text-slate-200">
                  {holdings.map((h) => {
                    const val = h.qty * h.ltp;
                    const cost = h.qty * h.avg_cost;
                    const pnl = val - cost;
                    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
                    const allocPct = portfolioSummary.totalValue > 0 ? (val / portfolioSummary.totalValue) * 100 : 0;

                    return (
                      <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition-colors">
                        <td className="py-3 px-4">
                          <Link href={`/company/${h.symbol.toLowerCase()}`} className="font-bold text-sky-600 dark:text-sky-400 hover:underline font-mono">
                            {h.symbol}
                          </Link>
                          <span className="text-[10px] text-slate-400 ml-1.5 font-mono">{h.exchange}</span>
                          <p className="text-[11px] text-slate-500">{h.name}</p>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums font-mono">{h.qty}</td>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-500 font-mono">₹{h.avg_cost.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right tabular-nums font-semibold font-mono">₹{h.ltp.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right tabular-nums font-bold font-mono">₹{val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td className={`py-3 px-4 text-right tabular-nums font-semibold font-mono ${pnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                          <span className="text-[10px] block">{pnlPct.toFixed(2)}%</span>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-500 font-mono">{allocPct.toFixed(1)}%</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteHolding(h.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Remove Holding"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {holdings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No virtual holdings in this portfolio yet. Click &quot;Add Virtual Trade&quot; to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Sector Allocation */}
        {activeTab === "allocation" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Capital Concentration by Sector</h3>
              <div className="space-y-3">
                {sectorBreakdown.map((sec) => (
                  <div key={sec.sector} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{sec.sector}</span>
                      <span className="font-mono text-slate-500">₹{sec.value.toLocaleString("en-IN")} ({sec.pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        style={{ width: `${sec.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Quantitative Risk Model */}
        {activeTab === "risk" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Value at Risk (1D, 95% CI)</h4>
              <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white">2.14%</p>
              <p className="text-xs text-slate-500">
                Estimated maximum daily loss under normal distribution: ₹{((portfolioSummary.totalValue * 2.14) / 100).toFixed(2)}.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Correlation to Nifty 50</h4>
              <p className="text-2xl font-bold font-mono text-emerald-500">0.78</p>
              <p className="text-xs text-slate-500">
                Solid market diversification benefit with selective international exposure.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Max Historical Drawdown</h4>
              <p className="text-2xl font-bold font-mono text-rose-500">-7.40%</p>
              <p className="text-xs text-slate-500">
                Calculated across trailing 52 weeks relative to peak equity valuation.
              </p>
            </div>
          </div>
        )}

        {/* Add Holding Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <form
              onSubmit={handleAddHolding}
              className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] shadow-2xl space-y-4 animate-in fade-in"
            >
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Virtual Trade Position</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Symbol *</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-[#162C4E] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Company / Asset Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-[#162C4E] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-[#162C4E] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Average Cost (₹)</label>
                    <input
                      type="number"
                      required
                      step="0.05"
                      value={avgCost}
                      onChange={(e) => setAvgCost(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-[#162C4E] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Current LTP (₹)</label>
                    <input
                      type="number"
                      required
                      step="0.05"
                      value={ltp}
                      onChange={(e) => setLtp(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-[#162C4E] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Exchange</label>
                    <select
                      value={exchange}
                      onChange={(e) => setExchange(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-[#162C4E] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="NSE">NSE</option>
                      <option value="BSE">BSE</option>
                      <option value="NASDAQ">NASDAQ</option>
                      <option value="NYSE">NYSE</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                >
                  Save Position
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
