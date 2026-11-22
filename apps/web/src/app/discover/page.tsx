"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Calendar,
  Zap,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const DISCOVERY_TABS = [
  { id: "stocks", label: "Stock Screener", icon: Filter },
  { id: "etfs", label: "ETF Screener", icon: Layers },
  { id: "mutual_funds", label: "Mutual Funds", icon: Sparkles },
  { id: "ipos", label: "IPO Centre", icon: Calendar },
  { id: "unusual_volume", label: "Unusual Volume", icon: Activity },
];

const TOP_GAINERS = [
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", exchange: "NSE", price: "₹942.50", change: "+4.18%", volume: "14.2M", pe: "11.2" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", exchange: "NSE", price: "₹7,210.00", change: "+3.25%", volume: "2.1M", pe: "26.4" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE", price: "₹1,315.00", change: "+2.80%", volume: "9.5M", pe: "17.8" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", price: "$148.20", change: "+3.85%", volume: "62.4M", pe: "48.2" },
];

const TOP_LOSERS = [
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE", price: "₹1,885.60", change: "-1.85%", volume: "6.2M", pe: "28.1" },
  { symbol: "WIPRO", name: "Wipro Ltd", exchange: "NSE", price: "₹525.40", change: "-1.45%", volume: "4.8M", pe: "21.6" },
  { symbol: "HCLTECH", name: "HCL Technologies", exchange: "NSE", price: "₹1,820.00", change: "-1.10%", volume: "2.9M", pe: "25.3" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", price: "$212.40", change: "-2.65%", volume: "44.1M", pe: "68.4" },
];

const UPCOMING_IPOS = [
  { name: "Swiggy Limited", exchange: "NSE/BSE", price_band: "₹371 - ₹390", issue_size: "₹11,327 Cr", open_date: "Active", status: "OPEN" },
  { name: "NTPC Green Energy", exchange: "NSE/BSE", price_band: "₹102 - ₹108", issue_size: "₹10,000 Cr", open_date: "Next Week", status: "UPCOMING" },
  { name: "Hyundai Motor India", exchange: "NSE/BSE", price_band: "₹1,865 - ₹1,960", issue_size: "₹27,870 Cr", open_date: "Listed", status: "CLOSED" },
];

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("stocks");
  const [marketCapFilter, setMarketCapFilter] = useState("all");
  const [peFilter, setPeFilter] = useState("all");

  return (
    <NavigationShell activePath="/discover">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-sky-400" />
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Market Discovery Hub</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold">
                UNIVERSAL SEARCH
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Filter and screen across Indian (NSE, BSE) and international equities, ETFs, IPOs, and market outliers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/screener"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Advanced Screener</span>
            </Link>
          </div>
        </div>

        {/* Discovery Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/60 no-scrollbar">
          {DISCOVERY_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? "bg-slate-800 text-sky-400 border border-slate-700 font-semibold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-sky-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Top Gainers & Losers Outlier Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Top Gainers */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-200">Top Market Gainers</h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                +3.5% AVG
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {TOP_GAINERS.map((stock) => (
                <div key={stock.symbol} className="py-2.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/company/${stock.symbol.toLowerCase()}`} className="text-xs font-bold text-slate-100 hover:text-sky-400">
                        {stock.symbol}
                      </Link>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {stock.exchange}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-100 tabular-nums">{stock.price}</p>
                    <p className="text-[10px] font-semibold text-emerald-400 tabular-nums">{stock.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold text-slate-200">Top Market Losers</h2>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded">
                -1.7% AVG
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {TOP_LOSERS.map((stock) => (
                <div key={stock.symbol} className="py-2.5 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-lg transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link href={`/company/${stock.symbol.toLowerCase()}`} className="text-xs font-bold text-slate-100 hover:text-sky-400">
                        {stock.symbol}
                      </Link>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {stock.exchange}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-100 tabular-nums">{stock.price}</p>
                    <p className="text-[10px] font-semibold text-rose-400 tabular-nums">{stock.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IPO Centre Section */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-slate-200">Primary Market — Current & Upcoming IPOs</h2>
            </div>
            <span className="text-xs text-slate-400">Verified Exchange Filings</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UPCOMING_IPOS.map((ipo) => (
              <div key={ipo.name} className="p-4 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      ipo.status === "OPEN"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : ipo.status === "UPCOMING"
                        ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {ipo.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{ipo.exchange}</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-100">{ipo.name}</h3>
                <div className="text-xs space-y-1 text-slate-300">
                  <p className="flex justify-between">
                    <span className="text-slate-500">Price Band:</span>
                    <span className="font-medium tabular-nums">{ipo.price_band}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Issue Size:</span>
                    <span className="font-medium tabular-nums">{ipo.issue_size}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-500">Timeline:</span>
                    <span className="font-medium text-sky-400">{ipo.open_date}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}
