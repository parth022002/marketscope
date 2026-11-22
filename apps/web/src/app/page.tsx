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
  BarChart2,
  LineChart,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  ChevronRight,
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
  { symbol: "BANK NIFTY", label: "Bank Nifty", href: "/markets" },
  { symbol: "RELIANCE", label: "Reliance Ind.", href: "/company/reliance" },
  { symbol: "TCS", label: "TCS", href: "/company/tcs" },
  { symbol: "INFY", label: "Infosys", href: "/company/infy" },
  { symbol: "BRENT", label: "Brent Crude", href: "/markets" },
  { symbol: "GOLD", label: "Gold 24K", href: "/markets" },
  { symbol: "AAPL", label: "Apple", href: "/company/aapl" },
  { symbol: "NVDA", label: "Nvidia", href: "/company/nvda" },
];

const PLATFORM_FEATURES = [
  {
    icon: LineChart,
    title: "Interactive Canvas Charts",
    description: "Institutional-grade HTML5 canvas charts powered by Lightweight Charts v5. Multi-timeframe resampling, 10 mathematical indicators, and SVG vector drawing tools.",
    badge: "Lightweight Charts v5",
    href: "/company/reliance",
  },
  {
    icon: BarChart2,
    title: "5-Pillar Scorecards",
    description: "Holistic evaluation across Valuation, Profitability, Growth, Financial Health, and Red Flags with 15 deterministic ratios calculated directly from filings.",
    badge: "Quantitative",
    href: "/screener",
  },
  {
    icon: Newspaper,
    title: "Verified News Intelligence",
    description: "7-factor credibility ranking, Tier-1 primary official attributions, cryptographic document hashing, and zero unverified AI hallucinations.",
    badge: "Source Backed",
    href: "/news",
  },
  {
    icon: Globe,
    title: "Universal Global Coverage",
    description: "Seamless discovery across NSE, BSE, NASDAQ, NYSE, LSE, SGX, commodities (Gold, Silver, Crude), currencies, and fixed income benchmarks.",
    badge: "Multi-Asset",
    href: "/markets",
  },
  {
    icon: FileSpreadsheet,
    title: "Primary Filing Lineage",
    description: "Transparent data lineage linking every reported financial ratio back to its primary source filing in exchange disclosures.",
    badge: "Audited",
    href: "/company/tcs",
  },
  {
    icon: ShieldCheck,
    title: "Sovereign Privacy & DPDP",
    description: "Strict adherence to India's Digital Personal Data Protection Act 2023. Pure analytical decision-support with zero order routing or brokerage risk.",
    badge: "DPDP 2023",
    href: "/workspace",
  },
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
      <div className="space-y-10 w-full">
        {/* ─────────────────── 1. Hero Intelligence Section ─────────────────── */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1930] via-[#09172B] to-[#071426] dark:from-[#0B1930] dark:via-[#09172B] dark:to-[#071426] border border-slate-200 dark:border-[#162C4E] p-6 md:p-10 shadow-2xl">
          {/* Ambient Decorative Glow Behind Text */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shadow-xs">
                <Sparkles size={13} /> Institutional Financial Intelligence
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NSE / BSE LIVE FEEDS · IST 09:15 – 15:30
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Financial Research &amp; Intelligence. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Precise. Evidence-Backed. Real-Time.
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
              Your unified workstation for Indian and global equities, macroeconomic benchmarks, 15 golden financial ratios, vector charting, and primary regulatory filing lineage.
            </p>

            {/* Quick Hero Search Input */}
            <form onSubmit={handleHeroSearchSubmit} className="pt-2 max-w-2xl">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search any Indian or global company (e.g. RELIANCE, TCS, AAPL, NVDA, NIFTY)..."
                  className="w-full bg-[#071426] border border-[#162C4E] focus:border-blue-500 rounded-2xl pl-12 pr-32 py-3.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none transition shadow-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <span>Explore</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </form>

            {/* Action Buttons & Quick Market Jump Shortcuts */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/screener"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <BarChart2 size={14} /> Launch Screener
              </Link>
              <Link
                href="/markets"
                className="px-4 py-2 rounded-xl bg-[#071426] hover:bg-[#10223B] border border-[#162C4E] text-slate-200 hover:text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <Globe size={14} /> Markets Hub
              </Link>
              <Link
                href="/company/reliance"
                className="px-4 py-2 rounded-xl bg-[#071426] hover:bg-[#10223B] border border-[#162C4E] text-slate-200 hover:text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <LineChart size={14} /> Interactive Charts
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                Trending Tickers:
              </span>
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
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1930] border border-rose-500/30 flex items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-500 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                <Flame size={12} /> BREAKING WIRE
              </span>
            </div>
            <Link
              href={`/news/${newsStories[0].id}`}
              className="text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 transition font-semibold truncate flex-1"
            >
              {newsStories[0].title}
            </Link>
            <Link
              href="/news"
              className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0 flex items-center gap-1"
            >
              All News &rarr;
            </Link>
          </div>
        )}

        {/* ─────────────────── 3. Multi-Asset Snapshot Grid with Sparklines ─────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                <Globe size={18} className="text-blue-500" /> Global &amp; Indian Benchmarks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibrated indices, energy futures, and bullion benchmarks.
              </p>
            </div>
            <Link
              href="/markets"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-cyan-500 flex items-center gap-1"
            >
              Full Markets Hub &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(overview?.indices?.slice(0, 6) || [
              { symbol: "NIFTY 50", price: 25800.60, change: 286.30, change_pct: 1.12, exchange: "NSE", currency: "INR" },
              { symbol: "SENSEX", price: 83919.71, change: 897.96, change_pct: 1.08, exchange: "BSE", currency: "INR" },
              { symbol: "BANK NIFTY", price: 53635.20, change: 1572.20, change_pct: 2.49, exchange: "NSE", currency: "INR" },
              { symbol: "NASDAQ 100", price: 20910.45, change: -85.20, change_pct: -0.41, exchange: "NASDAQ", currency: "USD" },
              { symbol: "S&P 500", price: 5969.34, change: 12.50, change_pct: 0.21, exchange: "NYSE", currency: "USD" },
              { symbol: "BRENT CRUDE", price: 74.20, change: 0.85, change_pct: 1.16, exchange: "ICE", currency: "USD" },
            ]).map((idx, i) => (
              <MarketOverviewCard
                key={i}
                symbol={idx.symbol}
                price={idx.price}
                change={idx.change || 0}
                change_pct={idx.change_pct}
                currency={idx.currency || "INR"}
                exchange={idx.exchange}
                data_status={(idx as any).data_status}
              />
            ))}
          </div>
        </section>

        {/* ─────────────────── 4. Performance Chart & Market Sentiment ─────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <IndexPerformanceChart selectedIndex="NIFTY 50" />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Market Breadth Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity size={15} className="text-blue-500" /> Market Breadth (NSE 50)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  ADVANCE RATIO 2.12
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-500 font-bold">34 Advances (68%)</span>
                  <span className="text-rose-500 font-bold">16 Declines (32%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#071426] overflow-hidden flex border border-slate-200 dark:border-[#162C4E]">
                  <div style={{ width: "68%" }} className="bg-emerald-500 h-full" />
                  <div style={{ width: "32%" }} className="bg-rose-500 h-full" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-[#162C4E]/60 font-mono">
                <span>NSE Turnover: <strong className="text-slate-800 dark:text-white">₹84,250 Cr</strong></span>
                <span>FII / DII Net: <strong className="text-emerald-500">+₹1,420 Cr</strong></span>
              </div>
            </div>

            {/* Market Mood Index (MMI) Sentiment Gauge */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                  <Compass size={15} className="text-cyan-500" /> Market Mood Index (MMI)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  GREED (64 / 100)
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Institutional risk appetite is elevated, supported by resilient quarterly earnings guidance and strong domestic SIP capital inflows.
              </p>

              <div className="w-full h-2 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 relative mt-3">
                <div
                  className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 absolute -top-0.5 shadow-md"
                  style={{ left: "64%" }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1">
                <span>Extreme Fear (0)</span>
                <span>Neutral (50)</span>
                <span>Extreme Greed (100)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────── 5. Platform Core Capabilities Grid ─────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-blue-500" /> Platform Architecture &amp; Capabilities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic research models designed for serious analysts, fund managers, and individual investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLATFORM_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <Link
                  key={feat.title}
                  href={feat.href}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/40 transition group shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 group-hover:scale-105 transition">
                        <Icon size={18} />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#071426] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      {feat.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-400 pt-2 border-t border-slate-100 dark:border-[#162C4E]/60">
                    <span>Explore Capability</span>
                    <ChevronRight size={13} className="group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─────────────────── 6. Top Companies Table & Movers Pulse ─────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
        </section>

        {/* ─────────────────── 7. Interactive Sector Performance Heatmap ─────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Layers size={18} className="text-cyan-500" /> Sector Performance Tree-Map
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Box size proportional to market capitalization; color intensity indicates % daily price change.
              </p>
            </div>
            <Link
              href="/screener"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-cyan-500"
            >
              Open Full Screener &rarr;
            </Link>
          </div>

          <MarketHeatmap initialUniverse="all" />
        </section>

        {/* ─────────────────── 8. Editorial News Intelligence Feed ─────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Newspaper size={18} className="text-blue-500" /> Verified Financial News Wire
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scored by the 7-factor relevance engine across macro impacts, corporate actions, and regulatory developments.
              </p>
            </div>
            <Link
              href="/news"
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-xs font-bold text-slate-800 dark:text-white transition shadow-xs"
            >
              View All News ({newsStories.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsStories.slice(0, 6).map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>
      </div>
    </NavigationShell>
  );
}
