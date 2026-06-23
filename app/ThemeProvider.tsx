"use client";

// app/ThemeProvider.tsx
// Handles dark/light/system theme preference.
// Persists choice in localStorage across sessions.
// Adds/removes .dark class on <html> — Tailwind darkMode:"class" reads this.

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const KEY = "alafia_theme";

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem(KEY) as Theme | null;
  if (saved === "light" || saved === "dark" || saved === "system") return saved;
  return "system";
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const [resolvedTheme, setResolved] = useState<Resolved>("light");

  useEffect(() => {
    const root = document.documentElement;

    function apply(dark: boolean) {
      if (dark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      setResolved(dark ? "dark" : "light");
    }

    if (theme === "light") {
      apply(false);
      return;
    }
    if (theme === "dark") {
      apply(true);
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem(KEY, t);
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
