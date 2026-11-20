import Link from "next/link";
import { ArrowLeft, ShieldCheck, Download, Trash2, Lock, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="shell min-h-screen bg-[#07152B] text-slate-200 py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#132B4F] pb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#087BEE] hover:text-[#16C8D5] transition mb-3"
            >
              <ArrowLeft size={14} /> Back to MarketScope.io
            </Link>
            <h1 className="text-2xl font-bold text-white">Privacy Policy &amp; DPDP Act 2023 Compliance</h1>
            <p className="text-xs text-slate-400 mt-1">
              Compliant with the Digital Personal Data Protection (DPDP) Act 2023 (India) &amp; GDPR (Article 20)
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0B1D38] border border-[#132B4F] flex items-center justify-center text-[#39E85B]">
            <ShieldCheck size={20} />
          </div>
        </div>

        {/* DPDP Quick Actions Box */}
        <div className="p-5 rounded-2xl bg-[#0B1D38] border border-[#132B4F] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Lock size={14} className="text-[#16C8D5]" /> Your Privacy Rights as a Data Principal
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#39E85B]/10 text-[#39E85B] border border-[#39E85B]/30">
              DPDP ACT 2023 COMPLIANT
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Under Section 11 and Section 12 of the Indian DPDP Act 2023 and GDPR Article 20, you retain absolute ownership over your workspace research notes, watchlists, and research snapshots. You can exercise these rights directly within your dashboard at any time.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#087BEE] text-white text-xs font-semibold hover:bg-[#0769cc] transition"
            >
              <Download size={13} /> Export All Data (JSON)
            </Link>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-[#F06464] text-xs font-semibold hover:bg-red-500/20 transition"
            >
              <Trash2 size={13} /> Request Irreversible Purge
            </Link>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16C8D5]"></span>
              1. Non-Custodial Data Architecture (Zero Brokerage / Bank Data)
            </h2>
            <p>
              MarketScope.io does not offer financial trading, fund custody, or brokerage services. Consequently, <strong>we never request, collect, or store your Demat account credentials, brokerage API secrets, trading passwords, bank account numbers, or PAN numbers</strong>. Your financial security is preserved by design through zero data custody.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16C8D5]"></span>
              2. Data We Process &amp; Retention Policy
            </h2>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
              <li><strong>Authentication Data:</strong> User email and display name managed via Clerk OAuth 2.0 / OIDC with salted password hashing.</li>
              <li><strong>Workspace Research Notes:</strong> User-authored investment theses, qualitative notes, and counterpoints tagged to companies.</li>
              <li><strong>Custom Watchlists:</strong> Ticker groupings created by users in their private workspace.</li>
              <li><strong>Research Snapshots:</strong> Tamper-evident, HMAC-SHA256 cryptographically frozen financial state records.</li>
              <li><strong>Immutable Audit Trail:</strong> Append-only security event logs recording data rights exports and purges (devoid of PII).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16C8D5]"></span>
              3. Right to Erasure &amp; Cascade Purge Pipeline
            </h2>
            <p>
              In strict accordance with the DPDP Act 2023, submitting a purge request with confirmation token <code>PURGE_ALL_DATA</code> triggers an immediate, atomic database transaction in Neon PostgreSQL that permanently and irreversibly erases all notes, watchlists, items, and snapshots associated with your workspace identifier. A non-PII audit event is logged to fulfill statutory audit trail mandates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16C8D5]"></span>
              4. Telemetry &amp; Cookie Standards
            </h2>
            <p>
              MarketScope.io utilizes essential first-party session tokens solely for authentication and session management. We do not use third-party advertising tracking cookies or sell user analytics to third-party data brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16C8D5]"></span>
              5. Data Protection Officer (DPO) Contact
            </h2>
            <p>
              If you have inquiries regarding your personal data or wish to file a grievance under the DPDP Act 2023, you may contact our designated Data Protection Officer at: <code>privacy@marketscope.io</code>.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#132B4F] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>&copy; 2026 MarketScope.io. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-slate-300">Regulatory Disclaimer</Link>
            <Link href="/workspace" className="hover:text-slate-300">Workspace &amp; Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
