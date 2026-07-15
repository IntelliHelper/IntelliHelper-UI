"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";

const mcpServerCardVariants = cva(
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

export type McpServerStatus = "connected" | "connecting" | "disconnected" | "error";

export interface McpServerCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mcpServerCardVariants> {
  name: ReactNode;
  transport?: ReactNode;
  url?: ReactNode;
  status?: McpServerStatus;
  toolsCount?: number;
  resourcesCount?: number;
  footer?: ReactNode;
}

const McpServerCard = forwardRef<HTMLDivElement, McpServerCardProps>(
  (
    {
      className,
      variant,
      name,
      transport = "stdio",
      url,
      status = "disconnected",
      toolsCount,
      resourcesCount,
      footer,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-slot="mcp-server-card"
      data-status={status}
      className={cn(mcpServerCardVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            data-slot="mcp-server-card-name"
            className="truncate text-sm font-semibold text-[var(--glass-chrome-fg)]"
          >
            {name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span data-slot="mcp-server-card-transport">{transport}</span>
            {url ? (
              <>
                <span aria-hidden>·</span>
                <span className="truncate font-mono text-[11px]">{url}</span>
              </>
            ) : null}
          </div>
        </div>
        <span
          data-slot="mcp-server-card-status"
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
            status === "connected" &&
              "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_16%,transparent)] text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
            status === "connecting" && "bg-primary/15 text-primary",
            status === "error" && "bg-destructive/15 text-destructive",
            status === "disconnected" &&
              "bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)] text-muted-foreground",
          )}
        >
          {status === "connecting" ? (
            <span className="size-1.5 animate-pulse rounded-full bg-current" />
          ) : null}
          {status}
        </span>
      </div>
      {(toolsCount != null || resourcesCount != null) && (
        <div className="flex flex-wrap gap-3 text-xs">
          {toolsCount != null ? (
            <span>
              <strong className="text-[var(--glass-chrome-fg)]">{toolsCount}</strong>{" "}
              <span className="text-muted-foreground">tools</span>
            </span>
          ) : null}
          {resourcesCount != null ? (
            <span>
              <strong className="text-[var(--glass-chrome-fg)]">
                {resourcesCount}
              </strong>{" "}
              <span className="text-muted-foreground">resources</span>
            </span>
          ) : null}
        </div>
      )}
      {footer ? (
        <div className="border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_60%,transparent)] pt-3">
          {footer}
        </div>
      ) : null}
    </div>
  ),
);
McpServerCard.displayName = "McpServerCard";

export { McpServerCard, mcpServerCardVariants };
