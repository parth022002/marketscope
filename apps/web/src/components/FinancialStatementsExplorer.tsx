"use client";

import { useEffect, useState } from "react";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { getFinancialStatements, type FinancialStatementsResponse } from "@/lib/api";

type FinancialStatementsExplorerProps = {
  symbol: string;
};

export default function FinancialStatementsExplorer({ symbol }: FinancialStatementsExplorerProps) {
  const [statementType, setStatementType] = useState<"income_statement" | "balance_sheet" | "cash_flow">("income_statement");
  const [periodType, setPeriodType] = useState<"annual" | "quarterly">("annual");
  const [basis, setBasis] = useState<"CONSOLIDATED" | "STANDALONE">("CONSOLIDATED");
  const [data, setData] = useState<FinancialStatementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getFinancialStatements(symbol, statementType, periodType, basis)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load financial statements");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [symbol, statementType, periodType, basis]);

  return (
    <div className="rounded-2xl bg-[#0B1D38] border border-[#132B4F] p-6 text-[#E0E6ED] shadow-xl">
      {/* Top Header & Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#132B4F]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#16C8D5] font-semibold flex items-center gap-1.5">
            <FileSpreadsheet size={14} /> Canonical Financial Statements
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {statementType === "income_statement" && "Statement of Profit & Loss (Income Statement)"}
            {statementType === "balance_sheet" && "Statement of Financial Position (Balance Sheet)"}
            {statementType === "cash_flow" && "Statement of Cash Flows"}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
            <span>Currency: INR (Values in ₹ Crores)</span>
            <span>·</span>
            <span className="text-[#39E85B] flex items-center gap-1">
              <CheckCircle2 size={12} /> Standardized Ind AS Regulatory Disclosures
            </span>
          </div>
        </div>

        {/* Controls: Statement Selector, Annual/Quarterly & Basis */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Statement Type Pills */}
          <div className="flex rounded-lg bg-[#07152B] p-1 border border-[#132B4F] text-xs">
            <button
              onClick={() => setStatementType("income_statement")}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statementType === "income_statement" ? "bg-[#087BEE] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              P&L
            </button>
            <button
              onClick={() => setStatementType("balance_sheet")}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statementType === "balance_sheet" ? "bg-[#087BEE] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Balance Sheet
            </button>
            <button
              onClick={() => setStatementType("cash_flow")}
              className={`px-3 py-1.5 rounded-md font-medium transition ${
                statementType === "cash_flow" ? "bg-[#087BEE] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Cash Flow
            </button>
          </div>

          {/* Period Toggle */}
          <div className="flex rounded-lg bg-[#07152B] p-1 border border-[#132B4F] text-xs">
            <button
              onClick={() => setPeriodType("annual")}
              className={`px-2.5 py-1.5 rounded-md font-medium transition ${
                periodType === "annual" ? "bg-[#132B4F] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Annual
            </button>
            <button
              onClick={() => setPeriodType("quarterly")}
              className={`px-2.5 py-1.5 rounded-md font-medium transition ${
                periodType === "quarterly" ? "bg-[#132B4F] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Quarterly
            </button>
          </div>

          {/* Basis Toggle */}
          <div className="flex rounded-lg bg-[#07152B] p-1 border border-[#132B4F] text-xs">
            <button
              onClick={() => setBasis("CONSOLIDATED")}
              className={`px-2.5 py-1.5 rounded-md font-medium transition ${
                basis === "CONSOLIDATED" ? "bg-[#16C8D5] text-black font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              Consolidated
            </button>
            <button
              onClick={() => setBasis("STANDALONE")}
              className={`px-2.5 py-1.5 rounded-md font-medium transition ${
                basis === "STANDALONE" ? "bg-[#16C8D5] text-black font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              Standalone
            </button>
          </div>
        </div>
      </div>

      {/* Table Data Area */}
      {loading && (
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#087BEE] border-t-transparent mb-3" />
          <p className="text-sm">Normalizing financial statement line items...</p>
        </div>
      )}

      {error && (
        <div className="my-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-[#F06464] text-sm">
          {error}
        </div>
      )}

      {data && !loading && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-[#132B4F] bg-[#07152B]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0B1D38] border-b border-[#132B4F] text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">Line Item (Ind AS)</th>
                {data.periods.map((p) => (
                  <th key={p} className="py-3 px-4 text-right font-semibold">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132B4F]/60">
              {data.items.map((item, idx) => {
                const isHighlight =
                  item.line_item.includes("Revenue") ||
                  item.line_item.includes("EBITDA") ||
                  item.line_item.includes("Net Profit") ||
                  item.line_item.includes("Total Assets") ||
                  item.line_item.includes("Total Shareholders") ||
                  item.line_item.includes("Free Cash Flow");

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-[#0B1D38]/60 transition ${
                      isHighlight ? "bg-[#0B1D38]/30 font-semibold text-white" : "text-slate-300"
                    }`}
                  >
                    <td className="py-3 px-4 flex items-center justify-between">
                      <span>{item.line_item}</span>
                      <span className="text-[10px] text-slate-500 font-normal ml-2">₹ Cr</span>
                    </td>

                    {periodType === "annual" ? (
                      <>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-400">
                          {item.fy22 !== undefined && item.fy22 !== null ? item.fy22.toLocaleString("en-IN") : "—"}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                          {item.fy23 !== undefined && item.fy23 !== null ? item.fy23.toLocaleString("en-IN") : "—"}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-white font-bold">
                          {item.fy24 !== undefined && item.fy24 !== null ? item.fy24.toLocaleString("en-IN") : "—"}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                          {item.q1 !== undefined && item.q1 !== null ? item.q1.toLocaleString("en-IN") : "—"}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                          {item.q2 !== undefined && item.q2 !== null ? item.q2.toLocaleString("en-IN") : "—"}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                          {item.q3 !== undefined && item.q3 !== null ? item.q3.toLocaleString("en-IN") : "—"}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-white font-bold">
                          {item.q4 !== undefined && item.q4 !== null ? item.q4.toLocaleString("en-IN") : "—"}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Provenance Note */}
      <div className="mt-4 pt-3 border-t border-[#132B4F]/50 flex items-center justify-between text-[11px] text-slate-400">
        <span>Source: Statutory BSE & NSE Regulatory Filings (Ind AS Compliant)</span>
        <span className="text-[#16C8D5]">Deterministic statement normalization</span>
      </div>
    </div>
  );
}
