"use client";

import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, focusRing } from "@intelli/utils";
import { Flex } from "./layout";
import { clampRating, ratingStars } from "./tier3-utils";

const ratingVariants = cva("", {
  variants: {
    size: {
      sm: "[&_button]:size-6 [&_svg]:size-4",
      default: "[&_button]:size-8 [&_svg]:size-5",
      lg: "[&_button]:size-10 [&_svg]:size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function StarIcon({
  fill,
  className,
}: {
  fill: "full" | "half" | "empty";
  className?: string;
}) {
  const gradId = useId();
  if (fill === "half") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <defs>
          <linearGradient id={gradId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M12 2.5l2.9 6.2 6.8.6-5.2 4.5 1.6 6.6L12 16.8 5.9 20.4l1.6-6.6L2.3 9.3l6.8-.6L12 2.5z"
          fill={`url(#${gradId})`}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 2.5l2.9 6.2 6.8.6-5.2 4.5 1.6 6.6L12 16.8 5.9 20.4l1.6-6.6L2.3 9.3l6.8-.6L12 2.5z"
        fill={fill === "full" ? "currentColor" : "transparent"}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface RatingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof ratingVariants> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  allowHalf?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  name?: string;
  /** Accessible name for the group. */
  "aria-label"?: string;
}

const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      size,
      value: valueProp,
      defaultValue = 0,
      onValueChange,
      max = 5,
      allowHalf = false,
      readOnly = false,
      disabled = false,
      name,
      "aria-label": ariaLabel = "Rating",
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [hover, setHover] = useState<number | null>(null);
    const value =
      valueProp !== undefined
        ? clampRating(valueProp, max, allowHalf)
        : clampRating(uncontrolled, max, allowHalf);
    const display = hover !== null ? hover : value;
    const stars = ratingStars(display, max);

    const commit = (next: number) => {
      const clamped = clampRating(next, max, allowHalf);
      if (valueProp === undefined) setUncontrolled(clamped);
      onValueChange?.(clamped);
    };

    const interactive = !readOnly && !disabled;

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (!interactive) return;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        commit(value + (allowHalf ? 0.5 : 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        commit(value - (allowHalf ? 0.5 : 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        commit(0);
      } else if (e.key === "End") {
        e.preventDefault();
        commit(max);
      }
      onKeyDown?.(e);
    };

    return (
      <Flex
        ref={ref as React.Ref<HTMLElement>}
        align="center"
        gap={0.5}
        data-slot="rating"
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} of ${max}`}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        tabIndex={interactive ? 0 : -1}
        className={cn(
          ratingVariants({ size }),
          disabled && "opacity-50",
          interactive && focusRing,
          "rounded-lg",
          className,
        )}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHover(null)}
        {...props}
      >
        {name ? <input type="hidden" name={name} value={value} /> : null}
        {stars.map((fill, index) => {
          const starIndex = index + 1;
          return (
            <button
              key={starIndex}
              type="button"
              data-slot="rating-star"
              tabIndex={-1}
              disabled={!interactive}
              aria-label={`${starIndex} star${starIndex === 1 ? "" : "s"}`}
              className={cn(
                "inline-flex items-center justify-center rounded-md transition-colors",
                fill === "empty"
                  ? "text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]"
                  : "text-amber-400",
                interactive &&
                  "hover:text-amber-300 active:scale-95 disabled:pointer-events-none",
              )}
              onMouseEnter={() => interactive && setHover(starIndex)}
              onClick={() => {
                if (!interactive) return;
                if (!allowHalf && value === starIndex) commit(0);
                else commit(starIndex);
              }}
            >
              <StarIcon fill={fill} />
            </button>
          );
        })}
      </Flex>
    );
  },
);
Rating.displayName = "Rating";

export { Rating, ratingVariants };
