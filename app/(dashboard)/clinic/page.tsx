"use client";

// app/(dashboard)/clinic/page.tsx
// Clinic Admin Dashboard — full analytics view

import { useClinicDashboard } from "@/hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Users,
  CalendarCheck,
  FileText,
  UserPlus,
  Stethoscope,
  Clock,
  TrendingUp,
  Wallet,
} from "lucide-react";

// ─── Status colours ───────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  CONFIRMED:   "#22c55e",
  COMPLETED:   "#3b82f6",
  PENDING:     "#f59e0b",
  CANCELLED:   "#ef4444",
  NO_SHOW:     "#8b5cf6",
  RESCHEDULED: "#6b7280",
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED:   "Confirmed",
  COMPLETED:   "Completed",
  PENDING:     "Pending",
  CANCELLED:   "Cancelled",
  NO_SHOW:     "No Show",
  RESCHEDULED: "Rescheduled",
};

// ─── Animation variants ───────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

// ─── Stat Card ────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  index,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${accent}, transparent 70%)`,
        }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
          {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
        </div>
        <div
          className="rounded-xl p-2.5"
          style={{ backgroundColor: `${accent}20` }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white/5 ${className ?? ""}`}
    />
  );
}

// ─── Appointment row ──────────────────────────────────────────────────────
function AppointmentRow({ appt, index }: { appt: any; index: number }) {
  const color = STATUS_COLORS[appt.status] ?? "#6b7280";
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {appt.patient.firstName[0]}{appt.patient.lastName[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {appt.patient.firstName} {appt.patient.lastName}
          </p>
          <p className="text-xs text-zinc-400">{appt.doctor.specialization}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-white">
          {format(new Date(appt.slot.startTime), "HH:mm")}
        </p>
        <span
          className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {STATUS_LABELS[appt.status]}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export default function ClinicDashboard() {
  const { data, loading, error, refetch } = useClinicDashboard();

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-emerald-500/20 px-4 py-2 text-sm text-emerald-400 hover:bg-emerald-500/30"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const charts = data?.charts;
  const upcoming = data?.lists.upcomingToday ?? [];

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Clinic Overview
          </h1>
          <p className="text-sm text-zinc-400">
            {format(new Date(), "EEEE, MMMM d yyyy")}
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
        >
          <TrendingUp className="h-4 w-4" />
          Refresh
        </button>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard index={0} icon={CalendarCheck} label="Appointments Today"
            value={stats?.totalAppointmentsToday ?? 0}
            sub={`${stats?.appointmentsByStatus.CONFIRMED ?? 0} confirmed`}
            accent="#22c55e" />
          <StatCard index={1} icon={UserPlus} label="New Patients Today"
            value={stats?.newPatientsToday ?? 0}
            sub="First visit" accent="#3b82f6" />
          <StatCard index={2} icon={Users} label="Total Patients"
            value={stats?.totalPatientsAllTime ?? 0}
            sub="All time" accent="#a78bfa" />
          <StatCard index={3} icon={FileText} label="Records This Week"
            value={stats?.medicalRecordsThisWeek ?? 0}
            sub="Medical records" accent="#f59e0b" />
          <StatCard index={4} icon={Stethoscope} label="Active Doctors"
            value={stats?.activeDoctors ?? 0}
            accent="#06b6d4" />
          <StatCard index={5} icon={Users} label="Total Staff"
            value={stats?.totalStaff ?? 0}
            accent="#ec4899" />
          <StatCard index={6} icon={Clock} label="Pending"
            value={stats?.appointmentsByStatus.PENDING ?? 0}
            sub="Awaiting confirmation" accent="#f59e0b" />
          <StatCard index={7} icon={Wallet} label="Revenue Today"
            value="—"
            sub="Available in Phase 3" accent="#6b7280" />
        </div>
      )}

      {/* Charts row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Bar chart — 7 day trend */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Appointment Trend — Last 7 Days
          </h2>
          {loading ? (
            <Skeleton className="h-48" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts?.appointmentTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 12 }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#a1a1aa" }}
                />
                <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} name="Total" />
                <Bar dataKey="completed" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Completed" />
                <Bar dataKey="cancelled" fill="#ef444460" radius={[6, 6, 0, 0]} name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie chart — status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Today's Status Split
          </h2>
          {loading ? (
            <Skeleton className="h-48" />
          ) : charts?.statusBreakdown.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
              No appointments today
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={charts?.statusBreakdown}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {charts?.statusBreakdown.map((entry, i) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 12 }}
                  formatter={(value, name) => [value, STATUS_LABELS[name as string] ?? name]}
                />
                <Legend
                  formatter={(value) => STATUS_LABELS[value] ?? value}
                  wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Upcoming appointments today */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Upcoming Today
          </h2>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            {upcoming.length} remaining
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No more appointments today
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((appt, i) => (
              <AppointmentRow key={appt.id} appt={appt} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
