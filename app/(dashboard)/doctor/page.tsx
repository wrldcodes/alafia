"use client";

// app/(dashboard)/doctor/page.tsx

import {
  type AppointmentStatus,
  useDoctorDashboard,
} from "@/hooks/useDashboard";
import { format } from "date-fns";
import { RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; label: string; bar: string }
> = {
  CONFIRMED: {
    bg: "bg-[#E1F5EE]",
    text: "text-[#085041]",
    label: "Confirmed",
    bar: "#0F6E56",
  },
  PENDING: {
    bg: "bg-[#FAEEDA]",
    text: "text-[#633806]",
    label: "Pending",
    bar: "#EF9F27",
  },
  COMPLETED: {
    bg: "bg-[#E6F1FB]",
    text: "text-[#0C447C]",
    label: "Completed",
    bar: "#378ADD",
  },
  CANCELLED: {
    bg: "bg-[#FCEBEB]",
    text: "text-[#7A1F1F]",
    label: "Cancelled",
    bar: "#E24B4A",
  },
  NO_SHOW: {
    bg: "bg-[#EEEDFE]",
    text: "text-[#3C3489]",
    label: "No show",
    bar: "#8B5CF6",
  },
};

const AV = [
  "bg-[#E1F5EE] text-[#085041]",
  "bg-[#EEEDFE] text-[#3C3489]",
  "bg-[#E6F1FB] text-[#0C447C]",
  "bg-[#FAECE7] text-[#712B13]",
  "bg-[#EAF3DE] text-[#27500A]",
];
function avCol(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AV[Math.abs(h) % AV.length];
}

