"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button, MarkdownCodeBlock } from "@intelli/ui";
import { cn } from "@intelli/utils";

const PANE_MAX_HEIGHT = "min(520px, 70vh)";

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-3.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

type DocWorkspaceProps = {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
  language?: string;
  className?: string;
};

export function DocWorkspace({
  title,
  description,
  preview,
  code,
  language = "tsx",
  className,
}: DocWorkspaceProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [code]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <section
      className={cn(
        "isolate min-w-0 overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)]",
        "shadow-[var(--glass-chrome-shadow)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] px-4 py-3 md:px-5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          shape="pill"
          className="shrink-0 gap-1.5 text-xs"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy code"}
        </Button>
      </div>

      <div
        className="grid min-w-0 lg:grid-cols-2"
        style={{ maxHeight: `calc(${PANE_MAX_HEIGHT} + 2px)` }}
      >
        <div
          data-slot="doc-preview"
          className={cn(
            "relative min-h-[240px] min-w-0 overflow-auto overscroll-contain [scrollbar-color:var(--glass-scroll-thumb)_var(--glass-scroll-track)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--glass-scroll-thumb)] [&::-webkit-scrollbar-track]:bg-transparent",
            "border-b border-[var(--glass-chrome-border)] lg:border-b-0 lg:border-r",
            "bg-[color-mix(in_oklch,var(--glass-surface-fill)_14%,transparent)]",
          )}
          style={{ maxHeight: PANE_MAX_HEIGHT }}
        >
          <div className="flex w-full min-w-0 items-start justify-center p-6 md:p-8">
            <div className="w-full min-w-0 max-w-full [&_[data-slot=component-preview]]:max-w-full">
              {preview}
            </div>
          </div>
        </div>

        <div
          data-slot="doc-code"
          className="relative min-h-[240px] min-w-0 overflow-auto overscroll-contain bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_24%,transparent)] [scrollbar-color:var(--glass-scroll-thumb)_var(--glass-scroll-track)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--glass-scroll-thumb)] [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ maxHeight: PANE_MAX_HEIGHT }}
        >
          <MarkdownCodeBlock
            code={code}
            language={language}
            className="my-0 rounded-none border-0 shadow-none"
          />
        </div>
      </div>
    </section>
  );
}