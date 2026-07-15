"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";

export type ChatRole = "user" | "assistant" | "system";

const aiChatVariants = cva(
  "flex w-full flex-col gap-3 rounded-2xl border border-[var(--glass-chrome-border)] p-3 md:p-4",
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_36%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        outline: "bg-transparent",
        ghost: "border-transparent bg-transparent p-0 shadow-none",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

const chatBubbleVariants = cva(
  [
    "max-w-[min(100%,42rem)] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
    "border shadow-[var(--glass-chrome-inset)]",
  ],
  {
    variants: {
      role: {
        user: [
          "ml-auto border-[color-mix(in_oklch,var(--primary)_35%,transparent)]",
          "bg-[color-mix(in_oklch,var(--primary)_16%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
        ],
        assistant: [
          "mr-auto border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
        ],
        system: [
          "mx-auto border-dashed border-[var(--glass-chrome-border)]",
          "bg-transparent text-center text-xs text-muted-foreground",
        ],
      },
    },
    defaultVariants: {
      role: "assistant",
    },
  },
);

export interface AIChatProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aiChatVariants> {}

const AIChat = forwardRef<HTMLDivElement, AIChatProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="ai-chat"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className={cn(aiChatVariants({ variant }), className)}
      {...props}
    />
  ),
);
AIChat.displayName = "AIChat";

export interface ChatBubbleProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants> {
  role?: ChatRole;
  name?: ReactNode;
  avatar?: ReactNode;
  footer?: ReactNode;
}

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, role = "assistant", name, avatar, footer, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="chat-bubble"
      data-role={role}
      className={cn(
        "flex w-full gap-2",
        role === "user" ? "justify-end" : role === "system" ? "justify-center" : "justify-start",
        className,
      )}
      {...props}
    >
      {avatar && role !== "user" ? (
        <div className="mt-0.5 shrink-0">{avatar}</div>
      ) : null}
      <div className={cn(chatBubbleVariants({ role }), "min-w-0")}>
        {name ? (
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {name}
          </div>
        ) : null}
        <div data-slot="chat-bubble-content">{children}</div>
        {footer ? (
          <div className="mt-2 border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_50%,transparent)] pt-2">
            {footer}
          </div>
        ) : null}
      </div>
      {avatar && role === "user" ? (
        <div className="mt-0.5 shrink-0">{avatar}</div>
      ) : null}
    </div>
  ),
);
ChatBubble.displayName = "ChatBubble";

export type UserMessageProps = Omit<ChatBubbleProps, "role">;
const UserMessage = forwardRef<HTMLDivElement, UserMessageProps>(
  (props, ref) => <ChatBubble ref={ref} role="user" name={props.name ?? "You"} {...props} />,
);
UserMessage.displayName = "UserMessage";

export type AssistantMessageProps = Omit<ChatBubbleProps, "role">;
const AssistantMessage = forwardRef<HTMLDivElement, AssistantMessageProps>(
  (props, ref) => (
    <ChatBubble ref={ref} role="assistant" name={props.name ?? "Assistant"} {...props} />
  ),
);
AssistantMessage.displayName = "AssistantMessage";

export {
  AIChat,
  ChatBubble,
  UserMessage,
  AssistantMessage,
  aiChatVariants,
  chatBubbleVariants,
};
