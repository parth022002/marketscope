"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Twitter, Linkedin, ShieldCheck, ExternalLink } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { siteConfig } from "@/config/site";
import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className={`mt-16 pt-12 pb-10 text-xs border-t transition-colors ${
        isLight
          ? "border-slate-200 text-slate-600 bg-white/70"
          : "border-[#132B4F] text-slate-400 bg-[#071426]/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* 4 Logical Navigation & Brand Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Section A — Brand Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5 pr-0 lg:pr-6">
            <BrandLogo variant="inline" size={28} />
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-sans">
              {siteConfig.description}
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Exchange Feeds: Operational</span>
            </div>

            {/* Configured Social Channels Only */}
            <div className="flex items-center gap-3 pt-2">
              {siteConfig.socialLinks.github && (
                <a
                  href={siteConfig.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                  aria-label="GitHub Repository"
                  title="GitHub Repository"
                >
                  <Github size={16} />
                </a>
              )}
              {siteConfig.socialLinks.twitter && (
                <a
                  href={siteConfig.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-400 transition"
                  aria-label="X / Twitter"
                  title="Official Twitter"
                >
                  <Twitter size={16} />
                </a>
              )}
              {siteConfig.socialLinks.linkedin && (
                <a
                  href={siteConfig.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-500 transition"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Section B — Explore (3 cols) */}
          <div className="lg:col-span-3">
            <h3
              className={`font-mono font-bold text-xs uppercase tracking-wider mb-3.5 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Explore Markets
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/charts" className="font-semibold text-sky-500 hover:text-sky-400 transition">
                  Charts Terminal (TradingView-Style)
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Indian Markets (NSE / BSE)
                </Link>
              </li>
              <li>
                <Link href="/derivatives" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Options Chain &amp; Derivatives
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Global Markets (NYSE / NASDAQ)
                </Link>
              </li>
              <li>
                <Link href="/stocks" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Stocks Discovery
                </Link>
              </li>
              <li>
                <Link href="/company/reliance" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Interactive Charts &amp; Analysis
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Commodities &amp; Energy
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Currencies &amp; FX Benchmark
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Mutual Funds &amp; ETFs
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Fixed Income &amp; Sovereign Yields
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Market News Intelligence
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Economic &amp; Corporate Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Section C — Resources (2 cols) */}
          <div className="lg:col-span-2">
            <h3
              className={`font-mono font-bold text-xs uppercase tracking-wider mb-3.5 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/privacy-security-trust#our-commitment"
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  About MarketScope
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-security-trust#financial-data-integrity"
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  Research Methodology
                </Link>
              </li>
              <li>
                <Link href="/news/sources" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Data Sources Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-security-trust#application-security"
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  Platform Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-security-trust#security-reporting"
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Help &amp; Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Section D — Legal & Trust (3 cols) */}
          <div className="lg:col-span-3">
            <h3
              className={`font-mono font-bold text-xs uppercase tracking-wider mb-3.5 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Legal &amp; Trust
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-security-trust#cookies-tracking"
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-security-trust"
                  className="font-semibold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 transition"
                >
                  <ShieldCheck size={13} /> Privacy, Security &amp; Trust
                </Link>
              </li>
              <li>
                <Link href="/acknowledgements" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Third-Party Acknowledgements
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">
                  Software Licenses &amp; SBOM
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  Data &amp; Market Information Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Bottom Footer Bar */}
        <div
          className={`pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-sans ${
            isLight ? "border-slate-200 text-slate-500" : "border-[#132B4F]/60 text-slate-400"
          }`}
        >
          {/* Left Side: Copyright */}
          <div>
            &copy; {currentYear} MarketScope.io. All rights reserved.
          </div>

          {/* Centre: Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 font-medium">
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition">
              Privacy
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition">
              Terms
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link href="/acknowledgements" className="hover:text-slate-900 dark:hover:text-white transition">
              Acknowledgements
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link href="/licenses" className="hover:text-slate-900 dark:hover:text-white transition">
              Licenses
            </Link>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <Link href="/privacy-security-trust" className="hover:text-slate-900 dark:hover:text-white transition">
              Security &amp; Trust
            </Link>
          </div>

          {/* Right Side: Configurable Developer Attribution */}
          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
            Developed by{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {siteConfig.developerName}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
