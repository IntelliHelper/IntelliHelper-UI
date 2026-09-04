"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Box, Flex, Stack } from "./layout";
import { ScrollArea } from "./scroll-area";

const activityFeedVariants = cva(
  [
    "w-full rounded-2xl border",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%, var(--glass-mix-into))]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        outline: "bg-transparent",
        plain: "border-0 bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export type ActivityItem = {
  id: string;
  actor: string;
  action: ReactNode;
  target?: ReactNode;
  timestamp?: ReactNode;
  avatarSrc?: string;
  avatarFallback?: string;
  meta?: ReactNode;
};

export interface ActivityFeedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof activityFeedVariants> {
  items: ActivityItem[];
  title?: ReactNode;
  emptyMessage?: ReactNode;
  maxHeight?: string | number;
  onItemClick?: (item: ActivityItem) => void;
}

const ActivityFeed = forwardRef<HTMLDivElement, ActivityFeedProps>(
  (
    {
      className,
      variant,
      items,
      title = "Activity",
      emptyMessage = "No recent activity.",
      maxHeight = 360,
      onItemClick,
      ...props
    },
    ref,
  ) => {
    const height =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    return (
      <Stack
        ref={ref as React.Ref<HTMLElement>}
        gap={0}
        data-slot="activity-feed"
        className={cn(activityFeedVariants({ variant }), className)}
        {...props}
      >
        {title ? (
          <Box
            data-slot="activity-feed-header"
            className="border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_55%,transparent)] px-4 py-3 text-sm font-semibold"
          >
            {title}
          </Box>
        ) : null}
        <ScrollArea style={{ height }} className="w-full">
          <Box
            as="ul"
            data-slot="activity-feed-list"
            className="divide-y divide-[color-mix(in_oklch,var(--glass-chrome-border)_35%,transparent)] p-0"
          >
            {items.length === 0 ? (
              <Box
                as="li"
                className="px-4 py-8 text-center text-sm glass-chrome-text-muted"
              >
                {emptyMessage}
              </Box>
            ) : (
              items.map((item) => (
                <Box as="li" key={item.id}>
                  <button
                    type="button"
                    data-slot="activity-feed-item"
                    disabled={!onItemClick}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors",
                      onItemClick &&
                        "cursor-pointer hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%, var(--glass-mix-into))]",
                      !onItemClick && "cursor-default",
                    )}
                    onClick={() => onItemClick?.(item)}
                  >
                    <Flex align="start" gap={3} className="w-full">
                      <Avatar size="sm">
                        {item.avatarSrc ? (
                          <AvatarImage src={item.avatarSrc} alt={item.actor} />
                        ) : null}
                        <AvatarFallback>
                          {item.avatarFallback ??
                            item.actor
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Stack gap={0.5} className="min-w-0 flex-1">
                        <Box as="p" className="text-sm leading-snug">
                          <span className="font-semibold">{item.actor}</span>{" "}
                          <span className="glass-chrome-text-muted">{item.action}</span>
                          {item.target ? (
                            <>
                              {" "}
                              <span className="font-medium">{item.target}</span>
                            </>
                          ) : null}
                        </Box>
                        {item.meta ? (
                          <Box className="text-xs glass-chrome-text-muted">
                            {item.meta}
                          </Box>
                        ) : null}
                        {item.timestamp ? (
                          <Box
                            as="time"
                            className="text-xs tabular-nums glass-chrome-text-muted"
                          >
                            {item.timestamp}
                          </Box>
                        ) : null}
                      </Stack>
                    </Flex>
                  </button>
                </Box>
              ))
            )}
          </Box>
        </ScrollArea>
      </Stack>
    );
  },
);
ActivityFeed.displayName = "ActivityFeed";

export { ActivityFeed, activityFeedVariants };
