"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const ALL_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries Limited", exchange: "NSE", sector: "Energy & Conglomerate", price: 2942.50, change_pct: 1.45, market_cap_cr: 1991200, pe: 27.8, roe: 9.8, status: "LIVE" },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", sector: "Information Technology", price: 4125.80, change_pct: -0.38, market_cap_cr: 1492500, pe: 31.4, roe: 48.2, status: "LIVE" },
  { symbol: "HDFCBANK", name: "HDFC Bank Limited", exchange: "NSE", sector: "Financial Services", price: 1748.20, change_pct: 0.82, market_cap_cr: 1334000, pe: 19.2, roe: 16.4, status: "LIVE" },
  { symbol: "ICICIBANK", name: "ICICI Bank Limited", exchange: "NSE", sector: "Financial Services", price: 1264.40, change_pct: 1.12, market_cap_cr: 889200, pe: 18.5, roe: 18.9, status: "LIVE" },
  { symbol: "INFY", name: "Infosys Limited", exchange: "NSE", sector: "Information Technology", price: 1874.15, change_pct: -0.62, market_cap_cr: 778400, pe: 28.6, roe: 31.5, status: "LIVE" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Limited", exchange: "NSE", sector: "Telecommunications", price: 1582.00, change_pct: 0.94, market_cap_cr: 895400, pe: 42.1, roe: 14.8, status: "LIVE" },
  { symbol: "TATAMOTORS", name: "Tata Motors Limited", exchange: "NSE", sector: "Automobile", price: 812.30, change_pct: 2.15, market_cap_cr: 298500, pe: 9.8, roe: 38.4, status: "LIVE" },
  { symbol: "LT", name: "Larsen & Toubro Limited", exchange: "NSE", sector: "Infrastructure", price: 3680.00, change_pct: 1.05, market_cap_cr: 505800, pe: 34.2, roe: 15.6, status: "LIVE" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Semiconductors", price: 146.50, change_pct: 2.85, market_cap_cr: 3580000, pe: 54.2, roe: 115.0, status: "LIVE", currency: "USD" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Consumer Tech", price: 228.40, change_pct: 0.42, market_cap_cr: 3470000, pe: 33.1, roe: 152.0, status: "LIVE", currency: "USD" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Software & Cloud", price: 424.10, change_pct: 0.74, market_cap_cr: 3150000, pe: 34.8, roe: 38.5, status: "LIVE", currency: "USD" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", sector: "Internet & AI", price: 178.60, change_pct: 1.18, market_cap_cr: 2220000, pe: 24.2, roe: 29.8, status: "LIVE", currency: "USD" },
];

export default function StocksPage() {
  const [exchangeFilter, setExchangeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filtered = ALL_STOCKS.filter((stock) => {
    if (exchangeFilter === "nse" && stock.exchange !== "NSE") return false;
    if (exchangeFilter === "us" && stock.exchange !== "NASDAQ") return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        stock.symbol.toLowerCase().includes(term) ||
        stock.name.toLowerCase().includes(term) ||
        stock.sector.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <NavigationShell activePath="/stocks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#132B4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#16C8D5] uppercase">
              <Building2 size={14} /> Equities Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Stocks Discovery &amp; Directory
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Discover and inspect companies across Indian and global equity universes with direct access to canonical financial statements and 15 golden ratios.
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B1D38] border border-[#132B4F]">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#07152B] border border-[#132B4F] text-xs">
            <button
              onClick={() => setExchangeFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                exchangeFilter === "all" ? "bg-[#087BEE] text-white" : "text-slate-400"
              }`}
            >
              All Equities
            </button>
            <button
              onClick={() => setExchangeFilter("nse")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                exchangeFilter === "nse" ? "bg-[#087BEE] text-white" : "text-slate-400"
              }`}
            >
              NSE India
            </button>
            <button
              onClick={() => setExchangeFilter("us")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                exchangeFilter === "us" ? "bg-[#087BEE] text-white" : "text-slate-400"
              }`}
            >
              US Markets
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by company, symbol or sector..."
              className="w-full bg-[#07152B] border border-[#132B4F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#087BEE]"
            />
          </div>
        </div>

        {/* Equities Table */}
        <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#132B4F] text-slate-400 font-mono text-[11px]">
                <th className="pb-3">SYMBOL &amp; COMPANY</th>
                <th className="pb-3">EXCHANGE</th>
                <th className="pb-3">SECTOR</th>
                <th className="pb-3 text-right">PRICE</th>
                <th className="pb-3 text-right">DAY CHANGE</th>
                <th className="pb-3 text-right">P/E RATIO</th>
                <th className="pb-3 text-right">ROE (%)</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132B4F]/50">
              {filtered.map((stock) => {
                const isPositive = stock.change_pct >= 0;
                const isUsd = stock.currency === "USD";
                return (
                  <tr key={stock.symbol} className="hover:bg-[#102547]/50 transition group">
                    <td className="py-3">
                      <Link
                        href={`/company/${stock.symbol.toLowerCase()}`}
                        className="font-bold text-white group-hover:text-[#16C8D5] flex items-center gap-1.5"
                      >
                        {stock.symbol}
                      </Link>
                      <div className="text-[11px] text-slate-400">{stock.name}</div>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-[#07152B] border border-[#132B4F]">
                        {stock.exchange}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300 text-[11px]">{stock.sector}</td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {isUsd ? "$" : "₹"}
                      {stock.price.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] inline-flex items-center gap-0.5 ${
                          isPositive
                            ? "text-[#39E85B] bg-[#39E85B]/10"
                            : "text-[#F06464] bg-[#F06464]/10"
                        }`}
                      >
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isPositive ? "+" : ""}
                        {stock.change_pct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-slate-200">{stock.pe}x</td>
                    <td className="py-3 text-right font-mono text-slate-200">{stock.roe}%</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/company/${stock.symbol.toLowerCase()}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#087BEE]/15 hover:bg-[#087BEE] text-white text-[11px] font-semibold transition"
                      >
                        Dossier <ArrowRight size={11} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </NavigationShell>
  );
}
