"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@intelli/utils";

const labelVariants = cva(
  [
    "inline-flex items-center gap-1.5 text-sm font-medium leading-none",
    "select-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    "group-data-[disabled=true]:cursor-not-allowed group-data-[disabled=true]:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "text-foreground",
        chrome: "glass-chrome-text",
        muted: "text-muted-foreground",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
      required: {
        true: "after:ms-0.5 after:text-destructive after:content-['*']",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      required: false,
    },
  },
);

export interface LabelProps
  extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, size, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(labelVariants({ variant, size, required, className }))}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
