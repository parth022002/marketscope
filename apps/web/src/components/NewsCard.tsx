"use client";

import Link from "next/link";
import { type NewsItem } from "@/lib/api";
import { Flame, AlertTriangle, Clock, Globe, ArrowRight, ExternalLink } from "lucide-react";

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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F06464]/20 text-[#F06464] border border-[#F06464]/40 flex items-center gap-1 animate-pulse">
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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#087BEE]/20 text-[#16C8D5] border border-[#087BEE]/40">
            HIGH IMPACT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#102547] text-slate-400 border border-[#132B4F]">
            {priority}
          </span>
        );
    }
  };

  return (
    <article className="p-4 md:p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] hover:border-[#087BEE]/60 transition flex flex-col justify-between group space-y-3 shadow-sm">
      {/* Top Meta Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {getPriorityBadge(news.priority)}
          <span className="text-[11px] font-semibold text-slate-300 font-mono">
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
      <div className="space-y-1.5">
        <Link
          href={`/news/${news.id}`}
          className="text-sm md:text-base font-bold text-white group-hover:text-[#16C8D5] transition leading-snug block"
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
      <div className="pt-2 border-t border-[#132B4F] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {news.entities.slice(0, 4).map((ent, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#07152B] border border-[#132B4F] text-slate-300"
            >
              {ent.symbol ? `$${ent.symbol}` : ent.name}
            </span>
          ))}
          {news.entities.length > 4 && (
            <span className="text-[10px] text-slate-500 font-mono">
              +{news.entities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102547] text-[#16C8D5] border border-[#16C8D5]/30">
            Relevance: {news.relevance_score}/100
          </span>
          <Link
            href={`/news/${news.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087BEE] hover:text-[#16C8D5] transition"
          >
            Analysis <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}
