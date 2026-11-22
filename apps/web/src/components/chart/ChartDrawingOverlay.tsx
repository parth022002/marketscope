"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { Trash2, Check, X } from "lucide-react";
import { type DrawingToolType } from "./ChartDrawingToolbar";

export interface DrawingPoint {
  x: number;
  y: number;
  price?: number;
  time?: number | string;
}

export interface ChartDrawingItem {
  id: string;
  toolType: DrawingToolType;
  points: DrawingPoint[];
  color: string;
  lineWidth: number;
  text?: string;
  locked?: boolean;
}

interface ChartDrawingOverlayProps {
  activeTool: DrawingToolType;
  onResetTool: () => void;
  drawings: ChartDrawingItem[];
  onSaveDrawing: (drawing: ChartDrawingItem) => void;
  onDeleteDrawing: (id: string) => void;
  isLocked: boolean;
  width: number;
  height: number;
  coordinateToPrice?: (y: number) => number | null;
  coordinateToTime?: (x: number) => string | null;
}

const FIB_RATIOS = [
  { ratio: 0.0, label: "0.0%", color: "#94a3b8" },
  { ratio: 0.236, label: "23.6%", color: "#f87171" },
  { ratio: 0.382, label: "38.2%", color: "#fb923c" },
  { ratio: 0.5, label: "50.0%", color: "#facc15" },
  { ratio: 0.618, label: "61.8% (Golden)", color: "#4ade80" },
  { ratio: 0.786, label: "78.6%", color: "#38bdf8" },
  { ratio: 1.0, label: "100.0%", color: "#a855f7" },
];

