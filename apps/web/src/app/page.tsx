import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, Search, ShieldCheck, FileSearch, Bookmark, CheckCircle2 } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

const featuredCompanies = [
  { symbol: "RELIANCE", name: "Reliance Industries Limited", sector: "Energy / Retail / Digital", status: "SYNTHETIC_DEMO" },
  { symbol: "TCS", name: "Tata Consultancy Services Limited", sector: "Information Technology", status: "SYNTHETIC_DEMO" },
  { symbol: "INFY", name: "Infosys Limited", sector: "Information Technology", status: "SYNTHETIC_DEMO" },
];

export default function HomePage() {
  return (
    <div className="shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            Market<span>Scope</span>
          </div>
          <div className="brand-sub">FINANCIAL RESEARCH &amp; INTELLIGENCE</div>
        </div>

        <div>
          <div className="nav-label">WORKSPACE</div>
          <nav className="nav">
            <Link className="active" href="/">Overview</Link>
            <Link href="/search">Company Search</Link>
            <Link href="/compare">Peer Comparison</Link>
            <Link href="/screener">Fundamental Screener</Link>
            <Link href="/watchlists">Watchlists</Link>
          </nav>
        </div>

        <div className="sidebar-note">
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--accent-cyan)", marginBottom: 4 }}>
            <ShieldCheck size={14} /> Research Platform
          </div>
          Evidence-first financial research workspace for Indian equities. Read-only by design. No brokerage connection or trade execution.
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        {/* Topbar with Clerk Authentication Controls */}
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>MarketScope Workspace</span>
            <span className="tag amber">DEMO ENVIRONMENT · SYNTHETIC FIXTURES</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Suspense fallback={<div style={{ fontSize: 12, color: "var(--text-muted)" }}>Loading...</div>}>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="btn btn-secondary" style={{ padding: "8px 14px" }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn" style={{ padding: "8px 14px" }}>
                    Create Account
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Researcher Session</span>
                  <UserButton />
                </div>
              </Show>
            </Suspense>
          </div>
        </header>

        {/* Content Body */}
        <div className="content">
          <div className="eyebrow">RESEARCH-FIRST FINANCIAL INTELLIGENCE</div>
          <h1>See the market beyond the numbers.</h1>
          <p className="subtitle">
            Research listed Indian companies, understand financial performance, inspect source evidence, and maintain reproducible research snapshots.
          </p>

          <div className="search-row">
            <Link
              className="btn"
              href="/search"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px" }}
            >
              <Search size={16} /> Search Indian Equities (NSE / BSE) <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Three Feature Pillars */}
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <div className="card">
              <FileSearch color="var(--accent-blue)" size={24} />
              <div className="metric-label" style={{ marginTop: 14 }}>Company Research</div>
              <div className="metric-value">Company-First</div>
              <p className="subtitle" style={{ marginTop: 8 }}>
                Explore listed companies, fundamentals, and multi-period financial statements in one structured place.
              </p>
            </div>

            <div className="card">
              <CheckCircle2 color="var(--accent-cyan)" size={24} />
              <div className="metric-label" style={{ marginTop: 14 }}>Verified Intelligence</div>
              <div className="metric-value">Source-Aware</div>
              <p className="subtitle" style={{ marginTop: 8 }}>
                Trace every calculated metric back to its underlying filing source, date, reporting basis, and formula.
              </p>
            </div>

            <div className="card">
              <Bookmark color="var(--accent-green)" size={24} />
              <div className="metric-label" style={{ marginTop: 14 }}>Research Memory</div>
              <div className="metric-value">Reproducible</div>
              <p className="subtitle" style={{ marginTop: 8 }}>
                Preserve your notes, theses, and assumptions with cryptographically verifiable, dated snapshots.
              </p>
            </div>
          </div>

          {/* Featured Equities Section */}
          <div className="section-head">
            <div>
              <h2>Featured Listed Companies</h2>
              <p className="subtitle">Synthetic demonstration fixtures for canonical instrument resolution and dossier inspection.</p>
            </div>
            <Link className="subtitle" href="/search" style={{ color: "var(--accent-cyan)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              Explore Universe <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid">
            {featuredCompanies.map((company) => (
              <Link
                className="result"
                href={`/company/${company.symbol.toLowerCase()}`}
                key={company.symbol}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong style={{ fontSize: 16 }}>{company.symbol}</strong>
                    <span className="tag verified" style={{ fontSize: 10, padding: "2px 6px" }}>NSE</span>
                    <span className="tag amber" style={{ fontSize: 10, padding: "2px 6px" }}>SYNTHETIC</span>
                  </div>
                  <div className="subtitle" style={{ marginTop: 4 }}>{company.name}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="muted" style={{ fontSize: 12 }}>{company.sector}</div>
                  <div style={{ color: "var(--accent-cyan)", fontSize: 12, marginTop: 4, display: "inline-flex", alignItems: "center", gap: 2 }}>
                    Open Dossier <ArrowUpRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="notice" style={{ marginTop: 32 }}>
            <strong>Regulatory &amp; Data Notice:</strong> MarketScope.io is a financial research and analytical decision-support workspace. It does not provide investment advice, execute stock transactions, or handle customer funds. The current environment displays synthetic fixtures for demonstration purposes.
          </div>

          <footer className="footer">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>MarketScope.io — Financial Research &amp; Intelligence · Phase 1 Foundation Active</div>
              <div style={{ color: "var(--text-muted)" }}>Clerk Authentication &amp; Neon Postgres Connected</div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
