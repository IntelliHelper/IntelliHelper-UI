"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
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

const sparklineVariants = cva(
  "inline-block min-w-0 overflow-hidden align-middle",
  {
    variants: {
      variant: {
        bare: "",
        chrome: [
          "rounded-md border border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] px-1 py-0.5",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
        ],
      },
    },
    defaultVariants: {
      variant: "bare",
    },
  },
);

export interface SparklineProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof sparklineVariants> {
  data: Array<number | ChartDatum>;
  /** ViewBox width (default 96) */
  width?: number;
  /** ViewBox height (default 28) */
  height?: number;
  strokeWidth?: number;
  /** When true, fill under the line lightly */
  fill?: boolean;
  label?: string;
  stroke?: string;
}

const Sparkline = forwardRef<HTMLSpanElement, SparklineProps>(
  (
    {
      className,
      variant,
      data,
      width = 96,
      height = 28,
      strokeWidth = 1.5,
      fill = false,
      label = "Sparkline",
      stroke = "var(--primary)",
      ...props
    },
    ref,
  ) => {
    const series = useMemo(() => normalizeSeries(data), [data]);
    const pad = { top: 2, right: 2, bottom: 2, left: 2 };
    const points = useMemo(
      () => scaleSeriesToPoints(series, width, height, pad),
      [series, width, height],
    );
    const linePath = useMemo(() => pointsToLinePath(points), [points]);
    const areaPath = useMemo(
      () => pointsToAreaPath(points, height - pad.bottom),
      [points, height],
    );
    const empty = points.length === 0;

    return (
      <span
        ref={ref}
        data-slot="sparkline"
        data-variant={variant}
        className={cn(sparklineVariants({ variant }), className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="block"
          role="img"
          aria-label={label}
          data-empty={empty || undefined}
        >
          <title>{label}</title>
          {!empty ? (
            <>
              {fill ? (
                <path
                  data-slot="sparkline-fill"
                  d={areaPath}
                  fill="color-mix(in oklch, var(--primary) 22%, transparent)"
                  stroke="none"
                />
              ) : null}
              <path
                data-slot="sparkline-path"
                d={linePath}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : null}
        </svg>
      </span>
    );
  },
);
Sparkline.displayName = "Sparkline";

export { Sparkline, sparklineVariants };
