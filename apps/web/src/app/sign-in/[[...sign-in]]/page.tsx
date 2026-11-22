"use client";

import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  LineChart,
  Newspaper,
  Sparkles,
  ArrowLeft,
  Lock,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#071426] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      <AnimatedBackground />

      {/* Top Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-[#162C4E]/60 bg-[#071426]/70 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 group">
          <BrandLogo variant="inline" size={28} />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={14} /> Back to MarketScope
        </Link>
      </header>

      {/* Split-Screen Center Workspace */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Feature Showcase (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 p-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-600/20 text-cyan-400 border border-blue-500/30 inline-flex items-center gap-1.5">
                <Sparkles size={13} /> Institutional Research Terminal
              </span>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Unlock Truth In Financial Markets.
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Log in to access deterministic fundamental models, verified multi-exchange feeds, and traceable primary filing evidence.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              {[
                { icon: CheckCircle2, text: "15 Golden Ratios calculated with exact filing lineage formulas" },
                { icon: LineChart, text: "TradingView Lightweight Canvas with 10 calibrated technical indicators" },
                { icon: Newspaper, text: "7-Factor Verified News Intelligence with cryptographic hashing" },
                { icon: ShieldCheck, text: "Strict read-only analysis compliant with DPDP Act 2023" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mt-0.5">
                      <Icon size={14} />
                    </div>
                    <span className="text-xs text-slate-200 leading-relaxed font-sans">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Test Credentials Sandbox Callout */}
            <div className="p-4 rounded-2xl bg-[#0B1930] border border-[#162C4E] space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Lock size={13} />
                <span>Verified Workspace Security</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Protected by Clerk SSO and encrypted session tokens. Zero brokerage order routing.
              </p>
            </div>
          </div>

          {/* Right Authentication Form Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0B1930]/90 border border-[#162C4E] shadow-2xl backdrop-blur-xl">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center p-12 space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-slate-400 font-mono">Connecting to Clerk Auth...</span>
                  </div>
                }
              >
                <SignIn
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-none p-0 w-full",
                      headerTitle: "text-white text-xl font-bold font-sans",
                      headerSubtitle: "text-slate-400 text-xs font-sans",
                      formButtonPrimary:
                        "bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md shadow-blue-600/30",
                      formFieldInput:
                        "bg-[#071426] border border-[#162C4E] focus:border-blue-500 rounded-xl text-white text-xs py-2.5 px-3 transition outline-none font-sans",
                      formFieldLabel: "text-slate-300 text-xs font-semibold font-sans",
                      footerActionLink: "text-cyan-400 hover:text-cyan-300 font-semibold text-xs",
                      identityPreviewText: "text-white text-xs",
                      identityPreviewEditButton: "text-cyan-400 hover:text-cyan-300",
                      socialButtonsBlockButton:
                        "bg-[#071426] hover:bg-[#10223B] border border-[#162C4E] text-white text-xs py-2 rounded-xl transition font-sans",
                      dividerLine: "bg-[#162C4E]",
                      dividerText: "text-slate-500 text-xs",
                    },
                  }}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 py-4 px-6 text-center text-[11px] text-slate-500 border-t border-[#162C4E]/40 font-mono">
        &copy; {new Date().getFullYear()} MarketScope.io · Strictly for research and decision-support · Zero investment advisory
      </footer>
    </div>
  );
}
