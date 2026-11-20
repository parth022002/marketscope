"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import {
  DEFAULT_WORKSPACE_ID,
  getWorkspaceNotes,
  createWorkspaceNote,
  deleteWorkspaceNote,
  type ResearchNote,
} from "@/lib/api";

type ResearchNotesPanelProps = {
  instrumentId: string;
  companyName: string;
};

export default function ResearchNotesPanel({
  instrumentId,
  companyName,
}: ResearchNotesPanelProps) {
  const [notes, setNotes] = useState<ResearchNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [thesis, setThesis] = useState("");
  const [counterpoints, setCounterpoints] = useState("");
  const [questionInput, setQuestionInput] = useState("");

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkspaceNotes(DEFAULT_WORKSPACE_ID, instrumentId);
      setNotes(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load research notes from Neon database.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [instrumentId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const openQuestions = questionInput
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

      const created = await createWorkspaceNote(DEFAULT_WORKSPACE_ID, {
        instrument_id: instrumentId,
        title: title.trim(),
        thesis: thesis.trim(),
        counterpoints: counterpoints.trim(),
        open_questions: openQuestions,
      });

      setNotes((prev) => [created, ...prev]);
      setTitle("");
      setThesis("");
      setCounterpoints("");
      setQuestionInput("");
      setIsFormOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save note to Neon.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!confirm("Delete this research note?")) return;
    try {
      await deleteWorkspaceNote(DEFAULT_WORKSPACE_ID, noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete note.";
      setError(message);
    }
  }

  return (
    <div className="mt-8 rounded-2xl bg-[#0B1D38] border border-[#132B4F] p-6 shadow-xl text-[#E0E6ED]">
      <div className="flex items-center justify-between pb-4 border-b border-[#132B4F]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#16C8D5] font-semibold flex items-center gap-1.5">
            <BookOpen size={14} /> Workspace Research Memory
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Research Notes & Theses — {companyName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Isolated tenant workspace records backed by Neon PostgreSQL.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="btn flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-[#087BEE] hover:bg-[#0769cc] text-white transition shadow-sm"
        >
          <Plus size={15} /> {isFormOpen ? "Cancel" : "New Research Note"}
        </button>
      </div>

      {error && (
        <div className="my-4 p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-[#F06464] text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Creation Form */}
      {isFormOpen && (
        <form onSubmit={handleCreateNote} className="my-6 p-5 rounded-xl bg-[#07152B] border border-[#132B4F] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Draft Research Record
            </span>
            <span className="text-[11px] text-slate-400">Scoped to Primary Workspace</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Note Title / Thesis Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FY25 Margin Expansion & Free Cash Flow Trajectory"
              className="w-full px-3 py-2 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#087BEE]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#39E85B] mb-1">
                Core Thesis & Supporting Catalysts
              </label>
              <textarea
                rows={4}
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="Key drivers, market positioning, operating leverage, return profile..."
                className="w-full px-3 py-2 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#39E85B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F06464] mb-1">
                Counterpoints, Risks & Disconfirming Evidence
              </label>
              <textarea
                rows={4}
                value={counterpoints}
                onChange={(e) => setCounterpoints(e.target.value)}
                placeholder="Downside risks, regulatory overhang, debt burden, margin compression..."
                className="w-full px-3 py-2 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#F06464]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Unresolved Questions (one per line)
            </label>
            <textarea
              rows={2}
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="1. When will new capex phase come online?&#10;2. What is expected promoter shareholding?"
              className="w-full px-3 py-2 rounded-lg bg-[#0B1D38] border border-[#132B4F] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#087BEE]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#132B4F] text-slate-300 hover:text-white text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#39E85B] text-black hover:bg-[#2ecc4c] text-xs font-semibold transition"
            >
              {saving ? "Saving to Neon..." : "Save Note"}
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="mt-5 space-y-4">
        {loading && (
          <div className="py-8 text-center text-slate-400 text-sm">
            Loading research notes from Neon database...
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="py-10 text-center rounded-xl bg-[#07152B] border border-dashed border-[#132B4F] p-6">
            <Sparkles size={24} className="mx-auto text-slate-500 mb-2" />
            <h4 className="text-sm font-semibold text-white">No research notes yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Start building your reproducible research record for {companyName}. Record your investment thesis, risks, and open questions.
            </p>
          </div>
        )}

        {!loading &&
          notes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-xl bg-[#07152B] border border-[#132B4F] space-y-3 transition hover:border-[#1e4277]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">{note.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Updated: {new Date(note.updated_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1 text-slate-500 hover:text-[#F06464] transition rounded"
                  title="Delete Note"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {note.thesis && (
                <div className="p-3 rounded-lg bg-[#0B1D38] border-l-2 border-[#39E85B] text-xs">
                  <span className="font-semibold text-[#39E85B] block mb-1">Thesis:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{note.thesis}</p>
                </div>
              )}

              {note.counterpoints && (
                <div className="p-3 rounded-lg bg-[#0B1D38] border-l-2 border-[#F06464] text-xs">
                  <span className="font-semibold text-[#F06464] block mb-1">Risks & Counterpoints:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{note.counterpoints}</p>
                </div>
              )}

              {note.open_questions && note.open_questions.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                    Open Questions:
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                    {note.open_questions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
