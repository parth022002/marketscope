"use client";

import { useState } from "react";
import { X, Check, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";

export interface ActiveIndicatorState {
  sma: { enabled: boolean; period: number; color: string };
  ema: { enabled: boolean; period: number; color: string };
  vwap: { enabled: boolean; color: string };
  bollinger: { enabled: boolean; period: number; stdDev: number; color: string };
  rsi: { enabled: boolean; period: number; overbought: number; oversold: number };
  macd: { enabled: boolean; fast: number; slow: number; signal: number };
  supertrend: { enabled: boolean; period: number; multiplier: number };
  atr: { enabled: boolean; period: number };
  stochastic: { enabled: boolean; kPeriod: number; dPeriod: number };
  obv: { enabled: boolean; color: string };
}

export const DEFAULT_INDICATORS_STATE: ActiveIndicatorState = {
  sma: { enabled: false, period: 20, color: "#38bdf8" },
  ema: { enabled: false, period: 50, color: "#a855f7" },
  vwap: { enabled: false, color: "#f59e0b" },
  bollinger: { enabled: false, period: 20, stdDev: 2.0, color: "#22d3ee" },
  rsi: { enabled: false, period: 14, overbought: 70, oversold: 30 },
  macd: { enabled: false, fast: 12, slow: 26, signal: 9 },
  supertrend: { enabled: false, period: 10, multiplier: 3.0 },
  atr: { enabled: false, period: 14 },
  stochastic: { enabled: false, kPeriod: 14, dPeriod: 3 },
  obv: { enabled: false, color: "#ec4899" },
};

interface ChartIndicatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ActiveIndicatorState;
  onChange: (newState: ActiveIndicatorState) => void;
}

