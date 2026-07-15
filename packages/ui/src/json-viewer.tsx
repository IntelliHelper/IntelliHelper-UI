"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import {
  formatJson,
  formatLineNumber,
  isValidJson,
  parseAndFormatJson,
  splitCodeLines,
} from "./code-format";
import { CopyButton } from "./copy-button";

const jsonViewerVariants = cva(
  [
    "flex w-full flex-col overflow-hidden rounded-2xl border font-mono text-sm",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
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

export interface JsonViewerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof jsonViewerVariants> {
  /** JSON string or serializable value. */
  data: string | unknown;
  title?: ReactNode;
  indent?: number;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  maxHeight?: string | number;
}

const JsonViewer = forwardRef<HTMLDivElement, JsonViewerProps>(
  (
    {
      className,
      variant,
      data,
      title = "JSON",
      indent = 2,
      showLineNumbers = true,
      showCopy = true,
      maxHeight = 320,
      ...props
    },
    ref,
  ) => {
    const parsed = useMemo(() => {
      if (typeof data === "string") {
        return parseAndFormatJson(data, indent);
      }
      try {
        const formatted = JSON.stringify(data, null, indent);
        return { ok: true as const, value: data, formatted };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Could not serialize value";
        return {
          ok: false as const,
          error: message,
          formatted: String(data),
        };
      }
    }, [data, indent]);

    const lines = useMemo(
      () => splitCodeLines(parsed.formatted),
      [parsed.formatted],
    );
    const heightStyle =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    return (
      <div
        ref={ref}
        data-slot="json-viewer"
        data-valid={parsed.ok ? "true" : "false"}
        className={cn(jsonViewerVariants({ variant }), className)}
        {...props}
      >
        <div
          data-slot="json-viewer-header"
          className="flex items-center justify-between gap-2 border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] px-3 py-2"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-xs font-semibold text-[var(--glass-chrome-fg)]">
              {title}
            </span>
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                parsed.ok
                  ? "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_18%,transparent)] text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]"
                  : "bg-[color-mix(in_oklch,var(--destructive)_16%,transparent)] text-destructive",
              )}
            >
              {parsed.ok ? "valid" : "invalid"}
            </span>
          </div>
          {showCopy ? (
            <CopyButton
              value={parsed.formatted}
              size="sm"
              variant="ghost"
              label="Copy"
              copiedLabel="Copied"
            />
          ) : null}
        </div>
        {!parsed.ok ? (
          <p
            data-slot="json-viewer-error"
            className="border-b border-[color-mix(in_oklch,var(--destructive)_30%,transparent)] px-3 py-2 text-xs text-destructive"
          >
            {parsed.error}
          </p>
        ) : null}
        <pre
          data-slot="json-viewer-body"
          className="m-0 overflow-auto p-3 text-[13px] leading-6 text-[var(--glass-chrome-fg)]"
          style={{ maxHeight: heightStyle }}
        >
          <code>
            {lines.map((line, index) => (
              <span
                key={`json-line-${index}`}
                className="flex min-h-[1.5rem]"
              >
                {showLineNumbers ? (
                  <span
                    className="mr-4 shrink-0 select-none text-right text-muted-foreground/70"
                    style={{ minWidth: `${String(lines.length).length + 1}ch` }}
                  >
                    {formatLineNumber(index, lines.length)}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 whitespace-pre-wrap break-all">
                  {line.length === 0 ? " " : line}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    );
  },
);
JsonViewer.displayName = "JsonViewer";

export {
  JsonViewer,
  jsonViewerVariants,
  formatJson,
  parseAndFormatJson,
  isValidJson,
};
