"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@intelli/utils";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const hoverCardContentVariants = cva(
  [
    "z-[calc(var(--z-modal)+1)] w-72 rounded-xl p-4 text-sm",
    "border backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-shadow)]",
    "animate-scale-in",
    "data-[state=closed]:opacity-0",
    "transition-opacity duration-[var(--duration-fast)] [transition-timing-function:var(--ease-default)]",
    "outline-none",
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
      size: {
        sm: "w-56 p-3 text-xs",
        default: "w-72 p-4 text-sm",
        lg: "w-80 p-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

export interface HoverCardContentProps
  extends ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
    VariantProps<typeof hoverCardContentVariants> {}

const HoverCardContent = forwardRef<
  ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    { className, variant, size, align = "center", sideOffset = 8, ...props },
    ref,
  ) => (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(hoverCardContentVariants({ variant, size, className }))}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  ),
);
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  hoverCardContentVariants,
};