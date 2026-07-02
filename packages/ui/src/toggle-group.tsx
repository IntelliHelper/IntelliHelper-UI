"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@intelli/utils";
import { toggleVariants } from "./toggle";

const toggleGroupVariants = cva("inline-flex items-center gap-1 p-1", {
  variants: {
    variant: {
      chrome: "glass-chrome glass-chrome-capsule",
      plain: [
        "rounded-2xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_25%,transparent)]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
      ],
    },
    size: {
      sm: "h-9",
      default: "h-10",
      lg: "h-11",
    },
  },
  defaultVariants: {
    variant: "chrome",
    size: "default",
  },
});

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  variant: "chrome",
  size: "default",
});

export type ToggleGroupProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof toggleGroupVariants> & {
    itemVariant?: VariantProps<typeof toggleVariants>["variant"];
  };

const ToggleGroup = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, itemVariant, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    data-slot="toggle-group"
    className={cn(toggleGroupVariants({ variant, size, className }))}
    {...props}
  >
    <ToggleGroupContext.Provider
      value={{ variant: itemVariant ?? "chrome", size }}
    >
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export interface ToggleGroupItemProps
  extends ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {}

const ToggleGroupItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, children, variant, size, ...props }, ref) => {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          variant: context.variant ?? variant,
          size: context.size ?? size,
        }),
        "rounded-full data-[state=on]:scale-[1.02]",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants };