"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn, focusRing } from "@intelli/utils";

const glassIconButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center",
    "glass-chrome glass-chrome-interactive rounded-full",
    "transition-[transform,box-shadow,background] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      size: {
        sm: "size-8 [&_svg]:size-3.5",
        default: "size-9 [&_svg]:size-4",
        lg: "size-10 [&_svg]:size-[1.125rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface GlassIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassIconButtonVariants> {
  asChild?: boolean;
}

const GlassIconButton = forwardRef<HTMLButtonElement, GlassIconButtonProps>(
  ({ className, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(glassIconButtonVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
GlassIconButton.displayName = "GlassIconButton";

export { GlassIconButton, glassIconButtonVariants };