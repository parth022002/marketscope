"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  BaselineSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import {
  getInstrumentChart,
  type ChartBar,
  type ChartDataResponse,
  getUserDrawings,
  saveUserDrawing,
  deleteUserDrawing,
  getUserAlerts,
  createUserAlert,
  deleteUserAlert,
  type UserChartDrawing,
  type PriceAlert,
} from "@/lib/api";
import {
  calculateSMA,
  calculateEMA,
  calculateVWAP,
  calculateBollingerBands,
  calculateSupertrend,
  transformHeikinAshi,
  type OHLCVBar,
} from "@/lib/indicators";
import ChartToolbar, { type ChartTypeOption } from "./ChartToolbar";
import ChartDrawingToolbar, { type DrawingToolType } from "./ChartDrawingToolbar";
import ChartDrawingOverlay, { type ChartDrawingItem } from "./ChartDrawingOverlay";
import ChartIndicatorsModal, {
  type ActiveIndicatorState,
  DEFAULT_INDICATORS_STATE,
} from "./ChartIndicatorsModal";
import ChartRightSidebar, {
  type InstrumentStats,
  type ChartAlertItem,
} from "./ChartRightSidebar";
import { AlertCircle, Calendar } from "lucide-react";

interface StockChartProps {
  symbol: string;
  exchange?: string;
  initialTimeframe?: string;
  onSymbolChange?: (newSymbol: string) => void;
  className?: string;
}

const BOTTOM_RANGES = [
  { label: "1D", tf: "5m" },
  { label: "5D", tf: "15m" },
  { label: "1M", tf: "1D" },
  { label: "3M", tf: "1D" },
  { label: "6M", tf: "1D" },
  { label: "YTD", tf: "1D" },
  { label: "1Y", tf: "1D" },
  { label: "5Y", tf: "1W" },
  { label: "ALL", tf: "1M" },
];

