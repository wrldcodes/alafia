"use client";

// components/dashboard/Topbar.tsx

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Bell, Plus } from "lucide-react";

type Props = {
  sidebarOpen: boolean;
  title?: string;
  subtitle?: string;
  onNewAppointment?: () => void;
  notificationCount?: number;
};

export default function Topbar({
  sidebarOpen,
  title = "Overview",
  subtitle = "Today",
  onNewAppointment,
  notificationCount = 0,
}: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-tertiary)] bg-[var(--color-background-primary)] flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Breadcrumb */}
        <div className="text-[11px] text-[var(--color-text-tertiary)] whitespace-nowrap">
          {title}&nbsp;/&nbsp;{subtitle}
        </div>

        {/* Date + time slide in when sidebar collapses */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              <div className="w-px h-3 bg-[var(--color-border-tertiary)]" />
              <span className="text-[11px] font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                {format(now, "EEE, MMM d")}
              </span>
              <div className="w-px h-3 bg-[var(--color-border-tertiary)]" />
              <span className="text-[11px] text-[var(--color-text-tertiary)] whitespace-nowrap tabular-nums">
                {format(now, "h:mm a")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[5px] border border-[var(--color-border-secondary)] text-[11px] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <Search size={11} aria-hidden="true" />
          Search
        </button>

        <button
          className="relative inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[5px] border border-[var(--color-border-secondary)] text-[11px] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
        >
          <Bell size={11} aria-hidden="true" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-[14px] h-[14px] rounded-full bg-[#E24B4A] text-white text-[8px] font-semibold flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        <button
          onClick={onNewAppointment}
          className="inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-[5px] bg-[#0F6E56] border border-[#0F6E56] text-[11px] text-white hover:bg-[#085041] hover:border-[#085041] transition-colors"
        >
          <Plus size={11} aria-hidden="true" />
          New appointment
        </button>
      </div>
    </header>
  );
}
