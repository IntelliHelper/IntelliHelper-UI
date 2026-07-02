"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@intelli/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentVariants = cva(
  [
    "z-[calc(var(--z-modal)+2)] overflow-hidden rounded-lg px-3 py-1.5 text-xs font-medium",
    "border backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-shadow)]",
    "animate-scale-in",
    "data-[state=closed]:opacity-0",
    "transition-opacity duration-[var(--duration-fast)] [transition-timing-function:var(--ease-default)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_72%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
        ],
        elevated: [
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_85%,transparent)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_55%,transparent)]",
          "text-foreground",
        ],
        outline: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--background)_88%,transparent)]",
          "text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface TooltipContentProps
  extends ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {}

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ variant, className }))}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  tooltipContentVariants,
};