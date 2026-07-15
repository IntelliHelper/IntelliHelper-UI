"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  countUnread,
  dismissAllNotifications,
  dismissNotification,
  filterNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  sortNotifications,
  type NotificationItem,
  type NotificationStatus,
} from "./notification-utils";

export type { NotificationItem, NotificationStatus };

const notificationCenterVariants = cva(
  [
    "flex w-full flex-col overflow-hidden rounded-2xl border",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_42%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface NotificationCenterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "title">,
    VariantProps<typeof notificationCenterVariants> {
  items?: NotificationItem[];
  defaultItems?: NotificationItem[];
  onItemsChange?: (items: NotificationItem[]) => void;
  title?: ReactNode;
  emptyMessage?: ReactNode;
  unreadFirst?: boolean;
  filterStatus?: NotificationStatus | "all";
  onItemClick?: (item: NotificationItem) => void;
  showMarkAllRead?: boolean;
  showDismissAll?: boolean;
}

const NotificationCenter = forwardRef<HTMLDivElement, NotificationCenterProps>(
  (
    {
      className,
      variant,
      items: itemsProp,
      defaultItems = [],
      onItemsChange,
      title = "Notifications",
      emptyMessage = "You're all caught up.",
      unreadFirst = true,
      filterStatus = "all",
      onItemClick,
      showMarkAllRead = true,
      showDismissAll = true,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] =
      useState<NotificationItem[]>(defaultItems);
    const items = itemsProp !== undefined ? itemsProp : uncontrolled;

    const setItems = useCallback(
      (next: NotificationItem[]) => {
        if (itemsProp === undefined) {
          setUncontrolled(next);
        }
        onItemsChange?.(next);
      },
      [itemsProp, onItemsChange],
    );

    const visible = useMemo(() => {
      const filtered = filterNotifications(items, { status: filterStatus });
      return sortNotifications(filtered, { unreadFirst });
    }, [filterStatus, items, unreadFirst]);

    const unread = countUnread(items);

    return (
      <div
        ref={ref}
        data-slot="notification-center"
        className={cn(notificationCenterVariants({ variant }), className)}
        {...props}
      >
        <div
          data-slot="notification-center-header"
          className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-[var(--glass-chrome-fg)]">
              {title}
            </h3>
            {unread > 0 ? (
              <span
                data-slot="notification-center-badge"
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  "bg-primary text-primary-foreground",
                )}
              >
                {unread}
              </span>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {showMarkAllRead ? (
              <button
                type="button"
                data-slot="notification-mark-all-read"
                disabled={unread === 0}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground",
                  "hover:text-[var(--glass-chrome-fg)] disabled:opacity-40",
                  focusRing,
                )}
                onClick={() => setItems(markAllNotificationsRead(items))}
              >
                Mark all read
              </button>
            ) : null}
            {showDismissAll ? (
              <button
                type="button"
                data-slot="notification-dismiss-all"
                disabled={items.length === 0}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground",
                  "hover:text-[var(--glass-chrome-fg)] disabled:opacity-40",
                  focusRing,
                )}
                onClick={() => setItems(dismissAllNotifications())}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
        <ul
          data-slot="notification-center-list"
          className="max-h-80 overflow-y-auto p-1"
          role="list"
        >
          {visible.length === 0 ? (
            <li className="px-3 py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </li>
          ) : (
            visible.map((item) => {
              const unreadItem = item.status === "unread";
              return (
                <li key={item.id} role="listitem">
                  <div
                    data-slot="notification-item"
                    data-status={item.status}
                    className={cn(
                      "group flex gap-3 rounded-xl px-3 py-2.5 transition-colors",
                      "hover:bg-[color-mix(in_oklch,var(--foreground)_6%,transparent)]",
                      unreadItem &&
                        "bg-[color-mix(in_oklch,var(--primary)_8%,transparent)]",
                    )}
                  >
                    <button
                      type="button"
                      className={cn(
                        "min-w-0 flex-1 text-left outline-none",
                        focusRing,
                      )}
                      onClick={() => {
                        if (unreadItem) {
                          setItems(markNotificationRead(items, item.id));
                        }
                        onItemClick?.(item);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {unreadItem ? (
                          <span
                            aria-hidden
                            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                          />
                        ) : (
                          <span aria-hidden className="mt-1.5 size-1.5 shrink-0" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-[var(--glass-chrome-fg)]">
                            {item.title}
                          </span>
                          {item.description ? (
                            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          ) : null}
                          <span className="mt-1 block text-[10px] text-muted-foreground">
                            {formatRelativeTime(item.createdAt)}
                            {item.category ? ` · ${item.category}` : ""}
                          </span>
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      aria-label={`Dismiss ${item.title}`}
                      data-slot="notification-dismiss"
                      className={cn(
                        "mt-0.5 size-7 shrink-0 rounded-lg opacity-0 transition-opacity",
                        "text-muted-foreground hover:text-[var(--glass-chrome-fg)]",
                        "group-hover:opacity-100 focus-visible:opacity-100",
                        focusRing,
                      )}
                      onClick={() =>
                        setItems(dismissNotification(items, item.id))
                      }
                    >
                      ×
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  },
);
NotificationCenter.displayName = "NotificationCenter";

function formatRelativeTime(timestamp: number): string {
  const delta = Date.now() - timestamp;
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export {
  NotificationCenter,
  notificationCenterVariants,
  countUnread,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
  dismissAllNotifications,
  sortNotifications,
  filterNotifications,
};