export default function DoctorDashboardPage() {
  const { data, loading, error, refetch } = useDoctorDashboard();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-[13px] text-[var(--color-text-tertiary)] mb-3">
            {error}
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] border border-[var(--color-border-secondary)] text-[11px] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] transition-colors"
          >
            <RefreshCw size={11} />
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
  const schedule = data?.lists.todaySchedule ?? [];
  const next = data?.lists.nextAppointment ?? null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* KPI strip */}
      <div className="flex border-b border-[var(--color-border-tertiary)] flex-shrink-0">
        {[
          {
            label: "Appointments today",
            value: loading ? "—" : (stats?.totalAppointmentsToday ?? 0),
            sub: `${byStatus.CONFIRMED ?? 0} confirmed · ${byStatus.PENDING ?? 0} pending`,
          },
          {
            label: "Completed today",
            value: loading ? "—" : (byStatus.COMPLETED ?? 0),
            sub: "Visits done",
          },
          {
            label: "Patients this week",
            value: loading ? "—" : (stats?.patientsSeenThisWeek ?? 0),
            sub: "Unique patients seen",
          },
          {
            label: "Records this week",
            value: loading ? "—" : (stats?.recordsCreatedThisWeek ?? 0),
            sub: "Medical records created",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex-1 px-5 py-4 border-r border-[var(--color-border-tertiary)] last:border-r-0"
          >
            <div className="text-[10px] text-[var(--color-text-tertiary)] mb-1.5">
              {s.label}
            </div>
            <div className="text-[30px] font-medium text-[var(--color-text-primary)] leading-none tracking-tight mb-1.5">
              {s.value}
            </div>
            <div className="text-[10px] text-[var(--color-text-tertiary)]">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Schedule */}
        <div className="flex-1 flex flex-col border-r border-[var(--color-border-tertiary)] overflow-hidden">
          <div className="flex items-baseline justify-between px-5 py-3 border-b border-[var(--color-border-tertiary)] flex-shrink-0">
            <div className="text-[12px] font-medium text-[var(--color-text-primary)]">
              {"Today's schedule"}
            </div>
            <span className="text-[10px] text-[var(--color-text-tertiary)]">
              {schedule.length} appointments
            </span>
          </div>
          <div className="flex-1 overflow-auto px-5 py-1">
            {loading ? (
              <div className="flex flex-col gap-3 pt-3 animate-pulse">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-2.5 rounded bg-[var(--color-background-secondary)]" />
                    <div className="w-7 h-7 rounded-full bg-[var(--color-background-secondary)]" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 w-28 rounded bg-[var(--color-background-secondary)]" />
                      <div className="h-2 w-20 rounded bg-[var(--color-background-secondary)]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : schedule.length === 0 ? (
              <div className="py-10 text-center text-[12px] text-[var(--color-text-tertiary)]">
                No appointments today
              </div>
            ) : (
              <div className="flex flex-col">
                {schedule.map((appt) => {
                  const name = `${appt.patient.firstName} ${appt.patient.lastName}`;
                  const s = STATUS_STYLE[appt.status];
                  const isNext = next?.id === appt.id;
                  return (
                    <div
                      key={appt.id}
                      className={cn(
                        "grid items-center gap-3 py-[9px] border-b border-[var(--color-border-tertiary)] last:border-b-0 transition-colors",
                        isNext && "bg-[#E1F5EE] -mx-5 px-5",
                      )}
                      style={{ gridTemplateColumns: "44px 28px 1fr auto auto" }}
                    >
                      <div className="text-[11px] font-medium text-[var(--color-text-primary)] tabular-nums">
                        {format(new Date(appt.slot.startTime), "HH:mm")}
                      </div>
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0",
                          avCol(name),
                        )}
                      >
                        {name[0]}
                        {appt.patient.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">
                          {name}
                        </div>
                        <div className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                          {appt.reason}
                        </div>
                      </div>
                      {isNext && (
                        <div className="text-[9px] font-semibold text-[#0F6E56] bg-white px-1.5 py-0.5 rounded-[3px] flex-shrink-0">
                          Next
                        </div>
                      )}
                      <div
                        className={cn(
                          "text-[9px] font-semibold px-1.5 py-0.5 rounded-[3px] flex-shrink-0",
                          s?.bg,
                          s?.text,
                        )}
                      >
                        {s?.label ?? appt.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{ width: 220 }}
        >
          {/* Next patient */}
          <div className="border-b border-[var(--color-border-tertiary)] p-4 flex-shrink-0">
            <div className="text-[11px] font-medium text-[var(--color-text-primary)] mb-3">
              Next patient
            </div>
            {loading ? (
              <div className="space-y-2 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-[var(--color-background-secondary)]" />
                <div className="h-3 w-24 rounded bg-[var(--color-background-secondary)]" />
                <div className="h-2 w-32 rounded bg-[var(--color-background-secondary)]" />
              </div>
            ) : next ? (
              <div className="space-y-2">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold",
                    avCol(`${next.patient.firstName} ${next.patient.lastName}`),
                  )}
                >
                  {next.patient.firstName[0]}
                  {next.patient.lastName[0]}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[var(--color-text-primary)]">
                    {next.patient.firstName} {next.patient.lastName}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                    {next.reason}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#0F6E56]">
                  <Clock size={11} aria-hidden="true" />
                  {format(new Date(next.slot.startTime), "HH:mm")} ·{" "}
                  {next.slot.duration}min
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-[var(--color-text-tertiary)]">
                No upcoming appointments
              </div>
            )}
          </div>

          {/* Status breakdown */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="text-[11px] font-medium text-[var(--color-text-primary)] mb-3">
              {"Today's breakdown"}
            </div>
            <div className="flex flex-col">
              {Object.entries(STATUS_STYLE).map(([key, s]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-[6px] border-b border-[var(--color-border-tertiary)] last:border-b-0"
                >
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
                    <div
                      className="w-[3px] h-[12px] rounded-full flex-shrink-0"
                      style={{ background: s.bar }}
                    />
                    {s.label}
                  </div>
                  <span className="text-[11px] font-medium text-[var(--color-text-primary)]">
                    {byStatus[key as keyof typeof byStatus] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
