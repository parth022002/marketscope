"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ChartPoint {
  time: string;
  price: number;
}

interface BenchmarkDataset {
  exchange: string;
  currency: string;
  locale: string;
  timeframes: Record<string, { points: ChartPoint[]; changePct: number }>;
}

const INDEX_DATA_REGISTRY: Record<string, BenchmarkDataset> = {
  "NIFTY 50": {
    exchange: "NSE",
    currency: "INR",
    locale: "en-IN",
    timeframes: {
      "1D": {
        changePct: 0.52,
        points: [
          { time: "09:15", price: 24055.40 },
          { time: "10:00", price: 24090.00 },
          { time: "11:00", price: 24120.50 },
          { time: "12:00", price: 24105.00 },
          { time: "13:00", price: 24150.20 },
          { time: "14:00", price: 24165.00 },
          { time: "15:00", price: 24175.40 },
          { time: "15:30", price: 24180.80 },
        ],
      },
      "1W": {
        changePct: 1.15,
        points: [
          { time: "Mon", price: 23905.00 },
          { time: "Tue", price: 23980.20 },
          { time: "Wed", price: 24040.00 },
          { time: "Thu", price: 24110.50 },
          { time: "Fri", price: 24180.80 },
        ],
      },
      "1M": {
        changePct: -0.85,
        points: [
          { time: "W1", price: 24380.00 },
          { time: "W2", price: 24150.00 },
          { time: "W3", price: 24020.00 },
          { time: "W4", price: 24180.80 },
        ],
      },
      "1Y": {
        changePct: 18.25,
        points: [
          { time: "Q1", price: 20450.00 },
          { time: "Q2", price: 21800.00 },
          { time: "Q3", price: 23200.00 },
          { time: "Q4", price: 24180.80 },
        ],
      },
    },
  },
  "SENSEX": {
    exchange: "BSE",
    currency: "INR",
    locale: "en-IN",
    timeframes: {
      "1D": {
        changePct: 0.48,
        points: [
          { time: "09:15", price: 79422.20 },
          { time: "10:00", price: 79510.00 },
          { time: "11:00", price: 79620.00 },
          { time: "12:00", price: 79590.00 },
          { time: "13:00", price: 79710.00 },
          { time: "14:00", price: 79760.00 },
          { time: "15:00", price: 79790.00 },
          { time: "15:30", price: 79802.40 },
        ],
      },
      "1W": {
        changePct: 0.98,
        points: [
          { time: "Mon", price: 79030.00 },
          { time: "Tue", price: 79240.00 },
          { time: "Wed", price: 79450.00 },
          { time: "Thu", price: 79680.00 },
          { time: "Fri", price: 79802.40 },
        ],
      },
      "1M": {
        changePct: -1.02,
        points: [
          { time: "W1", price: 80620.00 },
          { time: "W2", price: 79850.00 },
          { time: "W3", price: 79300.00 },
          { time: "W4", price: 79802.40 },
        ],
      },
      "1Y": {
        changePct: 16.40,
        points: [
          { time: "Q1", price: 68500.00 },
          { time: "Q2", price: 72400.00 },
          { time: "Q3", price: 76800.00 },
          { time: "Q4", price: 79802.40 },
        ],
      },
    },
  },
  "NIFTY BANK": {
    exchange: "NSE",
    currency: "INR",
    locale: "en-IN",
    timeframes: {
      "1D": {
        changePct: 0.41,
        points: [
          { time: "09:15", price: 51610.20 },
          { time: "10:00", price: 51680.00 },
          { time: "11:00", price: 51730.00 },
          { time: "12:00", price: 51710.00 },
          { time: "13:00", price: 51770.00 },
          { time: "14:00", price: 51800.00 },
          { time: "15:00", price: 51815.00 },
          { time: "15:30", price: 51820.50 },
        ],
      },
      "1W": {
        changePct: 0.85,
        points: [
          { time: "Mon", price: 51380.00 },
          { time: "Tue", price: 51490.00 },
          { time: "Wed", price: 51620.00 },
          { time: "Thu", price: 51740.00 },
          { time: "Fri", price: 51820.50 },
        ],
      },
      "1M": {
        changePct: 1.20,
        points: [
          { time: "W1", price: 51200.00 },
          { time: "W2", price: 51050.00 },
          { time: "W3", price: 51500.00 },
          { time: "W4", price: 51820.50 },
        ],
      },
      "1Y": {
        changePct: 14.80,
        points: [
          { time: "Q1", price: 45100.00 },
          { time: "Q2", price: 47800.00 },
          { time: "Q3", price: 49900.00 },
          { time: "Q4", price: 51820.50 },
        ],
      },
    },
  },
  "NASDAQ 100": {
    exchange: "NASDAQ",
    currency: "USD",
    locale: "en-US",
    timeframes: {
      "1D": {
        changePct: -0.41,
        points: [
          { time: "09:30", price: 20995.65 },
          { time: "11:00", price: 20960.00 },
          { time: "12:30", price: 20940.00 },
          { time: "14:00", price: 20925.00 },
          { time: "16:00", price: 20910.45 },
        ],
      },
      "1W": {
        changePct: -1.25,
        points: [
          { time: "Mon", price: 21175.00 },
          { time: "Tue", price: 21080.00 },
          { time: "Wed", price: 21010.00 },
          { time: "Thu", price: 20940.00 },
          { time: "Fri", price: 20910.45 },
        ],
      },
      "1M": {
        changePct: 2.80,
        points: [
          { time: "W1", price: 20340.00 },
          { time: "W2", price: 20580.00 },
          { time: "W3", price: 20820.00 },
          { time: "W4", price: 20910.45 },
        ],
      },
      "1Y": {
        changePct: 28.50,
        points: [
          { time: "Q1", price: 16250.00 },
          { time: "Q2", price: 18100.00 },
          { time: "Q3", price: 19600.00 },
          { time: "Q4", price: 20910.45 },
        ],
      },
    },
  },
  "S&P 500": {
    exchange: "NYSE",
    currency: "USD",
    locale: "en-US",
    timeframes: {
      "1D": {
        changePct: 0.21,
        points: [
          { time: "09:30", price: 5956.84 },
          { time: "11:00", price: 5960.20 },
          { time: "12:30", price: 5964.10 },
          { time: "14:00", price: 5967.50 },
          { time: "16:00", price: 5969.34 },
        ],
      },
      "1W": {
        changePct: 0.65,
        points: [
          { time: "Mon", price: 5930.50 },
          { time: "Tue", price: 5942.00 },
          { time: "Wed", price: 5955.00 },
          { time: "Thu", price: 5962.00 },
          { time: "Fri", price: 5969.34 },
        ],
      },
      "1M": {
        changePct: 1.85,
        points: [
          { time: "W1", price: 5860.00 },
          { time: "W2", price: 5895.00 },
          { time: "W3", price: 5930.00 },
          { time: "W4", price: 5969.34 },
        ],
      },
      "1Y": {
        changePct: 24.10,
        points: [
          { time: "Q1", price: 4810.00 },
          { time: "Q2", price: 5200.00 },
          { time: "Q3", price: 5600.00 },
          { time: "Q4", price: 5969.34 },
        ],
      },
    },
  },
};

interface IndexPerformanceChartProps {
  selectedIndex?: string;
  onSelectIndex?: (symbol: string) => void;
}

export default function IndexPerformanceChart({
  selectedIndex = "NIFTY 50",
  onSelectIndex,
}: IndexPerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1D");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const dataset = INDEX_DATA_REGISTRY[selectedIndex] || INDEX_DATA_REGISTRY["NIFTY 50"];
  const activeSeries = dataset.timeframes[timeframe] || dataset.timeframes["1D"];
  const isPositive = activeSeries.changePct >= 0;
  const currentPrice = hoverIndex !== null
    ? activeSeries.points[hoverIndex].price
    : activeSeries.points[activeSeries.points.length - 1].price;
  const currentTime = hoverIndex !== null
    ? activeSeries.points[hoverIndex].time
    : "Market Close";

  const prices = activeSeries.points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

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
  const currencySymbol = dataset.currency === "INR" ? "₹" : "$";

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
              {dataset.exchange}
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">
              {currencySymbol}{currentPrice.toLocaleString(dataset.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        <span>Low: {currencySymbol}{min.toLocaleString(dataset.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span>High: {currencySymbol}{max.toLocaleString(dataset.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}
