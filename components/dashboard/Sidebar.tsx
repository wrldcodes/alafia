"use client";

// components/dashboard/Sidebar.tsx

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Pill,
  Paperclip,
  Stethoscope,
  Clock,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ClipboardList,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// ─── Role-specific nav configs ────────────────────────────────────────────

const NAV_CLINIC_ADMIN = [
  {
    section: null,
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/clinic" },
      {
        label: "Appointments",
        icon: CalendarDays,
        href: "/clinic/appointments",
      },
      { label: "Patients", icon: Users, href: "/clinic/patients" },
    ],
  },
  {
    section: "Clinical",
    items: [
      { label: "Medical records", icon: FileText, href: "/clinic/records" },
      { label: "Prescriptions", icon: Pill, href: "/clinic/prescriptions" },
      { label: "Attachments", icon: Paperclip, href: "/clinic/attachments" },
    ],
  },
  {
    section: "Manage",
    items: [
      { label: "Doctors & staff", icon: Stethoscope, href: "/clinic/staff" },
      { label: "Schedules & slots", icon: Clock, href: "/clinic/schedules" },
      { label: "Settings", icon: Settings, href: "/clinic/settings" },
    ],
  },
];

const NAV_DOCTOR = [
  {
    section: null,
    items: [
      { label: "My schedule", icon: LayoutDashboard, href: "/doctor" },
      {
        label: "Appointments",
        icon: CalendarDays,
        href: "/doctor/appointments",
      },
      { label: "My patients", icon: Users, href: "/doctor/patients" },
    ],
  },
  {
    section: "Clinical",
    items: [
      { label: "Medical records", icon: FileText, href: "/doctor/records" },
      { label: "Prescriptions", icon: Pill, href: "/doctor/prescriptions" },
    ],
  },
];

const NAV_CLINIC_STAFF = [
  {
    section: null,
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/staff" },
      {
        label: "Appointments",
        icon: CalendarDays,
        href: "/staff/appointments",
      },
      { label: "Patients", icon: Users, href: "/staff/patients" },
    ],
  },
  {
    section: "Manage",
    items: [
      { label: "Schedules", icon: Clock, href: "/staff/schedules" },
      { label: "Records", icon: ClipboardList, href: "/staff/records" },
    ],
  },
];

const NAV_PATIENT = [
  {
    section: null,
    items: [
      { label: "Overview", icon: LayoutDashboard, href: "/patient" },
      {
        label: "My appointments",
        icon: CalendarDays,
        href: "/patient/appointments",
      },
    ],
  },
  {
    section: "My health",
    items: [
      { label: "Medical records", icon: HeartPulse, href: "/patient/records" },
      { label: "Prescriptions", icon: Pill, href: "/patient/prescriptions" },
      { label: "Attachments", icon: Paperclip, href: "/patient/attachments" },
    ],
  },
];

const NAV_MAP: Record<string, typeof NAV_CLINIC_ADMIN> = {
  CLINIC_ADMIN: NAV_CLINIC_ADMIN,
  DOCTOR: NAV_DOCTOR,
  CLINIC_STAFF: NAV_CLINIC_STAFF,
  PATIENT: NAV_PATIENT,
};

const ROLE_LABELS: Record<string, string> = {
  CLINIC_ADMIN: "Clinic Admin",
  DOCTOR: "Doctor",
  CLINIC_STAFF: "Staff",
  PATIENT: "Patient",
};

// ─────────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onToggle: () => void;
  role?: string;
  userName?: string;
};

