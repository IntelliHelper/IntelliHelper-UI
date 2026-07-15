"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";

const agentCardVariants = cva(
  [
    "flex w-full flex-col gap-3 rounded-2xl border p-4",
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

export type AgentStatus = "idle" | "running" | "success" | "error" | "offline";

export interface AgentCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof agentCardVariants> {
  name: ReactNode;
  description?: ReactNode;
  status?: AgentStatus;
  avatar?: ReactNode;
  tools?: ReactNode;
  footer?: ReactNode;
}

const statusLabel: Record<AgentStatus, string> = {
  idle: "Idle",
  running: "Running",
  success: "Ready",
  error: "Error",
  offline: "Offline",
};

const AgentCard = forwardRef<HTMLDivElement, AgentCardProps>(
  (
    {
      className,
      variant,
      name,
      description,
      status = "idle",
      avatar,
      tools,
      footer,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-slot="agent-card"
      data-status={status}
      className={cn(agentCardVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {avatar ? (
          <div className="shrink-0" data-slot="agent-card-avatar">
            {avatar}
          </div>
        ) : (
          <div
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-primary"
          >
            {typeof name === "string" ? name.slice(0, 1).toUpperCase() : "A"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              data-slot="agent-card-name"
              className="truncate text-sm font-semibold text-[var(--glass-chrome-fg)]"
            >
              {name}
            </h3>
            <span
              data-slot="agent-card-status"
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                status === "running" && "bg-primary/15 text-primary",
                status === "success" &&
                  "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_16%,transparent)] text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
                status === "error" && "bg-destructive/15 text-destructive",
                (status === "idle" || status === "offline") &&
                  "bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)] text-muted-foreground",
              )}
            >
              {status === "running" ? (
                <span className="size-1.5 animate-pulse rounded-full bg-current" />
              ) : null}
              {statusLabel[status]}
            </span>
          </div>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {tools ? (
        <div data-slot="agent-card-tools" className="flex flex-wrap gap-1.5">
          {tools}
        </div>
      ) : null}
      {footer ? (
        <div
          data-slot="agent-card-footer"
          className="border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_60%,transparent)] pt-3"
        >
          {footer}
        </div>
      ) : null}
    </div>
  ),
);
AgentCard.displayName = "AgentCard";

export { AgentCard, agentCardVariants };
