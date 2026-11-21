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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F06464]/20 text-[#F06464] border border-[#F06464]/40">
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
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#102547] text-slate-400">
            LOW
          </span>
        );
    }
  };

  return (
    <NavigationShell activePath="/calendar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#132B4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-[#16C8D5] uppercase">
              <Calendar size={14} /> Schedule &amp; Catalysts
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
              Economic &amp; Corporate Events Calendar
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                eventTypeFilter === btn.id
                  ? "bg-[#087BEE] text-white"
                  : "bg-[#0B1D38] text-slate-300 hover:text-white border border-[#132B4F]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Events Table / Cards */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Loading calendar catalysts...
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs bg-[#0B1D38] border border-[#132B4F] rounded-2xl">
              No calendar events scheduled under this filter.
            </div>
          ) : (
            events.map((item) => (
              <div
                key={item.id}
                className="p-4 md:p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] hover:border-[#087BEE]/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                {/* Event Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getImportanceBadge(item.importance)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#07152B] text-slate-300 border border-[#132B4F]">
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

                  <h3 className="text-sm font-bold text-white">{item.title}</h3>

                  {item.notes && <p className="text-slate-400 text-[11px]">{item.notes}</p>}
                </div>

                {/* Quantitative Details */}
                <div className="flex items-center gap-4 text-xs font-mono pt-2 md:pt-0 border-t md:border-t-0 border-[#132B4F]">
                  {item.forecast && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase">Forecast</span>
                      <span className="font-bold text-white">{item.forecast}</span>
                    </div>
                  )}

                  {item.previous && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase">Previous</span>
                      <span className="text-slate-400">{item.previous}</span>
                    </div>
                  )}

                  {item.actual && (
                    <div className="text-right pl-3 border-l border-[#132B4F]">
                      <span className="text-[10px] text-slate-500 block uppercase">Actual</span>
                      <span className="font-bold text-[#39E85B]">{item.actual}</span>
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
