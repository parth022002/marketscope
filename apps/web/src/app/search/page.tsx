"use client";

import Link from "next/link";
import { useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { Search as SearchIcon, ArrowUpRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { resolveInstrument, searchInstruments, type Instrument, type ResolveResponse } from "@/lib/api";
import Footer from "@/components/Footer";
import BrandLogo from "@/components/BrandLogo";

const GLOBAL_CHIPS = ["RELIANCE", "TCS", "HDFCBANK", "AAPL", "NVDA", "MSFT", "GOOGL", "TSLA"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    executeSearch(query);
  }

  function handleChipClick(chip: string) {
    setQuery(chip);
    executeSearch(chip);
  }

  return (
    <div className="shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <BrandLogo variant="full" height={38} />
        </div>

        <div>
          <div className="nav-label">RESEARCH WORKSPACE</div>
          <nav className="nav">
            <Link href="/">Platform Overview</Link>
            <Link className="active" href="/search">
              Discover Companies
            </Link>
            <Link href="/compare">Peer Comparison</Link>
            <Link href="/screener">Fundamental Screener</Link>
            <Link href="/watchlists">Watchlists</Link>
            <Link href="/workspace">Workspace &amp; Privacy</Link>
          </nav>
        </div>

        <div className="sidebar-note">
          Evidence-first research workspace. Strictly read-only; no trade execution or broker routing.
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="topbar">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="MarketScope" className="w-5 h-5 rounded object-contain shadow-sm" />
            <strong>Discover Companies</strong>
            <small className="text-slate-400 font-mono">· GLOBAL LIVE UNIVERSE (NSE, BSE, NASDAQ, NYSE, LSE)</small>
          </div>

          <div className="flex items-center gap-3">
            <span className="tag text-[#39E85B] border-[#39E85B]/30 bg-[#39E85B]/10 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39E85B] animate-pulse"></span>
              LIVE MULTI-EXCHANGE
            </span>
            <Show when="signed-in">
              <div className="flex items-center gap-2 pl-3 border-l border-[#132B4F]">
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="text-xs px-3 py-1.5 rounded-lg bg-[#132B4F] text-slate-200 hover:text-white transition font-medium"
              >
                Sign In
              </Link>
            </Show>
          </div>
        </header>

        <div className="content">
          <div className="eyebrow">GLOBAL EQUITY SEARCH & RESOLUTION</div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Research any listed company in the world.</h1>
          <p className="subtitle mt-1">
            Search live across Indian (NSE, BSE) and Global exchanges (NASDAQ, NYSE, LSE). Real-time quotes, audited filings, and deterministic financial metrics.
          </p>

          {/* Search Input Bar */}
          <form className="search-row my-6" onSubmit={handleSubmit}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any global or Indian ticker (e.g. RELIANCE, TCS, AAPL, NVDA, MSFT, TSLA)"
              aria-label="Company search"
              className="w-full px-4 py-3 rounded-xl bg-[#0B1D38] border border-[#132B4F] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#087BEE]"
            />
            <button className="btn" type="submit" disabled={loading}>
              <SearchIcon size={15} /> {loading ? "Resolving..." : "Search"}
            </button>
          </form>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs text-slate-400 font-medium">Global Leaders:</span>
            {GLOBAL_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-slate-300 hover:text-white hover:border-[#087BEE] transition"
              >
                {chip}
              </button>
            ))}
          </div>

          {error && <p className="notice mb-6">{error}</p>}

          {/* Disambiguation Banner when multiple listings match */}
          {resolution?.requires_disambiguation && (
            <div className="my-6 p-5 rounded-2xl bg-[#0B1D38] border border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <AlertTriangle size={18} />
                <span>Multiple Listings Found — Disambiguation Required</span>
              </div>
              <p className="text-xs text-slate-300">
                {resolution.resolution_message} MarketScope.io never auto-guesses ticker collisions. Please select your target listing:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {resolution.candidates.map((cand) => (
                  <Link
                    key={`${cand.symbol}-${cand.exchange_code}`}
                    href={`/company/${cand.symbol.toLowerCase()}`}
                    className="p-3.5 rounded-xl bg-[#07152B] border border-[#132B4F] hover:border-[#087BEE] transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-sm group-hover:text-[#16C8D5] transition">
                          {cand.symbol}
                        </strong>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#132B4F] text-slate-300">
                          {cand.exchange_code}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/60 text-[#087BEE]">
                          {cand.instrument_type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{cand.company_name}</div>
                      {cand.isin && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">ISIN: {cand.isin}</div>
                      )}
                    </div>
                    <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Single Resolution Success Confirmation */}
          {resolution?.resolved && resolution.instrument && (
            <div className="my-6 p-4 rounded-xl bg-[#0B1D38] border border-[#39E85B]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#39E85B]">
                <CheckCircle2 size={16} />
                <span>{resolution.resolution_message}</span>
              </div>
              <Link
                href={`/company/${resolution.instrument.symbol.toLowerCase()}`}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#39E85B] text-black font-semibold hover:bg-[#2ecc4c] transition"
              >
                Open Dossier →
              </Link>
            </div>
          )}

          {/* Standard Search Results List */}
          <div className="section-head flex items-center justify-between mt-8 mb-4">
            <h2>Available Instruments</h2>
            <span className="tag amber">Synthetic demo data</span>
          </div>

          <div className="list space-y-3">
            {items.map((item) => (
              <Link
                className="result p-4 rounded-xl bg-[#0B1D38] border border-[#132B4F] hover:border-[#087BEE] transition flex items-center justify-between group"
                key={item.instrument_id}
                href={`/company/${item.symbol.toLowerCase()}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-base text-white group-hover:text-[#16C8D5] transition">
                      {item.symbol}
                    </strong>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#132B4F] text-slate-300">
                      {item.exchange}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 mt-0.5">{item.company_name}</div>
                  <small className="muted text-xs text-slate-400 block mt-1">
                    Sector: {item.sector} · Base: {item.currency}
                  </small>
                </div>
                <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white transition" />
              </Link>
            ))}

            {items.length === 0 && !loading && (
              <div className="card subtitle p-8 rounded-xl bg-[#0B1D38] border border-dashed border-[#132B4F] text-center text-slate-400">
                Search for an Indian equity symbol (e.g. RELIANCE, TCS, INFY) to inspect its dossier, deterministic metrics, and filing lineage.
              </div>
            )}
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
