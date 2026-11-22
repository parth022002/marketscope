"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  LineChart,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

const ACKNOWLEDGEMENT_SECTIONS = [
  {
    category: "Charting & Visualization",
    description: "Institutional-grade HTML5 financial charting canvas.",
    items: [
      {
        name: "TradingView Lightweight Charts v5",
        license: "Apache-2.0",
        author: "TradingView, Inc.",
        url: "https://github.com/tradingview/lightweight-charts",
        note: "Powers MarketScope's interactive multi-timeframe candlestick and indicator canvas.",
      },
    ],
  },
  {
    category: "Frontend Core Frameworks",
    description: "Modern server-rendered user interface and typed execution.",
    items: [
      {
        name: "Next.js 15",
        license: "MIT",
        author: "Vercel, Inc.",
        url: "https://nextjs.org/",
        note: "Server-side rendering, App Router, and static asset optimization.",
      },
      {
        name: "React 19 & React DOM",
        license: "MIT",
        author: "Meta Platforms, Inc.",
        url: "https://react.dev/",
        note: "Declarative component hierarchy and hydration.",
      },
      {
        name: "TypeScript",
        license: "Apache-2.0",
        author: "Microsoft Corporation",
        url: "https://www.typescriptlang.org/",
        note: "Static type verification and API contract interfaces.",
      },
      {
        name: "Tailwind CSS",
        license: "MIT",
        author: "Tailwind Labs, Inc.",
        url: "https://tailwindcss.com/",
        note: "Utility-first CSS design system.",
      },
    ],
  },
  {
    category: "Backend Engine & Web Frameworks",
    description: "High-performance Python modular monolith API.",
    items: [
      {
        name: "FastAPI",
        license: "MIT",
        author: "Sebastián Ramírez",
        url: "https://fastapi.tiangolo.com/",
        note: "Asynchronous REST endpoints and OpenAPI specification.",
      },
      {
        name: "Uvicorn & Starlette",
        license: "BSD-3-Clause",
        author: "Encode OSS Ltd",
        url: "https://www.uvicorn.org/",
        note: "High-throughput ASGI server and HTTP event loop.",
      },
      {
        name: "Pydantic v2",
        license: "MIT",
        author: "Samuel Colvin & Pydantic Inc",
        url: "https://docs.pydantic.dev/",
        note: "Data parsing, schema validation, and strict typing.",
      },
      {
        name: "SQLAlchemy v2",
        license: "MIT",
        author: "Michael Bayer",
        url: "https://www.sqlalchemy.org/",
        note: "SQL toolkit, connection pooling, and relational ORM.",
      },
      {
        name: "Psycopg 3",
        license: "LGPL-3.0-only",
        author: "Daniele Varrazzo",
        url: "https://www.psycopg.org/",
        note: "High-performance PostgreSQL adapter dynamically linked.",
      },
    ],
  },
  {
    category: "Icons, Typography & Styling",
    description: "Consistent typography and vector iconography.",
    items: [
      {
        name: "Lucide React",
        license: "ISC",
        author: "Lucide Contributors",
        url: "https://lucide.dev/",
        note: "Consistent vector iconography across dashboards and tools.",
      },
      {
        name: "Geist Typography",
        license: "SIL OFL 1.1",
        author: "Vercel, Inc.",
        url: "https://vercel.com/font",
        note: "Engineered for technical interfaces and financial data tables.",
      },
    ],
  },
  {
    category: "Market Data & Regulatory Sources",
    description: "Public regulatory filings, benchmark indices, and statistical releases.",
    items: [
      {
        name: "National Stock Exchange of India (NSE)",
        license: "Exchange Proprietary / Delayed Terms",
        author: "NSE India Ltd",
        url: "https://www.nseindia.com/",
        note: "Benchmark index references and listed equity quotes (delayed 15m).",
      },
      {
        name: "BSE Limited (BSE)",
        license: "Exchange Proprietary / Delayed Terms",
        author: "BSE Ltd",
        url: "https://www.bseindia.com/",
        note: "SENSEX benchmark and equity listing references (delayed 15m).",
      },
      {
        name: "Federal Reserve Bank of St. Louis (FRED)",
        license: "Public Domain / Open Data Terms",
        author: "Federal Reserve Bank of St. Louis",
        url: "https://fred.stlouisfed.org/",
        note: "Macroeconomic indicators, CPI inflation, and benchmark yields.",
      },
      {
        name: "SEBI & MCA Statutory Disclosures",
        license: "Public Regulatory Domain",
        author: "Govt of India",
        url: "https://www.sebi.gov.in/",
        note: "Audited corporate quarterly balance sheets and annual reports.",
      },
    ],
  },
];

export default function AcknowledgementsPage() {
  return (
    <NavigationShell activePath="/acknowledgements">
      <div className="max-w-5xl mx-auto space-y-10 py-6">
        
        {/* Header Section */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
            <Sparkles size={13} /> Open-Source &amp; Data Attribution
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Third-Party Acknowledgements
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MarketScope.io stands on the shoulders of the global open-source community and official financial data organizations. We gratefully acknowledge the following technologies and data partners.
          </p>
          <div className="pt-2">
            <Link
              href="/licenses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              <span>View Complete License Inventory &amp; SBOM</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* Categories Grid */}
        <div className="space-y-8">
          {ACKNOWLEDGEMENT_SECTIONS.map((sec) => (
            <section
              key={sec.category}
              className="p-6 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-4 shadow-xs"
            >
              <div className="border-b border-slate-100 dark:border-[#162C4E]/60 pb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {sec.category}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {sec.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sec.items.map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071426] border border-slate-200/80 dark:border-[#162C4E]/80 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                          {item.license}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        By {item.author}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-2 leading-relaxed">
                        {item.note}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-[#162C4E]/60 flex items-center justify-between text-[11px]">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Official Project</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Legal Disclaimer Box */}
        <section className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 text-xs flex items-start gap-2.5">
          <ShieldCheck size={18} className="shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Trademarks &amp; IP Protection:</strong> All registered trademarks, product names, exchange benchmarks (e.g. NIFTY 50, SENSEX, NASDAQ), and logos are the property of their respective owners. Their mention in MarketScope.io is for informational identification purposes only and does not imply endorsement or affiliation.
          </p>
        </section>

      </div>
    </NavigationShell>
  );
}
