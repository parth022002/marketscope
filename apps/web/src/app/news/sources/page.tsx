"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowLeft,
  Server,
  Globe,
  Activity,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import { getNewsSources, type NewsSourceItem } from "@/lib/api";

export default function NewsSourcesDirectoryPage() {
  const [sources, setSources] = useState<NewsSourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsSources()
      .then((data) => setSources(data || []))
      .catch(() => setSources([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <NavigationShell activePath="/news">
      <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition"
          >
            <ArrowLeft size={14} /> Back to News Intelligence Wire
          </Link>

          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-xs font-mono text-slate-700 dark:text-slate-200 shadow-sm"
          >
            <Server size={13} className="text-emerald-500 dark:text-emerald-400" /> Administrative Telemetry Monitor
          </Link>
        </div>

        {/* Directory Header Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0B1930] dark:via-[#09172B] dark:to-[#071426] border border-slate-200 dark:border-[#162C4E] shadow-sm dark:shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
              <ShieldCheck size={12} className="text-amber-500 dark:text-amber-400" /> Traceable Sourcing &amp; Compliance Register
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={12} /> Fair Dealing Enforced
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Registered News Sources &amp; Verification Methodology
          </h1>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed max-w-3xl">
            MarketScope.io maintains an exhaustive registry of authorized primary official disclosure entities and established financial publications. Synthetic headlines, anonymous tips, and unverified social media rumor mills are strictly barred from the production database.
          </p>
        </div>

        {/* 4-Tier Credibility Methodology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-amber-200 dark:border-amber-500/30 space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              TIER 1 PRIMARY OFFICIAL
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Official Regulatory Filings</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              NSE circulars, BSE disclosures, SEBI regulatory orders, RBI MPC releases, PIB gazettes, and SEC EDGAR Form 8-K filings.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Confidence Weight: 100%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-blue-200 dark:border-blue-500/30 space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              TIER 2 ESTABLISHED JOURNALISM
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Reputable Financial Press</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Reuters, Mint, Business Standard, The Economic Times, BBC, CNBC. Requires independent multi-source corroboration.
            </p>
            <div className="pt-2 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              Confidence Weight: 85%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              TIER 3 SPECIALIST RESEARCH
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Trade &amp; Industry Publications</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Specialized commodity wires, maritime shipping registries, and sectoral analysts. Corroborated with primary data.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
              Confidence Weight: 70%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-rose-200 dark:border-red-500/30 space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold text-rose-600 dark:text-red-400 uppercase tracking-wider">
              DISALLOWED SOURCES
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">Blacklisted Channels</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Anonymous social media tips, unverified Telegram pump channels, AI content scrapers, and clickbait blogs.
            </p>
            <div className="pt-2 text-[11px] font-mono text-rose-600 dark:text-red-400 font-semibold">
              Confidence Weight: 0% (BARRED)
            </div>
          </div>
        </div>

        {/* Sources Directory Table */}
        <div className="bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Layers size={18} className="text-blue-500" /> Authorized Publishing Entities &amp; Lineage Feeds
            </h2>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {sources.length} Registered Sources
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono">
                  <th className="py-3 px-3">Entity Name</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Jurisdiction</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-3">Official URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-700 dark:text-slate-300">
                {sources.map((s) => (
                  <tr key={s.source_id} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {s.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          s.tier === "TIER_1_PRIMARY_OFFICIAL"
                            ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                            : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                        }`}
                      >
                        {s.tier === "TIER_1_PRIMARY_OFFICIAL" ? "Tier 1 Official" : "Tier 2 Press"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono">{s.country || "Global"}</td>
                    <td className="py-3.5 px-3">{s.category}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                      {s.status}
                    </td>
                    <td className="py-3.5 px-3">
                      {s.official_website ? (
                        <a
                          href={s.official_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-cyan-600 dark:hover:text-cyan-300"
                        >
                          Visit <ExternalLink size={11} />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}
