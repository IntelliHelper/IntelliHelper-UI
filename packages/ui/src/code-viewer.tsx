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
  formatLineNumber,
  normalizeLanguage,
  splitCodeLines,
} from "./code-format";
import { CopyButton } from "./copy-button";

const codeViewerVariants = cva(
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
        solid:
          "bg-[color-mix(in_oklch,var(--background)_88%,var(--foreground)_4%)]",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface CodeViewerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof codeViewerVariants> {
  code: string;
  language?: string;
  title?: ReactNode;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  maxHeight?: string | number;
}

const CodeViewer = forwardRef<HTMLDivElement, CodeViewerProps>(
  (
    {
      className,
      variant,
      code,
      language = "text",
      title,
      showLineNumbers = true,
      showCopy = true,
      maxHeight = 320,
      ...props
    },
    ref,
  ) => {
    const lang = normalizeLanguage(language);
    const lines = useMemo(() => splitCodeLines(code), [code]);
    const heightStyle =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    return (
      <div
        ref={ref}
        data-slot="code-viewer"
        data-language={lang}
        className={cn(codeViewerVariants({ variant }), className)}
        {...props}
      >
        <div
          data-slot="code-viewer-header"
          className="flex items-center justify-between gap-2 border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] px-3 py-2"
        >
          <div className="flex min-w-0 items-center gap-2">
            {title ? (
              <span className="truncate text-xs font-semibold text-[var(--glass-chrome-fg)]">
                {title}
              </span>
            ) : null}
            <span className="rounded-md bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {lang}
            </span>
          </div>
          {showCopy ? (
            <CopyButton
              value={code}
              size="sm"
              variant="ghost"
              label="Copy"
              copiedLabel="Copied"
            />
          ) : null}
        </div>
        <pre
          data-slot="code-viewer-body"
          className="m-0 overflow-auto p-3 text-[13px] leading-6 text-[var(--glass-chrome-fg)]"
          style={{ maxHeight: heightStyle }}
        >
          <code>
            {lines.map((line, index) => (
              <span
                key={`line-${index}`}
                data-slot="code-viewer-line"
                className="flex min-h-[1.5rem]"
              >
                {showLineNumbers ? (
                  <span
                    data-slot="code-viewer-line-number"
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
CodeViewer.displayName = "CodeViewer";

export { CodeViewer, codeViewerVariants };
