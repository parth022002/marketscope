"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Calendar,
  Zap,
  Search,
  Building2,
  Coins,
  ArrowUpRight,
  Sliders,
  DollarSign,
  BarChart2,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import { searchUniversalInstruments, type UniversalInstrument } from "@/lib/api";

const DISCOVERY_TABS = [
  { id: "stocks", label: "Stock Screener", icon: Filter },
  { id: "etfs", label: "ETF Screener", icon: Layers },
  { id: "mutual_funds", label: "Mutual Funds", icon: Sparkles },
  { id: "ipos", label: "IPO Centre", icon: Calendar },
  { id: "unusual_volume", label: "Unusual Volume", icon: Activity },
];

interface ScreenerStock {
  symbol: string;
  name: string;
  exchange: string;
  price: string;
  change: string;
  isPositive: boolean;
  market_cap: string;
  cap_tier: "LARGE" | "MID" | "SMALL";
  sector: string;
  pe: string;
  roe: string;
}

const STOCK_UNIVERSE: ScreenerStock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", exchange: "NSE", price: "₹1,377.50", change: "+0.14%", isPositive: true, market_cap: "₹19.91L Cr", cap_tier: "LARGE", sector: "Energy & Petrochem", pe: "24.8", roe: "9.2%" },
  { symbol: "TCS", name: "Tata Consultancy Services", exchange: "NSE", price: "₹4,180.20", change: "+1.10%", isPositive: true, market_cap: "₹14.92L Cr", cap_tier: "LARGE", sector: "Information Technology", pe: "29.4", roe: "49.6%" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", exchange: "NSE", price: "₹1,745.80", change: "+0.95%", isPositive: true, market_cap: "₹13.34L Cr", cap_tier: "LARGE", sector: "Financial Services", pe: "18.6", roe: "15.4%" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", exchange: "NSE", price: "₹1,620.00", change: "+0.83%", isPositive: true, market_cap: "₹9.75L Cr", cap_tier: "LARGE", sector: "Telecommunication", pe: "54.2", roe: "18.1%" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", exchange: "NSE", price: "₹1,315.00", change: "+2.80%", isPositive: true, market_cap: "₹9.24L Cr", cap_tier: "LARGE", sector: "Financial Services", pe: "17.8", roe: "18.8%" },
  { symbol: "INFY", name: "Infosys Ltd", exchange: "NSE", price: "₹1,885.60", change: "-0.65%", isPositive: false, market_cap: "₹7.82L Cr", cap_tier: "LARGE", sector: "Information Technology", pe: "28.1", roe: "31.8%" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", exchange: "NSE", price: "₹942.50", change: "+4.18%", isPositive: true, market_cap: "₹3.45L Cr", cap_tier: "LARGE", sector: "Automobile & EV", pe: "11.2", roe: "33.5%" },
  { symbol: "LT", name: "Larsen & Toubro Ltd", exchange: "NSE", price: "₹3,620.00", change: "+0.45%", isPositive: true, market_cap: "₹4.98L Cr", cap_tier: "LARGE", sector: "Capital Goods & Infra", pe: "34.5", roe: "14.2%" },
  { symbol: "SUZLON", name: "Suzlon Energy Ltd", exchange: "NSE", price: "₹68.40", change: "+4.90%", isPositive: true, market_cap: "₹93,400 Cr", cap_tier: "MID", sector: "Renewable Energy", pe: "48.2", roe: "22.6%" },
  { symbol: "ZOMATO", name: "Zomato Ltd (Eternal)", exchange: "NSE", price: "₹264.80", change: "+3.20%", isPositive: true, market_cap: "₹2.34L Cr", cap_tier: "MID", sector: "Consumer Tech", pe: "112.5", roe: "4.8%" },
  { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", price: "$148.20", change: "+3.85%", isPositive: true, market_cap: "$3.58T", cap_tier: "LARGE", sector: "Semiconductors", pe: "48.2", roe: "115.4%" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", price: "$232.50", change: "+1.20%", isPositive: true, market_cap: "$3.54T", cap_tier: "LARGE", sector: "Consumer Tech", pe: "34.1", roe: "147.2%" },
];

const ETF_UNIVERSE = [
  { symbol: "NIFTYBEES", name: "Nippon India ETF Nifty 50 BeES", exchange: "NSE", aum: "₹28,450 Cr", nav: "₹262.45", change: "+0.52%", ter: "0.04%", type: "Benchmark Equity" },
  { symbol: "BANKBEES", name: "Nippon India ETF Nifty Bank BeES", exchange: "NSE", aum: "₹12,180 Cr", nav: "₹524.10", change: "+0.41%", ter: "0.16%", type: "Sector Banking" },
  { symbol: "GOLDBEES", name: "Nippon India ETF Gold BeES", exchange: "NSE", aum: "₹14,920 Cr", nav: "₹68.90", change: "+0.28%", ter: "0.78%", type: "Physical Gold" },
  { symbol: "LIQUIDBEES", name: "Nippon India ETF Liquid BeES", exchange: "NSE", aum: "₹18,500 Cr", nav: "₹1,000.00", change: "+0.01%", ter: "0.68%", type: "Overnight Debt" },
  { symbol: "MON100", name: "Motilal Oswal Nasdaq 100 ETF", exchange: "NSE", aum: "₹8,420 Cr", nav: "₹172.80", change: "-0.41%", ter: "0.57%", type: "US Technology (LRS)" },
  { symbol: "MASPTOP50", name: "Mirae Asset S&P 500 Top 50 ETF", exchange: "NSE", aum: "₹2,150 Cr", nav: "₹48.20", change: "+0.21%", ter: "0.62%", type: "US Large Cap (LRS)" },
];

const MUTUAL_FUNDS_UNIVERSE = [
  { code: "122639", name: "Parag Parikh Flexi Cap Fund - Direct", house: "PPFAS Mutual Fund", category: "Flexi Cap", nav: "₹78.42", return_1y: "+29.8%", return_3y: "+19.4%", aum: "₹68,500 Cr" },
  { code: "120823", name: "SBI Bluechip Fund - Direct Plan", house: "SBI Mutual Fund", category: "Large Cap", nav: "₹94.20", return_1y: "+22.4%", return_3y: "+14.1%", aum: "₹48,900 Cr" },
  { code: "120716", name: "HDFC Nifty 50 Index Fund - Growth", house: "HDFC Mutual Fund", category: "Index Fund", nav: "₹215.10", return_1y: "+24.1%", return_3y: "+15.0%", aum: "₹14,200 Cr" },
  { code: "125354", name: "Mirae Asset Large & Midcap Fund - Direct", house: "Mirae Asset MF", category: "Large & Mid Cap", nav: "₹142.50", return_1y: "+28.2%", return_3y: "+18.6%", aum: "₹39,800 Cr" },
  { code: "120503", name: "Nippon India Small Cap Fund - Direct", house: "Nippon India MF", category: "Small Cap", nav: "₹168.90", return_1y: "+38.4%", return_3y: "+26.8%", aum: "₹56,200 Cr" },
];

const UPCOMING_IPOS = [
  { name: "Swiggy Limited", exchange: "NSE/BSE", price_band: "₹371 - ₹390", issue_size: "₹11,327 Cr", open_date: "Active", status: "OPEN", gmp: "+₹18 (4.6%)" },
  { name: "NTPC Green Energy", exchange: "NSE/BSE", price_band: "₹102 - ₹108", issue_size: "₹10,000 Cr", open_date: "Next Week", status: "UPCOMING", gmp: "+₹12 (11.1%)" },
  { name: "Hyundai Motor India", exchange: "NSE/BSE", price_band: "₹1,865 - ₹1,960", issue_size: "₹27,870 Cr", open_date: "Listed", status: "CLOSED", gmp: "Listed" },
  { name: "Waaree Energies", exchange: "NSE/BSE", price_band: "₹1,427 - ₹1,503", issue_size: "₹4,321 Cr", open_date: "Listed", status: "CLOSED", gmp: "+69% Listing" },
];

const UNUSUAL_VOLUME = [
  { symbol: "SUZLON", name: "Suzlon Energy Ltd", volume: "42.8M", avg_vol: "12.5M", surge: "3.4x", price: "₹68.40", change: "+4.90%", note: "Heavy institutional delivery spike" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", volume: "18.4M", avg_vol: "7.1M", surge: "2.6x", price: "₹942.50", change: "+4.18%", note: "Block deal on JLR quarterly guidance" },
  { symbol: "COCHINSHIP", name: "Cochin Shipyard Ltd", volume: "8.9M", avg_vol: "2.8M", surge: "3.2x", price: "₹1,680.00", change: "+6.85%", note: "Ministry defense procurement announcement" },
  { symbol: "BHEL", name: "Bharat Heavy Electricals", volume: "24.1M", avg_vol: "8.9M", surge: "2.7x", price: "₹245.80", change: "+3.65%", note: "Thermal power order-book expansion" },
];

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("stocks");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UniversalInstrument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [marketCapFilter, setMarketCapFilter] = useState<"ALL" | "LARGE" | "MID" | "SMALL">("ALL");
  const [sectorFilter, setSectorFilter] = useState("ALL");

  // Debounced search
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

  // Filtered stocks
  const filteredStocks = useMemo(() => {
    return STOCK_UNIVERSE.filter((s) => {
      if (marketCapFilter !== "ALL" && s.cap_tier !== marketCapFilter) return false;
      if (sectorFilter !== "ALL" && !s.sector.toLowerCase().includes(sectorFilter.toLowerCase())) return false;
      return true;
    });
  }, [marketCapFilter, sectorFilter]);

  return (
    <NavigationShell activePath="/discover">
      <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-sky-500" />
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Market Discovery Hub
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold">
                UNIVERSAL SEARCH
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Filter and screen across Indian (NSE, BSE) and international equities, ETFs, mutual funds, IPOs, and unusual volume movers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/screener"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Quantitative Screener</span>
            </Link>
          </div>
        </div>

        {/* Live Universal Search Bar */}
        <div className="relative w-full max-w-2xl">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any stock, ticker, ISIN, ETF, mutual fund, or commodity..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-sm transition"
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

          {/* Autocomplete Results Dropdown */}
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#162C4E]">
              {isSearching ? (
                <div className="p-4 text-xs text-slate-500 text-center">Searching catalog...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <Link
                    key={item.instrument_id}
                    href={`/company/${item.symbol.toLowerCase()}`}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-[#10223D] transition flex items-center justify-between gap-3 text-left block"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs font-mono">{item.symbol}</span>
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono bg-sky-50 dark:bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-500/20">
                          {item.exchange}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.asset_class}</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-sm mt-0.5">
                        {item.name}
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-400 shrink-0" />
                  </Link>
                ))
              ) : (
                <div className="p-4 text-xs text-slate-500 text-center">
                  No instruments found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Discovery Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-[#162C4E]/80 no-scrollbar">
          {DISCOVERY_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  active
                    ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                    : "bg-white dark:bg-[#0B1528] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#162C4E]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-slate-950" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: STOCK SCREENER ────────────────────────────────────── */}
        {activeTab === "stocks" && (
          <div className="space-y-4 animate-in fade-in">
            {/* Filter Controls Bar */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Market Cap:</span>
                {(["ALL", "LARGE", "MID", "SMALL"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setMarketCapFilter(tier)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                      marketCapFilter === tier
                        ? "bg-sky-500 text-slate-950 font-bold"
                        : "bg-slate-100 dark:bg-[#162C4E] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Sector:</span>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-[#162C4E] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="Technology">Information Technology</option>
                  <option value="Financial">Financial Services</option>
                  <option value="Energy">Energy & Power</option>
                  <option value="Automobile">Automobile & EV</option>
                  <option value="Semiconductors">Semiconductors</option>
                </select>
              </div>
            </div>

            {/* Stocks Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Instrument</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4 text-right">LTP</th>
                    <th className="py-3 px-4 text-right">24h Change</th>
                    <th className="py-3 px-4 text-right">Market Cap</th>
                    <th className="py-3 px-4 text-right">P/E</th>
                    <th className="py-3 px-4 text-right">ROE</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-800 dark:text-slate-200">
                  {filteredStocks.map((stock) => (
                    <tr key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/company/${stock.symbol.toLowerCase()}`}
                            className="font-bold text-sky-600 dark:text-sky-400 hover:underline text-sm font-mono"
                          >
                            {stock.symbol}
                          </Link>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {stock.exchange}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{stock.name}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{stock.sector}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {stock.price}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold ${
                          stock.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {stock.change}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">{stock.market_cap}</td>
                      <td className="py-3.5 px-4 text-right font-mono">{stock.pe}x</td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {stock.roe}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href={`/company/${stock.symbol.toLowerCase()}`}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500 text-sky-600 dark:text-sky-300 hover:text-slate-950 font-semibold text-[11px] inline-flex items-center gap-1 transition"
                        >
                          Dossier <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: ETF SCREENER ───────────────────────────────────────── */}
        {activeTab === "etfs" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">ETF Name</th>
                    <th className="py-3 px-4">Benchmark / Category</th>
                    <th className="py-3 px-4 text-right">NAV / Market Price</th>
                    <th className="py-3 px-4 text-right">24h Change</th>
                    <th className="py-3 px-4 text-right">AUM</th>
                    <th className="py-3 px-4 text-right">TER</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-800 dark:text-slate-200">
                  {ETF_UNIVERSE.map((etf) => (
                    <tr key={etf.symbol} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sky-600 dark:text-sky-400 text-sm font-mono">{etf.symbol}</div>
                        <p className="text-xs text-slate-500">{etf.name}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20">
                          {etf.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {etf.nav}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold ${
                          etf.change.startsWith("+")
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {etf.change}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">{etf.aum}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">{etf.ter}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Link
                          href="/markets"
                          className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500 text-sky-600 dark:text-sky-300 hover:text-slate-950 font-semibold text-[11px] inline-flex items-center gap-1 transition"
                        >
                          View Quotes <ArrowRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: MUTUAL FUNDS ───────────────────────────────────────── */}
        {activeTab === "mutual_funds" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Fund Scheme</th>
                    <th className="py-3 px-4">Fund House</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Latest NAV</th>
                    <th className="py-3 px-4 text-right">1Y Return</th>
                    <th className="py-3 px-4 text-right">3Y CAGR</th>
                    <th className="py-3 px-4 text-right">AUM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-800 dark:text-slate-200">
                  {MUTUAL_FUNDS_UNIVERSE.map((mf) => (
                    <tr key={mf.code} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{mf.name}</div>
                        <span className="text-[10px] font-mono text-slate-400">AMFI Code: {mf.code}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{mf.house}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {mf.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {mf.nav}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {mf.return_1y}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {mf.return_3y}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">{mf.aum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: IPO CENTRE ─────────────────────────────────────────── */}
        {activeTab === "ipos" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UPCOMING_IPOS.map((ipo) => (
                <div
                  key={ipo.name}
                  className="p-5 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        ipo.status === "OPEN"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : ipo.status === "UPCOMING"
                          ? "bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      }`}
                    >
                      {ipo.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{ipo.exchange}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{ipo.name}</h3>
                  <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Price Band:</span>
                      <span className="font-mono font-bold">{ipo.price_band}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Issue Size:</span>
                      <span className="font-mono font-bold">{ipo.issue_size}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Grey Market Premium (GMP):</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{ipo.gmp}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Timeline:</span>
                      <span className="font-semibold text-sky-600 dark:text-sky-400">{ipo.open_date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: UNUSUAL VOLUME ─────────────────────────────────────── */}
        {activeTab === "unusual_volume" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Instrument</th>
                    <th className="py-3 px-4 text-right">Volume</th>
                    <th className="py-3 px-4 text-right">30D Avg Volume</th>
                    <th className="py-3 px-4 text-right">Surge Multiple</th>
                    <th className="py-3 px-4 text-right">LTP</th>
                    <th className="py-3 px-4 text-right">Change</th>
                    <th className="py-3 px-4">Driver / Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-800 dark:text-slate-200">
                  {UNUSUAL_VOLUME.map((v) => (
                    <tr key={v.symbol} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 text-sm">
                        <Link href={`/company/${v.symbol.toLowerCase()}`} className="hover:underline">
                          {v.symbol}
                        </Link>
                        <p className="text-xs text-slate-500 font-sans">{v.name}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">{v.volume}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">{v.avg_vol}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {v.surge}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">{v.price}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {v.change}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{v.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
