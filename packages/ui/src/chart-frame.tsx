"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import {
  ChartPeriodControl,
  type ChartPeriodControlProps,
} from "./chart-period";
import type { ChartPeriodKey } from "./chart-utils";

const chartFrameVariants = cva(
  "flex w-full min-w-0 flex-col gap-3 rounded-2xl border",
  {
    variants: {
      variant: {
        chrome: [
          "border-[var(--glass-chrome-border)] p-4",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        elevated: [
          "border-[var(--glass-chrome-border)] p-4",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_72%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        outline: "border-[var(--glass-chrome-border)] bg-transparent p-4",
        bare: "border-transparent p-0",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface ChartFrameProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof chartFrameVariants> {
  /** Chart / panel title */
  title?: ReactNode;
  /** Supporting description under the title */
  description?: ReactNode;
  /**
   * Selected time period. When set with `onPeriodChange`, a period control
   * is shown in the header (unless `periodControl` is overridden).
   */
  period?: ChartPeriodKey;
  onPeriodChange?: (period: ChartPeriodKey) => void;
  /** Limit period chips (default compact: 7d, 30d, 90d, 1y, all) */
  periodInclude?: ChartPeriodKey[];
  periodControlProps?: Omit<
    ChartPeriodControlProps,
    "value" | "onValueChange"
  >;
  /** Fully custom period control slot (replaces built-in) */
  periodControl?: ReactNode;
  /** Extra actions on the right of the header (export, menu, …) */
  actions?: ReactNode;
  /** Legend or meta row below header */
  legend?: ReactNode;
  /** Footer notes / source attribution */
  footer?: ReactNode;
  children?: ReactNode;
  /** Hide the header block entirely */
  hideHeader?: boolean;
}

const DEFAULT_PERIOD_INCLUDE: ChartPeriodKey[] = [
  "7d",
  "30d",
  "90d",
  "1y",
  "all",
];

const ChartFrame = forwardRef<HTMLDivElement, ChartFrameProps>(
  (
    {
      className,
      variant,
      title,
      description,
      period,
      onPeriodChange,
      periodInclude = DEFAULT_PERIOD_INCLUDE,
      periodControlProps,
      periodControl,
      actions,
      legend,
      footer,
      children,
      hideHeader = false,
      ...props
    },
    ref,
  ) => {
    const showPeriod =
      periodControl != null ||
      (period != null && typeof onPeriodChange === "function");

    const showHeader =
      !hideHeader &&
      (title != null || description != null || showPeriod || actions != null);

    return (
      <div
        ref={ref}
        data-slot="chart-frame"
        data-variant={variant}
        data-period={period}
        className={cn(chartFrameVariants({ variant }), className)}
        {...props}
      >
        {showHeader ? (
          <div
            data-slot="chart-frame-header"
            className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 flex-1 space-y-1">
              {title != null ? (
                <h3
                  data-slot="chart-frame-title"
                  className="text-sm font-semibold tracking-tight text-[var(--glass-chrome-fg)]"
                >
                  {title}
                </h3>
              ) : null}
              {description != null ? (
                <p
                  data-slot="chart-frame-description"
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  {description}
                </p>
              ) : null}
            </div>
            <div
              data-slot="chart-frame-toolbar"
              className="flex shrink-0 flex-wrap items-center gap-2"
            >
              {periodControl != null
                ? periodControl
                : period != null && onPeriodChange
                  ? (
                      <ChartPeriodControl
                        value={period}
                        onValueChange={onPeriodChange}
                        include={periodInclude}
                        size="sm"
                        {...periodControlProps}
                      />
                    )
                  : null}
              {actions}
            </div>
          </div>
        ) : null}

        {legend ? (
          <div data-slot="chart-frame-legend" className="min-w-0">
            {legend}
          </div>
        ) : null}

        <div data-slot="chart-frame-body" className="min-w-0">
          {children}
        </div>

        {footer ? (
          <div
            data-slot="chart-frame-footer"
            className="border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_60%,transparent)] pt-2 text-[10px] text-muted-foreground"
          >
            {footer}
          </div>
        ) : null}
      </div>
    );
  },
);
ChartFrame.displayName = "ChartFrame";

export { ChartFrame, chartFrameVariants };
