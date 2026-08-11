"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";
import {
  DEFAULT_CHART_PERIODS,
  type ChartPeriodKey,
  type ChartPeriodOption,
} from "./chart-utils";

const chartPeriodVariants = cva(
  [
    "inline-flex max-w-full flex-wrap items-center gap-0.5 rounded-xl border p-0.5",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-inset)]",
        ],
        outline: "bg-transparent",
        ghost: "border-transparent bg-transparent p-0",
      },
      size: {
        sm: "gap-0.5 p-0.5",
        default: "gap-0.5 p-0.5",
        lg: "gap-1 p-1",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

const chartPeriodItemVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-lg font-semibold tracking-wide",
    "text-muted-foreground transition-colors",
    "hover:text-[var(--glass-chrome-fg)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      size: {
        sm: "h-6 min-w-[2rem] px-1.5 text-[10px]",
        default: "h-7 min-w-[2.25rem] px-2 text-[11px]",
        lg: "h-8 min-w-[2.5rem] px-2.5 text-xs",
      },
      active: {
        true: [
          "bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
          "text-primary shadow-sm",
          "ring-1 ring-[color-mix(in_oklch,var(--primary)_35%,transparent)]",
        ],
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      active: false,
    },
  },
);

export interface ChartPeriodControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof chartPeriodVariants> {
  /** Selected period key */
  value: ChartPeriodKey;
  /** Called when the user picks a period */
  onValueChange: (value: ChartPeriodKey) => void;
  /** Override presets (defaults to DEFAULT_CHART_PERIODS) */
  periods?: readonly ChartPeriodOption[];
  /** Limit which keys render (e.g. compact dashboard: 7d/30d/90d) */
  include?: ChartPeriodKey[];
  disabled?: boolean;
  /** Accessible name for the control group */
  "aria-label"?: string;
}

const ChartPeriodControl = forwardRef<HTMLDivElement, ChartPeriodControlProps>(
  (
    {
      className,
      variant,
      size,
      value,
      onValueChange,
      periods = DEFAULT_CHART_PERIODS,
      include,
      disabled = false,
      "aria-label": ariaLabel = "Time period",
      ...props
    },
    ref,
  ) => {
    const list = include?.length
      ? periods.filter((p) => include.includes(p.value))
      : [...periods];

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        data-slot="chart-period"
        data-variant={variant}
        className={cn(chartPeriodVariants({ variant, size }), className)}
        {...props}
      >
        {list.map((period) => {
          const active = period.value === value;
          return (
            <button
              key={period.value}
              type="button"
              data-slot="chart-period-item"
              data-state={active ? "on" : "off"}
              data-period={period.value}
              disabled={disabled}
              aria-pressed={active}
              aria-label={period.description}
              title={period.description}
              className={cn(
                chartPeriodItemVariants({ size, active }),
              )}
              onClick={() => {
                if (!disabled && period.value !== value) {
                  onValueChange(period.value);
                }
              }}
            >
              {period.label}
            </button>
          );
        })}
      </div>
    );
  },
);
ChartPeriodControl.displayName = "ChartPeriodControl";

export {
  ChartPeriodControl,
  chartPeriodVariants,
  chartPeriodItemVariants,
  DEFAULT_CHART_PERIODS,
};
export type { ChartPeriodKey, ChartPeriodOption };