export default function Sidebar({
  open,
  onToggle,
  role = "CLINIC_ADMIN",
  userName = "Clinic Admin",
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const nav = NAV_MAP[role] ?? NAV_CLINIC_ADMIN;

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
    router.refresh();
  }

  return (
    <motion.aside
      animate={{ width: open ? 236 : 72 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative flex flex-col h-full overflow-hidden flex-shrink-0",
        "border-r border-[var(--color-border-secondary)]",
        "bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf9_58%,#f1f8f5_100%)]",
        "dark:bg-[linear-gradient(180deg,#1a1a1a_0%,#161a18_58%,#121612_100%)]",
        "shadow-[8px_0_24px_rgba(18,56,47,0.04)]",
      )}
      style={{ minWidth: open ? 236 : 72 }}
    >
      {/* ── Top ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-[var(--color-border-tertiary)] px-3 py-4">
        <div
          className={cn(
            "flex items-center",
            open ? "justify-between" : "flex-col gap-2",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 items-center overflow-hidden",
              open ? "h-12 flex-1 pr-3" : "h-10 w-10 justify-center",
            )}
          >
            <div
              className={cn(
                "relative flex-shrink-0 overflow-hidden",
                open ? "h-12 w-[148px]" : "h-10 w-10",
              )}
            >
              {open ? (
                <Image
                  src="/alafialogo-transparent.png"
                  alt="Alafia logo"
                  width={1792}
                  height={817}
                  className="h-12 w-auto max-w-none object-contain object-left"
                  priority
                />
              ) : (
                <Image
                  src="/alafialogo-mark.png"
                  alt="Alafia logo mark"
                  width={512}
                  height={512}
                  className="h-10 w-10 object-contain"
                  priority
                />
              )}
            </div>
          </div>
          <button
            onClick={onToggle}
            className="flex-shrink-0 p-1 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] transition-colors"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
        </div>

        {/* Date/time — expanded only */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-3 overflow-hidden text-white"
            >
              <div className="text-[10px] text-[var(--color-text-tertiary)]">
                {format(now, "EEEE")}
              </div>
              <div className="text-[20px] font-medium text-[var(--color-text-primary)] leading-tight tracking-tight">
                {format(now, "MMM d, yyyy")}
              </div>
              <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                {format(now, "h:mm a")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav ─────────────────────────────────────────── */}
      {/*
        scrollbar-none hides the scrollbar visually but keeps scroll
        functional. Works in Chrome/Safari. For Firefox add
        scrollbar-width: none in your global CSS.
      */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {nav.map((group, gi) => (
          <div key={gi}>
            <AnimatePresence>
              {open && group.section && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-4 pt-3 pb-1 text-[10px] tracking-wider text-[var(--color-text-tertiary)] uppercase"
                >
                  {group.section}
                </motion.div>
              )}
            </AnimatePresence>

            {!open && group.section && (
              <div className="mx-3 my-2 h-px bg-[var(--color-border-tertiary)]" />
            )}

            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!open ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2.5 mx-2 px-2.5 py-2 text-[12px] transition-all border-l-2 rounded-r-[8px]",
                    active
                      ? "text-[#0F6E56] border-l-[#0F6E56] bg-[#E1F5EE] dark:bg-[#0F6E5620]"
                      : "text-[var(--color-text-tertiary)] border-l-transparent hover:text-[var(--color-text-primary)] hover:bg-white dark:hover:bg-white/5 hover:shadow-sm",
                  )}
                >
                  <item.icon
                    size={14}
                    className="flex-shrink-0"
                    aria-hidden="true"
                  />
                  <AnimatePresence>
                    {open && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-[var(--color-border-tertiary)] p-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-[28px] h-[28px] rounded-full bg-[#E1F5EE] dark:bg-[#0F6E5630] ring-1 ring-[var(--color-border-secondary)] flex items-center justify-center text-[9px] font-semibold text-[#0F6E56] flex-shrink-0">
            {initials}
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <div className="text-[12px] font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                  {userName}
                </div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap">
                  {ROLE_LABELS[role] ?? role}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {open && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={handleLogout}
                className="flex-shrink-0 p-1.5 rounded-md text-[var(--color-text-tertiary)] hover:text-[#b42318] hover:bg-[#fee4e2] transition-colors"
                aria-label="Log out"
              >
                <LogOut size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Collapsed logout */}
        {!open && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex justify-center p-1.5 rounded-md text-[var(--color-text-tertiary)] hover:text-[#b42318] hover:bg-[#fee4e2] transition-colors"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
