"use client";

import { useState } from "react";
import { MarkdownEditor, MarkdownViewer } from "@intelli/ui";

const sampleMarkdown = `# Markdown Viewer

Render **rich documentation** with glass-styled typography primitives.

## Features

- Headings, lists, and blockquotes
- Inline \`code\` and fenced blocks
- [External links](https://ui.intellihelper.in)
- GitHub-flavored tables and task lists

> Everyone enjoys a good joke, so it is only fair they should pay for the privilege.

### Syntax highlighting

\`\`\`ts
import { MarkdownViewer } from "@intelli/ui";

<MarkdownViewer content={markdown} variant="chrome" gfm highlight />
\`\`\`

### Task list

- [x] Typography-mapped headings
- [x] Chrome and outline containers
- [ ] Your next feature here

| Plan | Price | Notes |
| --- | --- | --- |
| Starter | Free | Basic glass components |
| Pro | $12 | Full registry access |
`;

const editorSeed = `Write like a normal document — no markdown knowledge required.

Use the toolbar to make text **bold**, add headings, lists, links, and more. Switch to Markdown mode anytime to see or edit the source.

## What you can do

- Format with the toolbar or keyboard shortcuts
- Add bullet and numbered lists
- Insert links, images, and tables
- Toggle between Visual and Markdown modes

> Visual mode stores everything as markdown behind the scenes, so your content stays portable.
`;

export function MarkdownViewerOnlyDemo() {
  return (
    <MarkdownViewer
      content={sampleMarkdown}
      variant="chrome"
      gfm
      highlight
      scrollable
      maxHeight="min(480px, 60vh)"
      className="w-full"
    />
  );
}

export function MarkdownEditorDemo() {
  const [markdown, setMarkdown] = useState(editorSeed);

  return (
    <MarkdownEditor
      value={markdown}
      onChange={setMarkdown}
      variant="chrome"
      defaultEditorMode="rich-text"
      gfm
      highlight
      editorMinHeight={200}
      previewMinHeight={200}
      className="w-full"
    />
  );
}

/** Combined showcase — not used in per-component examples. */
export function MarkdownViewerDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Markdown Editor</p>
        <MarkdownEditorDemo />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Markdown Viewer</p>
        <MarkdownViewerOnlyDemo />
      </div>
    </div>
  );
}