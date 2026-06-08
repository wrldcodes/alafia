"use client";

// app/(dashboard)/doctor/page.tsx
// Doctor Dashboard — operational schedule view

import { useDoctorDashboard } from "@/hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, differenceInYears } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Users,
  FileText,
  Clock,
  ChevronRight,
  Activity,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED:  "#22c55e",
  COMPLETED:  "#3b82f6",
  PENDING:    "#f59e0b",
  CANCELLED:  "#ef4444",
  NO_SHOW:    "#8b5cf6",
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED:  "Confirmed",
  COMPLETED:  "Completed",
  PENDING:    "Pending",
  CANCELLED:  "Cancelled",
  NO_SHOW:    "No Show",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

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
        style={{ background: `radial-gradient(circle at top right, ${accent}, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
        </div>
        <div className="rounded-xl p-2.5" style={{ backgroundColor: `${accent}20` }}>
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </motion.div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/5 ${className ?? ""}`} />;
}

function ScheduleRow({ appt, index }: { appt: any; index: number }) {
  const color = STATUS_COLORS[appt.status] ?? "#6b7280";
  const age = appt.patient.dateOfBirth
    ? differenceInYears(new Date(), new Date(appt.patient.dateOfBirth))
    : null;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition hover:bg-white/10 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Time block */}
        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-zinc-900 text-center">
          <span className="text-sm font-bold text-white">
            {format(new Date(appt.slot.startTime), "HH:mm")}
          </span>
          <span className="text-[10px] text-zinc-500">
            {appt.slot.duration}min
          </span>
        </div>

        {/* Patient info */}
        <div>
          <p className="text-sm font-semibold text-white">
            {appt.patient.firstName} {appt.patient.lastName}
          </p>
          <p className="text-xs text-zinc-400">
            {age !== null ? `${age} yrs` : "—"} · {appt.reason}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {STATUS_LABELS[appt.status] ?? appt.status}
        </span>
        <ChevronRight className="h-4 w-4 text-zinc-600 transition group-hover:text-zinc-300" />
      </div>
    </motion.div>
  );
}

export default function DoctorDashboard() {
  const { data, loading, error, refetch } = useDoctorDashboard();

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-blue-500/20 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/30"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const schedule = data?.lists.todaySchedule ?? [];
  const nextAppt = data?.lists.nextAppointment;

  // Build status bar chart data
  const statusChartData = Object.entries(stats?.appointmentsByStatus ?? {})
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({
      status: STATUS_LABELS[status] ?? status,
      count,
      fill: STATUS_COLORS[status] ?? "#6b7280",
    }));

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
            My Dashboard
          </h1>
          <p className="text-sm text-zinc-400">
            {format(new Date(), "EEEE, MMMM d yyyy")}
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
        >
          <Activity className="h-4 w-4" />
          Refresh
        </button>
      </motion.div>

      {/* Next appointment banner */}
      {!loading && nextAppt && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/20 p-2">
              <Clock className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Next Patient
              </p>
              <p className="text-sm font-bold text-white">
                {nextAppt.patient.firstName} {nextAppt.patient.lastName}
              </p>
              <p className="text-xs text-zinc-400">{nextAppt.reason}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">
              {format(new Date(nextAppt.slot.startTime), "HH:mm")}
            </p>
            <p className="text-xs text-zinc-400">
              {format(new Date(nextAppt.slot.endTime), "HH:mm")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard index={0} icon={CalendarCheck} label="Appointments Today"
            value={stats?.totalAppointmentsToday ?? 0}
            sub={`${stats?.appointmentsByStatus.CONFIRMED ?? 0} confirmed`}
            accent="#22c55e" />
          <StatCard index={1} icon={Clock} label="Pending"
            value={stats?.appointmentsByStatus.PENDING ?? 0}
            sub="Awaiting confirmation" accent="#f59e0b" />
          <StatCard index={2} icon={Users} label="Patients This Week"
            value={stats?.patientsSeenThisWeek ?? 0}
            sub="Unique patients seen" accent="#3b82f6" />
          <StatCard index={3} icon={FileText} label="Records This Week"
            value={stats?.recordsCreatedThisWeek ?? 0}
            sub="Medical records" accent="#a78bfa" />
        </div>
      )}

      {/* Charts + Schedule */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Today's status breakdown bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Today's Breakdown
          </h2>
          {loading ? (
            <Skeleton className="h-48" />
          ) : statusChartData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
              No appointments today
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusChartData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="status" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 12 }}
                  cursor={{ fill: "#ffffff08" }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} name="Count">
                  {statusChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Today's schedule */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Today's Schedule
            </h2>
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
              {schedule.length} appointments
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : schedule.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
              No appointments scheduled for today
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {schedule.map((appt, i) => (
                <ScheduleRow key={appt.id} appt={appt} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
