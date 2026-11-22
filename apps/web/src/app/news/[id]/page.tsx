"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Globe,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Layers,
  Sparkles,
  AlertTriangle,
  Flag,
  X,
  Send,
  Building2,
  Check,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import NewsImpactCard from "@/components/NewsImpactCard";
import {
  getNewsStory,
  submitDisputeReport,
  type CanonicalNewsArticle,
} from "@/lib/api";

export default function NewsDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [story, setStory] = useState<CanonicalNewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  // Dispute Report Modal State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeCategory, setDisputeCategory] = useState("INCORRECT_FIGURE");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeEvidenceUrl, setDisputeEvidenceUrl] = useState("");
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  const [disputeSuccessReportId, setDisputeSuccessReportId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getNewsStory(id)
      .then((data) => setStory(data))
      .catch(() => setStory(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story || !disputeDescription.trim()) return;
    setDisputeSubmitting(true);
    try {
      const rep = await submitDisputeReport({
        article_id: story.id,
        report_category: disputeCategory,
        description: disputeDescription.trim(),
        evidence_url: disputeEvidenceUrl.trim() || undefined,
      });
      setDisputeSuccessReportId(rep.report_id);
      setDisputeDescription("");
      setDisputeEvidenceUrl("");
    } catch {
      alert("Failed to register dispute report. Please try again.");
    } finally {
      setDisputeSubmitting(false);
    }
  };

  if (loading) {
    return (
      <NavigationShell activePath="/news">
        <div className="p-16 text-center text-slate-500 dark:text-slate-400 text-xs font-mono animate-pulse">
          Loading verified financial intelligence dossier...
        </div>
      </NavigationShell>
    );
  }

  if (!story) {
    return (
      <NavigationShell activePath="/news">
        <div className="p-12 text-center space-y-3 bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-3xl max-w-lg mx-auto shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Story Not Found</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The requested intelligence report could not be found or has been withdrawn under correction policy.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft size={14} /> Back to News Intelligence
          </Link>
        </div>
      </NavigationShell>
    );
  }

  const title = story.headline || story.title || "Financial Intelligence Report";
  const publisher = story.publisher_name || story.publisher || "Official Source";
  const externalUrl = story.original_url || story.url;
  const entities = story.related_entities || story.entities || [];

  return (
    <NavigationShell activePath="/news">
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Navigation Breadcrumb & Trust Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition"
          >
            <ArrowLeft size={14} /> Back to News Intelligence Wire
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {story.source_tier === "TIER_1_PRIMARY_OFFICIAL" ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1 font-bold">
                <ShieldCheck size={12} className="text-amber-500 dark:text-amber-400" /> TIER 1 PRIMARY OFFICIAL
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 flex items-center gap-1 font-semibold">
                <Sparkles size={12} className="text-cyan-600 dark:text-cyan-400" /> TIER 2 JOURNALISM
              </span>
            )}

            {story.verification_status === "PRIMARY_SOURCE_CONFIRMED" ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1 font-bold">
                <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" /> PRIMARY CONFIRMED
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 flex items-center gap-1 font-semibold">
                <Layers size={12} className="text-cyan-600 dark:text-cyan-400" /> MULTI-SOURCE CORROBORATED
              </span>
            )}
          </div>
        </div>

        {/* Headline & Metadata Dossier Banner */}
        <div className="space-y-4 p-6 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-sm dark:shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-white font-bold text-sm">{publisher}</span>
              <span>·</span>
              <span className="text-cyan-600 dark:text-cyan-400">{story.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Globe size={12} /> {story.country}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                <Clock size={12} /> {new Date(story.published_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
              </span>
              {story.publication_time_verified && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  Verified Timestamp
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {title}
          </h1>

          <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
            {story.summary}
          </p>

          {/* Action Row: Primary Link & Discrepancy Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#162C4E] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
                >
                  View Original Primary Source <ExternalLink size={12} />
                </a>
              )}
            </div>

            <button
              onClick={() => {
                setDisputeSuccessReportId(null);
                setDisputeModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071426] hover:bg-rose-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-[#162C4E] hover:border-rose-300 dark:hover:border-red-500/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-red-400 transition font-mono text-[11px]"
            >
              <Flag size={12} /> Report Factual Discrepancy
            </button>
          </div>
        </div>

        {/* Key Verified Facts Box */}
        {story.key_facts && story.key_facts.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-sm dark:shadow-lg">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" /> Verified Core Disclosures &amp; Key Facts
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-200">
              {story.key_facts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-2 shrink-0" />
                  <span className="leading-relaxed font-sans">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary Evidence Lineage Panel */}
        {story.evidence_items && story.evidence_items.length > 0 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-4 shadow-sm dark:shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <FileCheck2 size={16} /> Primary Source Evidence &amp; Filing Lineage
              </h3>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E]">
                {story.evidence_items.length} Verifiable Record(s)
              </span>
            </div>

            <div className="space-y-3">
              {story.evidence_items.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] space-y-2 text-xs font-mono"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{ev.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                      {ev.evidence_type}
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] flex flex-wrap items-center gap-3">
                    <span>Authority: <strong className="text-slate-800 dark:text-slate-200">{ev.publisher_or_authority}</strong></span>
                    {ev.document_hash && (
                      <span>SHA-256 Hash: <strong className="text-emerald-600 dark:text-emerald-400">{ev.document_hash.slice(0, 16)}...</strong></span>
                    )}
                  </div>
                  {ev.url && (
                    <div className="pt-2">
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition text-[11px]"
                      >
                        Inspect Official Filing / Gazette <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Impact & Causal Transmission Channels Component */}
        <NewsImpactCard news={story} />

        {/* Associated Corporate Entities */}
        {entities.length > 0 && (
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Building2 size={13} className="text-cyan-600 dark:text-cyan-400" /> Linked Instruments &amp; Companies
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {entities.map((ent, idx) => (
                ent.symbol ? (
                  <Link
                    key={idx}
                    href={`/company/${ent.symbol.toLowerCase()}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071426] hover:bg-blue-50 dark:hover:bg-blue-600/20 border border-slate-200 dark:border-[#162C4E] hover:border-blue-500/40 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 transition flex items-center gap-1.5"
                  >
                    <span>{ent.symbol}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({ent.name})</span>
                  </Link>
                ) : (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] text-xs font-mono text-slate-700 dark:text-slate-300"
                  >
                    {ent.name}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────── Dispute / Discrepancy Reporting Modal ─────────────────── */}
        {disputeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#162C4E]">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                  <Flag size={16} className="text-rose-500 dark:text-red-400" />
                  <span>Report Fact Discrepancy or Missing Correction</span>
                </div>
                <button
                  onClick={() => setDisputeModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {disputeSuccessReportId ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-slate-900 dark:text-white font-bold text-sm">Discrepancy Report Registered</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Your report has been logged under audit ID{" "}
                    <strong className="text-cyan-600 dark:text-cyan-300 font-mono">{disputeSuccessReportId}</strong> and queued for review.
                  </p>
                  <button
                    onClick={() => setDisputeModalOpen(false)}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDisputeSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block">Discrepancy Category</label>
                    <select
                      value={disputeCategory}
                      onChange={(e) => setDisputeCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="INCORRECT_FIGURE">Incorrect Financial Figure / Metric</option>
                      <option value="MISATTRIBUTED_ENTITY">Misattributed Company / Entity</option>
                      <option value="BROKEN_LINK">Broken Primary Evidence Link</option>
                      <option value="MISSING_CORRECTION">Official Retraction / Amendment Missing</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block">Discrepancy Description &amp; Details</label>
                    <textarea
                      required
                      rows={3}
                      value={disputeDescription}
                      onChange={(e) => setDisputeDescription(e.target.value)}
                      placeholder="Explain what figure or assertion is incorrect, citing the specific paragraph or primary source..."
                      className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 dark:text-slate-300 font-semibold block">External Evidence URL (Optional)</label>
                    <input
                      type="url"
                      value={disputeEvidenceUrl}
                      onChange={(e) => setDisputeEvidenceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setDisputeModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#071426] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#162C4E]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={disputeSubmitting}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Send size={13} /> {disputeSubmitting ? "Submitting..." : "Submit Audit Report"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
