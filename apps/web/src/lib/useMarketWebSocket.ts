"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { TickerItem } from "@/lib/api";

export type WebSocketStatus = "connecting" | "connected" | "disconnected";

export interface UseMarketWebSocketOptions {
  symbols?: string[];
  enabled?: boolean;
}

export function useMarketWebSocket(options: UseMarketWebSocketOptions = {}) {
  const { symbols = [], enabled = true } = options;
  const [status, setStatus] = useState<WebSocketStatus>("disconnected");
  const [ticks, setTicks] = useState<Record<string, TickerItem>>({});
  const [lastTickAt, setLastTickAt] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const getWsUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.NEXT_PUBLIC_WS_HOST || "localhost:8000";
    return `${protocol}//${host}/ws/v1/market-data`;
  }, []);

  const connect = useCallback(() => {
    if (typeof window === "undefined" || !enabled) return;

    const url = getWsUrl();
    if (!url) return;

    setStatus("connecting");

    try {
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        setStatus("connected");
        retryCountRef.current = 0;

        // If symbols are requested, subscribe
        if (symbols.length > 0) {
          socket.send(JSON.stringify({ action: "subscribe", symbols }));
        }
      };

      socket.onmessage = (event) => {
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
        setStatus("disconnected");
        wsRef.current = null;

        // Exponential backoff reconnect: 1s, 2s, 4s, up to 15s max
        const delay = Math.min(1000 * Math.pow(1.5, retryCountRef.current), 15000);
        retryCountRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch {
      setStatus("disconnected");
    }
  }, [enabled, getWsUrl, symbols]);

  useEffect(() => {
    if (enabled) {
      connect();
    }
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enabled, connect]);

  const subscribe = useCallback((newSymbols: string[]) => {
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
