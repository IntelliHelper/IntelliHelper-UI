"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  forwardRef,
  isValidElement,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@intelli/utils";
import { MarkdownCodeBlock } from "./markdown-code-block";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyList,
  TypographyP,
} from "./typography";

const markdownViewerVariants = cva("min-w-0 w-full text-sm leading-relaxed", {
  variants: {
    variant: {
      default: "",
      chrome: [
        "rounded-xl border border-[var(--glass-chrome-border)] glass-panel p-6",
      ],
      outline: [
        "rounded-xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)]",
        "p-6",
      ],
    },
    tone: {
      default: "text-foreground",
      chrome: "glass-chrome-text",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
    tone: "default",
  },
});

function parseFencedCodeBlock(children: ReactNode) {
  const child = Children.toArray(children)[0];

  if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) {
    return null;
  }

  const className = child.props.className ?? "";
  const match = /language-([\w-]+)/.exec(className);

  if (!match) {
    return null;
  }

  const code = String(child.props.children ?? "").replace(/\n$/, "");

  return {
    code,
    language: match[1]!,
  };
}

function createMarkdownComponents(
  tone: "default" | "chrome" | "muted",
  options: { highlight?: boolean } = {},
): Components {
  const typographyVariant = tone === "chrome" ? "chrome" : tone === "muted" ? "muted" : "default";
  const highlight = options.highlight ?? true;

  return {
    h1: ({ children }) => (
      <TypographyH1 variant={typographyVariant}>{children}</TypographyH1>
    ),
    h2: ({ children }) => (
      <TypographyH2 variant={typographyVariant}>{children}</TypographyH2>
    ),
    h3: ({ children }) => (
      <TypographyH3 variant={typographyVariant}>{children}</TypographyH3>
    ),
    h4: ({ children }) => (
      <TypographyH4 variant={typographyVariant}>{children}</TypographyH4>
    ),
    p: ({ children }) => (
      <TypographyP variant={typographyVariant}>{children}</TypographyP>
    ),
    blockquote: ({ children }) => (
      <TypographyBlockquote variant={typographyVariant}>
        {children}
      </TypographyBlockquote>
    ),
    ul: ({ children }) => (
      <TypographyList variant={typographyVariant}>{children}</TypographyList>
    ),
    ol: ({ children }) => (
      <ol
        data-slot="markdown-viewer-ol"
        className={cn(
          "my-6 ml-6 list-decimal [&>li]:mt-2",
          tone === "chrome" && "glass-chrome-text",
          tone === "muted" && "text-muted-foreground",
        )}
      >
        {children}
      </ol>
    ),
    li: ({ children, className }) => (
      <li
        data-slot="markdown-viewer-li"
        className={cn(
          "leading-7",
          className?.includes("task-list-item") && "list-none -ml-6",
          className,
        )}
      >
        {children}
      </li>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        data-slot="markdown-viewer-link"
        className="font-medium text-primary underline-offset-4 transition-colors duration-[var(--duration-normal)] hover:underline"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong
        className={cn(
          "font-semibold",
          tone === "chrome" && "glass-chrome-text",
          tone === "muted" && "text-muted-foreground",
          tone === "default" && "text-foreground",
        )}
      >
        {children}
      </strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <Separator className="my-8" />,
    code: ({ className, children }) => {
      const isBlock = Boolean(className?.includes("language-"));

      if (isBlock) {
        return (
          <code className={className} data-slot="markdown-viewer-code-block">
            {children}
          </code>
        );
      }

      return (
        <TypographyInlineCode variant={typographyVariant}>
          {children}
        </TypographyInlineCode>
      );
    },
    pre: ({ children }) => {
      const fencedCode = parseFencedCodeBlock(children);

      if (fencedCode && highlight) {
        return (
          <MarkdownCodeBlock
            code={fencedCode.code}
            language={fencedCode.language}
          />
        );
      }

      return (
        <pre
          data-slot="markdown-viewer-pre"
          className={cn(
            "my-6 overflow-x-auto rounded-2xl border border-[var(--glass-chrome-border)]",
            "bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)]",
            "p-4 font-mono text-[0.8125rem] leading-[1.75] text-foreground",
            "shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-chrome-blur)]",
          )}
        >
          {children}
        </pre>
      );
    },
    table: ({ children }) => (
      <div
        data-slot="markdown-viewer-table-wrapper"
        className="my-6 w-full overflow-x-auto rounded-xl border border-[var(--glass-chrome-border)]"
      >
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead
        data-slot="markdown-viewer-thead"
        className="border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%,transparent)]"
      >
        {children}
      </thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-[var(--glass-chrome-border)] last:border-b-0">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-semibold">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 align-top text-muted-foreground">{children}</td>
    ),
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt ?? ""}
        data-slot="markdown-viewer-image"
        className="my-6 max-w-full rounded-xl border border-[var(--glass-chrome-border)]"
      />
    ),
    input: ({ type, checked, disabled }) => {
      if (type !== "checkbox") {
        return null;
      }

      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          readOnly
          className="mr-2 size-4 rounded border-[var(--glass-chrome-border)] accent-primary"
        />
      );
    },
  };
}

export interface MarkdownViewerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof markdownViewerVariants> {
  content: string;
  gfm?: boolean;
  highlight?: boolean;
  scrollable?: boolean;
  maxHeight?: CSSProperties["maxHeight"];
  components?: Components;
}

const MarkdownViewer = forwardRef<HTMLDivElement, MarkdownViewerProps>(
  (
    {
      className,
      content,
      variant,
      tone,
      gfm = true,
      highlight = true,
      scrollable = false,
      maxHeight,
      components,
      ...props
    },
    ref,
  ) => {
    const resolvedTone = tone ?? "default";
    const markdownComponents = useMemo(
      () => ({
        ...createMarkdownComponents(resolvedTone, { highlight }),
        ...components,
      }),
      [resolvedTone, highlight, components],
    );

    const remarkPlugins = gfm ? [remarkGfm] : [];

    const markdownBodyClassName =
      "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_[data-slot=markdown-viewer-code]:first-child]:mt-0";

    const markdown = (
      <div className={markdownBodyClassName}>
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </div>
    );

    return (
      <div
        ref={ref}
        data-slot="markdown-viewer"
        data-variant={variant}
        className={cn(
          markdownViewerVariants({ variant, tone: resolvedTone }),
          scrollable && "flex flex-col overflow-hidden p-0",
          className,
        )}
        style={scrollable && maxHeight ? { maxHeight } : undefined}
        {...props}
      >
        {scrollable ? (
          <ScrollArea
            variant="default"
            className="h-full min-h-0 w-full flex-1"
          >
            <div className="p-6 pr-4">{markdown}</div>
          </ScrollArea>
        ) : (
          markdown
        )}
      </div>
    );
  },
);
MarkdownViewer.displayName = "MarkdownViewer";

export { MarkdownViewer, markdownViewerVariants, createMarkdownComponents, parseFencedCodeBlock };
export { MarkdownCodeBlock, type MarkdownCodeBlockProps } from "./markdown-code-block";
export { highlightMarkdownCode } from "./markdown-highlight";