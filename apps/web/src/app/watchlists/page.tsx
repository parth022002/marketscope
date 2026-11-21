"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Show, UserButton } from "@clerk/nextjs";
import { Bookmark, Plus, Trash2, ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
  DEFAULT_WORKSPACE_ID,
  getWatchlists,
  createWatchlist,
  deleteWatchlistItem,
  type Watchlist,
} from "@/lib/api";
import Footer from "@/components/Footer";

export default function WatchlistsPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [activeWlId, setActiveWlId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Watchlist Form
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const loadWatchlists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWatchlists(DEFAULT_WORKSPACE_ID);
      setWatchlists(data);
      if (data.length > 0 && !activeWlId) {
        setActiveWlId(data[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load watchlists";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [activeWlId]);

  useEffect(() => {
    loadWatchlists();
  }, [loadWatchlists]);

  async function handleCreateWatchlist(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      const created = await createWatchlist(DEFAULT_WORKSPACE_ID, {
        name: name.trim(),
        description: description.trim(),
      });
      setWatchlists((prev) => [created, ...prev]);
      setActiveWlId(created.id);
      setName("");
      setDescription("");
      setIsCreating(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create watchlist";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(watchlistId: string, itemId: string) {
    if (!confirm("Remove this ticker from watchlist?")) return;
    try {
      await deleteWatchlistItem(DEFAULT_WORKSPACE_ID, watchlistId, itemId);
      setWatchlists((prev) =>
        prev.map((wl) =>
          wl.id === watchlistId ? { ...wl, items: wl.items.filter((i) => i.id !== itemId) } : wl
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      setError(msg);
    }
  }

  const activeWatchlist = watchlists.find((w) => w.id === activeWlId);

  return (
    <div className="shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            Market<span>Scope</span>
          </div>
          <div className="brand-sub">FINANCIAL RESEARCH & INTELLIGENCE</div>
        </div>

        <div>
          <div className="nav-label">RESEARCH WORKSPACE</div>
          <nav className="nav">
            <Link href="/">Platform Overview</Link>
            <Link href="/search">Discover Companies</Link>
            <Link href="/compare">Peer Comparison</Link>
            <Link href="/screener">Fundamental Screener</Link>
            <Link className="active" href="/watchlists">
              Watchlists
            </Link>
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
            <strong>Workspace Watchlists</strong>
            <small className="text-slate-400 font-mono">· NEON DATABASE BACKED</small>
          </div>

          <div className="flex items-center gap-3">
            <span className="tag text-[#16C8D5] border-[#16C8D5]/30 bg-[#16C8D5]/10">
              Tenant Isolated
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
          <div className="eyebrow flex items-center gap-1.5">
            <Bookmark size={14} className="text-[#16C8D5]" /> Portfolio & Research Tracking
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Custom Research Watchlists</h1>
              <p className="subtitle mt-1">
                Maintain organized lists of companies under active coverage with live fundamental data.
              </p>
            </div>
            <button
              onClick={() => setIsCreating((prev) => !prev)}
              className="btn flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#087BEE] hover:bg-[#0769cc] text-white transition shrink-0"
            >
              <Plus size={15} /> {isCreating ? "Cancel" : "New Watchlist"}
            </button>
          </div>

          {error && <div className="my-4 p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-[#F06464] text-xs">{error}</div>}

          {/* New Watchlist Form */}
          {isCreating && (
            <form onSubmit={handleCreateWatchlist} className="my-6 p-5 rounded-xl bg-[#0B1D38] border border-[#132B4F] space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create New Watchlist</h3>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Watchlist Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. FY25 Turnaround Candidates"
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-sm focus:outline-none focus:border-[#087BEE]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Thesis context or monitoring triggers..."
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-sm focus:outline-none focus:border-[#087BEE]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#132B4F] text-slate-300 hover:text-white text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-[#39E85B] text-black font-semibold text-xs hover:bg-[#2ecc4c] transition"
                >
                  {saving ? "Creating..." : "Create Watchlist"}
                </button>
              </div>
            </form>
          )}

          {/* Watchlists Tabs */}
          {watchlists.length > 0 && (
            <div className="my-6 flex items-center gap-2 border-b border-[#132B4F] pb-3 overflow-x-auto">
              {watchlists.map((wl) => (
                <button
                  key={wl.id}
                  onClick={() => setActiveWlId(wl.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition border flex items-center gap-1.5 whitespace-nowrap ${
                    activeWlId === wl.id
                      ? "bg-[#087BEE] border-[#087BEE] text-white shadow-md"
                      : "bg-[#0B1D38] border-[#132B4F] text-slate-300 hover:text-white"
                  }`}
                >
                  <Bookmark size={13} /> {wl.name} ({wl.items.length})
                </button>
              ))}
            </div>
          )}

          {/* Active Watchlist Items */}
          {loading && (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#087BEE] border-t-transparent mb-3" />
              <p className="text-sm">Loading workspace watchlists from Neon...</p>
            </div>
          )}

          {!loading && activeWatchlist && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{activeWatchlist.name}</h3>
                  {activeWatchlist.description && (
                    <p className="text-xs text-slate-400">{activeWatchlist.description}</p>
                  )}
                </div>
                <span className="text-xs text-[#39E85B] flex items-center gap-1">
                  <CheckCircle2 size={12} /> Neon Cluster Verified
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#132B4F] bg-[#07152B] shadow-2xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0B1D38] border-b border-[#132B4F] text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3 px-4">Symbol</th>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Added On</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#132B4F]/60 text-slate-300">
                    {activeWatchlist.items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#0B1D38]/50 transition">
                        <td className="py-3.5 px-4 font-bold text-white">{item.symbol}</td>
                        <td className="py-3.5 px-4 text-slate-300 text-xs">{item.company_name}</td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">
                          {new Date(item.added_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/company/${item.symbol.toLowerCase()}`}
                              className="text-xs px-2.5 py-1 rounded bg-[#132B4F] text-[#16C8D5] hover:text-white transition flex items-center gap-1 font-medium"
                            >
                              Dossier <ArrowUpRight size={12} />
                            </Link>
                            <button
                              onClick={() => handleDeleteItem(activeWatchlist.id, item.id)}
                              className="p-1 rounded text-slate-500 hover:text-[#F06464] transition"
                              title="Remove ticker"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {activeWatchlist.items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 text-sm">
                          No tickers in this watchlist yet. Go to Discover or any company dossier to add tickers.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && watchlists.length === 0 && (
            <div className="py-16 text-center rounded-2xl bg-[#0B1D38] border border-dashed border-[#132B4F] p-8">
              <Bookmark size={28} className="mx-auto text-slate-500 mb-2" />
              <h3 className="text-base font-bold text-white">No watchlists created yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Create custom watchlists to track groups of companies, sector baskets, or turnaround candidates.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-[#087BEE] text-white text-xs font-semibold hover:bg-[#0769cc] transition"
              >
                Create First Watchlist
              </button>
            </div>
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}
