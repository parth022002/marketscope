"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import MarketSparkline from "./MarketSparkline";

interface MarketOverviewCardProps {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  change_pct: number;
  currency?: string;
  exchange: string;
  asset_class?: string;
  data_status?: string;
  sparkline?: number[];
}

export default function MarketOverviewCard({
  symbol,
  name,
  price,
  change,
  change_pct,
  currency = "INR",
  exchange,
  asset_class,
  data_status,
  sparkline,
}: MarketOverviewCardProps) {
  const isPositive = change_pct >= 0;
  const isYield = asset_class === "YIELD" || symbol.includes("YIELD") || exchange === "BOND" || exchange === "RBI";
  const isIndex = asset_class === "INDEX" || exchange === "NSE" || exchange === "BSE" || exchange === "CBOE" || symbol.includes("NIFTY") || symbol.includes("SENSEX") || symbol.includes("500") || symbol.includes("100");

  const formatPrice = (val: number, cur: string) => {
    if (isYield) {
      return `${val.toFixed(3)}%`;
    }
    switch (cur) {
      case "INR":
        return `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "USD":
        return `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "EUR":
        return `€${val.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "GBP":
        return `£${val.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "JPY":
        return `¥${val.toLocaleString("ja-JP", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      case "HKD":
        return `HK$${val.toLocaleString("zh-HK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "CNY":
        return `¥${val.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "KRW":
        return `₩${val.toLocaleString("ko-KR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case "AUD":
        return `A$${val.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return `${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatChangeText = () => {
    const sign = isPositive ? "+" : "";
    if (isYield) {
      const bps = (change * 100).toFixed(1);
      return `${sign}${bps} bps`;
    }
    if (isIndex && !symbol.includes("USD") && !symbol.includes("EUR")) {
      return `${sign}${change.toFixed(2)} pts`;
    }
    const curSymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "";
    return `${sign}${curSymbol}${Math.abs(change).toFixed(2)}`;
  };

  const defaultSparkline = sparkline && sparkline.length > 1
    ? sparkline
    : [price, price];

  return (
    <Link
      href={
        symbol === "RELIANCE" || symbol === "TCS" || symbol === "INFY" || symbol === "TATAMOTORS"
          ? `/company/${symbol.toLowerCase()}`
          : "/markets"
      }
      className="p-4 rounded-2xl bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
              {symbol}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#071426] text-slate-400 border border-[#162C4E]">
              {exchange}
            </span>
          </div>
          {name && (
            <p className="text-[10px] text-slate-400 truncate max-w-[120px] mt-0.5">
              {name}
            </p>
          )}
        </div>

        <div
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-0.5 ${
            isPositive
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/15 text-red-400 border border-red-500/30"
          }`}
        >
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? "+" : ""}
          {change_pct.toFixed(2)}%
        </div>
      </div>

      <div className="flex items-end justify-between mt-3 pt-2 border-t border-[#162C4E]/60">
        <div>
          <div className="text-base font-extrabold font-mono text-white tabular-nums">
            {formatPrice(price, currency)}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span>{formatChangeText()}</span>
            {data_status && (
              <span className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase ${
                data_status === "LIVE" ? "bg-emerald-500/20 text-emerald-400" :
                data_status === "DELAYED_15M" ? "bg-amber-500/20 text-amber-300" :
                data_status === "CLOSED" ? "bg-slate-700/40 text-slate-400" :
                data_status === "EOD" ? "bg-cyan-500/20 text-cyan-300" : "bg-purple-500/20 text-purple-300"
              }`}>
                {data_status === "DELAYED_15M" ? "15M" : data_status === "SYNTHETIC_DEVELOPMENT" ? "DEV" : data_status}
              </span>
            )}
          </div>
        </div>

        <MarketSparkline
          data={defaultSparkline}
          isPositive={isPositive}
          width={80}
          height={28}
        />
      </div>
    </Link>
  );
}
