"use client";

// app/(dashboard)/clinic/page.tsx

import {
  type AppointmentStatus,
  useClinicDashboard,
} from "@/hooks/useDashboard";
import StatRow from "@/components/dashboard/StatRow";
import TrendChart from "@/components/dashboard/TrendChart";
import DonutChart from "@/components/dashboard/DonutChart";
import AppointmentList from "@/components/dashboard/AppointmentList";
import RecordList from "@/components/dashboard/RecordList";
import GlancePanel from "@/components/dashboard/GlancePanel";
import { RefreshCw } from "lucide-react";

const MOCK_APPOINTMENT_TREND = [
  { date: "Mon", total: 18, completed: 14, cancelled: 1 },
  { date: "Tue", total: 24, completed: 19, cancelled: 2 },
  { date: "Wed", total: 21, completed: 16, cancelled: 1 },
  { date: "Thu", total: 29, completed: 23, cancelled: 3 },
  { date: "Fri", total: 26, completed: 20, cancelled: 2 },
  { date: "Sat", total: 12, completed: 9, cancelled: 1 },
  { date: "Sun", total: 8, completed: 6, cancelled: 0 },
];

const MOCK_STATUS_BREAKDOWN = [
  { status: "CONFIRMED", count: 12 },
  { status: "PENDING", count: 5 },
  { status: "COMPLETED", count: 9 },
  { status: "CANCELLED", count: 2 },
];

export default function ClinicDashboardPage() {
  const { data, loading, error, refetch } = useClinicDashboard();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] border border-[var(--color-border-secondary)] text-[11px] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] transition-colors"
          >
            <RefreshCw size={11} aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const byStatus = (stats?.appointmentsByStatus ?? {}) as Partial<
    Record<AppointmentStatus, number>
  >;

  // ── Stat cards ─────────────────────────────────────────────────────────
  const statItems = [
    {
      label: "Appointments today",
      value: stats?.totalAppointmentsToday ?? 0,
      sub: `${byStatus.CONFIRMED ?? 0} confirmed · ${byStatus.PENDING ?? 0} pending · ${byStatus.COMPLETED ?? 0} done`,
      delta: "+3 from yesterday",
    },
    {
      label: "New patients today",
      value: stats?.newPatientsToday ?? 0,
      sub: `First visit · ${stats?.totalPatientsAllTime ?? 0} total registered`,
      delta: "+2 from yesterday",
    },
    {
      label: "Records this week",
      value: stats?.medicalRecordsThisWeek ?? 0,
      sub: "Medical records created this week",
      delta: "On track",
    },
    {
      label: "Revenue today",
      value: "Coming soon",
      sub: "Billing available in Phase 3",
      muted: true,
    },
  ];

  // ── Glance items ───────────────────────────────────────────────────────
  const glanceItems = [
    { label: "Active doctors", value: stats?.activeDoctors ?? 0 },
    { label: "Total staff", value: stats?.totalStaff ?? 0 },
    { label: "No-show rate", value: "8%", warn: true },
    { label: "All-time patients", value: stats?.totalPatientsAllTime ?? 0 },
    { label: "Slots today", value: 36 },
    { label: "Slots remaining", value: 12 },
    { label: "Avg. wait time", value: "18 min" },
  ];

  // ── Donut data ─────────────────────────────────────────────────────────
  const appointmentTrend =
    data?.charts.appointmentTrend?.length
      ? data.charts.appointmentTrend
      : MOCK_APPOINTMENT_TREND;
  const statusBreakdown =
    data?.charts.statusBreakdown?.length
      ? data.charts.statusBreakdown
      : MOCK_STATUS_BREAKDOWN;

  return (
    <div className="flex min-h-full flex-col">

      {/* KPI strip */}
      <StatRow stats={statItems} loading={loading} />

      {/* Charts row */}
      <div
        className="flex min-h-[260px] border-b border-[var(--color-border-tertiary)] flex-shrink-0"
      >
        {/* Bar chart */}
        <div className="flex-1 flex flex-col px-5 py-4 border-r border-[var(--color-border-tertiary)] min-w-0">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <div>
              <div className="text-[12px] font-medium text-[var(--color-text-primary)]">
                Appointment volume
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)]">Last 7 days</div>
            </div>
            <div className="flex items-center gap-3">
              {[
                { label: "Total", color: "#0F6E56" },
                { label: "Completed", color: "#378ADD" },
                { label: "Cancelled", color: "#F09595" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-tertiary)]">
                  <div className="w-3 h-0.5 rounded flex-shrink-0" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[150px]">
            <TrendChart
              data={appointmentTrend}
              loading={loading}
            />
          </div>
        </div>

        {/* Donut chart */}
        <div className="flex-shrink-0 flex flex-col px-4 py-4" style={{ width: 220 }}>
          <div className="mb-3 flex-shrink-0">
            <div className="text-[12px] font-medium text-[var(--color-text-primary)]">Today&apos;s status</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)]">Appointment split</div>
          </div>
          <div className="flex-1 min-h-0">
            <DonutChart data={statusBreakdown} loading={loading} />
          </div>
        </div>
      </div>

      {/* Bottom row — fills remaining height */}
      <div className="flex flex-1 min-h-[360px] overflow-hidden">

        {/* Upcoming today */}
        <div className="flex-1 flex flex-col border-r border-[var(--color-border-tertiary)] min-w-0 overflow-hidden">
          <div className="flex items-baseline justify-between px-5 py-3 border-b border-[var(--color-border-tertiary)] flex-shrink-0">
            <div className="text-[12px] font-medium text-[var(--color-text-primary)]">Upcoming today</div>
            <button className="text-[11px] text-[#0F6E56] hover:text-[#085041] transition-colors">
              View all
            </button>
          </div>
          <div className="flex-1 overflow-auto px-5 py-1">
            <AppointmentList
              appointments={data?.lists.upcomingToday ?? []}
              loading={loading}
            />
          </div>
        </div>

        {/* Recent records */}
        <div className="flex-1 flex flex-col border-r border-[var(--color-border-tertiary)] min-w-0 overflow-hidden">
          <div className="flex items-baseline justify-between px-5 py-3 border-b border-[var(--color-border-tertiary)] flex-shrink-0">
            <div className="text-[12px] font-medium text-[var(--color-text-primary)]">Recent records</div>
            <button className="text-[11px] text-[#0F6E56] hover:text-[#085041] transition-colors">
              View all
            </button>
          </div>
          <div className="flex-1 overflow-auto px-5 py-1">
            <RecordList
              records={[]}
              loading={loading}
            />
          </div>
        </div>

        {/* At a glance */}
        <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width: 164 }}>
          <div className="px-4 py-3 border-b border-[var(--color-border-tertiary)] flex-shrink-0">
            <div className="text-[12px] font-medium text-[var(--color-text-primary)]">At a glance</div>
          </div>
          <div className="flex-1 overflow-auto px-4 py-1">
            <GlancePanel items={glanceItems} loading={loading} />
          </div>
        </div>

      </div>
    </div>
  );
}
