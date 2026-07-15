"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";

const thinkingAnimationVariants = cva(
  "inline-flex items-center gap-2 text-sm text-muted-foreground",
  {
    variants: {
      variant: {
        default: "",
        pill: [
          "rounded-full border border-[var(--glass-chrome-border)] px-3 py-1.5",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_42%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
        ],
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);

export interface ThinkingAnimationProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof thinkingAnimationVariants> {
  label?: string;
}

const ThinkingAnimation = forwardRef<HTMLDivElement, ThinkingAnimationProps>(
  (
    {
      className,
      variant,
      label = "Thinking",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-slot="thinking-animation"
      role="status"
      aria-live="polite"
      className={cn(thinkingAnimationVariants({ variant }), className)}
      {...props}
    >
      <span
        aria-hidden
        className="relative flex size-4 items-center justify-center"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <span className="size-2 rounded-full bg-primary" />
      </span>
      <span data-slot="thinking-animation-label">{label}</span>
      <span aria-hidden className="inline-flex w-6 justify-start tracking-widest">
        <span className="animate-pulse">…</span>
      </span>
    </div>
  ),
);
ThinkingAnimation.displayName = "ThinkingAnimation";

export { ThinkingAnimation, thinkingAnimationVariants };
