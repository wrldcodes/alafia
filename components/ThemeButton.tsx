"use client";

// components/ThemeToggle.tsx
// Three-way toggle: Light / System / Dark
// Drop anywhere — topbar, settings page, sidebar footer

import { Sun, Monitor, Moon } from "lucide-react";
import { useTheme } from "@/app/ThemeProvider";

const OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark", icon: Moon, label: "Dark" },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="inline-flex items-center rounded-lg border border-[#e8e6e0] dark:border-[#2c2c2a] bg-[#f5f4f0] dark:bg-[#1a1a18] p-0.5 gap-0.5"
      role="radiogroup"
      aria-label="Theme preference"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            className={[
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all duration-150",
              active
                ? "bg-white dark:bg-[#2c2c2a] text-[#0F6E56] shadow-sm"
                : "text-[#9a9890] hover:text-[#5a5855] dark:hover:text-[#b8b5b0]",
            ].join(" ")}
          >
            <Icon size={12} aria-hidden="true" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
