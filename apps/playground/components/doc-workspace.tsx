"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  MarkdownCodeBlock,
} from "@intelli/ui";
import { cn } from "@intelli/utils";

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

function CodeIcon() {
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
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  );
}

function ExpandIcon() {
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
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  );
}

function useCopyCode(code: string) {
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

  return { copied, handleCopy };
}

type DocWorkspaceProps = {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
  language?: string;
  className?: string;
};

/**
 * Component example workspace with full-width preview and floating glass modals
 * for expanded preview and source code (never half-width side-by-side).
 */
export function DocWorkspace({
  title,
  description,
  preview,
  code,
  language = "tsx",
  className,
}: DocWorkspaceProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const { copied, handleCopy } = useCopyCode(code);

  return (
    <section
      className={cn(
        "isolate min-w-0 overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)]",
        "shadow-[var(--glass-chrome-shadow)]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] px-4 py-3 md:px-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            className="gap-1.5 text-xs"
            onClick={() => setPreviewOpen(true)}
          >
            <ExpandIcon />
            Expand
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            className="gap-1.5 text-xs"
            onClick={() => setCodeOpen(true)}
          >
            <CodeIcon />
            View code
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            shape="pill"
            className="gap-1.5 text-xs"
            onClick={handleCopy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Full-width live preview — never shares horizontal space with code */}
      <div
        data-slot="doc-preview"
        className={cn(
          "relative min-w-0",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_14%,transparent)]",
        )}
      >
        <div
          className={cn(
            "flex w-full min-w-0 justify-center",
            "p-5 sm:p-6 md:p-8",
            "min-h-[220px]",
          )}
        >
          <div
            className={cn(
              "w-full min-w-0 max-w-full",
              "[&_[data-slot=component-preview]]:w-full [&_[data-slot=component-preview]]:max-w-full",
              "[&_[data-slot=event-calendar]]:w-full",
              "[&_table]:w-full",
            )}
          >
            {preview}
          </div>
        </div>
      </div>

      {/* Floating expand modal — immersive full-width preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          size="full"
          variant="chrome"
          overlayBlur="lg"
          overlayDim="default"
          className={cn(
            "flex max-h-[min(92vh,920px)] w-[min(100%-1.5rem,72rem)] flex-col gap-0 overflow-hidden p-0",
            "sm:max-w-[min(100%-2rem,72rem)]",
          )}
        >
          <DialogHeader className="shrink-0 border-b border-[var(--glass-chrome-border)] px-5 py-4 pr-14 sm:px-6">
            <DialogTitle className="text-base">{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : (
              <DialogDescription>
                Expanded live preview of this component example.
              </DialogDescription>
            )}
          </DialogHeader>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-auto overscroll-contain",
              "bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)]",
              "[scrollbar-color:var(--glass-scroll-thumb)_var(--glass-scroll-track)] [scrollbar-width:thin]",
            )}
          >
            <div className="flex w-full min-w-0 justify-center p-5 sm:p-8 md:p-10">
              <div
                className={cn(
                  "w-full min-w-0 max-w-full",
                  "[&_[data-slot=component-preview]]:w-full [&_[data-slot=component-preview]]:max-w-full",
                  "[&_[data-slot=event-calendar]]:w-full",
                  "[&_table]:w-full",
                )}
              >
                {preview}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-[var(--glass-chrome-border)] px-4 py-3 sm:px-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              shape="pill"
              className="gap-1.5 text-xs"
              onClick={() => {
                setPreviewOpen(false);
                setCodeOpen(true);
              }}
            >
              <CodeIcon />
              View code
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              shape="pill"
              onClick={() => setPreviewOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating code modal — source without stealing preview width */}
      <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
        <DialogContent
          size="xl"
          variant="chrome"
          overlayBlur="lg"
          overlayDim="default"
          className={cn(
            "flex max-h-[min(88vh,800px)] w-[min(100%-1.5rem,56rem)] flex-col gap-0 overflow-hidden p-0",
            "sm:max-w-[min(100%-2rem,56rem)]",
          )}
        >
          <DialogHeader className="shrink-0 border-b border-[var(--glass-chrome-border)] px-5 py-4 pr-14 sm:px-6">
            <DialogTitle className="text-base">{title}</DialogTitle>
            <DialogDescription>
              Source for this example. Copy and paste into your project.
            </DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              "min-h-0 flex-1 overflow-auto overscroll-contain",
              "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_28%,transparent)]",
              "[scrollbar-color:var(--glass-scroll-thumb)_var(--glass-scroll-track)] [scrollbar-width:thin]",
              "[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--glass-scroll-thumb)]",
            )}
          >
            <MarkdownCodeBlock
              code={code}
              language={language}
              className="my-0 rounded-none border-0 shadow-none"
            />
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[var(--glass-chrome-border)] px-4 py-3 sm:px-5">
            <p className="font-mono text-[11px] text-muted-foreground">
              {language}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                shape="pill"
                className="gap-1.5 text-xs"
                onClick={handleCopy}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Copied" : "Copy code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                shape="pill"
                onClick={() => setCodeOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
