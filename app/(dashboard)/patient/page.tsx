"use client";

// app/(dashboard)/patient/page.tsx
// Patient Dashboard — personal health summary

import { usePatientDashboard } from "@/hooks/useDashboard";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Pill,
  FileText,
  Clock,
  MapPin,
  ChevronRight,
  Activity,
  Stethoscope,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#22c55e",
  PENDING:   "#f59e0b",
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING:   "Pending",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
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

function AppointmentCard({ appt, index }: { appt: any; index: number }) {
  const color = STATUS_COLORS[appt.status] ?? "#6b7280";
  const daysUntil = differenceInDays(new Date(appt.slot.date), new Date());

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="group rounded-xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {STATUS_LABELS[appt.status] ?? appt.status}
        </span>
        <span className="text-xs text-zinc-500">
          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-white">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          {format(new Date(appt.slot.startTime), "EEE d MMM · HH:mm")} –{" "}
          {format(new Date(appt.slot.endTime), "HH:mm")}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Stethoscope className="h-3.5 w-3.5 text-zinc-500" />
          {appt.doctor.specialization}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <MapPin className="h-3.5 w-3.5 text-zinc-500" />
          {appt.clinic.clinicName}
        </div>
      </div>
    </motion.div>
  );
}

function RecordCard({ record, index }: { record: any; index: number }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition hover:bg-white/10 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20">
          <FileText className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{record.diagnosis}</p>
          <p className="text-xs text-zinc-400">
            {record.clinic.clinicName} · {format(new Date(record.createdAt), "MMM d, yyyy")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-zinc-500">{record._count.prescriptions} rx</p>
          <p className="text-xs text-zinc-500">{record._count.attachments} files</p>
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-600 transition group-hover:text-zinc-300" />
      </div>
    </motion.div>
  );
}

export default function PatientDashboard() {
  const { data, loading, error, refetch } = usePatientDashboard();

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-400 hover:bg-purple-500/30"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const nextAppt = data?.lists.nextAppointment;
  const upcoming = data?.lists.upcomingAppointments ?? [];
  const records = data?.lists.recentRecords ?? [];

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
            My Health
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

      {/* Next appointment hero banner */}
      {!loading && nextAppt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-zinc-950 p-6"
        >
          <div className="absolute inset-0 opacity-5"
            style={{ background: "radial-gradient(circle at top right, #22c55e, transparent 60%)" }}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Next Appointment
              </p>
              <p className="text-lg font-bold text-white">
                {nextAppt.clinic.clinicName}
              </p>
              <p className="text-sm text-zinc-400">{nextAppt.doctor.specialization}</p>
              <p className="mt-2 text-xs text-zinc-500">{nextAppt.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                {format(new Date(nextAppt.slot.startTime), "HH:mm")}
              </p>
              <p className="text-sm text-zinc-400">
                {format(new Date(nextAppt.slot.date), "EEE, MMM d")}
              </p>
              <span
                className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase"
                style={{
                  backgroundColor: `${STATUS_COLORS[nextAppt.status]}20`,
                  color: STATUS_COLORS[nextAppt.status],
                }}
              >
                {STATUS_LABELS[nextAppt.status]}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard index={0} icon={CalendarCheck} label="Total Visits"
            value={stats?.totalVisits ?? 0} sub="Completed appointments" accent="#22c55e" />
          <StatCard index={1} icon={Pill} label="Active Prescriptions"
            value={stats?.activePrescriptions ?? 0} sub="Current medications" accent="#f59e0b" />
          <StatCard index={2} icon={CalendarCheck} label="Upcoming"
            value={stats?.upcomingAppointmentsCount ?? 0} sub="Scheduled appointments" accent="#3b82f6" />
          <StatCard index={3} icon={FileText} label="Medical Records"
            value={stats?.totalRecords ?? 0} sub="Visit records" accent="#a78bfa" />
        </div>
      )}

      {/* Upcoming appointments + recent records */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Upcoming appointments */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Upcoming Appointments
            </h2>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              {upcoming.length}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <CalendarCheck className="h-8 w-8 text-zinc-700" />
              <p className="text-sm text-zinc-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((appt, i) => (
                <AppointmentCard key={appt.id} appt={appt} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent medical records */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Recent Records
            </h2>
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
              {records.length}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : records.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <FileText className="h-8 w-8 text-zinc-700" />
              <p className="text-sm text-zinc-500">No medical records yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((record, i) => (
                <RecordCard key={record.id} record={record} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
