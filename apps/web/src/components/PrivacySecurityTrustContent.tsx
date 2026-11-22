"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Database,
  Cpu,
  Newspaper,
  BrainCircuit,
  Server,
  Cookie,
  UserCheck,
  AlertTriangle,
  Mail,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  Trash2,
  Key,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import { siteConfig } from "@/config/site";

interface SectionItem {
  id: string;
  title: string;
  icon: any;
  shortLabel: string;
}

const SECTIONS: SectionItem[] = [
  { id: "our-commitment", title: "1. Our Commitment & Founding Principles", shortLabel: "Commitment", icon: ShieldCheck },
  { id: "privacy-personal-information", title: "2. Privacy & Personal Information Handling", shortLabel: "Personal Information", icon: Lock },
  { id: "application-security", title: "3. Application Security Architecture", shortLabel: "Application Security", icon: Server },
  { id: "financial-data-integrity", title: "4. Financial Market Data Integrity & Calibration", shortLabel: "Market Data Integrity", icon: Database },
  { id: "news-accuracy-source-transparency", title: "5. Verified Financial News & Sourcing Integrity", shortLabel: "News Lineage", icon: Newspaper },
  { id: "responsible-ai-research", title: "6. Responsible AI & Quantitative Research Guardrails", shortLabel: "Responsible AI", icon: BrainCircuit },
  { id: "third-party-providers", title: "7. Third-Party Service Providers & Sub-Processors", shortLabel: "Third-Party Providers", icon: Cpu },
  { id: "cookies-tracking", title: "8. Cookies, Local Storage & Tracking Disclosures", shortLabel: "Cookies & Storage", icon: Cookie },
  { id: "user-responsibilities", title: "9. User Responsibilities & Account Hygiene", shortLabel: "User Responsibilities", icon: UserCheck },
  { id: "financial-disclaimer", title: "10. Regulatory Status & Non-Brokerage Disclosures", shortLabel: "Financial Disclaimer", icon: AlertTriangle },
  { id: "security-reporting", title: "11. Security Vulnerability Reporting & Contact", shortLabel: "Security Reporting", icon: Mail },
  { id: "policy-information", title: "12. Policy Governance & Version Information", shortLabel: "Policy Governance", icon: FileText },
];

