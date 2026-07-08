"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@intelli/utils";

const scrollAreaVariants = cva("relative overflow-hidden", {
  variants: {
    variant: {
      default: "",
      chrome: "rounded-xl border border-[var(--glass-chrome-border)] glass-panel",
      outline: [
        "rounded-xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)]",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const scrollBarVariants = cva(
  "flex touch-none select-none transition-colors duration-[var(--duration-normal)]",
  {
    variants: {
      orientation: {
        vertical: "h-full w-2.5 border-l border-l-transparent p-px",
        horizontal: "h-2.5 flex-col border-t border-t-transparent p-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

const scrollThumbClassName = cn(
  "relative flex-1 rounded-full",
  "bg-[var(--glass-scroll-thumb)]",
  "hover:bg-[var(--glass-scroll-thumb-hover)]",
);

export interface ScrollAreaProps
  extends ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
    VariantProps<typeof scrollAreaVariants> {}

const ScrollArea = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, variant, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    data-slot="scroll-area"
    className={cn(scrollAreaVariants({ variant, className }))}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className="h-full w-full rounded-[inherit]"
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export type ScrollBarProps = ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;

const ScrollBar = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    data-slot="scroll-area-scrollbar"
    orientation={orientation}
    className={cn(
      scrollBarVariants({ orientation: orientation ?? "vertical", className }),
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      data-slot="scroll-area-thumb"
      className={scrollThumbClassName}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export {
  ScrollArea,
  ScrollBar,
  scrollAreaVariants,
  scrollBarVariants,
};