export default function ChartIndicatorsModal({
  isOpen,
  onClose,
  state,
  onChange,
}: ChartIndicatorsModalProps) {
  const [localState, setLocalState] = useState<ActiveIndicatorState>(state);
  const [category, setCategory] = useState<"all" | "trend" | "momentum" | "volatility" | "volume">("all");

  if (!isOpen) return null;

  const handleToggle = (key: keyof ActiveIndicatorState) => {
    const updated = {
      ...localState,
      [key]: {
        ...localState[key],
        enabled: !localState[key].enabled,
      },
    };
    setLocalState(updated);
    onChange(updated);
  };

  const handleResetDefaults = () => {
    setLocalState(DEFAULT_INDICATORS_STATE);
    onChange(DEFAULT_INDICATORS_STATE);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-[#0B1930] border border-[#162C4E] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#162C4E] bg-[#071426]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Technical Indicators & Overlays</h3>
              <p className="text-xs text-slate-400">
                Calibrated mathematical indicators calculated in real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#10223B] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 border-b border-[#162C4E] bg-[#09182E] text-xs">
          {(["all", "trend", "momentum", "volatility", "volume"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                category === cat
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-400 hover:text-white hover:bg-[#10223B]"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition"
            >
              <RotateCcw size={12} />
              <span>Reset All</span>
            </button>
          </div>
        </div>

        {/* Indicator List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-xs">
          {/* SMA */}
          {(category === "all" || category === "trend") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.sma.enabled}
                  onChange={() => handleToggle("sma")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">Simple Moving Average (SMA)</div>
                  <div className="text-[11px] text-slate-400">Arithmetic mean price over specified period</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#0B1930] px-2.5 py-1 rounded-lg border border-[#162C4E]">
                  <span className="text-slate-400 text-[10px]">Length:</span>
                  <input
                    type="number"
                    min={2}
                    max={500}
                    value={localState.sma.period}
                    onChange={(e) => {
                      const updated = {
                        ...localState,
                        sma: { ...localState.sma, period: Number(e.target.value) || 20 },
                      };
                      setLocalState(updated);
                      onChange(updated);
                    }}
                    className="w-12 bg-transparent text-white font-bold text-right outline-none"
                  />
                </div>
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: localState.sma.color }} />
              </div>
            </div>
          )}

          {/* EMA */}
          {(category === "all" || category === "trend") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.ema.enabled}
                  onChange={() => handleToggle("ema")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">Exponential Moving Average (EMA)</div>
                  <div className="text-[11px] text-slate-400">Weighted average giving higher emphasis to recent bars</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#0B1930] px-2.5 py-1 rounded-lg border border-[#162C4E]">
                  <span className="text-slate-400 text-[10px]">Length:</span>
                  <input
                    type="number"
                    min={2}
                    max={500}
                    value={localState.ema.period}
                    onChange={(e) => {
                      const updated = {
                        ...localState,
                        ema: { ...localState.ema, period: Number(e.target.value) || 50 },
                      };
                      setLocalState(updated);
                      onChange(updated);
                    }}
                    className="w-12 bg-transparent text-white font-bold text-right outline-none"
                  />
                </div>
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: localState.ema.color }} />
              </div>
            </div>
          )}

          {/* VWAP */}
          {(category === "all" || category === "volume" || category === "trend") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.vwap.enabled}
                  onChange={() => handleToggle("vwap")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">Volume Weighted Average Price (VWAP)</div>
                  <div className="text-[11px] text-slate-400">Cumulative (Typical Price × Volume) / Cumulative Volume</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Session Anchor
                </span>
                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: localState.vwap.color }} />
              </div>
            </div>
          )}

          {/* Bollinger Bands */}
          {(category === "all" || category === "volatility") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.bollinger.enabled}
                  onChange={() => handleToggle("bollinger")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">Bollinger Bands (BB)</div>
                  <div className="text-[11px] text-slate-400">SMA middle band with ±K standard deviation channels</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#0B1930] px-2 py-1 rounded-lg border border-[#162C4E]">
                  <span className="text-slate-400 text-[10px]">Len:</span>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={localState.bollinger.period}
                    onChange={(e) => {
                      const updated = {
                        ...localState,
                        bollinger: { ...localState.bollinger, period: Number(e.target.value) || 20 },
                      };
                      setLocalState(updated);
                      onChange(updated);
                    }}
                    className="w-8 bg-transparent text-white font-bold text-right outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 bg-[#0B1930] px-2 py-1 rounded-lg border border-[#162C4E]">
                  <span className="text-slate-400 text-[10px]">StdDev:</span>
                  <input
                    type="number"
                    step={0.5}
                    min={1}
                    max={5}
                    value={localState.bollinger.stdDev}
                    onChange={(e) => {
                      const updated = {
                        ...localState,
                        bollinger: { ...localState.bollinger, stdDev: Number(e.target.value) || 2.0 },
                      };
                      setLocalState(updated);
                      onChange(updated);
                    }}
                    className="w-8 bg-transparent text-white font-bold text-right outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* RSI */}
          {(category === "all" || category === "momentum") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.rsi.enabled}
                  onChange={() => handleToggle("rsi")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">Relative Strength Index (RSI)</div>
                  <div className="text-[11px] text-slate-400">Wilder's 14-period momentum oscillator (0–100)</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#0B1930] px-2 py-1 rounded-lg border border-[#162C4E]">
                  <span className="text-slate-400 text-[10px]">Period:</span>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={localState.rsi.period}
                    onChange={(e) => {
                      const updated = {
                        ...localState,
                        rsi: { ...localState.rsi, period: Number(e.target.value) || 14 },
                      };
                      setLocalState(updated);
                      onChange(updated);
                    }}
                    className="w-8 bg-transparent text-white font-bold text-right outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Levels: 70/30</span>
              </div>
            </div>
          )}

          {/* MACD */}
          {(category === "all" || category === "momentum" || category === "trend") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.macd.enabled}
                  onChange={() => handleToggle("macd")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">MACD (Moving Average Convergence Divergence)</div>
                  <div className="text-[11px] text-slate-400">Fast EMA (12) - Slow EMA (26) with 9-period Signal line</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0B1930] px-2.5 py-1 rounded-lg border border-[#162C4E]">
                <span className="text-slate-400 text-[10px]">12 / 26 / 9</span>
              </div>
            </div>
          )}

          {/* Supertrend */}
          {(category === "all" || category === "trend") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.supertrend.enabled}
                  onChange={() => handleToggle("supertrend")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">Supertrend</div>
                  <div className="text-[11px] text-slate-400">Volatility trailing stop indicator using ATR multiplier</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[#0B1930] px-2 py-1 rounded-lg border border-[#162C4E]">
                  <span className="text-slate-400 text-[10px]">ATR:</span>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={localState.supertrend.period}
                    onChange={(e) => {
                      const updated = {
                        ...localState,
                        supertrend: { ...localState.supertrend, period: Number(e.target.value) || 10 },
                      };
                      setLocalState(updated);
                      onChange(updated);
                    }}
                    className="w-8 bg-transparent text-white font-bold text-right outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 bg-[#0B1930] px-2 py-1 rounded-lg border border-[#162C4E]">
                  <span className="text-slate-400 text-[10px]">Mult:</span>
                  <input
                    type="number"
                    step={0.5}
                    min={1}
                    max={10}
                    value={localState.supertrend.multiplier}
                    onChange={(e) => {
                      const updated = {
                        ...localState,
                        supertrend: { ...localState.supertrend, multiplier: Number(e.target.value) || 3.0 },
                      };
                      setLocalState(updated);
                      onChange(updated);
                    }}
                    className="w-8 bg-transparent text-white font-bold text-right outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ATR */}
          {(category === "all" || category === "volatility") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.atr.enabled}
                  onChange={() => handleToggle("atr")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">Average True Range (ATR)</div>
                  <div className="text-[11px] text-slate-400">Market volatility gauge across recent price range extremes</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#0B1930] px-2.5 py-1 rounded-lg border border-[#162C4E]">
                <span className="text-slate-400 text-[10px]">Period:</span>
                <input
                  type="number"
                  min={2}
                  max={50}
                  value={localState.atr.period}
                  onChange={(e) => {
                    const updated = {
                      ...localState,
                      atr: { ...localState.atr, period: Number(e.target.value) || 14 },
                    };
                    setLocalState(updated);
                    onChange(updated);
                  }}
                  className="w-8 bg-transparent text-white font-bold text-right outline-none"
                />
              </div>
            </div>
          )}

          {/* On-Balance Volume */}
          {(category === "all" || category === "volume") && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#071426] border border-[#162C4E] hover:border-[#1F3E6E] transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localState.obv.enabled}
                  onChange={() => handleToggle("obv")}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0B1930] border-slate-600 focus:ring-0 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-white font-sans text-sm">On-Balance Volume (OBV)</div>
                  <div className="text-[11px] text-slate-400">Cumulative momentum volume tracking institutional flow</div>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: localState.obv.color }} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#162C4E] bg-[#071426]">
          <span className="text-xs text-slate-400">
            {Object.values(localState).filter((v) => v.enabled).length} Active Indicator(s)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