export default function PrivacySecurityTrustContent() {
  const [activeSection, setActiveSection] = useState<string>("our-commitment");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <NavigationShell activePath="/privacy-security-trust">
      <div className="space-y-8 w-full max-w-7xl mx-auto pb-16">
        {/* Top Hero Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0B1930] dark:via-[#09172B] dark:to-[#071426] border border-slate-200 dark:border-[#162C4E] shadow-sm dark:shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-cyan-600 dark:text-cyan-400" /> Platform Trust &amp; Governance Center
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 size={12} /> DPDP Act 2023 &amp; Non-Custodial Architecture
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#162C4E]">
              Version {siteConfig.version} · {siteConfig.lastUpdated}
            </span>
          </div>

          <div className="max-w-4xl space-y-2">
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Privacy, Security &amp; Trust
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              Your information, our responsibilities. Understand how MarketScope.io approaches privacy, security, data integrity, verifiable news lineage, and responsible research transparency.
            </p>
          </div>
        </div>

        {/* Mobile Collapsible Table of Contents */}
        <div className="block lg:hidden bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-4 shadow-sm">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white font-mono"
          >
            <span className="flex items-center gap-2">
              <Layers size={14} className="text-blue-600 dark:text-cyan-400" />
              Table of Contents: {SECTIONS.find((s) => s.id === activeSection)?.shortLabel || "Navigate"}
            </span>
            <ChevronDown
              size={16}
              className={`transform transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {mobileMenuOpen && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#162C4E] space-y-1">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center gap-2 ${
                    activeSection === sec.id
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#10223D]"
                  }`}
                >
                  <sec.icon size={13} className={activeSection === sec.id ? "text-cyan-200" : "text-slate-400"} />
                  <span className="truncate">{sec.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents (4 cols) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20 space-y-4">
            <div className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#162C4E]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={14} className="text-blue-600 dark:text-cyan-400" /> Document Sections
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">12 Sections</span>
              </div>

              <nav className="space-y-1">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white font-bold shadow-sm"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#10223D] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon size={14} className={isActive ? "text-cyan-200" : "text-slate-400 group-hover:text-blue-500"} />
                        <span className="truncate">{sec.shortLabel}</span>
                      </span>
                      {isActive && <ChevronRight size={14} className="text-cyan-200 shrink-0" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Rights Shortcut Card */}
            <div className="bg-slate-50 dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                <Lock size={13} className="text-cyan-600 dark:text-cyan-400" /> Statutory DPDP Data Rights
              </div>
              <p className="text-[11px] leading-relaxed">
                Exercise your Section 11 &amp; 12 rights to download your complete JSON data package or trigger an irreversible purge.
              </p>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline pt-1"
              >
                Open Workspace Controls <ArrowRight size={12} />
              </Link>
            </div>
          </aside>

          {/* Right Column: Comprehensive Policy Content (8 cols) */}
          <main className="lg:col-span-8 space-y-12">
            {/* Section 1: Our Commitment */}
            <section id="our-commitment" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <ShieldCheck size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  1. Our Commitment &amp; Founding Principles
                </h2>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                MarketScope.io is built to serve financial researchers, analysts, and individual market participants with institutional precision and uncompromised transparency. We operate under strict principles of mathematical provenance, user privacy, and zero conflicts of interest:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 font-mono">
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" /> Transparency First
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    All ratios, screeners, and visual models are calculated deterministically using published financial formulas from primary exchange disclosures.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 font-mono">
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" /> Zero Custodial Risk
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    MarketScope.io never requests or stores broker passwords, Demat credentials, bank accounts, or trade execution authority.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 font-mono">
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" /> Fact-Grounded Intelligence
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    News wire and AI synthesis are bound by cryptographic hashing to primary regulatory filings (BSE, NSE, SEBI, SEC EDGAR).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 font-mono">
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" /> Disclosed Limitations
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    We clearly label 15-minute delayed feeds, avoid blanket claims of universal real-time data, and refrain from speculative buy/sell advice.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Privacy & Personal Information */}
            <section id="privacy-personal-information" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <Lock size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  2. Privacy &amp; Personal Information Handling
                </h2>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                We believe in data minimization. We collect only what is strictly necessary to authenticate your access and save your custom research:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Categories of Information Processed</h3>
                  <ul className="space-y-2 pl-4 list-disc text-slate-600 dark:text-slate-300">
                    <li>
                      <strong>Account &amp; Identity:</strong> Email address and display name managed via Clerk OAuth 2.0 / OIDC with salted password hashing.
                    </li>
                    <li>
                      <strong>User-Authored Research:</strong> Qualitative research notes, thesis hypotheses, and custom watchlists tagged to companies in your private workspace.
                    </li>
                    <li>
                      <strong>Cryptographic Snapshots:</strong> HMAC-SHA256 frozen valuation records generated at your explicit request.
                    </li>
                    <li>
                      <strong>Preferences &amp; Diagnostics:</strong> Client UI theme (`dark` / `light` stored in your browser&apos;s localStorage) and anonymized error traces via Sentry.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Data Retention &amp; Erasure Pipeline</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    Under India&apos;s Digital Personal Data Protection (DPDP) Act 2023 and GDPR Article 20, you have the statutory right to export your data or execute a permanent, irreversible purge at any moment. Entering the confirmation token <code className="text-rose-600 dark:text-red-400 font-bold font-mono">PURGE_ALL_DATA</code> in your <Link href="/workspace" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Workspace</Link> triggers an atomic database deletion across all notes, watchlists, and snapshots in Neon PostgreSQL.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Application Security Architecture */}
            <section id="application-security" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <Server size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  3. Application Security Architecture
                </h2>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                Our security architecture implements defense-in-depth across frontend routing, API microservices, and database persistence layers:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1.5 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                    <Key size={13} className="text-blue-600 dark:text-cyan-400" /> Session &amp; API Key Isolation
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Client applications authenticate using cryptographic JWTs in httpOnly, Secure, SameSite cookies. Third-party provider master keys (Twelve Data, FMP) reside exclusively in backend environment variables.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1.5 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                    <Database size={13} className="text-blue-600 dark:text-cyan-400" /> Database Isolation &amp; TLS 1.3
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Neon PostgreSQL connection pooling utilizes enforced TLS 1.3 encryption. Parameter-bound queries eliminate SQL injection vulnerabilities. Tenant IDs strictly isolate multi-user data.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1.5 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                    <Cpu size={13} className="text-blue-600 dark:text-cyan-400" /> Input Validation &amp; Rate Limits
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    FastAPI backend enforces schema validation through Pydantic models. Public search and resolution endpoints incorporate circuit breakers and rate-limiting against denial-of-service attempts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-1.5 shadow-sm">
                  <div className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                    <Sparkles size={13} className="text-blue-600 dark:text-cyan-400" /> Planned Security Roadmap
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    <em>Planned for future release:</em> Formal SOC2 Type II compliance audit, hardware security key (FIDO2 / WebAuthn) passkey enrollment, and automated third-party penetration testing.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Financial Market Data Integrity */}
            <section id="financial-data-integrity" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <Database size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  4. Financial Market Data Integrity &amp; Calibration
                </h2>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                MarketScope.io ingests multi-asset price and fundamental data from licensed redistributors, central banking benchmark registries, and open government data services:
              </p>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-sm text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Data Latency &amp; Freshness Classifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07152B] border border-slate-200 dark:border-[#162C4E]">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase block mb-1">
                      Live Market Feed
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Sub-1500ms display data for domestic Indian benchmarks (NIFTY, SENSEX, BANK NIFTY) during exchange hours.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07152B] border border-slate-200 dark:border-[#162C4E]">
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-300 uppercase block mb-1">
                      15-Min Delayed
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Exchange-mandated 15-minute delayed quotes for selected US and international equities under display licenses.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#07152B] border border-slate-200 dark:border-[#162C4E]">
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase block mb-1">
                      End-of-Day (EOD)
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Official AMFI mutual fund Net Asset Values (21:00 IST daily) and sovereign yield curves from RBI / FRED.
                    </p>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-2 leading-relaxed">
                  <strong>Missing Data Handling:</strong> MarketScope.io never interpolates, hallucinates, or fabricates price data. When an upstream tick is missing or an exchange holiday is observed, fields explicitly reflect statutory market closure states.
                </p>
              </div>
            </section>

            {/* Section 5: News Accuracy & Source Transparency */}
            <section id="news-accuracy-source-transparency" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <Newspaper size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  5. Verified Financial News &amp; Sourcing Integrity
                </h2>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                Our news intelligence platform is anchored to primary regulatory filings and reputable financial press, eliminating speculative social media rumor mills:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">Cryptographic Lineage &amp; Sourcing Tiers</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                      SHA-256 Hashing Enforced
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    Every article dossier published on MarketScope.io is classified as either <strong>Tier 1 Primary Official</strong> (NSE circulars, BSE disclosures, SEBI orders, RBI MPC releases, SEC Form 8-K) or <strong>Tier 2 Established Journalism</strong> (Reuters, Mint, Business Standard). Original source URLs and SHA-256 evidence hashes are displayed for instant verification.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-2 shadow-sm">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">Public Factual Dispute Reporting</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    Users can submit factual discrepancy reports directly on any story page via the &quot;Report Factual Discrepancy&quot; button. Reports are recorded in Neon PostgreSQL with unique audit IDs for administrative review.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6: Responsible AI & Research */}
            <section id="responsible-ai-research" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <BrainCircuit size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  6. Responsible AI &amp; Quantitative Research Guardrails
                </h2>
              </div>

              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                Artificial intelligence on MarketScope.io is restricted to Retrieval-Augmented Generation (RAG) designed to accelerate document synthesis without hallucinating figures:
              </p>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-sm text-xs">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                  <CheckCircle2 size={15} /> Deterministic Abstinence Protocol
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  The AI engine (Groq LLaMA-3.3 70B &amp; Google Gemini) is programmatically instructed to refuse generating commentary if statutory audited financial disclosures are absent or unverified. AI outputs are labeled with a <code className="text-emerald-600 dark:text-[#39E85B] font-mono">GATED</code> badge and must never be treated as investment advice or trading signals.
                </p>
              </div>
            </section>

            {/* Section 7: Third-Party Providers */}
            <section id="third-party-providers" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <Cpu size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  7. Third-Party Service Providers &amp; Sub-Processors
                </h2>
              </div>

              <div className="overflow-x-auto bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] rounded-2xl p-5 shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-[#162C4E] text-slate-500 dark:text-slate-400 font-mono">
                      <th className="py-2.5 px-3">Provider Name</th>
                      <th className="py-2.5 px-3">Role / Service</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Data Handled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-slate-700 dark:text-slate-300">
                    <tr className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">Clerk, Inc.</td>
                      <td className="py-3 px-3">Authentication &amp; User Sessions</td>
                      <td className="py-3 px-3 font-mono">United States</td>
                      <td className="py-3 px-3">Hashed email, session tokens</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">Neon, Inc.</td>
                      <td className="py-3 px-3">Serverless PostgreSQL Database</td>
                      <td className="py-3 px-3 font-mono">AWS Singapore (ap-southeast-1)</td>
                      <td className="py-3 px-3">Encrypted workspace research &amp; metrics</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">Twelve Data LLC</td>
                      <td className="py-3 px-3">Global Market Ticks &amp; FX Feeds</td>
                      <td className="py-3 px-3 font-mono">Singapore / US</td>
                      <td className="py-3 px-3">Anonymous ticker symbol queries</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">Financial Modeling Prep</td>
                      <td className="py-3 px-3">Fundamental Statements &amp; Filings</td>
                      <td className="py-3 px-3 font-mono">United States</td>
                      <td className="py-3 px-3">Corporate balance sheet queries</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-[#10223D]/50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">Sentry (Functional Software)</td>
                      <td className="py-3 px-3">Error Telemetry &amp; Crash Reports</td>
                      <td className="py-3 px-3 font-mono">United States</td>
                      <td className="py-3 px-3">De-identified client stack traces</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 8: Cookies & Tracking */}
            <section id="cookies-tracking" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <Cookie size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  8. Cookies, Local Storage &amp; Tracking Disclosures
                </h2>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-sm text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Minimalist Technical Storage Only</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  MarketScope.io utilizes strictly essential cookies and browser local storage required for system operation:
                </p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600 dark:text-slate-400">
                  <li><strong>Clerk Auth Cookies:</strong> Secure, httpOnly session tokens (`__session`, `__client_uat`) maintaining login state.</li>
                  <li><strong>Browser LocalStorage:</strong> Theme key (`marketscope-theme` = `dark` | `light`) preserving your dark/light preference.</li>
                  <li><strong>Zero Advertising Trackers:</strong> No marketing cookies, Google Ads conversion beacons, Meta Pixel, or behavioral ad profiling scripts are installed on MarketScope.io.</li>
                </ul>
              </div>
            </section>

            {/* Section 9: User Responsibilities */}
            <section id="user-responsibilities" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <UserCheck size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  9. User Responsibilities &amp; Account Hygiene
                </h2>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-sm text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                <p>
                  As an authenticated research workspace user, you agree to:
                </p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-600 dark:text-slate-400">
                  <li>Maintain the confidentiality of your login credentials and personal workspace tenancy.</li>
                  <li>Use strong passwords and enable Multi-Factor Authentication (MFA) via the Clerk account security panel.</li>
                  <li>Refrain from executing automated bot scraping, denial-of-service scripts, or unauthorized load testing against platform endpoints.</li>
                  <li>Promptly notify <a href={`mailto:${siteConfig.securityEmail}`} className="text-blue-600 dark:text-cyan-400 underline font-mono">{siteConfig.securityEmail}</a> upon detecting any suspicious account activity.</li>
                </ul>
              </div>
            </section>

            {/* Section 10: Financial Disclaimer */}
            <section id="financial-disclaimer" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <AlertTriangle size={22} className="text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  10. Regulatory Status &amp; Non-Brokerage Disclosures
                </h2>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 space-y-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed shadow-sm font-sans">
                <div className="font-bold text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <AlertTriangle size={16} /> Statutory SEBI Notice &amp; Safe-Harbor
                </div>
                <p>
                  MarketScope.io is an educational, fundamental research, and market data visualization platform. <strong>MarketScope.io is NOT registered as an Investment Adviser (RIA), Research Analyst (RA), Portfolio Manager, or Stock Broker</strong> under the regulations of the Securities and Exchange Board of India (SEBI) or any other regulatory jurisdiction.
                </p>
                <p>
                  No metrics, financial scores, peer comparison matrices, or AI syntheses constitute personalized investment advice, a research recommendation under SEBI (Research Analysts) Regulations 2014, or a solicitation to buy, sell, or hold any security.
                </p>
                <p className="font-mono text-[11px] text-amber-800 dark:text-amber-300/80">
                  &quot;Investment in securities market are subject to market risks. Read all the related documents carefully before investing.&quot;
                </p>
              </div>
            </section>

            {/* Section 11: Security Reporting */}
            <section id="security-reporting" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <Mail size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  11. Security Vulnerability Reporting &amp; Contact
                </h2>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-4 shadow-sm text-xs font-sans">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  We welcome coordinated vulnerability disclosures and responsible reporting from security researchers. If you identify a potential security vulnerability, please notify our team directly:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07152B] border border-slate-200 dark:border-[#162C4E]">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Security Vulnerabilities</span>
                    <a
                      href={`mailto:${siteConfig.securityEmail}`}
                      className="font-bold text-blue-600 dark:text-cyan-400 hover:underline text-xs"
                    >
                      {siteConfig.securityEmail}
                    </a>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07152B] border border-slate-200 dark:border-[#162C4E]">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Privacy &amp; Data Rights</span>
                    <a
                      href={`mailto:${siteConfig.privacyEmail}`}
                      className="font-bold text-blue-600 dark:text-cyan-400 hover:underline text-xs"
                    >
                      {siteConfig.privacyEmail}
                    </a>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Response SLA:</strong> We acknowledge verified security vulnerability submissions within 48 business hours and coordinate responsible mitigation timelines.
                </p>
              </div>
            </section>

            {/* Section 12: Policy Governance */}
            <section id="policy-information" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-[#162C4E]">
                <FileText size={22} className="text-blue-600 dark:text-cyan-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  12. Policy Governance &amp; Version Information
                </h2>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-[#162C4E] space-y-4 shadow-sm text-xs font-sans">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Policy Version</span>
                    <span className="font-bold text-slate-900 dark:text-white">{siteConfig.version}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Effective Date</span>
                    <span className="font-bold text-slate-900 dark:text-white">{siteConfig.effectiveDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Last Reviewed</span>
                    <span className="font-bold text-slate-900 dark:text-white">{siteConfig.lastUpdated}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase">Status</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-[#162C4E] flex flex-wrap items-center gap-4 text-xs font-medium">
                  <Link href="/terms" className="text-blue-600 dark:text-cyan-400 hover:underline">
                    Terms of Service →
                  </Link>
                  <Link href="/privacy" className="text-blue-600 dark:text-cyan-400 hover:underline">
                    Privacy Policy (DPDP Act) →
                  </Link>
                  <Link href="/disclaimer" className="text-blue-600 dark:text-cyan-400 hover:underline">
                    Regulatory Disclaimer →
                  </Link>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </NavigationShell>
  );
}
