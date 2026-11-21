"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Radio } from "lucide-react";
import { getMarketTicker, type TickerItem } from "@/lib/api";

const FALLBACK_TICKERS: TickerItem[] = [
  {
    symbol: "NIFTY 50",
    name: "Nifty 50 Index",
    category: "indian_index",
    exchange: "NSE",
    price: 24480.20,
    change: 112.40,
    change_pct: 0.46,
    currency: "INR",
    market_status: "OPEN",
    data_status: "LIVE",
    sparkline: [24360, 24410, 24480.20],
  },
  {
    symbol: "SENSEX",
    name: "BSE SENSEX 30",
    category: "indian_index",
    exchange: "BSE",
    price: 80365.10,
    change: 320.15,
    change_pct: 0.40,
    currency: "INR",
    market_status: "OPEN",
    data_status: "LIVE",
    sparkline: [80050, 80210, 80365.10],
  },
  {
    symbol: "NIFTY BANK",
    name: "Nifty Bank Index",
    category: "indian_index",
    exchange: "NSE",
    price: 52180.50,
    change: 245.80,
    change_pct: 0.47,
    currency: "INR",
    market_status: "OPEN",
    data_status: "LIVE",
    sparkline: [51920, 52090, 52180.50],
  },
  {
    symbol: "NASDAQ 100",
    name: "NASDAQ 100",
    category: "global_index",
    exchange: "NASDAQ",
    price: 20890.40,
    change: 142.60,
    change_pct: 0.69,
    currency: "USD",
    market_status: "PRE_MARKET",
    data_status: "DELAYED_15M",
    sparkline: [20710, 20810, 20890.40],
  },
  {
    symbol: "S&P 500",
    name: "S&P 500 Index",
    category: "global_index",
    exchange: "NYSE",
    price: 5910.80,
    change: 22.40,
    change_pct: 0.38,
    currency: "USD",
    market_status: "PRE_MARKET",
    data_status: "DELAYED_15M",
    sparkline: [5880, 5900, 5910.80],
  },
  {
    symbol: "BRENT CRUDE",
    name: "Brent Crude Oil",
    category: "commodity",
    exchange: "ICE",
    price: 74.65,
    change: 1.25,
    change_pct: 1.70,
    currency: "USD",
    market_status: "OPEN",
    data_status: "LIVE",
    sparkline: [73.20, 74.00, 74.65],
  },
  {
    symbol: "GOLD MCX",
    name: "Gold 24K (10g)",
    category: "commodity",
    exchange: "MCX",
    price: 77450.00,
    change: 180.00,
    change_pct: 0.23,
    currency: "INR",
    market_status: "OPEN",
    data_status: "LIVE",
    sparkline: [77210, 77360, 77450.00],
  },
  {
    symbol: "USD/INR",
    name: "US Dollar / Indian Rupee",
    category: "currency",
    exchange: "FOREX",
    price: 84.42,
    change: 0.08,
    change_pct: 0.09,
    currency: "INR",
    market_status: "OPEN",
    data_status: "LIVE",
    sparkline: [84.32, 84.39, 84.42],
  },
  {
    symbol: "US 10Y YIELD",
    name: "US 10-Year Treasury",
    category: "yield",
    exchange: "BOND",
    price: 4.42,
    change: 0.03,
    change_pct: 0.68,
    currency: "USD",
    market_status: "OPEN",
    data_status: "LIVE",
    sparkline: [4.38, 4.40, 4.42],
  },
];

export default function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_TICKERS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getMarketTicker()
      .then((data) => {
        if (data && data.length > 0) setItems(data);
      })
      .catch(() => {
        // Fallback gracefully to default items
      });
  }, []);

  // Format price according to currency
  const formatPrice = (price: number, currency: string, category: string) => {
    if (category === "yield") return `${price.toFixed(2)}%`;
    if (currency === "INR") {
      return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div
      className="w-full bg-[#051022] border-b border-[#132B4F] overflow-hidden text-xs select-none relative z-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        {/* Market Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#07152B] border-r border-[#132B4F] shrink-0 font-mono text-[10px] text-slate-300 font-semibold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#39E85B] animate-pulse"></span>
          <span>MARKETS LIVE</span>
        </div>

        {/* Marquee Container */}
        <div className="overflow-x-auto md:overflow-hidden whitespace-nowrap py-1.5 scrollbar-none flex-1">
          <div
            className={`inline-flex items-center gap-6 px-4 ${
              isPaused ? "" : "animate-marquee"
            }`}
            style={{
              animationDuration: "42s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {/* Render items twice to create seamless loop */}
            {[...items, ...items].map((item, idx) => {
              const isPositive = item.change >= 0;
              return (
                <Link
                  key={`${item.symbol}-${idx}`}
                  href={
                    item.category === "indian_index" || item.symbol === "RELIANCE"
                      ? `/company/${item.symbol.toLowerCase().replace(/[^a-z0-9]/g, "")}`
                      : "/markets"
                  }
                  className="inline-flex items-center gap-2 hover:bg-[#0B1D38] px-2 py-1 rounded transition group shrink-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white group-hover:text-[#16C8D5] transition">
                      {item.symbol}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-[#102547] text-slate-400">
                      {item.exchange}
                    </span>
                  </div>

                  <span className="font-mono font-medium text-slate-200">
                    {formatPrice(item.price, item.currency, item.category)}
                  </span>

                  <span
                    className={`inline-flex items-center gap-0.5 font-mono font-semibold text-[11px] px-1.5 py-0.2 rounded ${
                      isPositive
                        ? "text-[#39E85B] bg-[#39E85B]/10"
                        : "text-[#F06464] bg-[#F06464]/10"
                    }`}
                  >
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isPositive ? "+" : ""}
                    {item.change_pct.toFixed(2)}%
                  </span>

                  {item.data_status === "DELAYED_15M" && (
                    <span className="text-[9px] text-slate-500 font-mono">15m</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
