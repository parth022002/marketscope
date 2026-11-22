"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Bookmark, Plus, Trash2, ArrowUpRight, CheckCircle2, Building2 } from "lucide-react";
import {
  DEFAULT_WORKSPACE_ID,
  getWatchlists,
  createWatchlist,
  deleteWatchlistItem,
  type Watchlist,
} from "@/lib/api";
import NavigationShell from "@/components/NavigationShell";

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
    <NavigationShell activePath="/watchlists">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <Bookmark size={14} /> Multi-Tenant Portfolios
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Custom Research Watchlists
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Organize tracked equities, monitor live price movements, and receive contextual news alerts directly tied to your coverage universe.
            </p>
          </div>

          <button
            onClick={() => setIsCreating((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-xs shrink-0"
          >
            <Plus size={15} /> {isCreating ? "Cancel" : "New Watchlist"}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* New Watchlist Form */}
        {isCreating && (
          <form
            onSubmit={handleCreateWatchlist}
            className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-xs"
          >
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Create New Research Watchlist
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Watchlist Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. FY27 High Return Compounders"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Thesis context or monitoring triggers..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#162C4E] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-xs"
              >
                {saving ? "Creating..." : "Save Watchlist"}
              </button>
            </div>
          </form>
        )}

        {/* Watchlist Tabs */}
        {watchlists.length > 0 && (
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#162C4E] pb-3 overflow-x-auto scrollbar-none">
            {watchlists.map((wl) => (
              <button
                key={wl.id}
                onClick={() => setActiveWlId(wl.id)}
                className={`text-xs px-4 py-2 rounded-xl font-bold transition border flex items-center gap-1.5 whitespace-nowrap ${
                  activeWlId === wl.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-xs"
                    : "bg-white dark:bg-[#0B1930] border-slate-200 dark:border-[#162C4E] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Bookmark size={13} /> {wl.name} ({wl.items.length})
              </button>
            ))}
          </div>
        )}

        {/* Active Items Table */}
        {!loading && activeWatchlist && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{activeWatchlist.name}</h3>
                {activeWatchlist.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeWatchlist.description}</p>
                )}
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 size={12} /> Neon Cluster Verified
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1930] overflow-x-auto shadow-xs scrollbar-none">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-3">Symbol</th>
                    <th className="py-3 px-3">Company Name</th>
                    <th className="py-3 px-3">Added Date</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-700 dark:text-slate-300">
                  {activeWatchlist.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#10223B]/60 transition">
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white font-mono">{item.symbol}</td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{item.company_name}</td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(item.added_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/company/${item.symbol.toLowerCase()}`}
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-600 dark:text-white hover:text-white transition flex items-center gap-1 font-semibold"
                          >
                            Dossier <ArrowUpRight size={11} />
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(activeWatchlist.id, item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                            title="Remove ticker"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {activeWatchlist.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 text-xs">
                        No tickers in this watchlist yet. Go to Discover Companies to add tickers.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
