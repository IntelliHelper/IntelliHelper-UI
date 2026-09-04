"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  useMemo,
} from "react";
import { cn } from "@intelli/utils";
import {
  layoutRadarPoints,
  normalizeSeries,
  pointsToPolygonPath,
  polarToCartesian,
  type ChartDatum,
} from "./chart-utils";

const radarChartVariants = cva("relative w-full min-w-0 overflow-hidden", {
  variants: {
    variant: {
      chrome: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-3",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_52%, var(--glass-mix-into))]",
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

export interface RadarChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof radarChartVariants> {
  data: Array<number | ChartDatum>;
  size?: number;
  levels?: number;
  label?: string;
  stroke?: string;
  fill?: string;
  showLabels?: boolean;
  maxValue?: number;
}

const RadarChart = forwardRef<HTMLDivElement, RadarChartProps>(
  (
    {
      className,
      variant,
      data,
      size = 220,
      levels = 4,
      label = "Radar chart",
      stroke = "var(--primary)",
      fill = "color-mix(in oklch, var(--primary) 22%, transparent)",
      showLabels = true,
      maxValue,
      ...props
    },
    ref,
  ) => {
    const series = useMemo(() => normalizeSeries(data), [data]);
    const cx = size / 2;
    const cy = size / 2;
    const maxRadius = size / 2 - (showLabels ? 28 : 12);

    const points = useMemo(
      () => layoutRadarPoints(series, cx, cy, maxRadius, { maxValue }),
      [series, cx, cy, maxRadius, maxValue],
    );
    const polygon = useMemo(() => pointsToPolygonPath(points), [points]);
    const empty = points.length === 0;
    const n = Math.max(points.length, 3);

    return (
      <div
        ref={ref}
        data-slot="radar-chart"
        data-variant={variant}
        className={cn(radarChartVariants({ variant }), className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="mx-auto h-auto w-full max-w-[280px]"
          role="img"
          aria-label={label}
          data-empty={empty || undefined}
        >
          <title>{label}</title>
          {/* Grid rings + axes */}
          <g data-slot="radar-chart-grid" opacity={0.4}>
            {Array.from({ length: levels }, (_, i) => {
              const r = ((i + 1) / levels) * maxRadius;
              const ring = Array.from({ length: n }, (__, j) => {
                const angle = (j / n) * Math.PI * 2;
                return polarToCartesian(cx, cy, r, angle);
              });
              return (
                <path
                  key={i}
                  d={pointsToPolygonPath(ring)}
                  fill="none"
                  stroke="var(--glass-chrome-border)"
                  strokeWidth={1}
                />
              );
            })}
            {Array.from({ length: n }, (_, j) => {
              const angle = (j / n) * Math.PI * 2;
              const end = polarToCartesian(cx, cy, maxRadius, angle);
              return (
                <line
                  key={j}
                  x1={cx}
                  y1={cy}
                  x2={end.x}
                  y2={end.y}
                  stroke="var(--glass-chrome-border)"
                  strokeWidth={1}
                />
              );
            })}
          </g>
          {!empty ? (
            <>
              <path
                data-slot="radar-chart-area"
                d={polygon}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {points.map((p) => (
                <circle
                  key={p.index}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill="var(--background)"
                  stroke={stroke}
                  strokeWidth={1.5}
                />
              ))}
              {showLabels
                ? points.map((p) => {
                    const angle = (p.index / points.length) * Math.PI * 2;
                    const tip = polarToCartesian(
                      cx,
                      cy,
                      maxRadius + 14,
                      angle,
                    );
                    return (
                      <text
                        key={`l-${p.index}`}
                        x={tip.x}
                        y={tip.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-muted-foreground"
                        fontSize={9}
                      >
                        {p.label ?? p.index + 1}
                      </text>
                    );
                  })
                : null}
            </>
          ) : (
            <text
              x={cx}
              y={cy}
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
RadarChart.displayName = "RadarChart";

export { RadarChart, radarChartVariants };
