"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const radioGroupVariants = cva("grid gap-2", {
  variants: {
    layout: {
      vertical: "grid-cols-1",
      horizontal: "auto-cols-max grid-flow-col gap-4",
    },
  },
  defaultVariants: {
    layout: "vertical",
  },
});

const radioGroupItemVariants = cva(
  [
    "aspect-square shrink-0 rounded-full",
    "border border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)]",
    "shadow-[var(--glass-chrome-inset)]",
    "transition-[background,border-color,box-shadow,transform]",
    "duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:border-[color-mix(in_oklch,var(--primary)_50%,transparent)]",
    "active:scale-95",
    focusRing,
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "text-primary",
        ],
        outline: [
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "text-primary",
        ],
      },
      size: {
        sm: "size-4",
        default: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

const radioGroupIndicatorVariants = cva(
  "flex items-center justify-center text-current",
  {
    variants: {
      size: {
        sm: "[&_svg]:size-2",
        default: "[&_svg]:size-2.5",
        lg: "[&_svg]:size-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function RadioDot({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {}

const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, layout, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    data-slot="radio-group"
    className={cn(radioGroupVariants({ layout, className }))}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, variant, size, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    data-slot="radio-group-item"
    className={cn(radioGroupItemVariants({ variant, size, className }))}
    {...props}
  >
    <RadioGroupPrimitive.Indicator
      data-slot="radio-group-indicator"
      className={cn(radioGroupIndicatorVariants({ size }))}
    >
      <RadioDot />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export {
  RadioGroup,
  RadioGroupItem,
  radioGroupVariants,
  radioGroupItemVariants,
  radioGroupIndicatorVariants,
};