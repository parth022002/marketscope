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
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Layers,
  Server,
  ArrowRight,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import NewsCard from "@/components/NewsCard";
import { getNewsFeed, type CanonicalNewsArticle } from "@/lib/api";

const CHANNELS = [
  { id: "ALL", label: "All News" },
  { id: "INDIA", label: "India Domestic", country: "India" },
  { id: "GLOBAL", label: "Global Macro", market: "INTERNATIONAL" },
  { id: "MARKETS", label: "Financial Markets", category: "Financial Markets" },
  { id: "ECONOMY", label: "Economy & Policy", category: "Economy & Central Banks" },
  { id: "COMPANY", label: "Company News", category: "Company News" },
  { id: "BREAKING", label: "Breaking Wire", priority: "BREAKING" },
];

const SOURCE_TIERS = [
  { id: "ALL", label: "All Sources" },
  { id: "TIER_1_PRIMARY_OFFICIAL", label: "Tier 1 Primary Official" },
  { id: "TIER_2_ESTABLISHED_JOURNALISM", label: "Tier 2 Journalism" },
];

const VERIFICATION_STATUSES = [
  { id: "ALL", label: "All Verification Statuses" },
  { id: "PRIMARY_SOURCE_CONFIRMED", label: "Primary Confirmed" },
  { id: "MULTIPLE_SOURCES_REPORTED", label: "Multi-Source Corroborated" },
];

export default function NewsCentrePage() {
  const [newsList, setNewsList] = useState<CanonicalNewsArticle[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("ALL");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const activeChannel = CHANNELS.find((c) => c.id === selectedChannel);

    getNewsFeed({
      category: activeChannel?.category,
      country: activeChannel?.country,
      market: activeChannel?.market,
      priority: activeChannel?.priority,
      source_tier: selectedTier === "ALL" ? undefined : selectedTier,
      verification_status: selectedStatus === "ALL" ? undefined : selectedStatus,
      query: searchQuery.trim() || undefined,
    })
      .then((data) => setNewsList(data || []))
      .catch(() => setNewsList([]))
      .finally(() => setLoading(false));
  }, [selectedChannel, selectedTier, selectedStatus, searchQuery]);

  return (
    <NavigationShell activePath="/news">
      <div className="space-y-6 w-full">
        {/* ─────────────────── Header & Trust Banner ─────────────────── */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0B1930] via-[#09172B] to-[#071426] border border-[#162C4E] shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-cyan-400" /> Real-Time Verified Financial Intelligence
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} /> 100% Traceable Lineage
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/news/sources"
                className="px-3 py-1.5 rounded-xl bg-[#071426] hover:bg-[#10223B] border border-[#162C4E] hover:border-blue-500/40 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5 font-mono"
              >
                <Layers size={13} className="text-cyan-400" /> Sources Directory
              </Link>
              <Link
                href="/admin/news"
                className="px-3 py-1.5 rounded-xl bg-[#071426] hover:bg-[#10223B] border border-[#162C4E] hover:border-blue-500/40 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5 font-mono"
              >
                <Server size={13} className="text-emerald-400" /> Pipeline Monitor
              </Link>
            </div>
          </div>

          <div className="max-w-4xl space-y-2">
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Verified Financial News Intelligence
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed">
              Every story is anchored to primary regulatory filings (NSE, BSE, SEBI, RBI, PIB, SEC) or verified multi-source financial journalism. Zero synthetic headlines, zero fabricated dates, and permanent cryptographic hash tracking.
            </p>
          </div>
        </div>

        {/* ─────────────────── Search & Multi-Filter Control Hub ─────────────────── */}
        <div className="p-5 rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-4 shadow-lg">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified news by company, ticker, regulatory body, or macroeconomic event (e.g. Reliance, TCS, RBI, Crude, SEBI)..."
              className="w-full bg-[#071426] border border-[#162C4E] focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition font-sans shadow-inner"
            />
          </div>

          {/* Channel Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#162C4E]/60 text-xs">
            <span className="text-[11px] font-mono text-slate-400 mr-2 uppercase">Channel:</span>
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedChannel === ch.id
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                    : "bg-[#071426] text-slate-300 hover:text-white hover:bg-[#10223B] border border-[#162C4E]"
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>

          {/* Sub-Filters: Source Tier & Verification Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#162C4E]/40 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] uppercase">Source Tier:</span>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-[#071426] border border-[#162C4E] text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
              >
                {SOURCE_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] uppercase">Verification:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#071426] border border-[#162C4E] text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
              >
                {VERIFICATION_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─────────────────── News Cards Grid ─────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-64 rounded-2xl bg-[#0B1930] border border-[#162C4E] animate-pulse p-5 space-y-3"
              >
                <div className="w-1/3 h-4 bg-[#10223B] rounded"></div>
                <div className="w-full h-8 bg-[#10223B] rounded"></div>
                <div className="w-5/6 h-4 bg-[#10223B] rounded"></div>
              </div>
            ))}
          </div>
        ) : newsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsList.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-3">
            <Newspaper size={32} className="mx-auto text-slate-400" />
            <div className="text-white font-bold text-sm">No verified news stories found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No articles match the current filter or search criteria. Try selecting another channel or clearing your search term.
            </p>
            <button
              onClick={() => {
                setSelectedChannel("ALL");
                setSelectedTier("ALL");
                setSelectedStatus("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
