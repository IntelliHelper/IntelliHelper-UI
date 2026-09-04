"use client";

import { CheckIcon, CodeIcon, CopyIcon } from "./icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import { Button } from "./button";
import { MarkdownCodeBlock } from "./markdown-code-block";
import { Textarea } from "./textarea";

const componentPreviewVariants = cva(
  [
    "relative overflow-hidden rounded-2xl",
    "border border-[var(--glass-chrome-border)]",
    "shadow-[var(--glass-chrome-shadow)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%, var(--glass-mix-into))]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
        ],
        outline: [
          "backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%, var(--glass-mix-into))]",
        ],
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

const previewAreaVariants = cva(
  "flex w-full items-center justify-center p-6 md:p-10",
  {
    variants: {
      bordered: {
        true: "border-b border-[var(--glass-chrome-border)]",
        false: "",
      },
    },
    defaultVariants: {
      bordered: true,
    },
  },
);

function getCollapsedCodePeek(code: string, maxLines = 3) {
  return code.split("\n").slice(0, maxLines).join("\n");
}

export interface ComponentPreviewProps
  extends VariantProps<typeof componentPreviewVariants> {
  children?: ReactNode;
  code?: string;
  defaultCode?: string;
  language?: string;
  editable?: boolean;
  defaultShowCode?: boolean;
  showCopy?: boolean;
  showViewCodeToggle?: boolean;
  previewClassName?: string;
  codeClassName?: string;
  className?: string;
  onCodeChange?: (code: string) => void;
  minPreviewHeight?: number;
  collapsedCodeLines?: number;
}

export function ComponentPreview({
  children,
  code: controlledCode,
  defaultCode = "",
  language = "tsx",
  variant,
  editable = false,
  defaultShowCode = false,
  showCopy = true,
  showViewCodeToggle = true,
  previewClassName,
  codeClassName,
  className,
  onCodeChange,
  minPreviewHeight = 280,
  collapsedCodeLines = 3,
}: ComponentPreviewProps) {
  const codePanelId = useId();
  const [uncontrolledCode, setUncontrolledCode] = useState(defaultCode);
  const [showCode, setShowCode] = useState(defaultShowCode);
  const [copied, setCopied] = useState(false);

  const resolvedCode = controlledCode ?? uncontrolledCode;
  const hasPreview = Boolean(children);
  const hasCode = resolvedCode.trim().length > 0;

  const updateCode = useCallback(
    (nextCode: string) => {
      if (controlledCode === undefined) {
        setUncontrolledCode(nextCode);
      }
      onCodeChange?.(nextCode);
    },
    [controlledCode, onCodeChange],
  );

  const handleCopy = useCallback(async () => {
    if (!resolvedCode || typeof navigator === "undefined") {
      return;
    }

    try {
      await navigator.clipboard.writeText(resolvedCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [resolvedCode]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  if (!hasPreview && !hasCode) {
    return null;
  }

  return (
    <div
      data-slot="component-preview"
      data-variant={variant}
      className={cn(componentPreviewVariants({ variant, className }))}
    >
      {hasPreview ? (
        <div
          data-slot="component-preview-preview"
          className={cn(
            previewAreaVariants({ bordered: hasCode }),
            previewClassName,
          )}
          style={{ minHeight: minPreviewHeight }}
        >
          {children}
        </div>
      ) : null}

      {hasCode ? (
        <div data-slot="component-preview-code" className="relative">
          {showViewCodeToggle && !showCode ? (
            <div className="relative">
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none select-none overflow-hidden",
                  "max-h-[7.5rem] opacity-60 blur-[1.5px]",
                )}
              >
                <MarkdownCodeBlock
                  code={getCollapsedCodePeek(resolvedCode, collapsedCodeLines)}
                  language={language}
                  className="my-0 rounded-none border-0 shadow-none"
                />
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  "bg-gradient-to-b from-transparent via-background/35 to-background/80",
                )}
              />

              <div className="absolute inset-0 flex items-center justify-center">
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
                  View Code
                </Button>
              </div>
            </div>
          ) : (
            <div id={codePanelId} className="relative">
              {editable ? (
                <div
                  className={cn(
                    "border-t border-[var(--glass-chrome-border)]",
                    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_52%, var(--glass-mix-into))]",
                    codeClassName,
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-between gap-3",
                      "border-b border-[var(--glass-chrome-border)] px-4 py-2.5",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full bg-primary/70"
                      />
                      <span className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground">
                        {language}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {showCopy ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 px-2.5 text-xs"
                          onClick={handleCopy}
                        >
                          {copied ? <CheckIcon /> : <CopyIcon />}
                          {copied ? "Copied" : "Copy"}
                        </Button>
                      ) : null}

                      {showViewCodeToggle ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs"
                          aria-expanded={showCode}
                          aria-controls={codePanelId}
                          onClick={() => setShowCode(false)}
                        >
                          Hide Code
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <Textarea
                    value={resolvedCode}
                    onChange={(event) => updateCode(event.target.value)}
                    spellCheck={false}
                    className={cn(
                      "min-h-[220px] resize-y rounded-none border-0 bg-transparent",
                      "font-mono text-[0.8125rem] leading-[1.75] shadow-none",
                      "focus-visible:ring-0",
                    )}
                    aria-label="Component source code"
                  />
                </div>
              ) : (
                <div className="relative">
                  <MarkdownCodeBlock
                    code={resolvedCode}
                    language={language}
                    className={cn(
                      "my-0 rounded-none border-0 border-t border-[var(--glass-chrome-border)] shadow-none",
                      codeClassName,
                    )}
                  />

                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    {showCopy ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 px-2.5 text-xs"
                        onClick={handleCopy}
                      >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    ) : null}

                    {showViewCodeToggle ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-xs"
                        aria-expanded={showCode}
                        aria-controls={codePanelId}
                        onClick={() => setShowCode(false)}
                      >
                        Hide Code
                      </Button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export { componentPreviewVariants, previewAreaVariants };