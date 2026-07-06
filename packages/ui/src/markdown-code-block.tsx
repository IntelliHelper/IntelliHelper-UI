"use client";

import { useEffect, useState } from "react";
import { cn } from "@intelli/utils";
import { highlightMarkdownCode } from "./markdown-highlight";

const SHIKI_DUAL_THEME_STYLES = `
[data-markdown-shiki] .shiki {
  margin: 0;
  padding: 0;
  background: transparent !important;
  background-color: transparent !important;
  overflow: visible;
  tab-size: 2;
}
[data-markdown-shiki] .shiki,
[data-markdown-shiki] .shiki span {
  color: var(--shiki-light);
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
  font-size: 0.8125rem;
  line-height: 1.75;
}
[data-markdown-shiki] .shiki .line {
  display: block;
  min-height: 1.75em;
}
html.dark [data-markdown-shiki] .shiki,
html.dark [data-markdown-shiki] .shiki span {
  color: var(--shiki-dark);
}
`;

let shikiStylesInjected = false;

function ensureShikiStyles() {
  if (shikiStylesInjected || typeof document === "undefined") {
    return;
  }

  const style = document.createElement("style");
  style.setAttribute("data-markdown-viewer-shiki", "");
  style.textContent = SHIKI_DUAL_THEME_STYLES;
  document.head.appendChild(style);
  shikiStylesInjected = true;
}

function formatLanguageLabel(language: string) {
  return language.replace(/^language-/, "").toLowerCase();
}

export interface MarkdownCodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export function MarkdownCodeBlock({
  code,
  language,
  className,
}: MarkdownCodeBlockProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);
  const languageLabel = formatLanguageLabel(language);

  useEffect(() => {
    ensureShikiStyles();
  }, []);

  useEffect(() => {
    let cancelled = false;

    highlightMarkdownCode(code, language).then((html) => {
      if (!cancelled) {
        setHighlightedHtml(html);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return (
    <div
      data-slot="markdown-viewer-code"
      data-language={languageLabel}
      data-markdown-shiki=""
      className={cn(
        "group relative my-6 overflow-hidden rounded-2xl",
        "border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
        "shadow-[var(--glass-chrome-shadow)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_38%,transparent)]",
          "px-4 py-2.5",
        )}
      >
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-primary/70"
        />
        <span className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground">
          {languageLabel}
        </span>
      </div>

      <div className="overflow-x-auto px-4 py-3.5">
        {highlightedHtml ? (
          <div
            className="min-w-0 [&_.shiki]:outline-none"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="m-0 bg-transparent p-0 font-mono text-[0.8125rem] leading-[1.75] text-foreground">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}