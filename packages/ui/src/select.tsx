"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { fieldVariants, type FieldVariantProps } from "./field-variants";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const selectTriggerVariants = cva(
  [
    "inline-flex w-full items-center justify-between gap-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&[data-state=open]_svg]:rotate-180",
    focusRing,
  ],
  {
    variants: {
      size: {
        sm: "h-9 text-xs",
        default: "h-10 text-sm",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface SelectTriggerProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    FieldVariantProps,
    VariantProps<typeof selectTriggerVariants> {}

function SelectChevron({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, variant, size, state, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      fieldVariants({ variant, size, state }),
      selectTriggerVariants({ size, className }),
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <SelectChevron
        className={cn(
          "size-4 glass-chrome-text-muted",
          "transition-transform duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
        )}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const selectContentVariants = cva(
  [
    "relative z-[var(--z-dropdown)] overflow-hidden rounded-xl",
    "text-sm glass-chrome-text",
    "data-[state=closed]:pointer-events-none",
    "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97] data-[state=closed]:blur-sm",
    "transition-[opacity,transform,filter] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "origin-[var(--radix-select-content-transform-origin)]",
  ],
  {
    variants: {
      variant: {
        chrome: "glass-dialog",
        elevated: "glass-dialog-elevated",
        outline: [
          "border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_42%,transparent)]",
          "backdrop-blur-[calc(var(--glass-blur)+12px)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
      },
      animated: {
        true: "data-[state=open]:animate-select-content-in",
        false: "",
      },
    },
    defaultVariants: {
      variant: "chrome",
      animated: true,
    },
  },
);

export interface SelectContentProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    VariantProps<typeof selectContentVariants> {
  position?: "item-aligned" | "popper";
}

const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      variant,
      animated,
      children,
      position = "popper",
      sideOffset = 6,
      ...props
    },
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        data-slot="select-content"
        sideOffset={sideOffset}
        position={position}
        className={cn(
          selectContentVariants({ variant, animated, className }),
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1",
        )}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(
      "px-2 py-1.5 text-xs font-semibold uppercase tracking-wide glass-chrome-text-muted",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const selectItemVariants = cva(
  [
    "relative flex w-full cursor-default select-none items-center gap-2 rounded-lg py-2 pl-2 pr-8 text-sm outline-none",
    "glass-chrome-text-muted",
    "transition-[background,color,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "data-[highlighted]:glass-chrome-text data-[highlighted]:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_65%,transparent)]",
    "data-[highlighted]:shadow-[var(--glass-chrome-inset)]",
    "data-[state=checked]:glass-chrome-text data-[state=checked]:font-medium",
    "active:scale-[0.98]",
    focusRing,
  ],
  {
    variants: {
      size: {
        sm: "py-1.5 text-xs",
        default: "py-2 text-sm",
        lg: "py-2.5 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface SelectItemProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    VariantProps<typeof selectItemVariants> {}

function SelectItemCheck({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, size, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(selectItemVariants({ size, className }))}
    {...props}
  >
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <SelectItemCheck className="size-3.5 animate-checkbox-check" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn(
      "-mx-1 my-1 h-px bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
      className,
    )}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  selectTriggerVariants,
  selectContentVariants,
  selectItemVariants,
};