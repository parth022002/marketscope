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
    <div className="bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 space-y-4 shadow-xs">
      {/* Header with Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Market Heavyweights &amp; Leaders
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ranked by market capitalization across Indian (NSE/BSE) and Global (NASDAQ/NYSE) listings.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Universe
          </button>
          <button
            onClick={() => setFilter("india")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === "india"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            NSE Bluechips
          </button>
          <button
            onClick={() => setFilter("global")}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              filter === "global"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            US Mega-Caps
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              <th className="pb-3 pl-2">COMPANY</th>
              <th className="pb-3">SECTOR</th>
              <th className="pb-3 text-right">PRICE</th>
              <th className="pb-3 text-right">24H CHANGE</th>
              <th className="pb-3 text-right">MARKET CAP</th>
              <th className="pb-3 text-right">VOLUME</th>
              <th className="pb-3 text-center pr-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60">
            {filtered.map((c) => {
              const isPositive = c.change_pct >= 0;
              return (
                <tr
                  key={c.symbol}
                  className="hover:bg-slate-50 dark:hover:bg-[#10223B]/60 transition group cursor-pointer"
                >
                  <td className="py-3 pl-2">
                    <Link
                      href={`/company/${c.symbol.toLowerCase()}`}
                      className="flex items-center gap-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] flex items-center justify-center font-bold text-[11px] text-slate-800 dark:text-white">
                        {c.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition flex items-center gap-1.5">
                          {c.name}
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-[#071426] text-slate-500 dark:text-slate-400">
                            {c.exchange}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {c.symbol}
                        </div>
                      </div>
                    </Link>
                  </td>

                  <td className="py-3 text-slate-600 dark:text-slate-300 font-mono">
                    {c.sector}
                  </td>

                  <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {c.currency === "INR" ? "₹" : "$"}{c.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 text-right font-mono font-bold tabular-nums">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] ${
                        isPositive
                          ? "text-emerald-600 bg-emerald-500/10"
                          : "text-rose-600 bg-rose-500/10"
                      }`}
                    >
                      {isPositive ? "+" : ""}{c.change_pct.toFixed(2)}%
                    </span>
                  </td>

                  <td className="py-3 text-right font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                    {c.currency === "INR" ? `₹${c.market_cap_cr.toLocaleString("en-IN")} Cr` : `$${(c.market_cap_cr / 1000).toFixed(1)}B`}
                  </td>

                  <td className="py-3 text-right font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {(c.volume / 1000000).toFixed(2)}M
                  </td>

                  <td className="py-3 text-center pr-2">
                    <Link
                      href={`/company/${c.symbol.toLowerCase()}`}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-[#071426] transition"
                      title="Open Interactive Research Dossier"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
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
