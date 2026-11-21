"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Command,
  Radio,
  Sparkles,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut Ctrl+K to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-nav-search");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#071426] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Dynamic Canvas Particles & Ambient Radial Glow */}
      <AnimatedBackground />

      {/* ─────────────────── Header Topbar ─────────────────── */}
      <header className="sticky top-0 z-40 bg-[#071426]/90 backdrop-blur-md border-b border-[#162C4E] px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1930] transition"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop & Mobile Brand Identity */}
          <div className="hidden sm:block">
            <BrandLogo variant="inline" size={28} />
          </div>
          <div className="sm:hidden">
            <BrandLogo variant="icon" size={28} />
          </div>
        </div>

        {/* Global Terminal Search Bar with Ctrl+K */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              id="global-nav-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, symbols, filings, news (e.g. Reliance, TCS, Brent, RBI)..."
              className="w-full bg-[#0B1930] border border-[#162C4E] focus:border-blue-500 rounded-xl pl-9 pr-14 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition shadow-inner font-sans"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-[#071426] border border-[#162C4E]">
              <Command size={10} /> K
            </div>
          </form>
        </div>

        {/* Live Market Session Pill & User Auth */}
        <div className="flex items-center gap-3">
          {/* Live Market Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NSE: OPEN · IST</span>
          </div>

          <Link
            href="/watchlists"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] text-slate-200 transition"
          >
            <Bookmark size={13} className="text-yellow-400" /> Watchlists
          </Link>

          <Show when="signed-in">
            <div className="flex items-center gap-2 pl-2 border-l border-[#162C4E]">
              <UserButton />
            </div>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-xs px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition font-bold shadow-sm shadow-blue-600/30"
            >
              Sign In
            </Link>
          </Show>
        </div>
      </header>

      {/* ─────────────────── Continuous Multi-Asset Marquee Ticker ─────────────────── */}
      <MarketTicker />

      {/* ─────────────────── Main App Body (Sidebar + Content) ─────────────────── */}
      <div className="flex flex-1 relative w-full">
        {/* Desktop Collapsible Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-[#071426]/90 border-r border-[#162C4E] transition-all duration-300 shrink-0 ${
            isCollapsed ? "w-16 p-2" : "w-56 lg:w-60 p-4"
          }`}
        >
          {/* Section Header or Collapse Rail */}
          {!isCollapsed && (
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
              INTELLIGENCE HUBS
            </div>
          )}

          {/* Navigation Links */}
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
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center rounded-xl text-xs font-semibold transition group ${
                    isCollapsed
                      ? "justify-center p-2.5 my-1"
                      : "justify-between px-3 py-2"
                  } ${
                    isActive
                      ? "bg-blue-600/20 text-white border border-blue-500/40 font-bold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-[#0B1930]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-400 group-hover:text-white transition"
                      }
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Regulatory Safe-Harbor Box */}
          {!isCollapsed && (
            <div className="mt-4 p-3 rounded-xl bg-[#0B1930] border border-[#162C4E] text-[11px] text-slate-400 leading-relaxed">
              <div className="flex items-center gap-1.5 text-white font-bold mb-1">
                <ShieldCheck size={14} className="text-cyan-400" />
                <span>Research Terminal</span>
              </div>
              Read-only analytical intelligence. No trade execution or advisory.
            </div>
          )}

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mt-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1930] transition flex items-center justify-center border border-[#162C4E]"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-sm flex">
            <div className="w-64 bg-[#071426] border-r border-[#162C4E] p-4 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#162C4E]">
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
                  className="w-full bg-[#0B1930] border border-[#162C4E] rounded-lg px-3 py-1.5 text-xs text-white"
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
                          ? "bg-blue-600/20 text-white font-bold"
                          : "text-slate-300 hover:text-white hover:bg-[#0B1930]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-emerald-500/15 text-emerald-400">
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

        {/* ─────────────────── Main Content Canvas ─────────────────── */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 flex flex-col justify-between w-full max-w-[1680px] mx-auto">
          <div className="w-full">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
