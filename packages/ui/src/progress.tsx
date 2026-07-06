"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@intelli/utils";

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        chrome: [
          "border border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
          "shadow-[var(--glass-chrome-inset)]",
        ],
        outline: [
          "border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%,transparent)]",
        ],
      },
      size: {
        sm: "h-1.5",
        default: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 rounded-full transition-transform duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--primary)_78%,transparent)]",
          "shadow-[inset_0_1px_0_color-mix(in_oklch,white_25%,transparent)]",
        ],
        outline: "bg-primary",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface ProgressProps
  extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress"
    className={cn(progressVariants({ variant, size, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(progressIndicatorVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export {
  Progress,
  progressVariants,
  progressIndicatorVariants,
};