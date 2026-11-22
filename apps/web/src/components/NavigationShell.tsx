"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Sun,
  Moon,
  Sparkles,
  Server,
  ArrowRight,
  TrendingDown,
  BarChart2,
  Activity,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import MarketTicker from "@/components/MarketTicker";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useTheme } from "./ThemeProvider";
import { searchInstruments, type Instrument } from "@/lib/api";

interface NavigationShellProps {
  children: React.ReactNode;
  activePath?: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Charts Terminal", href: "/charts", icon: BarChart2, badge: "PRO" },
  { label: "Markets Hub", href: "/markets", icon: Globe },
  { label: "Stocks Discovery", href: "/stocks", icon: TrendingUp },
  { label: "Options & Derivatives", href: "/derivatives", icon: Activity, badge: "GREEKS" },
  { label: "Market Flow", href: "/market-intelligence", icon: Sparkles },
  { label: "Screeners", href: "/screener", icon: Filter },
  { label: "Backtesting", href: "/backtesting", icon: RotateCcw },
  { label: "Paper Trading", href: "/paper-trading", icon: CheckCircle2 },
  { label: "News Intelligence", href: "/news", icon: Newspaper, badge: "LIVE" },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Peer Comparison", href: "/compare", icon: BarChart3 },
  { label: "Watchlists", href: "/watchlists", icon: Bookmark },
  { label: "Calendar & Events", href: "/calendar", icon: Calendar },
  { label: "Data Quality & Feeds", href: "/admin/market-data", icon: Server },
  { label: "Workspace & Privacy", href: "/workspace", icon: ShieldCheck },
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
  has_multiple_listings?: boolean;
}

const QUICK_SEARCH_ITEMS: PaletteItem[] = [
  { type: "EQUITY", symbol: "RELIANCE", name: "Reliance Industries Ltd", href: "/company/reliance", price: "₹1,377.50", chg: "+0.14%", exchange: "NSE" },
  { type: "EQUITY", symbol: "TCS", name: "Tata Consultancy Services", href: "/company/tcs", price: "₹4,180.20", chg: "+1.10%", exchange: "NSE" },
  { type: "EQUITY", symbol: "INFY", name: "Infosys Ltd", href: "/company/infy", price: "₹1,885.60", chg: "-0.65%", exchange: "NSE", has_multiple_listings: true },
  { type: "EQUITY", symbol: "TATAMOTORS", name: "Tata Motors Ltd", href: "/company/tatamotors", price: "₹942.50", chg: "+1.97%", exchange: "NSE", has_multiple_listings: true },
  { type: "INDEX", symbol: "NIFTY 50", name: "NSE Benchmark Index", href: "/markets", price: "25,800.60", chg: "+1.12%", exchange: "NSE" },
  { type: "INDEX", symbol: "SENSEX", name: "BSE Benchmark Index", href: "/markets", price: "83,919.71", chg: "+1.08%", exchange: "BSE" },
  { type: "COMMODITY", symbol: "GOLD", name: "Gold 24K Spot (MCX)", href: "/markets", price: "₹76,450", chg: "+0.45%", exchange: "MCX" },
  { type: "COMMODITY", symbol: "BRENT", name: "Brent Crude Oil", href: "/markets", price: "$74.20", chg: "-0.85%", exchange: "ICE" },
  { type: "PAGE", symbol: "SCREENER", name: "Quantitative Stock Screener", href: "/screener" },
  { type: "PAGE", symbol: "NEWS", name: "Verified Financial Wire", href: "/news" },
  { type: "PAGE", symbol: "CALENDAR", name: "Global Economic Calendar", href: "/calendar" },
];

