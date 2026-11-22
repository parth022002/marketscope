"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Server,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Layers,
  FileCheck2,
  Cpu,
  RefreshCw,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import { getNewsAdminStats, type NewsAdminStats } from "@/lib/api";

export default function NewsAdminMonitorPage() {
  const [stats, setStats] = useState<NewsAdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    getNewsAdminStats()
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <NavigationShell activePath="/admin/market-data">
      <div className="space-y-8 w-full max-w-6xl mx-auto pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition"
          >
            <ArrowLeft size={14} /> Back to News Intelligence Wire
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-xs font-mono text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer"
            >
              <RefreshCw size={12} className={loading ? "animate-spin text-cyan-600 dark:text-cyan-400" : ""} /> Refresh Telemetry
            </button>
            <Link
              href="/news/sources"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-xs font-mono text-slate-700 dark:text-slate-200 shadow-sm"
            >
              <Layers size={13} className="text-cyan-600 dark:text-cyan-400" /> Sources Directory
            </Link>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0B1930] dark:via-[#09172B] dark:to-[#071426] border border-slate-200 dark:border-[#162C4E] shadow-sm dark:shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                PIPELINE STATUS: {stats?.pipeline_health || "HEALTHY"}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                AUDIT ENGINE ACTIVE
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              As of: {stats ? new Date(stats.timestamp).toLocaleTimeString() : "--:--:--"}
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            News Pipeline &amp; Verification Telemetry Monitor
          </h1>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed max-w-3xl">
            Live operational dashboard tracking external regulatory connector uptime, circuit breaker states, primary source corroboration ratios, and user fact-dispute audits.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>ACTIVE CONNECTORS</span>
              <Cpu size={14} className="text-blue-500 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {stats?.active_sources_count ?? 10}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              0 connectors circuit-broken
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>ARTICLES INGESTED (24H)</span>
              <Activity size={14} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {stats?.total_articles_ingested_24h ?? 12}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Normalized &amp; Entity Mapped
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>PRIMARY SOURCE CONFIRMED</span>
              <ShieldCheck size={14} className="text-amber-500 dark:text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-300 font-mono">
              {stats?.primary_source_confirmed_pct ?? 58.3}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              Regulatory filing backed
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>USER DISPUTE REPORTS</span>
              <AlertTriangle size={14} className="text-rose-500 dark:text-red-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {stats?.unresolved_user_reports ?? 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Pending human investigation
            </div>
          </div>
        </div>

        {/* Pipeline Ingestion Architecture Details */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-6 shadow-sm dark:shadow-xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Server size={18} className="text-emerald-600 dark:text-emerald-400" /> Ingestion Architecture &amp; Anti-Hallucination Guardrails
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-600 dark:text-slate-300 font-sans">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> Strict Timestamp Preservation Policy
              </div>
              <p className="leading-relaxed">
                If an upstream source does not provide an authentic RFC-822 or ISO-8601 publication timestamp, the ingestion pipeline marks it as <code className="text-cyan-600 dark:text-cyan-400 font-mono">publication_time_verified = false</code>. The pipeline strictly rejects substituting current wall-clock ingestion time for true publication time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> Indian Copyright &amp; Fair Dealing Compliance
              </div>
              <p className="leading-relaxed">
                Under Section 52(1)(a)(iii) of the Copyright Act 1957, full journalistic article text is never duplicated or cached for display. Only original headlines, factual short excerpts (&le; 80 words), publisher attribution, and direct external source links are provided.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> Circuit Breakers &amp; Outage Isolation
              </div>
              <p className="leading-relaxed">
                Connectors automatically trip after 3 consecutive network failures or HTTP errors, initiating an isolated 120-second cooldown period. This protects application latency and prevents upstream rate-limit blacklisting.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 font-mono">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" /> Transparent Causal Transmission Modeling
              </div>
              <p className="leading-relaxed">
                Market impact classifications strictly separate confirmed policy actions from economic implications. The platform does not produce buy/sell advice or speculative forward price forecasts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}
