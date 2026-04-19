import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        teal: {
          50: "#edf7f3",
          100: "#c8eade",
          200: "#8fd4bb",
          400: "#3aab8a",
          600: "#1e7d63",
          700: "#165e4a",
          800: "#0e4e3e",
          900: "#072e24",
        },
        earth: {
          50: "#faf6f0",
          100: "#f2e8d8",
          200: "#e0cdb0",
          400: "#c4a06e",
          600: "#9a7340",
        },
        sand: {
          50: "#faf9f6",
          100: "#f3f0ea",
          200: "#e8e2d8",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "7.5": "1.875rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "25": "6.25rem",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        md: "0.875rem",
        lg: "1.125rem",
        xl: "1.5rem",
        "2xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.10)",
        cta: "0 4px 20px rgba(30,125,99,0.25)",
        "cta-hover": "0 8px 28px rgba(30,125,99,0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "step-in": "stepIn 0.32s ease forwards",
        "pop-in": "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        stepIn: {
          from: { opacity: "0", transform: "translateX(14px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        popIn: {
          from: { transform: "scale(0.5)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
