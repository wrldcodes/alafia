"use client";

// app/(dashboard)/layout.tsx

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

const SIDEBAR_KEY = "alafia_sidebar_open";

type Role = "CLINIC_ADMIN" | "DOCTOR" | "CLINIC_STAFF" | "PATIENT";

type SessionUser = {
  userId: string;
  email: string;
  role: Role;
  clinicId?: string;
  staffId?: string;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved !== null) setOpen(saved === "true");
  }, []);

  useEffect(() => {
    fetch("/api/debug/session", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.jwt_payload) setSession(data.jwt_payload as SessionUser);
      })
      .catch(() => null);
  }, []);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  return (
    /*
      dashboard-root: height 100vh, overflow hidden, display flex
      This stops the outer shell from scrolling — only the main area scrolls.
      Scrollbars are hidden globally via globals.css addition.
    */
    <div className="dashboard-root">
      <Sidebar
        open={open}
        onToggle={toggle}
        role={(session?.role as Role) ?? "CLINIC_ADMIN"}
        userName={session?.email ?? "User"}
      />
      <div className="dashboard-main">
        <Topbar sidebarOpen={open} />
        <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
