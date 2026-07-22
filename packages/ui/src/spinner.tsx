"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";

const spinnerVariants = cva(
  "inline-flex shrink-0 items-center justify-center text-current",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        muted: "glass-chrome-text-muted",
        chrome: "text-[var(--glass-chrome-fg)]",
      },
      size: {
        sm: "size-3.5",
        default: "size-4",
        lg: "size-6",
        xl: "size-8",
      },
      type: {
        default: "",
        ring: "",
        dots: "",
        bars: "",
        pulse: "",
        /** Classic iOS-style petal / spoke spinner */
        apple: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      type: "default",
    },
  },
);

export type SpinnerType = NonNullable<
  VariantProps<typeof spinnerVariants>["type"]
>;

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Visual spinner style. Color stays on `variant`. */
  type?: SpinnerType;
}

function SpinnerGlyph({ type }: { type: SpinnerType }) {
  switch (type) {
    case "ring":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="size-full animate-spin"
          aria-hidden
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2.5"
            className="opacity-20"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "dots":
      return (
        <span
          className="inline-flex size-full items-center justify-center gap-[18%]"
          aria-hidden
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="size-[26%] shrink-0 animate-bounce rounded-full bg-current"
              style={{
                animationDelay: `${index * 140}ms`,
                animationDuration: "0.75s",
              }}
            />
          ))}
        </span>
      );
    case "bars":
      return (
        <span
          className="inline-flex size-full items-center justify-center gap-[14%]"
          aria-hidden
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-[72%] w-[16%] shrink-0 animate-bounce rounded-full bg-current"
              style={{
                animationDelay: `${index * 120}ms`,
                animationDuration: "0.7s",
              }}
            />
          ))}
        </span>
      );
    case "pulse":
      return (
        <span className="relative size-full" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-30" />
          <span className="absolute inset-[22%] rounded-full bg-current" />
        </span>
      );
    case "apple":
      // 12 graduated spokes — classic iOS UIActivityIndicator
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          className="size-full animate-spin"
          style={{ animationDuration: "0.85s", animationTimingFunction: "steps(12)" }}
          aria-hidden
        >
          {Array.from({ length: 12 }, (_, index) => (
            <line
              key={index}
              x1="12"
              y1="2.5"
              x2="12"
              y2="6.5"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              transform={`rotate(${index * 30} 12 12)`}
              opacity={0.15 + (index / 11) * 0.85}
            />
          ))}
        </svg>
      );
    case "default":
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-full animate-spin"
          aria-hidden
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      );
  }
}

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      className,
      variant,
      size,
      type = "default",
      ...props
    },
    ref,
  ) => {
    const spinnerType = type ?? "default";

    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        data-slot="spinner"
        data-type={spinnerType}
        className={cn(spinnerVariants({ variant, size, type: spinnerType }), className)}
        {...props}
      >
        <SpinnerGlyph type={spinnerType} />
      </span>
    );
  },
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
