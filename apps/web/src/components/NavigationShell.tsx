"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Globe,
  TrendingUp,
  Newspaper,
  Filter,
  Building2,
  BookOpen,
  BarChart3,
  Bookmark,
  Calendar,
  ShieldCheck,
  Search,
  Menu,
  X,
  Radio,
  ExternalLink,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Footer";

interface NavigationShellProps {
  children: React.ReactNode;
  activePath?: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Markets Hub", href: "/markets", icon: Globe },
  { label: "Stocks Discovery", href: "/stocks", icon: TrendingUp },
  { label: "News Intelligence", href: "/news", icon: Newspaper, badge: "LIVE" },
  { label: "Screeners", href: "/screener", icon: Filter },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Research Dossier", href: "/company/reliance", icon: BookOpen },
  { label: "Peer Comparison", href: "/compare", icon: BarChart3 },
  { label: "Watchlists", href: "/watchlists", icon: Bookmark },
  { label: "Calendar & Events", href: "/calendar", icon: Calendar },
  { label: "Workspace & Privacy", href: "/workspace", icon: ShieldCheck },
];

export default function NavigationShell({ children, activePath }: NavigationShellProps) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#07152B] text-slate-200 flex flex-col font-sans">
      {/* ─── Topbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#07152B]/95 backdrop-blur border-b border-[#132B4F] px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1D38]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop & Mobile Brand Logo */}
          <div className="hidden sm:block">
            <BrandLogo variant="inline" size={28} />
          </div>
          <div className="sm:hidden">
            <BrandLogo variant="icon" size={28} />
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, tickers, news, commodities (e.g. Reliance, Crude, RBI)..."
              className="w-full bg-[#0B1D38] border border-[#132B4F] focus:border-[#087BEE] rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-sans"
            />
          </form>
        </div>

        {/* Status & Auth Actions */}
        <div className="flex items-center gap-3">
          {/* Market Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#39E85B]/10 text-[#39E85B] border border-[#39E85B]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39E85B] animate-pulse"></span>
            <span>NSE: OPEN</span>
          </div>

          <Show when="signed-in">
            <div className="flex items-center gap-2 pl-2 border-l border-[#132B4F]">
              <UserButton />
            </div>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-xs px-3 py-1.5 rounded-lg bg-[#087BEE] hover:bg-[#0769cc] text-white transition font-semibold shadow-sm"
            >
              Sign In
            </Link>
          </Show>
        </div>
      </header>

      {/* ─── Global Multi-Asset Ticker Bar ───────────────────────────────── */}
      <MarketTicker />

      {/* ─── Main Body Layout (Sidebar + Content) ─────────────────────────── */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-[#07152B] border-r border-[#132B4F] p-4 shrink-0">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 px-3">
            WORKSPACE NAVIGATION
          </div>

          <nav className="space-y-1 flex-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                    isActive
                      ? "bg-[#087BEE]/15 text-white border border-[#087BEE]/40 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-[#0B1D38]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={15}
                      className={
                        isActive
                          ? "text-[#16C8D5]"
                          : "text-slate-400 group-hover:text-white transition"
                      }
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#39E85B]/15 text-[#39E85B] border border-[#39E85B]/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Regulatory & Safety Box */}
          <div className="mt-4 p-3 rounded-xl bg-[#0B1D38] border border-[#132B4F] text-[11px] text-slate-400 leading-relaxed">
            <div className="flex items-center gap-1.5 text-white font-bold mb-1">
              <ShieldCheck size={14} className="text-[#16C8D5]" />
              <span>Research Only</span>
            </div>
            Strictly read-only evidence &amp; intelligence. No trade execution or broker routing.
          </div>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex">
            <div className="w-64 bg-[#07152B] border-r border-[#132B4F] p-4 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#132B4F]">
                <BrandLogo variant="inline" size={26} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="my-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search market instruments..."
                  className="w-full bg-[#0B1D38] border border-[#132B4F] rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </form>

              <nav className="space-y-1 flex-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? currentPath === "/"
                      : currentPath.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                        isActive
                          ? "bg-[#087BEE]/20 text-white font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#0B1D38]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[#39E85B]/15 text-[#39E85B]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 flex flex-col justify-between">
          <div>{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