export default function ChartDrawingOverlay({
  activeTool,
  onResetTool,
  drawings,
  onSaveDrawing,
  onDeleteDrawing,
  isLocked,
  width,
  height,
  coordinateToPrice,
  coordinateToTime,
}: ChartDrawingOverlayProps) {
  const [activePoints, setActivePoints] = useState<DrawingPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [tempTextValue, setTempTextValue] = useState("Annotation");
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getCoordinates = (e: MouseEvent<SVGSVGElement>): DrawingPoint => {
    if (!svgRef.current) return { x: e.clientX, y: e.clientY };
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(height, e.clientY - rect.top));
    const price = coordinateToPrice ? coordinateToPrice(y) || undefined : undefined;
    const time = coordinateToTime ? coordinateToTime(x) || undefined : undefined;
    return { x, y, price, time };
  };

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    if (activeTool === "cursor") return;
    if (isLocked) return;

    const pt = getCoordinates(e);

    if (activeTool === "horizontal") {
      // 1-point instant tool
      const newDrawing: ChartDrawingItem = {
        id: "draw_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        toolType: "horizontal",
        points: [pt],
        color: "#38bdf8",
        lineWidth: 1.5,
      };
      onSaveDrawing(newDrawing);
      onResetTool();
      return;
    }

    if (activeTool === "text") {
      const newDrawing: ChartDrawingItem = {
        id: "draw_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        toolType: "text",
        points: [pt],
        color: "#f8fafc",
        lineWidth: 1,
        text: "Note",
      };
      onSaveDrawing(newDrawing);
      setSelectedDrawingId(newDrawing.id);
      setEditingTextId(newDrawing.id);
      setTempTextValue("Key Level");
      onResetTool();
      return;
    }

    // 2-point tools: start dragging
    setIsDrawing(true);
    setActivePoints([pt, pt]);
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || activeTool === "cursor") return;
    const pt = getCoordinates(e);
    setActivePoints((prev) => (prev.length > 0 ? [prev[0], pt] : [pt]));
  };

  const handleMouseUp = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || activePoints.length < 2) return;
    setIsDrawing(false);

    const pt = getCoordinates(e);
    const finalizedPoints = [activePoints[0], pt];

    // Check if points are too close
    const dx = Math.abs(finalizedPoints[1].x - finalizedPoints[0].x);
    const dy = Math.abs(finalizedPoints[1].y - finalizedPoints[0].y);
    if (dx < 4 && dy < 4) {
      setActivePoints([]);
      return;
    }

    let color = "#3b82f6";
    if (activeTool === "fibonacci") color = "#eab308";
    if (activeTool === "measure_price") color = "#10b981";
    if (activeTool === "measure_time") color = "#6366f1";
    if (activeTool === "rectangle") color = "#06b6d4";

    const newDrawing: ChartDrawingItem = {
      id: "draw_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      toolType: activeTool,
      points: finalizedPoints,
      color,
      lineWidth: 1.5,
    };

    onSaveDrawing(newDrawing);
    setActivePoints([]);
    onResetTool();
  };

  // Keyboard shortcut listener: Delete key removes selected drawing, Escape resets tool
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedDrawingId && !editingTextId) {
          onDeleteDrawing(selectedDrawingId);
          setSelectedDrawingId(null);
        }
      } else if (e.key === "Escape") {
        setIsDrawing(false);
        setActivePoints([]);
        setSelectedDrawingId(null);
        setEditingTextId(null);
        onResetTool();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDrawingId, editingTextId, onDeleteDrawing, onResetTool]);

  const renderActiveDrawingPreview = () => {
    if (!isDrawing || activePoints.length < 2) return null;
    const p1 = activePoints[0];
    const p2 = activePoints[1];

    if (activeTool === "trendline" || activeTool === "ray") {
      return (
        <g pointerEvents="none">
          <line
            x1={p1.x}
            y1={p1.y}
            x2={activeTool === "ray" ? width : p2.x}
            y2={activeTool === "ray" ? p1.y + (p2.y - p1.y) * 4 : p2.y}
            stroke="#60a5fa"
            strokeWidth={1.5}
            strokeDasharray="4,4"
          />
          <circle cx={p1.x} cy={p1.y} r={3} fill="#60a5fa" />
          <circle cx={p2.x} cy={p2.y} r={3} fill="#60a5fa" />
        </g>
      );
    }

    if (activeTool === "rectangle") {
      const minX = Math.min(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const w = Math.abs(p2.x - p1.x);
      const h = Math.abs(p2.y - p1.y);
      return (
        <rect
          x={minX}
          y={minY}
          width={w}
          height={h}
          fill="#06b6d4"
          fillOpacity={0.15}
          stroke="#06b6d4"
          strokeWidth={1.5}
          strokeDasharray="4,4"
          pointerEvents="none"
        />
      );
    }

    if (activeTool === "fibonacci") {
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);
      const dy = maxY - minY;
      return (
        <g pointerEvents="none">
          {FIB_RATIOS.map((f) => {
            const y = minY + dy * f.ratio;
            return (
              <g key={f.ratio}>
                <line x1={0} y1={y} x2={width} y2={y} stroke={f.color} strokeWidth={1} strokeDasharray="3,3" />
                <text x={8} y={y - 3} fill={f.color} fontSize={10} fontFamily="monospace">
                  {f.label}
                </text>
              </g>
            );
          })}
        </g>
      );
    }

    if (activeTool === "measure_price" || activeTool === "measure_time") {
      const minX = Math.min(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const w = Math.abs(p2.x - p1.x);
      const h = Math.abs(p2.y - p1.y);
      const isUp = p2.y < p1.y;
      return (
        <g pointerEvents="none">
          <rect
            x={minX}
            y={minY}
            width={w}
            height={h}
            fill={isUp ? "#10b981" : "#f43f5e"}
            fillOpacity={0.15}
            stroke={isUp ? "#10b981" : "#f43f5e"}
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          <text
            x={minX + w / 2}
            y={minY + h / 2}
            fill="#ffffff"
            fontSize={11}
            fontFamily="monospace"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {activeTool === "measure_price" ? `Δ Price Area` : `Δ Time: ${Math.round(w / 8)} bars`}
          </text>
        </g>
      );
    }

    return null;
  };

  const renderSavedDrawing = (d: ChartDrawingItem) => {
    const isSelected = selectedDrawingId === d.id;
    const p1 = d.points[0];
    const p2 = d.points[1] || p1;

    switch (d.toolType) {
      case "horizontal": {
        return (
          <g
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDrawingId(isSelected ? null : d.id);
            }}
            className="cursor-pointer group"
          >
            <line
              x1={0}
              y1={p1.y}
              x2={width}
              y2={p1.y}
              stroke={isSelected ? "#38bdf8" : d.color}
              strokeWidth={isSelected ? 2 : d.lineWidth}
              strokeDasharray={isSelected ? undefined : "4,4"}
            />
            {isSelected && (
              <circle cx={width - 20} cy={p1.y} r={4} fill="#38bdf8" className="animate-pulse" />
            )}
            {p1.price !== undefined && (
              <g transform={`translate(${width - 70}, ${p1.y - 10})`}>
                <rect width={65} height={18} rx={3} fill="#0b1930" stroke="#38bdf8" strokeWidth={1} />
                <text x={32} y={12} fill="#38bdf8" fontSize={10} fontFamily="monospace" textAnchor="middle">
                  ₹{p1.price.toFixed(2)}
                </text>
              </g>
            )}
          </g>
        );
      }

      case "trendline":
      case "ray": {
        const x2 = d.toolType === "ray" ? width : p2.x;
        const y2 = d.toolType === "ray" ? p1.y + (p2.y - p1.y) * 4 : p2.y;
        return (
          <g
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDrawingId(isSelected ? null : d.id);
            }}
            className="cursor-pointer"
          >
            <line
              x1={p1.x}
              y1={p1.y}
              x2={x2}
              y2={y2}
              stroke={isSelected ? "#60a5fa" : d.color}
              strokeWidth={isSelected ? 2.5 : d.lineWidth}
            />
            <circle cx={p1.x} cy={p1.y} r={isSelected ? 4 : 2.5} fill="#60a5fa" />
            <circle cx={p2.x} cy={p2.y} r={isSelected ? 4 : 2.5} fill="#60a5fa" />
          </g>
        );
      }

      case "rectangle": {
        const minX = Math.min(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        return (
          <g
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDrawingId(isSelected ? null : d.id);
            }}
            className="cursor-pointer"
          >
            <rect
              x={minX}
              y={minY}
              width={w}
              height={h}
              fill={d.color}
              fillOpacity={isSelected ? 0.25 : 0.12}
              stroke={isSelected ? "#38bdf8" : d.color}
              strokeWidth={isSelected ? 2 : d.lineWidth}
            />
          </g>
        );
      }

      case "fibonacci": {
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);
        const dy = maxY - minY;
        return (
          <g
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDrawingId(isSelected ? null : d.id);
            }}
            className="cursor-pointer"
          >
            {/* Shaded Golden Pocket 38.2% to 61.8% */}
            <rect
              x={0}
              y={minY + dy * 0.382}
              width={width}
              height={dy * (0.618 - 0.382)}
              fill="#eab308"
              fillOpacity={0.08}
            />
            {FIB_RATIOS.map((f) => {
              const y = minY + dy * f.ratio;
              return (
                <g key={f.ratio}>
                  <line
                    x1={0}
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke={f.color}
                    strokeWidth={isSelected ? 1.5 : 1}
                    strokeDasharray="3,3"
                  />
                  <text x={8} y={y - 3} fill={f.color} fontSize={10} fontFamily="monospace">
                    {f.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }

      case "measure_price":
      case "measure_time": {
        const minX = Math.min(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        const isUp = p2.y < p1.y;
        return (
          <g
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDrawingId(isSelected ? null : d.id);
            }}
            className="cursor-pointer"
          >
            <rect
              x={minX}
              y={minY}
              width={w}
              height={h}
              fill={isUp ? "#10b981" : "#f43f5e"}
              fillOpacity={isSelected ? 0.3 : 0.15}
              stroke={isUp ? "#10b981" : "#f43f5e"}
              strokeWidth={1.5}
            />
            <text
              x={minX + w / 2}
              y={minY + h / 2}
              fill="#ffffff"
              fontSize={11}
              fontFamily="monospace"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {d.toolType === "measure_price" ? `Δ Height: ${Math.round(h)}px` : `Δ Bars: ~${Math.round(w / 8)}`}
            </text>
          </g>
        );
      }

      case "text": {
        return (
          <g
            key={d.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDrawingId(isSelected ? null : d.id);
            }}
            className="cursor-pointer"
          >
            <rect
              x={p1.x - 4}
              y={p1.y - 14}
              width={Math.max(60, (d.text || "Note").length * 8 + 12)}
              height={22}
              rx={4}
              fill="#0B1930"
              stroke={isSelected ? "#38bdf8" : "#162C4E"}
              strokeWidth={1}
            />
            <text x={p1.x + 2} y={p1.y + 1} fill={d.color} fontSize={11} fontFamily="sans-serif">
              {d.text || "Note"}
            </text>
          </g>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={`w-full h-full ${
          activeTool !== "cursor" ? "pointer-events-auto cursor-crosshair" : "pointer-events-auto"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          if (activeTool === "cursor") setSelectedDrawingId(null);
        }}
      >
        {/* Render Saved Drawings */}
        {drawings.map(renderSavedDrawing)}

        {/* Render In-Flight Active Drawing Preview */}
        {renderActiveDrawingPreview()}
      </svg>

      {/* Floating Action Menu for Selected Drawing */}
      {selectedDrawingId && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1930] border border-[#162C4E] shadow-2xl z-30 pointer-events-auto text-xs animate-in fade-in"
        >
          <span className="text-slate-300 font-mono">Drawing Selected</span>
          <div className="h-3 w-px bg-[#162C4E]" />
          <button
            onClick={() => {
              onDeleteDrawing(selectedDrawingId);
              setSelectedDrawingId(null);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold transition"
          >
            <Trash2 size={12} />
            <span>Delete (Del)</span>
          </button>
          <button
            onClick={() => setSelectedDrawingId(null)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
