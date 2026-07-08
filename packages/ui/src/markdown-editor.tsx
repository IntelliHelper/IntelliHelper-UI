"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";
import { GlassIconButton } from "./glass-icon-button";
import { Kbd, KbdShortcut } from "./kbd";
import { MarkdownViewer } from "./markdown-viewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import {
  applyMarkdownAction,
  getMarkdownStats,
  handleTabKey,
  MARKDOWN_EDITOR_SHORTCUTS,
  type MarkdownEditorAction,
} from "./markdown-editor-utils";
import {
  MarkdownRichTextEditor,
  type MarkdownRichTextEditorHandle,
} from "./markdown-rich-text-editor";

const markdownEditorVariants = cva("flex w-full flex-col overflow-hidden", {
  variants: {
    variant: {
      default: "",
      chrome: [
        "rounded-xl border border-[var(--glass-chrome-border)] glass-panel",
      ],
      outline: [
        "rounded-xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)]",
      ],
    },
  },
  defaultVariants: {
    variant: "chrome",
  },
});

const editorSurfaceVariants = cva(
  [
    "w-full resize-none border-0 bg-transparent font-mono text-[0.8125rem] leading-[1.75]",
    "text-foreground placeholder:text-muted-foreground",
    "focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
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

type MarkdownEditorView = "edit" | "split" | "preview";
type MarkdownEditorMode = "markdown" | "rich-text";

const HISTORY_LIMIT = 100;

function useEditorHistory(initialValue: string) {
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [index, setIndex] = useState(0);

  const push = useCallback(
    (value: string) => {
      setHistory((prev) => {
        const next = prev.slice(0, index + 1);
        if (next[next.length - 1] === value) {
          return prev;
        }
        const updated = [...next, value].slice(-HISTORY_LIMIT);
        setIndex(updated.length - 1);
        return updated;
      });
    },
    [index],
  );

  const reset = useCallback((value: string) => {
    setHistory([value]);
    setIndex(0);
  }, []);

  const undo = useCallback(() => {
    if (index <= 0) {
      return history[0] ?? initialValue;
    }

    const nextIndex = index - 1;
    setIndex(nextIndex);
    return history[nextIndex] ?? initialValue;
  }, [history, index, initialValue]);

  const redo = useCallback(() => {
    if (index >= history.length - 1) {
      return history[index] ?? initialValue;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    return history[nextIndex] ?? initialValue;
  }, [history, index, initialValue]);

  return {
    value: history[index] ?? initialValue,
    push,
    reset,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
}

function ToolbarIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-4 items-center justify-center [&_svg]:size-4">
      {children}
    </span>
  );
}

function BoldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
      <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 4h-9" />
      <path d="M14 20H5" />
      <path d="M15 4 9 20" />
    </svg>
  );
}

function StrikethroughIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 4H9a3 3 0 0 0-2.83 4" />
      <path d="M14 12a4 4 0 0 1 0 8H6" />
      <path d="M4 12h16" />
    </svg>
  );
}

function HeadingIcon({ level }: { level: 1 | 2 | 3 | 4 }) {
  return (
    <span className="text-[11px] font-bold tracking-tight">H{level}</span>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 6h11" />
      <path d="M10 12h11" />
      <path d="M10 18h11" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function TaskListIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21c3 0 7-1 7-8V5H3v8c0 4 1 7 5 8" />
      <path d="M14 21c3 0 7-1 7-8V5h-7v8c0 4 1 7 5 8" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </svg>
  );
}

function CodeBlockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m10 9-3 3 3 3" />
      <path d="m14 15 3-3-3-3" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
    </svg>
  );
}

function HorizontalRuleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h16" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.69 3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 3v18" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MarkdownModeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function VisualModeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      <path d="m15 5 3 3" />
    </svg>
  );
}

interface ToolbarButtonProps {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ToolbarButton({
  label,
  shortcut,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <GlassIconButton
          type="button"
          variant="ghost"
          size="sm"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        >
          <ToolbarIcon>{children}</ToolbarIcon>
        </GlassIconButton>
      </TooltipTrigger>
      <TooltipContent variant="chrome" className="inline-flex items-center gap-2">
        <span>{label}</span>
        {shortcut ? <KbdShortcut shortcut={shortcut} size="sm" /> : null}
      </TooltipContent>
    </Tooltip>
  );
}

const TOOLBAR_GROUPS: Array<{
  actions: Array<{
    action: MarkdownEditorAction | "undo" | "redo";
    label: string;
    icon: ReactNode;
  }>;
}> = [
  {
    actions: [
      { action: "undo", label: "Undo", icon: <UndoIcon /> },
      { action: "redo", label: "Redo", icon: <RedoIcon /> },
    ],
  },
  {
    actions: [
      { action: "bold", label: "Bold", icon: <BoldIcon /> },
      { action: "italic", label: "Italic", icon: <ItalicIcon /> },
      { action: "strikethrough", label: "Strikethrough", icon: <StrikethroughIcon /> },
    ],
  },
  {
    actions: [
      { action: "heading1", label: "Heading 1", icon: <HeadingIcon level={1} /> },
      { action: "heading2", label: "Heading 2", icon: <HeadingIcon level={2} /> },
      { action: "heading3", label: "Heading 3", icon: <HeadingIcon level={3} /> },
      { action: "heading4", label: "Heading 4", icon: <HeadingIcon level={4} /> },
    ],
  },
  {
    actions: [
      { action: "bulletList", label: "Bullet list", icon: <ListIcon /> },
      { action: "orderedList", label: "Numbered list", icon: <OrderedListIcon /> },
      { action: "taskList", label: "Task list", icon: <TaskListIcon /> },
      { action: "blockquote", label: "Blockquote", icon: <QuoteIcon /> },
    ],
  },
  {
    actions: [
      { action: "inlineCode", label: "Inline code", icon: <CodeIcon /> },
      { action: "codeBlock", label: "Code block", icon: <CodeBlockIcon /> },
      { action: "link", label: "Link", icon: <LinkIcon /> },
      { action: "image", label: "Image", icon: <ImageIcon /> },
      { action: "table", label: "Table", icon: <TableIcon /> },
      { action: "horizontalRule", label: "Divider", icon: <HorizontalRuleIcon /> },
    ],
  },
];

export interface MarkdownEditorHandle {
  focus: () => void;
  insertAction: (action: MarkdownEditorAction) => void;
  getValue: () => string;
}

export interface MarkdownEditorToolbarProps {
  disabled?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onAction: (action: MarkdownEditorAction | "undo" | "redo") => void;
  className?: string;
}

function MarkdownEditorToolbar({
  disabled,
  canUndo,
  canRedo,
  onAction,
  className,
}: MarkdownEditorToolbarProps) {
  return (
    <TooltipProvider delayDuration={250}>
      <div
        data-slot="markdown-editor-toolbar"
        className={cn(
          "flex flex-wrap items-center gap-1 border-b border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_32%,transparent)]",
          "px-2 py-2",
          className,
        )}
      >
        {TOOLBAR_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-0.5">
            {groupIndex > 0 ? (
              <Separator
                orientation="vertical"
                className="mx-1 h-6 bg-[var(--glass-chrome-border)]"
              />
            ) : null}
            {group.actions.map((item) => (
              <ToolbarButton
                key={item.action}
                label={item.label}
                shortcut={
                  item.action === "undo"
                    ? "⌘Z"
                    : item.action === "redo"
                      ? "⌘⇧Z"
                      : MARKDOWN_EDITOR_SHORTCUTS[item.action as MarkdownEditorAction]
                }
                disabled={
                  disabled ||
                  (item.action === "undo" && !canUndo) ||
                  (item.action === "redo" && !canRedo)
                }
                onClick={() => onAction(item.action)}
              >
                {item.icon}
              </ToolbarButton>
            ))}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

export interface MarkdownEditorProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange">,
    VariantProps<typeof markdownEditorVariants> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  editorMode?: MarkdownEditorMode;
  defaultEditorMode?: MarkdownEditorMode;
  onEditorModeChange?: (mode: MarkdownEditorMode) => void;
  showEditorModeToggle?: boolean;
  view?: MarkdownEditorView;
  defaultView?: MarkdownEditorView;
  onViewChange?: (view: MarkdownEditorView) => void;
  showToolbar?: boolean;
  showStats?: boolean;
  showViewToggle?: boolean;
  gfm?: boolean;
  highlight?: boolean;
  previewVariant?: ComponentPropsWithoutRef<typeof MarkdownViewer>["variant"];
  editorMinHeight?: number;
  previewMinHeight?: number;
  richTextPlaceholder?: string;
}

const MarkdownEditor = forwardRef(function MarkdownEditor(
  {
    className,
    variant,
    value: valueProp,
    defaultValue = "",
    onChange,
    editorMode: editorModeProp,
    defaultEditorMode = "rich-text",
    onEditorModeChange,
    showEditorModeToggle = true,
    view: viewProp,
    defaultView = "split",
    onViewChange,
    showToolbar = true,
    showStats = true,
    showViewToggle = true,
    gfm = true,
    highlight = true,
    previewVariant = "default",
    editorMinHeight = 320,
    previewMinHeight = 320,
    disabled,
    readOnly,
    placeholder = "Write markdown here…",
    richTextPlaceholder = "Start writing…",
    ...props
  }: MarkdownEditorProps,
  ref: Ref<MarkdownEditorHandle>,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const richTextRef = useRef<MarkdownRichTextEditorHandle>(null);
  const previousControlledValue = useRef(valueProp);
  const isInternalChange = useRef(false);
  const isControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledEditorMode, setUncontrolledEditorMode] =
    useState<MarkdownEditorMode>(defaultEditorMode);
  const [uncontrolledView, setUncontrolledView] =
    useState<MarkdownEditorView>(defaultView);
  const history = useEditorHistory(
    isControlled ? (valueProp ?? "") : defaultValue,
  );

  const editorMode = editorModeProp ?? uncontrolledEditorMode;
  const view = viewProp ?? uncontrolledView;
  const value = isControlled ? (valueProp ?? "") : uncontrolledValue;
  const stats = getMarkdownStats(value);
  const isEditable = !disabled && !readOnly;
  const isRichText = editorMode === "rich-text";
  const resolvedView = isRichText ? "edit" : view;
  const resolvedShowViewToggle = showViewToggle && !isRichText;

  useEffect(() => {
    if (!isControlled) {
      return;
    }

    if (isInternalChange.current) {
      isInternalChange.current = false;
      previousControlledValue.current = valueProp;
      return;
    }

    if (valueProp === previousControlledValue.current) {
      return;
    }

    previousControlledValue.current = valueProp;
    history.reset(valueProp ?? "");
  }, [history, isControlled, valueProp]);

  const setValue = useCallback(
    (nextValue: string, recordHistory = true) => {
      isInternalChange.current = true;

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      if (recordHistory) {
        history.push(nextValue);
      }
      onChange?.(nextValue);
    },
    [history, isControlled, onChange],
  );

  const setView = useCallback(
    (nextView: MarkdownEditorView) => {
      if (viewProp === undefined) {
        setUncontrolledView(nextView);
      }
      onViewChange?.(nextView);
    },
    [onViewChange, viewProp],
  );

  const setEditorMode = useCallback(
    (nextMode: MarkdownEditorMode) => {
      if (editorModeProp === undefined) {
        setUncontrolledEditorMode(nextMode);
      }
      onEditorModeChange?.(nextMode);
    },
    [editorModeProp, onEditorModeChange],
  );

  const runAction = useCallback(
    (action: MarkdownEditorAction | "undo" | "redo") => {
      if (!isEditable) {
        return;
      }

      if (action === "undo") {
        const nextValue = history.undo();
        isInternalChange.current = true;
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onChange?.(nextValue);
        return;
      }

      if (action === "redo") {
        const nextValue = history.redo();
        isInternalChange.current = true;
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onChange?.(nextValue);
        return;
      }

      if (isRichText) {
        const nextValue = richTextRef.current?.insertAction(action);
        if (nextValue !== undefined) {
          setValue(nextValue);
        }
        return;
      }

      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      const nextValue = applyMarkdownAction(textarea, action);
      setValue(nextValue);
    },
    [history, isControlled, isEditable, isRichText, onChange, setValue],
  );

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (isRichText) {
          richTextRef.current?.focus();
          return;
        }
        textareaRef.current?.focus();
      },
      insertAction: (action) => runAction(action),
      getValue: () => value,
    }),
    [isRichText, runAction, value],
  );

  const handleShortcutKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>,
  ) => {
    if (!isEditable) {
      return;
    }

    const meta = event.metaKey || event.ctrlKey;

    if (!isRichText && event.key === "Tab") {
      event.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }
      const nextValue = handleTabKey(textarea, event.shiftKey);
      setValue(nextValue);
      return;
    }

    if (meta && !event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      runAction("undo");
      return;
    }

    if (meta && event.shiftKey && event.key.toLowerCase() === "z") {
      event.preventDefault();
      runAction("redo");
      return;
    }

    if (meta && event.key.toLowerCase() === "b") {
      event.preventDefault();
      runAction("bold");
      return;
    }

    if (meta && event.key.toLowerCase() === "i") {
      event.preventDefault();
      runAction("italic");
      return;
    }

    if (meta && event.key.toLowerCase() === "k") {
      event.preventDefault();
      runAction(event.shiftKey ? "codeBlock" : "link");
      return;
    }

    if (meta && event.key.toLowerCase() === "e") {
      event.preventDefault();
      runAction("inlineCode");
    }
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
  };

  const markdownEditor = (
    <textarea
      ref={textareaRef}
      data-slot="markdown-editor-input"
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      onKeyDown={(event) => {
        handleShortcutKeyDown(event);
        props.onKeyDown?.(event);
      }}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      spellCheck
      className={cn(editorSurfaceVariants({ variant }))}
      style={{ minHeight: editorMinHeight }}
      {...props}
    />
  );

  const richTextEditor = (
    <MarkdownRichTextEditor
      ref={richTextRef}
      value={value}
      onChange={handleChange}
      placeholder={richTextPlaceholder}
      disabled={disabled}
      readOnly={readOnly}
      variant={variant ?? "chrome"}
      minHeight={editorMinHeight}
      onKeyDown={(event) => {
        handleShortcutKeyDown(event);
      }}
    />
  );

  const editor = isRichText ? richTextEditor : markdownEditor;

  const preview = (
    <div
      data-slot="markdown-editor-preview"
      className="h-full min-w-0 p-4"
      style={{ minHeight: previewMinHeight }}
    >
      {value.trim() ? (
        <MarkdownViewer
          content={value}
          variant={previewVariant}
          gfm={gfm}
          highlight={highlight}
          className="min-w-0"
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Preview will appear here as you write.
        </p>
      )}
    </div>
  );

  return (
    <div
      data-slot="markdown-editor"
      data-view={resolvedView}
      data-editor-mode={editorMode}
      className={cn(markdownEditorVariants({ variant, className }), "min-w-0")}
    >
      {(showToolbar || resolvedShowViewToggle || showEditorModeToggle) && (
        <div className="flex flex-col gap-2 border-b border-[var(--glass-chrome-border)] sm:flex-row sm:items-center sm:justify-between">
          {showToolbar ? (
            <MarkdownEditorToolbar
              disabled={!isEditable}
              canUndo={history.canUndo}
              canRedo={history.canRedo}
              onAction={runAction}
              className="min-w-0 border-b-0 sm:flex-1"
            />
          ) : (
            <div />
          )}

          <div className="flex shrink-0 items-center justify-end gap-2 px-2 pb-2 sm:pb-0">
            {showEditorModeToggle ? (
              <ToggleGroup
                type="single"
                variant="plain"
                size="sm"
                value={editorMode}
                onValueChange={(next) => {
                  if (next) {
                    setEditorMode(next as MarkdownEditorMode);
                  }
                }}
              >
                <ToggleGroupItem value="rich-text" aria-label="Visual editor">
                  <VisualModeIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="markdown" aria-label="Markdown source">
                  <MarkdownModeIcon />
                </ToggleGroupItem>
              </ToggleGroup>
            ) : null}

            {resolvedShowViewToggle ? (
              <ToggleGroup
                type="single"
                variant="plain"
                size="sm"
                value={view}
                onValueChange={(next) => {
                  if (next) {
                    setView(next as MarkdownEditorView);
                  }
                }}
              >
                <ToggleGroupItem value="edit" aria-label="Edit only">
                  <EditIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="split" aria-label="Split view">
                  <SplitIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="preview" aria-label="Preview only">
                  <EyeIcon />
                </ToggleGroupItem>
              </ToggleGroup>
            ) : null}
          </div>
        </div>
      )}

      {resolvedView === "edit" ? (
        <ScrollArea variant={variant === "default" ? "default" : "chrome"}>
          {editor}
        </ScrollArea>
      ) : null}

      {resolvedView === "preview" ? (
        <ScrollArea variant={variant === "default" ? "default" : "chrome"}>
          {preview}
        </ScrollArea>
      ) : null}

      {resolvedView === "split" ? (
        <ResizablePanelGroup
          variant={variant === "default" ? "default" : "chrome"}
          className="min-h-0 w-full"
          style={{ minHeight: Math.max(editorMinHeight, previewMinHeight) }}
        >
          <ResizablePanel defaultSize={50} minSize={30}>
            <ScrollArea
              variant={variant === "default" ? "default" : "chrome"}
              className="h-full"
            >
              {editor}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle variant="chrome" />
          <ResizablePanel defaultSize={50} minSize={30}>
            <ScrollArea
              variant={variant === "default" ? "default" : "chrome"}
              className="h-full"
            >
              {preview}
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : null}

      {showStats ? (
        <div
          data-slot="markdown-editor-stats"
          className={cn(
            "flex items-center justify-between gap-3 border-t border-[var(--glass-chrome-border)]",
            "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_24%,transparent)]",
            "px-4 py-2 text-[11px] text-muted-foreground",
          )}
        >
          <span>
            {stats.words} words · {stats.characters} characters · {stats.lines}{" "}
            lines
          </span>
          <span className="inline-flex flex-wrap items-center justify-end gap-x-1 gap-y-0.5">
            {isRichText ? (
              <>
                <span>Visual editing ·</span>
                <KbdShortcut shortcut="⌘B" size="sm" variant="muted" />
                <span>bold ·</span>
                <KbdShortcut shortcut="⌘I" size="sm" variant="muted" />
                <span>italic ·</span>
                <KbdShortcut shortcut="⌘K" size="sm" variant="muted" />
                <span>link</span>
              </>
            ) : (
              <>
                <Kbd size="sm" variant="muted">
                  Tab
                </Kbd>
                <span>to indent ·</span>
                <KbdShortcut shortcut="⌘B" size="sm" variant="muted" />
                <span>bold ·</span>
                <KbdShortcut shortcut="⌘K" size="sm" variant="muted" />
                <span>link ·</span>
                <KbdShortcut shortcut="⌘⇧K" size="sm" variant="muted" />
                <span>code block</span>
              </>
            )}
          </span>
        </div>
      ) : null}
    </div>
  );
});

export {
  MarkdownEditor,
  MarkdownEditorToolbar,
  markdownEditorVariants,
  editorSurfaceVariants,
  type MarkdownEditorView,
  type MarkdownEditorMode,
};