"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";
import {
  layoutGauge,
  type GaugeThreshold,
} from "./chart-utils";

const gaugeVariants = cva("relative w-full min-w-0 overflow-hidden", {
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

export interface GaugeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof gaugeVariants> {
  /** Current reading */
  value: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  label?: string;
  /** Show numeric value under the needle hub */
  showValue?: boolean;
  /** Format the center value label */
  formatValue?: (value: number, min: number, max: number) => string;
  /** Optional colored bands ending at each threshold value */
  thresholds?: GaugeThreshold[];
  /** Track (background arc) fill */
  trackColor?: string;
  /** Value arc fill when no thresholds */
  valueColor?: string;
  /** Needle fill */
  needleColor?: string;
  unit?: string;
}

const DEFAULT_BAND_COLORS = [
  "color-mix(in oklch, oklch(0.72 0.16 145) 70%, transparent)",
  "color-mix(in oklch, oklch(0.78 0.14 85) 75%, transparent)",
  "color-mix(in oklch, oklch(0.65 0.18 25) 75%, transparent)",
];

const Gauge = forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      className,
      variant,
      value,
      min = 0,
      max = 100,
      width = 240,
      height = 160,
      label = "Gauge",
      showValue = true,
      formatValue,
      thresholds,
      trackColor = "color-mix(in oklch, var(--glass-chrome-border) 55%, transparent)",
      valueColor = "var(--primary)",
      needleColor = "var(--glass-chrome-fg)",
      unit,
      ...props
    },
    ref,
  ) => {
    const layout = useMemo(
      () =>
        layoutGauge(value, min, max, width, height, {
          top: 8,
          right: 12,
          bottom: 4,
          left: 12,
        }, { thresholds }),
      [value, min, max, width, height, thresholds],
    );

    const empty = layout == null;
    const valueLabel = layout
      ? formatValue
        ? formatValue(layout.clampedValue, layout.min, layout.max)
        : `${layout.clampedValue}${unit ? ` ${unit}` : ""}`
      : "";

    return (
      <div
        ref={ref}
        data-slot="gauge"
        data-variant={variant}
        className={cn(gaugeVariants({ variant }), className)}
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
          {layout ? (
            <>
              {/* Background track */}
              {layout.trackPath ? (
                <path
                  d={layout.trackPath}
                  fill={trackColor}
                  data-slot="gauge-track"
                />
              ) : null}
              {/* Threshold bands or solid value arc */}
              {layout.bands.length > 0
                ? layout.bands.map((band, i) => (
                    <path
                      key={`${band.from}-${band.to}`}
                      d={band.path}
                      fill={
                        band.color ??
                        DEFAULT_BAND_COLORS[i % DEFAULT_BAND_COLORS.length]
                      }
                      data-slot="gauge-band"
                    />
                  ))
                : layout.valueArcPath ? (
                    <path
                      d={layout.valueArcPath}
                      fill={valueColor}
                      data-slot="gauge-value-arc"
                    />
                  ) : null}
              {/* Needle */}
              <path
                d={layout.needlePath}
                fill={needleColor}
                data-slot="gauge-needle"
              />
              <circle
                cx={layout.cx}
                cy={layout.cy}
                r={Math.max(3, layout.radius * 0.06)}
                fill={needleColor}
              />
              {showValue ? (
                <text
                  x={layout.cx}
                  y={Math.min(height - 8, layout.cy - layout.innerRadius * 0.35)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-[var(--glass-chrome-fg)]"
                  fontSize={16}
                  fontWeight={600}
                >
                  {valueLabel}
                </text>
              ) : null}
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
Gauge.displayName = "Gauge";

export { Gauge, gaugeVariants };
