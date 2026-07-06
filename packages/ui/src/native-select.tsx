"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentProps,
  type SelectHTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";
import { fieldVariants, type FieldVariantProps } from "./field-variants";

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

const nativeSelectWrapperVariants = cva(
  "group/native-select relative w-full has-[select:disabled]:opacity-50",
  {
    variants: {
      width: {
        fit: "w-fit",
        full: "w-full",
      },
    },
    defaultVariants: {
      width: "full",
    },
  },
);

const nativeSelectVariants = cva(
  [
    "w-full min-w-0 appearance-none pr-9",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "selection:bg-primary selection:text-primary-foreground",
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

export interface NativeSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    FieldVariantProps,
    VariantProps<typeof nativeSelectWrapperVariants>,
    VariantProps<typeof nativeSelectVariants> {}

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      className,
      variant,
      state,
      size,
      width,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      data-slot="native-select-wrapper"
      className={cn(nativeSelectWrapperVariants({ width }))}
    >
      <select
        ref={ref}
        data-slot="native-select"
        data-size={size}
        className={cn(
          fieldVariants({ variant, size, state }),
          nativeSelectVariants({ size, className }),
        )}
        {...props}
      >
        {children}
      </select>
      <SelectChevron
        data-slot="native-select-icon"
        className={cn(
          "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2",
          "glass-chrome-text-muted opacity-70 select-none",
        )}
      />
    </div>
  ),
);
NativeSelect.displayName = "NativeSelect";

function NativeSelectOption({
  className,
  ...props
}: ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-background text-foreground", className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({
  className,
  ...props
}: ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-background text-foreground", className)}
      {...props}
    />
  );
}

export {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
  nativeSelectVariants,
  nativeSelectWrapperVariants,
};