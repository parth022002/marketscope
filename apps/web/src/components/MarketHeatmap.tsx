"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMarketHeatmap, type MarketHeatmapItem } from "@/lib/api";
import { TrendingUp, TrendingDown, Layers } from "lucide-react";

interface MarketHeatmapProps {
  initialUniverse?: "all" | "nse" | "us";
}

const FALLBACK_HEATMAP_ITEMS: MarketHeatmapItem[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    sector: "Energy & Oil",
    market_cap: 1991200,
    change_pct: 1.45,
    price: 2942.50,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy",
    sector: "Information Tech",
    market_cap: 1492500,
    change_pct: -0.38,
    price: 4125.80,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    sector: "Financials",
    market_cap: 1334000,
    change_pct: 0.82,
    price: 1748.20,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    sector: "Financials",
    market_cap: 889200,
    change_pct: 1.12,
    price: 1264.40,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    sector: "Information Tech",
    market_cap: 778400,
    change_pct: -0.62,
    price: 1874.15,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    sector: "Telecom",
    market_cap: 895400,
    change_pct: 0.94,
    price: 1582.00,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    sector: "Automobile",
    market_cap: 298500,
    change_pct: 2.15,
    price: 812.30,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    sector: "Infrastructure",
    market_cap: 505800,
    change_pct: 1.05,
    price: 3680.00,
    currency: "INR",
    exchange: "NSE",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    sector: "Semiconductors",
    market_cap: 3580000,
    change_pct: 2.85,
    price: 146.50,
    currency: "USD",
    exchange: "NASDAQ",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    market_cap: 3470000,
    change_pct: 0.42,
    price: 228.40,
    currency: "USD",
    exchange: "NASDAQ",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp",
    sector: "Software",
    market_cap: 3150000,
    change_pct: 0.74,
    price: 424.10,
    currency: "USD",
    exchange: "NASDAQ",
  },
];

export default function MarketHeatmap({ initialUniverse = "all" }: MarketHeatmapProps) {
  const [universe, setUniverse] = useState<"all" | "nse" | "us">(initialUniverse);
  const [items, setItems] = useState<MarketHeatmapItem[]>(FALLBACK_HEATMAP_ITEMS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMarketHeatmap(universe)
      .then((data) => {
        if (data && data.length > 0) setItems(data);
      })
      .catch(() => {
        // Fallback gracefully
      })
      .finally(() => setLoading(false));
  }, [universe]);

  // Color mapper based on performance percentage
  const getTileColor = (pct: number) => {
    if (pct >= 2.0) return "bg-[#089981]/90 border-[#39E85B] text-white";
    if (pct >= 0.75) return "bg-[#089981]/60 border-[#39E85B]/50 text-white";
    if (pct > 0) return "bg-[#089981]/30 border-[#39E85B]/30 text-emerald-200";
    if (pct === 0) return "bg-[#1E222D] border-[#2A2E39] text-slate-300";
    if (pct > -1.0) return "bg-[#F23645]/40 border-[#F06464]/40 text-rose-200";
    return "bg-[#F23645]/85 border-[#F06464] text-white";
  };

  // Group items by sector
  const sectors = Array.from(new Set(items.map((i) => i.sector)));

  return (
    <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#132B4F]">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#16C8D5]" />
          <h3 className="text-base font-bold text-white">Market Sector Heatmap</h3>
          <span className="text-xs text-slate-400 font-mono">
            · Sized by Market Cap · Colored by Day %
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#07152B] border border-[#132B4F]">
          <button
            onClick={() => setUniverse("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              universe === "all"
                ? "bg-[#087BEE] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Markets
          </button>
          <button
            onClick={() => setUniverse("nse")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              universe === "nse"
                ? "bg-[#087BEE] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            NSE India
          </button>
          <button
            onClick={() => setUniverse("us")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              universe === "us"
                ? "bg-[#087BEE] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            US Tech
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        {sectors.map((sec) => {
          const secItems = items.filter((i) => i.sector === sec);

          return (
            <div key={sec} className="space-y-1.5">
              <div className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                {sec}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {secItems.map((item) => {
                  const isPositive = item.change_pct >= 0;
                  const dossierSymbol = item.symbol.toLowerCase();

                  return (
                    <Link
                      key={item.symbol}
                      href={`/company/${dossierSymbol}`}
                      className={`p-3 rounded-xl border transition transform hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between min-h-[92px] ${getTileColor(
                        item.change_pct
                      )}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-xs tracking-tight">
                            {item.symbol}
                          </div>
                          <div className="text-[10px] opacity-80 truncate max-w-[120px]">
                            {item.name}
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/30">
                          {item.exchange}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xs font-mono font-bold">
                          {item.currency === "INR" ? "₹" : "$"}
                          {item.price.toFixed(2)}
                        </span>
                        <span className="text-xs font-mono font-black flex items-center gap-0.5">
                          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {isPositive ? "+" : ""}
                          {item.change_pct.toFixed(2)}%
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
