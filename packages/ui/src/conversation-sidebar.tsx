"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  sortConversations,
  type ConversationItem,
} from "./ai-utils";

export type { ConversationItem };

const conversationSidebarVariants = cva(
  [
    "flex h-full w-full flex-col overflow-hidden rounded-2xl border",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
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

export interface ConversationSidebarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onSelect">,
    VariantProps<typeof conversationSidebarVariants> {
  conversations: ConversationItem[];
  activeId?: string;
  onSelect?: (conversation: ConversationItem) => void;
  onNewChat?: () => void;
  title?: ReactNode;
  emptyMessage?: ReactNode;
  headerAction?: ReactNode;
}

const ConversationSidebar = forwardRef<HTMLDivElement, ConversationSidebarProps>(
  (
    {
      className,
      variant,
      conversations,
      activeId,
      onSelect,
      onNewChat,
      title = "Conversations",
      emptyMessage = "No conversations yet",
      headerAction,
      ...props
    },
    ref,
  ) => {
    const sorted = useMemo(
      () => sortConversations(conversations),
      [conversations],
    );

    return (
      <div
        ref={ref}
        data-slot="conversation-sidebar"
        className={cn(conversationSidebarVariants({ variant }), className)}
        {...props}
      >
        <div
          data-slot="conversation-sidebar-header"
          className="flex items-center justify-between gap-2 border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] px-3 py-2.5"
        >
          <h3 className="truncate text-sm font-semibold text-[var(--glass-chrome-fg)]">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            {headerAction}
            {onNewChat ? (
              <button
                type="button"
                data-slot="conversation-sidebar-new"
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium",
                  "bg-primary/15 text-primary hover:bg-primary/25",
                  focusRing,
                )}
                onClick={onNewChat}
              >
                New
              </button>
            ) : null}
          </div>
        </div>
        <ul
          data-slot="conversation-sidebar-list"
          className="flex-1 overflow-y-auto p-1"
          role="list"
        >
          {sorted.length === 0 ? (
            <li className="px-3 py-8 text-center text-xs text-muted-foreground">
              {emptyMessage}
            </li>
          ) : (
            sorted.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    data-slot="conversation-sidebar-item"
                    data-active={active || undefined}
                    data-pinned={item.pinned || undefined}
                    className={cn(
                      "flex w-full flex-col items-start gap-0.5 rounded-xl px-2.5 py-2 text-left text-sm",
                      "hover:bg-[color-mix(in_oklch,var(--foreground)_7%,transparent)]",
                      active &&
                        "bg-[color-mix(in_oklch,var(--primary)_12%,transparent)] font-medium text-primary",
                      focusRing,
                    )}
                    onClick={() => onSelect?.(item)}
                  >
                    <span className="flex w-full items-center gap-1.5">
                      {item.pinned ? (
                        <span aria-hidden className="text-[10px] opacity-70">
                          📌
                        </span>
                      ) : null}
                      <span className="truncate">{item.title}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatUpdatedAt(item.updatedAt)}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  },
);
ConversationSidebar.displayName = "ConversationSidebar";

function formatUpdatedAt(timestamp: number): string {
  const delta = Date.now() - timestamp;
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export {
  ConversationSidebar,
  conversationSidebarVariants,
  sortConversations,
};
