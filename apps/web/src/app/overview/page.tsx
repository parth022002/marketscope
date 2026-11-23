"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Globe,
  Compass,
  Briefcase,
  Bookmark,
  LineChart,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Activity,
  BarChart3,
  Search,
  Filter,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import MarketOverviewCard from "@/components/MarketOverviewCard";
import MarketHeatmap from "@/components/MarketHeatmap";
import IndexPerformanceChart from "@/components/IndexPerformanceChart";
import RegulatoryAccessBadge from "@/components/RegulatoryAccessBadge";
import {
  getMarketTicker,
  getNewsFeed,
  type TickerItem,
  type CanonicalNewsArticle,
} from "@/lib/api";
import { useMarketWebSocket } from "@/lib/useMarketWebSocket";

export default function OverviewPage() {
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [news, setNews] = useState<CanonicalNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time WebSocket ticks
  const { isConnected, ticks } = useMarketWebSocket();

  useEffect(() => {
    let isMounted = true;
    const fetchOverviewData = () => {
      Promise.all([
        getMarketTicker(),
        getNewsFeed({ limit: 4 }).catch(() => []),
      ])
        .then(([t, n]) => {
          if (!isMounted) return;
          if (t && t.length > 0) setTickers(t);
          if (n && n.length > 0) setNews(n);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    };

    fetchOverviewData();
    const interval = setInterval(fetchOverviewData, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Merge live WebSocket ticks into ticker state
  const liveTickers = useMemo(() => {
    if (Object.keys(ticks).length === 0) return tickers;
    return tickers.map((t) => {
      const live = ticks[t.symbol];
      if (live) {
        return {
          ...t,
          price: live.price,
          change: live.change,
          change_pct: live.change_pct,
          data_status: live.data_status,
          market_status: live.market_status,
          timestamp: live.timestamp,
        };
      }
      return t;
    });
  }, [tickers, ticks]);

  const benchmarkIndices = useMemo(() => {
    return liveTickers.filter(
      (t) =>
        t.category === "indian_index" ||
        t.category === "global_index" ||
        t.symbol.includes("NIFTY") ||
        t.symbol.includes("SENSEX") ||
        t.symbol.includes("500") ||
        t.symbol.includes("NASDAQ")
    ).slice(0, 8);
  }, [liveTickers]);

  const topEquities = useMemo(() => {
    return liveTickers.filter((t) => t.category === "equity").slice(0, 8);
  }, [liveTickers]);


  return (
    <NavigationShell activePath="/overview">
      <div className="space-y-8 w-full max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              <LayoutDashboard size={14} /> Executive Market Terminal
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Cross-Asset Market Overview
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Consolidated real-time rates, domestic benchmarks, global index futures, macro economic catalysts, and AI research dossiers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/markets"
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Explore All Markets</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Top Benchmark Indices Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Activity size={16} className="text-sky-500" /> Key Benchmark Indices
            </h2>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              NSE · BSE · NASDAQ · NYSE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-2xl bg-slate-100 dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] animate-pulse"
                  />
                ))
              : (benchmarkIndices.length > 0 ? benchmarkIndices : tickers.slice(0, 4)).map((item) => (
                  <MarketOverviewCard
                    key={item.symbol}
                    symbol={item.symbol}
                    name={item.name}
                    price={item.price}
                    change={item.change}
                    change_pct={item.change_pct}
                    currency={item.currency}
                    exchange={item.exchange}
                    data_status={item.data_status}
                    sparkline={item.sparkline}
                  />
                ))}
          </div>
        </div>

        {/* 2-Column Section: Index Technical Chart + Sector Breadth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LineChart size={15} className="text-sky-500" /> Nifty 50 Intraday Structure
              </h3>
              <Link href="/charts" className="text-xs text-sky-500 hover:underline flex items-center gap-1 font-semibold">
                Terminal <ArrowRight size={11} />
              </Link>
            </div>
            <IndexPerformanceChart selectedIndex="NIFTY 50" />
          </div>

          <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers size={15} className="text-sky-500" /> Sector Market Breadth
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Capitalisation Weighted</span>
            </div>
            <MarketHeatmap initialUniverse="all" />
          </div>
        </div>

        {/* Top Active Equities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-500" /> Featured Active Equities
            </h2>
            <Link href="/discover" className="text-xs text-sky-500 hover:underline flex items-center gap-1 font-semibold">
              Stock Screener <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topEquities.map((item) => (
              <MarketOverviewCard
                key={item.symbol}
                symbol={item.symbol}
                name={item.name}
                price={item.price}
                change={item.change}
                change_pct={item.change_pct}
                currency={item.currency}
                exchange={item.exchange}
                data_status={item.data_status}
                sparkline={item.sparkline}
              />
            ))}
          </div>
        </div>

        {/* Verified Market News & Intelligence */}
        {news.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles size={16} className="text-sky-500" /> Verified Market Intelligence Wire
              </h2>
              <Link href="/news" className="text-xs text-sky-500 hover:underline flex items-center gap-1 font-semibold">
                View Full News Wire <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] space-y-2 hover:border-sky-500/50 transition"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-sky-600 dark:text-sky-400 font-mono">
                      {item.publisher || "Regulatory Wire"}
                    </span>
                    <span>
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
