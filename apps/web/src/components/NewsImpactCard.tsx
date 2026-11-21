"use client";

import { type NewsItem } from "@/lib/api";
import { GitCommit, Activity, ShieldAlert, ArrowRightCircle, CheckCircle2 } from "lucide-react";

interface NewsImpactCardProps {
  news: NewsItem;
}

export default function NewsImpactCard({ news }: NewsImpactCardProps) {
  if (!news.transmission_channels || news.transmission_channels.length === 0) {
    return null;
  }

  return (
    <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#16C8D5]/30 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#132B4F]">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-[#16C8D5]" />
          <h3 className="text-sm font-bold text-white">Market Transmission Channels &amp; Impact Analysis</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#16C8D5]/15 text-[#16C8D5] border border-[#16C8D5]/30">
          IMPACT MODEL ACTIVE
        </span>
      </div>

      {/* Affected Assets Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-[#07152B] border border-[#132B4F]">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5">
            Directly Affected Instruments
          </span>
          <div className="flex flex-wrap gap-1.5">
            {news.affected_instruments?.map((inst) => (
              <span
                key={inst}
                className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#102547] text-white border border-[#132B4F]"
              >
                {inst}
              </span>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#07152B] border border-[#132B4F]">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5">
            Affected Sectors &amp; Supply Chains
          </span>
          <div className="flex flex-wrap gap-1.5">
            {news.affected_sectors?.map((sec) => (
              <span
                key={sec}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#102547] text-slate-300 border border-[#132B4F]"
              >
                {sec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Transmission Flow List */}
      <div className="space-y-2.5 pt-2">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
          Macroeconomic Causal Flow
        </span>

        {news.transmission_channels.map((ch, idx) => {
          const isConfirmed = ch.impact_type === "confirmed";

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                isConfirmed
                  ? "bg-[#07152B] border-[#132B4F]"
                  : "bg-[#07152B]/60 border-dashed border-[#132B4F]"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isConfirmed ? (
                  <CheckCircle2 size={15} className="text-[#39E85B]" />
                ) : (
                  <ArrowRightCircle size={15} className="text-amber-400" />
                )}
              </div>

              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-white font-semibold">{ch.channel}</strong>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                      isConfirmed
                        ? "bg-[#39E85B]/15 text-[#39E85B]"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {isConfirmed ? "Confirmed" : "Market Implication"}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{ch.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
