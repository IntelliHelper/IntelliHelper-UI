"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import { splitCodeLines } from "./code-format";

const terminalBlockVariants = cva(
  [
    "flex w-full flex-col overflow-hidden rounded-2xl border font-mono text-sm",
    "border-[color-mix(in_oklch,oklch(0.35_0.02_260)_50%,var(--glass-chrome-border))]",
  ],
  {
    variants: {
      variant: {
        dark: [
          "bg-[color-mix(in_oklch,oklch(0.18_0.02_260)_88%,transparent)]",
          "text-[color-mix(in_oklch,oklch(0.92_0.02_140)_90%,white)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "text-[var(--glass-chrome-fg)]",
        ],
      },
    },
    defaultVariants: {
      variant: "dark",
    },
  },
);

export type TerminalLine = {
  type?: "input" | "output" | "comment" | "error";
  content: string;
  prompt?: string;
};

export interface TerminalBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof terminalBlockVariants> {
  /** Multi-line terminal transcript, or structured lines. */
  lines?: TerminalLine[] | string;
  title?: ReactNode;
  prompt?: string;
  maxHeight?: string | number;
}

const TerminalBlock = forwardRef<HTMLDivElement, TerminalBlockProps>(
  (
    {
      className,
      variant,
      lines = "",
      title = "Terminal",
      prompt = "$",
      maxHeight = 280,
      ...props
    },
    ref,
  ) => {
    const normalized = useMemo(() => normalizeLines(lines, prompt), [lines, prompt]);
    const heightStyle =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

    return (
      <div
        ref={ref}
        data-slot="terminal-block"
        className={cn(terminalBlockVariants({ variant }), className)}
        {...props}
      >
        <div
          data-slot="terminal-block-header"
          className="flex items-center gap-2 border-b border-white/10 px-3 py-2"
        >
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[oklch(0.72_0.17_25)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.82_0.14_85)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.72_0.15_145)]" />
          </span>
          <span className="truncate text-xs font-medium opacity-80">{title}</span>
        </div>
        <pre
          data-slot="terminal-block-body"
          className="m-0 overflow-auto p-3 text-[13px] leading-6"
          style={{ maxHeight: heightStyle }}
        >
          <code>
            {normalized.map((line, index) => (
              <span
                key={`term-${index}`}
                data-slot="terminal-line"
                data-type={line.type ?? "output"}
                className={cn(
                  "block whitespace-pre-wrap break-all",
                  line.type === "error" && "text-[oklch(0.72_0.18_25)]",
                  line.type === "comment" && "opacity-60",
                  line.type === "input" && "font-semibold",
                )}
              >
                {line.type === "input" ? (
                  <>
                    <span className="mr-2 opacity-70">{line.prompt ?? prompt}</span>
                    {line.content}
                  </>
                ) : (
                  line.content || " "
                )}
              </span>
            ))}
          </code>
        </pre>
      </div>
    );
  },
);
TerminalBlock.displayName = "TerminalBlock";

function normalizeLines(
  lines: TerminalLine[] | string,
  defaultPrompt: string,
): TerminalLine[] {
  if (typeof lines === "string") {
    return splitCodeLines(lines).map((content) => {
      if (content.startsWith(`${defaultPrompt} `) || content.startsWith("$ ")) {
        const used = content.startsWith("$ ") ? "$" : defaultPrompt;
        return {
          type: "input" as const,
          prompt: used,
          content: content.slice(used.length).trimStart(),
        };
      }
      if (content.startsWith("#")) {
        return { type: "comment" as const, content };
      }
      return { type: "output" as const, content };
    });
  }
  return lines;
}

export { TerminalBlock, terminalBlockVariants };
