"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@intelli/utils";
import { Box, Flex, Stack } from "./layout";

const calloutVariants = cva("relative w-full rounded-2xl border px-4 py-3.5 text-sm", {
  variants: {
    variant: {
      info: [
        "border-[color-mix(in_oklch,oklch(0.65_0.14_240)_35%,transparent)]",
        "bg-[color-mix(in_oklch,oklch(0.65_0.14_240)_10%,transparent)]",
        "[&_[data-slot=callout-icon]]:text-[color-mix(in_oklch,oklch(0.55_0.14_240)_90%,var(--foreground))]",
      ],
      tip: [
        "border-[color-mix(in_oklch,oklch(0.62_0.17_145)_35%,transparent)]",
        "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_10%,transparent)]",
        "[&_[data-slot=callout-icon]]:text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
      ],
      warning: [
        "border-[color-mix(in_oklch,oklch(0.78_0.16_75)_40%,transparent)]",
        "bg-[color-mix(in_oklch,oklch(0.78_0.16_75)_12%,transparent)]",
        "[&_[data-slot=callout-icon]]:text-[color-mix(in_oklch,oklch(0.65_0.16_75)_90%,var(--foreground))]",
      ],
      danger: [
        "border-[color-mix(in_oklch,var(--destructive)_35%,transparent)]",
        "bg-[color-mix(in_oklch,var(--destructive)_10%,transparent)]",
        "[&_[data-slot=callout-icon]]:text-destructive",
      ],
      note: [
        "border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
        "[&_[data-slot=callout-icon]]:text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]",
      ],
    },
    animated: {
      true: "animate-fade-in-up",
      false: "",
    },
  },
  defaultVariants: {
    variant: "info",
    animated: true,
  },
});

function DefaultIcon({ variant }: { variant: NonNullable<CalloutProps["variant"]> }) {
  const paths: Record<string, ReactNode> = {
    info: <path d="M12 16v-4M12 8h.01" />,
    tip: <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />,
    warning: (
      <>
        <path d="m12 9 0 4" />
        <path d="M12 17h.01" />
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.8-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      </>
    ),
    danger: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
    note: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden
    >
      {variant === "info" ? <circle cx="12" cy="12" r="10" /> : null}
      {paths[variant ?? "info"]}
    </svg>
  );
}

export interface CalloutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof calloutVariants> {
  title?: ReactNode;
  icon?: ReactNode | null;
}

const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      variant = "info",
      animated,
      title,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const resolved = variant ?? "info";
    return (
      <Flex
        ref={ref as React.Ref<HTMLElement>}
        align="start"
        gap={3}
        role="note"
        data-slot="callout"
        data-variant={resolved}
        className={cn(calloutVariants({ variant: resolved, animated }), className)}
        {...props}
      >
        {icon !== null ? (
          <Box data-slot="callout-icon" as="span" className="mt-0.5 shrink-0">
            {icon === undefined ? <DefaultIcon variant={resolved} /> : icon}
          </Box>
        ) : null}
        <Stack gap={1} className="min-w-0 flex-1">
          {title ? (
            <Box data-slot="callout-title" className="font-semibold leading-snug">
              {title}
            </Box>
          ) : null}
          {children ? (
            <Box
              data-slot="callout-body"
              className="text-sm/relaxed glass-chrome-text-muted [&_a]:underline [&_a]:underline-offset-4"
            >
              {children}
            </Box>
          ) : null}
        </Stack>
      </Flex>
    );
  },
);
Callout.displayName = "Callout";

export { Callout, calloutVariants };
