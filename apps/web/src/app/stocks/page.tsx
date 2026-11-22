"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Globe,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getStockDiscovery,
  getMarketCoverage,
  type StockDiscoveryItem,
  type StockDiscoveryResponse,
  type MarketCoverageResponse,
} from "@/lib/api";

const EXCHANGES = [
  { id: "ALL", label: "All Exchanges" },
  { id: "NSE", label: "NSE India" },
  { id: "BSE", label: "BSE India" },
  { id: "NASDAQ", label: "NASDAQ US" },
  { id: "NYSE", label: "NYSE US" },
  { id: "LSE", label: "London Stock Exchange" },
  { id: "XETRA", label: "Deutsche Börse Xetra" },
  { id: "TSE", label: "Tokyo Stock Exchange" },
  { id: "HKEX", label: "Hong Kong Exchanges" },
];

const COUNTRIES = [
  { id: "ALL", label: "All Countries" },
  { id: "India", label: "India" },
  { id: "United States", label: "United States" },
  { id: "United Kingdom", label: "United Kingdom" },
  { id: "Germany", label: "Germany" },
  { id: "Japan", label: "Japan" },
  { id: "Netherlands", label: "Netherlands" },
  { id: "Taiwan", label: "Taiwan" },
];

const CAP_CATEGORIES = [
  { id: "ALL", label: "All Caps" },
  { id: "MEGA", label: "Mega Cap" },
  { id: "LARGE", label: "Large Cap" },
  { id: "MID", label: "Mid Cap" },
  { id: "SMALL", label: "Small Cap" },
];

const SORT_OPTIONS = [
  { id: "market_cap", label: "Market Capitalisation" },
  { id: "price", label: "Stock Price" },
  { id: "change_pct", label: "Day Performance (%)" },
  { id: "pe", label: "P/E Multiple" },
  { id: "company_name", label: "Company Name" },
  { id: "symbol", label: "Ticker Symbol" },
];

