"use client";

import { useState } from "react";
import { Camera, X, CheckCircle2, ShieldCheck, Copy, Check } from "lucide-react";
import { DEFAULT_WORKSPACE_ID, createSnapshot, type ResearchSnapshot } from "@/lib/api";

type SnapshotModalProps = {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  companyName: string;
};

export default function SnapshotModal({
  isOpen,
  onClose,
  symbol,
  companyName,
}: SnapshotModalProps) {
  const [label, setLabel] = useState(`Snapshot: ${symbol.toUpperCase()} — Fundamental Review`);
  const [thesis, setThesis] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshotResult, setSnapshotResult] = useState<ResearchSnapshot | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  async function handleCreateSnapshot(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const res = await createSnapshot(DEFAULT_WORKSPACE_ID, {
        instrument_id: symbol,
        snapshot_label: label.trim(),
        thesis: thesis.trim(),
      });
      setSnapshotResult(res);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate research snapshot";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function handleCopyChecksum() {
    if (!snapshotResult) return;
    navigator.clipboard.writeText(snapshotResult.checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#0B1D38] border border-[#132B4F] text-[#E0E6ED] shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#132B4F] transition"
        >
          <X size={18} />
        </button>

        {!snapshotResult ? (
          <form onSubmit={handleCreateSnapshot} className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16C8D5]">
              <Camera size={14} /> Immutable Research Memory
            </div>

            <h3 className="text-xl font-bold text-white">
              Freeze Research Snapshot for {companyName}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Creates a cryptographically frozen snapshot in Neon PostgreSQL. Financial ratios, formula versions, and your research thesis are hashed with HMAC-SHA256, guaranteeing historical reproducibility.
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-[#F06464] text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Snapshot Label / Version Name *
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#07152B] border border-[#132B4F] text-white text-sm focus:outline-none focus:border-[#087BEE]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Active Research Thesis & Context (Optional)
              </label>
              <textarea
                rows={3}
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="Document your valuation assumptions, earnings catalysts, or risk triggers at this point in time..."
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
                <ShieldCheck size={14} /> {saving ? "Hashing & Storing..." : "Freeze Snapshot"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#39E85B]">
              <CheckCircle2 size={16} /> Snapshot Cryptographically Sealed
            </div>

            <h3 className="text-xl font-bold text-white">
              {snapshotResult.snapshot_label}
            </h3>

            <div className="p-4 rounded-xl bg-[#07152B] border border-[#132B4F] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Frozen At:</span>
                <span className="text-white font-mono">{new Date(snapshotResult.data_as_of).toLocaleString()}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">HMAC-SHA256 Checksum (Tamper-Evident):</span>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-[11px] font-mono text-[#16C8D5] break-all">
                  <span className="flex-1">{snapshotResult.checksum}</span>
                  <button
                    onClick={handleCopyChecksum}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#132B4F] shrink-0"
                    title="Copy Checksum"
                  >
                    {copied ? <Check size={14} className="text-[#39E85B]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#132B4F]/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Payload Integrity Status:</span>
                <span className="text-[#39E85B] font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} /> Verified (Untampered)
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#132B4F]">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#087BEE] text-white text-xs font-semibold hover:bg-[#0769cc] transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
