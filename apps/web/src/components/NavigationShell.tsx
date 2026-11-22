"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Globe,
  Compass,
  Bookmark,
  Briefcase,
  LineChart,
  Sparkles,
  FileText,
  Bell,
  HelpCircle,
  Settings,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Command,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building2,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import MarketStatusWidget from "@/components/MarketStatusWidget";
import FloatingAssistantChatbot from "@/components/FloatingAssistantChatbot";
import { useTheme } from "./ThemeProvider";
import { searchInstruments, type Instrument } from "@/lib/api";

interface NavigationShellProps {
  children: React.ReactNode;
  activePath?: string;
}

// 8 Primary Navigation Destinations (Phase 4.1)
const MAIN_NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Markets", href: "/markets", icon: Globe },
  { label: "Discover", href: "/discover", icon: Compass, badge: "HUB" },
  { label: "Watchlists", href: "/watchlists", icon: Bookmark },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Research", href: "/research", icon: FileText },
  { label: "Charts", href: "/charts", icon: LineChart, badge: "PRO" },
];

const INTELLIGENCE_NAV = [
  { label: "AI Research", href: "/intelligence", icon: Sparkles, badge: "AI" },
];

const BOTTOM_NAV_ITEMS = [
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Help & Docs", href: "/help", icon: HelpCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface PaletteItem {
  type: string;
  symbol: string;
  name: string;
  href: string;
  price?: string;
  chg?: string;
  exchange?: string;
  isin?: string | null;
}

const QUICK_SEARCH_ITEMS: PaletteItem[] = [
  { type: "EQUITY", symbol: "RELIANCE", name: "Reliance Industries Ltd", href: "/company/reliance", price: "₹1,377.50", chg: "+0.14%", exchange: "NSE" },
  { type: "EQUITY", symbol: "TCS", name: "Tata Consultancy Services", href: "/company/tcs", price: "₹4,180.20", chg: "+1.10%", exchange: "NSE" },
  { type: "EQUITY", symbol: "INFY", name: "Infosys Ltd", href: "/company/infy", price: "₹1,885.60", chg: "-0.65%", exchange: "NSE" },
  { type: "EQUITY", symbol: "TATAMOTORS", name: "Tata Motors Ltd", href: "/company/tatamotors", price: "₹942.50", chg: "+1.97%", exchange: "NSE" },
  { type: "INDEX", symbol: "NIFTY 50", name: "NSE Benchmark Index", href: "/markets", price: "25,800.60", chg: "+1.12%", exchange: "NSE" },
  { type: "INDEX", symbol: "SENSEX", name: "BSE Benchmark Index", href: "/markets", price: "83,919.71", chg: "+1.08%", exchange: "BSE" },
  { type: "COMMODITY", symbol: "GOLD", name: "Gold 24K Spot (MCX)", href: "/markets", price: "₹76,450", chg: "+0.45%", exchange: "MCX" },
  { type: "COMMODITY", symbol: "BRENT", name: "Brent Crude Oil", href: "/markets", price: "$74.20", chg: "-0.85%", exchange: "ICE" },
  { type: "HUB", symbol: "DISCOVER", name: "Stock & ETF Screener Hub", href: "/discover" },
  { type: "AI", symbol: "INTELLIGENCE", name: "MarketScope Unified Intelligence", href: "/intelligence" },
];

