"use client";

import Link from "next/link";
import { ShieldCheck, Scale, FileText, Database, Globe, ExternalLink } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <footer
      className={`mt-16 pt-10 pb-12 text-xs border-t transition-colors ${
        isLight
          ? "border-slate-200 text-slate-500 bg-white/50"
          : "border-[#132B4F] text-slate-400 bg-[#071426]/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3.5">
            <BrandLogo variant="full" height={32} />
            <p className="text-xs leading-relaxed">
              India-first &amp; global financial intelligence workspace. Canonical financial statements, deterministic ratios, and verified primary news wire.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Exchange Feeds: Operational</span>
            </div>
          </div>

          {/* Column 2: Research Platform */}
          <div>
            <div className={`font-bold text-xs uppercase tracking-wider mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
              RESEARCH PLATFORM
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/markets" className="hover:text-blue-500 transition">
                  Markets Hub &amp; Global Indices
                </Link>
              </li>
              <li>
                <Link href="/stocks" className="hover:text-blue-500 transition">
                  Stocks Discovery &amp; Equities
                </Link>
              </li>
              <li>
                <Link href="/screener" className="hover:text-blue-500 transition">
                  Quantitative Stock Screener
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-500 transition">
                  Peer Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/company/reliance" className="hover:text-blue-500 transition">
                  Interactive Chart &amp; Dossier
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Regulatory */}
          <div>
            <div className={`font-bold text-xs uppercase tracking-wider mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
              GOVERNANCE &amp; PRIVACY
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/workspace" className="hover:text-blue-500 transition">
                  Workspace &amp; DPDP Controls
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-500 transition">
                  Privacy Policy (DPDP Act 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-500 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-500 transition">
                  SEBI Regulatory Safe-Harbor
                </Link>
              </li>
              <li>
                <Link href="/admin/market-data" className="hover:text-blue-500 transition">
                  Data Lineage &amp; Providers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Intelligence & Architecture */}
          <div>
            <div className={`font-bold text-xs uppercase tracking-wider mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>
              INTELLIGENCE &amp; DATA
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Database size={13} className="text-cyan-500" />
                <span>Neon PostgreSQL (Singapore)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe size={13} className="text-blue-500" />
                <span>NSE / BSE / NASDAQ Feeds</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileText size={13} className="text-emerald-500" />
                <span>Primary Regulatory Filings</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-amber-500" />
                <span>Read-Only Decision Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
            isLight ? "border-slate-200 text-slate-500" : "border-[#132B4F]/60 text-slate-500"
          }`}
        >
          <div>
            &copy; {new Date().getFullYear()} MarketScope.io. Built for institutional precision. Zero trading execution, portfolio management, or financial advisory.
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-blue-500 transition">Terms</Link>
            <Link href="/privacy" className="hover:text-blue-500 transition">Privacy (DPDP)</Link>
            <Link href="/disclaimer" className="hover:text-blue-500 transition">Disclaimers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
