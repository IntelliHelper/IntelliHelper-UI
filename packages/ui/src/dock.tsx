"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Box, Flex } from "./layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const dockVariants = cva(
  [
    "inline-flex items-end rounded-2xl border p-2",
    "border-[var(--glass-chrome-border)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_70%, var(--glass-mix-into))]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-shadow)]",
  ],
  {
    variants: {
      size: {
        sm: "p-1.5",
        default: "p-2",
        lg: "p-2.5",
      },
      position: {
        bottom: "",
        floating: "fixed bottom-4 left-1/2 z-[var(--z-dock,40)] -translate-x-1/2",
      },
    },
    defaultVariants: {
      size: "default",
      position: "bottom",
    },
  },
);

const dockItemVariants = cva(
  [
    "relative inline-flex items-center justify-center rounded-xl",
    "text-[var(--glass-chrome-fg)]",
    "transition-[transform,background] duration-[var(--duration-normal)]",
    "[transition-timing-function:var(--ease-spring)]",
    "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_50%, var(--glass-mix-into))]",
    "data-[active=true]:bg-[color-mix(in_oklch,var(--primary)_22%,transparent)]",
    "data-[active=true]:text-primary",
    focusRing,
  ],
  {
    variants: {
      size: {
        sm: "size-10 [&_svg]:size-5",
        default: "size-12 [&_svg]:size-6",
        lg: "size-14 [&_svg]:size-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type DockItem = {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
  onSelect?: () => void;
  active?: boolean;
  disabled?: boolean;
};

export interface DockProps
  extends Omit<HTMLAttributes<HTMLElement>, "children">,
    VariantProps<typeof dockVariants> {
  items: DockItem[];
  magnify?: boolean;
  showLabels?: boolean;
}

const Dock = forwardRef<HTMLElement, DockProps>(
  (
    {
      className,
      size = "default",
      position,
      items,
      magnify = true,
      showLabels = true,
      ...props
    },
    ref,
  ) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const gap = size === "sm" ? 0.5 : size === "lg" ? 1.5 : 1;

    const scaleFor = (index: number): number => {
      if (!magnify || hoverIndex === null) return 1;
      const dist = Math.abs(index - hoverIndex);
      if (dist === 0) return 1.28;
      if (dist === 1) return 1.12;
      return 1;
    };

    return (
      <TooltipProvider delayDuration={200}>
        <Flex
          ref={ref}
          as="nav"
          align="end"
          gap={gap as 0.5 | 1 | 1.5}
          data-slot="dock"
          aria-label="Dock"
          className={cn(dockVariants({ size, position }), className)}
          onMouseLeave={() => setHoverIndex(null)}
          {...props}
        >
          {items.map((item, index) => {
            const scale = scaleFor(index);
            const content = (
              <Box
                as="span"
                className={cn(
                  dockItemVariants({ size }),
                  item.disabled && "pointer-events-none opacity-40",
                )}
                data-active={item.active || undefined}
                style={{
                  transform: `scale(${scale}) translateY(${scale > 1 ? -4 * (scale - 1) * 10 : 0}px)`,
                }}
              >
                {item.icon}
                {item.active ? (
                  <Box
                    as="span"
                    className="absolute -bottom-0.5 size-1 rounded-full bg-primary"
                    aria-hidden
                  />
                ) : null}
              </Box>
            );

            const interactive = item.href ? (
              <a
                href={item.href}
                aria-label={item.label}
                aria-current={item.active ? "page" : undefined}
                data-slot="dock-item"
                className="outline-none"
                onMouseEnter={() => setHoverIndex(index)}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  item.onSelect?.();
                }}
              >
                {content}
              </a>
            ) : (
              <button
                type="button"
                aria-label={item.label}
                aria-current={item.active ? "true" : undefined}
                data-slot="dock-item"
                disabled={item.disabled}
                className="outline-none"
                onMouseEnter={() => setHoverIndex(index)}
                onClick={() => item.onSelect?.()}
              >
                {content}
              </button>
            );

            if (!showLabels) return <Box key={item.id} as="span">{interactive}</Box>;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>{interactive}</TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </Flex>
      </TooltipProvider>
    );
  },
);
Dock.displayName = "Dock";

export { Dock, dockVariants, dockItemVariants };