export default function NavigationShell({ children, activePath }: NavigationShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn, isLoaded } = useUser();

  // Sidebar expand/collapse state
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Command palette state
  const [commandOpen, setCommandOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Instrument[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const currentPath = activePath || pathname;

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setCommandOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when command palette opens
  useEffect(() => {
    if (commandOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setPaletteQuery("");
      setSearchResults([]);
    }
  }, [commandOpen]);

  // Debounced API search
  useEffect(() => {
    if (!paletteQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchInstruments(paletteQuery.trim());
        setSearchResults(res || []);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [paletteQuery]);

  const handleSelectResult = (href: string) => {
    setCommandOpen(false);
    setMobileMenuOpen(false);
    router.push(href);
  };

  const isRouteActive = (href: string) => {
    if (href === "/" && currentPath === "/") return true;
    if (href !== "/" && currentPath.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex overflow-x-hidden">
      {/* Interactive 3D Perspective Background */}
      <AnimatedBackground />

      {/* ── DESKTOP FIXED SIDEBAR ───────────────────────────────────── */}
      <aside
        aria-label="Sidebar Navigation"
        className={`hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out border-r border-slate-800/80 bg-[#070D18]/95 dark:bg-[#070D18]/95 backdrop-blur-xl ${
          collapsed ? "w-18" : "w-64"
        } select-none`}
      >
        {/* Top: Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between px-3.5 h-16 border-b border-slate-800/70">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <BrandLogo variant={collapsed ? "icon" : "inline"} size={collapsed ? 28 : 24} />
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Middle Navigation: Clean & Non-Scrollable */}
        <div className="flex-1 py-3 px-2.5 flex flex-col justify-between overflow-hidden">
          {/* Main Group */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Main Menu
              </p>
            )}
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      active ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate flex-1 tracking-wide">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
                        active
                          ? "bg-sky-500/25 text-sky-300"
                          : "bg-slate-800 text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Intelligence Section */}
            <div className="pt-2">
              {!collapsed && (
                <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-sky-400/80 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>Intelligence</span>
                </p>
              )}
              {INTELLIGENCE_NAV.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-[0_0_14px_rgba(56,189,248,0.2)]"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-sky-400 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                    {!collapsed && <span className="truncate flex-1 tracking-wide">{item.label}</span>}
                    {!collapsed && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-sky-500/25 text-sky-300 border border-sky-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Utility Group */}
          <div className="pt-3 border-t border-slate-800/60 space-y-1">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-slate-800 text-sky-400 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                </Link>
              );
            })}

            {/* Profile Avatar & Workspace */}
            <div className="pt-2">
              <Link
                href="/workspace"
                title={collapsed ? "Workspace & Profile" : undefined}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  {isLoaded && isSignedIn ? (
                    <UserButton />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold">
                      MS
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">Workspace</p>
                    <p className="text-[10px] text-slate-400 truncate">Settings & Profile</p>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? "md:pl-18" : "md:pl-64"
        }`}
      >
        {/* ── TOP HEADER BAR ──────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 h-16 border-b border-slate-800/80 bg-[#070D18]/90 dark:bg-[#070D18]/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 gap-3">
          {/* Left: Mobile Toggle & Global Search Trigger */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <button
              onClick={() => setCommandOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" />
                <span className="truncate">Search any company, ticker, index, ISIN, or topic...</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                <span>⌘</span>
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Right Header Utilities: Session Status, Theme Toggle, Auth */}
          <div className="flex items-center gap-2.5">
            {/* Live Market Session Indicator & Status Popover */}
            <div className="hidden lg:flex items-center">
              <MarketStatusWidget />
            </div>

            {/* Quick Chart Shortcut */}
            <Link
              href="/charts"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 transition-colors"
            >
              <LineChart className="w-3.5 h-3.5 text-sky-400" />
              <span>Chart</span>
            </Link>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Auth Buttons */}
            {isLoaded && isSignedIn ? (
              <UserButton />
            ) : (
              <Link
                href="/sign-in"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Global Market Ticker Banner */}
        <div className="border-b border-slate-800/60 bg-[#060B14]/80 backdrop-blur z-10">
          <MarketTicker />
        </div>

        {/* Page Content Viewport */}
        <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* ── MOBILE OFF-CANVAS DRAWER ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-xs bg-[#070D18] border-r border-slate-800 flex flex-col h-full z-10 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <BrandLogo variant="inline" size={26} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              <p className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                Main Menu
              </p>
              {MAIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      active ? "bg-sky-500/15 text-sky-400 font-semibold" : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-800">
                <p className="px-2 text-[10px] font-semibold text-sky-400/80 uppercase tracking-widest mb-2">
                  Intelligence
                </p>
                {INTELLIGENCE_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-1">
                {BOTTOM_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800/50"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMAND PALETTE (CMD+K / CTRL+K) ────────────────────────── */}
      {commandOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setCommandOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-[#091120] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="flex items-center px-4 border-b border-slate-800 bg-slate-900/60">
              <Search className="w-5 h-5 text-sky-400 mr-3 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search symbol, company name, ISIN, or navigation..."
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                className="w-full bg-transparent py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50">
              {isSearching ? (
                <div className="py-8 text-center text-xs text-slate-400">Searching global instruments...</div>
              ) : paletteQuery.trim() ? (
                searchResults.length > 0 ? (
                  <div>
                    <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Search Results ({searchResults.length})
                    </p>
                    {searchResults.map((item) => (
                      <button
                        key={item.instrument_id}
                        onClick={() => handleSelectResult(`/company/${item.symbol.toLowerCase()}`)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/70 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-xs text-sky-400 border border-slate-700">
                            {item.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-slate-100 group-hover:text-sky-300">
                                {item.symbol}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-400">
                                {item.exchange}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{item.company_name || item.display_name}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No instruments found matching &quot;{paletteQuery}&quot;.
                  </div>
                )
              ) : (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Quick Navigation & Popular Equities
                  </p>
                  {QUICK_SEARCH_ITEMS.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => handleSelectResult(item.href)}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/70 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 border border-slate-700">
                          {item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-200 group-hover:text-sky-300">
                              {item.symbol}
                            </span>
                            {item.exchange && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                {item.exchange}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{item.name}</p>
                        </div>
                      </div>
                      {item.price && (
                        <div className="text-right">
                          <p className="text-xs font-semibold tabular-nums text-slate-200">{item.price}</p>
                          <p
                            className={`text-[10px] font-medium tabular-nums ${
                              item.chg?.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {item.chg}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── FLOATING AI SUPPORT & RESEARCH CHATBOT ───────────────── */}
      <FloatingAssistantChatbot />
    </div>
  );
}
