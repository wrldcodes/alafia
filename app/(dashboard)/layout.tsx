"use client";

// app/(dashboard)/layout.tsx
// Shared layout for all dashboard pages — sidebar + topbar
// Protected: redirects to /login if user is not authenticated.

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  FileText,
  Pill,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
  Building2,
  User,
  Clock,
} from "lucide-react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// ─── Nav config per role ──────────────────────────────────────────────────

const NAV_CONFIG: Record<string, { label: string; href: string; icon: any }[]> = {
  CLINIC_ADMIN: [
    { label: "Overview",     href: "/clinic",              icon: LayoutDashboard },
    { label: "Appointments", href: "/clinic/appointments", icon: CalendarCheck },
    { label: "Patients",     href: "/clinic/patients",     icon: Users },
    { label: "Staff",        href: "/clinic/staff",        icon: Stethoscope },
    { label: "Records",      href: "/clinic/records",      icon: FileText },
    { label: "Settings",     href: "/clinic/settings",     icon: Settings },
  ],
  DOCTOR: [
    { label: "Overview",     href: "/doctor",              icon: LayoutDashboard },
    { label: "Schedule",     href: "/doctor/schedule",     icon: Clock },
    { label: "Patients",     href: "/doctor/patients",     icon: Users },
    { label: "Records",      href: "/doctor/records",      icon: FileText },
  ],
  PATIENT: [
    { label: "Overview",     href: "/patient",             icon: LayoutDashboard },
    { label: "Appointments", href: "/patient/appointments",icon: CalendarCheck },
    { label: "Records",      href: "/patient/records",     icon: FileText },
    { label: "Prescriptions",href: "/patient/prescriptions",icon: Pill },
    { label: "Profile",      href: "/patient/profile",     icon: User },
  ],
};

const ROLE_META: Record<string, { label: string; color: string; icon: any }> = {
  CLINIC_ADMIN: { label: "Clinic Admin",  color: "#22c55e", icon: Building2 },
  DOCTOR:       { label: "Doctor",        color: "#3b82f6", icon: Stethoscope },
  PATIENT:      { label: "Patient",       color: "#a78bfa", icon: User },
};

// ─── Sidebar ──────────────────────────────────────────────────────────────

function Sidebar({
  role,
  email,
  onClose,
}: {
  role: string;
  email: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = NAV_CONFIG[role] ?? [];
  const meta = ROLE_META[role];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex h-full flex-col bg-zinc-900 border-r border-white/5">

      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/alafialogo-transparent.png"
            alt="Aláfíà logo"
            width={120}
            height={55}
            className="h-7 w-auto brightness-0 invert"
            priority
          />
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="mx-4 mb-4 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5">
        <div className="flex items-center gap-2">
          {meta && (
            <div className="rounded-lg p-1.5" style={{ backgroundColor: `${meta.color}20` }}>
              <meta.icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white">{meta?.label ?? role}</p>
            <p className="truncate text-[10px] text-zinc-500">{email}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`h-4 w-4 ${active ? "text-emerald-400" : ""}`} />
              {item.label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [role, setRole] = useState<string>("CLINIC_ADMIN");
  const [email, setEmail] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Use the clean /api/auth/session endpoint — no debug data exposed
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setRole(d.user.role);
          setEmail(d.user.email);
          setAuthStatus("authenticated");
        } else {
          setAuthStatus("unauthenticated");
          router.push("/login");
        }
      })
      .catch(() => {
        setAuthStatus("unauthenticated");
        router.push("/login");
      });
  }, [router]);

  // While checking auth — show minimal loading screen, NO sidebar rendered
  if (authStatus === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 animate-pulse">
            <span className="text-sm font-black text-white">A</span>
          </div>
          <p className="text-xs text-zinc-500">Loading your dashboard&hellip;</p>
        </div>
      </div>
    );
  }

  // Not authenticated — render nothing (redirect is already in flight)
  if (authStatus === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">

      {/* Desktop sidebar */}
      <div className="hidden w-60 shrink-0 lg:block">
        <Sidebar role={role} email={email} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden"
            >
              <Sidebar role={role} email={email} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile topbar */}
        <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900 px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-zinc-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src="/alafialogo-transparent.png"
              alt="Aláfíà logo"
              width={100}
              height={46}
              className="h-6 w-auto brightness-0 invert"
              priority
            />
          </div>
          <div className="w-5" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