export default function NavigationShell({ children, activePath }: NavigationShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = activePath || pathname;
  const { theme, toggleTheme } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [serverResults, setServerResults] = useState<Instrument[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Keyboard shortcut Ctrl+K to open Command Palette, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced server search against Universal Instrument Master
  useEffect(() => {
    const q = paletteQuery.trim();
    if (!q) {
      setServerResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      searchInstruments(q, { limit: 10 })
        .then((items) => {
          setServerResults(items || []);
        })
        .catch(() => {
          setServerResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 200);

    return () => clearTimeout(timer);
  }, [paletteQuery]);

  const matchingStaticPages = QUICK_SEARCH_ITEMS.filter(
    (i) =>
      i.type === "PAGE" &&
      (i.symbol.toLowerCase().includes(paletteQuery.toLowerCase()) ||
        i.name.toLowerCase().includes(paletteQuery.toLowerCase()))
  );

  const displayedItems: PaletteItem[] =
    paletteQuery.trim().length === 0
      ? QUICK_SEARCH_ITEMS
      : [
          ...matchingStaticPages,
          ...serverResults.map((item) => ({
            type: item.security_type || "EQUITY",
            symbol: item.symbol,
            name: item.display_name || item.company_name,
            href: `/company/${item.symbol.toLowerCase()}`,
            price:
              item.price !== undefined
                ? item.currency === "INR"
                  ? `₹${item.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `$${item.price.toFixed(2)}`
                : undefined,
            chg:
              item.change_pct !== undefined
                ? `${item.change_pct >= 0 ? "+" : ""}${item.change_pct.toFixed(2)}%`
                : undefined,
            exchange: item.exchange,
            isin: item.isin,
            has_multiple_listings: item.has_multiple_listings,
          })),
        ];

  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 relative ${
        isLight ? "bg-[#F8FAFC] text-slate-900" : "bg-[#071426] text-slate-100"
      }`}
    >
      {/* Dynamic Visual Constellation & Ambient Glow */}
      <AnimatedBackground />

      {/* ─────────────────── Header Topbar ─────────────────── */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md px-4 md:px-6 h-14 flex items-center justify-between border-b transition-colors ${
          isLight
            ? "bg-white/85 border-slate-200 shadow-xs"
            : "bg-[#071426]/90 border-[#162C4E]"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-1.5 rounded-lg transition ${
              isLight
                ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                : "text-slate-400 hover:text-white hover:bg-[#0B1930]"
            }`}
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

        {/* Global Terminal Search Bar / Command Palette Trigger */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className={`w-full flex items-center justify-between rounded-xl pl-3.5 pr-2.5 py-1.5 text-xs transition border text-left shadow-xs ${
              isLight
                ? "bg-white border-slate-200 text-slate-400 hover:border-blue-400 hover:text-slate-600"
                : "bg-[#0B1930] border-[#162C4E] text-slate-400 hover:border-blue-500 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <span>Search companies, symbols, filings, news (e.g. Reliance, Nifty, Gold)...</span>
            </div>
            <div
              className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-500"
                  : "bg-[#071426] border-[#162C4E] text-slate-400"
              }`}
            >
              <Command size={10} /> K
            </div>
          </button>
        </div>

        {/* Right Controls: Market Status, Theme Switcher & User Auth */}
        <div className="flex items-center gap-2.5">
          {/* Live Market Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>NSE: OPEN · IST</span>
          </div>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={toggleTheme}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className={`p-2 rounded-xl transition border flex items-center justify-center ${
              isLight
                ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600"
                : "bg-[#0B1930] hover:bg-[#10223B] border-[#162C4E] text-cyan-400"
            }`}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Quick Watchlists Link */}
          <Link
            href="/watchlists"
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
              isLight
                ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs"
                : "bg-[#0B1930] hover:bg-[#10223B] border-[#162C4E] text-slate-200"
            }`}
          >
            <Bookmark size={13} className="text-amber-500" /> Watchlists
          </Link>

          {/* Clerk Auth Integration */}
          <Show when="signed-in">
            <div className={`flex items-center pl-2 border-l ${isLight ? "border-slate-200" : "border-[#162C4E]"}`}>
              <UserButton />
            </div>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-xs px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition font-bold shadow-md shadow-blue-600/20"
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
          className={`hidden md:flex flex-col border-r transition-all duration-300 shrink-0 ${
            isLight
              ? "bg-slate-50/90 border-slate-200"
              : "bg-[#071426]/90 border-[#162C4E]"
          } ${isCollapsed ? "w-16 p-2" : "w-56 lg:w-60 p-4"}`}
        >
          {/* Section Header */}
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
                      ? isLight
                        ? "bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-xs"
                        : "bg-blue-600/20 text-white border border-blue-500/40 font-bold shadow-sm"
                      : isLight
                      ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      : "text-slate-300 hover:text-white hover:bg-[#0B1930]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={
                        isActive
                          ? "text-blue-500"
                          : isLight
                          ? "text-slate-400 group-hover:text-slate-700"
                          : "text-slate-400 group-hover:text-white"
                      }
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Safe-Harbor Box */}
          {!isCollapsed && (
            <div
              className={`mt-4 p-3 rounded-xl border text-[11px] leading-relaxed ${
                isLight
                  ? "bg-white border-slate-200 text-slate-500"
                  : "bg-[#0B1930] border-[#162C4E] text-slate-400"
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-bold mb-1 ${
                  isLight ? "text-slate-800" : "text-white"
                }`}
              >
                <ShieldCheck size={14} className="text-cyan-500" />
                <span>Research Terminal</span>
              </div>
              Read-only analytical intelligence. Zero brokerage execution or advisory.
            </div>
          )}

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`mt-3 p-2 rounded-xl transition flex items-center justify-center border ${
              isLight
                ? "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
                : "text-slate-400 hover:text-white hover:bg-[#0B1930] border-[#162C4E]"
            }`}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-sm flex">
            <div
              className={`w-64 border-r p-4 flex flex-col h-full shadow-2xl ${
                isLight ? "bg-white border-slate-200" : "bg-[#071426] border-[#162C4E]"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-inherit">
                <BrandLogo variant="inline" size={26} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Quick Search Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCommandPaletteOpen(true);
                }}
                className={`w-full my-3 flex items-center gap-2 px-3 py-2 rounded-xl border text-xs text-left ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-500"
                    : "bg-[#0B1930] border-[#162C4E] text-slate-400"
                }`}
              >
                <Search size={14} />
                <span>Quick Search (Ctrl+K)...</span>
              </button>

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
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive
                          ? "bg-blue-600/20 text-blue-500 font-bold"
                          : isLight
                          ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          : "text-slate-300 hover:text-white hover:bg-[#0B1930]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-emerald-500/15 text-emerald-500 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Theme Toggle */}
              <div className="pt-3 border-t border-inherit flex items-center justify-between">
                <span className="text-xs text-slate-400">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-[#0B1930] text-slate-700 dark:text-cyan-400"
                >
                  {isLight ? <Moon size={16} /> : <Sun size={16} />}
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* ─────────────────── Main Content Canvas ─────────────────── */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 flex flex-col justify-between w-full max-w-[1680px] mx-auto z-10">
          <div className="w-full animate-fade-up">{children}</div>
          <Footer />
        </main>
      </div>

      {/* ─────────────────── Global Command Palette Modal (Ctrl+K) ─────────────────── */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 md:pt-24 bg-black/70 backdrop-blur-sm animate-in fade-in select-none">
          <div
            className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
              isLight ? "bg-white border-slate-200" : "bg-[#0B1930] border-[#162C4E]"
            }`}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-inherit">
              <Search size={18} className="text-blue-500 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search symbol, company name, or ISIN (e.g. INFY, Apple, Reliance)..."
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && displayedItems.length > 0) {
                    router.push(displayedItems[0].href);
                    setIsCommandPaletteOpen(false);
                  }
                }}
                className="w-full bg-transparent outline-none text-sm text-inherit placeholder-slate-400 font-sans"
              />
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <button
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-inherit"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs">
              {displayedItems.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  {isSearching ? "Searching global instrument master..." : "No matching instruments or pages found."}
                </div>
              ) : (
                displayedItems.map((item, idx) => {
                  const isUp = item.chg?.startsWith("+");
                  return (
                    <button
                      key={`${item.symbol}-${item.exchange || idx}`}
                      onClick={() => {
                        router.push(item.href);
                        setIsCommandPaletteOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group ${
                        isLight
                          ? "hover:bg-slate-100 text-slate-800"
                          : "hover:bg-[#10223B] text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            item.type === "EQUITY"
                              ? "bg-blue-500/15 text-blue-500"
                              : item.type === "INDEX"
                              ? "bg-cyan-500/15 text-cyan-500"
                              : item.type === "COMMODITY"
                              ? "bg-amber-500/15 text-amber-500"
                              : "bg-slate-500/15 text-slate-400"
                          }`}
                        >
                          {item.type}
                        </span>
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{item.symbol}</span>
                            {item.exchange && (
                              <span className="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {item.exchange}
                              </span>
                            )}
                            {item.has_multiple_listings && (
                              <span className="text-[9px] font-sans font-medium px-1 py-0.2 rounded bg-indigo-500/15 text-indigo-400">
                                Multi-Listed
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans truncate max-w-xs md:max-w-sm">
                            {item.name}
                            {item.isin && <span className="ml-1.5 font-mono text-[10px] opacity-75">· {item.isin}</span>}
                          </div>
                        </div>
                      </div>

                      {item.price ? (
                        <div className="text-right font-mono">
                          <div className="font-bold">{item.price}</div>
                          <div
                            className={`text-[10px] font-bold ${
                              isUp ? "text-emerald-500" : "text-rose-500"
                            }`}
                          >
                            {item.chg}
                          </div>
                        </div>
                      ) : (
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-500 transition" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              className={`flex items-center justify-between px-4 py-2 border-t text-[10px] text-slate-400 font-mono ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-[#071426] border-[#162C4E]"
              }`}
            >
              <span>Tip: Press Enter to select first result</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
