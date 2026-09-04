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
  layoutFunnelStages,
  normalizeSeries,
  type ChartDatum,
} from "./chart-utils";

const funnelChartVariants = cva("relative w-full min-w-0 overflow-hidden", {
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

export interface FunnelChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof funnelChartVariants> {
  data: Array<number | ChartDatum>;
  width?: number;
  height?: number;
  label?: string;
  showLabels?: boolean;
  colors?: string[];
}

const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(
  (
    {
      className,
      variant,
      data,
      width = 280,
      height = 220,
      label = "Funnel chart",
      showLabels = true,
      colors,
      ...props
    },
    ref,
  ) => {
    const series = useMemo(() => normalizeSeries(data), [data]);
    const stages = useMemo(
      () =>
        layoutFunnelStages(series, width, height, {
          top: 8,
          right: showLabels ? 72 : 12,
          bottom: 8,
          left: 12,
        }),
      [series, width, height, showLabels],
    );
    const empty = stages.length === 0;

    return (
      <div
        ref={ref}
        data-slot="funnel-chart"
        data-variant={variant}
        className={cn(funnelChartVariants({ variant }), className)}
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
          {!empty ? (
            stages.map((stage) => {
              // Keep long funnels visible: floor opacity so late stages never vanish.
              const opacity = Math.max(0.35, 0.92 - stage.index * 0.04);
              return (
                <g key={stage.index} data-slot="funnel-chart-stage">
                  {stage.path ? (
                    <path
                      d={stage.path}
                      fill={chartColorAt(stage.index, colors)}
                      opacity={opacity}
                    >
                      <title>
                        {stage.label ?? `Stage ${stage.index + 1}`}:{" "}
                        {stage.value} ({stage.percentOfFirst.toFixed(0)}%)
                      </title>
                    </path>
                  ) : null}
                  {showLabels ? (
                    <text
                      x={width - 8}
                      y={stage.y + stage.height / 2}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="fill-[var(--glass-chrome-fg)]"
                      fontSize={10}
                      fontWeight={500}
                    >
                      {stage.label ?? `S${stage.index + 1}`}{" "}
                      <tspan className="fill-muted-foreground" fontWeight={400}>
                        {stage.value}
                      </tspan>
                    </text>
                  ) : null}
                </g>
              );
            })
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
FunnelChart.displayName = "FunnelChart";

export { FunnelChart, funnelChartVariants };
