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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#132B4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#16C8D5] uppercase">
              <Newspaper size={14} /> Market Intelligence Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              News Intelligence Centre
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Algorithmic news aggregation, entity-tagging, relevance-scoring, and market-impact modeling across global equities, central banks, and commodities.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 md:p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company, ticker, executive, central bank, or topic (e.g. Reliance, Powell, Crude, Tariffs)..."
                className="w-full bg-[#07152B] border border-[#132B4F] focus:border-[#087BEE] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-sans"
              />
            </div>
          </div>

          {/* Categories & Priority Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#132B4F]/60">
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-mono text-slate-500 mr-1 uppercase">Category:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-[#087BEE] text-white"
                      : "bg-[#07152B] text-slate-300 hover:text-white border border-[#132B4F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Priority Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-mono text-slate-500 mr-1 uppercase">Priority:</span>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition ${
                    selectedPriority === p
                      ? "bg-[#16C8D5] text-[#07152B]"
                      : "bg-[#07152B] text-slate-400 hover:text-white border border-[#132B4F]"
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
          <div className="p-12 text-center text-slate-400 text-xs">
            Filtering and scoring market intelligence wire...
          </div>
        ) : newsList.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-[#0B1D38] border border-[#132B4F] rounded-2xl">
            No news stories found matching the selected criteria. Try adjusting your search query or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((story) => (
              <NewsCard key={story.id} news={story} />
            ))}
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
