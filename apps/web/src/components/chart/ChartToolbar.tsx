"use client";

import { useState } from "react";
import {
  CandlestickChart,
  BarChart2,
  LineChart,
  AreaChart,
  Activity,
  Maximize2,
  Camera,
  Layers,
  ChevronDown,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Plus,
  Compass,
} from "lucide-react";

export type ChartTypeOption =
  | "CANDLESTICK"
  | "HOLLOW_CANDLES"
  | "BAR"
  | "LINE"
  | "AREA"
  | "BASELINE"
  | "HEIKIN_ASHI";

interface ChartToolbarProps {
  symbol: string;
  exchange: string;
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  chartType: ChartTypeOption;
  onChartTypeChange: (ct: ChartTypeOption) => void;
  onOpenIndicators: () => void;
  activeIndicatorsCount: number;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onExportScreenshot: () => void;
  onResetChart: () => void;
}

const TIMEFRAMES = [
  { label: "1m", value: "1m", group: "intraday" },
  { label: "5m", value: "5m", group: "intraday" },
  { label: "15m", value: "15m", group: "intraday" },
  { label: "30m", value: "30m", group: "intraday" },
  { label: "1H", value: "1H", group: "hourly" },
  { label: "4H", value: "4H", group: "hourly" },
  { label: "1D", value: "1D", group: "daily" },
  { label: "1W", value: "1W", group: "weekly" },
  { label: "1M", value: "1M", group: "monthly" },
  { label: "1Y", value: "1Y", group: "yearly" },
];

const CHART_TYPES: { id: ChartTypeOption; label: string; icon: any }[] = [
  { id: "CANDLESTICK", label: "Candles", icon: CandlestickChart },
  { id: "HOLLOW_CANDLES", label: "Hollow Candles", icon: CandlestickChart },
  { id: "BAR", label: "OHLC Bars", icon: BarChart2 },
  { id: "LINE", label: "Line", icon: LineChart },
  { id: "AREA", label: "Area", icon: AreaChart },
  { id: "BASELINE", label: "Baseline", icon: Activity },
  { id: "HEIKIN_ASHI", label: "Heikin-Ashi", icon: CandlestickChart },
];

export default function ChartToolbar({
  symbol,
  exchange,
  timeframe,
  onTimeframeChange,
  chartType,
  onChartTypeChange,
  onOpenIndicators,
  activeIndicatorsCount,
  onToggleFullscreen,
  isFullscreen,
  onExportScreenshot,
  onResetChart,
}: ChartToolbarProps) {
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const CurrentTypeIcon =
    CHART_TYPES.find((c) => c.id === chartType)?.icon || CandlestickChart;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#071426] border-b border-[#162C4E] text-xs font-mono select-none">
      {/* Left: Symbol & Timeframe Cluster */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Symbol & Exchange Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1930] border border-[#162C4E] font-bold text-white shadow-sm">
          <span className="text-cyan-400">{symbol}</span>
          <span className="text-[10px] text-slate-400 font-normal">· {exchange}</span>
        </div>

        <div className="h-4 w-px bg-[#162C4E] mx-1 hidden sm:block" />

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-0.5 bg-[#0B1930] p-0.5 rounded-lg border border-[#162C4E]">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => onTimeframeChange(tf.value)}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                timeframe === tf.value
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-[#10223B]"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[#162C4E] mx-1 hidden sm:block" />

        {/* Chart Type Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] text-slate-300 hover:text-white transition"
          >
            <CurrentTypeIcon size={14} className="text-cyan-400" />
            <span className="text-[11px] font-semibold hidden sm:inline">
              {CHART_TYPES.find((c) => c.id === chartType)?.label}
            </span>
            <ChevronDown size={11} className="text-slate-400" />
          </button>

          {typeDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-44 rounded-xl bg-[#0B1930] border border-[#162C4E] shadow-2xl z-50 p-1 space-y-0.5">
              {CHART_TYPES.map((ct) => {
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.id}
                    onClick={() => {
                      onChartTypeChange(ct.id);
                      setTypeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                      chartType === ct.id
                        ? "bg-blue-600/20 text-cyan-400 font-bold"
                        : "text-slate-300 hover:text-white hover:bg-[#10223B]"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{ct.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Indicators Trigger Button */}
        <button
          onClick={onOpenIndicators}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1930] hover:bg-[#10223B] border border-[#162C4E] text-slate-300 hover:text-white transition relative"
        >
          <Activity size={13} className="text-emerald-400" />
          <span className="text-[11px] font-semibold">Indicators</span>
          {activeIndicatorsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              {activeIndicatorsCount}
            </span>
          )}
        </button>
      </div>

      {/* Right Controls: Reset, Screenshot & Fullscreen */}
      <div className="flex items-center gap-1">
        <button
          onClick={onResetChart}
          title="Reset Zoom & Scale"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1930] border border-transparent hover:border-[#162C4E] transition"
        >
          <RotateCcw size={13} />
        </button>

        <button
          onClick={onExportScreenshot}
          title="Export Chart Image"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1930] border border-transparent hover:border-[#162C4E] transition"
        >
          <Camera size={13} />
        </button>

        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B1930] hover:bg-blue-600/20 border border-[#162C4E] text-slate-300 hover:text-cyan-400 transition"
        >
          <Maximize2 size={13} />
          <span className="text-[11px] font-semibold hidden sm:inline">
            {isFullscreen ? "Exit" : "Full Screen"}
          </span>
        </button>
      </div>
    </div>
  );
}
