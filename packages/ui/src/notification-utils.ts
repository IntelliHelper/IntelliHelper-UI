/**
 * Pure inbox/notification list ops — distinct from toast (ephemeral).
 */

export type NotificationStatus = "unread" | "read";

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  createdAt: number;
  status: NotificationStatus;
  href?: string;
  category?: string;
};

export function countUnread(items: readonly NotificationItem[]): number {
  return items.filter((item) => item.status === "unread").length;
}

export function markNotificationRead(
  items: readonly NotificationItem[],
  id: string,
): NotificationItem[] {
  return items.map((item) =>
    item.id === id ? { ...item, status: "read" as const } : item,
  );
}

export function markAllNotificationsRead(
  items: readonly NotificationItem[],
): NotificationItem[] {
  return items.map((item) =>
    item.status === "unread" ? { ...item, status: "read" as const } : item,
  );
}

export function dismissNotification(
  items: readonly NotificationItem[],
  id: string,
): NotificationItem[] {
  return items.filter((item) => item.id !== id);
}

export function dismissAllNotifications(): NotificationItem[] {
  return [];
}

/**
 * Sort newest-first by `createdAt`. Unread items can optionally float first.
 */
export function sortNotifications(
  items: readonly NotificationItem[],
  options?: { unreadFirst?: boolean },
): NotificationItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    if (options?.unreadFirst) {
      if (a.status !== b.status) {
        return a.status === "unread" ? -1 : 1;
      }
    }
    return b.createdAt - a.createdAt;
  });
  return copy;
}

/** Filter by status and optional category. */
export function filterNotifications(
  items: readonly NotificationItem[],
  filter: {
    status?: NotificationStatus | "all";
    category?: string;
  },
): NotificationItem[] {
  return items.filter((item) => {
    if (filter.status && filter.status !== "all" && item.status !== filter.status) {
      return false;
    }
    if (filter.category && item.category !== filter.category) {
      return false;
    }
    return true;
  });
}
