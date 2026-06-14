"use client";

// components/dashboard/GlancePanel.tsx

import { cn } from "@/lib/utils";

type Item = {
  label: string;
  value: string | number;
  warn?: boolean;
};

type Props = { items: Item[]; loading?: boolean };

function Skeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-baseline justify-between py-[7px] border-b border-[var(--color-border-tertiary)] last:border-b-0">
          <div className="h-2 w-24 rounded bg-[var(--color-background-secondary)]" />
          <div className="h-3 w-10 rounded bg-[var(--color-background-secondary)]" />
        </div>
      ))}
    </div>
  );
}

export default function GlancePanel({ items, loading }: Props) {
  if (loading) return <Skeleton />;

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-baseline justify-between py-[7px] border-b border-[var(--color-border-tertiary)] last:border-b-0"
        >
          <span className="text-[10px] text-[var(--color-text-tertiary)]">
            {item.label}
          </span>
          <span
            className={cn(
              "text-[13px] font-medium tracking-tight",
              item.warn
                ? "text-[#E24B4A]"
                : "text-[var(--color-text-primary)]"
            )}
          >
            {item.value}
            {item.warn && (
              <span className="text-[9px] ml-0.5" aria-label="increasing">↑</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
