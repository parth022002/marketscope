"use client";

import { useEffect, useState } from "react";
import { Bookmark, X, CheckCircle2, Plus } from "lucide-react";
import {
  DEFAULT_WORKSPACE_ID,
  getWatchlists,
  createWatchlist,
  addWatchlistItem,
  type Watchlist,
} from "@/lib/api";

type AddToWatchlistModalProps = {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  companyName: string;
};

export default function AddToWatchlistModal({
  isOpen,
  onClose,
  symbol,
  companyName,
}: AddToWatchlistModalProps) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [newWlName, setNewWlName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setSuccess(false);
    setError(null);

    getWatchlists(DEFAULT_WORKSPACE_ID)
      .then((data) => {
        setWatchlists(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      let targetId = selectedId;
      if (!targetId && newWlName.trim()) {
        const created = await createWatchlist(DEFAULT_WORKSPACE_ID, { name: newWlName.trim() });
        targetId = created.id;
      }

      if (!targetId) {
        throw new Error("Please select or create a watchlist");
      }

      await addWatchlistItem(DEFAULT_WORKSPACE_ID, targetId, { symbol, notes: notes.trim() });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add to watchlist";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0B1D38] border border-[#132B4F] text-[#E0E6ED] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#132B4F] transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16C8D5]">
          <Bookmark size={14} /> Workspace Watchlists
        </div>

        <h3 className="text-xl font-bold text-white mt-1">
          Add {symbol.toUpperCase()} to Watchlist
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Track {companyName} with real-time valuation updates and fundamental alerts.
        </p>

        {success ? (
          <div className="my-6 p-4 rounded-xl bg-[#39E85B]/10 border border-[#39E85B]/30 text-[#39E85B] text-center space-y-1">
            <CheckCircle2 size={24} className="mx-auto mb-1" />
            <p className="text-sm font-semibold">Added to watchlist successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="space-y-4 my-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-[#F06464] text-xs">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading watchlists...</div>
            ) : watchlists.length > 0 ? (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Target Watchlist</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-sm focus:outline-none focus:border-[#087BEE]"
                >
                  {watchlists.map((wl) => (
                    <option key={wl.id} value={wl.id}>
                      {wl.name} ({wl.items.length} items)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Create New Watchlist</label>
                <input
                  type="text"
                  required
                  value={newWlName}
                  onChange={(e) => setNewWlName(e.target.value)}
                  placeholder="e.g. Core Fundamental Compounders"
                  className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-sm focus:outline-none focus:border-[#087BEE]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Research Tag / Target Price Note (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Watch for quarterly margin expansion"
                className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-sm focus:outline-none focus:border-[#087BEE]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#132B4F]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#132B4F] text-slate-300 hover:text-white text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-[#087BEE] text-white hover:bg-[#0769cc] text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Plus size={14} /> {saving ? "Saving..." : "Add Ticker"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
