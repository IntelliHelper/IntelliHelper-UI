"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import { Box, Flex, Split, Stack } from "./layout";
import type { TimelineStatus } from "./tier3-utils";

const timelineVariants = cva("relative w-full", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const dotVariants = cva(
  "relative z-[1] flex shrink-0 items-center justify-center rounded-full border-2 bg-[var(--background)]",
  {
    variants: {
      status: {
        default: "border-[var(--glass-chrome-border)] text-muted-foreground",
        success:
          "border-[color-mix(in_oklch,oklch(0.62_0.17_145)_70%,transparent)] text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
        warning:
          "border-[color-mix(in_oklch,oklch(0.78_0.16_75)_70%,transparent)] text-[color-mix(in_oklch,oklch(0.65_0.16_75)_90%,var(--foreground))]",
        error: "border-destructive/70 text-destructive",
        active:
          "border-primary text-primary shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_18%,transparent)]",
      },
      size: {
        sm: "size-3 [&_svg]:size-2",
        default: "size-4 [&_svg]:size-2.5",
        lg: "size-5 [&_svg]:size-3",
      },
    },
    defaultVariants: {
      status: "default",
      size: "default",
    },
  },
);

export type TimelineItemData = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  status?: TimelineStatus;
  icon?: ReactNode;
  content?: ReactNode;
};

export interface TimelineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  items: TimelineItemData[];
  alternate?: boolean;
}

export interface TimelineItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof dotVariants> {
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: ReactNode;
  isLast?: boolean;
}

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  (
    {
      className,
      title,
      description,
      timestamp,
      status = "default",
      size = "default",
      icon,
      isLast,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Flex
        ref={ref as React.Ref<HTMLElement>}
        align="start"
        gap={3}
        data-slot="timeline-item"
        data-status={status}
        className={cn("relative pb-8 last:pb-0", className)}
        {...props}
      >
        <Stack align="center" gap={0} className="relative">
          <Box
            as="span"
            className={cn(dotVariants({ status, size }))}
            data-slot="timeline-dot"
          >
            {icon}
          </Box>
          {!isLast ? (
            <Box
              as="span"
              data-slot="timeline-connector"
              className="absolute top-4 bottom-0 w-px grow bg-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)]"
              aria-hidden
            />
          ) : null}
        </Stack>
        <Stack gap={1} className="min-w-0 flex-1 pt-0.5">
          <Split align="baseline" gap={2} wrap className="w-full">
            <Box data-slot="timeline-title" className="font-semibold leading-snug">
              {title}
            </Box>
            {timestamp ? (
              <Box
                as="time"
                data-slot="timeline-timestamp"
                className="shrink-0 text-xs tabular-nums glass-chrome-text-muted"
              >
                {timestamp}
              </Box>
            ) : null}
          </Split>
          {description ? (
            <Box
              data-slot="timeline-description"
              className="text-sm/relaxed glass-chrome-text-muted"
            >
              {description}
            </Box>
          ) : null}
          {children}
        </Stack>
      </Flex>
    );
  },
);
TimelineItem.displayName = "TimelineItem";

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, size, items, alternate, ...props }, ref) => {
    return (
      <Stack
        ref={ref as React.Ref<HTMLElement>}
        gap={0}
        data-slot="timeline"
        data-alternate={alternate || undefined}
        className={cn(timelineVariants({ size }), className)}
        {...props}
      >
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            title={item.title}
            description={item.description}
            timestamp={item.timestamp}
            status={item.status}
            size={size}
            icon={item.icon}
            isLast={index === items.length - 1}
          >
            {item.content}
          </TimelineItem>
        ))}
      </Stack>
    );
  },
);
Timeline.displayName = "Timeline";

export { Timeline, TimelineItem, timelineVariants, dotVariants };
