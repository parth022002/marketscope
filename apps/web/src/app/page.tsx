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
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import NewsCard from "@/components/NewsCard";
import MarketHeatmap from "@/components/MarketHeatmap";
import MarketOverviewCard from "@/components/MarketOverviewCard";
import IndexPerformanceChart from "@/components/IndexPerformanceChart";
import TopCompaniesTable from "@/components/TopCompaniesTable";
import MarketMovers from "@/components/MarketMovers";
import {
  getMarketOverview,
  getNewsFeed,
  type MarketOverview,
  type NewsItem,
} from "@/lib/api";

const QUICK_SHORTCUTS = [
  { symbol: "NIFTY 50", label: "Nifty 50", href: "/markets" },
  { symbol: "SENSEX", label: "Sensex", href: "/markets" },
  { symbol: "RELIANCE", label: "Reliance Ind.", href: "/company/reliance" },
  { symbol: "TCS", label: "TCS", href: "/company/tcs" },
  { symbol: "BRENT", label: "Brent Crude", href: "/markets" },
  { symbol: "GOLD", label: "Gold 24K", href: "/markets" },
  { symbol: "AAPL", label: "Apple", href: "/company/aapl" },
  { symbol: "NVDA", label: "Nvidia", href: "/company/nvda" },
];

export default function DashboardPage() {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [newsStories, setNewsStories] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState("");

  useEffect(() => {
    Promise.all([
      getMarketOverview().catch(() => null),
      getNewsFeed({ priority: "BREAKING" }).catch(() => []),
    ]).then(([overviewData, newsData]) => {
      if (overviewData) setOverview(overviewData);
      if (newsData && newsData.length > 0) {
        setNewsStories(newsData);
      } else {
        getNewsFeed().then((fallback) => setNewsStories(fallback)).catch(() => {});
      }
      setLoading(false);
    });
  }, []);

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(heroSearch.trim())}`;
    }
  };

  return (
    <NavigationShell activePath="/">
      <div className="space-y-8 w-full">
        {/* ─────────────────── 1. Hero Intelligence Section ─────────────────── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1930] via-[#09172B] to-[#071426] border border-[#162C4E] p-6 md:p-8 shadow-xl">
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                <Sparkles size={12} /> Institutional Financial Intelligence
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE MARKETS · IST 09:15 - 15:30
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Understand Markets. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Discover Opportunities.
              </span>{" "}
              Stay Ahead.
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
              Your unified workspace for global markets, real-time macroeconomic intelligence, 15 golden financial ratios, and evidence-backed filing lineage.
            </p>

            {/* Quick Hero Search Input */}
            <form onSubmit={handleHeroSearchSubmit} className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-4 text-slate-400" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search any Indian or global company (e.g. RELIANCE, TCS, AAPL, NVDA)..."
                  className="w-full bg-[#071426] border border-[#162C4E] focus:border-blue-500 rounded-2xl pl-11 pr-28 py-3 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none transition shadow-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md"
                >
                  Explore
                </button>
              </div>
            </form>

            {/* Quick Market Jump Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-mono text-[11px] uppercase">Trending Tickers:</span>
              {QUICK_SHORTCUTS.map((sc) => (
                <Link
                  key={sc.symbol}
                  href={sc.href}
                  className="px-2.5 py-1 rounded-lg bg-[#071426] hover:bg-[#10223B] border border-[#162C4E] hover:border-blue-500/50 text-slate-300 hover:text-white transition font-mono font-semibold text-[11px]"
                >
                  {sc.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────── 2. Breaking News Marquee Wire ─────────────────── */}
        {newsStories.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-[#0B1930] border border-red-500/30 flex items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 animate-pulse">
                <Flame size={12} /> BREAKING WIRE
              </span>
            </div>
            <Link
              href={`/news/${newsStories[0].id}`}
              className="text-white hover:text-cyan-400 transition font-semibold truncate flex-1"
            >
              {newsStories[0].title}
            </Link>
            <Link
              href="/news"
              className="text-[11px] font-mono font-bold text-blue-400 hover:underline shrink-0 flex items-center gap-1"
            >
              All News &rarr;
            </Link>
          </div>
        )}

        {/* ─────────────────── 3. Multi-Asset Snapshot Grid with Sparklines ─────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Globe size={18} className="text-blue-500" /> Global &amp; Indian Benchmarks
            </h2>
            <Link
              href="/markets"
              className="text-xs font-semibold text-blue-400 hover:text-cyan-400 flex items-center gap-1"
            >
              Full Markets Hub &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(overview?.indices?.slice(0, 6) || [
              { symbol: "NIFTY 50", price: 24480.20, change: 112.40, change_pct: 0.46, exchange: "NSE", currency: "INR" },
              { symbol: "SENSEX", price: 80365.10, change: 320.15, change_pct: 0.40, exchange: "BSE", currency: "INR" },
              { symbol: "NIFTY BANK", price: 52180.50, change: 245.80, change_pct: 0.47, exchange: "NSE", currency: "INR" },
              { symbol: "NASDAQ 100", price: 20890.40, change: 142.60, change_pct: 0.69, exchange: "NASDAQ", currency: "USD" },
              { symbol: "S&P 500", price: 5910.80, change: 22.40, change_pct: 0.38, exchange: "NYSE", currency: "USD" },
              { symbol: "BRENT CRUDE", price: 74.65, change: 1.25, change_pct: 1.70, exchange: "ICE", currency: "USD" },
            ]).map((idx, i) => (
              <MarketOverviewCard
                key={i}
                symbol={idx.symbol}
                price={idx.price}
                change={idx.change || 0}
                change_pct={idx.change_pct}
                currency={idx.currency || "INR"}
                exchange={idx.exchange}
              />
            ))}
          </div>
        </div>

        {/* ─────────────────── 4. Performance Chart & Market Sentiment ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Benchmark Chart (7 Cols) */}
          <div className="lg:col-span-7">
            <IndexPerformanceChart selectedIndex="NIFTY 50" />
          </div>

          {/* Market Breadth & Sentiment (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Market Breadth Card */}
            <div className="p-5 rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                  <Activity size={15} className="text-blue-500" /> Market Breadth (NSE 50)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ADVANCE RATIO 2.12
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">34 Advances (68%)</span>
                  <span className="text-red-400 font-bold">16 Declines (32%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#071426] overflow-hidden flex border border-[#162C4E]">
                  <div style={{ width: "68%" }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: "32%" }} className="bg-red-500 h-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#162C4E]/60 font-mono">
                <span>NSE Turnover: <strong className="text-white">₹84,250 Cr</strong></span>
                <span>FII / DII Net: <strong className="text-emerald-400">+₹1,420 Cr</strong></span>
              </div>
            </div>

            {/* Market Mood Index (MMI) Sentiment Gauge */}
            <div className="p-5 rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                  <Compass size={15} className="text-cyan-400" /> Market Mood Index (MMI)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  GREED (64 / 100)
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Institutional risk appetite is elevated, supported by resilient quarterly earnings guidance and strong domestic SIP capital inflows.
              </p>

              <div className="w-full h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 relative mt-3">
                <div
                  className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 absolute -top-0.5 shadow-md"
                  style={{ left: "64%" }}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1">
                <span>Extreme Fear (0)</span>
                <span>Neutral (50)</span>
                <span>Extreme Greed (100)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────── 5. Top Companies Table & Movers Pulse ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <TopCompaniesTable companies={overview?.top_companies || []} />
          </div>

          <div className="lg:col-span-4">
            <MarketMovers
              gainers={overview?.movers?.top_gainers || []}
              losers={overview?.movers?.top_losers || []}
              mostActive={overview?.movers?.most_active || []}
            />
          </div>
        </div>

        {/* ─────────────────── 6. Interactive Sector Performance Heatmap ─────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Layers size={18} className="text-cyan-400" /> Sector Performance Tree-Map
              </h2>
              <p className="text-xs text-slate-400">
                Box size proportional to market capitalization; color intensity indicates % daily price change.
              </p>
            </div>
            <Link
              href="/screener"
              className="text-xs font-semibold text-blue-400 hover:text-cyan-400"
            >
              Open Full Screener &rarr;
            </Link>
          </div>

          <MarketHeatmap initialUniverse="all" />
        </div>

        {/* ─────────────────── 7. Editorial News Intelligence Feed ─────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Newspaper size={18} className="text-blue-500" /> Verified Financial News Wire
              </h2>
              <p className="text-xs text-slate-400">
                Scored by the 7-factor relevance engine across macro impacts, corporate actions, and regulatory developments.
              </p>
            </div>
            <Link
              href="/news"
              className="px-3.5 py-1.5 rounded-xl bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] text-xs font-bold text-white transition"
            >
              View All News ({newsStories.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsStories.slice(0, 6).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}
