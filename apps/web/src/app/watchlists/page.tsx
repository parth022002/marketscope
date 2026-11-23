"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  Bookmark,
  Plus,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Search,
  Sparkles,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react";
import {
  DEFAULT_WORKSPACE_ID,
  getWatchlists,
  createWatchlist,
  deleteWatchlistItem,
  addWatchlistItem,
  STARTER_WATCHLISTS,
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

  // Add Item Form
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [addSymbol, setAddSymbol] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addingSaving, setAddingSaving] = useState(false);

  const loadWatchlists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWatchlists(DEFAULT_WORKSPACE_ID);
      const list = data && data.length > 0 ? data : STARTER_WATCHLISTS;
      setWatchlists(list);
      if (list.length > 0) {
        setActiveWlId((prev) => (prev && list.some((w) => w.id === prev) ? prev : list[0].id));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load watchlists";
      setError(msg);
      setWatchlists(STARTER_WATCHLISTS);
      setActiveWlId(STARTER_WATCHLISTS[0].id);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWatchlists();
  }, [loadWatchlists]);

  // Persist locally
  const syncStorage = (updated: Watchlist[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`marketscope_watchlists_${DEFAULT_WORKSPACE_ID}`, JSON.stringify(updated));
      } catch {}
    }
  };

  async function handleCreateWatchlist(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      let created: Watchlist;
      try {
        created = await createWatchlist(DEFAULT_WORKSPACE_ID, {
          name: name.trim(),
          description: description.trim(),
        });
      } catch {
        created = {
          id: `wl_local_${Date.now()}`,
          workspace_id: DEFAULT_WORKSPACE_ID,
          name: name.trim(),
          description: description.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [],
        };
      }
      const updated = [created, ...watchlists];
      setWatchlists(updated);
      syncStorage(updated);
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

  async function handleAddSymbol(e: React.FormEvent) {
    e.preventDefault();
    if (!addSymbol.trim() || !activeWlId) return;
    const sym = addSymbol.trim().toUpperCase();
    try {
      setAddingSaving(true);
      const newItem = {
        id: `wli_${Date.now()}`,
        watchlist_id: activeWlId,
        instrument_id: `inst_${sym.toLowerCase()}`,
        symbol: sym,
        company_name: `${sym} Corporate Instrument`,
        added_at: new Date().toISOString(),
        notes: addNotes.trim() || undefined,
      };

      try {
        await addWatchlistItem(DEFAULT_WORKSPACE_ID, activeWlId, {
          symbol: sym,
          notes: addNotes.trim(),
        });
      } catch {}

      const updated = watchlists.map((wl) =>
        wl.id === activeWlId ? { ...wl, items: [newItem, ...wl.items] } : wl
      );
      setWatchlists(updated);
      syncStorage(updated);
      setAddSymbol("");
      setAddNotes("");
      setIsAddingItem(false);
    } finally {
      setAddingSaving(false);
    }
  }

  async function handleDeleteItem(watchlistId: string, itemId: string) {
    try {
      deleteWatchlistItem(DEFAULT_WORKSPACE_ID, watchlistId, itemId).catch(() => {});
      const updated = watchlists.map((wl) =>
        wl.id === watchlistId ? { ...wl, items: wl.items.filter((i) => i.id !== itemId) } : wl
      );
      setWatchlists(updated);
      syncStorage(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      setError(msg);
    }
  }

  function handleDeleteWatchlist(watchlistId: string) {
    if (!confirm("Are you sure you want to delete this watchlist?")) return;
    const updated = watchlists.filter((w) => w.id !== watchlistId);
    setWatchlists(updated);
    syncStorage(updated);
    if (updated.length > 0) {
      setActiveWlId(updated[0].id);
    } else {
      setActiveWlId(null);
    }
  }

  function handleResetStarter() {
    setWatchlists(STARTER_WATCHLISTS);
    syncStorage(STARTER_WATCHLISTS);
    setActiveWlId(STARTER_WATCHLISTS[0].id);
  }

  const activeWatchlist = watchlists.find((w) => w.id === activeWlId);

  return (
    <NavigationShell activePath="/watchlists">
      <div className="space-y-6 w-full max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              <Bookmark size={14} /> Multi-Asset Portfolios
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Custom Research Watchlists
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Organize tracked equities, monitor live price movements, and receive contextual news alerts directly tied to your coverage universe.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreating((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 transition shadow-sm shrink-0 cursor-pointer"
            >
              <Plus size={15} /> {isCreating ? "Cancel" : "New Watchlist"}
            </button>
          </div>
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
            className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-xs animate-in fade-in"
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
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Thesis context or monitoring triggers..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#162C4E] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer"
              >
                {saving ? "Creating..." : "Save Watchlist"}
              </button>
            </div>
          </form>
        )}

        {/* Watchlist Tabs */}
        {loading ? (
          <div className="flex items-center gap-2 pb-3">
            <div className="w-32 h-8 rounded-xl bg-slate-200 dark:bg-[#0B1528] animate-pulse" />
            <div className="w-32 h-8 rounded-xl bg-slate-200 dark:bg-[#0B1528] animate-pulse" />
          </div>
        ) : watchlists.length > 0 ? (
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#162C4E] pb-3 overflow-x-auto scrollbar-none">
            {watchlists.map((wl) => (
              <button
                key={wl.id}
                onClick={() => setActiveWlId(wl.id)}
                className={`text-xs px-4 py-2 rounded-xl font-bold transition border flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeWlId === wl.id
                    ? "bg-sky-500 border-sky-400 text-slate-950 shadow-xs"
                    : "bg-white dark:bg-[#0B1528] border-slate-200 dark:border-[#162C4E] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Bookmark size={13} /> {wl.name} ({wl.items.length})
              </button>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl space-y-3">
            <Bookmark className="w-8 h-8 text-sky-400 mx-auto" />
            <p className="text-sm text-slate-400">No active watchlists found in this workspace.</p>
            <button
              onClick={handleResetStarter}
              className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
            >
              Load Institutional Watchlists
            </button>
          </div>
        )}

        {/* Active Items Table */}
        {!loading && activeWatchlist && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeWatchlist.name}
                </h3>
                {activeWatchlist.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeWatchlist.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingItem((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#162C4E] hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus size={13} /> Add Symbol
                </button>
                <button
                  onClick={() => handleDeleteWatchlist(activeWatchlist.id)}
                  className="px-2.5 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition cursor-pointer"
                  title="Delete Watchlist"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Inline Add Symbol Bar */}
            {isAddingItem && (
              <form
                onSubmit={handleAddSymbol}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] flex flex-wrap items-center gap-3 animate-in fade-in"
              >
                <div className="flex-1 min-w-[140px]">
                  <input
                    type="text"
                    required
                    value={addSymbol}
                    onChange={(e) => setAddSymbol(e.target.value)}
                    placeholder="Ticker Symbol (e.g. INFY, NVDA)"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B1528] border border-slate-300 dark:border-[#162C4E] text-xs uppercase font-mono"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={addNotes}
                    onChange={(e) => setAddNotes(e.target.value)}
                    placeholder="Thesis or price triggers (optional)"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0B1528] border border-slate-300 dark:border-[#162C4E] text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={addingSaving}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="px-2.5 py-1.5 rounded-lg text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1528] overflow-x-auto shadow-xs scrollbar-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3 px-3">Symbol</th>
                    <th className="py-3 px-3">Company Details / Notes</th>
                    <th className="py-3 px-3">Added Date</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-700 dark:text-slate-300">
                  {activeWatchlist.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#10223D]/60 transition">
                      <td className="py-3.5 px-3">
                        <Link
                          href={`/company/${item.symbol.toLowerCase()}`}
                          className="font-bold text-sky-600 dark:text-sky-400 hover:underline font-mono text-sm"
                        >
                          {item.symbol}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{item.company_name}</p>
                        {item.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">{item.notes}</p>}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(item.added_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/company/${item.symbol.toLowerCase()}`}
                            className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500 text-sky-600 dark:text-sky-300 hover:text-slate-950 transition flex items-center gap-1 font-semibold"
                          >
                            Dossier <ArrowUpRight size={11} />
                          </Link>
                          <button
                            onClick={() => handleDeleteItem(activeWatchlist.id, item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
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
                        No tickers in this watchlist yet. Click &quot;Add Symbol&quot; above to track equities.
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
