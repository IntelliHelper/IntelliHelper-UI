export interface TextSelection {
  start: number;
  end: number;
  value: string;
}

export function getTextSelection(textarea: HTMLTextAreaElement): TextSelection {
  return {
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
    value: textarea.value,
  };
}

export function applyTextChange(
  textarea: HTMLTextAreaElement,
  nextValue: string,
  selectionStart: number,
  selectionEnd: number,
) {
  textarea.value = nextValue;
  textarea.setSelectionRange(selectionStart, selectionEnd);
  textarea.focus();
}

export function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string = before,
  placeholder = "text",
) {
  const { start, end, value } = getTextSelection(textarea);
  const selected = value.slice(start, end) || placeholder;
  const nextValue =
    value.slice(0, start) + before + selected + after + value.slice(end);
  const selectionStart = start + before.length;
  const selectionEnd = selectionStart + selected.length;
  applyTextChange(textarea, nextValue, selectionStart, selectionEnd);
  return nextValue;
}

function getLineBlock(value: string, start: number, end: number) {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = value.indexOf("\n", end);
  const blockEnd = lineEnd === -1 ? value.length : lineEnd;

  return { lineStart, blockEnd };
}

export function prefixLines(
  textarea: HTMLTextAreaElement,
  transform: (line: string, index: number) => string,
) {
  const { start, end, value } = getTextSelection(textarea);
  const { lineStart, blockEnd } = getLineBlock(value, start, end);
  const block = value.slice(lineStart, blockEnd);
  const prefixed = block
    .split("\n")
    .map((line, index) => transform(line, index))
    .join("\n");
  const nextValue = value.slice(0, lineStart) + prefixed + value.slice(blockEnd);
  applyTextChange(textarea, nextValue, lineStart, lineStart + prefixed.length);
  return nextValue;
}

export function toggleHeading(
  textarea: HTMLTextAreaElement,
  level: 1 | 2 | 3 | 4,
) {
  const prefix = `${"#".repeat(level)} `;

  return prefixLines(textarea, (line) => {
    const stripped = line.replace(/^#{1,6}\s+/, "");
    if (line.startsWith(prefix)) {
      return stripped;
    }
    return prefix + stripped;
  });
}

export function toggleLinePrefix(
  textarea: HTMLTextAreaElement,
  prefix: string,
  toggleOff = true,
) {
  return prefixLines(textarea, (line) => {
    if (toggleOff && line.startsWith(prefix)) {
      return line.slice(prefix.length);
    }
    return prefix + line;
  });
}

export function insertBlock(
  textarea: HTMLTextAreaElement,
  block: string,
  cursorOffset = 0,
) {
  const { start, end, value } = getTextSelection(textarea);
  const needsLeadingNewline = start > 0 && value[start - 1] !== "\n";
  const needsTrailingNewline = end < value.length && value[end] !== "\n";
  const insertion =
    (needsLeadingNewline ? "\n" : "") +
    block +
    (needsTrailingNewline ? "\n" : "");
  const nextValue = value.slice(0, start) + insertion + value.slice(end);
  const cursor = start + insertion.length + cursorOffset;
  applyTextChange(textarea, nextValue, cursor, cursor);
  return nextValue;
}

export function handleTabKey(
  textarea: HTMLTextAreaElement,
  shiftKey: boolean,
) {
  const { start, end, value } = getTextSelection(textarea);

  if (start !== end) {
    const { lineStart, blockEnd } = getLineBlock(value, start, end);
    const block = value.slice(lineStart, blockEnd);
    const lines = block.split("\n");

    const indented = lines
      .map((line) => {
        if (shiftKey) {
          if (line.startsWith("  ")) {
            return line.slice(2);
          }
          if (line.startsWith("\t")) {
            return line.slice(1);
          }
          return line;
        }
        return `  ${line}`;
      })
      .join("\n");

    const nextValue =
      value.slice(0, lineStart) + indented + value.slice(blockEnd);
    applyTextChange(textarea, nextValue, lineStart, lineStart + indented.length);
    return nextValue;
  }

  const tab = "  ";
  const nextValue = value.slice(0, start) + tab + value.slice(end);
  applyTextChange(textarea, nextValue, start + tab.length, start + tab.length);
  return nextValue;
}

export function getMarkdownStats(value: string) {
  const lines = value.length === 0 ? 0 : value.split("\n").length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return {
    characters: value.length,
    lines,
    words,
  };
}

export type MarkdownEditorAction =
  | "bold"
  | "italic"
  | "strikethrough"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "bulletList"
  | "orderedList"
  | "taskList"
  | "blockquote"
  | "inlineCode"
  | "codeBlock"
  | "link"
  | "image"
  | "table"
  | "horizontalRule";

export function applyMarkdownAction(
  textarea: HTMLTextAreaElement,
  action: MarkdownEditorAction,
) {
  switch (action) {
    case "bold":
      return wrapSelection(textarea, "**", "**", "bold text");
    case "italic":
      return wrapSelection(textarea, "*", "*", "italic text");
    case "strikethrough":
      return wrapSelection(textarea, "~~", "~~", "strikethrough");
    case "heading1":
      return toggleHeading(textarea, 1);
    case "heading2":
      return toggleHeading(textarea, 2);
    case "heading3":
      return toggleHeading(textarea, 3);
    case "heading4":
      return toggleHeading(textarea, 4);
    case "bulletList":
      return toggleLinePrefix(textarea, "- ");
    case "orderedList":
      return prefixLines(textarea, (line, index) => {
        const stripped = line.replace(/^\d+\.\s+/, "");
        const prefix = `${index + 1}. `;
        if (line.startsWith(prefix)) {
          return stripped;
        }
        return prefix + stripped;
      });
    case "taskList":
      return toggleLinePrefix(textarea, "- [ ] ");
    case "blockquote":
      return toggleLinePrefix(textarea, "> ");
    case "inlineCode":
      return wrapSelection(textarea, "`", "`", "code");
    case "codeBlock":
      return wrapSelection(textarea, "```\n", "\n```", "code");
    case "link":
      return wrapSelection(textarea, "[", "](url)", "link text");
    case "image":
      return wrapSelection(textarea, "![", "](url)", "alt text");
    case "table":
      return insertBlock(
        textarea,
        "| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell | Cell | Cell |\n",
        -1,
      );
    case "horizontalRule":
      return insertBlock(textarea, "---\n");
    default:
      return textarea.value;
  }
}

export const MARKDOWN_EDITOR_SHORTCUTS: Partial<
  Record<MarkdownEditorAction, string>
> = {
  bold: "⌘B",
  italic: "⌘I",
  link: "⌘K",
  inlineCode: "⌘E",
  codeBlock: "⌘⇧K",
};