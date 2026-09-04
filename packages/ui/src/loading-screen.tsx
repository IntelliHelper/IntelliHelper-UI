"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@intelli/utils";
import { Box, Stack } from "./layout";
import { Spinner, type SpinnerProps } from "./spinner";

const loadingScreenVariants = cva("text-center", {
  variants: {
    variant: {
      fullscreen: [
        "fixed inset-0 z-[var(--z-overlay,50)]",
        "bg-[color-mix(in_oklch,var(--background)_72%,transparent)]",
        "backdrop-blur-md",
      ],
      overlay: [
        "absolute inset-0 z-10 rounded-[inherit]",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%, var(--glass-mix-into))]",
        "backdrop-blur-sm",
      ],
      inline:
        "relative min-h-[12rem] w-full rounded-2xl border border-dashed border-[var(--glass-chrome-border)] p-8",
      panel: [
        "relative min-h-[12rem] w-full rounded-2xl p-8",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%, var(--glass-mix-into))]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
        "border border-[var(--glass-chrome-border)]",
        "shadow-[var(--glass-chrome-shadow)]",
      ],
    },
    animated: {
      true: "animate-fade-in-up",
      false: "",
    },
  },
  defaultVariants: {
    variant: "inline",
    animated: true,
  },
});

export interface LoadingScreenProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingScreenVariants> {
  label?: ReactNode;
  description?: ReactNode;
  spinnerType?: SpinnerProps["type"];
  spinnerSize?: SpinnerProps["size"];
  icon?: ReactNode;
}

const LoadingScreen = forwardRef<HTMLDivElement, LoadingScreenProps>(
  (
    {
      className,
      variant,
      animated,
      label = "Loading…",
      description,
      spinnerType = "ring",
      spinnerSize = "lg",
      icon,
      ...props
    },
    ref,
  ) => {
    return (
      <Stack
        ref={ref as React.Ref<HTMLElement>}
        align="center"
        justify="center"
        gap={4}
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-slot="loading-screen"
        className={cn(loadingScreenVariants({ variant, animated }), className)}
        {...props}
      >
        {icon ?? (
          <Spinner
            type={spinnerType}
            size={spinnerSize}
            variant="primary"
            aria-hidden
          />
        )}
        {label ? (
          <Box data-slot="loading-screen-label" className="text-sm font-semibold">
            {label}
          </Box>
        ) : null}
        {description ? (
          <Box
            as="p"
            data-slot="loading-screen-description"
            className="max-w-sm text-sm glass-chrome-text-muted"
          >
            {description}
          </Box>
        ) : null}
      </Stack>
    );
  },
);
LoadingScreen.displayName = "LoadingScreen";

export { LoadingScreen, loadingScreenVariants };
