"use client";

// app/(dashboard)/layout.tsx
// Shared shell for all dashboard pages.
// Sidebar collapses to icon-only, date/time moves to topbar.

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

const SIDEBAR_KEY = "alafia_sidebar_open";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  // Persist sidebar state across page loads
  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved !== null) {
      const openVal = saved === "true";
      const id = setTimeout(() => {
        setOpen(openVal);
      }, 0);
      return () => clearTimeout(id);
    }
  }, []);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background-secondary)]">
      <Sidebar open={open} onToggle={toggle} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar sidebarOpen={open} />
        <main className="min-h-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
