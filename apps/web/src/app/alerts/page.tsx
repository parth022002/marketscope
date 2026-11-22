"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";

interface AlertItem {
  id: string;
  symbol: string;
  condition: string;
  target_price: string;
  created_at: string;
  status: "ACTIVE" | "TRIGGERED";
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: "1", symbol: "RELIANCE", condition: "Crosses Above", target_price: "₹1,400.00", created_at: "Today, 10:30 AM", status: "ACTIVE" },
    { id: "2", symbol: "NIFTY", condition: "Crosses Below", target_price: "25,500.00", created_at: "Yesterday", status: "ACTIVE" },
    { id: "3", symbol: "TCS", condition: "RSI(14) < 30", target_price: "Oversold", created_at: "3 days ago", status: "TRIGGERED" },
  ]);

  const [newSymbol, setNewSymbol] = useState("INFY");
  const [newCondition, setNewCondition] = useState("Crosses Above");
  const [newTarget, setNewTarget] = useState("1950");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: AlertItem = {
      id: String(Date.now()),
      symbol: newSymbol.toUpperCase(),
      condition: newCondition,
      target_price: newTarget,
      created_at: "Just now",
      status: "ACTIVE",
    };
    setAlerts([newAlert, ...alerts]);
    setIsModalOpen(false);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <NavigationShell activePath="/alerts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-5 h-5 text-sky-400" />
              <h1 className="text-xl font-bold tracking-tight text-slate-100">Price & Technical Alert Centre</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold">
                REAL-TIME MONITOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Configure price thresholds, percentage swings, and technical indicator breakout notifications.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Alert</span>
          </button>
        </div>

        {/* Alerts Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200">Active Alert Rules ({alerts.length})</h2>
          </div>

          <div className="divide-y divide-slate-800/60">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400">
                    {alert.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{alert.symbol}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          alert.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {alert.condition} <span className="font-semibold text-slate-200">{alert.target_price}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">{alert.created_at}</span>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Alert Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <form onSubmit={handleCreateAlert} className="relative w-full max-w-md bg-[#091120] border border-slate-700 rounded-xl p-5 z-10 space-y-4">
              <h3 className="font-bold text-base text-slate-100">Set Price / Indicator Alert</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Trading Symbol</label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  >
                    <option value="Crosses Above">Crosses Above</option>
                    <option value="Crosses Below">Crosses Below</option>
                    <option value="Daily % Gain >=">Daily % Gain &gt;=</option>
                    <option value="Daily % Loss >=">Daily % Loss &gt;=</option>
                    <option value="RSI(14) < 30 (Oversold)">RSI(14) &lt; 30 (Oversold)</option>
                    <option value="RSI(14) > 70 (Overbought)">RSI(14) &gt; 70 (Overbought)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Target Price / Threshold</label>
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950"
                >
                  Save Alert
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </NavigationShell>
  );
}
