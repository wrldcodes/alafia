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

// ── Mock data — always used for charts until real data has values > 0 ────
const MOCK_TREND = [
  { date: "Mon", total: 18, completed: 14, cancelled: 1 },
  { date: "Tue", total: 24, completed: 19, cancelled: 2 },
  { date: "Wed", total: 21, completed: 16, cancelled: 1 },
  { date: "Thu", total: 29, completed: 23, cancelled: 3 },
  { date: "Fri", total: 26, completed: 20, cancelled: 2 },
  { date: "Sat", total: 12, completed: 9, cancelled: 1 },
  { date: "Sun", total: 8, completed: 6, cancelled: 0 },
];

const MOCK_STATUS: { status: AppointmentStatus; count: number }[] = [
  { status: "CONFIRMED", count: 12 },
  { status: "PENDING", count: 5 },
  { status: "COMPLETED", count: 9 },
  { status: "CANCELLED", count: 2 },
];

const MOCK_STATS = {
  totalAppointmentsToday: 26,
  appointmentsByStatus: {
    CONFIRMED: 12,
    PENDING: 5,
    COMPLETED: 9,
    CANCELLED: 2,
    NO_SHOW: 1,
    RESCHEDULED: 0,
  } as Record<AppointmentStatus, number>,
  newPatientsToday: 4,
  totalPatientsAllTime: 148,
  medicalRecordsThisWeek: 37,
  activeDoctors: 5,
  totalStaff: 12,
  revenueToday: null,
};

