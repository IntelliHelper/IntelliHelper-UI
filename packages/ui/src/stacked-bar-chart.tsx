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
  layoutStackedBars,
  type StackedBarSeries,
} from "./chart-utils";

const stackedBarChartVariants = cva("relative w-full min-w-0 overflow-hidden", {
  variants: {
    variant: {
      chrome: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-3",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_52%,transparent)]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
        "shadow-[var(--glass-chrome-shadow)]",
      ],
      outline: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-3",
        "bg-transparent",
      ],
      bare: "p-0",
    },
  },
  defaultVariants: {
    variant: "chrome",
  },
});

export interface StackedBarChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof stackedBarChartVariants> {
  /** Category labels (x-axis) */
  categories: string[];
  /** Named series stacked per category */
  series: StackedBarSeries[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  label?: string;
  colors?: string[];
  radius?: number;
}

const StackedBarChart = forwardRef<HTMLDivElement, StackedBarChartProps>(
  (
    {
      className,
      variant,
      categories,
      series,
      width = 320,
      height = 180,
      showGrid = true,
      showLabels = true,
      showLegend = true,
      label = "Stacked bar chart",
      colors,
      radius = 3,
      ...props
    },
    ref,
  ) => {
    const coloredSeries = useMemo(
      () =>
        series.map((s, i) => ({
          ...s,
          color: s.color ?? chartColorAt(i, colors),
        })),
      [series, colors],
    );

    const pad = useMemo(
      () => ({
        top: 12,
        right: 12,
        bottom: showLabels ? 28 : 12,
        left: 12,
      }),
      [showLabels],
    );

    const segments = useMemo(
      () => layoutStackedBars(categories, coloredSeries, width, height, pad),
      [categories, coloredSeries, width, height, pad],
    );
    const empty = segments.length === 0;

    return (
      <div
        ref={ref}
        data-slot="stacked-bar-chart"
        data-variant={variant}
        className={cn(stackedBarChartVariants({ variant }), className)}
        {...props}
      >
        {showLegend && coloredSeries.length > 0 ? (
          <ul
            data-slot="stacked-bar-chart-legend"
            className="mb-2 flex flex-wrap gap-3 text-[10px]"
          >
            {coloredSeries.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 rounded-sm"
                  style={{ background: s.color }}
                />
                <span className="text-muted-foreground">
                  {s.label ?? s.key}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={label}
          data-empty={empty || undefined}
        >
          <title>{label}</title>
          {showGrid && !empty ? (
            <g opacity={0.35}>
              {[0.25, 0.5, 0.75].map((t) => {
                const y = pad.top + t * (height - pad.top - pad.bottom);
                return (
                  <line
                    key={t}
                    x1={pad.left}
                    x2={width - pad.right}
                    y1={y}
                    y2={y}
                    stroke="var(--glass-chrome-border)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                );
              })}
            </g>
          ) : null}
          {!empty ? (
            <>
              {segments.map((seg) => (
                <rect
                  key={`${seg.categoryIndex}-${seg.seriesKey}`}
                  data-slot="stacked-bar-chart-segment"
                  x={seg.x}
                  y={seg.y}
                  width={seg.width}
                  height={seg.height}
                  rx={radius}
                  fill={seg.color}
                >
                  <title>
                    {seg.seriesKey} / {categories[seg.categoryIndex]}:{" "}
                    {seg.value}
                  </title>
                </rect>
              ))}
              {showLabels
                ? categories.map((cat, i) => {
                    const first = segments.find((s) => s.categoryIndex === i);
                    if (!first) return null;
                    return (
                      <text
                        key={cat}
                        x={first.x + first.width / 2}
                        y={height - 8}
                        textAnchor="middle"
                        className="fill-muted-foreground"
                        fontSize={9}
                      >
                        {cat}
                      </text>
                    );
                  })
                : null}
            </>
          ) : (
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              fontSize={12}
            >
              No data
            </text>
          )}
        </svg>
      </div>
    );
  },
);
StackedBarChart.displayName = "StackedBarChart";

export { StackedBarChart, stackedBarChartVariants };