export default function StocksPage() {
  const [exchangeFilter, setExchangeFilter] = useState<string>("ALL");
  const [countryFilter, setCountryFilter] = useState<string>("ALL");
  const [capFilter, setCapFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("market_cap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const [discoveryData, setDiscoveryData] = useState<StockDiscoveryResponse | null>(null);
  const [coverageData, setCoverageData] = useState<MarketCoverageResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch coverage stats once
  useEffect(() => {
    getMarketCoverage()
      .then((data) => setCoverageData(data))
      .catch(() => {});
  }, []);

  // Fetch discovery results when filters change
  useEffect(() => {
    setIsLoading(true);
    getStockDiscovery({
      exchange: exchangeFilter === "ALL" ? undefined : exchangeFilter,
      country: countryFilter === "ALL" ? undefined : countryFilter,
      market_cap_category: capFilter === "ALL" ? undefined : capFilter,
      search: debouncedSearch || undefined,
      sort_by: sortBy,
      sort_dir: sortDir,
      page,
      page_size: pageSize,
    })
      .then((res) => {
        setDiscoveryData(res);
      })
      .catch((err) => {
        console.error("Discovery error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [exchangeFilter, countryFilter, capFilter, debouncedSearch, sortBy, sortDir, page, pageSize]);

  const totalResults = discoveryData?.total || 0;
  const totalPages = discoveryData?.total_pages || 1;
  const items = discoveryData?.results || [];

  const handleResetFilters = () => {
    setExchangeFilter("ALL");
    setCountryFilter("ALL");
    setCapFilter("ALL");
    setSearchTerm("");
    setSortBy("market_cap");
    setSortDir("desc");
    setPage(1);
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "GBP":
        return "£";
      case "EUR":
        return "€";
      case "JPY":
        return "¥";
      case "HKD":
        return "HK$";
      default:
        return "";
    }
  };

  return (
    <NavigationShell activePath="/stocks">
      <div className="space-y-6 w-full">
        {/* Header & Stats Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <Globe size={14} /> Universal Stock Exchange Coverage &amp; Discovery
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Global Stocks Discovery &amp; Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed font-sans">
              Search and discover exchange-listed equities, American Depositary Receipts (ADRs), and cross-listed share classes across Indian and premier international exchanges. Supported with canonical statements, 15 golden ratios, and evidence traceability.
            </p>
          </div>

          {/* Quick Metrics from Universe Engine */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs text-right">
              <div className="text-[10px] font-mono uppercase text-slate-400">Total Securities</div>
              <div className="text-base font-black text-blue-600 dark:text-cyan-400 font-mono">
                {coverageData?.total_instruments || totalResults || "300+"}
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs text-right">
              <div className="text-[10px] font-mono uppercase text-slate-400">Exchanges</div>
              <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                {coverageData?.exchanges_covered || "32"}
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs text-right">
              <div className="text-[10px] font-mono uppercase text-slate-400">Corporate Issuers</div>
              <div className="text-base font-black text-emerald-500 font-mono">
                {coverageData?.total_companies || "250+"}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs space-y-4">
          {/* Top row: Search and sort controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company name, symbol, ISIN, or sector (e.g. Tata, INFY, US0378331005)..."
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdowns */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                    setPage(1);
                  }}
                  className="px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:border-blue-500 transition"
                  title="Toggle Sort Direction"
                >
                  {sortDir.toUpperCase()}
                </button>
              </div>

              {(exchangeFilter !== "ALL" || countryFilter !== "ALL" || capFilter !== "ALL" || searchTerm) && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#071426] text-rose-500 border border-slate-200 dark:border-[#162C4E] text-xs font-semibold hover:bg-rose-500/10 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Bottom row: Filter Chips */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#162C4E]/60 text-xs">
            {/* Exchange Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono text-slate-400 shrink-0 mr-1">Exchange:</span>
              {EXCHANGES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setExchangeFilter(ex.id);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    exchangeFilter === ex.id
                      ? "bg-blue-600 text-white shadow-xs font-bold"
                      : "bg-slate-50 dark:bg-[#071426] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#162C4E]"
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Country and Cap Filters */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Country selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">Country:</span>
                <select
                  value={countryFilter}
                  onChange={(e) => {
                    setCountryFilter(e.target.value);
                    setPage(1);
                  }}
                  className="bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Market Cap category */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">Cap Tier:</span>
                <div className="flex items-center gap-1">
                  {CAP_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCapFilter(cat.id);
                        setPage(1);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] transition ${
                        capFilter === cat.id
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-slate-50 dark:bg-[#071426] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ml-auto text-[11px] font-mono text-slate-400">
                Found <span className="font-bold text-slate-900 dark:text-white">{totalResults}</span> instruments
              </div>
            </div>
          </div>
        </div>

        {/* Equities Table */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] overflow-x-auto shadow-xs scrollbar-none">
          {isLoading ? (
            <div className="p-12 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
              <p className="text-xs text-slate-400 font-mono">Querying Universal Instrument Master &amp; Live Quotes...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="text-slate-400 text-sm">No instruments matched your current discovery filters.</div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 pl-2">SYMBOL &amp; COMPANY</th>
                  <th className="pb-3">EXCHANGE</th>
                  <th className="pb-3">SECTOR / INDUSTRY</th>
                  <th className="pb-3 text-right">PRICE</th>
                  <th className="pb-3 text-right">DAY CHANGE</th>
                  <th className="pb-3 text-right">MARKET CAP</th>
                  <th className="pb-3 text-right">P/E</th>
                  <th className="pb-3 text-right">ROE</th>
                  <th className="pb-3 text-center">FEED STATUS</th>
                  <th className="pb-3 text-right pr-2">RESEARCH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60">
                {items.map((stock) => {
                  const isPositive = stock.change_pct >= 0;
                  const curSym = getCurrencySymbol(stock.currency);
                  return (
                    <tr
                      key={stock.instrument_id}
                      className="hover:bg-slate-50 dark:hover:bg-[#10223B]/60 transition group cursor-pointer"
                    >
                      {/* Symbol & Company */}
                      <td className="py-3.5 pl-2">
                        <Link
                          href={`/company/${stock.symbol.toLowerCase()}`}
                          className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 flex items-center gap-1.5 transition"
                        >
                          <span>{stock.symbol}</span>
                          {stock.has_multiple_listings && (
                            <span className="text-[9px] font-sans font-medium px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400" title={`Has ${stock.total_listings} exchange listings`}>
                              Dual Listed
                            </span>
                          )}
                          {stock.security_type === "ADR" && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/15 text-amber-500">
                              ADR
                            </span>
                          )}
                        </Link>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs md:max-w-sm">
                          {stock.display_name || stock.name}
                        </div>
                        {stock.isin && (
                          <div className="text-[9px] font-mono text-slate-400 mt-0.5 opacity-75">
                            ISIN: {stock.isin}
                          </div>
                        )}
                      </td>

                      {/* Exchange */}
                      <td className="py-3.5 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-700 dark:text-slate-300">
                          {stock.exchange}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{stock.country}</div>
                      </td>

                      {/* Sector & Industry */}
                      <td className="py-3.5 text-slate-600 dark:text-slate-300 text-[11px]">
                        <div className="font-medium">{stock.sector}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{stock.industry}</div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {curSym}
                        {stock.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Day Change */}
                      <td className="py-3.5 text-right font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-0.5 ${
                            isPositive
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                              : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                          }`}
                        >
                          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {isPositive ? "+" : ""}
                          {stock.change_pct.toFixed(2)}%
                        </span>
                      </td>

                      {/* Market Cap */}
                      <td className="py-3.5 text-right font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                        {stock.market_cap_display}
                      </td>

                      {/* P/E Ratio */}
                      <td className="py-3.5 text-right font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                        {stock.pe_ratio !== null ? `${stock.pe_ratio.toFixed(1)}x` : "—"}
                      </td>

                      {/* ROE */}
                      <td className="py-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                        {stock.roe_pct !== null ? `${stock.roe_pct.toFixed(1)}%` : "—"}
                      </td>

                      {/* Data Status */}
                      <td className="py-3.5 text-center font-mono">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            stock.data_status === "LIVE"
                              ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                              : stock.data_status === "DELAYED_15M"
                              ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                              : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {stock.data_status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 text-right pr-2">
                        <Link
                          href={`/company/${stock.symbol.toLowerCase()}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-600 dark:text-white hover:text-white text-[11px] font-bold transition shadow-xs"
                        >
                          Dossier <ArrowRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination Footer */}
          {!isLoading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-[#162C4E] mt-2 text-xs">
              <div className="text-slate-400 font-mono text-[11px]">
                Showing Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of{" "}
                <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span> ({totalResults} total securities)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-[#10223B] transition flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <div className="flex items-center gap-1 font-mono text-xs">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && page > 3) {
                      pageNum = page - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-7 h-7 rounded-lg font-bold transition ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#10223B]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-[#10223B] transition flex items-center gap-1"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </NavigationShell>
  );
}
