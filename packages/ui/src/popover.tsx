"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const popoverContentVariants = cva(
  [
    "z-[var(--z-dropdown)] w-72 rounded-xl p-4 text-sm",
    "border backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-shadow)]",
    "animate-scale-in",
    "data-[state=closed]:pointer-events-none",
    "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97]",
    "transition-[opacity,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "origin-[var(--radix-popover-content-transform-origin)]",
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

export interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverContentVariants> {}

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    { className, variant, size, align = "center", sideOffset = 8, ...props },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(popoverContentVariants({ variant, size, className }))}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

function PopoverHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1.5 pb-3", className)}
      {...props}
    />
  );
}

function PopoverTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      data-slot="popover-title"
      className={cn("text-sm font-semibold leading-none", className)}
      {...props}
    />
  );
}

function PopoverDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-xs glass-chrome-text-muted", className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  popoverContentVariants,
};