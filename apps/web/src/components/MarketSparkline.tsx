"use client";

interface MarketSparklineProps {
  data: number[];
  isPositive?: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}

export default function MarketSparkline({
  data,
  isPositive = true,
  width = 120,
  height = 36,
  strokeWidth = 1.75,
  className = "",
}: MarketSparklineProps) {
  if (!data || data.length < 2) {
    return (
      <div
        style={{ width, height }}
        className={`flex items-center justify-center text-[10px] text-slate-500 font-mono ${className}`}
      >
        —
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const effectiveHeight = height - padding * 2;
  const effectiveWidth = width - padding * 2;

  // Build points
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * effectiveWidth;
    const y = height - padding - ((val - min) / range) * effectiveHeight;
    return { x, y };
  });

  const linePath = points
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const lastPoint = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  const strokeColor = isPositive ? "#10B981" : "#EF4444"; // Emerald vs Coral
  const gradientId = `sparkline-grad-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>

      {/* Gradient Fill Area */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* Main Sparkline Stroke */}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Final Value Dot */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r={2.5}
        fill={strokeColor}
        className="animate-pulse"
      />
    </svg>
  );
}
