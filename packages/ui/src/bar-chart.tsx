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
  layoutHorizontalBars,
  layoutVerticalBars,
  normalizeSeries,
  type ChartDatum,
} from "./chart-utils";

const barChartVariants = cva("relative w-full min-w-0 overflow-hidden", {
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

export interface BarChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof barChartVariants> {
  data: Array<number | ChartDatum>;
  width?: number;
  height?: number;
  /** Vertical columns (default) or horizontal bars */
  orientation?: "vertical" | "horizontal";
  showGrid?: boolean;
  showLabels?: boolean;
  label?: string;
  colors?: string[];
  /** Single fill for all bars; otherwise palette by index */
  fill?: string;
  radius?: number;
}

const BarChart = forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      className,
      variant,
      data,
      width = 320,
      height = 180,
      orientation = "vertical",
      showGrid = true,
      showLabels = true,
      label = "Bar chart",
      colors,
      fill,
      radius = 4,
      ...props
    },
    ref,
  ) => {
    const series = useMemo(() => normalizeSeries(data), [data]);
    const pad = useMemo(
      () =>
        orientation === "horizontal"
          ? { top: 8, right: 16, bottom: 8, left: showLabels ? 48 : 12 }
          : { top: 12, right: 12, bottom: showLabels ? 28 : 12, left: 12 },
      [orientation, showLabels],
    );

    const bars = useMemo(
      () =>
        orientation === "horizontal"
          ? layoutHorizontalBars(series, width, height, pad)
          : layoutVerticalBars(series, width, height, pad),
      [series, width, height, orientation, pad],
    );
    const empty = bars.length === 0;

    return (
      <div
        ref={ref}
        data-slot="bar-chart"
        data-orientation={orientation}
        data-variant={variant}
        className={cn(barChartVariants({ variant }), className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={label}
          data-empty={empty || undefined}
        >
          <title>{label}</title>
          {showGrid && !empty ? (
            <g data-slot="bar-chart-grid" opacity={0.35}>
              {orientation === "vertical"
                ? [0.25, 0.5, 0.75].map((t) => {
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
                  })
                : [0.25, 0.5, 0.75].map((t) => {
                    const x = pad.left + t * (width - pad.left - pad.right);
                    return (
                      <line
                        key={t}
                        x1={x}
                        x2={x}
                        y1={pad.top}
                        y2={height - pad.bottom}
                        stroke="var(--glass-chrome-border)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                    );
                  })}
            </g>
          ) : null}
          {!empty ? (
            <g data-slot="bar-chart-bars">
              {bars.map((bar) => (
                <g key={bar.index}>
                  <rect
                    data-slot="bar-chart-bar"
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    rx={radius}
                    ry={radius}
                    fill={fill ?? chartColorAt(bar.index, colors)}
                  >
                    <title>
                      {bar.label ?? `Item ${bar.index + 1}`}: {bar.value}
                    </title>
                  </rect>
                  {showLabels && bar.label ? (
                    orientation === "vertical" ? (
                      <text
                        x={bar.x + bar.width / 2}
                        y={height - 8}
                        textAnchor="middle"
                        className="fill-muted-foreground"
                        fontSize={9}
                      >
                        {bar.label}
                      </text>
                    ) : (
                      <text
                        x={pad.left - 6}
                        y={bar.y + bar.height / 2}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="fill-muted-foreground"
                        fontSize={9}
                      >
                        {bar.label}
                      </text>
                    )
                  ) : null}
                </g>
              ))}
            </g>
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
BarChart.displayName = "BarChart";

export { BarChart, barChartVariants };
