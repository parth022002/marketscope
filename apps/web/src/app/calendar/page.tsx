"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Globe,
  AlertCircle,
  Building2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import { getCalendarEvents, type CalendarEvent } from "@/lib/api";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCalendarEvents(eventTypeFilter === "all" ? undefined : eventTypeFilter)
      .then((data) => setEvents(data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [eventTypeFilter]);

  const getImportanceBadge = (imp: string) => {
    switch (imp) {
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
            HIGH IMPACT
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#071426] text-slate-400 border border-[#162C4E]">
            LOW
          </span>
        );
    }
  };

  return (
    <NavigationShell activePath="/calendar">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              <Calendar size={14} /> Schedule &amp; Catalysts
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Economic &amp; Corporate Events Calendar
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
              Track upcoming central bank rate decisions, macroeconomic inflation indicators, and quarterly corporate earnings announcements.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Catalysts" },
            { id: "MACRO", label: "Macro & Central Banks" },
            { id: "EARNINGS", label: "Corporate Earnings" },
            { id: "CORPORATE_ACTION", label: "Corporate Actions & AGMs" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setEventTypeFilter(btn.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                eventTypeFilter === btn.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-[#0B1930] text-slate-300 hover:text-white border border-[#162C4E]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Events Table / Cards */}
        <div className="space-y-3.5">
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-3" />
              Loading institutional catalyst timeline...
            </div>
          ) : events.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-xs bg-[#0B1930] border border-[#162C4E] rounded-2xl">
              No calendar events scheduled under this filter.
            </div>
          ) : (
            events.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] hover:border-blue-500/50 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-sm hover:shadow-lg"
              >
                {/* Event Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getImportanceBadge(item.importance)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071426] text-slate-300 border border-[#162C4E]">
                      {item.country}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(item.event_date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-white">{item.title}</h3>

                  {item.notes && <p className="text-slate-300 text-[11px] font-sans leading-relaxed">{item.notes}</p>}
                </div>

                {/* Quantitative Details */}
                <div className="flex items-center gap-4 text-xs font-mono pt-3 md:pt-0 border-t md:border-t-0 border-[#162C4E]">
                  {item.forecast && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Forecast</span>
                      <span className="font-bold text-white">{item.forecast}</span>
                    </div>
                  )}

                  {item.previous && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Previous</span>
                      <span className="text-slate-400">{item.previous}</span>
                    </div>
                  )}

                  {item.actual && (
                    <div className="text-right pl-3 border-l border-[#162C4E]">
                      <span className="text-[10px] text-slate-400 block uppercase">Actual</span>
                      <span className="font-bold text-emerald-400">{item.actual}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </NavigationShell>
  );
}
