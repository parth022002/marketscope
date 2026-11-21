"use client";

import Link from "next/link";
import { type NewsItem } from "@/lib/api";
import { Flame, AlertTriangle, Clock, Globe, ArrowRight, ExternalLink, Zap } from "lucide-react";

interface NewsCardProps {
  news: NewsItem;
  compact?: boolean;
}

export default function NewsCard({ news, compact = false }: NewsCardProps) {
  // Format relative time
  const getTimeAgo = (dateStr: string) => {
    try {
      const diffMinutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
      if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return "Recently";
    }
  };

  // Priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "BREAKING":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 animate-pulse">
            <Flame size={11} /> BREAKING
          </span>
        );
      case "CRITICAL":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle size={11} /> CRITICAL
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600/20 text-cyan-400 border border-blue-500/40">
            HIGH IMPACT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#071426] text-slate-400 border border-[#162C4E]">
            {priority}
          </span>
        );
    }
  };

  return (
    <article className="p-5 rounded-2xl bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between group space-y-3.5 shadow-sm hover:shadow-xl hover:-translate-y-0.5">
      {/* Top Meta Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {getPriorityBadge(news.priority)}
          <span className="text-[11px] font-bold text-slate-300 font-mono">
            {news.publisher}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
          <span className="flex items-center gap-1">
            <Globe size={11} /> {news.country}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {getTimeAgo(news.published_at)}
          </span>
        </div>
      </div>

      {/* Headline & Summary */}
      <div className="space-y-1.5 flex-1">
        <Link
          href={`/news/${news.id}`}
          className="text-sm md:text-base font-bold text-white group-hover:text-cyan-400 transition leading-snug block"
        >
          {news.title}
        </Link>
        {!compact && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
            {news.summary}
          </p>
        )}
      </div>

      {/* Entity Tags & Impact Metadata */}
      <div className="pt-3 border-t border-[#162C4E] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {news.entities.slice(0, 4).map((ent, idx) => (
            ent.symbol ? (
              <Link
                key={idx}
                href={`/company/${ent.symbol.toLowerCase()}`}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#071426] hover:bg-blue-600/30 border border-[#162C4E] text-cyan-300 hover:text-white transition"
              >
                ${ent.symbol}
              </Link>
            ) : (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#071426] border border-[#162C4E] text-slate-400"
              >
                {ent.name}
              </span>
            )
          ))}
          {news.entities.length > 4 && (
            <span className="text-[10px] text-slate-500 font-mono">
              +{news.entities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-[#071426] text-cyan-400 border border-cyan-500/30">
            <Zap size={10} className="text-yellow-400" />
            <span>Score: {news.relevance_score}/100</span>
          </div>
          <Link
            href={`/news/${news.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-cyan-400 transition"
          >
            Transmission <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}
