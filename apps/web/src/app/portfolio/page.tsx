"use client";

import { useState } from "react";
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
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const SIMULATED_HOLDINGS = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE", qty: 25, avg_cost: "₹1,320.00", ltp: "₹1,377.50", current_value: "₹34,437.50", pnl: "+₹1,437.50", pnl_pct: "+4.36%", allocation: "38%" },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", qty: 6, avg_cost: "₹4,050.00", ltp: "₹4,180.20", current_value: "₹25,081.20", pnl: "+₹781.20", pnl_pct: "+3.21%", allocation: "28%" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE", qty: 10, avg_cost: "₹1,710.00", ltp: "₹1,745.80", current_value: "₹17,458.00", pnl: "+₹358.00", pnl_pct: "+2.09%", allocation: "19%" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", qty: 1, avg_cost: "$135.00", ltp: "$148.20", current_value: "₹12,450.00", pnl: "+₹1,108.80", pnl_pct: "+9.78%", allocation: "15%" },
];

export default function PortfolioPage() {
  const [currency, setCurrency] = useState("INR");

  return (
    <NavigationShell activePath="/portfolio">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-sky-400" />
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Virtual Portfolio & Risk Desk</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                SIMULATED DESK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Track virtual allocations, historical returns, Sharpe ratios, and sector concentration risk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/paper-trading"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Paper Trading Terminal</span>
            </Link>
          </div>
        </div>

        {/* Regulatory & Educational Disclosure Banner */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300/90">
          <Info className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
          <p>
            <strong>Research Notice:</strong> This is an educational paper-trading and allocation sandbox. MarketScope.io is a non-custodial research platform and does not hold customer funds or execute real broker orders.
          </p>
        </div>

        {/* Portfolio Stats KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Virtual Portfolio Value</p>
            <p className="text-lg font-bold text-slate-100 tabular-nums mt-1">₹89,426.70</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> +4.32% overall return
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Available Virtual Cash</p>
            <p className="text-lg font-bold text-slate-100 tabular-nums mt-1">₹410,573.30</p>
            <p className="text-[10px] text-slate-400 mt-1">From ₹5,00,000 starting cash</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Sharpe Ratio (Annualized)</p>
            <p className="text-lg font-bold text-sky-400 tabular-nums mt-1">1.84</p>
            <p className="text-[10px] text-slate-400 mt-1">Benchmark Nifty 50: 1.42</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
            <p className="text-xs text-slate-400 font-medium">Portfolio Beta</p>
            <p className="text-lg font-bold text-indigo-400 tabular-nums mt-1">0.89</p>
            <p className="text-[10px] text-slate-400 mt-1">Low sensitivity to index swings</p>
          </div>
        </div>

        {/* Virtual Holdings Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Current Virtual Holdings</h2>
            <span className="text-xs text-slate-400">4 Active Assets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Avg Cost</th>
                  <th className="py-3 px-4 text-right">LTP</th>
                  <th className="py-3 px-4 text-right">Current Value</th>
                  <th className="py-3 px-4 text-right">P&L</th>
                  <th className="py-3 px-4 text-right">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {SIMULATED_HOLDINGS.map((h) => (
                  <tr key={h.symbol} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/company/${h.symbol.toLowerCase()}`} className="font-bold text-sky-400 hover:underline">
                        {h.symbol}
                      </Link>
                      <span className="text-[10px] text-slate-400 ml-1.5 font-mono">{h.exchange}</span>
                      <p className="text-[11px] text-slate-400">{h.name}</p>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">{h.qty}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-400">{h.avg_cost}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">{h.ltp}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold">{h.current_value}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-semibold">
                      {h.pnl} <span className="text-[10px] block">{h.pnl_pct}</span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300 font-mono">{h.allocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}
