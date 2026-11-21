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
      <div className="space-y-8 w-full max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-[#162C4E]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft size={14} /> Back to News Intelligence Wire
          </Link>

          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] text-xs font-mono text-slate-200"
          >
            <Server size={13} className="text-emerald-400" /> Administrative Telemetry Monitor
          </Link>
        </div>

        {/* Directory Header Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0B1930] via-[#09172B] to-[#071426] border border-[#162C4E] shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ShieldCheck size={12} className="text-amber-400" /> Traceable Sourcing &amp; Compliance Register
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={12} /> Fair Dealing Enforced
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Registered News Sources &amp; Verification Methodology
          </h1>

          <p className="text-xs md:text-sm text-slate-300 font-sans leading-relaxed max-w-3xl">
            MarketScope.io maintains an exhaustive registry of authorized primary official disclosure entities and established financial publications. Synthetic headlines, anonymous tips, and unverified social media rumor mills are strictly barred from the production database.
          </p>
        </div>

        {/* 4-Tier Credibility Methodology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B1930] border border-amber-500/30 space-y-2">
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              TIER 1 PRIMARY OFFICIAL
            </div>
            <div className="text-sm font-bold text-white">Official Regulatory Filings</div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              NSE circulars, BSE disclosures, SEBI regulatory orders, RBI MPC releases, PIB gazettes, and SEC EDGAR Form 8-K filings.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400">
              Confidence Weight: 100%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1930] border border-blue-500/30 space-y-2">
            <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">
              TIER 2 ESTABLISHED JOURNALISM
            </div>
            <div className="text-sm font-bold text-white">Reputable Financial Press</div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Reuters, Mint, Business Standard, The Economic Times, BBC, CNBC. Requires independent multi-source corroboration.
            </p>
            <div className="pt-2 text-[11px] font-mono text-cyan-400">
              Confidence Weight: 85%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              TIER 3 SPECIALIST RESEARCH
            </div>
            <div className="text-sm font-bold text-white">Industry Trade Associations</div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              NASSCOM, SIAM, FADA, rating agency industry surveys. Flagged as secondary specialist analysis.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400">
              Confidence Weight: 60%
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1930] border border-red-500/30 space-y-2">
            <div className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
              TIER 4 EXCLUDED CHANNELS
            </div>
            <div className="text-sm font-bold text-white">Social Media &amp; Rumors</div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              X/Twitter rumors, anonymous Telegram pump groups, clickbait aggregators. Permanently excluded from ingestion.
            </p>
            <div className="pt-2 text-[11px] font-mono text-red-400">
              Confidence Weight: 0% (BARRED)
            </div>
          </div>
        </div>

        {/* Sources Register Table */}
        <div className="p-6 rounded-3xl bg-[#0B1930] border border-[#162C4E] space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" /> Active Approved Source Catalog
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              {sources.length} Verified Sources Active
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono animate-pulse">
              Loading source registry...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#162C4E] text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-3">SOURCE NAME</th>
                    <th className="py-3 px-3">TIER</th>
                    <th className="py-3 px-3">JURISDICTION</th>
                    <th className="py-3 px-3">CATEGORY</th>
                    <th className="py-3 px-3">LICENSE STATUS</th>
                    <th className="py-3 px-3">HEALTH &amp; LATENCY</th>
                    <th className="py-3 px-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162C4E]/60 text-slate-300">
                  {sources.map((src) => (
                    <tr key={src.source_id} className="hover:bg-[#10223B]/40 transition">
                      <td className="py-3.5 px-3 font-semibold text-white">
                        {src.name}
                      </td>
                      <td className="py-3.5 px-3 font-mono">
                        {src.tier === "TIER_1_PRIMARY_OFFICIAL" ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                            Tier 1 Primary
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600/15 text-blue-300 border border-blue-500/30">
                            Tier 2 Journalism
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono flex items-center gap-1.5 pt-4">
                        <Globe size={11} className="text-slate-400" /> {src.country}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {src.category}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <span className="text-emerald-400 font-semibold">{src.license_status}</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-slate-300">{src.latency_ms}ms</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <a
                          href={src.official_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-cyan-300 transition text-[11px] font-semibold"
                        >
                          Visit <ExternalLink size={11} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </NavigationShell>
  );
}