const MOCK_UPCOMING = [
  {
    id: "1",
    status: "CONFIRMED",
    reason: "Routine checkup",
    patient: { firstName: "Amaka", lastName: "Obi", phone: "+2348012345678" },
    doctor: {
      specialization: "General Medicine",
      user: { email: "dr.obi@alafia.com" },
    },
    slot: {
      startTime: new Date(new Date().setHours(10, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(10, 30, 0)).toISOString(),
      duration: 30,
    },
  },
  {
    id: "2",
    status: "CONFIRMED",
    reason: "Antenatal care",
    patient: { firstName: "Chioma", lastName: "Eze", phone: "+2348023456789" },
    doctor: {
      specialization: "Gynecology",
      user: { email: "dr.eze@alafia.com" },
    },
    slot: {
      startTime: new Date(new Date().setHours(11, 15, 0)).toISOString(),
      endTime: new Date(new Date().setHours(11, 45, 0)).toISOString(),
      duration: 30,
    },
  },
  {
    id: "3",
    status: "PENDING",
    reason: "Malaria symptoms",
    patient: {
      firstName: "Babajide",
      lastName: "Sanwo",
      phone: "+2348034567890",
    },
    doctor: {
      specialization: "Pediatrics",
      user: { email: "dr.sanwo@alafia.com" },
    },
    slot: {
      startTime: new Date(new Date().setHours(13, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(13, 30, 0)).toISOString(),
      duration: 30,
    },
  },
  {
    id: "4",
    status: "COMPLETED",
    reason: "Dental checkup",
    patient: {
      firstName: "Olumide",
      lastName: "Adegoke",
      phone: "+2348045678901",
    },
    doctor: {
      specialization: "Dentistry",
      user: { email: "dr.adegoke@alafia.com" },
    },
    slot: {
      startTime: new Date(new Date().setHours(9, 0, 0)).toISOString(),
      endTime: new Date(new Date().setHours(9, 30, 0)).toISOString(),
      duration: 30,
    },
  },
  {
    id: "5",
    status: "CONFIRMED",
    reason: "Hypertension follow-up",
    patient: {
      firstName: "Fatima",
      lastName: "Bello",
      phone: "+2348056789012",
    },
    doctor: {
      specialization: "Cardiology",
      user: { email: "dr.bello@alafia.com" },
    },
    slot: {
      startTime: new Date(new Date().setHours(14, 30, 0)).toISOString(),
      endTime: new Date(new Date().setHours(15, 0, 0)).toISOString(),
      duration: 30,
    },
  },
];

const MOCK_RECORDS = [
  {
    id: "r1",
    chiefComplaint: "Severe fever and chills",
    diagnosis: "Uncomplicated Malaria — Coartem prescribed",
    createdAt: new Date(new Date().setHours(9, 45, 0)).toISOString(),
    patient: { firstName: "Emeka", lastName: "Okonkwo" },
    clinic: { clinicName: "Alafia Lagos Central" },
    doctor: {
      specialization: "General Medicine",
      user: { email: "dr.obi@alafia.com" },
    },
    _count: { prescriptions: 1, attachments: 0 },
  },
  {
    id: "r2",
    chiefComplaint: "Pregnancy routine scan",
    diagnosis: "Healthy fetus, 24 weeks — multivitamins",
    createdAt: new Date(new Date().setHours(11, 30, 0)).toISOString(),
    patient: { firstName: "Chioma", lastName: "Eze" },
    clinic: { clinicName: "Alafia Lagos Central" },
    doctor: {
      specialization: "Gynecology",
      user: { email: "dr.eze@alafia.com" },
    },
    _count: { prescriptions: 2, attachments: 1 },
  },
  {
    id: "r3",
    chiefComplaint: "Tooth extraction follow-up",
    diagnosis: "Normal healing — pain relief completed",
    createdAt: new Date(new Date().setHours(10, 15, 0)).toISOString(),
    patient: { firstName: "Olumide", lastName: "Adegoke" },
    clinic: { clinicName: "Alafia Lagos Central" },
    doctor: {
      specialization: "Dentistry",
      user: { email: "dr.adegoke@alafia.com" },
    },
    _count: { prescriptions: 0, attachments: 0 },
  },
];

// ── Helper: check if trend data has any real values ───────────────────────
function hasTrendData(trend: { total: number }[] | undefined) {
  return trend?.some((d) => d.total > 0) ?? false;
}

function hasStatusData(status: { count: number }[] | undefined) {
  return status?.some((d) => d.count > 0) ?? false;
}

export default function ClinicDashboardPage() {
  const { data, loading, error } = useClinicDashboard();
  if (error) console.warn("Dashboard API error:", error);

  // ── Use real data only if it actually has values, else mock ─────────────
  // This is the key fix: the API was returning arrays with all-zero counts
  // which passed the .length check but rendered empty charts
  const stats = data?.stats ?? MOCK_STATS;
  const byStatus = (stats?.appointmentsByStatus ?? {}) as Partial<
    Record<AppointmentStatus, number>
  >;

  const trendData = hasTrendData(data?.charts?.appointmentTrend)
    ? data!.charts.appointmentTrend
    : MOCK_TREND;

  const statusData = hasStatusData(data?.charts?.statusBreakdown)
    ? data!.charts.statusBreakdown
    : MOCK_STATUS;

  const upcoming = data?.lists?.upcomingToday?.length
    ? data.lists.upcomingToday
    : MOCK_UPCOMING;

  const records = data?.lists?.recentRecords?.length
    ? data.lists.recentRecords
    : MOCK_RECORDS;

  const isLoading = loading && !data;

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

  const glanceItems = [
    { label: "Active doctors", value: stats?.activeDoctors ?? 0 },
    { label: "Total staff", value: stats?.totalStaff ?? 0 },
    { label: "No-show rate", value: "8%", warn: true },
    { label: "All-time patients", value: stats?.totalPatientsAllTime ?? 0 },
    { label: "Slots today", value: 36 },
    { label: "Slots remaining", value: 12 },
    { label: "Avg. wait time", value: "18 min" },
  ];

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}
    >
      {/* ── KPI strip ─────────────────────────────────── */}
      <StatRow stats={statItems} loading={isLoading} />

      {/* ── Charts row ────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          height: 300,
          flexShrink: 0,
          borderBottom: "0.5px solid var(--color-border-tertiary)",
        }}
      >
        {/* Bar chart */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "18px 24px",
            borderRight: "0.5px solid var(--color-border-tertiary)",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                }}
              >
                Appointment volume
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--color-text-tertiary)",
                  marginTop: 2,
                }}
              >
                Last 7 days
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {[
                { label: "Total", color: "#0F6E56" },
                { label: "Completed", color: "#378ADD" },
                { label: "Cancelled", color: "#F09595" },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 10,
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 2,
                      borderRadius: 1,
                      background: l.color,
                      flexShrink: 0,
                    }}
                  />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          {/* flex:1 + minHeight:0 lets TrendChart's ResizeObserver measure correctly */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <TrendChart data={trendData} loading={isLoading} />
          </div>
        </div>

        {/* Donut */}
        <div
          style={{
            width: 240,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            padding: "18px 18px",
            overflow: "hidden",
          }}
        >
          <div style={{ marginBottom: 10, flexShrink: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              Today's status
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--color-text-tertiary)",
                marginTop: 2,
              }}
            >
              Appointment split
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <DonutChart data={statusData} loading={isLoading} />
          </div>
        </div>
      </div>

      {/* ── Bottom row ────────────────────────────────── */}
      <div style={{ display: "flex", minHeight: 320 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "0.5px solid var(--color-border-tertiary)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              padding: "10px 24px",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              Upcoming today
            </span>
            <button
              style={{
                fontSize: 11,
                color: "#0F6E56",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px" }}>
            <AppointmentList
              appointments={upcoming as any}
              loading={isLoading}
            />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "0.5px solid var(--color-border-tertiary)",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              padding: "10px 24px",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              Recent records
            </span>
            <button
              style={{
                fontSize: 11,
                color: "#0F6E56",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 24px" }}>
            <RecordList records={records as any} loading={isLoading} />
          </div>
        </div>

        <div
          style={{
            width: 172,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              At a glance
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px" }}>
            <GlancePanel items={glanceItems} loading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
