import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldAlert, Scale, Info } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function DisclaimerPage() {
  return (
    <div className="shell min-h-screen bg-[#07152B] text-slate-200 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Branding & Navigation */}
        <div className="flex items-center justify-between pb-2">
          <BrandLogo variant="inline" size={32} />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#087BEE] hover:text-[#16C8D5] transition"
          >
            <ArrowLeft size={14} /> Back to MarketScope.io
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#132B4F] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Regulatory Disclaimer &amp; Risk Disclosures</h1>
            <p className="text-xs text-slate-400 mt-1">
              Statutory Research Platform Notice | Securities Market Risk Warning
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0B1D38] border border-[#132B4F] flex items-center justify-center text-amber-400">
            <Scale size={20} />
          </div>
        </div>

        {/* Highlighted Warning Banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs text-amber-200 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <AlertTriangle size={16} /> IMPORTANT STATUTORY NOTICE (SEBI REGULATIONS)
          </div>
          <p>
            MarketScope.io is an educational, fundamental research, and financial data modeling workspace. <strong>MarketScope.io is NOT a SEBI-registered Investment Adviser (RIA), Research Analyst (RA), Portfolio Manager, or Stock Broker</strong> under the regulations of the Securities and Exchange Board of India (SEBI) or any other regulatory jurisdiction.
          </p>
        </div>

        {/* Detailed Risk Warnings */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              1. No Investment Advice or Buy/Sell Recommendations
            </h2>
            <p>
              Nothing published on this website, including but not limited to company dossiers, canonical financial statements, deterministic ratios (e.g., P/E, ROE, Debt/Equity, Free Cash Flow), peer comparison rankings, screener outputs, or AI-generated research syntheses, constitutes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
              <li>Investment advice or financial consulting.</li>
              <li>A research report as defined under SEBI (Research Analysts) Regulations, 2014.</li>
              <li>An endorsement, recommendation, or solicitation to buy, sell, subscribe to, or hold any security.</li>
              <li>A projection or guarantee of future capital returns, share price appreciation, or dividend yields.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              2. Securities Market Risk Warning
            </h2>
            <p className="p-3 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-slate-300">
              <em>&quot;Investment in securities market are subject to market risks. Read all the related documents carefully before investing.&quot;</em>
            </p>
            <p>
              Equity investments, derivatives, and financial market instruments carry inherent risks of substantial capital loss. Historical financial performance, past earnings growth, or historical return metrics (such as ROE or ROCE) are not indicative of future performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              3. Retrieval-Augmented AI Synthesis Guardrails
            </h2>
            <p>
              AI-generated commentary on MarketScope.io operates under deterministic retrieval constraints strictly anchored to historical corporate filings. Large Language Models (LLMs) may occasionally misinterpret qualitative context or nuances in complex footnote disclosures. Users must independently verify all AI citations against primary regulatory filings on exchange websites (BSE / NSE / SEC EDGAR) before drawing analytical conclusions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              4. Independent Due Diligence
            </h2>
            <p>
              All users are urged to consult a qualified, SEBI-registered Investment Adviser or licensed financial professional to evaluate their individual risk tolerance, liquidity constraints, and tax circumstances prior to executing financial transactions.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#132B4F] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>&copy; 2026 MarketScope.io. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/workspace" className="hover:text-slate-300">Workspace &amp; Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
