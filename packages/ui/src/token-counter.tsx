"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";
import {
  estimateTokens,
  formatTokenCount,
} from "./ai-utils";

const tokenCounterVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums",
  {
    variants: {
      variant: {
        chrome: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
        ],
        warning: [
          "border-[color-mix(in_oklch,oklch(0.78_0.14_75)_40%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.78_0.14_75)_14%,transparent)]",
          "text-[color-mix(in_oklch,oklch(0.65_0.14_75)_90%,var(--foreground))]",
        ],
        danger: [
          "border-[color-mix(in_oklch,var(--destructive)_40%,transparent)]",
          "bg-[color-mix(in_oklch,var(--destructive)_14%,transparent)]",
          "text-destructive",
        ],
        ghost: "border-transparent bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface TokenCounterProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tokenCounterVariants> {
  /** Explicit token count. If omitted, estimated from `text`. */
  count?: number;
  text?: string;
  /** Soft limit used to pick warning/danger styling when variant is unset. */
  limit?: number;
  label?: string;
  compact?: boolean;
}

const TokenCounter = forwardRef<HTMLSpanElement, TokenCounterProps>(
  (
    {
      className,
      variant: variantProp,
      count,
      text = "",
      limit,
      label = "tokens",
      compact = false,
      ...props
    },
    ref,
  ) => {
    const resolved = count ?? estimateTokens(text);
    let variant = variantProp;
    if (variant == null && limit != null && limit > 0) {
      const ratio = resolved / limit;
      if (ratio >= 1) {
        variant = "danger";
      } else if (ratio >= 0.85) {
        variant = "warning";
      } else {
        variant = "chrome";
      }
    }

    return (
      <span
        ref={ref}
        data-slot="token-counter"
        data-count={resolved}
        className={cn(tokenCounterVariants({ variant }), className)}
        {...props}
      >
        <span data-slot="token-counter-value">
          {formatTokenCount(resolved)}
          {limit != null ? ` / ${formatTokenCount(limit)}` : null}
        </span>
        {!compact ? (
          <span className="opacity-70">{label}</span>
        ) : null}
      </span>
    );
  },
);
TokenCounter.displayName = "TokenCounter";

export {
  TokenCounter,
  tokenCounterVariants,
  estimateTokens,
  formatTokenCount,
};
