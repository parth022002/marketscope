"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Globe,
  AlertCircle,
  Building2,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Bell,
  Sliders,
  CalendarDays,
  Activity,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getGlobalCalendarEvents,
  getGlobalMarketStatus,
  getCalendarHolidays,
  getMarketHoursDirectory,
  type CalendarEventRecord,
  type GlobalMarketStatusSummary,
  type CalendarHolidayRecord,
  type ExchangeMarketHours,
  type MarketSessionInfo,
} from "@/lib/api";

type TabType = "catalysts" | "hours" | "holidays" | "preferences";

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<TabType>("catalysts");

  // Tab 1: Catalysts state
  const [events, setEvents] = useState<CalendarEventRecord[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [importanceFilter, setImportanceFilter] = useState<string>("all");
  const [catalystsLoading, setCatalystsLoading] = useState(true);

  // Tab 2: Market Hours & Status state
  const [marketStatus, setMarketStatus] = useState<GlobalMarketStatusSummary | null>(null);
  const [hoursDirectory, setHoursDirectory] = useState<ExchangeMarketHours[]>([]);
  const [statusLoading, setStatusLoading] = useState(true);

  // Tab 3: Holidays state
  const [holidays, setHolidays] = useState<CalendarHolidayRecord[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [holidaysLoading, setHolidaysLoading] = useState(true);

  // Tab 4: Preferences state
  const [preferredTz, setPreferredTz] = useState<string>("Asia/Kolkata");
  const [timeFormat24, setTimeFormat24] = useState<boolean>(false);
  const [notifyHighImpact, setNotifyHighImpact] = useState<boolean>(true);
  const [primaryExchange, setPrimaryExchange] = useState<string>("NSE");
  const [preferencesSaved, setPreferencesSaved] = useState<boolean>(false);

  // Fetch Catalysts
  useEffect(() => {
    setCatalystsLoading(true);
    getGlobalCalendarEvents({
      event_type: categoryFilter === "all" ? undefined : categoryFilter,
      country: countryFilter === "all" ? undefined : countryFilter,
      importance: importanceFilter === "all" ? undefined : importanceFilter,
    })
      .then((data) => setEvents(data || []))
      .catch(() => setEvents([]))
      .finally(() => setCatalystsLoading(false));
  }, [categoryFilter, countryFilter, importanceFilter]);

  // Fetch Market Hours & Live Status
  useEffect(() => {
    setStatusLoading(true);
    Promise.all([
      getGlobalMarketStatus().catch(() => null),
      getMarketHoursDirectory().catch(() => []),
    ])
      .then(([statusData, hoursData]) => {
        if (statusData) setMarketStatus(statusData);
        if (hoursData && hoursData.length > 0) setHoursDirectory(hoursData);
      })
      .finally(() => setStatusLoading(false));

    // Poll status every 30s
    const timer = setInterval(() => {
      getGlobalMarketStatus().then((d) => d && setMarketStatus(d)).catch(() => {});
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Holidays
  useEffect(() => {
    setHolidaysLoading(true);
    getCalendarHolidays({
      year: selectedYear,
      exchange: selectedExchange === "all" ? undefined : selectedExchange,
      category: selectedCategory === "all" ? undefined : selectedCategory,
    })
      .then((data) => setHolidays(data || []))
      .catch(() => setHolidays([]))
      .finally(() => setHolidaysLoading(false));
  }, [selectedExchange, selectedCategory, selectedYear]);

  // Handle saving preferences
  const savePreferences = () => {
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            OPEN
          </span>
        );
      case "PRE_MARKET":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            PRE-MARKET
          </span>
        );
      case "BREAK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            LUNCH BREAK
          </span>
        );
      case "SPECIAL_SESSION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            MUHURAT / SPECIAL
          </span>
        );
      case "HOLIDAY":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            HOLIDAY CLOSED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-[#071426] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            CLOSED
          </span>
        );
    }
  };

  const getImportanceBadge = (imp: string) => {
    switch (imp) {
      case "HIGH":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40">
            HIGH IMPACT
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-[#071426] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
            LOW
          </span>
        );
    }
  };

  const getHolidayCategoryBadge = (cat: string) => {
    switch (cat) {
      case "TRADING_HOLIDAY":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40">
            TRADING HOLIDAY
          </span>
        );
      case "BANKING_HOLIDAY":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40">
            BANKING / NI ACT
          </span>
        );
      case "COMMODITY_DUAL_SESSION":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40">
            DUAL-SESSION (MCX)
          </span>
        );
      case "SPECIAL_TRADING_SESSION":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/40">
            MUHURAT TRADING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-[#071426] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
            {cat}
          </span>
        );
    }
  };

  return (
    <NavigationShell activePath="/calendar">
      <div className="space-y-6 w-full max-w-7xl mx-auto pb-16">
        
        {/* ─────────────────── Header & Breadcrumb ─────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">
              <Calendar size={14} /> Global Market Calendar &amp; Schedule
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Institutional Market Intelligence &amp; Event Calendar
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
              Authoritative tracking of global market trading sessions, central bank catalysts, macroeconomic data releases, corporate earnings, and official exchange closures.
            </p>
          </div>

          {/* Quick Stats Pill */}
          {marketStatus && (
            <div className="flex items-center gap-3 bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-2.5 px-4 shadow-sm">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Open Markets</span>
                <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                  {marketStatus.active_open_markets_count} / {marketStatus.markets.length}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-[#162C4E]" />
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Active Regime</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                  {marketStatus.summary_label || "Continuous Monitoring"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─────────────────── View Tabs ─────────────────── */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-[#162C4E] pb-3">
          {[
            { id: "catalysts", label: "Economic & Corporate Catalysts", icon: CalendarDays },
            { id: "hours", label: "Global Trading Hours & Live Status", icon: Clock },
            { id: "holidays", label: "Official Exchange Holiday Database", icon: ShieldAlert },
            { id: "preferences", label: "Alerts & Preferences", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-[#0B1930] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#162C4E]"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─────────────────── TAB 1: CATALYSTS ─────────────────── */}
        {activeTab === "catalysts" && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase mr-1">Category:</span>
                {[
                  { id: "all", label: "All Catalysts" },
                  { id: "CENTRAL_BANK", label: "Central Banks" },
                  { id: "INFLATION", label: "Inflation / CPI" },
                  { id: "GDP", label: "GDP" },
                  { id: "EARNINGS", label: "Corporate Earnings" },
                  { id: "CORPORATE_ACTION", label: "Dividends & AGMs" },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setCategoryFilter(btn.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      categoryFilter === btn.id
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-slate-50 dark:bg-[#071426] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#162C4E]"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase">Market:</span>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                  >
                    <option value="all">All Countries</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase">Impact:</span>
                  <select
                    value={importanceFilter}
                    onChange={(e) => setImportanceFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                  >
                    <option value="all">All Impact</option>
                    <option value="HIGH">High Impact Only</option>
                    <option value="MEDIUM">Medium &amp; High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Catalysts List */}
            {catalystsLoading ? (
              <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-3" />
                Loading institutional catalyst schedule...
              </div>
            ) : events.length === 0 ? (
              <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xs bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-2xl">
                No calendar events scheduled under this filter combination.
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((item) => (
                  <div
                    key={item.event_id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] hover:bg-slate-50 dark:hover:bg-[#10223B] border border-slate-200 dark:border-[#162C4E] hover:border-blue-500/50 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xs hover:shadow-md"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getImportanceBadge(item.importance)}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#071426] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#162C4E]">
                          {item.country} ({item.currency})
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          {item.event_type}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(item.event_time_utc).toLocaleString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.symbol && (
                          <Link
                            href={`/company/${item.symbol.toLowerCase()}`}
                            className="text-xs font-mono text-blue-600 dark:text-cyan-400 hover:underline"
                          >
                            [{item.symbol}]
                          </Link>
                        )}
                      </h3>

                      {item.notes && (
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] font-sans leading-relaxed">
                          {item.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>
                          Source:{" "}
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
                          >
                            {item.source} <ExternalLink size={10} />
                          </a>
                        </span>
                        {item.affected_sectors && item.affected_sectors.length > 0 && (
                          <span>
                            Sectors:{" "}
                            <span className="text-slate-700 dark:text-slate-300 font-mono">
                              {item.affected_sectors.join(", ")}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Numerical Impact Matrix */}
                    <div className="flex items-center gap-4 text-xs font-mono pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#162C4E]">
                      {item.forecast && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Forecast</span>
                          <span className="font-bold text-slate-900 dark:text-white">{item.forecast}</span>
                        </div>
                      )}

                      {item.previous && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Previous</span>
                          <span className="text-slate-500 dark:text-slate-400">{item.previous}</span>
                        </div>
                      )}

                      {item.actual && (
                        <div className="text-right pl-3 border-l border-slate-200 dark:border-[#162C4E]">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Actual</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.actual}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────── TAB 2: GLOBAL TRADING HOURS & LIVE STATUS ─────────────────── */}
        {activeTab === "hours" && (
          <div className="space-y-6">
            {/* Live Exchange Status Grid */}
            <div>
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={16} className="text-emerald-500" /> Real-Time Global Market Status
                </h2>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Auto-updates every 30s
                </span>
              </div>

              {statusLoading || !marketStatus ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                  Calculating authoritative market status across international time zones...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {marketStatus.markets.map((m) => (
                    <div
                      key={m.market_id}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] hover:border-blue-500/40 transition shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                            {m.exchange}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            {m.market_name}
                          </span>
                        </div>
                        {getStatusBadge(m.status)}
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#162C4E]/60 text-xs font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Local Time:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{m.current_local_time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Your Time:</span>
                          <span className="text-slate-700 dark:text-slate-300">{m.user_local_time || m.current_local_time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">Session:</span>
                          <span className="font-bold text-blue-600 dark:text-cyan-400">{m.session_label}</span>
                        </div>
                      </div>

                      {m.holiday_today && m.holiday_name && (
                        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-[11px] text-rose-600 dark:text-rose-400">
                          <span className="font-bold">Holiday:</span> {m.holiday_name}
                        </div>
                      )}

                      {m.special_session_notes && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                          {m.special_session_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trading Hours Directory Table */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock size={16} className="text-cyan-500" /> Exchange Trading Hours Directory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pre-market, regular trading, lunch break, and post-market sessions across major international bourses.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 text-[11px] uppercase">
                      <th className="pb-3 font-semibold">Exchange</th>
                      <th className="pb-3 font-semibold">Region / MIC</th>
                      <th className="pb-3 font-semibold">Timezone</th>
                      <th className="pb-3 font-semibold">Pre-Market</th>
                      <th className="pb-3 font-semibold">Regular Session</th>
                      <th className="pb-3 font-semibold">Lunch / Breaks</th>
                      <th className="pb-3 font-semibold">Post-Market</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-800 dark:text-slate-200">
                    {hoursDirectory.map((h) => (
                      <tr key={h.market_id} className="hover:bg-slate-50 dark:hover:bg-[#10223B]/60 transition">
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {h.exchange_name} ({h.mic})
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{h.region}</td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">{h.timezone}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{h.pre_market || "—"}</td>
                        <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">{h.regular_hours}</td>
                        <td className="py-3 text-amber-600 dark:text-amber-400">{h.lunch_break || "Continuous"}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{h.post_market || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────── TAB 3: HOLIDAY DATABASE ─────────────────── */}
        {activeTab === "holidays" && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase mr-1">Exchange:</span>
                {["all", "NSE", "BSE", "MCX", "RBI", "NYSE", "NASDAQ", "LSE"].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setSelectedExchange(ex)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedExchange === ex
                        ? "bg-blue-600 text-white font-bold"
                        : "bg-slate-50 dark:bg-[#071426] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#162C4E]"
                    }`}
                  >
                    {ex.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none"
                  >
                    <option value="all">All Holiday Types</option>
                    <option value="TRADING_HOLIDAY">Trading Holidays</option>
                    <option value="BANKING_HOLIDAY">Banking Closures (NI Act)</option>
                    <option value="COMMODITY_DUAL_SESSION">MCX Dual Session</option>
                    <option value="SPECIAL_TRADING_SESSION">Special Sessions (Diwali)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase">Year:</span>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                    className="bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-800 dark:text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none font-bold"
                  >
                    <option value={2026}>2026 Master</option>
                    <option value={2027}>2027 Projected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Explanatory Banner on Banking vs Trading Holidays */}
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 flex items-start gap-3 text-xs">
              <Info size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">
                  Crucial Institutional Distinction: Banking vs. Trading Holidays
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Notice that on dates such as April 1 (Annual Bank Closing), commercial banks and clearing houses are closed under Section 25 of the Negotiable Instruments Act, so funds settlement is suspended. However, equity trading on NSE and BSE remains fully open. Similarly, MCX observes morning closures on certain holidays while evening commodity sessions remain operational.
                </p>
              </div>
            </div>

            {/* Holidays Cards / Table */}
            {holidaysLoading ? (
              <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xs">
                Loading official exchange holiday directory...
              </div>
            ) : holidays.length === 0 ? (
              <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xs bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-2xl">
                No holidays recorded for this exchange and category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {holidays.map((h) => (
                  <div
                    key={h.holiday_id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] hover:border-blue-500/40 transition shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                          {h.exchange}
                        </span>
                        {getHolidayCategoryBadge(h.category)}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{h.event_name}</h3>

                      <div className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                        <Calendar size={13} />
                        {new Date(h.holiday_date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      {h.description && (
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] font-sans leading-relaxed">
                          {h.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-[#162C4E]/60 text-[11px] font-mono space-y-1">
                      <div className="text-slate-500 dark:text-slate-400">
                        <span className="font-bold">Settlement:</span> {h.settlement_status}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        <span className="font-bold">Trading:</span> {h.trading_status} · <span className="font-bold">Banking:</span> {h.banking_status}
                      </div>
                      {h.special_session_hours && (
                        <div className="text-amber-600 dark:text-amber-400">
                          <span className="font-bold">Special / Dual Hours:</span> {h.special_session_hours}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─────────────────── TAB 4: ALERTS & PREFERENCES ─────────────────── */}
        {activeTab === "preferences" && (
          <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders size={18} className="text-blue-500" /> Calendar Intelligence Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize time display formats, primary home exchange highlight, and high-impact catalyst alert notifications.
              </p>
            </div>

            <div className="space-y-4 pt-2 text-xs">
              {/* Primary Exchange */}
              <div className="space-y-1.5">
                <label className="font-mono text-slate-700 dark:text-slate-300 font-bold block">
                  Primary Market Focus
                </label>
                <select
                  value={primaryExchange}
                  onChange={(e) => setPrimaryExchange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-900 dark:text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="NSE">NSE — National Stock Exchange of India</option>
                  <option value="BSE">BSE — Bombay Stock Exchange</option>
                  <option value="MCX">MCX — Multi Commodity Exchange of India</option>
                  <option value="NYSE">NYSE — New York Stock Exchange</option>
                  <option value="NASDAQ">NASDAQ — National Association of Securities Dealers</option>
                  <option value="LSE">LSE — London Stock Exchange</option>
                </select>
              </div>

              {/* Timezone Preference */}
              <div className="space-y-1.5">
                <label className="font-mono text-slate-700 dark:text-slate-300 font-bold block">
                  Display Timezone
                </label>
                <select
                  value={preferredTz}
                  onChange={(e) => setPreferredTz(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-900 dark:text-white rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST — UTC+5:30)</option>
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                  <option value="America/New_York">America/New_York (EST/EDT — UTC-5 / UTC-4)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST — UTC+9)</option>
                </select>
              </div>

              {/* 24-Hour Format Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E]">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">24-Hour Military Time</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Display 15:30 instead of 3:30 PM</span>
                </div>
                <input
                  type="checkbox"
                  checked={timeFormat24}
                  onChange={(e) => setTimeFormat24(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* High-Impact Alert Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E]">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">High-Impact Catalyst Highlights</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Emphasize RBI MPC, US FOMC, and CPI releases</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHighImpact}
                  onChange={(e) => setNotifyHighImpact(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Save Button */}
              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={savePreferences}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-sm"
                >
                  Save Calendar Preferences
                </button>
                {preferencesSaved && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 size={14} /> Preferences Saved!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </NavigationShell>
  );
}
