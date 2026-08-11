"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  useId,
  useMemo,
} from "react";
import { cn } from "@intelli/utils";
import {
  normalizeSeries,
  pointsToLinePath,
  scaleSeriesToPoints,
  type ChartDatum,
} from "./chart-utils";

const lineChartVariants = cva("relative w-full min-w-0 overflow-hidden", {
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

export interface LineChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof lineChartVariants> {
  /** Series values — numbers or `{ label, value }` objects */
  data: Array<number | ChartDatum>;
  /** SVG viewBox width (default 320) */
  width?: number;
  /** SVG viewBox height (default 160) */
  height?: number;
  /** Stroke width in SVG units */
  strokeWidth?: number;
  /** Show circular markers on points */
  showDots?: boolean;
  /** Show subtle horizontal grid lines */
  showGrid?: boolean;
  /** Accessible name for the graphic */
  label?: string;
  /** Stroke color (CSS); defaults to primary token */
  stroke?: string;
}

const LineChart = forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      className,
      variant,
      data,
      width = 320,
      height = 160,
      strokeWidth = 2,
      showDots = true,
      showGrid = true,
      label = "Line chart",
      stroke = "var(--primary)",
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const series = useMemo(() => normalizeSeries(data), [data]);
    const points = useMemo(
      () =>
        scaleSeriesToPoints(series, width, height, {
          top: 12,
          right: 12,
          bottom: 12,
          left: 12,
        }),
      [series, width, height],
    );
    const path = useMemo(() => pointsToLinePath(points), [points]);
    const empty = points.length === 0;

    return (
      <div
        ref={ref}
        data-slot="line-chart"
        data-variant={variant}
        className={cn(lineChartVariants({ variant }), className)}
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
            <g data-slot="line-chart-grid" opacity={0.35}>
              {[0.25, 0.5, 0.75].map((t) => {
                const y = 12 + t * (height - 24);
                return (
                  <line
                    key={t}
                    x1={12}
                    x2={width - 12}
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
              <path
                data-slot="line-chart-path"
                d={path}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {showDots
                ? points.map((p) => (
                    <circle
                      key={`${reactId}-${p.index}`}
                      data-slot="line-chart-dot"
                      cx={p.x}
                      cy={p.y}
                      r={3}
                      fill="var(--background)"
                      stroke={stroke}
                      strokeWidth={1.5}
                    />
                  ))
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
LineChart.displayName = "LineChart";

export { LineChart, lineChartVariants };
