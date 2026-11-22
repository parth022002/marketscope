"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Sun,
  Moon,
  Globe,
  DollarSign,
  Bell,
  ShieldCheck,
  User,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import NavigationShell from "@/components/NavigationShell";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [defaultMarket, setDefaultMarket] = useState("NSE");
  const [currency, setCurrency] = useState("INR");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <NavigationShell activePath="/settings">
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">Platform Settings & Preferences</h1>
          </div>
          <p className="text-xs text-slate-400">
            Customize display preferences, default exchange benchmarks, notification alerts, and data streams.
          </p>
        </div>

        {/* Display & Appearance */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Sun className="w-4 h-4 text-sky-400" /> Theme & Appearance
          </h2>
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-200">Interface Color Theme</p>
              <p className="text-slate-400">Switch between deep dark terminal and light research paper mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium hover:bg-slate-700 transition-colors"
            >
              {theme === "light" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              <span className="capitalize">{theme} Theme</span>
            </button>
          </div>
        </div>

        {/* Market Preferences */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" /> Market & Currency Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Default Primary Exchange</label>
              <select
                value={defaultMarket}
                onChange={(e) => setDefaultMarket(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              >
                <option value="NSE">NSE (National Stock Exchange of India)</option>
                <option value="BSE">BSE (Bombay Stock Exchange)</option>
                <option value="NASDAQ">NASDAQ (US Equities & Tech)</option>
                <option value="NYSE">NYSE (New York Stock Exchange)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Default Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              >
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="USD">USD ($ - United States Dollar)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-400" /> Notifications & Alerts
          </h2>
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-200">Browser Price Threshold Alerts</p>
              <p className="text-slate-400">Receive in-app alerts when configured stock price points trigger.</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 bg-slate-800 border-slate-700"
            />
          </div>
        </div>

        {/* Save Confirmation Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Preferences saved successfully.
            </span>
          )}
          <button
            onClick={handleSave}
            className="ml-auto px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </NavigationShell>
  );
}
