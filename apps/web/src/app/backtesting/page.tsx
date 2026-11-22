"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Play,
  TrendingUp,
  TrendingDown,
  BarChart2,
  SlidersHorizontal,
  ShieldAlert,
  HelpCircle,
  Activity,
  ArrowRight,
  Layers,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import {
  runBacktest,
  type BacktestResponse,
} from "@/lib/api";

const PRESET_STRATEGIES = [
  { id: "MA_CROSSOVER", name: "EMA Crossover (9 / 21)", desc: "Enters on fast EMA crossing above slow EMA; exits on cross down." },
  { id: "RSI_MEAN_REVERSION", name: "RSI Mean Reversion", desc: "Buys when RSI dips below 30 (oversold); exits when RSI reaches 70 (overbought)." },
  { id: "SUPERTREND_TREND", name: "Supertrend Trend Follower", desc: "Maintains long exposure during confirmed green supertrend regime." },
  { id: "BOLLINGER_BREAKOUT", name: "Bollinger Volatility Breakout", desc: "Buys when price breaks above upper band; exits on drop below middle SMA." },
];

export default function BacktestingPage() {
  const [symbol, setSymbol] = useState("NIFTY");
  const [strategyType, setStrategyType] = useState<any>("MA_CROSSOVER");
  const [timeframe, setTimeframe] = useState("1D");
  const [initialCapital, setInitialCapital] = useState(1000000);
  const [fastPeriod, setFastPeriod] = useState(9);
  const [slowPeriod, setSlowPeriod] = useState(21);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResponse | null>(null);

  const handleRun = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await runBacktest({
        symbol,
        strategy_type: strategyType,
        timeframe,
        initial_capital: initialCapital,
        fast_period: fastPeriod,
        slow_period: slowPeriod,
        slippage_pct: 0.05,
        fee_pct: 0.03,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backtest execution error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavigationShell activePath="/backtesting">
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#162C4E]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
              <RotateCcw size={14} /> Deterministic Quantitative Strategy Simulator
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
              Strategy Backtester
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed font-sans">
              Test technical and algorithmic trading strategies over historical bars with zero lookahead bias, institutional slippage modeling, and simulated exchange turnover fees.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/charts"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#162C4E] bg-white dark:bg-[#0B1930] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
            >
              Open Chart Terminal
            </Link>
          </div>
        </div>

        {/* Strategy Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_STRATEGIES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setStrategyType(s.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                strategyType === s.id
                  ? "bg-blue-50 dark:bg-blue-600/15 border-blue-500 text-blue-900 dark:text-white ring-1 ring-blue-500/50"
                  : "bg-white dark:bg-[#0B1930] border-slate-200 dark:border-[#162C4E] text-slate-700 dark:text-slate-300 hover:border-blue-400"
              }`}
            >
              <span className="font-bold text-xs">{s.name}</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {s.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleRun} className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
            <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-blue-500" /> Simulation Parameters
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Zero Lookahead Mode Active</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                SYMBOL
              </label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="NIFTY">NIFTY 50</option>
                <option value="BANKNIFTY">BANK NIFTY</option>
                <option value="RELIANCE">RELIANCE</option>
                <option value="HDFCBANK">HDFC BANK</option>
                <option value="TCS">TCS</option>
                <option value="INFY">INFOSYS</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                TIMEFRAME
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="1D">Daily (1D)</option>
                <option value="1H">1 Hour (1H)</option>
                <option value="15m">15 Minutes</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                INITIAL CASH (₹)
              </label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                FAST PERIOD
              </label>
              <input
                type="number"
                value={fastPeriod}
                onChange={(e) => setFastPeriod(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                SLOW PERIOD
              </label>
              <input
                type="number"
                value={slowPeriod}
                onChange={(e) => setSlowPeriod(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-[#071426] border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                SLIPPAGE + FEES
              </label>
              <input
                type="text"
                disabled
                value="0.08% / trade"
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-[#162C4E] rounded-lg px-2.5 py-1.5 text-xs text-slate-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Play size={13} /> {loading ? "Simulating Execution..." : "Execute Backtest"}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Backtest Results Dashboard */}
        {result && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Return</span>
                <span className={`text-lg font-black font-mono mt-0.5 block ${result.total_return_pct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {result.total_return_pct >= 0 ? `+${result.total_return_pct}%` : `${result.total_return_pct}%`}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ₹{result.ending_capital.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">CAGR</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {result.cagr_pct}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Annualized Compounding</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Sharpe Ratio</span>
                <span className="text-lg font-black font-mono text-sky-400 mt-0.5 block">
                  {result.sharpe_ratio}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Rf = 6.5% Annual</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Max Drawdown</span>
                <span className="text-lg font-black font-mono text-rose-400 mt-0.5 block">
                  -{result.max_drawdown_pct}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Peak to Valley Decline</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Win Rate</span>
                <span className="text-lg font-black font-mono text-emerald-400 mt-0.5 block">
                  {result.win_rate_pct}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {result.winning_trades}W / {result.losing_trades}L
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E]">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Profit Factor</span>
                <span className="text-lg font-black font-mono text-amber-400 mt-0.5 block">
                  {result.profit_factor}x
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Gross Gain / Loss</span>
              </div>
            </div>

            {/* Equity Curve Visualizer */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
                <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-500" /> Simulated Capital Equity Curve (₹)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {result.equity_curve.length} Evaluated Candlestick Steps
                </span>
              </div>

              <div className="pt-4 h-48 flex items-end gap-1 overflow-x-auto">
                {result.equity_curve.map((pt, idx) => {
                  const minEq = Math.min(...result.equity_curve.map((e) => e.equity));
                  const maxEq = Math.max(...result.equity_curve.map((e) => e.equity));
                  const heightPct = Math.max(10, ((pt.equity - minEq) / Math.max(1, maxEq - minEq)) * 100);
                  const isGain = pt.equity >= result.initial_capital;

                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-[3px] group relative flex flex-col justify-end h-full"
                    >
                      <div
                        className={`w-full rounded-t transition ${isGain ? "bg-emerald-500/70 group-hover:bg-emerald-400" : "bg-rose-500/70 group-hover:bg-rose-400"}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Executed Trade Log Table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1930] border border-slate-200 dark:border-[#162C4E] shadow-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#162C4E]">
                <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white">
                  Executed Historical Trades Log ({result.trades.length} Trades)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Zero Lookahead Execution</span>
              </div>

              <table className="w-full text-xs text-left font-mono mt-2">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#162C4E] text-[10px] text-slate-400 uppercase">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">ENTRY TIME</th>
                    <th className="py-2.5 px-3">EXIT TIME</th>
                    <th className="py-2.5 px-2 text-right">ENTRY PRICE</th>
                    <th className="py-2.5 px-2 text-right">EXIT PRICE</th>
                    <th className="py-2.5 px-2 text-right">QTY</th>
                    <th className="py-2.5 px-2 text-right">NET P&amp;L (₹)</th>
                    <th className="py-2.5 px-2 text-right">RETURN (%)</th>
                    <th className="py-2.5 px-3">REASON</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#162C4E]/60 text-[11px]">
                  {result.trades.map((t) => (
                    <tr key={t.trade_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 text-slate-400">{t.trade_id}</td>
                      <td className="py-2.5 px-3 text-slate-200">{String(t.entry_time)}</td>
                      <td className="py-2.5 px-3 text-slate-200">{String(t.exit_time)}</td>
                      <td className="py-2.5 px-2 text-right">₹{t.entry_price.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-right">₹{t.exit_price.toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-right text-slate-400">{t.quantity}</td>
                      <td className="py-2.5 px-2 text-right font-bold">
                        <span className={t.net_pnl >= 0 ? "text-emerald-500" : "text-rose-500"}>
                          {t.net_pnl >= 0 ? `+₹${t.net_pnl.toFixed(2)}` : `-₹${Math.abs(t.net_pnl).toFixed(2)}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <span className={t.return_pct >= 0 ? "text-emerald-500" : "text-rose-500"}>
                          {t.return_pct >= 0 ? `+${t.return_pct}%` : `${t.return_pct}%`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{t.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
