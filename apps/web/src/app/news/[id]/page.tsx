"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Bookmark,
  Activity,
  Layers,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import NewsImpactCard from "@/components/NewsImpactCard";
import { getNewsStory, type NewsItem } from "@/lib/api";

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [story, setStory] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getNewsStory(id)
      .then((data) => setStory(data))
      .catch(() => setStory(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <NavigationShell activePath="/news">
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading market impact analysis...
        </div>
      </NavigationShell>
    );
  }

  if (!story) {
    return (
      <NavigationShell activePath="/news">
        <div className="p-12 text-center space-y-3 bg-[#0B1D38] border border-[#132B4F] rounded-2xl">
          <h2 className="text-base font-bold text-white">Story Not Found</h2>
          <p className="text-xs text-slate-400">
            The requested intelligence report could not be found or has expired.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#087BEE] text-white text-xs font-semibold"
          >
            <ArrowLeft size={14} /> Back to News Intelligence
          </Link>
        </div>
      </NavigationShell>
    );
  }

  return (
    <NavigationShell activePath="/news">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-2 border-b border-[#132B4F]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087BEE] hover:text-[#16C8D5] transition"
          >
            <ArrowLeft size={14} /> Back to News Centre
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-[#102547] text-[#16C8D5] border border-[#16C8D5]/30">
              Relevance: {story.relevance_score}/100
            </span>
            <span className="px-2 py-0.5 rounded bg-black/40 text-slate-300 font-bold">
              {story.priority}
            </span>
          </div>
        </div>

        {/* Headline & Metadata */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-white font-bold">{story.publisher}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Globe size={12} /> {story.country}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {new Date(story.published_at).toLocaleString("en-IN")}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {story.title}
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
            {story.summary}
          </p>
        </div>

        {/* Key Verified Facts Bulletins */}
        {story.key_facts && story.key_facts.length > 0 && (
          <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#16C8D5] flex items-center gap-2">
              <CheckCircle2 size={15} /> Verified Key Facts &amp; Disclosures
            </h3>
            <ul className="space-y-2 text-xs text-slate-200">
              {story.key_facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#087BEE] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Market Impact & Transmission Channels Component */}
        <NewsImpactCard news={story} />

        {/* Corroborating Sources & Citations */}
        {story.corroborating_sources && story.corroborating_sources.length > 0 && (
          <div className="p-4 rounded-xl bg-[#0B1D38] border border-[#132B4F] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#39E85B]" />
              <span className="font-semibold text-white">Cross-Publisher Corroboration:</span>
              <span className="text-slate-300">
                Verified across {story.corroborating_sources.join(", ")}
              </span>
            </div>

            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#087BEE] hover:text-[#16C8D5] font-semibold"
            >
              Original Source <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Historical Context Note */}
        {story.historical_context && (
          <div className="p-4 rounded-xl bg-[#07152B] border border-[#132B4F] text-xs text-slate-400 leading-relaxed">
            <strong className="text-white block mb-1">Historical Context:</strong>
            {story.historical_context}
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
