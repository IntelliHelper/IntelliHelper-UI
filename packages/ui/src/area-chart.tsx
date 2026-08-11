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
  pointsToAreaPath,
  pointsToLinePath,
  scaleSeriesToPoints,
  type ChartDatum,
} from "./chart-utils";

const areaChartVariants = cva("relative w-full min-w-0 overflow-hidden", {
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

export interface AreaChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof areaChartVariants> {
  data: Array<number | ChartDatum>;
  width?: number;
  height?: number;
  strokeWidth?: number;
  showGrid?: boolean;
  label?: string;
  stroke?: string;
  /** Fill color under the line; defaults to a translucent primary */
  fill?: string;
}

const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      className,
      variant,
      data,
      width = 320,
      height = 160,
      strokeWidth = 2,
      showGrid = true,
      label = "Area chart",
      stroke = "var(--primary)",
      fill,
      ...props
    },
    ref,
  ) => {
    const gradientId = useId().replace(/:/g, "");
    const series = useMemo(() => normalizeSeries(data), [data]);
    const pad = { top: 12, right: 12, bottom: 12, left: 12 };
    const points = useMemo(
      () => scaleSeriesToPoints(series, width, height, pad),
      [series, width, height],
    );
    const baselineY = height - pad.bottom;
    const linePath = useMemo(() => pointsToLinePath(points), [points]);
    const areaPath = useMemo(
      () => pointsToAreaPath(points, baselineY),
      [points, baselineY],
    );
    const empty = points.length === 0;
    const fillColor =
      fill ?? `url(#${gradientId})`;

    return (
      <div
        ref={ref}
        data-slot="area-chart"
        data-variant={variant}
        className={cn(areaChartVariants({ variant }), className)}
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
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--primary)"
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor="var(--primary)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          {showGrid && !empty ? (
            <g data-slot="area-chart-grid" opacity={0.35}>
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
              <path
                data-slot="area-chart-fill"
                d={areaPath}
                fill={fillColor}
                stroke="none"
              />
              <path
                data-slot="area-chart-path"
                d={linePath}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
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
AreaChart.displayName = "AreaChart";

export { AreaChart, areaChartVariants };
