"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  Flame,
  Search,
  Filter,
  Globe,
  TrendingUp,
  Activity,
  Sparkles,
  Zap,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import NewsCard from "@/components/NewsCard";
import { getNewsFeed, type NewsItem } from "@/lib/api";

const CATEGORIES = [
  "All",
  "Financial Markets",
  "Company News",
  "Economy & Central Banks",
  "Geopolitics",
  "Industry & Sectors",
];

const PRIORITIES = ["All", "BREAKING", "CRITICAL", "HIGH", "MEDIUM"];

export default function NewsCentrePage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getNewsFeed({
      category: selectedCategory === "All" ? undefined : selectedCategory,
      priority: selectedPriority === "All" ? undefined : selectedPriority,
      query: searchQuery.trim() || undefined,
    })
      .then((data) => setNewsList(data || []))
      .catch(() => setNewsList([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedPriority, searchQuery]);

  return (
    <NavigationShell activePath="/news">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              <Newspaper size={14} /> Real-Time Financial Intelligence Wire
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              News Intelligence Centre
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans leading-relaxed">
              Algorithmic news aggregation, entity-tagging, 7-factor relevance scoring, and transmission channel impact modeling across Indian and global capital markets.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              7-FACTOR RELEVANCE ACTIVE
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-5 rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-4 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news by company, ticker, person, sector, commodity, or keyword (e.g. Reliance, Powell, Crude, Tariffs)..."
                className="w-full bg-[#071426] border border-[#162C4E] focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition font-sans shadow-inner"
              />
            </div>
          </div>

          {/* Categories & Priority Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#162C4E]/60">
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-mono text-slate-400 mr-1 uppercase">Channel:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-[#071426] text-slate-300 hover:text-white border border-[#162C4E]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Priority Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-mono text-slate-400 mr-1 uppercase">Severity:</span>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition ${
                    selectedPriority === p
                      ? "bg-cyan-500 text-[#071426]"
                      : "bg-[#071426] text-slate-400 hover:text-white border border-[#162C4E]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stories Feed */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-3" />
            Scoring market transmission channels and relevance ranking...
          </div>
        ) : newsList.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs bg-[#0B1930] border border-[#162C4E] rounded-2xl">
            No verified news stories found matching the selected search and channel filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsList.map((story) => (
              <NewsCard key={story.id} news={story} />
            ))}
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
