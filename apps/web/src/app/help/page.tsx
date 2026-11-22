"use client";

import Link from "next/link";
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  ShieldCheck,
  Search,
  ExternalLink,
  Command,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const KEYBOARD_SHORTCUTS = [
  { key: "⌘K / Ctrl+K", action: "Open Global Search & Command Palette" },
  { key: "Esc", action: "Close modals, drawers, and search palette" },
  { key: "1D, 1W, 1M", action: "Change active timeframe on charts" },
  { key: "Alt+C", action: "Navigate directly to Interactive Charts" },
  { key: "Alt+S", action: "Navigate directly to Stock Screener" },
];

const GLOSSARY_TERMS = [
  { term: "P/E Ratio (Price-to-Earnings)", desc: "Current market price divided by trailing twelve months (TTM) earnings per share. Measures valuation relative to earnings." },
  { term: "ROE (Return on Equity)", desc: "Net income divided by shareholders' equity. Indicates how efficiently management generates profit from equity capital." },
  { term: "ROCE (Return on Capital Employed)", desc: "Operating profit (EBIT) divided by total capital employed (Equity + Debt). Measures capital allocation across all providers." },
  { term: "Free Cash Flow (FCF)", desc: "Operating cash flow minus capital expenditures (CapEx). Represents cash available for reinvestment, debt repayment, or dividends." },
  { term: "Beta", desc: "Volatility of an instrument relative to the broader benchmark market (e.g. Nifty 50 or S&P 500). Beta > 1 implies higher sensitivity." },
  { term: "Value at Risk (VaR)", desc: "Statistical estimate of the maximum expected loss over a specific time horizon at a given confidence level (e.g. 95% 1-day VaR)." },
];

export default function HelpPage() {
  return (
    <NavigationShell activePath="/help">
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">Help Centre & Platform Guide</h1>
          </div>
          <p className="text-xs text-slate-400">
            Documentation, keyboard shortcuts, financial metric formulas, and verified data provenance explanations.
          </p>
        </div>

        {/* Keyboard Shortcuts Table */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-sky-400" /> Global Keyboard Shortcuts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {KEYBOARD_SHORTCUTS.map((s) => (
              <div key={s.key} className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-300">{s.action}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-400 font-bold">
                  {s.key}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 15 Golden Metrics Glossary */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" /> Financial Terminology Glossary
          </h2>
          <div className="space-y-3 text-xs divide-y divide-slate-800/60">
            {GLOSSARY_TERMS.map((g) => (
              <div key={g.term} className="pt-3 first:pt-0">
                <p className="font-bold text-slate-100 text-xs">{g.term}</p>
                <p className="text-slate-400 mt-1 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Reference Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/privacy-security-trust"
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <p className="font-semibold text-slate-200">Security & Trust Disclosures</p>
              <p className="text-slate-400 mt-0.5">Learn about data verification, encryption, and non-custodial boundaries.</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </Link>

          <Link
            href="/licenses"
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/40 transition-colors flex items-center justify-between text-xs"
          >
            <div>
              <p className="font-semibold text-slate-200">Software Licensing & SBOM</p>
              <p className="text-slate-400 mt-0.5">Explore our open-source dependencies and CycloneDX compliance catalog.</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </Link>
        </div>
      </div>
    </NavigationShell>
  );
}
