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
  const safePrice = typeof price === "number" && !isNaN(price) ? price : 0;
  const safeChange = typeof change === "number" && !isNaN(change) ? change : 0;
  const safeChangePct = typeof change_pct === "number" && !isNaN(change_pct) ? change_pct : 0;

  const isPositive = safeChangePct >= 0;
  const isYield = asset_class === "YIELD" || symbol.includes("YIELD") || exchange === "BOND" || exchange === "RBI";
  const isIndex = asset_class === "INDEX" || exchange === "NSE" || exchange === "BSE" || exchange === "CBOE" || symbol.includes("NIFTY") || symbol.includes("SENSEX") || symbol.includes("500") || symbol.includes("100");

  const formatPrice = (val: number, cur: string) => {
    const num = typeof val === "number" && !isNaN(val) ? val : 0;
    if (isYield) {
      return `${num.toFixed(3)}%`;
    }
    switch (cur) {
      case "INR":
        return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "USD":
        return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "EUR":
        return `€${num.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "GBP":
        return `£${num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case "JPY":
        return `¥${num.toLocaleString("ja-JP", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      default:
        return `${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatChangeText = () => {
    const sign = isPositive ? "+" : "";
    if (isYield) {
      const bps = (safeChange * 100).toFixed(1);
      return `${sign}${bps} bps`;
    }
    if (isIndex && !symbol.includes("USD") && !symbol.includes("EUR")) {
      return `${sign}${safeChange.toFixed(2)} pts`;
    }
    const curSymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "";
    return `${sign}${curSymbol}${Math.abs(safeChange).toFixed(2)}`;
  };

  const defaultSparkline = sparkline && sparkline.length > 1
    ? sparkline
    : [safePrice, safePrice];

  return (
    <Link
      href={
        symbol === "RELIANCE" || symbol === "TCS" || symbol === "INFY" || symbol === "TATAMOTORS"
          ? `/company/${symbol.toLowerCase()}`
          : "/markets"
      }
      className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
              {symbol}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#071426] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
              {exchange}
            </span>
          </div>
          {name && (
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px] mt-0.5">
              {name}
            </div>
          )}
        </div>

        {data_status && (
          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
              data_status === "LIVE"
                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                : data_status === "DELAYED_15M"
                ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
            }`}
          >
            {data_status === "LIVE" ? "LIVE" : data_status === "DELAYED_15M" ? "15M" : "EOD"}
          </span>
        )}
      </div>

      <div className="my-2.5">
        <div className="text-base font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
          {formatPrice(price, currency)}
        </div>
        <div
          className={`flex items-center gap-1 text-[11px] font-bold mt-0.5 ${
            isPositive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>
            {formatChangeText()} ({isPositive ? "+" : ""}
            {change_pct.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-[#162C4E]/60">
        <MarketSparkline
          data={defaultSparkline}
          isPositive={isPositive}
          width={130}
          height={26}
        />
      </div>
    </Link>
  );
}
