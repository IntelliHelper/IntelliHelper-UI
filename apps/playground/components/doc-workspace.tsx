"use client";

import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { Button, MarkdownCodeBlock } from "@intelli/ui";
import { Box, Center, Cluster, Flex, Stack } from "@intelli/ui/layout";
import { cn } from "@intelli/utils";

const CODE_MAX_HEIGHT = "min(420px, 55vh)";

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

function getCollapsedCodePeek(code: string, maxLines = 4) {
  return code.split("\n").slice(0, maxLines).join("\n");
}

type DocWorkspaceProps = {
  title: string;
  description?: string;
  preview: ReactNode;
  code: string;
  language?: string;
  /** When true, code panel starts expanded. Default false (collapsed peek). */
  defaultShowCode?: boolean;
  className?: string;
};

/**
 * Full-width component example workspace.
 * Stacks live preview (full width) above source code so wide components
 * (calendars, sidebars, tables, editors) render without half-width clipping.
 */
export function DocWorkspace({
  title,
  description,
  preview,
  code,
  language = "tsx",
  defaultShowCode = false,
  className,
}: DocWorkspaceProps) {
  const codePanelId = useId();
  const [showCode, setShowCode] = useState(defaultShowCode);
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
    <Box
      as="section"
      className={cn(
        "isolate min-w-0 overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)]",
        "backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%, var(--glass-mix-into))]",
        "shadow-[var(--glass-chrome-shadow)]",
        className,
      )}
    >
      {/* Header — quiet chrome toolbar */}
      <Flex
        wrap
        align="start"
        justify="between"
        gap={3}
        className="border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%, var(--glass-mix-into))] px-4 py-3 backdrop-blur-[var(--glass-blur)] md:px-5"
      >
        <Stack gap={0.5} className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </Stack>
        <Cluster gap={1.5} className="shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            className="gap-1.5 text-xs"
            aria-expanded={showCode}
            aria-controls={codePanelId}
            onClick={() => setShowCode((open) => !open)}
          >
            <CodeIcon />
            {showCode ? "Hide code" : "View code"}
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
        </Cluster>
      </Flex>

      {/* Full-width live preview — no horizontal split */}
      <Box
        data-slot="doc-preview"
        className={cn(
          "relative min-w-0",
          "backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%, var(--glass-mix-into))]",
          "border-b border-[var(--glass-chrome-border)]",
        )}
      >
        <Center
          inline={false}
          className={cn(
            "w-full min-w-0",
            "p-5 sm:p-6 md:p-8",
            "min-h-[200px]",
          )}
        >
          <Box
            className={cn(
              "w-full min-w-0 max-w-full",
              /* Let nested demos expand to available width */
              "[&_[data-slot=component-preview]]:w-full [&_[data-slot=component-preview]]:max-w-full",
              "[&_[data-slot=event-calendar]]:w-full",
              "[&_table]:w-full",
            )}
          >
            {preview}
          </Box>
        </Center>
      </Box>

      {/* Full-width code panel — collapsible, never steals preview width */}
      <Box data-slot="doc-code" id={codePanelId} className="relative min-w-0">
        {showCode ? (
          <Box
            className={cn(
              "overflow-auto overscroll-contain",
              "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_52%, var(--glass-mix-into))]",
              "[scrollbar-color:var(--glass-scroll-thumb)_var(--glass-scroll-track)] [scrollbar-width:thin]",
              "[&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--glass-scroll-thumb)] [&::-webkit-scrollbar-track]:bg-transparent",
            )}
            style={{ maxHeight: CODE_MAX_HEIGHT }}
          >
            <MarkdownCodeBlock
              code={code}
              language={language}
              className="my-0 rounded-none border-0 shadow-none"
            />
          </Box>
        ) : (
          <Box className="relative">
            <Box
              aria-hidden
              className="pointer-events-none max-h-[6.5rem] select-none overflow-hidden opacity-55 blur-[1.25px]"
            >
              <MarkdownCodeBlock
                code={getCollapsedCodePeek(code)}
                language={language}
                className="my-0 rounded-none border-0 shadow-none"
              />
            </Box>
            <Box
              className={cn(
                "pointer-events-none absolute inset-0",
                "bg-gradient-to-b from-transparent via-background/30 to-background/75",
              )}
            />
            <Center className="absolute inset-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                shape="pill"
                className="pointer-events-auto gap-2 shadow-[var(--glass-chrome-shadow)]"
                aria-expanded={showCode}
                aria-controls={codePanelId}
                onClick={() => setShowCode(true)}
              >
                <CodeIcon />
                View code
              </Button>
            </Center>
          </Box>
        )}
      </Box>
    </Box>
  );
}
