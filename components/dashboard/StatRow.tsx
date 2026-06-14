"use client";

// components/dashboard/StatRow.tsx

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: string | number;
  sub: string;
  delta?: string;
  muted?: boolean;
};

type Props = { stats: Stat[]; loading?: boolean };

function Skeleton() {
  return (
    <div className="flex-1 px-5 py-4 border-r border-[var(--color-border-tertiary)] last:border-r-0 animate-pulse">
      <div className="h-2.5 w-24 rounded bg-[var(--color-background-secondary)] mb-3" />
      <div className="h-8 w-14 rounded bg-[var(--color-background-secondary)] mb-2" />
      <div className="h-2 w-32 rounded bg-[var(--color-background-secondary)]" />
    </div>
  );
}

export default function StatRow({ stats, loading }: Props) {
  if (loading) {
    return (
      <div className="flex border-b border-[var(--color-border-tertiary)] flex-shrink-0">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="flex border-b border-[var(--color-border-tertiary)] flex-shrink-0">
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex-1 px-5 py-4 border-r border-[var(--color-border-tertiary)] last:border-r-0"
        >
          <div className="text-[10px] text-[var(--color-text-tertiary)] tracking-wide mb-1.5">
            {s.label}
          </div>
          <div
            className={cn(
              "font-medium leading-none tracking-tight mb-1.5",
              s.muted
                ? "text-[16px] text-[var(--color-text-tertiary)] mt-1"
                : "text-[30px] text-[var(--color-text-primary)]"
            )}
          >
            {s.value}
          </div>
          <div className="text-[10px] text-[var(--color-text-tertiary)] leading-relaxed">
            {s.sub}
          </div>
          {s.delta && (
            <div className="inline-flex items-center gap-1 text-[10px] text-[#0F6E56] mt-1.5">
              <TrendingUp size={10} aria-hidden="true" />
              {s.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
