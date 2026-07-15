"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";

const typingIndicatorVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-2",
  {
    variants: {
      variant: {
        chrome: [
          "border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_50%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
        ],
        ghost: "bg-transparent px-1",
      },
      size: {
        sm: "gap-0.5 px-2 py-1 [&_[data-dot]]:size-1",
        default: "gap-1 px-3 py-2 [&_[data-dot]]:size-1.5",
        lg: "gap-1.5 px-4 py-2.5 [&_[data-dot]]:size-2",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

export interface TypingIndicatorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof typingIndicatorVariants> {
  label?: string;
}

const TypingIndicator = forwardRef<HTMLDivElement, TypingIndicatorProps>(
  (
    {
      className,
      variant,
      size,
      label = "Assistant is typing",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-slot="typing-indicator"
      role="status"
      aria-label={label}
      className={cn(typingIndicatorVariants({ variant, size }), className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          data-dot
          className="size-1.5 animate-bounce rounded-full bg-[var(--glass-chrome-fg)] opacity-70"
          style={{ animationDelay: `${index * 120}ms` }}
          aria-hidden
        />
      ))}
    </div>
  ),
);
TypingIndicator.displayName = "TypingIndicator";

export { TypingIndicator, typingIndicatorVariants };
