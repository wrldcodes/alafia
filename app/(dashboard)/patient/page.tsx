"use client";

// app/(dashboard)/patient/page.tsx

import { usePatientDashboard } from "@/hooks/useDashboard";
import { format } from "date-fns";
import { RefreshCw, Calendar, FileText, Pill, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  CONFIRMED: { bg: "bg-[#E1F5EE]", text: "text-[#085041]", label: "Confirmed" },
  PENDING: { bg: "bg-[#FAEEDA]", text: "text-[#633806]", label: "Pending" },
  COMPLETED: { bg: "bg-[#E6F1FB]", text: "text-[#0C447C]", label: "Completed" },
  CANCELLED: { bg: "bg-[#FCEBEB]", text: "text-[#7A1F1F]", label: "Cancelled" },
};

export default function PatientDashboardPage() {
  const { data, loading, error, refetch } = usePatientDashboard();

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
  const next = data?.lists.nextAppointment ?? null;
  const upcoming = data?.lists.upcomingAppointments ?? [];
  const records = data?.lists.recentRecords ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* KPI strip */}
      <div className="flex border-b border-[var(--color-border-tertiary)] flex-shrink-0">
        {[
          {
            label: "Total visits",
            value: loading ? "—" : (stats?.totalVisits ?? 0),
            sub: "Completed appointments",
            icon: Calendar,
          },
          {
            label: "Active prescriptions",
            value: loading ? "—" : (stats?.activePrescriptions ?? 0),
            sub: "Current medications",
            icon: Pill,
          },
          {
            label: "Medical records",
            value: loading ? "—" : (stats?.totalRecords ?? 0),
            sub: "Across all clinics",
            icon: FileText,
          },
          {
            label: "Upcoming",
            value: loading ? "—" : (stats?.upcomingAppointmentsCount ?? 0),
            sub: "Booked appointments",
            icon: Calendar,
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
        {/* Next appointment — featured */}
        <div
          className="flex flex-col border-r border-[var(--color-border-tertiary)] overflow-hidden flex-shrink-0"
          style={{ width: 260 }}
        >
          <div className="px-5 py-3 border-b border-[var(--color-border-tertiary)] flex-shrink-0">
            <div className="text-[12px] font-medium text-[var(--color-text-primary)]">
              Next appointment
            </div>
          </div>
          <div className="flex-1 px-5 py-5">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 w-20 rounded bg-[var(--color-background-secondary)]" />
                <div className="h-5 w-32 rounded bg-[var(--color-background-secondary)]" />
                <div className="h-2.5 w-28 rounded bg-[var(--color-background-secondary)]" />
              </div>
            ) : next ? (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mb-1">
                    {format(new Date(next.slot.date), "EEE, MMM d yyyy")}
                  </div>
                  <div className="text-[22px] font-medium text-[var(--color-text-primary)] tracking-tight leading-none">
                    {format(new Date(next.slot.startTime), "h:mm a")}
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--color-border-tertiary)]">
                  <div className="text-[12px] font-medium text-[var(--color-text-primary)]">
                    {next.clinic.clinicName}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                    {next.clinic.address}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--color-text-secondary)]">
                    {next.doctor.specialization}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5 truncate">
                    {next.doctor.user.email}
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--color-border-tertiary)]">
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mb-1">
                    Reason
                  </div>
                  <div className="text-[11px] text-[var(--color-text-primary)]">
                    {next.reason}
                  </div>
                </div>
                <div
                  className={cn(
                    "inline-flex self-start text-[10px] font-semibold px-2 py-1 rounded-[4px]",
                    STATUS_STYLE[next.status]?.bg,
                    STATUS_STYLE[next.status]?.text,
                  )}
                >
                  {STATUS_STYLE[next.status]?.label ?? next.status}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3 pt-2">
                <div className="text-[12px] text-[var(--color-text-tertiary)]">
                  No upcoming appointments
                </div>
                <Link
                  href="/clinics"
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#0F6E56] hover:text-[#085041] transition-colors"
                >
                  Find a clinic <ArrowRight size={11} aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          {/* More upcoming */}
          {upcoming.length > 1 && (
            <div className="border-t border-[var(--color-border-tertiary)] px-5 py-3 flex-shrink-0">
              <div className="text-[10px] text-[var(--color-text-tertiary)] mb-2">
                Also upcoming
              </div>
              <div className="flex flex-col gap-1.5">
                {upcoming.slice(1, 3).map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="text-[11px] text-[var(--color-text-primary)]">
                      {format(new Date(a.slot.startTime), "MMM d · h:mm a")}
                    </div>
                    <div
                      className={cn(
                        "text-[9px] font-semibold px-1.5 py-0.5 rounded-[3px]",
                        STATUS_STYLE[a.status]?.bg,
                        STATUS_STYLE[a.status]?.text,
                      )}
                    >
                      {STATUS_STYLE[a.status]?.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Medical records */}
        <div className="flex-1 flex flex-col border-r border-[var(--color-border-tertiary)] overflow-hidden">
          <div className="flex items-baseline justify-between px-5 py-3 border-b border-[var(--color-border-tertiary)] flex-shrink-0">
            <div className="text-[12px] font-medium text-[var(--color-text-primary)]">
              Recent records
            </div>
            <Link
              href="/patient/records"
              className="text-[11px] text-[#0F6E56] hover:text-[#085041] transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="flex-1 overflow-auto px-5 py-1">
            {loading ? (
              <div className="flex flex-col gap-3 pt-3 animate-pulse">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-2.5 w-32 rounded bg-[var(--color-background-secondary)]" />
                    <div className="h-2 w-48 rounded bg-[var(--color-background-secondary)]" />
                  </div>
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="py-10 text-center text-[12px] text-[var(--color-text-tertiary)]">
                No medical records yet
              </div>
            ) : (
              <div className="flex flex-col">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="grid items-start gap-3 py-[9px] border-b border-[var(--color-border-tertiary)] last:border-b-0"
                    style={{ gridTemplateColumns: "1fr auto" }}
                  >
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-[var(--color-text-primary)] truncate">
                        {r.diagnosis}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-tertiary)] truncate mt-0.5">
                        {r.chiefComplaint}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-[var(--color-text-tertiary)]">
                          {r.clinic.clinicName}
                        </span>
                        {r._count.prescriptions > 0 && (
                          <span className="text-[9px] text-[var(--color-text-tertiary)]">
                            · {r._count.prescriptions} Rx
                          </span>
                        )}
                        {r._count.attachments > 0 && (
                          <span className="text-[9px] text-[var(--color-text-tertiary)]">
                            · {r._count.attachments} files
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)] tabular-nums flex-shrink-0">
                      {format(new Date(r.createdAt), "MMM d")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{ width: 180 }}
        >
          <div className="px-4 py-3 border-b border-[var(--color-border-tertiary)] flex-shrink-0">
            <div className="text-[11px] font-medium text-[var(--color-text-primary)]">
              Quick actions
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-2">
            {[
              { label: "Book appointment", href: "/clinics", icon: Calendar },
              {
                label: "My prescriptions",
                href: "/patient/prescriptions",
                icon: Pill,
              },
              {
                label: "Medical history",
                href: "/patient/records",
                icon: FileText,
              },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between px-3 py-2.5 rounded-[6px] bg-[var(--color-background-secondary)] hover:bg-[var(--color-background-tertiary)] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <a.icon
                    size={12}
                    className="text-[var(--color-text-tertiary)]"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-[var(--color-text-primary)]">
                    {a.label}
                  </span>
                </div>
                <ArrowRight
                  size={10}
                  className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
