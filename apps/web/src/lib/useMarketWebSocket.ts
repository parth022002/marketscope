"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { TickerItem } from "@/lib/api";

export type WebSocketStatus = "connecting" | "connected" | "disconnected";

export interface UseMarketWebSocketOptions {
  symbols?: string[];
  enabled?: boolean;
}

export function useMarketWebSocket(options: UseMarketWebSocketOptions = {}) {
  const { symbols, enabled = true } = options;
  const [status, setStatus] = useState<WebSocketStatus>("disconnected");
  const [ticks, setTicks] = useState<Record<string, TickerItem>>({});
  const [lastTickAt, setLastTickAt] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const symbolsRef = useRef<string[]>(symbols || []);
  const isUnmountedRef = useRef(false);

  // Keep symbolsRef updated without triggering reconnects
  useEffect(() => {
    symbolsRef.current = symbols || [];
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && symbols && symbols.length > 0) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", symbols }));
    }
  }, [symbols]);

  const getWsUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    let host = process.env.NEXT_PUBLIC_WS_HOST;
    let protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    if (!host && process.env.NEXT_PUBLIC_API_BASE_URL) {
      try {
        const parsed = new URL(process.env.NEXT_PUBLIC_API_BASE_URL);
        host = parsed.host;
        protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
      } catch {}
    }

    if (!host) {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        host = "localhost:8000";
      } else {
        host = "marketscope-api.onrender.com";
      }
    }

    return `${protocol}//${host}/ws/v1/market-data`;
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !enabled || isUnmountedRef.current) return;

    // Prevent duplicate simultaneous connection attempts
    if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
      return;
    }

    // Stop rapid reconnection loops if exceeded 5 attempts
    if (retryCountRef.current > 5) {
      setStatus("disconnected");
      return;
    }

    const url = getWsUrl();
    if (!url) return;

    setStatus("connecting");

    try {
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        if (isUnmountedRef.current) {
          socket.close();
          return;
        }
        setStatus("connected");
        retryCountRef.current = 0;

        const currentSymbols = symbolsRef.current;
        if (currentSymbols.length > 0) {
          socket.send(JSON.stringify({ action: "subscribe", symbols: currentSymbols }));
        }
      };

      socket.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === "ticker_update" && Array.isArray(data.items)) {
            setTicks((prev) => {
              const updated = { ...prev };
              for (const item of data.items) {
                updated[item.symbol] = item;
              }
              return updated;
            });
            setLastTickAt(new Date());
          } else if (data.type === "snapshot" && Array.isArray(data.items)) {
            const initialMap: Record<string, TickerItem> = {};
            for (const item of data.items) {
              initialMap[item.symbol] = item;
            }
            setTicks(initialMap);
            setLastTickAt(new Date());
          }
        } catch {
          // ignore malformed frame
        }
      };

      socket.onclose = () => {
        wsRef.current = null;
        if (isUnmountedRef.current) return;
        setStatus("disconnected");

        // Exponential backoff reconnect: 3s, 5s, 8s, up to 30s max
        if (retryCountRef.current < 5) {
          const delay = Math.min(3000 * Math.pow(1.5, retryCountRef.current), 30000);
          retryCountRef.current += 1;
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) connect();
          }, delay);
        }
      };

      socket.onerror = () => {
        // Do not force-close on error; onclose fires automatically
      };
    } catch {
      setStatus("disconnected");
    }
  }, [enabled, getWsUrl]);

  useEffect(() => {
    isUnmountedRef.current = false;
    if (enabled) {
      connect();
    }
    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        const socket = wsRef.current;
        wsRef.current = null;
        socket.onopen = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        try {
          socket.close();
        } catch {}
      }
    };
  }, [enabled, connect]);

  const subscribe = useCallback((newSymbols: string[]) => {
    symbolsRef.current = newSymbols;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "subscribe", symbols: newSymbols }));
    }
  }, []);

  return {
    status,
    isConnected: status === "connected",
    ticks,
    lastTickAt,
    subscribe,
  };
}
