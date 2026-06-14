"use client";

// components/dashboard/RecordList.tsx

import { format } from "date-fns";
import { FileText } from "lucide-react";

type Record_ = {
  id: string;
  diagnosis: string;
  chiefComplaint: string;
  createdAt: string;
  clinic: { clinicName: string };
  doctor: { specialization: string; user: { email: string } };
  _count: { prescriptions: number; attachments: number };
};

type Props = { records: Record_[]; loading?: boolean };

function Skeleton() {
  return (
    <div className="flex flex-col gap-0 animate-pulse">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="grid gap-2 py-[7px] border-b border-[var(--color-border-tertiary)] last:border-b-0" style={{ gridTemplateColumns: "28px 1fr" }}>
          <div className="w-7 h-7 rounded-[6px] bg-[var(--color-background-secondary)]" />
          <div>
            <div className="h-2.5 w-28 rounded bg-[var(--color-background-secondary)] mb-1.5" />
            <div className="h-2 w-40 rounded bg-[var(--color-background-secondary)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecordList({ records, loading }: Props) {
  if (loading) return <Skeleton />;

  if (records.length === 0) {
    return (
      <div className="py-8 text-center text-[12px] text-[var(--color-text-tertiary)]">
        No records yet this week
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {records.map((r) => (
        <div
          key={r.id}
          className="grid items-start gap-2.5 py-[7px] border-b border-[var(--color-border-tertiary)] last:border-b-0"
          style={{ gridTemplateColumns: "28px 1fr auto" }}
        >
          <div className="w-7 h-7 rounded-[6px] bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
            <FileText size={12} className="text-[#0F6E56]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[var(--color-text-primary)] truncate">
              {r.chiefComplaint}
            </div>
            <div className="text-[10px] text-[var(--color-text-tertiary)] truncate">
              {r.diagnosis}
            </div>
          </div>
          <div className="text-[10px] text-[var(--color-text-tertiary)] tabular-nums flex-shrink-0 pt-0.5">
            {format(new Date(r.createdAt), "HH:mm")}
          </div>
        </div>
      ))}
    </div>
  );
}
