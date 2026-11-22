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
        { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", price: 2376.20, change: 33.50, change_pct: 1.43, volume: 4200000, week52_high: 2600, week52_low: 1950, currency: "INR" },
        { symbol: "RELIANCE", name: "Reliance Industries", exchange: "NSE", price: 1377.50, change: 1.90, change_pct: 0.14, volume: 6800000, week52_high: 1600, week52_low: 1200, currency: "INR" },
        { symbol: "HDFCBANK", name: "HDFC Bank", exchange: "NSE", price: 846.00, change: 24.20, change_pct: 2.94, volume: 9100000, week52_high: 950, week52_low: 720, currency: "INR" },
        { symbol: "INFY", name: "Infosys Limited", exchange: "NSE", price: 1098.00, change: 6.10, change_pct: 0.56, volume: 5400000, week52_high: 1250, week52_low: 950, currency: "INR" },
      ];

  const currentList =
    activeTab === "gainers" ? gainers : activeTab === "losers" ? losers : defaultActive;

  return (
    <div className="bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 space-y-4 shadow-xs">
      {/* Tab Switcher Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Zap size={16} className="text-amber-500" /> Market Movers Pulse
        </h3>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab("gainers")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              activeTab === "gainers"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TrendingUp size={12} /> Gainers
          </button>
          <button
            onClick={() => setActiveTab("losers")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              activeTab === "losers"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TrendingDown size={12} /> Losers
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              activeTab === "active"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Flame size={12} /> Active
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
              className="p-3 rounded-xl bg-slate-50 dark:bg-[#071426] hover:bg-slate-100 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/40 transition flex items-center justify-between group shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
                    {item.symbol}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px]">
                    {item.name}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  Vol: {(item.volume / 1000000).toFixed(1)}M · 52W: ₹{item.week52_low} - ₹{item.week52_high}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  ₹{item.price.toFixed(2)}
                </div>
                <div
                  className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${
                    isPositive ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
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
