"use client";

// components/dashboard/TrendChart.tsx
//
// Root cause of width(-1) height(-1):
// ResponsiveContainer uses ResizeObserver internally but fires BEFORE
// the flex parent has settled its dimensions. We bypass it entirely
// by measuring the container ourselves with a ResizeObserver + setTimeout
// fallback, then pass explicit px width/height to BarChart.

import { useRef, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type DataPoint = {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
};
type Props = { data: DataPoint[]; loading?: boolean };

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-secondary)",
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 11,
        minWidth: 130,
      }}
    >
      <div
        style={{
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "2px 0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: p.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "var(--color-text-secondary)",
                textTransform: "capitalize",
              }}
            >
              {p.name}
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrendChart({ data, loading }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const measure = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r && r.width > 10 && r.height > 10) {
        setSize({ w: Math.floor(r.width), h: Math.floor(r.height) });
      }
    };
    measure();
    // Double RAF ensures flex layout has fully painted before measuring
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure));
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}
    >
      {size && !loading && (
        <BarChart
          width={size.w}
          height={size.h}
          data={data}
          barGap={2}
          barCategoryGap="28%"
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="none"
            stroke="var(--color-border-tertiary)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }}
            dy={4}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }}
            width={32}
            tickCount={5}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "var(--color-border-tertiary)",
              opacity: 0.4,
              radius: 4,
            }}
          />
          <Bar
            dataKey="total"
            name="Total"
            fill="#0F6E56"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="completed"
            name="Completed"
            fill="#378ADD"
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="cancelled"
            name="Cancelled"
            fill="#F09595"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      )}
      {size && loading && (
        <div
          style={{
            width: size.w,
            height: size.h,
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            padding: "0 8px 24px 40px",
          }}
        >
          {[60, 80, 50, 95, 75, 40, 30].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                height: "100%",
              }}
            >
              {[1, 0.7, 0.2].map((op, j) => (
                <div
                  key={j}
                  style={{
                    flex: 1,
                    borderRadius: "3px 3px 0 0",
                    background: "var(--color-background-secondary)",
                    height: `${h * op}%`,
                    opacity: op,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
