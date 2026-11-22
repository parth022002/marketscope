"use client";

import Link from "next/link";
import { type CanonicalNewsArticle } from "@/lib/api";
import {
  Flame,
  AlertTriangle,
  Clock,
  Globe,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  Layers,
  Sparkles,
} from "lucide-react";

interface NewsCardProps {
  news: CanonicalNewsArticle;
  compact?: boolean;
}

export default function NewsCard({ news, compact = false }: NewsCardProps) {
  const getTimeAgo = (dateStr: string) => {
    try {
      const diffMinutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
      if (diffMinutes < 0) return "Just now";
      if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return "Recently";
    }
  };

  const renderSourceTierBadge = () => {
    if (news.source_tier === "TIER_1_PRIMARY_OFFICIAL") {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
          <ShieldCheck size={11} className="text-amber-500" /> TIER 1 PRIMARY
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-500 border border-blue-500/30 flex items-center gap-1">
        <Sparkles size={11} className="text-blue-500" /> TIER 2 JOURNALISM
      </span>
    );
  };

  const renderVerificationBadge = () => {
    switch (news.verification_status) {
      case "PRIMARY_SOURCE_CONFIRMED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> VERIFIED
          </span>
        );
      case "MULTIPLE_SOURCES_REPORTED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Layers size={11} className="text-cyan-500" /> MULTI-SOURCE
          </span>
        );
      case "DISPUTED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-500 border border-rose-500/40 flex items-center gap-1 animate-pulse">
            <AlertTriangle size={11} /> DISPUTED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-[#071426] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#162C4E]">
            CREDIBLE
          </span>
        );
    }
  };

  const title = news.headline || news.title || "Financial Report";
  const publisher = news.publisher_name || news.publisher || "Official Source";
  const externalUrl = news.original_url || news.url;
  const entities = news.related_entities || news.entities || [];

  return (
    <article className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between group space-y-3.5 shadow-xs hover:shadow-xl hover:-translate-y-0.5">
      {/* Top Meta Line: Tiers & Verification */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {renderSourceTierBadge()}
          {renderVerificationBadge()}
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-700 dark:text-slate-300 font-bold">
            {news.relevance_score}/100 Rel
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {getTimeAgo(news.published_at)}
          </span>
        </div>
      </div>

      {/* Publisher & Category Line */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-900 dark:text-white font-bold">{publisher}</span>
          <span>·</span>
          <span>{news.category}</span>
        </div>
        <span className="flex items-center gap-1 text-[11px]">
          <Globe size={11} /> {news.country}
        </span>
      </div>

      {/* Headline & Summary */}
      <div className="space-y-1.5 flex-1">
        <Link
          href={`/news/${news.id}`}
          className="text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition leading-snug block"
        >
          {title}
        </Link>
        {!compact && news.summary && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-sans">
            {news.summary}
          </p>
        )}
      </div>

      {/* Primary Evidence Lineage Bar */}
      {news.evidence_items && news.evidence_items.length > 0 && (
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
            <FileCheck2 size={12} className="text-emerald-500 shrink-0" />
            <span className="truncate">Evidence: {news.evidence_items[0].title}</span>
          </div>
          {news.evidence_items[0].document_hash && (
            <span className="text-[10px] text-slate-400 shrink-0 ml-2 font-mono">
              HASH: {news.evidence_items[0].document_hash.slice(0, 8)}...
            </span>
          )}
        </div>
      )}

      {/* Bottom Action & Entity Tags */}
      <div className="pt-3 border-t border-slate-200 dark:border-[#162C4E] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {entities.slice(0, 3).map((ent, idx) => (
            ent.symbol ? (
              <Link
                key={idx}
                href={`/company/${ent.symbol.toLowerCase()}`}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#071426] hover:bg-blue-50 dark:hover:bg-blue-600/30 border border-slate-200 dark:border-[#162C4E] text-blue-600 dark:text-cyan-300 hover:text-blue-700 transition"
              >
                {ent.symbol}
              </Link>
            ) : (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400"
              >
                {ent.name}
              </span>
            )
          ))}
        </div>

        <div className="flex items-center gap-2">
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#071426] border border-transparent hover:border-slate-200 dark:hover:border-[#162C4E] transition"
              title="Open primary publisher disclosure"
            >
              <ExternalLink size={13} />
            </a>
          )}
          <Link
            href={`/news/${news.id}`}
            className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-cyan-500 transition"
          >
            Dossier <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}
