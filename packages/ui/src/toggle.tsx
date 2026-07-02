"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 font-medium",
    "transition-[background,color,transform,box-shadow,border-color]",
    "duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "glass-chrome-text-muted",
    "data-[state=on]:glass-chrome-text data-[state=on]:font-semibold",
    "data-[state=on]:scale-[1.02]",
    "active:scale-[0.98]",
    focusRing,
  ],
  {
    variants: {
      variant: {
        chrome: [
          "rounded-lg",
          "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]",
          "data-[state=on]:border data-[state=on]:border-[var(--glass-chrome-border)]",
          "data-[state=on]:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_72%,transparent)]",
          "data-[state=on]:shadow-[var(--glass-chrome-inset)]",
        ],
        outline: [
          "rounded-lg border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]",
          "data-[state=on]:border-[color-mix(in_oklch,var(--primary)_40%,transparent)]",
          "data-[state=on]:bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
          "data-[state=on]:text-primary",
        ],
        ghost: [
          "rounded-lg",
          "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_35%,transparent)]",
          "data-[state=on]:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
        ],
      },
      size: {
        sm: "h-8 min-w-8 px-2 text-xs",
        default: "h-9 min-w-9 px-2.5 text-sm",
        lg: "h-10 min-w-10 px-3 text-base",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

export interface ToggleProps
  extends ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = forwardRef<ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };