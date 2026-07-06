"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type SVGAttributes } from "react";
import { cn } from "@intelli/utils";



const spinnerVariants = cva("animate-spin", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-primary",
      muted: "glass-chrome-text-muted",
      chrome: "text-[var(--glass-chrome-fg)]",
    },
    size: {
      sm: "size-3.5",
      default: "size-4",
      lg: "size-6",
      xl: "size-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface SpinnerProps
  extends SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      className={cn(spinnerVariants({ variant, size, className }))}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };