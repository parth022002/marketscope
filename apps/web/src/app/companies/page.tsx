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
      { symbol: "RELIANCE", name: "Reliance Industries", price: 2942.50, change_pct: 1.45 },
      { symbol: "BPCL", name: "Bharat Petroleum", price: 312.40, change_pct: -0.25 },
      { symbol: "ONGC", name: "Oil & Natural Gas Corp", price: 264.80, change_pct: 0.85 },
    ],
  },
  {
    name: "Banking & Financial Services",
    companiesCount: 18,
    totalCapCr: 4890000,
    leaders: [
      { symbol: "HDFCBANK", name: "HDFC Bank Ltd", price: 1748.20, change_pct: 0.82 },
      { symbol: "ICICIBANK", name: "ICICI Bank Ltd", price: 1264.40, change_pct: 1.12 },
      { symbol: "SBIN", name: "State Bank of India", price: 824.15, change_pct: 0.65 },
    ],
  },
  {
    name: "Information Technology",
    companiesCount: 14,
    totalCapCr: 3420000,
    leaders: [
      { symbol: "TCS", name: "Tata Consultancy Services", price: 4125.80, change_pct: -0.38 },
      { symbol: "INFY", name: "Infosys Ltd", price: 1874.15, change_pct: -0.62 },
      { symbol: "WIPRO", name: "Wipro Ltd", price: 564.20, change_pct: 0.15 },
    ],
  },
  {
    name: "Automobile & Auto Components",
    companiesCount: 10,
    totalCapCr: 1420000,
    leaders: [
      { symbol: "TATAMOTORS", name: "Tata Motors Ltd", price: 812.30, change_pct: 2.15 },
      { symbol: "M&M", name: "Mahindra & Mahindra", price: 2980.00, change_pct: 1.40 },
      { symbol: "MARUTI", name: "Maruti Suzuki India", price: 11420.00, change_pct: 0.45 },
    ],
  },
  {
    name: "Global Technology & AI",
    companiesCount: 15,
    totalCapCr: 14500000,
    leaders: [
      { symbol: "NVDA", name: "NVIDIA Corp", price: 146.50, change_pct: 2.85, currency: "USD" },
      { symbol: "AAPL", name: "Apple Inc.", price: 228.40, change_pct: 0.42, currency: "USD" },
      { symbol: "MSFT", name: "Microsoft Corp", price: 424.10, change_pct: 0.74, currency: "USD" },
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
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              <Building2 size={14} /> Taxonomy &amp; Industry Classification
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Company Directory by Sector
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
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
              className="w-full bg-[#0B1930] border border-[#162C4E] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition shadow-inner font-sans"
            />
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSectors.map((sector) => (
            <div
              key={sector.name}
              className="p-5 rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-4 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#162C4E]">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers size={16} className="text-blue-500" /> {sector.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
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
                        className="p-3 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-blue-500/50 hover:bg-[#10223B] transition flex items-center justify-between text-xs group"
                      >
                        <div>
                          <strong className="text-white group-hover:text-cyan-400 transition">
                            {co.symbol}
                          </strong>
                          <span className="text-slate-400 text-[11px] ml-2">{co.name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white tabular-nums">
                            {isUsd ? "$" : "₹"}
                            {co.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span
                            className={`font-mono text-[11px] font-bold ${
                              isPositive ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {co.change_pct.toFixed(2)}%
                          </span>
                          <ChevronRight size={14} className="text-slate-500 group-hover:text-white transition" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/screener"
                  className="text-xs font-semibold text-blue-400 hover:text-cyan-400 inline-flex items-center gap-1 transition"
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
