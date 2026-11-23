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
    price: 24180.80,
    change: 125.40,
    change_pct: 0.52,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [24055.40, 24090.0, 24140.0, 24180.80],
  },
  {
    symbol: "SENSEX",
    name: "BSE SENSEX 30",
    category: "indian_index",
    exchange: "BSE",
    price: 79802.40,
    change: 380.20,
    change_pct: 0.48,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [79422.20, 79510.0, 79650.0, 79802.40],
  },
  {
    symbol: "NIFTY BANK",
    name: "Nifty Bank Index",
    category: "indian_index",
    exchange: "NSE",
    price: 51820.50,
    change: 210.30,
    change_pct: 0.41,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [51610.20, 51680.0, 51740.0, 51820.50],
  },
  {
    symbol: "NASDAQ 100",
    name: "NASDAQ 100",
    category: "global_index",
    exchange: "NASDAQ",
    price: 20910.45,
    change: -85.20,
    change_pct: -0.41,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [20995.65, 20970.0, 20940.0, 20910.45],
  },
  {
    symbol: "S&P 500",
    name: "S&P 500 Index",
    category: "global_index",
    exchange: "NYSE",
    price: 5969.34,
    change: 12.50,
    change_pct: 0.21,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [5956.84, 5960.0, 5964.0, 5969.34],
  },
  {
    symbol: "BRENT CRUDE",
    name: "Brent Crude Oil",
    category: "commodity",
    exchange: "ICE",
    price: 74.20,
    change: 0.85,
    change_pct: 1.16,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [73.35, 73.60, 73.85, 74.20],
  },
  {
    symbol: "GOLD MCX",
    name: "Gold 24K (10g)",
    category: "commodity",
    exchange: "MCX",
    price: 76450.00,
    change: 210.00,
    change_pct: 0.28,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [76240.0, 76300.0, 76360.0, 76450.00],
  },
  {
    symbol: "USD/INR",
    name: "US Dollar / Indian Rupee",
    category: "currency",
    exchange: "FOREX",
    price: 84.42,
    change: 0.04,
    change_pct: 0.05,
    currency: "INR",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [84.38, 84.39, 84.41, 84.42],
  },
  {
    symbol: "US 10Y YIELD",
    name: "US 10-Year Treasury",
    category: "yield",
    exchange: "BOND",
    price: 4.420,
    change: -0.030,
    change_pct: -0.67,
    currency: "USD",
    market_status: "CLOSED",
    data_status: "EOD",
    sparkline: [4.450, 4.442, 4.435, 4.420],
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
    if (category === "yield") return `${price.toFixed(3)}%`;
    switch (currency) {
      case "INR":
        return `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "USD":
        return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "EUR":
        return `€${price.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "GBP":
        return `£${price.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "JPY":
        return `¥${price.toLocaleString("ja-JP", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      case "HKD":
        return `HK$${price.toLocaleString("zh-HK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "CNY":
        return `¥${price.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "KRW":
        return `₩${price.toLocaleString("ko-KR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case "AUD":
        return `A$${price.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return `${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
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
      <div className="flex items-center w-full min-w-0 overflow-hidden">
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
        <div className="overflow-hidden whitespace-nowrap py-1.5 scrollbar-none flex-1 min-w-0">
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
