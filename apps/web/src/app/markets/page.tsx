"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  Filter,
  Activity,
  Search,
  Shield,
  Clock,
  Sparkles,
  BarChart3,
  DollarSign,
  Percent,
  Coins,
  Landmark,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import MarketHeatmap from "@/components/MarketHeatmap";
import MarketOverviewCard from "@/components/MarketOverviewCard";
import IndexPerformanceChart from "@/components/IndexPerformanceChart";
import RegulatoryAccessBadge from "@/components/RegulatoryAccessBadge";
import {
  getMarketTicker,
  getDerivativesPulse,
  getFixedIncomeOverview,
  getFundsOverview,
  getCommoditiesOverview,
  getCurrenciesOverview,
  searchUniversalInstruments,
  type TickerItem,
  type DerivativesOverview,
  type FixedIncomeOverview,
  type FundsOverview,
  type CommoditiesOverview,
  type CurrenciesOverview,
  type UniversalInstrument,
} from "@/lib/api";

type TabType =
  | "overview"
  | "india"
  | "global"
  | "commodities"
  | "currencies"
  | "fixed_income"
  | "funds"
  | "derivatives";

export default function MarketsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UniversalInstrument[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Data states
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [derivatives, setDerivatives] = useState<DerivativesOverview | null>(null);
  const [fixedIncome, setFixedIncome] = useState<FixedIncomeOverview | null>(null);
  const [fundsData, setFundsData] = useState<FundsOverview | null>(null);
  const [commoditiesData, setCommoditiesData] = useState<CommoditiesOverview | null>(null);
  const [currenciesData, setCurrenciesData] = useState<CurrenciesOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMarketTicker().catch(() => []),
      getDerivativesPulse().catch(() => null),
      getFixedIncomeOverview().catch(() => null),
      getFundsOverview().catch(() => null),
      getCommoditiesOverview().catch(() => null),
      getCurrenciesOverview().catch(() => null),
    ])
      .then(([t, d, fi, f, c, cur]) => {
        setTickers(t || []);
        setDerivatives(d);
        setFixedIncome(fi);
        setFundsData(f);
        setCommoditiesData(c);
        setCurrenciesData(cur);
      })
      .finally(() => setLoading(false));
  }, []);

  // Search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      searchUniversalInstruments(searchQuery)
        .then((res) => setSearchResults(res.results || []))
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: Globe },
    { id: "india" as TabType, label: "Indian Equities", icon: TrendingUp },
    { id: "global" as TabType, label: "US & International", icon: Layers },
    { id: "commodities" as TabType, label: "Commodities & Energy", icon: Coins },
    { id: "currencies" as TabType, label: "Currencies & FX", icon: DollarSign },
    { id: "fixed_income" as TabType, label: "Bonds & Yields", icon: Landmark },
    { id: "funds" as TabType, label: "Mutual Funds & ETFs", icon: BarChart3 },
    { id: "derivatives" as TabType, label: "Derivatives Pulse", icon: Activity },
  ];

  // Filtered ticker slices
  const indianTickers = useMemo(() => {
    return tickers.filter((t) => t.exchange === "NSE" || t.exchange === "BSE");
  }, [tickers]);

  const globalTickers = useMemo(() => {
    return tickers.filter(
      (t) =>
        t.exchange !== "NSE" &&
        t.exchange !== "BSE" &&
        t.exchange !== "MCX" &&
        t.category !== "currency" &&
        t.category !== "commodity"
    );
  }, [tickers]);

  return (
    <NavigationShell activePath="/markets">
      <div className="space-y-8 w-full max-w-7xl mx-auto pb-12">
        {/* Header & Global Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-500 dark:text-cyan-400 uppercase">
              <Globe size={14} /> Universal Financial Intelligence Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Global Financial Markets
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
              Authoritative market rates across 20 asset classes. Indian equities, international benchmarks, derivatives pulse, commodities, currencies, AMFI NAVs, and sovereign debt curves.
            </p>
          </div>

          {/* Quick Universal Search */}
          <div className="relative w-full lg:w-96">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol, ISIN, company or asset..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Dropdown Results */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#162C4E]">
                {isSearching ? (
                  <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">Searching catalog...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div
                      key={item.instrument_id}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-[#10223D] transition flex items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs font-mono">{item.symbol}</span>
                          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/20">
                            {item.exchange}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {item.asset_class}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[220px] mt-0.5">
                          {item.name}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <RegulatoryAccessBadge
                          status={item.investment_access_status}
                          permittedRoute={item.permitted_investment_route}
                          framework={item.regulatory_details?.governing_framework}
                          conditions={item.regulatory_details?.key_conditions}
                          disclaimer={item.regulatory_details?.disclaimer}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-slate-500 dark:text-slate-400 text-center">No instruments found matching &quot;{searchQuery}&quot;</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Multi-Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-[#162C4E]/60 scrollbar-none">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-bold"
                    : "bg-slate-100 dark:bg-[#0B1528] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#162C4E]"
                }`}
              >
                <TabIcon size={14} className={isActive ? "text-cyan-200" : "text-slate-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Market Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Activity size={16} className="text-cyan-500 dark:text-cyan-400" /> Key Global & Domestic Benchmarks
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Real-time / Delay Managed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tickers.slice(0, 8).map((item) => (
                  <MarketOverviewCard
                    key={item.symbol}
                    symbol={item.symbol}
                    name={item.name}
                    price={item.price}
                    change={item.change}
                    change_pct={item.change_pct}
                    currency={item.currency}
                    exchange={item.exchange}
                    data_status={item.data_status}
                    sparkline={item.sparkline}
                  />
                ))}
              </div>
            </div>

            {/* Technical Chart */}
            <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2">
                <BarChart3 size={16} className="text-cyan-500 dark:text-cyan-400" /> Benchmark Performance Analysis
              </h2>
              <IndexPerformanceChart selectedIndex="NIFTY 50" />
            </div>

            {/* Sector Tree-Map */}
            <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Layers size={16} className="text-cyan-500 dark:text-cyan-400" /> Sector Market Breadth Tree-Map
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sized by market capitalization, colored by relative intraday percentage change.
                  </p>
                </div>
              </div>
              <MarketHeatmap initialUniverse="all" />
            </div>
          </div>
        )}

        {/* Tab 2: Indian Equities */}
        {activeTab === "india" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#162C4E]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  National Stock Exchange (NSE) & Bombay Stock Exchange (BSE)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct domestic investment access for resident Indians under SEBI regulations.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-500/20">
                Direct Domestic Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {indianTickers.map((item) => (
                <div key={item.symbol} className="relative">
                  <MarketOverviewCard
                    symbol={item.symbol}
                    name={item.name}
                    price={item.price}
                    change={item.change}
                    change_pct={item.change_pct}
                    currency={item.currency}
                    exchange={item.exchange}
                    data_status={item.data_status}
                    sparkline={item.sparkline}
                  />
                  <div className="mt-2 text-right">
                    <RegulatoryAccessBadge
                      status="DOMESTIC_ACCESS"
                      badgeText="Direct Demat Access"
                      framework="SEBI / RBI Domestic Regulations"
                      permittedRoute="Normal Demat / Trading Account with SEBI-registered broker"
                      conditions={[
                        "PAN and Aadhaar verified KYC required",
                        "Standard STT and Capital Gains Tax apply",
                        "No foreign currency conversion needed",
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: US & International */}
        {activeTab === "global" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  US & International Equities (NYSE, NASDAQ, LSE, TSE)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Governed by the Reserve Bank of India Liberalised Remittance Scheme (RBI LRS).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded border border-blue-200 dark:border-blue-500/20">
                  LRS Limit: USD 250,000 / Financial Year
                </span>
              </div>
            </div>

            <div className="bg-blue-50/50 dark:bg-[#0B1528] border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Resident Indian Regulatory Framework:</span>
              Resident individuals may remit up to USD 250,000 per financial year (April–March) for permissible capital account transactions under the RBI LRS. TCS of 20% applies to remittances exceeding ₹7 Lakhs/FY. Mandatory reporting under Schedule FA (Foreign Assets) in ITR-2 / ITR-3. Leverage and margin trading abroad are strictly prohibited under FEMA.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {globalTickers.map((item) => (
                <div key={item.symbol} className="relative">
                  <MarketOverviewCard
                    symbol={item.symbol}
                    name={item.name}
                    price={item.price}
                    change={item.change}
                    change_pct={item.change_pct}
                    currency={item.currency}
                    exchange={item.exchange}
                    data_status={item.data_status}
                    sparkline={item.sparkline}
                  />
                  <div className="mt-2 text-right">
                    <RegulatoryAccessBadge
                      status="INTERNATIONAL_ACCESS_SUBJECT_TO_LRS"
                      badgeText="LRS Permitted ($250k/FY)"
                      framework="RBI Master Direction - LRS (FEMA 1999)"
                      permittedRoute="Authorized Dealer Category-I Bank Remittance"
                      conditions={[
                        "Max USD 250,000 annual limit per resident individual",
                        "20% TCS applies on remittances exceeding ₹7 Lakhs/year",
                        "Mandatory ITR Schedule FA disclosure",
                        "Strictly cash investment — leverage/margin prohibited",
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Commodities & Energy */}
        {activeTab === "commodities" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#162C4E]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Multi-Segment Commodities & Energy Contracts
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Precious metals, crude oil, natural gas, and industrial metals across MCX, COMEX, and NYMEX.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono">
                    <th className="py-3 px-3">Commodity</th>
                    <th className="py-3 px-3">Exchange</th>
                    <th className="py-3 px-3">Segment</th>
                    <th className="py-3 px-3">Unit</th>
                    <th className="py-3 px-3 text-right">Last Price</th>
                    <th className="py-3 px-3 text-right">24h Change</th>
                    <th className="py-3 px-3">Regulatory Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-700 dark:text-slate-200">
                  {(commoditiesData?.commodities || []).map((c) => (
                    <tr key={c.symbol} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">{c.symbol}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {c.exchange}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] bg-slate-100 dark:bg-[#162C4E] px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                        {c.unit}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-right text-slate-900 dark:text-white text-sm">
                        {c.currency === "INR" ? "₹" : "$"}{c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-bold text-right ${c.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {c.change >= 0 ? "+" : ""}{c.change_pct.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3">
                        <RegulatoryAccessBadge
                          status={c.exchange === "MCX" ? "DOMESTIC_ACCESS" : "RESEARCH_ONLY"}
                          badgeText={c.exchange === "MCX" ? "MCX Domestic Trading" : "Research Benchmark Only"}
                          framework={c.exchange === "MCX" ? "SEBI Commodity Derivatives" : "FEMA 1999 (Offshore Margining Prohibited)"}
                          permittedRoute={c.exchange === "MCX" ? "SEBI Registered Commodity Broker" : "Research Only — Overseas commodity margins prohibited for residents"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Currencies & FX */}
        {activeTab === "currencies" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Foreign Exchange (FX) & Official RBI Reference Rates
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Official FBIL/RBI benchmark rates and global interbank currency pairs.
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-200 dark:border-cyan-500/20">
                Official RBI Reference Date: {currenciesData?.rbi_reference_rate_date || "Daily 13:30 IST"}
              </div>
            </div>

            {/* Currency Pairs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(currenciesData?.pairs || []).map((pair) => (
                <div key={pair.pair} className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-base font-mono">{pair.pair}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-[#162C4E] px-2 py-0.5 rounded">
                      {pair.source}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{pair.name}</div>
                  <div className="flex items-baseline justify-between pt-2">
                    <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {pair.rate.toFixed(4)}
                    </div>
                    <div className={`font-mono text-xs font-bold ${pair.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                      {pair.change >= 0 ? "+" : ""}{pair.change_pct.toFixed(2)}%
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-[#162C4E]/60 text-right">
                    <RegulatoryAccessBadge
                      status={pair.category === "RBI_REFERENCE" ? "DOMESTIC_ACCESS" : "RESEARCH_ONLY"}
                      badgeText={pair.category === "RBI_REFERENCE" ? "NSE/BSE Currency Deriv" : "Research FX Rate"}
                      framework={pair.category === "RBI_REFERENCE" ? "SEBI / RBI Currency Derivatives Regulations" : "FEMA 1999 Forex Margin Restrictions"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Bonds & Sovereign Yields */}
        {activeTab === "fixed_income" && (
          <div className="space-y-8 animate-in fade-in">
            {/* 10Y Benchmark Spread Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">India 10Y Sovereign Yield (G-Sec)</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {fixedIncome?.india_benchmark_10y || 6.78}%
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Direct access via RBI Retail Direct</p>
              </div>

              <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">US 10Y Treasury Yield</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {fixedIncome?.us_benchmark_10y || 4.42}%
                </div>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Global risk-free benchmark</p>
              </div>

              <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sovereign Spread (India - US)</span>
                <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono mt-1">
                  +{fixedIncome?.spread_bps || 236} bps
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Currency risk & inflation differential</p>
              </div>
            </div>

            {/* Sovereign Yield Curves Table */}
            <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Landmark size={18} className="text-cyan-500 dark:text-cyan-400" /> Sovereign Yield Curve Tenors (3M to 30Y)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono">
                      <th className="py-2.5 px-3">Tenor</th>
                      <th className="py-2.5 px-3 text-right">India G-Sec Yield (%)</th>
                      <th className="py-2.5 px-3 text-right">US Treasury Yield (%)</th>
                      <th className="py-2.5 px-3 text-right">Differential (bps)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 font-mono text-slate-700 dark:text-slate-200">
                    {(fixedIncome?.india_yield_curve || []).map((pt, idx) => {
                      const usPt = fixedIncome?.us_yield_curve[idx];
                      const diff = usPt ? Math.round((pt.yield_pct - usPt.yield_pct) * 100) : null;
                      return (
                        <tr key={pt.tenor} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{pt.tenor}</td>
                          <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">{pt.yield_pct.toFixed(2)}%</td>
                          <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400 font-bold">{usPt ? `${usPt.yield_pct.toFixed(2)}%` : "—"}</td>
                          <td className="py-3 px-3 text-right text-cyan-600 dark:text-cyan-400 font-bold">{diff !== null ? `+${diff}` : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sovereign Gold Bonds (SGBs) */}
            <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Coins size={18} className="text-amber-500 dark:text-amber-400" /> Sovereign Gold Bonds (SGB) Secondary Market
                </h3>
                <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-500/20">
                  Tax-Exempt on RBI Maturity
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(fixedIncome?.sovereign_gold_bonds || []).map((sgb) => (
                  <div key={sgb.symbol} className="bg-slate-50 dark:bg-[#060D1B] border border-slate-200 dark:border-[#162544] rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{sgb.series}</span>
                      <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">{sgb.symbol}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Issue Price</span>
                        <span className="font-mono text-slate-700 dark:text-slate-200">₹{sgb.issue_price}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Market Price</span>
                        <span className="font-mono text-slate-900 dark:text-white font-bold">₹{sgb.current_market_price}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px]">YTM (%)</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sgb.yield_to_maturity_pct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Mutual Funds & ETFs */}
        {activeTab === "funds" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Domestic Mutual Funds, Index ETFs & Global Feeder Funds
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Official AMFI NAVs, Assets Under Management (AUM), and Expense Ratios.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-200 dark:border-cyan-500/20">
                Official AMFI Ingestion Portal
              </span>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono">
                    <th className="py-3 px-3">Scheme Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Fund House</th>
                    <th className="py-3 px-3 text-right">Latest NAV (₹)</th>
                    <th className="py-3 px-3 text-right">Change (%)</th>
                    <th className="py-3 px-3 text-right">AUM (₹ Cr)</th>
                    <th className="py-3 px-3 text-right">TER (%)</th>
                    <th className="py-3 px-3">Regulatory Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-700 dark:text-slate-200">
                  {(fundsData?.funds || []).map((f) => (
                    <tr key={f.scheme_code} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{f.scheme_name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Code: {f.scheme_code}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] bg-slate-100 dark:bg-[#162C4E] px-2 py-0.5 rounded text-cyan-700 dark:text-cyan-300 font-medium">
                          {f.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 text-xs">
                        {f.fund_house}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-right text-slate-900 dark:text-white">
                        ₹{f.nav.toFixed(2)}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-bold text-right ${f.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {f.change >= 0 ? "+" : ""}{f.change_pct.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 font-mono text-right text-slate-600 dark:text-slate-300">
                        ₹{f.aum_cr.toLocaleString()} Cr
                      </td>
                      <td className="py-3.5 px-3 font-mono text-right text-slate-600 dark:text-slate-300">
                        {f.expense_ratio_pct.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3">
                        <RegulatoryAccessBadge
                          status={f.regulatory_status}
                          badgeText={f.category === "Global Feeder" ? "Domestic Feeder Route" : "Direct MF Demat"}
                          framework="SEBI Mutual Fund Regulations (Overseas Cap $7B industry limit)"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Derivatives Pulse */}
        {activeTab === "derivatives" && (
          <div className="space-y-6 animate-in fade-in">
            {/* VIX & Volatility Headline Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">India VIX (Volatility)</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {derivatives?.india_vix || 13.45}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Low volatility regime</p>
              </div>

              <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CBOE VIX (US Volatility)</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {derivatives?.cboe_vix || 14.80}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">S&P 500 options implied</p>
              </div>

              <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">NIFTY Put/Call Ratio (PCR)</span>
                <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono mt-1">
                  {derivatives?.put_call_ratio_nifty || 1.08}
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Mild bullish bias (&gt; 1.0)</p>
              </div>

              <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">BANK NIFTY PCR</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {derivatives?.put_call_ratio_banknifty || 0.94}
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Range-bound neutral</p>
              </div>
            </div>

            {/* Derivatives Contracts Table */}
            <div className="overflow-x-auto bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono">
                    <th className="py-3 px-3">Contract</th>
                    <th className="py-3 px-3 text-right">Spot Price</th>
                    <th className="py-3 px-3 text-right">Futures Price</th>
                    <th className="py-3 px-3 text-right">Basis (Prem/Disc)</th>
                    <th className="py-3 px-3 text-right">IV (%)</th>
                    <th className="py-3 px-3 text-right">PCR</th>
                    <th className="py-3 px-3 text-right">Total OI</th>
                    <th className="py-3 px-3 text-right">OI Chg (%)</th>
                    <th className="py-3 px-3">Market Sentiment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-700 dark:text-slate-200">
                  {(derivatives?.items || []).map((item) => (
                    <tr key={item.symbol} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">{item.symbol}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-right text-slate-600 dark:text-slate-300">
                        ₹{item.underlying_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-right text-slate-900 dark:text-white">
                        ₹{item.futures_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-bold text-right ${item.basis >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {item.basis >= 0 ? "+" : ""}{item.basis.toFixed(2)} ({item.basis_pct.toFixed(2)}%)
                      </td>
                      <td className="py-3.5 px-3 font-mono text-right text-cyan-600 dark:text-cyan-400">
                        {item.implied_volatility.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-right text-slate-700 dark:text-slate-200">
                        {item.put_call_ratio.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-right text-slate-600 dark:text-slate-300">
                        {item.total_oi.toLocaleString()}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-bold text-right ${item.oi_change_pct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {item.oi_change_pct >= 0 ? "+" : ""}{item.oi_change_pct.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                          {item.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Regulatory & Non-Brokerage Notice */}
        <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold">
            <Shield size={16} className="text-cyan-500 dark:text-cyan-400" /> Non-Brokerage Regulatory Notice & Investor Protection
          </div>
          <p className="leading-relaxed">
            MarketScope.io is an independent market intelligence and analytical research platform. It does not provide investment advisory, portfolio management services, broker-dealer execution, or custodial holding of investor funds. All market data feeds are ingested from official exchanges, regulatory bodies, and licensed redistributors. Investment access classifications are strictly educational guidelines under Indian regulations (RBI LRS, FEMA, SEBI, IFSCA).
          </p>
        </div>
      </div>
    </NavigationShell>
  );
}
