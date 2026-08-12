"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Box, Flex, Stack } from "./layout";

const bannerVariants = cva(
  [
    "relative w-full border px-4 py-3 text-sm",
    "[&_[data-slot=banner-icon]]:mt-0.5 [&_[data-slot=banner-icon]]:size-4 [&_[data-slot=banner-icon]]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-[color-mix(in_oklch,var(--primary)_40%,transparent)]",
          "bg-[color-mix(in_oklch,var(--primary)_12%,transparent)]",
          "text-foreground",
        ],
        info: [
          "border-[color-mix(in_oklch,oklch(0.65_0.14_240)_40%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.65_0.14_240)_12%,transparent)]",
        ],
        success: [
          "border-[color-mix(in_oklch,oklch(0.62_0.17_145)_40%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_12%,transparent)]",
        ],
        warning: [
          "border-[color-mix(in_oklch,oklch(0.78_0.16_75)_45%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.78_0.16_75)_14%,transparent)]",
        ],
        destructive: [
          "border-[color-mix(in_oklch,var(--destructive)_40%,transparent)]",
          "bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)]",
        ],
        chrome: [
          "glass-panel border-[var(--glass-chrome-border)]",
          "text-[var(--glass-chrome-fg)]",
        ],
      },
      position: {
        static: "rounded-2xl",
        sticky: "sticky top-0 z-[var(--z-sticky,40)] rounded-none border-x-0 border-t-0",
        fixed: "fixed inset-x-0 top-0 z-[var(--z-banner,50)] rounded-none border-x-0 border-t-0",
      },
      animated: {
        true: "animate-fade-in-up",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "static",
      animated: true,
    },
  },
);

export interface BannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof bannerVariants> {
  icon?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
  dismissible?: boolean;
  dismissLabel?: string;
  onDismiss?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
}

const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant,
      position,
      animated,
      icon,
      title,
      action,
      dismissible = false,
      dismissLabel = "Dismiss",
      onDismiss,
      open: openProp,
      defaultOpen = true,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp !== undefined ? openProp : uncontrolledOpen;
    if (!open) return null;

    const dismiss = () => {
      if (openProp === undefined) setUncontrolledOpen(false);
      onDismiss?.();
    };

    return (
      <Flex
        ref={ref as React.Ref<HTMLElement>}
        align="start"
        gap={3}
        role="status"
        data-slot="banner"
        data-variant={variant}
        className={cn(bannerVariants({ variant, position, animated }), className)}
        {...props}
      >
        {icon ? <Box data-slot="banner-icon" as="span" className="shrink-0">{icon}</Box> : null}
        <Stack data-slot="banner-body" gap={0.5} className="min-w-0 flex-1">
          {title ? (
            <Box data-slot="banner-title" className="font-semibold leading-snug">
              {title}
            </Box>
          ) : null}
          {children ? (
            <Box
              data-slot="banner-description"
              className="text-sm/relaxed glass-chrome-text-muted"
            >
              {children}
            </Box>
          ) : null}
        </Stack>
        {action ? (
          <Box data-slot="banner-action" className="shrink-0 self-center">
            {action}
          </Box>
        ) : null}
        {dismissible ? (
          <button
            type="button"
            data-slot="banner-dismiss"
            aria-label={dismissLabel}
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center self-start rounded-lg",
              "text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]",
              "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
              focusRing,
            )}
            onClick={dismiss}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6 6 18" strokeLinecap="round" />
              <path d="m6 6 12 12" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </Flex>
    );
  },
);
Banner.displayName = "Banner";

export { Banner, bannerVariants };
