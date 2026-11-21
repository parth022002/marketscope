"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, TrendingDown, BookOpen, Newspaper } from "lucide-react";
import { type TopCompanyItem } from "@/lib/api";

interface TopCompaniesTableProps {
  companies: TopCompanyItem[];
}

export default function TopCompaniesTable({ companies }: TopCompaniesTableProps) {
  const [filter, setFilter] = useState<"all" | "india" | "global">("all");

  const filtered = companies.filter((c) => {
    if (filter === "india") return !c.is_global;
    if (filter === "global") return c.is_global;
    return true;
  });

  return (
    <div className="bg-[#0B1930] border border-[#162C4E] rounded-2xl p-5 space-y-4">
      {/* Header with Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#162C4E]">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">
            Market Heavyweights &amp; Leaders
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by market capitalization across Indian (NSE/BSE) and Global (NASDAQ/NYSE) listings.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#071426] border border-[#162C4E] p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === "all" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            All Universe
          </button>
          <button
            onClick={() => setFilter("india")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === "india" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            NSE Bluechips
          </button>
          <button
            onClick={() => setFilter("global")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === "global" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            US Tech / Mega-Caps
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#162C4E] text-slate-400 font-mono text-[11px]">
              <th className="pb-3 pl-2">COMPANY</th>
              <th className="pb-3">SECTOR</th>
              <th className="pb-3 text-right">PRICE</th>
              <th className="pb-3 text-right">24H CHANGE</th>
              <th className="pb-3 text-right">MARKET CAP</th>
              <th className="pb-3 text-right">VOLUME</th>
              <th className="pb-3 text-center pr-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#162C4E]/60">
            {filtered.map((c) => {
              const isPositive = c.change_pct >= 0;
              return (
                <tr
                  key={c.symbol}
                  className="hover:bg-[#10223B]/60 transition group cursor-pointer"
                >
                  <td className="py-3 pl-2">
                    <Link
                      href={`/company/${c.symbol.toLowerCase()}`}
                      className="flex items-center gap-2 group-hover:text-cyan-400 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#071426] border border-[#162C4E] flex items-center justify-center font-bold text-[11px] text-white">
                        {c.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-400 transition flex items-center gap-1.5">
                          {c.name}
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#071426] text-slate-400">
                            {c.exchange}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {c.symbol}
                        </div>
                      </div>
                    </Link>
                  </td>

                  <td className="py-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#071426] text-slate-300 border border-[#162C4E]">
                      {c.sector}
                    </span>
                  </td>

                  <td className="py-3 text-right font-mono font-bold text-white tabular-nums">
                    {c.currency === "INR" ? "₹" : "$"}
                    {c.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                        isPositive
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {isPositive ? "+" : ""}
                      {c.change_pct.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-3 text-right font-mono text-slate-300 tabular-nums">
                    {c.currency === "INR" ? `₹${c.market_cap_cr.toLocaleString("en-IN")} Cr` : `$${c.market_cap_cr.toLocaleString("en-US")} B`}
                  </td>

                  <td className="py-3 text-right font-mono text-slate-400 tabular-nums">
                    {(c.volume / 1000000).toFixed(1)}M
                  </td>

                  <td className="py-3 text-center pr-2">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/company/${c.symbol.toLowerCase()}`}
                        title="View Research Dossier"
                        className="p-1.5 rounded-lg bg-[#071426] hover:bg-blue-600 text-slate-400 hover:text-white transition"
                      >
                        <BookOpen size={13} />
                      </Link>
                      <Link
                        href={`/news?symbol=${c.symbol}`}
                        title="Search Company News"
                        className="p-1.5 rounded-lg bg-[#071426] hover:bg-cyan-600 text-slate-400 hover:text-white transition"
                      >
                        <Newspaper size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
