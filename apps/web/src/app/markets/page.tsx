"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  Filter,
  Activity,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import MarketHeatmap from "@/components/MarketHeatmap";
import { getMarketTicker, type TickerItem } from "@/lib/api";

export default function MarketsPage() {
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketTicker()
      .then((data) => setTickers(data || []))
      .catch(() => setTickers([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label: "All Instruments" },
    { id: "indian_index", label: "Indian Indices" },
    { id: "global_index", label: "Global Indices" },
    { id: "commodity", label: "Commodities & Energy" },
    { id: "currency", label: "Currencies & FX" },
    { id: "yield", label: "Sovereign Bond Yields" },
  ];

  const filteredTickers = tickers.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  return (
    <NavigationShell activePath="/markets">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#132B4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#16C8D5] uppercase">
              <Globe size={14} /> Multi-Asset Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Global Financial Markets Hub
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Track domestic Indian indices, major international benchmarks, precious metals, energy commodities, foreign exchange rates, and sovereign debt yields.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? "bg-[#087BEE] text-white shadow-sm"
                  : "bg-[#0B1D38] text-slate-300 hover:text-white border border-[#132B4F]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Instruments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredTickers.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.symbol}
                className="p-4 rounded-2xl bg-[#0B1D38] border border-[#132B4F] hover:border-[#087BEE]/60 transition flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-white tracking-tight">
                      {item.symbol}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      {item.name}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#07152B] text-slate-300 border border-[#132B4F]">
                    {item.exchange}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-[#132B4F]/60">
                  <div className="text-base font-bold font-mono text-white">
                    {item.category === "yield"
                      ? `${item.price.toFixed(2)}%`
                      : item.currency === "INR"
                      ? `₹${item.price.toLocaleString("en-IN")}`
                      : `$${item.price.toLocaleString("en-US")}`}
                  </div>

                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                      isPositive
                        ? "text-[#39E85B] bg-[#39E85B]/10"
                        : "text-[#F06464] bg-[#F06464]/10"
                    }`}
                  >
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isPositive ? "+" : ""}
                    {item.change_pct.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sector Heatmap Section */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-[#16C8D5]" /> Sector Performance Tree-Map
            </h2>
          </div>
          <MarketHeatmap initialUniverse="all" />
        </div>
      </div>
    </NavigationShell>
  );
}
