"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Flame, Zap } from "lucide-react";
import { type MarketMoverItem } from "@/lib/api";

interface MarketMoversProps {
  gainers: MarketMoverItem[];
  losers: MarketMoverItem[];
  mostActive?: MarketMoverItem[];
}

export default function MarketMovers({
  gainers,
  losers,
  mostActive,
}: MarketMoversProps) {
  const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "active">("gainers");

  const defaultActive: MarketMoverItem[] = mostActive && mostActive.length > 0
    ? mostActive
    : [
        { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", price: 4120.50, change: 35.10, change_pct: 0.85, volume: 4200000, week52_high: 4500, week52_low: 3400, currency: "INR" },
        { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", price: 2980.40, change: 42.60, change_pct: 1.45, volume: 6800000, week52_high: 3200, week52_low: 2220, currency: "INR" },
        { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "NSE", price: 1740.10, change: -6.10, change_pct: -0.35, volume: 9100000, week52_high: 1795, week52_low: 1360, currency: "INR" },
        { symbol: "INFY", name: "Infosys Limited", exchange: "NSE", price: 1890.30, change: 38.80, change_pct: 2.10, volume: 5400000, week52_high: 1990, week52_low: 1355, currency: "INR" },
      ];

  const currentList =
    activeTab === "gainers" ? gainers : activeTab === "losers" ? losers : defaultActive;

  return (
    <div className="bg-[#0B1930] border border-[#162C4E] rounded-2xl p-5 space-y-4">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#162C4E]">
        <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
          <Zap size={16} className="text-yellow-400" /> Market Movers Pulse
        </h3>

        <div className="flex items-center gap-1 bg-[#071426] border border-[#162C4E] p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab("gainers")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              activeTab === "gainers"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp size={12} /> Top Gainers
          </button>
          <button
            onClick={() => setActiveTab("losers")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              activeTab === "losers"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingDown size={12} /> Top Losers
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              activeTab === "active"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Flame size={12} /> Most Active
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {currentList.map((item) => {
          const isPositive = item.change_pct >= 0;
          return (
            <Link
              key={item.symbol}
              href={`/company/${item.symbol.toLowerCase()}`}
              className="p-3 rounded-xl bg-[#071426] hover:bg-[#10223B] border border-[#162C4E] hover:border-blue-500/40 transition flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                    {item.symbol}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                    {item.name}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Vol: {(item.volume / 1000000).toFixed(1)}M · 52W: ₹{item.week52_low} - ₹{item.week52_high}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-white tabular-nums">
                  ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-[11px] font-mono font-bold flex items-center justify-end gap-0.5 mt-0.5 ${
                    isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {isPositive ? "+" : ""}
                  {item.change_pct.toFixed(2)}%
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
