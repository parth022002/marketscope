"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import { getMarketTicker, type TickerItem } from "@/lib/api";
import { useMarketWebSocket } from "@/lib/useMarketWebSocket";

const FALLBACK_TICKERS: TickerItem[] = [
  {
    symbol: "NIFTY 50",
    name: "Nifty 50 Index",
    category: "indian_index",
    exchange: "NSE",
    price: 25800.60,
    change: 286.30,
    change_pct: 1.12,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [25420, 25514.30, 25680, 25800.60],
  },
  {
    symbol: "SENSEX",
    name: "BSE SENSEX 30",
    category: "indian_index",
    exchange: "BSE",
    price: 83919.71,
    change: 897.96,
    change_pct: 1.08,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [82950, 83021.75, 83450, 83919.71],
  },
  {
    symbol: "NIFTY BANK",
    name: "Nifty Bank Index",
    category: "indian_index",
    exchange: "NSE",
    price: 64635.20,
    change: 1572.20,
    change_pct: 2.49,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [62980, 63063.00, 63800, 64635.20],
  },
  {
    symbol: "NASDAQ 100",
    name: "NASDAQ 100",
    category: "global_index",
    exchange: "NASDAQ",
    price: 25028.98,
    change: -1494.46,
    change_pct: -5.63,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [26523.44, 26050, 25680, 25028.98],
  },
  {
    symbol: "S&P 500",
    name: "S&P 500 Index",
    category: "global_index",
    exchange: "NYSE",
    price: 6910.39,
    change: -267.17,
    change_pct: -3.72,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [7177.56, 7080, 7020, 6910.39],
  },
  {
    symbol: "BRENT CRUDE",
    name: "Brent Crude Oil",
    category: "commodity",
    exchange: "ICE",
    price: 92.57,
    change: 2.52,
    change_pct: 2.80,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [90.05, 90.80, 91.40, 92.57],
  },
  {
    symbol: "GOLD MCX",
    name: "Gold 24K (10g)",
    category: "commodity",
    exchange: "MCX",
    price: 98450.00,
    change: -470.00,
    change_pct: -0.47,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [98920, 98800, 98650, 98450.00],
  },
  {
    symbol: "USD/INR",
    name: "US Dollar / Indian Rupee",
    category: "currency",
    exchange: "FOREX",
    price: 92.67,
    change: -0.61,
    change_pct: -0.65,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [93.28, 93.10, 92.80, 92.67],
  },
  {
    symbol: "US 10Y YIELD",
    name: "US 10-Year Treasury",
    category: "yield",
    exchange: "BOND",
    price: 4.91,
    change: -0.14,
    change_pct: -2.77,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [5.05, 5.00, 4.96, 4.91],
  },
];

export default function MarketTicker() {
  const [restItems, setRestItems] = useState<TickerItem[]>(FALLBACK_TICKERS);
  const [isPaused, setIsPaused] = useState(false);

  // Real-time WebSocket hook
  const { isConnected, ticks } = useMarketWebSocket();

  // Initial REST fetch
  useEffect(() => {
    getMarketTicker()
      .then((data) => {
        if (data && data.length > 0) setRestItems(data);
      })
      .catch(() => {
        // graceful fallback to initial list
      });
  }, []);

  // Merge WebSocket real-time updates over REST baseline
  const mergedItems = useMemo(() => {
    if (Object.keys(ticks).length === 0) return restItems;

    return restItems.map((item) => {
      const liveTick = ticks[item.symbol];
      if (liveTick) {
        return {
          ...item,
          price: liveTick.price,
          change: liveTick.change,
          change_pct: liveTick.change_pct,
          data_status: liveTick.data_status,
          market_status: liveTick.market_status,
          timestamp: liveTick.timestamp,
        };
      }
      return item;
    });
  }, [restItems, ticks]);

  // Format price according to currency
  const formatPrice = (price: number, currency: string, category: string) => {
    if (category === "yield") return `${price.toFixed(2)}%`;
    if (currency === "INR") {
      return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE":
        return (
          <span className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            LIVE
          </span>
        );
      case "DELAYED_15M":
        return (
          <span className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            15M
          </span>
        );
      case "CLOSED":
        return (
          <span className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-slate-700/30 text-slate-400 border border-slate-700/40">
            CLOSED
          </span>
        );
      case "EOD":
        return (
          <span className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            EOD
          </span>
        );
      case "SYNTHETIC_DEVELOPMENT":
      case "SYNTHETIC":
        return (
          <span className="text-[8px] px-1 py-0.2 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            DEV
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full bg-[#051022] border-b border-[#132B4F] overflow-hidden text-xs select-none relative z-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center">
        {/* Stream Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#07152B] border-r border-[#132B4F] shrink-0 font-mono text-[10px] text-slate-300 font-semibold tracking-wider">
          {isConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300 flex items-center gap-1">
                <Wifi size={10} /> STREAM LIVE
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-slate-400 flex items-center gap-1">
                <WifiOff size={10} /> REST SYNC
              </span>
            </>
          )}
        </div>

        {/* Marquee Container */}
        <div className="overflow-x-auto md:overflow-hidden whitespace-nowrap py-1.5 scrollbar-none flex-1">
          <div
            className={`inline-flex items-center gap-6 px-4 animate-marquee ${
              isPaused ? "[animation-play-state:paused]" : ""
            }`}
          >
            {/* Render items twice to create seamless loop */}
            {[...mergedItems, ...mergedItems].map((item, idx) => {
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

                  {getStatusBadge(item.data_status)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
