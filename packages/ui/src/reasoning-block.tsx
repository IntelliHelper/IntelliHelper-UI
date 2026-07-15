"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const reasoningBlockVariants = cva(
  [
    "w-full overflow-hidden rounded-2xl border text-sm",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
        ],
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface ReasoningBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof reasoningBlockVariants> {
  title?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isStreaming?: boolean;
}

const ReasoningBlock = forwardRef<HTMLDivElement, ReasoningBlockProps>(
  (
    {
      className,
      variant,
      title = "Reasoning",
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      isStreaming = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState(defaultOpen);
    const open = openProp !== undefined ? openProp : uncontrolled;

    const setOpen = (next: boolean) => {
      if (openProp === undefined) {
        setUncontrolled(next);
      }
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        data-slot="reasoning-block"
        data-open={open || undefined}
        data-streaming={isStreaming || undefined}
        className={cn(reasoningBlockVariants({ variant }), className)}
        {...props}
      >
        <button
          type="button"
          data-slot="reasoning-block-trigger"
          aria-expanded={open}
          className={cn(
            "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide",
            "text-muted-foreground hover:text-[var(--glass-chrome-fg)]",
            focusRing,
          )}
          onClick={() => setOpen(!open)}
        >
          <span className="inline-flex items-center gap-2">
            {isStreaming ? (
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            ) : null}
            {title}
          </span>
          <span aria-hidden className="text-[10px] opacity-70">
            {open ? "Hide" : "Show"}
          </span>
        </button>
        {open ? (
          <div
            data-slot="reasoning-block-content"
            className="border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_60%,transparent)] px-3 py-2.5 text-sm leading-relaxed text-[var(--glass-chrome-fg)]"
          >
            {children}
          </div>
        ) : null}
      </div>
    );
  },
);
ReasoningBlock.displayName = "ReasoningBlock";

export { ReasoningBlock, reasoningBlockVariants };
