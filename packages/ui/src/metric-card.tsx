"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import {
  formatDelta,
  type FormattedDelta,
  type TrendDirection,
} from "./chart-utils";

const metricCardVariants = cva(
  [
    "flex w-full flex-col gap-2 rounded-2xl border p-4",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_62%, var(--glass-mix-into))]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        elevated: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_78%, var(--glass-mix-into))]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        outline: "bg-transparent",
      },
      size: {
        sm: "gap-1.5 p-3",
        default: "gap-2 p-4",
        lg: "gap-3 p-5",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

const metricTrendVariants = cva(
  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
  {
    variants: {
      direction: {
        up: "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_16%,transparent)] text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
        down: "bg-destructive/15 text-destructive",
        flat: "bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)] text-muted-foreground",
      },
    },
    defaultVariants: {
      direction: "flat",
    },
  },
);

export interface MetricCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  /** Primary metric label (e.g. "Revenue") */
  label: ReactNode;
  /** Primary value display (string or number — render as-is) */
  value: ReactNode;
  /**
   * Optional trend: pass a preformatted ReactNode, or numeric current/previous
   * via `trendValue` + `trendPrevious` to auto-format with formatDelta.
   */
  trend?: ReactNode;
  /** Current value for auto trend (used with trendPrevious) */
  trendValue?: number;
  /** Previous period value for auto trend */
  trendPrevious?: number;
  /** Options forwarded to formatDelta when auto-computing trend */
  trendFormat?: Parameters<typeof formatDelta>[2];
  /** Supporting description under the value */
  description?: ReactNode;
  /** Leading icon / media slot */
  icon?: ReactNode;
  /** Optional footer (e.g. sparkline) */
  footer?: ReactNode;
}

function TrendGlyph({ direction }: { direction: TrendDirection }) {
  if (direction === "up") {
    return (
      <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none">
        <path
          d="M2.5 8.5 L6 3.5 L9.5 8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (direction === "down") {
    return (
      <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none">
        <path
          d="M2.5 3.5 L6 8.5 L9.5 3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none">
      <path
        d="M2.5 6 H9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface MetricTrendProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof metricTrendVariants> {
  label?: string;
  /** When set, drives direction styling + glyph */
  formatted?: FormattedDelta;
}

const MetricTrend = forwardRef<HTMLSpanElement, MetricTrendProps>(
  ({ className, direction, label, formatted, children, ...props }, ref) => {
    const dir = formatted?.direction ?? direction ?? "flat";
    const text = children ?? formatted?.label ?? label;
    return (
      <span
        ref={ref}
        data-slot="metric-card-trend"
        data-direction={dir}
        className={cn(metricTrendVariants({ direction: dir }), className)}
        {...props}
      >
        <TrendGlyph direction={dir} />
        {text}
      </span>
    );
  },
);
MetricTrend.displayName = "MetricTrend";

const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  (
    {
      className,
      variant,
      size,
      label,
      value,
      trend,
      trendValue,
      trendPrevious,
      trendFormat,
      description,
      icon,
      footer,
      ...props
    },
    ref,
  ) => {
    let autoTrend: FormattedDelta | null = null;
    if (
      trend == null &&
      trendValue != null &&
      trendPrevious != null &&
      Number.isFinite(trendValue) &&
      Number.isFinite(trendPrevious)
    ) {
      autoTrend = formatDelta(trendValue, trendPrevious, trendFormat);
    }

    return (
      <div
        ref={ref}
        data-slot="metric-card"
        data-variant={variant}
        className={cn(metricCardVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              data-slot="metric-card-label"
              className="text-xs font-medium text-muted-foreground"
            >
              {label}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <p
                data-slot="metric-card-value"
                className="text-2xl font-semibold tracking-tight tabular-nums text-[var(--glass-chrome-fg)]"
              >
                {value}
              </p>
              {trend != null ? (
                <span data-slot="metric-card-trend-slot">{trend}</span>
              ) : autoTrend ? (
                <MetricTrend formatted={autoTrend} />
              ) : null}
            </div>
          </div>
          {icon ? (
            <div
              data-slot="metric-card-icon"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary [&_svg]:size-4"
            >
              {icon}
            </div>
          ) : null}
        </div>
        {description ? (
          <p
            data-slot="metric-card-description"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {description}
          </p>
        ) : null}
        {footer ? (
          <div
            data-slot="metric-card-footer"
            className="mt-1 border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_60%,transparent)] pt-3"
          >
            {footer}
          </div>
        ) : null}
      </div>
    );
  },
);
MetricCard.displayName = "MetricCard";

export {
  MetricCard,
  MetricTrend,
  metricCardVariants,
  metricTrendVariants,
};
