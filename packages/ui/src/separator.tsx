"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@intelli/utils";

const separatorVariants = cva("shrink-0", {
  variants: {
    variant: {
      default: "bg-[var(--glass-chrome-border)]",
      chrome:
        "bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
      subtle:
        "bg-[color-mix(in_oklch,var(--glass-chrome-border)_45%,transparent)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const separatorOrientationStyles = {
  horizontal: "h-px w-full",
  vertical: "h-full w-px",
} as const;

export interface SeparatorProps
  extends ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof separatorVariants> {}

const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", decorative = true, variant, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      data-slot="separator"
      className={cn(
        separatorVariants({ variant }),
        separatorOrientationStyles[orientation ?? "horizontal"],
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };