"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type Ref,
} from "react";
import { cn } from "@intelli/utils";
import { htmlToMarkdown, markdownToHtml } from "./markdown-editor-convert";
import type { MarkdownEditorAction } from "./markdown-editor-utils";
import { applyRichTextAction } from "./markdown-rich-text-utils";

const richTextSurfaceVariants = cva(
  [
    "w-full text-sm leading-relaxed text-foreground",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
    "[&_h1]:scroll-m-20 [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight",
    "[&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:border-[var(--glass-chrome-border)] [&_h2]:pb-2 [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight",
    "[&_h3]:scroll-m-20 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight",
    "[&_h4]:scroll-m-20 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:tracking-tight",
    "[&_p]:leading-7 [&_p:not(:first-child)]:mt-6",
    "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--glass-chrome-border)] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
    "[&_ul]:my-6 [&_ul]:ml-6 [&_ul]:list-disc [&_ul>li]:mt-2",
    "[&_ol]:my-6 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol>li]:mt-2",
    "[&_ul[data-task-list]_li]:list-none [&_ul[data-task-list]_li]:-ml-6",
    "[&_ul[data-task-list]_input]:mr-2 [&_ul[data-task-list]_input]:size-4 [&_ul[data-task-list]_input]:rounded [&_ul[data-task-list]_input]:border-[var(--glass-chrome-border)] [&_ul[data-task-list]_input]:accent-primary",
    "[&_code]:rounded-md [&_code]:border [&_code]:border-[var(--glass-chrome-border)] [&_code]:bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%,transparent)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]",
    "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-[var(--glass-chrome-border)] [&_pre]:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)] [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[0.8125rem] [&_pre]:leading-[1.75]",
    "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
    "[&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-[var(--glass-chrome-border)]",
    "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-xl [&_table]:border [&_table]:border-[var(--glass-chrome-border)]",
    "[&_th]:border-b [&_th]:border-[var(--glass-chrome-border)] [&_th]:bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%,transparent)] [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold",
    "[&_td]:border-b [&_td]:border-[var(--glass-chrome-border)] [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_td]:text-muted-foreground",
    "[&_tr:last-child_td]:border-b-0",
    "[&_hr]:my-8 [&_hr]:border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        default: "p-4",
        chrome: "p-4",
        outline: "p-4",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface MarkdownRichTextEditorHandle {
  focus: () => void;
  insertAction: (action: MarkdownEditorAction) => string;
  getHtml: () => string;
}

export interface MarkdownRichTextEditorProps
  extends VariantProps<typeof richTextSurfaceVariants> {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  minHeight?: number;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  className?: string;
}

const MarkdownRichTextEditor = forwardRef(function MarkdownRichTextEditor(
  {
    value,
    onChange,
    placeholder = "Start writing…",
    disabled,
    readOnly,
    minHeight = 320,
    variant,
    onKeyDown,
    className,
  }: MarkdownRichTextEditorProps,
  ref: Ref<MarkdownRichTextEditorHandle>,
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);
  const isInternalHtmlUpdate = useRef(false);
  const lastMarkdown = useRef<string | null>(null);

  const syncMarkdownFromHtml = useCallback(() => {
    const root = editorRef.current;
    if (!root) {
      return value;
    }

    const markdown = htmlToMarkdown(root.innerHTML);
    lastMarkdown.current = markdown;
    onChange(markdown);
    return markdown;
  }, [onChange, value]);

  const setHtmlFromMarkdown = useCallback((markdown: string) => {
    const root = editorRef.current;
    if (!root) {
      return;
    }

    const html = markdown.trim() ? markdownToHtml(markdown) : "";
    isInternalHtmlUpdate.current = true;
    root.innerHTML = html;
    isInternalHtmlUpdate.current = false;
    lastMarkdown.current = markdown;
  }, []);

  useEffect(() => {
    if (value === lastMarkdown.current) {
      return;
    }

    setHtmlFromMarkdown(value);
  }, [setHtmlFromMarkdown, value]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => editorRef.current?.focus(),
      insertAction: (action) => {
        const root = editorRef.current;
        if (!root || disabled || readOnly) {
          return value;
        }

        applyRichTextAction(root, action);
        return syncMarkdownFromHtml();
      },
      getHtml: () => editorRef.current?.innerHTML ?? "",
    }),
    [disabled, readOnly, syncMarkdownFromHtml, value],
  );

  const handleInput = () => {
    if (isComposing.current || isInternalHtmlUpdate.current) {
      return;
    }

    syncMarkdownFromHtml();
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (disabled || readOnly) {
      return;
    }

    const text = event.clipboardData.getData("text/plain");
    if (!text) {
      return;
    }

    event.preventDefault();
    document.execCommand("insertText", false, text);
    syncMarkdownFromHtml();
  };

  return (
    <div
      ref={editorRef}
      data-slot="markdown-rich-text-editor"
      contentEditable={!disabled && !readOnly}
      suppressContentEditableWarning
      role="textbox"
      aria-multiline
      aria-label="Rich text editor"
      data-placeholder={placeholder}
      onInput={handleInput}
      onPaste={handlePaste}
      onCompositionStart={() => {
        isComposing.current = true;
      }}
      onCompositionEnd={() => {
        isComposing.current = false;
        syncMarkdownFromHtml();
      }}
      onKeyDown={onKeyDown}
      className={cn(richTextSurfaceVariants({ variant, className }))}
      style={{ minHeight }}
    />
  );
});

export { MarkdownRichTextEditor, richTextSurfaceVariants };