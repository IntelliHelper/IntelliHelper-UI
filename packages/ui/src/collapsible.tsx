"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const Collapsible = CollapsiblePrimitive.Root;

const collapsibleVariants = cva("w-full", {
  variants: {
    variant: {
      chrome: "glass-panel rounded-2xl px-4",
      outline: [
        "rounded-2xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_35%,transparent)]",
        "shadow-[var(--glass-chrome-shadow)] px-4",
      ],
    },
    animated: {
      true: "animate-glass-rise",
      false: "",
    },
  },
  defaultVariants: {
    variant: "chrome",
    animated: true,
  },
});

const collapsibleTriggerVariants = cva(
  [
    "flex w-full items-center text-left glass-chrome-text",
    "transition-[color,background-color,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
    "hover:glass-chrome-text [&[data-state=open]]:glass-chrome-text",
    "disabled:pointer-events-none disabled:opacity-50",
    focusRing,
  ],
  {
    variants: {
      layout: {
        default: [
          "justify-between gap-4 py-4 text-sm font-semibold",
          "[&[data-state=open]>svg:last-child]:rotate-180",
        ],
        tree: [
          "justify-start gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium",
          "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]",
          "[&[data-state=open]>svg:first-child]:rotate-90",
        ],
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    compoundVariants: [
      { layout: "default", size: "sm", className: "py-3 text-xs" },
      { layout: "default", size: "default", className: "py-4 text-sm" },
      { layout: "default", size: "lg", className: "py-5 text-base" },
      { layout: "tree", size: "sm", className: "py-1 text-[11px]" },
      { layout: "tree", size: "default", className: "py-1.5 text-xs" },
      { layout: "tree", size: "lg", className: "py-2 text-sm" },
    ],
    defaultVariants: {
      layout: "default",
      size: "default",
    },
  },
);

function CollapsibleChevron({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "shrink-0 glass-chrome-text-muted transition-transform duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
        className,
      )}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export interface CollapsibleTriggerProps
  extends ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>,
    VariantProps<typeof collapsibleTriggerVariants> {
  showChevron?: boolean;
}

const CollapsibleTrigger = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(
  (
    { className, layout, size, showChevron = true, children, ...props },
    ref,
  ) => (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      data-slot="collapsible-trigger"
      data-layout={layout}
      className={cn(collapsibleTriggerVariants({ layout, size, className }))}
      {...props}
    >
      {layout === "tree" && showChevron ? (
        <CollapsibleChevron className="size-3.5" />
      ) : null}
      {children}
      {layout !== "tree" && showChevron ? (
        <CollapsibleChevron className="size-4" />
      ) : null}
    </CollapsiblePrimitive.Trigger>
  ),
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps
  extends ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content> {
  animated?: boolean;
  nested?: boolean;
}

const CollapsibleContent = forwardRef<
  ElementRef<typeof CollapsiblePrimitive.Content>,
  CollapsibleContentProps
>(({ className, animated = true, nested = false, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    data-slot="collapsible-content"
    data-nested={nested || undefined}
    className={cn(
      "overflow-hidden text-sm glass-chrome-text-muted",
      animated &&
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div
      className={cn(
        nested
          ? "ml-3 border-l border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] pl-2"
          : "pb-4 pt-0",
      )}
    >
      {children}
    </div>
  </CollapsiblePrimitive.Content>
));
CollapsibleContent.displayName = "CollapsibleContent";

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  collapsibleVariants,
  collapsibleTriggerVariants,
};