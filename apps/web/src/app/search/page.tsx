"use client";

import Link from "next/link";
import { useState } from "react";
import { Search as SearchIcon, ArrowUpRight } from "lucide-react";
import { searchInstruments, type Instrument } from "@/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setError("");
    try { setItems(await searchInstruments(query.trim())); }
    catch { setError("Could not reach the API. Confirm that the FastAPI service is running."); }
    finally { setLoading(false); }
  }

  return <div className="shell">
    <aside className="sidebar"><div><div className="brand">Market<span>Scope</span></div><div className="brand-sub">FINANCIAL RESEARCH & INTELLIGENCE</div></div>
      <div><div className="nav-label">WORKSPACE</div><nav className="nav"><Link href="/">Overview</Link><Link className="active" href="/search">Discover</Link><Link href="/search">Compare</Link><Link href="/search">Watchlists</Link></nav></div>
      <div className="sidebar-note">Read-only research workspace. No trading or broker execution.</div>
    </aside>
    <main className="main"><header className="topbar"><strong>Discover companies</strong><small>SYNTHETIC DEMO UNIVERSE</small></header>
      <div className="content"><div className="eyebrow">Discover</div><h1>Find a company to research.</h1>
        <p className="subtitle">Search by company name or supported symbol. Ambiguous matches should be resolved before a dossier is created.</p>
        <form className="search-row" onSubmit={submit}>
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Try RELIANCE, TCS or INFY" aria-label="Company search"/>
          <button className="btn" type="submit" disabled={loading}><SearchIcon size={15}/> {loading ? "Searching..." : "Search"}</button>
        </form>
        {error && <p className="notice" style={{marginTop:16}}>{error}</p>}
        <div className="section-head"><h2>Search results</h2><span className="tag amber">Synthetic demo data</span></div>
        <div className="list">
          {items.map(item=><Link className="result" key={item.instrument_id} href={`/company/${item.symbol.toLowerCase()}`}>
            <div><strong>{item.symbol}</strong><div className="subtitle">{item.company_name}</div><small className="muted">{item.exchange} · {item.sector}</small></div><ArrowUpRight size={16}/>
          </Link>)}
          {items.length===0 && !loading && <div className="card subtitle">No results yet. Search a demo symbol to begin.</div>}
        </div>
      </div>
    </main>
  </div>;
}
