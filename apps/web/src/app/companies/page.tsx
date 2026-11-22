"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const SECTORS_DATA = [
  {
    name: "Energy & Oil",
    companiesCount: 12,
    totalCapCr: 2650000,
    leaders: [
      { symbol: "RELIANCE", name: "Reliance Industries", price: 1377.50, change_pct: 0.14 },
      { symbol: "BPCL", name: "Bharat Petroleum", price: 312.40, change_pct: -0.25 },
      { symbol: "ONGC", name: "Oil & Natural Gas Corp", price: 264.80, change_pct: 0.85 },
    ],
  },
  {
    name: "Banking & Financial Services",
    companiesCount: 18,
    totalCapCr: 4890000,
    leaders: [
      { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 846.00, change_pct: 2.94 },
      { symbol: "ICICIBANK", name: "ICICI Bank Ltd", price: 1640.00, change_pct: 1.93 },
      { symbol: "SBIN", name: "State Bank of India", price: 824.15, change_pct: 0.65 },
    ],
  },
  {
    name: "Information Technology",
    companiesCount: 14,
    totalCapCr: 3420000,
    leaders: [
      { symbol: "TCS", name: "Tata Consultancy Services", price: 2376.20, change_pct: 1.43 },
      { symbol: "INFY", name: "Infosys Ltd", price: 1098.00, change_pct: 0.56 },
      { symbol: "WIPRO", name: "Wipro Ltd", price: 564.20, change_pct: 0.15 },
    ],
  },
  {
    name: "Automobile & Auto Components",
    companiesCount: 10,
    totalCapCr: 1420000,
    leaders: [
      { symbol: "TATAMOTORS", name: "Tata Motors Ltd", price: 742.50, change_pct: 0.85 },
      { symbol: "M&M", name: "Mahindra & Mahindra", price: 2980.00, change_pct: 1.40 },
      { symbol: "MARUTI", name: "Maruti Suzuki India", price: 11420.00, change_pct: 0.45 },
    ],
  },
  {
    name: "Global Technology & AI",
    companiesCount: 15,
    totalCapCr: 14500000,
    leaders: [
      { symbol: "NVDA", name: "NVIDIA Corp", price: 125.53, change_pct: -13.93, currency: "USD" },
      { symbol: "AAPL", name: "Apple Inc.", price: 342.56, change_pct: -2.40, currency: "USD" },
      { symbol: "MSFT", name: "Microsoft Corp", price: 484.52, change_pct: -2.58, currency: "USD" },
    ],
  },
];

export default function CompaniesDirectoryPage() {
  const [search, setSearch] = useState("");

  const filteredSectors = SECTORS_DATA.filter((sec) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      sec.name.toLowerCase().includes(term) ||
      sec.leaders.some(
        (l) => l.symbol.toLowerCase().includes(term) || l.name.toLowerCase().includes(term)
      )
    );
  });

  return (
    <NavigationShell activePath="/companies">
      <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-500 dark:text-cyan-400 uppercase">
              <Building2 size={14} /> Taxonomy &amp; Industry Classification
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Company Directory by Sector
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
              Explore companies categorized by macroeconomic sector, capital scale, and competitive peer groupings across Indian and global capital markets.
            </p>
          </div>

          <div className="relative min-w-[260px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sector or company..."
              className="w-full bg-slate-50 dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition shadow-inner font-sans"
            />
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSectors.map((sector) => (
            <div
              key={sector.name}
              className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-4 flex flex-col justify-between shadow-sm dark:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#162C4E]">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={16} className="text-blue-500" /> {sector.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {sector.companiesCount} Constituents
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {sector.leaders.map((co) => {
                    const isPositive = co.change_pct >= 0;
                    const isUsd = (co as any).currency === "USD";

                    return (
                      <Link
                        key={co.symbol}
                        href={`/company/${co.symbol.toLowerCase()}`}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-[#10223B] transition flex items-center justify-between text-xs group"
                      >
                        <div>
                          <strong className="text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition font-mono">
                            {co.symbol}
                          </strong>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-2">{co.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                            {isUsd ? "$" : "₹"}
                            {co.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {co.change_pct.toFixed(2)}%
                          </span>
                          <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/screener"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-cyan-600 dark:hover:text-cyan-400 inline-flex items-center gap-1 transition"
                >
                  Screen this Sector <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NavigationShell>
  );
}
