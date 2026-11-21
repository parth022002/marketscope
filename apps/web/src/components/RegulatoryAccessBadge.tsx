"use client";

import React, { useState } from "react";
import { ShieldCheck, Globe, AlertCircle, Info, Landmark, Lock, ExternalLink } from "lucide-react";

interface RegulatoryAccessBadgeProps {
  status: string;
  badgeText?: string;
  framework?: string;
  permittedRoute?: string;
  conditions?: string[];
  disclaimer?: string;
  showModal?: boolean;
}

export default function RegulatoryAccessBadge({
  status,
  badgeText,
  framework,
  permittedRoute,
  conditions,
  disclaimer,
  showModal = true,
}: RegulatoryAccessBadgeProps) {
  const [open, setOpen] = useState(false);

  const getBadgeConfig = () => {
    switch (status) {
      case "DOMESTIC_ACCESS":
        return {
          bg: "bg-emerald-500/10 hover:bg-emerald-500/20",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          icon: ShieldCheck,
          defaultLabel: "Domestic Direct Access",
        };
      case "INTERNATIONAL_ACCESS_SUBJECT_TO_LRS":
        return {
          bg: "bg-blue-500/10 hover:bg-blue-500/20",
          border: "border-blue-500/30",
          text: "text-blue-400",
          icon: Globe,
          defaultLabel: "LRS Permitted (USD 250k/FY)",
        };
      case "ACCESS_VIA_IFSC_ROUTE":
        return {
          bg: "bg-purple-500/10 hover:bg-purple-500/20",
          border: "border-purple-500/30",
          text: "text-purple-400",
          icon: Landmark,
          defaultLabel: "GIFT City IFSC Route",
        };
      case "ACCESS_VIA_DOMESTIC_FUND":
        return {
          bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
          border: "border-cyan-500/30",
          text: "text-cyan-400",
          icon: Info,
          defaultLabel: "Domestic Fund / Feeder",
        };
      case "ACCESS_SUBJECT_TO_INTERMEDIARY":
        return {
          bg: "bg-amber-500/10 hover:bg-amber-500/20",
          border: "border-amber-500/30",
          text: "text-amber-400",
          icon: AlertCircle,
          defaultLabel: "Regulated Intermediary Route",
        };
      case "RESEARCH_ONLY":
        return {
          bg: "bg-rose-500/10 hover:bg-rose-500/20",
          border: "border-rose-500/30",
          text: "text-rose-400",
          icon: Lock,
          defaultLabel: "Research Only (FEMA Restricted)",
        };
      default:
        return {
          bg: "bg-slate-500/10 hover:bg-slate-500/20",
          border: "border-slate-500/30",
          text: "text-slate-400",
          icon: AlertCircle,
          defaultLabel: "Restricted / Unverified",
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;
  const label = badgeText || config.defaultLabel;

  return (
    <>
      <button
        type="button"
        onClick={() => showModal && setOpen(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${config.bg} ${config.border} ${config.text}`}
        title="Click to view Resident Indian regulatory investment eligibility rules"
      >
        <IconComponent size={13} className="shrink-0" />
        <span className="truncate max-w-[200px]">{label}</span>
      </button>

      {/* Regulatory Details Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B1528] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <IconComponent className={config.text} size={20} />
                <h3 className="text-base font-bold text-white">
                  Resident Indian Regulatory Access
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Classification Status:</span>
                <span className={`font-bold font-mono px-2 py-0.5 rounded ${config.bg} ${config.text}`}>
                  {status}
                </span>
              </div>

              {framework && (
                <div className="text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Governing Framework:</span>
                  <p className="text-slate-200 bg-[#060D1B] p-2.5 rounded-lg border border-[#162544] font-mono text-[11px]">
                    {framework}
                  </p>
                </div>
              )}

              {permittedRoute && (
                <div className="text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Permitted Legal Route:</span>
                  <p className="text-slate-200 bg-[#060D1B] p-2.5 rounded-lg border border-[#162544]">
                    {permittedRoute}
                  </p>
                </div>
              )}

              {conditions && conditions.length > 0 && (
                <div className="text-xs space-y-1">
                  <span className="text-slate-400 font-medium block">Key Regulatory Conditions:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 bg-[#060D1B] p-3 rounded-lg border border-[#162544] text-[11px]">
                    {conditions.map((cond, idx) => (
                      <li key={idx} className="leading-relaxed">{cond}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-[11px] text-amber-300/90 leading-relaxed">
                <span className="font-bold block mb-0.5">Non-Brokerage Research Notice:</span>
                {disclaimer || "MarketScope.io is an independent market intelligence platform. This classification is provided for educational and analytical purposes under Indian regulations (RBI LRS, FEMA, SEBI, IFSCA). MarketScope does not execute trades or hold client funds."}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
