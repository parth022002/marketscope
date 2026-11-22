import Link from "next/link";
import { ArrowLeft, Shield, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function TermsPage() {
  return (
    <div className="shell min-h-screen bg-slate-50 dark:bg-[#07152B] text-slate-800 dark:text-slate-200 py-10 px-6 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Branding & Navigation */}
        <div className="flex items-center justify-between pb-2">
          <BrandLogo variant="inline" size={32} />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-[#087BEE] hover:text-cyan-600 dark:hover:text-[#16C8D5] transition"
          >
            <ArrowLeft size={14} /> Back to MarketScope.io
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#132B4F] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Effective Date: 20 November 2026 | Version 2.0 (SEBI RIA &amp; Research Compliance)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0B1D38] border border-slate-200 dark:border-[#132B4F] flex items-center justify-center text-blue-600 dark:text-[#087BEE] shadow-sm">
            <FileText size={20} />
          </div>
        </div>

        {/* Core Notice Box */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#0B1D38] border border-cyan-200 dark:border-[#16C8D5]/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
          <strong className="text-slate-900 dark:text-white block mb-1">Analytical &amp; Fundamental Research Workspace Only</strong>
          MarketScope.io is an independent financial technology platform designed strictly for data analytics, financial statement inspection, and quantitative fundamental modeling. We do not provide personalized investment advice, brokerage order execution, portfolio management, or buy/sell recommendations.
        </div>

        {/* Sections */}
        <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#087BEE]"></span>
              1. Non-Advisory &amp; Non-Brokerage Operating Scope
            </h2>
            <p>
              By accessing or using MarketScope.io (&quot;the Platform&quot;), you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
              <li>MarketScope.io is not registered as an Investment Adviser (RIA), Research Analyst (RA), or Stock Broker with the Securities and Exchange Board of India (SEBI), the US Securities and Exchange Commission (SEC), or any global financial regulator.</li>
              <li>No material, metric, canonical ratio, AI research synthesis, or peer matrix published on the Platform constitutes an offer, solicitation, or recommendation to buy, sell, or hold any security, derivative, or financial instrument.</li>
              <li>You are solely responsible for conducting your own independent due diligence before making any capital allocation or investment decisions.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#087BEE]"></span>
              2. Data Provenance &amp; Mathematical Calculations
            </h2>
            <p>
              MarketScope.io strives to calculate all valuation, profitability, solvency, and cash flow ratios deterministically from historical regulatory filings (MCA, BSE, NSE, SEC EDGAR). While calculated using documented formulas, the Platform provides information on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of uninterrupted availability or absolute historical completeness.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#087BEE]"></span>
              3. User Workspace Tenancy &amp; Authentication
            </h2>
            <p>
              Access to private research notes, custom watchlists, and cryptographic research snapshots is governed by Clerk authentication. You are responsible for safeguarding your login credentials. All workspace data is isolated by tenant identifiers and protected by strict row-level authorization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#087BEE]"></span>
              4. Gated AI Research Intelligence
            </h2>
            <p>
              AI-generated summaries, key drivers, and fundamental risk syntheses are produced through Retrieval-Augmented Generation (RAG) strictly anchored to historical corporate disclosures. Under our governance safeguards, the AI engine is programmed to abstain from generating commentary when audited financial statements are missing. AI outputs must never be treated as trading signals or financial advice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#087BEE]"></span>
              5. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with the Platform shall be subject to the exclusive jurisdiction of the competent courts of India.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#132B4F] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>&copy; 2026 MarketScope.io. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-800 dark:hover:text-slate-300">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-slate-800 dark:hover:text-slate-300">Regulatory Disclaimer</Link>
            <Link href="/workspace" className="hover:text-slate-800 dark:hover:text-slate-300">Workspace &amp; Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