export default function StockChart({
  symbol,
  exchange = "NSE",
  initialTimeframe = "1D",
  onSymbolChange,
  className = "",
}: StockChartProps) {
  // Container & Chart Refs
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const indicatorSeriesRefs = useRef<ISeriesApi<any>[]>([]);

  // Chart Configuration State
  const [timeframe, setTimeframe] = useState<string>(initialTimeframe);
  const [chartType, setChartType] = useState<ChartTypeOption>("CANDLESTICK");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Indicators State & Modal
  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const [indicatorsState, setIndicatorsState] = useState<ActiveIndicatorState>(DEFAULT_INDICATORS_STATE);

  // Drawing Tools State
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingToolType>("cursor");
  const [isMagnetEnabled, setIsMagnetEnabled] = useState(false);
  const [isDrawingsLocked, setIsDrawingsLocked] = useState(false);
  const [drawings, setDrawings] = useState<ChartDrawingItem[]>([]);

  // Chart Data State
  const [bars, setBars] = useState<ChartBar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 800, height: 500 });

  // Hover / Legend State
  const [hoveredBar, setHoveredBar] = useState<ChartBar | null>(null);

  // Alerts State
  const [alerts, setAlerts] = useState<ChartAlertItem[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-GB", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Instrument Statistics for Right Sidebar
  const [instrumentStats, setInstrumentStats] = useState<InstrumentStats>({
    symbol,
    name: `${symbol} Equity`,
    exchange,
    assetClass: "Stock",
    price: 0,
    change: 0,
    changePercent: 0,
    open: 0,
    high: 0,
    low: 0,
    prevClose: 0,
    week52High: 0,
    week52Low: 0,
    volume: 0,
    avgVolume30D: 0,
    dataStatus: "15 min delayed",
    marketStatus: "Market closed",
    lastUpdated: "Nov 21, 15:30 IST",
  });

  // Load User Drawings and Alerts from backend/localStorage
  useEffect(() => {
    getUserDrawings(symbol)
      .then((saved) => {
        if (saved && saved.length > 0) {
          const mapped: ChartDrawingItem[] = saved.map((d) => ({
            id: d.drawing_id,
            toolType: (d.tool_type as DrawingToolType) || "trendline",
            points: (d.points || []).map((p) => ({
              x: 0,
              y: 0,
              price: p.price,
              time: p.time,
            })),
            color: (d.style?.color as string) || "#38bdf8",
            lineWidth: (d.style?.lineWidth as number) || 2,
            text: (d.style?.text as string) || undefined,
            locked: false,
          }));
          setDrawings(mapped);
        }
      })
      .catch(() => {
        const local = localStorage.getItem(`drawings_${symbol}`);
        if (local) {
          try {
            setDrawings(JSON.parse(local));
          } catch {}
        }
      });

    getUserAlerts(symbol)
      .then((data) => {
        if (data && data.length > 0) {
          setAlerts(
            data.map((a) => ({
              id: a.alert_id,
              symbol: a.symbol,
              targetPrice: a.target_value,
              condition: (a.condition_type as any) || "CROSSES_ABOVE",
              note: a.note || undefined,
              createdAt: a.created_at,
            }))
          );
        }
      })
      .catch(() => {});
  }, [symbol]);

  // Fetch OHLCV Chart Data using getInstrumentChart
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp: ChartDataResponse = await getInstrumentChart(symbol, timeframe, 120);
      if (resp && resp.bars && resp.bars.length > 0) {
        setBars(resp.bars);
        const latest = resp.bars[resp.bars.length - 1];
        const prev = resp.bars.length > 1 ? resp.bars[resp.bars.length - 2] : latest;
        const chg = latest.close - prev.close;
        const chgPct = prev.close > 0 ? (chg / prev.close) * 100 : 0;

        let w52H = latest.high;
        let w52L = latest.low;
        let totalVol = 0;
        resp.bars.forEach((b) => {
          if (b.high > w52H) w52H = b.high;
          if (b.low < w52L) w52L = b.low;
          totalVol += b.volume;
        });
        const avgVol = resp.bars.length > 0 ? totalVol / resp.bars.length : latest.volume;

        setInstrumentStats({
          symbol,
          name: `${symbol} Equity`,
          exchange: resp.exchange || exchange,
          assetClass: "Stock",
          price: latest.close,
          change: chg,
          changePercent: chgPct,
          open: latest.open,
          high: latest.high,
          low: latest.low,
          prevClose: prev.close,
          week52High: w52H,
          week52Low: w52L,
          volume: latest.volume,
          avgVolume30D: avgVol,
          dataStatus: resp.data_status || "15 min delayed",
          marketStatus: "Market closed",
          lastUpdated: resp.last_timestamp || "Nov 21, 15:30 IST",
        });
        setHoveredBar(latest);
      } else {
        setError("No chart bars available for this instrument/timeframe.");
      }
    } catch (err: any) {
      console.error("Failed to load chart data:", err);
      setError("Unable to connect to market data engine.");
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe, exchange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Chart Creation & Rendering with Lightweight Charts v5
  useEffect(() => {
    if (!chartContainerRef.current || bars.length === 0) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const container = chartContainerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    setChartDimensions({ width, height });

    const chart = createChart(container, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#071426" },
        textColor: "#94a3b8",
        fontSize: 11,
        fontFamily: "var(--font-mono, monospace)",
      },
      grid: {
        vertLines: { color: "#162C4E33", style: 1 },
        horzLines: { color: "#162C4E33", style: 1 },
      },
      crosshair: {
        mode: isMagnetEnabled ? CrosshairMode.Magnet : CrosshairMode.Normal,
        vertLine: {
          color: "#38bdf8",
          width: 1,
          style: 3,
          labelBackgroundColor: "#0B1930",
        },
        horzLine: {
          color: "#38bdf8",
          width: 1,
          style: 3,
          labelBackgroundColor: "#0B1930",
        },
      },
      rightPriceScale: {
        borderColor: "#162C4E",
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: "#162C4E",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartInstanceRef.current = chart;

    const sortedBars = [...bars].sort((a, b) =>
      typeof a.time === "number" && typeof b.time === "number"
        ? (a.time as number) - (b.time as number)
        : String(a.time).localeCompare(String(b.time))
    );

    // Primary Price Series Selection
    let mainSeries: ISeriesApi<any>;

    if (chartType === "BAR") {
      mainSeries = chart.addSeries(BarSeries, {
        upColor: "#10b981",
        downColor: "#f43f5e",
        priceLineVisible: true,
      });
      mainSeries.setData(sortedBars as any);
    } else if (chartType === "LINE") {
      mainSeries = chart.addSeries(LineSeries, {
        color: "#38bdf8",
        lineWidth: 2,
        priceLineVisible: true,
      });
      mainSeries.setData(sortedBars.map((b) => ({ time: b.time, value: b.close })) as any);
    } else if (chartType === "AREA") {
      mainSeries = chart.addSeries(AreaSeries, {
        topColor: "rgba(56, 189, 248, 0.4)",
        bottomColor: "rgba(56, 189, 248, 0.0)",
        lineColor: "#38bdf8",
        lineWidth: 2,
        priceLineVisible: true,
      });
      mainSeries.setData(sortedBars.map((b) => ({ time: b.time, value: b.close })) as any);
    } else if (chartType === "BASELINE") {
      const avgPrice = sortedBars[0]?.open || 1000;
      mainSeries = chart.addSeries(BaselineSeries, {
        baseValue: { type: "price", price: avgPrice },
        topLineColor: "#10b981",
        bottomLineColor: "#f43f5e",
        priceLineVisible: true,
      });
      mainSeries.setData(sortedBars.map((b) => ({ time: b.time, value: b.close })) as any);
    } else if (chartType === "HEIKIN_ASHI") {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#10b981",
        downColor: "#f43f5e",
        borderVisible: false,
        wickUpColor: "#10b981",
        wickDownColor: "#f43f5e",
        priceLineVisible: true,
      });
      const haBars = transformHeikinAshi(sortedBars as OHLCVBar[]);
      mainSeries.setData(haBars as any);
    } else {
      mainSeries = chart.addSeries(CandlestickSeries, {
        upColor: chartType === "HOLLOW_CANDLES" ? "transparent" : "#10b981",
        downColor: "#f43f5e",
        borderVisible: true,
        borderColor: "#10b981",
        borderUpColor: "#10b981",
        borderDownColor: "#f43f5e",
        wickUpColor: "#10b981",
        wickDownColor: "#f43f5e",
        priceLineVisible: true,
      });
      mainSeries.setData(sortedBars as any);
    }

    mainSeriesRef.current = mainSeries;

    // Volume Series (Bottom Histogram)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#38bdf8",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeries.setData(
      sortedBars.map((b) => ({
        time: b.time,
        value: b.volume,
        color: b.close >= b.open ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)",
      })) as any
    );
    volumeSeriesRef.current = volumeSeries;

    // Technical Indicators Overlays
    const activeSeriesList: ISeriesApi<any>[] = [];

    // 1. SMA
    if (indicatorsState.sma.enabled) {
      const smaData = calculateSMA(sortedBars as OHLCVBar[], indicatorsState.sma.period);
      if (smaData.length > 0) {
        const smaSeries = chart.addSeries(LineSeries, {
          color: indicatorsState.sma.color,
          lineWidth: 2,
          priceLineVisible: false,
          title: `SMA ${indicatorsState.sma.period}`,
        });
        smaSeries.setData(smaData as any);
        activeSeriesList.push(smaSeries);
      }
    }

    // 2. EMA
    if (indicatorsState.ema.enabled) {
      const emaData = calculateEMA(sortedBars as OHLCVBar[], indicatorsState.ema.period);
      if (emaData.length > 0) {
        const emaSeries = chart.addSeries(LineSeries, {
          color: indicatorsState.ema.color,
          lineWidth: 2,
          priceLineVisible: false,
          title: `EMA ${indicatorsState.ema.period}`,
        });
        emaSeries.setData(emaData as any);
        activeSeriesList.push(emaSeries);
      }
    }

    // 3. VWAP
    if (indicatorsState.vwap.enabled) {
      const vwapData = calculateVWAP(sortedBars as OHLCVBar[]);
      if (vwapData.length > 0) {
        const vwapSeries = chart.addSeries(LineSeries, {
          color: indicatorsState.vwap.color,
          lineWidth: 2,
          priceLineVisible: false,
          title: "VWAP",
        });
        vwapSeries.setData(vwapData as any);
        activeSeriesList.push(vwapSeries);
      }
    }

    // 4. Bollinger Bands
    if (indicatorsState.bollinger.enabled) {
      const bbData = calculateBollingerBands(
        sortedBars as OHLCVBar[],
        indicatorsState.bollinger.period,
        indicatorsState.bollinger.stdDev
      );
      if (bbData.length > 0) {
        const upperSeries = chart.addSeries(LineSeries, {
          color: indicatorsState.bollinger.color,
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          title: "BB Upper",
        });
        const lowerSeries = chart.addSeries(LineSeries, {
          color: indicatorsState.bollinger.color,
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          title: "BB Lower",
        });
        const midSeries = chart.addSeries(LineSeries, {
          color: indicatorsState.bollinger.color,
          lineWidth: 1,
          priceLineVisible: false,
          title: "BB Mid",
        });

        upperSeries.setData(bbData.map((d) => ({ time: d.time, value: d.upper })) as any);
        lowerSeries.setData(bbData.map((d) => ({ time: d.time, value: d.lower })) as any);
        midSeries.setData(bbData.map((d) => ({ time: d.time, value: d.middle })) as any);

        activeSeriesList.push(upperSeries, lowerSeries, midSeries);
      }
    }

    // 5. Supertrend
    if (indicatorsState.supertrend.enabled) {
      const stData = calculateSupertrend(
        sortedBars as OHLCVBar[],
        indicatorsState.supertrend.period,
        indicatorsState.supertrend.multiplier
      );
      if (stData.length > 0) {
        const stSeries = chart.addSeries(LineSeries, {
          color: "#22c55e",
          lineWidth: 2,
          priceLineVisible: false,
          title: "Supertrend",
        });
        stSeries.setData(stData.map((d) => ({ time: d.time, value: d.supertrend })) as any);
        activeSeriesList.push(stSeries);
      }
    }

    indicatorSeriesRefs.current = activeSeriesList;

    // Crosshair Move Subscription for Legend OHLC Readout
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setHoveredBar(sortedBars[sortedBars.length - 1] || null);
        return;
      }
      const data = param.seriesData.get(mainSeries);
      if (data) {
        if ("open" in data) {
          setHoveredBar({
            time: param.time as any,
            open: (data as any).open,
            high: (data as any).high,
            low: (data as any).low,
            close: (data as any).close,
            volume: sortedBars.find((b) => b.time === param.time)?.volume || 0,
          });
        } else if ("value" in data) {
          const val = (data as any).value;
          setHoveredBar({
            time: param.time as any,
            open: val,
            high: val,
            low: val,
            close: val,
            volume: 0,
          });
        }
      }
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (!chartContainerRef.current || !chartInstanceRef.current) return;
      const newW = chartContainerRef.current.clientWidth;
      const newH = chartContainerRef.current.clientHeight;
      chartInstanceRef.current.applyOptions({ width: newW, height: newH });
      setChartDimensions({ width: newW, height: newH });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [bars, chartType, indicatorsState, isMagnetEnabled]);

  const coordinateToPrice = useCallback((y: number): number | null => {
    if (!mainSeriesRef.current) return null;
    return mainSeriesRef.current.coordinateToPrice(y);
  }, []);

  const coordinateToTime = useCallback((x: number): string | null => {
    if (!chartInstanceRef.current) return null;
    const time = chartInstanceRef.current.timeScale().coordinateToTime(x);
    return time ? String(time) : null;
  }, []);

  // Save / Delete Drawing Handlers
  const handleSaveDrawing = async (item: ChartDrawingItem) => {
    const updated = [...drawings, item];
    setDrawings(updated);
    try {
      localStorage.setItem(`drawings_${symbol}`, JSON.stringify(updated));
      await saveUserDrawing({
        instrument_id: symbol,
        timeframe,
        tool_type: item.toolType,
        points: item.points.map((p) => ({
          time: p.time || Date.now(),
          price: p.price || 0,
        })),
        style: {
          color: item.color,
          lineWidth: item.lineWidth,
          text: item.text,
        },
      });
    } catch {}
  };

  const handleDeleteDrawing = async (id: string) => {
    const updated = drawings.filter((d) => d.id !== id);
    setDrawings(updated);
    try {
      localStorage.setItem(`drawings_${symbol}`, JSON.stringify(updated));
      await deleteUserDrawing(id);
    } catch {}
  };

  const handleClearAllDrawings = async () => {
    setDrawings([]);
    try {
      localStorage.removeItem(`drawings_${symbol}`);
      for (const d of drawings) {
        await deleteUserDrawing(d.id).catch(() => {});
      }
    } catch {}
  };

  // Alerts Handlers
  const handleCreateAlert = async (alertData: Omit<ChartAlertItem, "id" | "createdAt">) => {
    try {
      const created = await createUserAlert({
        instrument_id: symbol,
        symbol: alertData.symbol,
        condition_type: alertData.condition,
        target_value: alertData.targetPrice,
        note: alertData.note,
      });
      setAlerts((prev) => [
        ...prev,
        {
          id: created.alert_id,
          symbol: created.symbol,
          targetPrice: created.target_value,
          condition: (created.condition_type as any) || "CROSSES_ABOVE",
          note: created.note || undefined,
          createdAt: created.created_at,
        },
      ]);
    } catch {
      setAlerts((prev) => [
        ...prev,
        {
          id: "alert_" + Date.now(),
          symbol: alertData.symbol,
          targetPrice: alertData.targetPrice,
          condition: alertData.condition,
          note: alertData.note,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteUserAlert(id);
    } catch {}
  };

  const handleExportScreenshot = () => {
    if (!chartContainerRef.current) return;
    const canvas = chartContainerRef.current.querySelector("canvas");
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `MarketScope_${symbol}_${timeframe}_${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    }
  };

  const handleResetChart = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.timeScale().fitContent();
    }
  };

  const activeIndicatorsCount = Object.values(indicatorsState).filter((v) => v.enabled).length;

  const activeBar = hoveredBar || (bars.length > 0 ? bars[bars.length - 1] : null);
  const isUp = activeBar ? activeBar.close >= activeBar.open : true;
  const barChange = activeBar ? activeBar.close - activeBar.open : 0;
  const barChangePct = activeBar && activeBar.open > 0 ? (barChange / activeBar.open) * 100 : 0;

  return (
    <div
      className={`relative flex flex-col bg-[#071426] border border-[#162C4E] rounded-2xl overflow-hidden shadow-2xl ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "w-full"
      } ${className}`}
    >
      {/* 1. TOP CHART TOOLBAR */}
      <ChartToolbar
        symbol={symbol}
        exchange={exchange}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        chartType={chartType}
        onChartTypeChange={setChartType}
        onOpenIndicators={() => setIsIndicatorsModalOpen(true)}
        activeIndicatorsCount={activeIndicatorsCount}
        onOpenAlerts={() => setIsSidebarOpen(true)}
        activeAlertsCount={alerts.length}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        isFullscreen={isFullscreen}
        onExportScreenshot={handleExportScreenshot}
        onResetChart={handleResetChart}
      />

      {/* 2. MAIN 3-PANEL WORKSPACE (Left Drawing Toolbar | Center Canvas | Right Sidebar) */}
      <div className="relative flex flex-1 w-full min-h-[480px] lg:min-h-[560px] overflow-hidden">
        {/* Left Drawing Toolbar */}
        <ChartDrawingToolbar
          activeTool={activeDrawingTool}
          onSelectTool={setActiveDrawingTool}
          isMagnetEnabled={isMagnetEnabled}
          onToggleMagnet={() => setIsMagnetEnabled(!isMagnetEnabled)}
          isLocked={isDrawingsLocked}
          onToggleLock={() => setIsDrawingsLocked(!isDrawingsLocked)}
          drawingsCount={drawings.length}
          onClearDrawings={handleClearAllDrawings}
        />

        {/* Center Chart Workspace */}
        <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-[#071426]">
          {/* Top-Left OHLCV Readout, Status Header & TV-Style Execution Badges */}
          <div className="absolute top-2.5 left-3 z-20 flex flex-col gap-1.5 select-none text-[11px] font-mono pointer-events-none">
            {/* Row 1: Symbol, Market Status, 15m Delayed Pill, OHLCV Readout */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0B1930]/90 border border-[#162C4E] text-white shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="font-bold text-cyan-400">{symbol}</span>
                <span className="text-slate-400">· {timeframe} · {exchange}</span>
                <span className="text-slate-500 font-normal">· Closed</span>
              </div>

              {/* Delayed Data Pill matching TradingView */}
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-medium">
                <span className="px-1 rounded bg-amber-500 text-slate-950 font-black text-[9px]">D</span>
                <span>15 min delayed</span>
              </div>

              {activeBar && (
                <div className="flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#0B1930]/90 border border-[#162C4E] text-slate-300 shadow-sm">
                  <span>
                    O <strong className="text-white">₹{activeBar.open.toFixed(2)}</strong>
                  </span>
                  <span>
                    H <strong className="text-white">₹{activeBar.high.toFixed(2)}</strong>
                  </span>
                  <span>
                    L <strong className="text-white">₹{activeBar.low.toFixed(2)}</strong>
                  </span>
                  <span>
                    C <strong className="text-white">₹{activeBar.close.toFixed(2)}</strong>
                  </span>
                  <span className={isUp ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {isUp ? "+" : ""}
                    {barChange.toFixed(2)} ({isUp ? "+" : ""}
                    {barChangePct.toFixed(2)}%)
                  </span>
                  {activeBar.volume > 0 && (
                    <span className="text-slate-400 hidden sm:inline">
                      Vol <strong className="text-slate-200">{(activeBar.volume / 1e6).toFixed(2)}M</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Row 2: TradingView Buy / Sell Execution Quote Box */}
            {activeBar && (
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <div
                  title="Simulated Paper Sell Quote"
                  className="flex flex-col items-center justify-center px-2.5 py-0.5 rounded bg-rose-950/70 hover:bg-rose-900/90 border border-rose-500/40 text-rose-200 shadow-sm transition cursor-default"
                >
                  <span className="text-[11px] font-bold font-mono">₹{activeBar.close.toFixed(2)}</span>
                  <span className="text-[8px] font-bold text-rose-400 tracking-wider">SELL</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono px-0.5">0.00</span>
                <div
                  title="Simulated Paper Buy Quote"
                  className="flex flex-col items-center justify-center px-2.5 py-0.5 rounded bg-blue-950/70 hover:bg-blue-900/90 border border-blue-500/40 text-blue-200 shadow-sm transition cursor-default"
                >
                  <span className="text-[11px] font-bold font-mono">₹{activeBar.close.toFixed(2)}</span>
                  <span className="text-[8px] font-bold text-cyan-400 tracking-wider">BUY</span>
                </div>
              </div>
            )}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#071426]/70 backdrop-blur-xs">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <span className="text-xs text-slate-300 font-mono">Calibrating price data...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#071426]/80 p-4">
              <div className="max-w-md p-4 rounded-xl bg-[#0B1930] border border-rose-500/40 text-center space-y-2">
                <AlertCircle size={24} className="mx-auto text-rose-400" />
                <p className="text-xs text-slate-300">{error}</p>
                <button
                  onClick={fetchData}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {/* Canvas Chart Container */}
          <div ref={chartContainerRef} className="relative flex-1 w-full h-full" />

          {/* SVG Interactive Drawing Overlay */}
          <ChartDrawingOverlay
            activeTool={activeDrawingTool}
            onResetTool={() => setActiveDrawingTool("cursor")}
            drawings={drawings}
            onSaveDrawing={handleSaveDrawing}
            onDeleteDrawing={handleDeleteDrawing}
            isLocked={isDrawingsLocked}
            width={chartDimensions.width}
            height={chartDimensions.height}
            coordinateToPrice={coordinateToPrice}
            coordinateToTime={coordinateToTime}
          />

          {/* Bottom Timeframe Selector & Timezone Strip */}
          <div className="flex items-center justify-between px-3 py-1 bg-[#071426] border-t border-[#162C4E] text-[11px] font-mono select-none">
            <div className="flex items-center gap-1">
              {BOTTOM_RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setTimeframe(r.tf)}
                  className={`px-2 py-0.5 rounded transition ${
                    timeframe === r.tf
                      ? "bg-blue-600/30 text-cyan-400 font-bold border border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-[#0B1930]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
              <div className="h-3 w-px bg-[#162C4E] mx-1" />
              <button
                type="button"
                title="Go to date..."
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#0B1930] transition"
              >
                <Calendar size={13} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[10px]">
              <span>{currentTime ? `${currentTime} UTC+5:30` : "UTC+5:30 (IST)"}</span>
              <span>·</span>
              <span className="text-cyan-400 font-medium">MarketScope Terminal</span>
            </div>
          </div>
        </div>

        {/* Right Collapsible Sidebar */}
        <ChartRightSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeSymbol={symbol}
          onSelectSymbol={(sym) => {
            if (onSymbolChange) {
              onSymbolChange(sym);
            }
          }}
          stats={instrumentStats}
          alerts={alerts}
          onCreateAlert={handleCreateAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      </div>

      {/* 3. TECHNICAL INDICATORS MODAL */}
      <ChartIndicatorsModal
        isOpen={isIndicatorsModalOpen}
        onClose={() => setIsIndicatorsModalOpen(false)}
        state={indicatorsState}
        onChange={setIndicatorsState}
      />
    </div>
  );
}
