"use client";

// components/dashboard/AppointmentList.tsx

import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  status: string;
  reason: string;
  patient: { firstName: string; lastName: string; phone?: string | null };
  doctor: { specialization: string; user: { email: string } };
  slot: { startTime: string; endTime: string; duration: number };
};

type Props = { appointments: Appointment[]; loading?: boolean };

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "bg-[#E1F5EE] text-[#085041]",
  PENDING:   "bg-[#FAEEDA] text-[#633806]",
  COMPLETED: "bg-[#E6F1FB] text-[#0C447C]",
  CANCELLED: "bg-[#FCEBEB] text-[#7A1F1F]",
  NO_SHOW:   "bg-[#EEEDFE] text-[#3C3489]",
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING:   "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW:   "No show",
};

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

// Deterministic colour from name
const AV_COLOURS = [
  "bg-[#E1F5EE] text-[#085041]",
  "bg-[#EEEDFE] text-[#3C3489]",
  "bg-[#E6F1FB] text-[#0C447C]",
  "bg-[#FAECE7] text-[#712B13]",
  "bg-[#EAF3DE] text-[#27500A]",
  "bg-[#FAEEDA] text-[#633806]",
];

function avColour(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AV_COLOURS[Math.abs(h) % AV_COLOURS.length];
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-0 animate-pulse">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2.5 py-[7px] border-b border-[var(--color-border-tertiary)] last:border-b-0">
          <div className="w-7 h-7 rounded-full bg-[var(--color-background-secondary)] flex-shrink-0" />
          <div className="flex-1">
            <div className="h-2.5 w-28 rounded bg-[var(--color-background-secondary)] mb-1.5" />
            <div className="h-2 w-20 rounded bg-[var(--color-background-secondary)]" />
          </div>
          <div className="h-2.5 w-10 rounded bg-[var(--color-background-secondary)]" />
        </div>
      ))}
    </div>
  );
}

export default function AppointmentList({ appointments, loading }: Props) {
  if (loading) return <Skeleton />;

  if (appointments.length === 0) {
    return (
      <div className="py-8 text-center text-[12px] text-[var(--color-text-tertiary)]">
        No more appointments today
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {appointments.map((a) => {
        const name = `${a.patient.firstName} ${a.patient.lastName}`;
        const col = avColour(name);
        return (
          <div
            key={a.id}
            className="grid items-center gap-2.5 py-[7px] border-b border-[var(--color-border-tertiary)] last:border-b-0"
            style={{ gridTemplateColumns: "28px 1fr auto auto" }}
          >
            {/* Avatar */}
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0", col)}>
              {initials(a.patient.firstName, a.patient.lastName)}
            </div>

            {/* Info */}
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-[var(--color-text-primary)] truncate">{name}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)]">{a.doctor.specialization}</div>
            </div>

            {/* Time */}
            <div className="text-[11px] font-medium text-[var(--color-text-primary)] tabular-nums flex-shrink-0">
              {format(new Date(a.slot.startTime), "HH:mm")}
            </div>

            {/* Status */}
            <div className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-[3px] flex-shrink-0", STATUS_STYLE[a.status] ?? "bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)]")}>
              {STATUS_LABEL[a.status] ?? a.status}
            </div>
          </div>
        );
      })}
    </div>
  );
}
