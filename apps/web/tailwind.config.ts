import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#040D1B",
          navy: "#071426",
          dark: "#0B1930",
          surface: "#10223B",
          border: "#162C4E",
          subtle: "#1C3358",
        },
        light: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          card: "#FFFFFF",
          border: "#E2E8F0",
          borderSubtle: "#F1F5F9",
          text: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        brand: {
          blue: "#3B82F6",
          cyan: "#22D3EE",
          emerald: "#10B981",
          coral: "#EF4444",
          violet: "#8B5CF6",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        marquee: "marquee 110s linear infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(59, 130, 246, 0.25)",
        "glow-cyan": "0 0 25px -5px rgba(34, 211, 238, 0.25)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
