import Link from "next/link";
import { ShieldCheck, Scale, FileText, Database } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#132B4F] pt-8 pb-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-white font-bold text-sm">
              Market<span className="text-[#087BEE]">Scope</span>.io
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              India-first &amp; global fundamental research workspace. Canonical financial statements, deterministic ratios, and gated AI research intelligence.
            </p>
          </div>

          <div>
            <div className="text-white font-semibold text-xs mb-2">RESEARCH PLATFORM</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/search" className="hover:text-white transition">Company Search</Link></li>
              <li><Link href="/screener" className="hover:text-white transition">Stock Screener</Link></li>
              <li><Link href="/compare" className="hover:text-white transition">Peer Comparison</Link></li>
              <li><Link href="/watchlists" className="hover:text-white transition">Watchlists</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold text-xs mb-2">GOVERNANCE &amp; PRIVACY</div>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/workspace" className="hover:text-white transition">Workspace &amp; DPDP Controls</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy (DPDP Act 2023)</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition">SEBI Regulatory Notice</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold text-xs mb-2">INTELLIGENCE &amp; DATA</div>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>Neon Serverless PostgreSQL (Singapore)</li>
              <li>Financial Modeling Prep &amp; Twelve Data</li>
              <li>Live Multi-Exchange Tick Feed</li>
              <li>Gated Groq &amp; Gemini AI Synthesis</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#132B4F]/60 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} MarketScope.io. Strictly for research and decision-support. Zero brokerage execution or advisory.
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-400">Privacy (DPDP)</Link>
            <Link href="/disclaimer" className="hover:text-slate-400">Disclaimers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
