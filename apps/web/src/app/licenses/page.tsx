"use client";

import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const DIRECT_LICENSES = [
  { name: "TradingView Lightweight Charts", version: "5.3.0", ecosystem: "npm", license: "Apache-2.0", category: "Permissive Open Source", notice: "Apache 2.0 Notice retained in NOTICE file." },
  { name: "Next.js", version: "15.5.29", ecosystem: "npm", license: "MIT", category: "Permissive Open Source", notice: "Standard MIT copyright notice retained." },
  { name: "React & React DOM", version: "19.0.0", ecosystem: "npm", license: "MIT", category: "Permissive Open Source", notice: "Standard MIT copyright notice retained." },
  { name: "Lucide React", version: "0.468.0", ecosystem: "npm", license: "ISC", category: "Permissive Open Source", notice: "ISC copyright notice retained." },
  { name: "Tailwind CSS", version: "3.4.19", ecosystem: "npm", license: "MIT", category: "Permissive Open Source", notice: "Standard MIT copyright notice retained." },
  { name: "TypeScript", version: "5.8.2", ecosystem: "npm", license: "Apache-2.0", category: "Permissive Open Source", notice: "Apache 2.0 notice retained." },
  { name: "FastAPI", version: "0.165.0", ecosystem: "pypi", license: "MIT", category: "Permissive Open Source", notice: "Standard MIT copyright notice retained." },
  { name: "Uvicorn", version: "0.54.0", ecosystem: "pypi", license: "BSD-3-Clause", category: "Permissive Open Source", notice: "BSD 3-Clause notice retained." },
  { name: "Pydantic", version: "2.14.4", ecosystem: "pypi", license: "MIT", category: "Permissive Open Source", notice: "Standard MIT copyright notice retained." },
  { name: "SQLAlchemy", version: "2.1.9", ecosystem: "pypi", license: "MIT", category: "Permissive Open Source", notice: "Standard MIT copyright notice retained." },
  { name: "Psycopg 3", version: "3.3.9", ecosystem: "pypi", license: "LGPL-3.0-only", category: "Weak Copyleft", notice: "Dynamically imported Python module; source available at github.com/psycopg/psycopg." },
  { name: "HTTPX", version: "0.28.1", ecosystem: "pypi", license: "BSD-3-Clause", category: "Permissive Open Source", notice: "BSD 3-Clause notice retained." },
  { name: "yfinance", version: "1.8.0", ecosystem: "pypi", license: "Apache-2.0", category: "Permissive Open Source", notice: "Apache 2.0 notice retained." },
  { name: "Redis Python Client", version: "8.1.0", ecosystem: "pypi", license: "MIT", category: "Permissive Open Source", notice: "Standard MIT copyright notice retained." },
];

export default function LicensesPage() {
  return (
    <NavigationShell activePath="/licenses">
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        
        {/* Header */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
            <FileText size={13} /> Open-Source Compliance &amp; SBOM
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Software Licenses &amp; Compliance
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MarketScope.io enforces strict open-source licensing hygiene. All direct and transitive third-party dependencies are audited to ensure complete compliance, attribution, and absence of restrictive copyleft licenses.
          </p>
          <div className="pt-2">
            <Link
              href="/acknowledgements"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              <span>View Third-Party Acknowledgements &amp; Attribution</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Project License Statement */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              MarketScope.io Project Licensing Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            The MarketScope.io original software code, proprietary analytics engines, financial screeners, and brand assets are protected under copyright law. All third-party open-source components retain their respective licenses (MIT, Apache-2.0, BSD-3-Clause, ISC, LGPL-3.0) and are used in full accordance with their terms.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#071426] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#162C4E]">
              Total Software Components Audited: <strong>401</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              Viral Copyleft Violations: <strong>0 (Clean)</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
              SBOM Standard: <strong>CycloneDX 1.5</strong>
            </span>
          </div>
        </section>

        {/* Direct Dependencies Table */}
        <section className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-4 shadow-xs">
          <div className="border-b border-slate-100 dark:border-[#162C4E]/60 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Direct Dependencies Inventory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Key production packages with verified SPDX license identifiers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#071426] text-slate-500 dark:text-slate-400 font-mono text-[11px] border-b border-slate-200 dark:border-[#162C4E]">
                <tr>
                  <th className="py-2.5 px-3">Package</th>
                  <th className="py-2.5 px-3">Ecosystem</th>
                  <th className="py-2.5 px-3">Version</th>
                  <th className="py-2.5 px-3">License</th>
                  <th className="py-2.5 px-3">Compliance Notice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 font-sans">
                {DIRECT_LICENSES.map((dep) => (
                  <tr key={dep.name} className="hover:bg-slate-50/50 dark:hover:bg-[#10223B]/50 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {dep.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] uppercase text-slate-500">
                      {dep.ecosystem}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {dep.version}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {dep.license}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 dark:text-slate-400">
                      {dep.notice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Software Bill of Materials (SBOM) Notice */}
        <section className="p-6 rounded-2xl bg-slate-50 dark:bg-[#09172B] border border-slate-200 dark:border-[#162C4E] space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Software Bill of Materials (SBOM)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            In compliance with international software supply chain security standards (NIST SP 800-218 and NTIA guidelines), MarketScope.io maintains a machine-readable CycloneDX v1.5 JSON SBOM located at <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#071426] font-mono text-[11px]">compliance/sbom.json</code> tracking all 401 software components, package URLs (purl), and declared licenses.
          </p>
        </section>

      </div>
    </NavigationShell>
  );
}
