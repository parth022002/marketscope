"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getMetricEvidence, type MetricEvidenceDetail } from "@/lib/api";

type EvidenceDrawerProps = {
  instrumentId: string;
  metricId: string | null;
  onClose: () => void;
};

export default function EvidenceDrawer({
  instrumentId,
  metricId,
  onClose,
}: EvidenceDrawerProps) {
  const [detail, setDetail] = useState<MetricEvidenceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!metricId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getMetricEvidence(instrumentId, metricId)
      .then((data) => {
        if (isMounted) setDetail(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Failed to load evidence");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [instrumentId, metricId, onClose]);

  if (!metricId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-xl bg-[#0B1D38] border-l border-[#132B4F] text-[#E0E6ED] h-full overflow-y-auto flex flex-col shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#132B4F]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#16C8D5] font-semibold flex items-center gap-1.5">
              <ShieldCheck size={14} /> Evidence Inspector
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {detail ? detail.label : "Loading Metric Lineage..."}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#132B4F] transition"
            aria-label="Close Inspector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        {loading && (
          <div className="py-16 text-center text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#087BEE] border-t-transparent mb-3" />
            <p className="text-sm">Retrieving regulatory filings & formula inputs...</p>
          </div>
        )}

        {error && (
          <div className="my-6 p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-[#F06464] text-sm">
            {error}
          </div>
        )}

        {detail && !loading && (
          <div className="py-5 space-y-6 flex-1">
            {/* Metric Summary Card */}
            <div className="p-4 rounded-xl bg-[#07152B] border border-[#132B4F] flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wide">Calculated Value</span>
                <div className="text-3xl font-extrabold text-white tabular-nums tracking-tight mt-0.5">
                  {detail.value.toLocaleString("en-IN")}
                  <span className="text-lg font-normal text-slate-300 ml-1">
                    {detail.unit === "%" ? "%" : detail.unit}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">{detail.period}</div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#39E85B]/10 text-[#39E85B] border border-[#39E85B]/30">
                  <CheckCircle2 size={12} /> {detail.quality_status}
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-1.5">
                  Formula ID: {detail.formula_version}
                </div>
              </div>
            </div>

            {/* Formula Expression */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Deterministic Calculation Formula
              </h3>
              <div className="p-3.5 rounded-lg bg-[#07152B] border border-[#132B4F] font-mono text-sm text-[#16C8D5] break-words">
                {detail.formula_expression}
              </div>
            </div>

            {/* Granular Component Inputs */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Underlying Filing Inputs
              </h3>
              <div className="overflow-hidden rounded-xl border border-[#132B4F] bg-[#07152B]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0B1D38] border-b border-[#132B4F] text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3">Component</th>
                      <th className="py-2.5 px-3 text-right">Value</th>
                      <th className="py-2.5 px-3">Filing Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#132B4F]/60">
                    {detail.components.map((comp, idx) => (
                      <tr key={idx} className="hover:bg-[#0B1D38]/50 transition">
                        <td className="py-2.5 px-3 font-medium text-white">{comp.label}</td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-[#39E85B] font-semibold">
                          ₹{comp.value.toLocaleString("en-IN")} {comp.unit.replace("INR ", "")}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-400">{comp.source_filing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regulatory Evidence Citations */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Source Filings & Provenance
              </h3>
              <div className="space-y-3">
                {detail.evidence.map((ev) => (
                  <div
                    key={ev.evidence_id}
                    className="p-4 rounded-xl bg-[#07152B] border border-[#132B4F] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-white text-sm">{ev.source_name}</div>
                      <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-medium bg-[#087BEE]/15 text-[#087BEE] border border-[#087BEE]/30">
                        {ev.source_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{ev.note}</p>
                    <div className="pt-2 border-t border-[#132B4F]/50 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Retrieved: {new Date(ev.retrieved_at).toLocaleString()}</span>
                      <span className="text-[#16C8D5] flex items-center gap-1 cursor-pointer hover:underline">
                        BSE / NSE Archive <ExternalLink size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="pt-4 border-t border-[#132B4F] text-[11px] text-slate-400 flex items-center justify-between">
          <span>MarketScope.io Evidence Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#132B4F] text-slate-200 hover:text-white hover:bg-[#1a3863] text-xs font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
