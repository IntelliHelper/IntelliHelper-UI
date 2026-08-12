"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";
import {
  CUSTOM_CHART_PERIOD,
  DEFAULT_CHART_PERIODS,
  formatChartPeriodRange,
  toDateInputValue,
  type ChartPeriodKey,
  type ChartPeriodOption,
  type ChartPeriodRange,
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

const dateFieldClassName = cn(
  "h-7 rounded-lg border border-[var(--glass-chrome-border)] bg-transparent",
  "px-1.5 text-[11px] text-[var(--glass-chrome-fg)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:opacity-40",
  "[color-scheme:inherit]",
);

export interface ChartPeriodControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof chartPeriodVariants> {
  /** Selected period key (built-in, `"custom"`, or app-defined id) */
  value: ChartPeriodKey;
  /** Called when the user picks a period chip */
  onValueChange: (value: ChartPeriodKey) => void;
  /**
   * Period chips. Defaults to {@link DEFAULT_CHART_PERIODS}.
   * Add custom keys with `daySpan` / `startOffsetMs` for filtering support:
   * `{ value: "45d", label: "45D", description: "Last 45 days", daySpan: 45 }`.
   */
  periods?: readonly ChartPeriodOption[];
  /** Limit which keys render (e.g. compact dashboard: 7d/30d/90d) */
  include?: ChartPeriodKey[];
  /**
   * Show a **Custom** chip and from/to date fields for absolute ranges.
   * Requires `onRangeChange` to persist the selected range.
   */
  allowCustomRange?: boolean;
  /** Absolute range when `value === "custom"` (and optional display seed) */
  range?: ChartPeriodRange | null;
  /** Called when the custom from/to inputs change */
  onRangeChange?: (range: ChartPeriodRange | null) => void;
  /**
   * When true (default), custom range fields show whenever `value === "custom"`.
   * Set false to render only the chip and manage range UI yourself.
   */
  showRangeFields?: boolean;
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
      allowCustomRange = false,
      range = null,
      onRangeChange,
      showRangeFields = true,
      disabled = false,
      "aria-label": ariaLabel = "Time period",
      ...props
    },
    ref,
  ) => {
    const list = useMemo(() => {
      let base = include?.length
        ? periods.filter((p) => include.includes(p.value))
        : [...periods];
      if (allowCustomRange) {
        const hasCustom = base.some((p) => p.value === "custom");
        if (!hasCustom) {
          // Prefer include if provided and "custom" listed
          if (!include?.length || include.includes("custom")) {
            base = [...base, CUSTOM_CHART_PERIOD];
          }
        }
      }
      return base;
    }, [periods, include, allowCustomRange]);

    const showCustomFields =
      allowCustomRange &&
      showRangeFields &&
      value === "custom" &&
      typeof onRangeChange === "function";

    const fromValue = toDateInputValue(range?.from);
    const toValue = toDateInputValue(range?.to);
    const rangeSummary =
      value === "custom" && range
        ? formatChartPeriodRange(range)
        : "";

    const commitRange = (next: { from?: string; to?: string }) => {
      if (!onRangeChange) return;
      const from = next.from ?? fromValue;
      const to = next.to ?? toValue;
      if (!from && !to) {
        onRangeChange(null);
        return;
      }
      onRangeChange({
        from: from || to,
        to: to || from || undefined,
      });
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        data-slot="chart-period"
        data-variant={variant}
        data-period={value}
        data-custom-range={allowCustomRange || undefined}
        className={cn(
          "inline-flex max-w-full flex-col items-stretch gap-1.5",
          className,
        )}
        {...props}
      >
        <div className={cn(chartPeriodVariants({ variant, size }))}>
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
                className={cn(chartPeriodItemVariants({ size, active }))}
                onClick={() => {
                  if (disabled) return;
                  if (period.value !== value) {
                    onValueChange(period.value);
                  }
                  // Seed a sensible default range when entering custom mode
                  if (
                    period.value === "custom" &&
                    onRangeChange &&
                    !range?.from
                  ) {
                    const end = new Date();
                    const start = new Date(end);
                    start.setDate(start.getDate() - 29);
                    onRangeChange({
                      from: toDateInputValue(start),
                      to: toDateInputValue(end),
                    });
                  }
                }}
              >
                {period.label}
              </button>
            );
          })}
        </div>

        {showCustomFields ? (
          <div
            data-slot="chart-period-range"
            className="flex flex-wrap items-center gap-1.5 px-0.5"
          >
            <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="sr-only sm:not-sr-only">From</span>
              <input
                type="date"
                data-slot="chart-period-from"
                className={dateFieldClassName}
                disabled={disabled}
                value={fromValue}
                max={toValue || undefined}
                aria-label="Range start"
                onChange={(e) => commitRange({ from: e.target.value })}
              />
            </label>
            <span className="text-[10px] text-muted-foreground" aria-hidden>
              –
            </span>
            <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="sr-only sm:not-sr-only">To</span>
              <input
                type="date"
                data-slot="chart-period-to"
                className={dateFieldClassName}
                disabled={disabled}
                value={toValue}
                min={fromValue || undefined}
                aria-label="Range end"
                onChange={(e) => commitRange({ to: e.target.value })}
              />
            </label>
            {rangeSummary ? (
              <span
                data-slot="chart-period-range-summary"
                className="ml-auto text-[10px] tabular-nums text-muted-foreground"
              >
                {rangeSummary}
              </span>
            ) : null}
          </div>
        ) : null}
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
  CUSTOM_CHART_PERIOD,
};
export type {
  ChartPeriodKey,
  ChartPeriodOption,
  ChartPeriodRange,
};
