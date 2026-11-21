"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Maximize2 } from "lucide-react";
import MarketSparkline from "./MarketSparkline";

interface ChartPoint {
  time: string;
  price: number;
}

const TIMEFRAME_DATA: Record<string, { points: ChartPoint[]; changePct: number }> = {
  "1D": {
    changePct: 1.12,
    points: [
      { time: "09:15", price: 25514.30 },
      { time: "10:00", price: 25580.00 },
      { time: "11:00", price: 25640.00 },
      { time: "12:00", price: 25610.00 },
      { time: "13:00", price: 25720.00 },
      { time: "14:00", price: 25750.00 },
      { time: "15:00", price: 25790.00 },
      { time: "15:30", price: 25800.60 },
    ],
  },
  "1W": {
    changePct: 2.15,
    points: [
      { time: "Mon", price: 25250.00 },
      { time: "Tue", price: 25380.00 },
      { time: "Wed", price: 25490.00 },
      { time: "Thu", price: 25620.00 },
      { time: "Fri", price: 25800.60 },
    ],
  },
  "1M": {
    changePct: 1.48,
    points: [
      { time: "W1", price: 25420.00 },
      { time: "W2", price: 25310.00 },
      { time: "W3", price: 25600.00 },
      { time: "W4", price: 25800.60 },
    ],
  },
  "1Y": {
    changePct: 14.65,
    points: [
      { time: "Q1", price: 22500.00 },
      { time: "Q2", price: 23800.00 },
      { time: "Q3", price: 24900.00 },
      { time: "Q4", price: 25800.60 },
    ],
  },
};

interface IndexPerformanceChartProps {
  selectedIndex?: string;
  onSelectIndex?: (symbol: string) => void;
}

export default function IndexPerformanceChart({
  selectedIndex = "NIFTY 50",
}: IndexPerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1D");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeSeries = TIMEFRAME_DATA[timeframe];
  const isPositive = activeSeries.changePct >= 0;
  const currentPrice = hoverIndex !== null
    ? activeSeries.points[hoverIndex].price
    : activeSeries.points[activeSeries.points.length - 1].price;
  const currentTime = hoverIndex !== null
    ? activeSeries.points[hoverIndex].time
    : "Live Closing";

  const prices = activeSeries.points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  // Chart dimensions
  const width = 560;
  const height = 180;
  const padX = 20;
  const padY = 25;
  const effW = width - padX * 2;
  const effH = height - padY * 2;

  const points = activeSeries.points.map((p, i) => ({
    x: padX + (i / (activeSeries.points.length - 1)) * effW,
    y: height - padY - ((p.price - min) / range) * effH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  const strokeColor = isPositive ? "#10B981" : "#EF4444";

  return (
    <div className="bg-[#0B1930] border border-[#162C4E] rounded-2xl p-5 flex flex-col justify-between">
      {/* Chart Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#162C4E]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {selectedIndex} Benchmark Chart
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#071426] text-cyan-400 border border-[#162C4E]">
              NSE
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">
              ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? "+" : ""}
              {activeSeries.changePct.toFixed(2)}% ({timeframe})
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Timeframe Chips */}
        <div className="flex items-center gap-1 bg-[#071426] border border-[#162C4E] p-1 rounded-xl text-xs font-mono">
          {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoverIndex(null);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                timeframe === tf
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div className="relative mt-4 w-full h-[180px] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="main-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.22} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Grid Lines */}
          <line
            x1={padX}
            y1={padY}
            x2={width - padX}
            y2={padY}
            stroke="#162C4E"
            strokeDasharray="3 3"
          />
          <line
            x1={padX}
            y1={height / 2}
            x2={width - padX}
            y2={height / 2}
            stroke="#162C4E"
            strokeDasharray="3 3"
          />
          <line
            x1={padX}
            y1={height - padY}
            x2={width - padX}
            y2={height - padY}
            stroke="#162C4E"
            strokeDasharray="3 3"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#main-chart-fill)" />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Points with hover hitboxes */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? 5 : 2.5}
                fill={hoverIndex === i ? "#FFFFFF" : strokeColor}
                stroke={hoverIndex === i ? strokeColor : "none"}
                strokeWidth={2}
                className="transition-all duration-150"
              />
              <rect
                x={pt.x - 20}
                y={0}
                width={40}
                height={height}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Axis Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
        <span>Low: ₹{min.toLocaleString("en-IN")}</span>
        <span>High: ₹{max.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
