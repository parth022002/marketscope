"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, FileText, ExternalLink } from "lucide-react";
import { getAISynthesis, requestAISynthesis, type AISynthesis } from "@/lib/api";

interface AISynthesisPanelProps {
  symbol: string;
  companyName: string;
}

export default function AISynthesisPanel({ symbol, companyName }: AISynthesisPanelProps) {
  const [synthesis, setSynthesis] = useState<AISynthesis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customFocus, setCustomFocus] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const loadSynthesis = async (focus?: string) => {
    try {
      if (focus) {
        setIsRegenerating(true);
        const data = await requestAISynthesis(symbol, focus, "auto");
        setSynthesis(data);
      } else {
        setLoading(true);
        const data = await getAISynthesis(symbol);
        setSynthesis(data);
      }
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load AI research synthesis.");
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  };

  useEffect(() => {
    loadSynthesis();
  }, [symbol]);

  if (loading) {
    return (
      <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-8 text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#16C8D5] border-t-transparent mb-2" />
        <h3 className="text-sm font-semibold text-white">Synthesizing Audited Financial Statements...</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Executing strict RAG citation grounding over canonical Ind AS filings, deterministic valuation ratios, and regulatory statements.
        </p>
      </div>
    );
  }

  if (error || !synthesis) {
    return (
      <div className="card bg-[#0B1D38] border border-red-900/40 rounded-xl p-6 text-center space-y-3">
        <ShieldAlert className="mx-auto text-red-400" size={32} />
        <h3 className="text-base font-bold text-white">AI Synthesis Offline</h3>
        <p className="text-xs text-slate-400">{error || "Unable to retrieve analytical synthesis."}</p>
        <button
          onClick={() => loadSynthesis()}
          className="px-4 py-2 bg-[#087BEE] hover:bg-[#0769cc] text-white text-xs font-semibold rounded-lg transition"
        >
          Retry Synthesis
        </button>
      </div>
    );
  }

  if (synthesis.status === "ABSTAINED") {
    return (
      <div className="card bg-[#0B1D38] border border-amber-900/40 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-sm font-bold text-amber-200">Synthesis Abstained (Gated Safeguard)</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {synthesis.executive_summary}
            </p>
            <div className="mt-3 text-[11px] text-slate-400 border-t border-[#132B4F] pt-3">
              MarketScope.io policy mandates that all AI research models strictly abstain from formulating qualitative synthesis when verified audited financial statements are missing.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-5 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-gradient-to-r from-[#087BEE]/20 to-[#16C8D5]/20 text-[#16C8D5] border border-[#16C8D5]/30">
                GATED AI RESEARCH SYNTHESIS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#39E85B]/10 text-[#39E85B] border border-[#39E85B]/30 flex items-center gap-1">
                <CheckCircle2 size={11} /> {Math.round(synthesis.grounding_score * 100)}% Fact Grounded
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Model: {synthesis.model_used}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white pt-1">
              Fundamental Intelligence Synthesis for {companyName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Focus topic (e.g. Margin resilience, FCF)..."
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              className="px-3 py-1.5 bg-[#07152B] border border-[#132B4F] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#087BEE]"
            />
            <button
              onClick={() => loadSynthesis(customFocus)}
              disabled={isRegenerating}
              className="px-3 py-1.5 bg-[#087BEE] hover:bg-[#0769cc] disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <RefreshCw size={12} className={isRegenerating ? "animate-spin" : ""} />
              {isRegenerating ? "Re-synthesizing..." : "Re-synthesize"}
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-4 p-4 rounded-lg bg-[#07152B]/60 border border-[#132B4F] text-slate-200 text-sm leading-relaxed">
          {synthesis.executive_summary}
        </div>
      </div>

      {/* Strengths & Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fundamental Strengths */}
        <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#39E85B] text-sm font-bold">
            <CheckCircle2 size={16} /> Key Fundamental Strengths
          </div>
          <div className="space-y-2">
            {synthesis.key_fundamental_strengths.map((str, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#07152B]/50 border border-[#132B4F] text-xs text-slate-300 leading-relaxed">
                {str}
              </div>
            ))}
          </div>
        </div>

        {/* Fundamental Risks */}
        <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <AlertTriangle size={16} /> Key Fundamental Risks
          </div>
          <div className="space-y-2">
            {synthesis.key_fundamental_risks.map((risk, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#07152B]/50 border border-[#132B4F] text-xs text-slate-300 leading-relaxed">
                {risk}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Valuation & Solvency Assessment */}
      <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-5 space-y-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles size={14} className="text-[#16C8D5]" /> Valuation & Solvency Assessment
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          {synthesis.valuation_and_solvency_assessment}
        </p>
      </div>

      {/* Mandatory Citations Table */}
      <div className="card bg-[#0B1D38] border border-[#132B4F] rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText size={14} className="text-[#087BEE]" /> Verified Lineage Citations ({synthesis.citations.length})
          </h3>
          <span className="text-[11px] text-slate-400">Audit Provenance Mandated by MOD-17</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#132B4F] text-slate-400">
                <th className="py-2 px-3">Citation ID</th>
                <th className="py-2 px-3">Fact / Metric Ratio</th>
                <th className="py-2 px-3">Period</th>
                <th className="py-2 px-3">Verified Value</th>
                <th className="py-2 px-3">Source Lineage / Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132B4F]/60">
              {synthesis.citations.map((c) => (
                <tr key={c.citation_id} className="hover:bg-[#07152B]/40">
                  <td className="py-2 px-3 font-mono text-[#16C8D5] text-[11px]">{c.citation_id}</td>
                  <td className="py-2 px-3 font-semibold text-white">{c.fact_or_ratio}</td>
                  <td className="py-2 px-3 text-slate-300">{c.period}</td>
                  <td className="py-2 px-3 font-mono tabular-nums text-[#39E85B] font-bold">{c.value}</td>
                  <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{c.source_formula_or_filing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Disclaimer Box */}
      <div className="p-4 rounded-xl bg-[#0B1D38] border border-amber-900/40 text-amber-200/90 text-[11px] leading-relaxed">
        {synthesis.disclaimer}
      </div>
    </div>
  );
}
