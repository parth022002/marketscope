"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Search,
  Globe,
  Layers,
  Activity,
  Flame,
  ShieldCheck,
  Building2,
  Newspaper,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import NewsCard from "@/components/NewsCard";
import MarketHeatmap from "@/components/MarketHeatmap";
import {
  getMarketOverview,
  getNewsFeed,
  type MarketOverview,
  type NewsItem,
} from "@/lib/api";

export default function DashboardPage() {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [newsStories, setNewsStories] = useState<NewsItem[]>([]);
  const [activeMoverTab, setActiveMoverTab] = useState<"gainers" | "losers" | "active" | "highs">("gainers");
  const [activeCompanyCategory, setActiveCompanyCategory] = useState<"all" | "india" | "global">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMarketOverview().catch(() => null),
      getNewsFeed({ priority: "BREAKING" }).catch(() => []),
    ]).then(([overviewData, newsData]) => {
      if (overviewData) setOverview(overviewData);
      if (newsData && newsData.length > 0) {
        setNewsStories(newsData);
      } else {
        // Fallback to general news
        getNewsFeed().then((fallback) => setNewsStories(fallback)).catch(() => {});
      }
      setLoading(false);
    });
  }, []);

  // Filter top companies
  const displayedCompanies = (overview?.top_companies || []).filter((comp) => {
    if (activeCompanyCategory === "india") return !comp.is_global;
    if (activeCompanyCategory === "global") return comp.is_global;
    return true;
  });

  return (
    <NavigationShell activePath="/">
      <div className="space-y-6">
        {/* ─── Hero Intelligence Header ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#132B4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#16C8D5] uppercase">
              <Compass size={14} /> Unified Market Intelligence Terminal
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Global &amp; Indian Market Overview
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time multi-asset market pulse, institutional market breadth, top corporate movers, and breaking macroeconomic intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B1D38] hover:bg-[#102547] border border-[#132B4F] text-xs font-semibold text-white transition shadow-sm"
            >
              <Search size={14} className="text-[#087BEE]" /> Discover Equities
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#087BEE] hover:bg-[#0769cc] text-xs font-semibold text-white transition shadow-sm"
            >
              <Newspaper size={14} /> News Intelligence
            </Link>
          </div>
        </div>

        {/* ─── Breaking News Marquee Wire ─────────────────────────────────── */}
        {newsStories.length > 0 && (
          <div className="p-3 rounded-xl bg-[#0B1D38] border border-[#F06464]/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F06464]/20 text-[#F06464] border border-[#F06464]/40 flex items-center gap-1 animate-pulse">
                <Flame size={12} /> BREAKING WIRE
              </span>
            </div>
            <Link
              href={`/news/${newsStories[0].id}`}
              className="text-white hover:text-[#16C8D5] transition font-semibold truncate flex-1"
            >
              {newsStories[0].title}
            </Link>
            <Link
              href="/news"
              className="text-[11px] font-mono font-bold text-[#087BEE] hover:underline shrink-0"
            >
              View Feed &rarr;
            </Link>
          </div>
        )}

        {/* ─── Key Indices Snapshot Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(overview?.indices?.slice(0, 6) || [
            { symbol: "NIFTY 50", price: 24480.20, change_pct: 0.46, exchange: "NSE" },
            { symbol: "SENSEX", price: 80365.10, change_pct: 0.40, exchange: "BSE" },
            { symbol: "NIFTY BANK", price: 52180.50, change_pct: 0.47, exchange: "NSE" },
            { symbol: "NASDAQ 100", price: 20890.40, change_pct: 0.69, exchange: "NASDAQ" },
            { symbol: "S&P 500", price: 5910.80, change_pct: 0.38, exchange: "NYSE" },
            { symbol: "BRENT CRUDE", price: 74.65, change_pct: 1.70, exchange: "ICE" },
          ]).map((idx, i) => {
            const isPositive = idx.change_pct >= 0;
            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono font-semibold">
                  <span className="truncate">{idx.symbol}</span>
                  <span className="px-1 py-0.2 rounded bg-[#07152B]">{idx.exchange}</span>
                </div>
                <div className="mt-2">
                  <div className="text-base font-bold font-mono text-white">
                    {idx.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-mono font-bold flex items-center gap-0.5 mt-0.5 ${
                      isPositive ? "text-[#39E85B]" : "text-[#F06464]"
                    }`}
                  >
                    {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {isPositive ? "+" : ""}
                    {idx.change_pct.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Market Breadth & Market Mood Index (MMI) ───────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Breadth Card */}
          <div className="p-4 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Activity size={14} className="text-[#087BEE]" /> Market Breadth (NSE)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#39E85B]/15 text-[#39E85B] font-bold">
                BULLISH SPREAD
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#39E85B] font-bold">34 Advances (68%)</span>
                <span className="text-[#F06464] font-bold">16 Declines (32%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#102547] overflow-hidden flex">
                <div style={{ width: "68%" }} className="bg-[#39E85B] h-full"></div>
                <div style={{ width: "32%" }} className="bg-[#F06464] h-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#132B4F]/60 font-mono">
              <span>Advance/Decline Ratio: <strong>2.12</strong></span>
              <span>Turnover: <strong>₹84,250 Cr</strong></span>
            </div>
          </div>

          {/* Market Mood Index (MMI) */}
          <div className="p-4 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Compass size={14} className="text-[#16C8D5]" /> Market Mood Index (MMI)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#39E85B]/15 text-[#39E85B] border border-[#39E85B]/30">
                GREED (64/100)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Market sentiment reflects confidence driven by sustained domestic institutional inflows and resilient Q3 earnings guidance.
            </p>

            <div className="w-full h-2 rounded-full bg-gradient-to-r from-[#F06464] via-amber-400 to-[#39E85B] relative mt-2">
              <div
                className="w-3 h-3 rounded-full bg-white border-2 border-black absolute -top-0.5 shadow"
                style={{ left: "64%" }}
              ></div>
            </div>
          </div>

          {/* Key Macro Indicator */}
          <div className="p-4 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">
                  Macro Policy Benchmark
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#087BEE]/20 text-[#16C8D5]">
                  RBI MPC
                </span>
              </div>
              <div className="mt-2 text-xl font-bold font-mono text-white">
                Repo Rate: 6.50%
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-sans">
                Stance: <strong>Neutral</strong> · Inflation forecast: 4.5%
              </div>
            </div>
            <Link
              href="/news/news-001"
              className="text-xs font-semibold text-[#087BEE] hover:text-[#16C8D5] flex items-center gap-1"
            >
              Read Policy Transmission Impact &rarr;
            </Link>
          </div>
        </div>

        {/* ─── Top Companies & Market Movers Grid ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Companies (7 Columns) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#132B4F]">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[#087BEE]" />
                <h2 className="text-base font-bold text-white">Top Corporate Leaders</h2>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#07152B] border border-[#132B4F] text-xs">
                <button
                  onClick={() => setActiveCompanyCategory("all")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    activeCompanyCategory === "all" ? "bg-[#087BEE] text-white" : "text-slate-400"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveCompanyCategory("india")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    activeCompanyCategory === "india" ? "bg-[#087BEE] text-white" : "text-slate-400"
                  }`}
                >
                  Indian Blue Chips
                </button>
                <button
                  onClick={() => setActiveCompanyCategory("global")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    activeCompanyCategory === "global" ? "bg-[#087BEE] text-white" : "text-slate-400"
                  }`}
                >
                  Global Leaders
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#132B4F] text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">COMPANY</th>
                    <th className="pb-2">SECTOR</th>
                    <th className="pb-2 text-right">PRICE</th>
                    <th className="pb-2 text-right">CHANGE</th>
                    <th className="pb-2 text-right">MARKET CAP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#132B4F]/50 font-sans">
                  {displayedCompanies.slice(0, 7).map((comp) => {
                    const isPositive = comp.change_pct >= 0;
                    const symbolLower = comp.symbol.toLowerCase();

                    return (
                      <tr key={comp.symbol} className="hover:bg-[#102547]/50 transition group">
                        <td className="py-2.5 pr-2">
                          <Link
                            href={`/company/${symbolLower}`}
                            className="font-bold text-white group-hover:text-[#16C8D5] flex items-center gap-1.5"
                          >
                            <span>{comp.symbol}</span>
                            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#07152B] text-slate-400">
                              {comp.exchange}
                            </span>
                          </Link>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {comp.name}
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-300 text-[11px]">{comp.sector}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-white">
                          {comp.currency === "INR" ? "₹" : "$"}
                          {comp.price.toFixed(2)}
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] inline-flex items-center gap-0.5 ${
                              isPositive
                                ? "text-[#39E85B] bg-[#39E85B]/10"
                                : "text-[#F06464] bg-[#F06464]/10"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {comp.change_pct.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-slate-300">
                          {comp.currency === "INR"
                            ? `₹${(comp.market_cap_cr / 1000).toFixed(1)}k Cr`
                            : `$${(comp.market_cap_cr / 1000).toFixed(0)}B`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-right">
              <Link
                href="/stocks"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#087BEE] hover:text-[#16C8D5]"
              >
                View Complete Equities Directory <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Market Movers (5 Columns) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#132B4F]">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-[#F06464]" />
                <h2 className="text-base font-bold text-white">Market Movers</h2>
              </div>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#07152B] border border-[#132B4F] text-xs">
              <button
                onClick={() => setActiveMoverTab("gainers")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  activeMoverTab === "gainers" ? "bg-[#087BEE] text-white" : "text-slate-400"
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setActiveMoverTab("losers")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  activeMoverTab === "losers" ? "bg-[#087BEE] text-white" : "text-slate-400"
                }`}
              >
                Top Losers
              </button>
              <button
                onClick={() => setActiveMoverTab("active")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  activeMoverTab === "active" ? "bg-[#087BEE] text-white" : "text-slate-400"
                }`}
              >
                Most Active
              </button>
              <button
                onClick={() => setActiveMoverTab("highs")}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  activeMoverTab === "highs" ? "bg-[#087BEE] text-white" : "text-slate-400"
                }`}
              >
                52W Highs
              </button>
            </div>

            {/* Movers List */}
            <div className="space-y-2">
              {((overview?.movers?.[
                activeMoverTab === "gainers"
                  ? "top_gainers"
                  : activeMoverTab === "losers"
                  ? "top_losers"
                  : activeMoverTab === "active"
                  ? "most_active"
                  : "week52_highs"
              ] || [])).map((mover) => {
                const isPositive = mover.change >= 0;
                return (
                  <Link
                    key={mover.symbol}
                    href={`/company/${mover.symbol.toLowerCase()}`}
                    className="p-3 rounded-xl bg-[#07152B] border border-[#132B4F] hover:border-[#087BEE]/60 transition flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-bold text-white group-hover:text-[#16C8D5]">
                        {mover.symbol}
                      </div>
                      <div className="text-[11px] text-slate-400">{mover.name}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white">
                        ₹{mover.price.toFixed(2)}
                      </div>
                      <div
                        className={`font-mono text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                          isPositive ? "text-[#39E85B]" : "text-[#F06464]"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {mover.change_pct.toFixed(2)}%
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Market Sector Heatmap Section ──────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-[#16C8D5]" /> Interactive Market Sector Heatmap
            </h2>
            <Link
              href="/markets"
              className="text-xs font-semibold text-[#087BEE] hover:text-[#16C8D5] flex items-center gap-1"
            >
              Full Multi-Asset Markets Hub <ArrowRight size={13} />
            </Link>
          </div>
          <MarketHeatmap initialUniverse="all" />
        </div>

        {/* ─── Featured News Intelligence Section ─────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Newspaper size={18} className="text-[#087BEE]" /> Latest Market Intelligence
            </h2>
            <Link
              href="/news"
              className="text-xs font-semibold text-[#087BEE] hover:text-[#16C8D5] flex items-center gap-1"
            >
              Open News Intelligence Centre <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsStories.slice(0, 3).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}
