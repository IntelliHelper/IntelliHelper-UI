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

const donutChartVariants = cva("relative flex min-w-0 flex-col gap-3", {
  variants: {
    variant: {
      chrome: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-4",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_52%, var(--glass-mix-into))]",
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

export type DonutDatum = ChartDatum & { color?: string };

export interface DonutChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof donutChartVariants> {
  data: Array<number | DonutDatum>;
  /** Outer diameter in SVG units (default 160) */
  size?: number;
  /** Inner hole as fraction of outer radius 0–1 (default 0.58) */
  thickness?: number;
  /** Gap between slices in degrees (default 2) */
  padAngleDeg?: number;
  label?: string;
  /** Optional center label (e.g. total) */
  centerLabel?: string;
  centerValue?: string;
  /** Show legend list under the chart */
  showLegend?: boolean;
  colors?: string[];
}

const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      className,
      variant,
      data,
      size = 160,
      thickness = 0.58,
      padAngleDeg = 2,
      label = "Donut chart",
      centerLabel,
      centerValue,
      showLegend = true,
      colors,
      ...props
    },
    ref,
  ) => {
    const series = useMemo(() => {
      const raw = data ?? [];
      return raw.map((item, i) => {
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
    const innerRadius = outerRadius * Math.min(0.92, Math.max(0, thickness));

    const segments = useMemo(
      () =>
        donutSegments(series, {
          cx,
          cy,
          outerRadius,
          innerRadius,
          padAngle: (padAngleDeg * Math.PI) / 180,
        }),
      [series, cx, cy, outerRadius, innerRadius, padAngleDeg],
    );

    const empty = segments.length === 0;
    const normalized = normalizeSeries(series);

    return (
      <div
        ref={ref}
        data-slot="donut-chart"
        data-variant={variant}
        className={cn(donutChartVariants({ variant }), className)}
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
              <>
                <circle
                  cx={cx}
                  cy={cy}
                  r={outerRadius}
                  fill="none"
                  stroke="var(--glass-chrome-border)"
                  strokeWidth={outerRadius - innerRadius}
                />
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
              </>
            ) : (
              <>
                {segments.map((seg) => (
                  <path
                    key={seg.index}
                    data-slot="donut-chart-segment"
                    data-index={seg.index}
                    d={seg.path}
                    fill={
                      series[seg.index]?.color ?? chartColorAt(seg.index, colors)
                    }
                    stroke="transparent"
                  >
                    <title>
                      {seg.label ?? `Segment ${seg.index + 1}`}:{" "}
                      {seg.percent.toFixed(1)}%
                    </title>
                  </path>
                ))}
                {(centerValue || centerLabel) && (
                  <g data-slot="donut-chart-center">
                    {centerValue ? (
                      <text
                        x={cx}
                        y={centerLabel ? cy - 6 : cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-[var(--glass-chrome-fg)]"
                        fontSize={size * 0.12}
                        fontWeight={600}
                      >
                        {centerValue}
                      </text>
                    ) : null}
                    {centerLabel ? (
                      <text
                        x={cx}
                        y={centerValue ? cy + 12 : cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground"
                        fontSize={size * 0.07}
                      >
                        {centerLabel}
                      </text>
                    ) : null}
                  </g>
                )}
              </>
            )}
          </svg>
        </div>
        {showLegend && !empty ? (
          <ul
            data-slot="donut-chart-legend"
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
DonutChart.displayName = "DonutChart";

export { DonutChart, donutChartVariants };
