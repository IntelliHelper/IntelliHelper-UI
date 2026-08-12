"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Box, Flex, Stack } from "./layout";

const bottomNavVariants = cva(
  [
    "w-full border-t px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5",
    "border-[var(--glass-chrome-border)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_78%,transparent)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-shadow)]",
  ],
  {
    variants: {
      position: {
        static: "relative",
        fixed: "fixed inset-x-0 bottom-0 z-[var(--z-nav,40)]",
      },
      size: {
        sm: "min-h-14",
        default: "min-h-16",
        lg: "min-h-[4.5rem]",
      },
    },
    defaultVariants: {
      position: "fixed",
      size: "default",
    },
  },
);

const bottomNavItemVariants = cva(
  [
    "relative min-w-0 flex-1 rounded-xl px-2 py-1.5",
    "text-[10px] font-medium glass-chrome-text-muted",
    "transition-[color,background,transform] duration-[var(--duration-normal)]",
    "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
    "data-[active=true]:text-primary",
    "active:scale-[0.98]",
    focusRing,
    "[&_svg]:size-5",
  ],
  {
    variants: {
      size: {
        sm: "text-[9px] [&_svg]:size-4",
        default: "text-[10px] [&_svg]:size-5",
        lg: "text-xs [&_svg]:size-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type BottomNavItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
};

export interface BottomNavigationProps
  extends Omit<HTMLAttributes<HTMLElement>, "children">,
    VariantProps<typeof bottomNavVariants> {
  items: BottomNavItem[];
  showLabels?: boolean;
}

const BottomNavigation = forwardRef<HTMLElement, BottomNavigationProps>(
  (
    {
      className,
      position,
      size = "default",
      items,
      showLabels = true,
      ...props
    },
    ref,
  ) => {
    return (
      <Flex
        ref={ref}
        as="nav"
        align="stretch"
        justify="around"
        gap={1}
        data-slot="bottom-navigation"
        aria-label="Bottom navigation"
        className={cn(bottomNavVariants({ position, size }), className)}
        {...props}
      >
        {items.map((item) => {
          const body = (
            <Stack align="center" justify="center" gap={0.5}>
              <Box as="span" className="relative inline-flex">
                {item.icon}
                {item.badge != null && item.badge !== false ? (
                  <Box
                    as="span"
                    data-slot="bottom-navigation-badge"
                    className="absolute -end-1.5 -top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground"
                  >
                    {item.badge}
                  </Box>
                ) : null}
              </Box>
              {showLabels ? (
                <Box as="span" className="max-w-full truncate">
                  {item.label}
                </Box>
              ) : (
                <Box as="span" className="sr-only">
                  {item.label}
                </Box>
              )}
            </Stack>
          );

          const sharedClass = cn(
            bottomNavItemVariants({ size }),
            item.disabled && "pointer-events-none opacity-40",
          );

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                aria-label={item.label}
                data-slot="bottom-navigation-item"
                data-active={item.active || undefined}
                aria-current={item.active ? "page" : undefined}
                className={sharedClass}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  item.onSelect?.();
                }}
              >
                {body}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              disabled={item.disabled}
              data-slot="bottom-navigation-item"
              data-active={item.active || undefined}
              aria-current={item.active ? "page" : undefined}
              className={sharedClass}
              onClick={() => item.onSelect?.()}
            >
              {body}
            </button>
          );
        })}
      </Flex>
    );
  },
);
BottomNavigation.displayName = "BottomNavigation";

export { BottomNavigation, bottomNavVariants, bottomNavItemVariants };
