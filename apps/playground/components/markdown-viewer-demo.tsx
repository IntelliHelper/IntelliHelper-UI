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

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"
\`\`\`

### Task list

- [x] Typography-mapped headings
- [x] Chrome and outline containers
- [ ] Your next feature here

| Plan | Price | Notes |
| --- | --- | --- |
| Starter | Free | Basic glass components |
| Pro | $12 | Full registry access |
| Team | $29 | Shared workspace controls |
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

export function MarkdownViewerDemo() {
  const [markdown, setMarkdown] = useState(editorSeed);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Markdown Editor</p>
        <p className="text-sm text-muted-foreground">
          Visual mode for everyday writing, or Markdown mode for power users.
          Both share the same toolbar, undo/redo, and live stats.
        </p>
        <MarkdownEditor
          value={markdown}
          onChange={setMarkdown}
          variant="chrome"
          defaultEditorMode="rich-text"
          defaultView="split"
          gfm
          highlight
          editorMinHeight={280}
          previewMinHeight={280}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Chrome container</p>
          <MarkdownViewer content={sampleMarkdown} variant="chrome" gfm />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Scrollable outline</p>
          <MarkdownViewer
            content={sampleMarkdown}
            variant="outline"
            gfm
            scrollable
            maxHeight={360}
          />
        </div>
      </div>
    </div>
  );
}