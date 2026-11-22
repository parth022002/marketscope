"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  Database,
  LineChart,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <NavigationShell activePath="/about">
      <div className="max-w-5xl mx-auto space-y-12 py-4">
        {/* Header Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
            <Sparkles size={13} /> Institutional Research Architecture
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            About MarketScope.io
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MarketScope.io is an institutional-grade financial research and market intelligence platform engineered for analysts, fund managers, and serious individual investors.
          </p>
        </section>

        {/* Core Principles */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-xs">
            <div className="p-2.5 w-fit rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Database size={20} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Data Lineage &amp; Provenance
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Every financial ratio, metric, and valuation multiple links directly back to its verified regulatory source filing. We enforce mathematical consistency with zero synthetic price fabrication.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-xs">
            <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Non-Custodial Architecture
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              MarketScope.io is strictly an educational research platform. We operate zero live broker execution, hold zero client funds, and route no customer orders, maintaining zero conflict of interest.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-xs">
            <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Lock size={20} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Privacy by Design (DPDP 2023)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              Engineered in full compliance with India&apos;s Digital Personal Data Protection Act 2023. Users maintain complete sovereignty over their data with one-click export and permanent cascading purge.
            </p>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="p-8 rounded-3xl bg-slate-50 dark:bg-[#09172B] border border-slate-200 dark:border-[#162C4E] space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Engineering Stack
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Built with modern, deterministic, and scalable technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-blue-500">Frontend</span>
              <p className="font-bold text-slate-900 dark:text-white">Next.js 15 &amp; React 19</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Server components, Tailwind CSS, Lightweight Charts v5</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-500">Backend API</span>
              <p className="font-bold text-slate-900 dark:text-white">FastAPI &amp; Python 3.12</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Modular monolith, async WebSockets, Uvicorn ASGI</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-cyan-500">Database</span>
              <p className="font-bold text-slate-900 dark:text-white">Neon Serverless PostgreSQL</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">SQLAlchemy ORM, Alembic migrations, connection pooling</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-500">Auth &amp; Security</span>
              <p className="font-bold text-slate-900 dark:text-white">Clerk Authentication</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Multi-session JWTs, RBAC, encrypted user isolation</p>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="text-center p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-emerald-500/10 border border-blue-500/20 space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            Ready to Explore the Platform?
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Experience real-time Indian and global market data, interactive charts, and deep fundamental research tools.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/markets"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <span>Explore Markets</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/screener"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#0B1930] hover:bg-slate-100 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-white font-bold text-xs transition"
            >
              Launch Screener
            </Link>
          </div>
        </section>
      </div>
    </NavigationShell>
  );
}
