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
import MarketOverviewCard from "@/components/MarketOverviewCard";
import IndexPerformanceChart from "@/components/IndexPerformanceChart";
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
    { id: "global_index", label: "Global Benchmarks" },
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
      <div className="space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              <Globe size={14} /> Multi-Asset Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Global Financial Markets Hub
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
              Track domestic Indian indices, major international benchmarks, precious metals, energy commodities, foreign exchange rates, and sovereign debt yields in real-time.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-[#0B1930] text-slate-300 hover:text-white border border-[#162C4E]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Instruments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTickers.map((item) => (
            <MarketOverviewCard
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
              price={item.price}
              change={item.change}
              change_pct={item.change_pct}
              currency={item.currency}
              exchange={item.exchange}
              sparkline={item.sparkline}
            />
          ))}
        </div>

        {/* Benchmark Charting Section */}
        <div>
          <h2 className="text-lg font-black text-white tracking-tight mb-3">
            Benchmark Technical Overview
          </h2>
          <IndexPerformanceChart selectedIndex="NIFTY 50" />
        </div>

        {/* Full Interactive Heatmap */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Layers size={18} className="text-cyan-400" /> Sector Market Tree-Map
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing sector breadth and capitalization weights across domestic and international exchanges.
              </p>
            </div>
          </div>
          <MarketHeatmap initialUniverse="all" />
        </div>
      </div>
    </NavigationShell>
  );
}
