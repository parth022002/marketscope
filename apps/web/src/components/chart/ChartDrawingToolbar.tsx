"use client";

import {
  MousePointer,
  TrendingUp,
  Minus,
  ArrowUpRight,
  Square,
  Percent,
  Ruler,
  Calendar,
  Type,
  Magnet,
  Lock,
  Unlock,
  Trash2,
} from "lucide-react";

export type DrawingToolType =
  | "cursor"
  | "trendline"
  | "ray"
  | "horizontal"
  | "rectangle"
  | "fibonacci"
  | "measure_price"
  | "measure_time"
  | "text";

interface ChartDrawingToolbarProps {
  activeTool: DrawingToolType;
  onSelectTool: (tool: DrawingToolType) => void;
  isMagnetEnabled: boolean;
  onToggleMagnet: () => void;
  isLocked: boolean;
  onToggleLock: () => void;
  drawingsCount: number;
  onClearDrawings: () => void;
}

const TOOLS: { id: DrawingToolType; label: string; icon: any; shortcut?: string }[] = [
  { id: "cursor", label: "Crosshair / Select", icon: MousePointer, shortcut: "V" },
  { id: "trendline", label: "Trend Line (2 points)", icon: TrendingUp, shortcut: "Alt+T" },
  { id: "ray", label: "Horizontal Ray", icon: ArrowUpRight, shortcut: "Alt+J" },
  { id: "horizontal", label: "Horizontal Price Line", icon: Minus, shortcut: "Alt+H" },
  { id: "rectangle", label: "Rectangle Box", icon: Square, shortcut: "Alt+R" },
  { id: "fibonacci", label: "Fibonacci Retracement", icon: Percent, shortcut: "Alt+F" },
  { id: "measure_price", label: "Price Range Ruler", icon: Ruler, shortcut: "Shift+P" },
  { id: "measure_time", label: "Date / Bars Range", icon: Calendar, shortcut: "Shift+T" },
  { id: "text", label: "Text Annotation", icon: Type, shortcut: "Alt+A" },
];

export default function ChartDrawingToolbar({
  activeTool,
  onSelectTool,
  isMagnetEnabled,
  onToggleMagnet,
  isLocked,
  onToggleLock,
  drawingsCount,
  onClearDrawings,
}: ChartDrawingToolbarProps) {
  return (
    <div className="flex flex-col items-center py-2 px-1 bg-[#071426] border-r border-[#162C4E] text-slate-400 select-none w-11 shrink-0 gap-1 z-20">
      {/* Primary Drawing Tools */}
      <div className="flex flex-col items-center gap-1 w-full">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""}`}
              className={`relative p-2 rounded-lg transition group flex items-center justify-center ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/50"
                  : "hover:bg-[#0B1930] hover:text-white text-slate-400"
              }`}
            >
              <Icon size={16} />
              {/* Tooltip */}
              <span className="absolute left-full ml-2 px-2 py-1 rounded bg-[#0B1930] border border-[#162C4E] text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-xl z-50">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-6 h-px bg-[#162C4E] my-1" />

      {/* Auxiliary Utility Controls */}
      <div className="flex flex-col items-center gap-1 w-full">
        {/* Magnet Mode */}
        <button
          onClick={onToggleMagnet}
          title={isMagnetEnabled ? "Magnet Snapping: Active" : "Magnet Snapping: Off"}
          className={`relative p-2 rounded-lg transition group flex items-center justify-center ${
            isMagnetEnabled
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "hover:bg-[#0B1930] hover:text-white text-slate-400"
          }`}
        >
          <Magnet size={15} />
          <span className="absolute left-full ml-2 px-2 py-1 rounded bg-[#0B1930] border border-[#162C4E] text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-xl z-50">
            {isMagnetEnabled ? "Magnet: ON" : "Magnet: OFF"}
          </span>
        </button>

        {/* Lock Drawings */}
        <button
          onClick={onToggleLock}
          title={isLocked ? "Drawings Locked" : "Lock All Drawings"}
          className={`relative p-2 rounded-lg transition group flex items-center justify-center ${
            isLocked
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              : "hover:bg-[#0B1930] hover:text-white text-slate-400"
          }`}
        >
          {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
          <span className="absolute left-full ml-2 px-2 py-1 rounded bg-[#0B1930] border border-[#162C4E] text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-xl z-50">
            {isLocked ? "Drawings: Locked" : "Lock Drawings"}
          </span>
        </button>

        {/* Clear All Drawings */}
        <button
          onClick={onClearDrawings}
          disabled={drawingsCount === 0}
          title={drawingsCount > 0 ? `Remove All (${drawingsCount}) Drawings` : "No Drawings to Remove"}
          className={`relative p-2 rounded-lg transition group flex items-center justify-center ${
            drawingsCount > 0
              ? "hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 cursor-pointer"
              : "text-slate-600 cursor-not-allowed"
          }`}
        >
          <Trash2 size={15} />
          {drawingsCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
              {drawingsCount}
            </span>
          )}
          <span className="absolute left-full ml-2 px-2 py-1 rounded bg-[#0B1930] border border-[#162C4E] text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-xl z-50">
            Clear All Drawings
          </span>
        </button>
      </div>
    </div>
  );
}
