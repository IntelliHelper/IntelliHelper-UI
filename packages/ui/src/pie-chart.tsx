"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  useMemo,
} from "react";
import { cn } from "@intelli/utils";
import {
  chartColorAt,
  donutSegments,
  normalizeSeries,
  type ChartDatum,
} from "./chart-utils";

const pieChartVariants = cva("relative flex min-w-0 flex-col gap-3", {
  variants: {
    variant: {
      chrome: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-4",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_52%,transparent)]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
        "shadow-[var(--glass-chrome-shadow)]",
      ],
      outline: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-4",
        "bg-transparent",
      ],
      bare: "p-0",
    },
  },
  defaultVariants: {
    variant: "chrome",
  },
});

export type PieDatum = ChartDatum & { color?: string };

export interface PieChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof pieChartVariants> {
  data: Array<number | PieDatum>;
  size?: number;
  padAngleDeg?: number;
  label?: string;
  showLegend?: boolean;
  colors?: string[];
}

const PieChart = forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      className,
      variant,
      data,
      size = 160,
      padAngleDeg = 1.5,
      label = "Pie chart",
      showLegend = true,
      colors,
      ...props
    },
    ref,
  ) => {
    const series = useMemo(() => {
      return (data ?? []).map((item, i) => {
        if (typeof item === "number") {
          return { value: item, color: chartColorAt(i, colors) };
        }
        return {
          label: item.label,
          value: item.value,
          color: item.color ?? chartColorAt(i, colors),
        };
      });
    }, [data, colors]);

    const cx = size / 2;
    const cy = size / 2;
    const outerRadius = size / 2 - 4;

    const segments = useMemo(
      () =>
        donutSegments(series, {
          cx,
          cy,
          outerRadius,
          innerRadius: 0,
          padAngle: (padAngleDeg * Math.PI) / 180,
        }),
      [series, cx, cy, outerRadius, padAngleDeg],
    );
    const empty = segments.length === 0;
    const normalized = normalizeSeries(series);

    return (
      <div
        ref={ref}
        data-slot="pie-chart"
        data-variant={variant}
        className={cn(pieChartVariants({ variant }), className)}
        {...props}
      >
        <div className="mx-auto" style={{ width: size, maxWidth: "100%" }}>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="h-auto w-full"
            role="img"
            aria-label={label}
            data-empty={empty || undefined}
          >
            <title>{label}</title>
            {empty ? (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground"
                fontSize={11}
              >
                No data
              </text>
            ) : (
              segments.map((seg) => (
                <path
                  key={seg.index}
                  data-slot="pie-chart-segment"
                  d={seg.path}
                  fill={
                    series[seg.index]?.color ?? chartColorAt(seg.index, colors)
                  }
                >
                  <title>
                    {seg.label ?? `Segment ${seg.index + 1}`}:{" "}
                    {seg.percent.toFixed(1)}%
                  </title>
                </path>
              ))
            )}
          </svg>
        </div>
        {showLegend && !empty ? (
          <ul
            data-slot="pie-chart-legend"
            className="flex flex-col gap-1.5 text-xs"
          >
            {segments.map((seg) => (
              <li
                key={seg.index}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{
                      background:
                        series[seg.index]?.color ??
                        chartColorAt(seg.index, colors),
                    }}
                  />
                  <span className="truncate text-[var(--glass-chrome-fg)]">
                    {seg.label ??
                      normalized[seg.index]?.label ??
                      `Item ${seg.index + 1}`}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {seg.percent.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);
PieChart.displayName = "PieChart";

export { PieChart, pieChartVariants };
