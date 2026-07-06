"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";

const skeletonVariants = cva("", {
  variants: {
    variant: {
      default:
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_50%,transparent)]",
      chrome: "glass-panel",
      text: "h-4 w-full rounded-sm bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_50%,transparent)]",
    },
    animated: {
      true: "animate-glass-pulse",
      false: "",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
    animated: true,
    rounded: "md",
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, animated, rounded, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="skeleton"
      data-variant={variant}
      className={cn(skeletonVariants({ variant, animated, rounded, className }))}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };