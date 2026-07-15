"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const toolCallViewerVariants = cva(
  [
    "w-full overflow-hidden rounded-2xl border font-mono text-xs",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
        ],
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export type ToolCallStatus =
  | "pending"
  | "running"
  | "success"
  | "error";

export interface ToolCallViewerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toolCallViewerVariants> {
  name: ReactNode;
  status?: ToolCallStatus;
  args?: unknown;
  result?: unknown;
  error?: ReactNode;
  defaultOpen?: boolean;
}

const ToolCallViewer = forwardRef<HTMLDivElement, ToolCallViewerProps>(
  (
    {
      className,
      variant,
      name,
      status = "pending",
      args,
      result,
      error,
      defaultOpen = true,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
      <div
        ref={ref}
        data-slot="tool-call-viewer"
        data-status={status}
        className={cn(toolCallViewerVariants({ variant }), className)}
        {...props}
      >
        <button
          type="button"
          data-slot="tool-call-viewer-header"
          className={cn(
            "flex w-full items-center justify-between gap-2 px-3 py-2 text-left",
            focusRing,
          )}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <span className="truncate font-semibold text-[var(--glass-chrome-fg)]">
              {name}
            </span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                status === "running" && "bg-primary/15 text-primary",
                status === "success" &&
                  "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_16%,transparent)] text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
                status === "error" && "bg-destructive/15 text-destructive",
                status === "pending" &&
                  "bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)] text-muted-foreground",
              )}
            >
              {status}
            </span>
          </span>
          <span className="text-[10px] text-muted-foreground">
            {open ? "Hide" : "Show"}
          </span>
        </button>
        {open ? (
          <div
            data-slot="tool-call-viewer-body"
            className="space-y-2 border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_60%,transparent)] px-3 py-2"
          >
            {args !== undefined ? (
              <section>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Arguments
                </div>
                <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[color-mix(in_oklch,var(--foreground)_5%,transparent)] p-2 text-[11px] leading-5">
                  {stringify(args)}
                </pre>
              </section>
            ) : null}
            {result !== undefined ? (
              <section>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Result
                </div>
                <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[color-mix(in_oklch,var(--foreground)_5%,transparent)] p-2 text-[11px] leading-5">
                  {stringify(result)}
                </pre>
              </section>
            ) : null}
            {error ? (
              <section data-slot="tool-call-viewer-error">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                  Error
                </div>
                <div className="rounded-lg bg-destructive/10 p-2 text-[11px] text-destructive">
                  {error}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
ToolCallViewer.displayName = "ToolCallViewer";

function stringify(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export { ToolCallViewer, toolCallViewerVariants };
