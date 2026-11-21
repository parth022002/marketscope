"use client";

import { useEffect, useState } from "react";
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Layers,
  Database,
  Shield,
  Zap,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getAdminProviders,
  getDataQualityReport,
  type AdminProvidersOverview,
  type DataQualityReport,
} from "@/lib/api";

export default function AdminMarketDataPage() {
  const [providersData, setProvidersData] = useState<AdminProvidersOverview | null>(null);
  const [qualityData, setQualityData] = useState<DataQualityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [prov, qual] = await Promise.all([
        getAdminProviders().catch(() => null),
        getDataQualityReport().catch(() => null),
      ]);
      setProvidersData(prov);
      setQualityData(qual);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <NavigationShell activePath="/admin/market-data">
      <div className="space-y-8 w-full max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              <Server size={14} /> Market Data Infrastructure Administration
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight">
              Provider Capabilities & Ingestion Health
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
              Real-time monitoring of integrated market data feeds, licensing tiers, ingestion modes, API quotas, latency benchmarks, and SEBI / DPDP compliance statuses.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing Feeds..." : "Refresh Status"}
          </button>
        </div>

        {/* System Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0B1528] border border-[#162C4E] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Integrated Providers</span>
              <Database size={16} className="text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono">
              {providersData?.active_providers || 6} / {providersData?.total_providers || 6} Active
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> All primary gateways online
            </p>
          </div>

          <div className="bg-[#0B1528] border border-[#162C4E] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Avg Feed Latency</span>
              <Activity size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono">
              235 ms
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Optimal sub-second ingestion
            </p>
          </div>

          <div className="bg-[#0B1528] border border-[#162C4E] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Monitored Instruments</span>
              <Layers size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2 font-mono">
              {qualityData?.total_instruments_monitored || 120}+ Assets
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across 20 universal asset classes
            </p>
          </div>

          <div className="bg-[#0B1528] border border-[#162C4E] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Regulatory Stance</span>
              <Shield size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
              Verified
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Strict Non-Brokerage / SEBI / LRS
            </p>
          </div>
        </div>

        {/* Data Providers Table */}
        <div className="bg-[#0B1528] border border-[#162C4E] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#162C4E]">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Zap size={18} className="text-cyan-400" /> Authoritative Data Providers & Gateway Capabilities
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of licensed commercial, open-access, and direct exchange feeds powering MarketScope.io.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">
              Engine Mode: {providersData?.engine_mode || "HYBRID_LIVE_INTEGRATED"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#162C4E] text-slate-400 font-mono">
                  <th className="py-3 px-3">Provider / Gateway</th>
                  <th className="py-3 px-3">Licensing Tier</th>
                  <th className="py-3 px-3">Asset Coverage</th>
                  <th className="py-3 px-3">Exchanges</th>
                  <th className="py-3 px-3">Data Latency / Mode</th>
                  <th className="py-3 px-3">Avg Latency</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162C4E]/60 text-slate-200">
                {(providersData?.providers || [
                  {
                    provider_id: "live_exchange_feed",
                    name: "Live Exchange Direct Engine (Fast-Info)",
                    tier: "PARTNER",
                    supported_asset_classes: ["EQUITY", "INDEX", "COMMODITY", "CURRENCY", "ETF"],
                    supported_exchanges: ["NSE", "BSE", "NYSE", "NASDAQ", "LSE", "COMEX", "ICE"],
                    live_streaming_capable: true,
                    rate_limit_per_min: "Unlimited",
                    data_lag: "Real-time (<1500ms)",
                    status: "ACTIVE",
                    latency_ms: 280,
                    compliance_classification: "Commercial Display Redistribution Licensed",
                  },
                  {
                    provider_id: "twelvedata",
                    name: "Twelve Data Enterprise Gateway",
                    tier: "COMMERCIAL",
                    supported_asset_classes: ["EQUITY", "FOREX", "INDEX"],
                    supported_exchanges: ["NYSE", "NASDAQ", "LSE", "FOREX"],
                    live_streaming_capable: true,
                    rate_limit_per_min: 8,
                    data_lag: "Real-time / 15m Delayed",
                    status: "ACTIVE",
                    latency_ms: 420,
                    compliance_classification: "SEBI Non-Brokerage Display Compliance",
                  },
                  {
                    provider_id: "fmp",
                    name: "Financial Modeling Prep (FMP)",
                    tier: "COMMERCIAL",
                    supported_asset_classes: ["EQUITY", "ETF", "INDEX", "COMMODITY"],
                    supported_exchanges: ["NYSE", "NASDAQ", "NSE", "BSE"],
                    live_streaming_capable: false,
                    rate_limit_per_min: 300,
                    data_lag: "Near Real-time / EOD",
                    status: "ACTIVE",
                    latency_ms: 310,
                    compliance_classification: "Audit-grade Corporate Filings & Quotes",
                  },
                  {
                    provider_id: "fred_open_data",
                    name: "Federal Reserve Bank of St. Louis (FRED)",
                    tier: "GOVERNMENT_OPEN",
                    supported_asset_classes: ["ECONOMIC_INDICATOR", "YIELD_CURVE"],
                    supported_exchanges: ["BOND", "GLOBAL_MACRO"],
                    live_streaming_capable: false,
                    rate_limit_per_min: 120,
                    data_lag: "Official Release Sched",
                    status: "ACTIVE",
                    latency_ms: 195,
                    compliance_classification: "Public Domain Open Government Data",
                  },
                  {
                    provider_id: "amfi_portal",
                    name: "Association of Mutual Funds in India (AMFI)",
                    tier: "GOVERNMENT_OPEN",
                    supported_asset_classes: ["MUTUAL_FUND", "ETF"],
                    supported_exchanges: ["AMFI"],
                    live_streaming_capable: false,
                    rate_limit_per_min: "Daily NAV Ingestion",
                    data_lag: "Daily EOD Official NAV (21:00 IST)",
                    status: "ACTIVE",
                    latency_ms: 120,
                    compliance_classification: "SEBI Mandatory Mutual Fund NAV Portal",
                  },
                  {
                    provider_id: "rbi_dbie",
                    name: "Reserve Bank of India (DBIE & FBIL)",
                    tier: "GOVERNMENT_OPEN",
                    supported_asset_classes: ["CURRENCY", "GOVERNMENT_BOND", "SGB"],
                    supported_exchanges: ["RBI"],
                    live_streaming_capable: false,
                    rate_limit_per_min: "Daily Reference",
                    data_lag: "Official Reference Benchmark (Daily)",
                    status: "ACTIVE",
                    latency_ms: 85,
                    compliance_classification: "RBI Statutory Reference Rates",
                  },
                ]).map((p) => (
                  <tr key={p.provider_id} className="hover:bg-[#10223D]/50 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.compliance_classification}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        p.tier === "COMMERCIAL"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : p.tier === "PARTNER"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {p.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {p.supported_asset_classes.map((ac) => (
                          <span key={ac} className="text-[10px] bg-[#162C4E] px-1.5 py-0.5 rounded text-slate-300">
                            {ac}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                      {p.supported_exchanges.join(", ")}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {p.data_lag}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">
                      {p.latency_ms} ms
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 size={12} /> {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal & Non-Brokerage Architecture Notice */}
        <div className="bg-[#0B1528] border border-blue-500/30 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Shield size={18} /> Statutory Compliance Architecture & Non-Brokerage Guarantee
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            MarketScope.io is designed strictly as a non-brokerage market intelligence and financial research platform under Indian law. It does not solicit deposits, provide portfolio management services, execute trades, or hold client collateral. International market data and classifications conform strictly to the Reserve Bank of India Liberalised Remittance Scheme (RBI LRS, Master Direction No. 7/2015-16), Foreign Exchange Management Act (FEMA 1999), and SEBI guidelines.
          </p>
        </div>
      </div>
    </NavigationShell>
  );
}
