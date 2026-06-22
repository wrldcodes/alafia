"use client";

// components/dashboard/DonutChart.tsx

import { useRef, useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

type Item = { status: string; count: number };
type Props = { data: Item[]; loading?: boolean };

const COLORS: Record<string, string> = {
  CONFIRMED: "#0F6E56",
  PENDING: "#EF9F27",
  COMPLETED: "#378ADD",
  CANCELLED: "#E24B4A",
  NO_SHOW: "#8B5CF6",
  RESCHEDULED: "#6B7280",
};

const LABELS: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No show",
  RESCHEDULED: "Rescheduled",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    payload: Item;
  }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const status = item?.payload?.status;
  const color = COLORS[status] ?? "#6B7280";
  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-secondary)",
        borderRadius: 6,
        padding: "6px 10px",
        fontSize: 11,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{ width: 8, height: 8, borderRadius: 2, background: color }}
        />
        <span style={{ color: "var(--color-text-secondary)" }}>
          {LABELS[status] ?? status}
        </span>
        <span
          style={{
            fontWeight: 500,
            color: "var(--color-text-primary)",
            marginLeft: 4,
          }}
        >
          {item.value}
        </span>
      </div>
    </div>
  );
}

const DONUT_HEIGHT = 120;

export default function DonutChart({ data, loading }: Props) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [ringW, setRingW] = useState(0);

  useEffect(() => {
    if (!ringRef.current) return;
    const measure = () => {
      const r = ringRef.current?.getBoundingClientRect();
      if (r && r.width > 10) setRingW(Math.floor(r.width));
    };
    measure();
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    const ro = new ResizeObserver(measure);
    ro.observe(ringRef.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const total = data.reduce((s, d) => s + d.count, 0);

  // Build recharts-friendly data with fill baked in
  // This is the key fix — recharts Cell needs fill on the data item
  // OR explicitly on the Cell component. We do both to be safe.
  const chartData = data.map((d) => ({
    ...d,
    fill: COLORS[d.status] ?? "#6B7280",
    name: LABELS[d.status] ?? d.status,
  }));

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "8px solid var(--color-background-secondary)",
          }}
        />
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                height: 8,
                width: 60,
                borderRadius: 4,
                background: "var(--color-background-secondary)",
              }}
            />
            <div
              style={{
                height: 8,
                width: 24,
                borderRadius: 4,
                background: "var(--color-background-secondary)",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Donut ring */}
      <div
        ref={ringRef}
        style={{ position: "relative", height: DONUT_HEIGHT, flexShrink: 0 }}
      >
        {ringW > 0 && (
          <PieChart width={ringW} height={DONUT_HEIGHT}>
            <Pie
              data={chartData}
              dataKey="count"
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={48}
              paddingAngle={2}
              strokeWidth={0}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        )}
        {/* Centre total */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "var(--color-text-primary)",
              lineHeight: 1,
            }}
          >
            {total}
          </span>
          <span
            style={{
              fontSize: 9,
              color: "var(--color-text-tertiary)",
              marginTop: 2,
            }}
          >
            total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        {chartData.map((d) => {
          const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
          return (
            <div
              key={d.status}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "4px 0",
                borderBottom: "0.5px solid var(--color-border-tertiary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 3,
                    height: 12,
                    borderRadius: 2,
                    background: d.fill,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{ fontSize: 11, color: "var(--color-text-secondary)" }}
                >
                  {d.name}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {d.count}
                </span>
                <span
                  style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
