"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  getPaperPortfolio,
  placePaperOrder,
  resetPaperAccount,
  type PaperPortfolioResponse,
} from "@/lib/api";

const COMMON_SYMBOLS = ["NIFTY", "BANKNIFTY", "RELIANCE", "HDFCBANK", "TCS", "INFY", "ICICIBANK", "TATAMOTORS"];

export default function PaperTradingPage() {
  const [portfolio, setPortfolio] = useState<PaperPortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Order state
  const [orderSymbol, setOrderSymbol] = useState("RELIANCE");
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [limitPrice, setLimitPrice] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const data = await getPaperPortfolio();
      setPortfolio(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load paper portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await placePaperOrder({
        symbol: orderSymbol,
        side: orderSide,
        order_type: orderType,
        quantity: orderQuantity,
        limit_price: limitPrice !== "" ? Number(limitPrice) : undefined,
      });
      setSuccessMsg(`Simulated ${orderSide} order for ${orderQuantity} ${orderSymbol} executed successfully.`);
      await fetchPortfolio();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order execution failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset virtual account back to initial ₹10,00,000 cash? All virtual positions will be wiped.")) {
      return;
    }
    try {
      await resetPaperAccount();
      await fetchPortfolio();
      setSuccessMsg("Virtual account has been reset to ₹10,00,000 cash.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    }
  };

  return (
    <NavigationShell activePath="/paper-trading">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <Briefcase size={14} /> Risk-Free Virtual Paper Trading Simulator
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Paper Trading Desk
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Test your hypotheses with ₹10,00,000 in simulated virtual capital. Real market prices, mark-to-market valuations, and zero financial risk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw size={13} /> Reset Virtual Account
            </button>
          </div>
        </div>

        {/* Portfolio KPI Cards */}
        {portfolio && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Portfolio Value</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5 block">
                ₹{portfolio.total_portfolio_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Cash + Stock Holdings</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Available Virtual Cash</span>
              <span className="text-lg font-black font-mono text-sky-400 mt-0.5 block">
                ₹{portfolio.available_cash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Unencumbered Capital</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Invested Value</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5 block">
                ₹{portfolio.invested_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{portfolio.positions.length} Active Positions</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Unrealized P&amp;L</span>
              <span className={`text-lg font-black font-mono mt-0.5 block ${portfolio.total_unrealized_pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {portfolio.total_unrealized_pnl >= 0 ? `+₹${portfolio.total_unrealized_pnl.toFixed(2)}` : `-₹${Math.abs(portfolio.total_unrealized_pnl).toFixed(2)}`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Mark-to-Market</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Realized P&amp;L</span>
              <span className={`text-lg font-black font-mono mt-0.5 block ${portfolio.total_realized_pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {portfolio.total_realized_pnl >= 0 ? `+₹${portfolio.total_realized_pnl.toFixed(2)}` : `-₹${Math.abs(portfolio.total_realized_pnl).toFixed(2)}`}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Closed Profits / Losses</span>
            </div>
          </div>
        )}

        {/* 2-Column: Order Execution Pad & Open Holdings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order Pad (4 Cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
              <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white">
                Simulated Order Pad
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Paper Execution</span>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  SYMBOL
                </label>
                <select
                  value={orderSymbol}
                  onChange={(e) => setOrderSymbol(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  {COMMON_SYMBOLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Side: BUY / SELL */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderSide("BUY")}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    orderSide === "BUY"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setOrderSide("SELL")}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                    orderSide === "SELL"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  SELL / EXIT
                </button>
              </div>

              {/* Order Type: MARKET / LIMIT */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">ORDER TYPE</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="MARKET">Market</option>
                    <option value="LIMIT">Limit</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">QUANTITY</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {orderType === "LIMIT" && (
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">LIMIT PRICE (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Simulated Commission:</span>
                  <span>0.03% (₹{(orderQuantity * 1377.5 * 0.0003).toFixed(2)})</span>
                </div>
                <div className="flex justify-between font-bold text-slate-200">
                  <span>Execution Guarantee:</span>
                  <span className="text-emerald-400">Instant Virtual Fill</span>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                  {error}
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs transition text-white shadow-xs ${
                  orderSide === "BUY" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"
                }`}
              >
                {isSubmitting ? "Executing Fill..." : `Submit Simulated ${orderSide}`}
              </button>
            </form>
          </div>

          {/* Open Holdings Table (8 Cols) */}
          <div className="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
              <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white">
                Active Open Portfolio Holdings ({portfolio?.positions.length || 0})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Real-Time MTM Valuations</span>
            </div>

            <table className="w-full text-xs text-left font-mono mt-2">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#162C4E] text-[10px] text-slate-400 uppercase">
                  <th className="py-2.5 px-3">SYMBOL</th>
                  <th className="py-2.5 px-2 text-right">QTY</th>
                  <th className="py-2.5 px-2 text-right">AVG BUY</th>
                  <th className="py-2.5 px-2 text-right">LTP (₹)</th>
                  <th className="py-2.5 px-2 text-right">CURRENT VAL</th>
                  <th className="py-2.5 px-2 text-right">UNREALIZED P&amp;L</th>
                  <th className="py-2.5 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-[11px]">
                {portfolio?.positions.map((p) => (
                  <tr key={p.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      <Link href={`/company/${p.symbol.toLowerCase()}`} className="hover:text-sky-400">
                        {p.symbol}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-right text-slate-200">{p.quantity}</td>
                    <td className="py-3 px-2 text-right text-slate-400">₹{p.average_price.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right font-medium text-slate-900 dark:text-white">
                      ₹{p.current_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-200 font-medium">
                      ₹{p.current_value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-2 text-right font-bold">
                      <span className={p.unrealized_pnl >= 0 ? "text-emerald-500" : "text-rose-500"}>
                        {p.unrealized_pnl >= 0 ? `+₹${p.unrealized_pnl.toFixed(2)}` : `-₹${Math.abs(p.unrealized_pnl).toFixed(2)}`}
                        {" "}({p.unrealized_pnl_pct.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={async () => {
                          setOrderSymbol(p.symbol);
                          setOrderSide("SELL");
                          setOrderQuantity(p.quantity);
                        }}
                        className="px-2 py-1 rounded bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white text-[10px] font-bold transition"
                      >
                        Exit
                      </button>
                    </td>
                  </tr>
                ))}

                {(!portfolio || portfolio.positions.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                      No open holdings. Use the order pad on the left to simulate your first trade.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NavigationShell>
  );
}
