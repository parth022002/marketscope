import Link from "next/link";
import { notFound } from "next/navigation";
import { getDossier } from "@/lib/api";

const ids: Record<string,string> = {
  reliance: "in-nse-reliance",
  tcs: "in-nse-tcs",
  infy: "in-nse-infy",
};

export default async function CompanyPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const instrumentId = ids[symbol.toLowerCase()];
  if (!instrumentId) notFound();

  let dossier;
  try { dossier = await getDossier(instrumentId); }
  catch { notFound(); }

  return <div className="shell">
    <aside className="sidebar"><div><div className="brand">Market<span>Scope</span></div><div className="brand-sub">FINANCIAL RESEARCH & INTELLIGENCE</div></div>
      <div><div className="nav-label">WORKSPACE</div><nav className="nav"><Link href="/">Overview</Link><Link href="/search">Discover</Link><Link href="/search">Compare</Link><Link href="/search">Watchlists</Link></nav></div>
      <div className="sidebar-note">Evidence-first research. Read-only by design.</div>
    </aside>
    <main className="main"><header className="topbar"><Link href="/search">← Discover</Link><small>DEMO DOSSIER · SYNTHETIC DATA</small></header>
      <div className="content">
        <div className="eyebrow">{dossier.instrument.exchange} · {dossier.instrument.sector}</div>
        <h1>{dossier.instrument.company_name}</h1>
        <p className="subtitle">{dossier.instrument.symbol} · {dossier.instrument.currency} · Research dossier</p>
        <div style={{display:"flex",gap:8,margin:"16px 0"}}><span className="tag amber">SYNTHETIC DEMO</span><span className="tag">Source-aware layout</span></div>
        <div className="card"><h2>Research overview</h2><p className="subtitle">{dossier.summary}</p></div>
        <div className="section-head"><h2>Illustrative metrics</h2><span className="subtitle">Period: demo · Formula version demo-1</span></div>
        <div className="grid grid-3">
          {dossier.metrics.map(metric=><div className="card" key={metric.metric_id}>
            <div className="metric-label">{metric.label}</div><div className="metric-value">{metric.value.toLocaleString("en-IN")}{metric.unit==="%"?"%":` ${metric.unit}`}</div>
            <div className="subtitle">{metric.period} · {metric.formula_version}</div>
          </div>)}
        </div>
        <div className="section-head"><h2>Evidence and provenance</h2></div>
        {dossier.evidence.map(e=><div className="card" key={e.evidence_id}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}><strong>{e.source_name}</strong><span className="tag amber">{e.quality_status}</span></div>
          <p className="subtitle">{e.note}</p><small className="muted">Retrieved: {new Date(e.retrieved_at).toLocaleString()}</small>
        </div>)}
        <div className="notice" style={{marginTop:20}}>{dossier.disclaimer}</div>
      </div>
    </main>
  </div>;
}
