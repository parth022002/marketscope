"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, ArrowUpRight, AlertTriangle, CheckCircle2, Compass } from "lucide-react";
import { resolveInstrument, searchInstruments, type Instrument, type ResolveResponse } from "@/lib/api";
import NavigationShell from "@/components/NavigationShell";

const GLOBAL_CHIPS = ["RELIANCE", "TCS", "HDFCBANK", "AAPL", "NVDA", "MSFT", "GOOGL", "TSLA"];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<Instrument[]>([]);
  const [resolution, setResolution] = useState<ResolveResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function executeSearch(searchQuery: string) {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setResolution(null);

    try {
      const [searchResults, resolveResult] = await Promise.all([
        searchInstruments(searchQuery.trim()),
        resolveInstrument(searchQuery.trim()),
      ]);
      setItems(searchResults);
      setResolution(resolveResult);
    } catch {
      setError("Could not reach the MarketScope.io API. Confirm that FastAPI service is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeSearch(query);
  }

  function handleChipClick(chip: string) {
    setQuery(chip);
    executeSearch(chip);
  }

  return (
    <NavigationShell activePath="/stocks">
      <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#132B4F]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-500 dark:text-[#16C8D5] uppercase">
              <Compass size={14} /> Canonical Identity &amp; Resolution
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Search &amp; Resolve Listed Companies
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
              Search live across Indian (NSE, BSE) and Global exchanges (NASDAQ, NYSE). Deterministic symbol resolution, disambiguation checks, and direct dossier navigation.
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <form className="p-4 md:p-5 rounded-2xl bg-white dark:bg-[#0B1D38] border border-slate-200 dark:border-[#132B4F] space-y-3 shadow-sm dark:shadow-md" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any global or Indian ticker (e.g. RELIANCE, TCS, AAPL, NVDA, MSFT, TSLA)..."
                aria-label="Company search"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#07152B] border border-slate-200 dark:border-[#132B4F] text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm shrink-0"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resolving..." : "Search"}
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#132B4F]/60">
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Global Leaders:</span>
            {GLOBAL_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#07152B] border border-slate-200 dark:border-[#132B4F] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-blue-500 transition"
              >
                {chip}
              </button>
            ))}
          </div>
        </form>

        {error && <p className="p-4 rounded-xl bg-rose-50 dark:bg-red-950/40 border border-rose-200 dark:border-red-800 text-rose-600 dark:text-[#F06464] text-xs">{error}</p>}

        {/* Disambiguation Banner when multiple listings match */}
        {resolution?.requires_disambiguation && (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1D38] border border-amber-300 dark:border-amber-500/40 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-bold">
              <AlertTriangle size={18} />
              <span>Multiple Listings Found — Disambiguation Required</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {resolution.resolution_message} MarketScope.io never auto-guesses ticker collisions. Please select your target listing:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {resolution.candidates.map((cand) => (
                <Link
                  key={`${cand.symbol}-${cand.exchange_code}`}
                  href={`/company/${cand.symbol.toLowerCase()}`}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07152B] border border-slate-200 dark:border-[#132B4F] hover:border-blue-500 transition flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-white text-sm group-hover:text-cyan-500 dark:group-hover:text-[#16C8D5] transition font-mono">
                        {cand.symbol}
                      </strong>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-[#132B4F] text-slate-700 dark:text-slate-300 font-mono">
                        {cand.exchange_code}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cand.company_name}</div>
                    {cand.isin && (
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ISIN: {cand.isin}</div>
                    )}
                  </div>
                  <ArrowUpRight size={16} className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Single Resolution Success Confirmation */}
        {resolution?.resolved && resolution.instrument && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#0B1D38] border border-emerald-200 dark:border-[#39E85B]/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-[#39E85B] font-medium">
              <CheckCircle2 size={16} />
              <span>{resolution.resolution_message}</span>
            </div>
            <Link
              href={`/company/${resolution.instrument.symbol.toLowerCase()}`}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition shadow-sm"
            >
              Open Dossier →
            </Link>
          </div>
        )}

        {/* Available Instruments Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
              Matching Instruments ({items.length})
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-50 dark:bg-[#16C8D5]/15 text-cyan-700 dark:text-[#16C8D5] border border-cyan-200 dark:border-[#16C8D5]/30">
              UNIVERSAL MULTI-MARKET DISCOVERY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item) => (
              <Link
                key={item.instrument_id}
                href={`/stocks/${item.instrument_id}`}
                className="p-4 rounded-xl bg-white dark:bg-[#0B1D38] border border-slate-200 dark:border-[#132B4F] hover:border-blue-500 transition flex items-center justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-[#16C8D5] transition font-mono">
                      {item.symbol}
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#07152B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#132B4F]">
                      {item.exchange}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {item.data_status || "LIVE_MARKET"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">{item.company_name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Sector: {item.sector} · Country: {item.country || "Global"}
                  </div>
                  {item.isin && (
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      ISIN: {item.isin}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.price && (
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {item.currency === "INR" ? "₹" : "$"}{item.price.toFixed(2)}
                    </span>
                  )}
                  <ArrowUpRight size={16} className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
                </div>
              </Link>
            ))}

            {items.length === 0 && !loading && (
              <div className="col-span-2 p-12 rounded-2xl bg-white dark:bg-[#0B1D38] border border-dashed border-slate-200 dark:border-[#132B4F] text-center text-slate-500 dark:text-slate-400 text-xs">
                Search for any Indian (NSE/BSE) or global equity (NASDAQ, NYSE, LSE, TSE) by ticker, company name, ISIN (e.g. INE062A01020), or BSE scrip code (e.g. 500325).
              </div>
            )}
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <NavigationShell activePath="/stocks">
          <div className="flex items-center justify-center min-h-[50vh] text-slate-500 dark:text-slate-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mr-2" />
            Loading Search...
          </div>
        </NavigationShell>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
