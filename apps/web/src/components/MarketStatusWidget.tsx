"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Globe,
  Clock,
  ChevronDown,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { getGlobalMarketStatus, type GlobalMarketStatusSummary, type MarketSessionInfo } from "@/lib/api";

export default function MarketStatusWidget() {
  const [summary, setSummary] = useState<GlobalMarketStatusSummary | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const fetchStatus = () => {
      getGlobalMarketStatus()
        .then((data) => {
          if (mounted) {
            setSummary(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30s live refresh
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const nseSession = summary?.markets.find((m) => m.market_id === "NSE");
  const nyseSession = summary?.markets.find((m) => m.market_id === "NYSE");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return {
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400 animate-pulse",
          label: "OPEN",
        };
      case "PRE_MARKET":
        return {
          bg: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          dot: "bg-amber-400 animate-pulse",
          label: "PRE-MARKET",
        };
      case "BREAK":
        return {
          bg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
          dot: "bg-blue-400",
          label: "LUNCH BREAK",
        };
      case "HOLIDAY":
        return {
          bg: "bg-rose-500/15 text-rose-300 border-rose-500/30",
          dot: "bg-rose-400",
          label: "HOLIDAY",
        };
      case "SPECIAL_SESSION":
        return {
          bg: "bg-purple-500/15 text-purple-300 border-purple-500/30",
          dot: "bg-purple-400 animate-ping",
          label: "SPECIAL SESSION",
        };
      default:
        return {
          bg: "bg-slate-800 text-slate-400 border-slate-700",
          dot: "bg-slate-500",
          label: "CLOSED",
        };
    }
  };

  const nseBadge = getStatusBadge(nseSession?.status || "CLOSED");

  return (
    <div className="relative" ref={widgetRef}>
      {/* Trigger Button in Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-800/80 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800/60 transition-colors text-xs"
        title="View live global exchange status and calendar"
        aria-expanded={isOpen}
      >
        <span className={`w-2 h-2 rounded-full ${nseBadge.dot}`} />
        <span className="font-mono font-bold text-slate-200">
          NSE: <span className={nseBadge.label === "OPEN" ? "text-emerald-400" : "text-slate-400"}>{nseBadge.label}</span>
        </span>
        <span className="text-slate-500 font-mono hidden sm:inline">|</span>
        <span className="font-mono text-slate-400 hidden sm:inline">
          NYSE: {nyseSession?.status === "OPEN" ? <span className="text-emerald-400">OPEN</span> : "CLOSED"}
        </span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#091120] border border-slate-700/80 shadow-2xl z-50 p-4 text-xs space-y-3.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-sky-400" />
              <span className="font-bold text-slate-100">Global Exchange Status</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {summary ? summary.summary_label : "Updating..."}
            </span>
          </div>

          {/* Markets List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {summary?.markets.slice(0, 6).map((m: MarketSessionInfo) => {
              const badge = getStatusBadge(m.status);
              return (
                <div
                  key={m.market_id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/70 border border-slate-800/60 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{m.exchange}</span>
                      <span className="text-[10px] text-slate-500 font-sans">({m.country})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <Clock size={11} className="text-slate-500" />
                      <span>{m.current_local_time}</span>
                      <span className="text-slate-600">·</span>
                      <span>{m.session_start_local}–{m.session_end_local}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1.5 ${badge.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Holiday Alert if any today */}
          {summary?.today_holidays && summary.today_holidays.length > 0 && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Calendar size={13} /> Today&apos;s Market Holiday:
              </span>
              <p className="text-[10px] text-slate-300">
                {summary.today_holidays[0].exchange}: {summary.today_holidays[0].event_name} ({summary.today_holidays[0].category})
              </p>
            </div>
          )}

          {/* Bottom Link to Full Calendar */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
              <ShieldCheck size={11} className="text-emerald-400" /> Real-time rules
            </span>
            <Link
              href="/calendar"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
            >
              Open Full Calendar
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
