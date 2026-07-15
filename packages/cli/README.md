# @intellihelper/cli

Official CLI for **[IntelliHelper UI](https://ui.intellihelper.in)** — copy Liquid Glass React components into your project, keep them up to date, and connect coding agents via an **MCP server**.

```bash
npx @intellihelper/cli@latest init
npx @intellihelper/cli@latest add button card dialog
```

**Docs:** [ui.intellihelper.in](https://ui.intellihelper.in) · **Getting started:** [ui.intellihelper.in/getting-started](https://ui.intellihelper.in/getting-started) · **Registry:** [ui.intellihelper.in/r/registry.json](https://ui.intellihelper.in/r/registry.json)

---

## What it does

| Feature | Description |
| --- | --- |
| **Init** | Creates a `components.json` config (aliases, CSS path, registry URL) |
| **Add** | Copies component source into your app and installs npm dependencies |
| **Update / Diff** | Pulls registry updates; prompts before overwriting local edits |
| **List** | Shows available and installed components |
| **MCP** | Stdio MCP server so agents can browse, search, and install components |

Components are **copied into your codebase** (shadcn-style). You own the source and can customize freely.

---

## Requirements

- **Node.js** 18 or newer
- A **React** project with **Tailwind CSS** (Next.js App Router recommended)
- Path aliases configured in `tsconfig.json` (e.g. `@/*` → project root)

---

## Installation

You do **not** need a global install. Use `npx` (or `pnpm dlx` / `bunx`):

```bash
npx @intellihelper/cli@latest <command>
```

Optional global install:

```bash
npm install -g @intellihelper/cli

# binaries
intellihelper-ui <command>
intelli-ui <command>
```

---

## Quick start

```bash
# 1. Scaffold components.json
npx @intellihelper/cli@latest init

# 2. Add components (utils and registry deps resolve automatically)
npx @intellihelper/cli@latest add button card tabs dialog

# 3. Use them in your app
```

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <Button variant="primary">Continue</Button>
    </Card>
  )
}
```

Browse all components and live demos: [ui.intellihelper.in](https://ui.intellihelper.in)

---

## Commands

### `init`

Create `components.json` in the project root.

```bash
npx @intellihelper/cli@latest init
npx @intellihelper/cli@latest init -y   # defaults, no prompts
```

| Option | Description |
| --- | --- |
| `-y, --yes` | Use defaults without interactive prompts |

Default config highlights:

- **Style:** `intelli-glass`
- **Registry:** `https://ui.intellihelper.in/r`
- **UI alias:** `@/components/ui`
- **Utils alias:** `@/lib/utils`
- **CSS:** `app/globals.css`

---

### `add`

Install one or more components from the registry.

```bash
npx @intellihelper/cli@latest add button
npx @intellihelper/cli@latest add button card dialog sheet
npx @intellihelper/cli@latest add              # interactive picker (TTY)
npx @intellihelper/cli@latest add button --dry-run
```

| Option | Description |
| --- | --- |
| `-y, --yes` | Skip confirmation prompts |
| `-o, --overwrite` | Overwrite existing files without prompting |
| `--dry-run` | Preview file writes without changing the disk |

Registry dependencies (e.g. `utils`) and npm packages are installed automatically.

---

### `update`

Update installed components from the registry. Detects local modifications and prompts before overwrite.

```bash
npx @intellihelper/cli@latest update
npx @intellihelper/cli@latest update button dialog
npx @intellihelper/cli@latest update --skip-modified
npx @intellihelper/cli@latest update --dry-run
```

| Option | Description |
| --- | --- |
| `-y, --yes` | Skip confirmation prompts |
| `-o, --overwrite` | Overwrite local modifications without prompting |
| `--skip-modified` | Leave locally modified files unchanged |
| `--dry-run` | Preview updates only |

---

### `diff`

Show differences between installed files and the registry.

```bash
npx @intellihelper/cli@latest diff
npx @intellihelper/cli@latest diff button
```

---

### `list`

List registry components, or only what is installed.

```bash
npx @intellihelper/cli@latest list
npx @intellihelper/cli@latest list --installed
```

| Option | Description |
| --- | --- |
| `--installed` | Only list components tracked in the local manifest |

---

### `mcp`

Run the **Model Context Protocol** server (stdio) so AI coding agents can use the IntelliHelper UI registry.

```bash
# Start MCP server (used by agents — not for interactive terminals)
npx @intellihelper/cli@latest mcp

# Write client config into your project
npx @intellihelper/cli@latest mcp init
npx @intellihelper/cli@latest mcp init --client cursor
npx @intellihelper/cli@latest mcp init --client claude
npx @intellihelper/cli@latest mcp init --client vscode
npx @intellihelper/cli@latest mcp init --client opencode
npx @intellihelper/cli@latest mcp init --client codex
```

| Option | Description |
| --- | --- |
| `-c, --cwd <path>` | Working directory for the server / init (default: current directory) |
| `--client <name>` | For `mcp init`: `claude` · `cursor` · `vscode` · `codex` · `opencode` |

**Server name:** `intellihelper-ui`

#### MCP tools

| Tool | Purpose |
| --- | --- |
| `get_project_config` | Read `components.json` and setup guidance |
| `list_components` | Browse by category / type |
| `search_components` | Fuzzy search by name, title, description, meta |
| `get_component` | Full source, variants, sizes, dependencies |
| `get_component_examples` | Usage snippets ready to adapt |
| `get_add_command` | Returns the install CLI command (does not write files) |
| `list_themes` | Themes: mono, aurora, sunset, frost, ocean |
| `get_audit_checklist` | Post-install QA checklist |

In clients that namespace tools, names look like `intellihelper-ui__search_components`.

#### One-shot init per agent

| Client | Command | Config path |
| --- | --- | --- |
| Cursor | `npx @intellihelper/cli@latest mcp init --client cursor` | `.cursor/mcp.json` |
| Claude Code | `npx @intellihelper/cli@latest mcp init --client claude` | `.mcp.json` |
| VS Code | `npx @intellihelper/cli@latest mcp init --client vscode` | `.vscode/mcp.json` |
| OpenCode | `npx @intellihelper/cli@latest mcp init --client opencode` | `opencode.json` |
| Codex | `npx @intellihelper/cli@latest mcp init --client codex` | prints setup for `~/.codex/config.toml` |

#### Manual config examples

**Cursor / Claude Code** (`.cursor/mcp.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "intellihelper-ui": {
      "command": "npx",
      "args": ["-y", "@intellihelper/cli@latest", "mcp"]
    }
  }
}
```

**Grok Build** (`~/.grok/config.toml` or project `.grok/config.toml`):

```toml
[mcp_servers.intellihelper-ui]
command = "npx"
args = ["-y", "@intellihelper/cli@latest", "mcp"]
enabled = true
```

**Codex** (`~/.codex/config.toml`):

```toml
[mcp_servers.intellihelper-ui]
command = "npx"
args = ["-y", "@intellihelper/cli@latest", "mcp"]
```

Restart the agent after writing config. Example prompts:

- “Show me all IntelliHelper UI glass components”
- “Add button, dialog, and card from IntelliHelper UI”
- “Show me usage examples for the sheet component”
- “Search IntelliHelper UI for form inputs”

More detail: [Getting started → MCP](https://ui.intellihelper.in/getting-started#mcp)

---

## Components

40+ Liquid Glass components across categories:

| Category | Examples |
| --- | --- |
| **Glass system** | `glass-bar`, `glass-content-card`, `glass-icon-button`, `background-picture-picker`, `component-preview` |
| **Actions** | `button`, `toggle`, `toggle-group` |
| **Surfaces** | `card`, `tabs`, `separator`, `resizable`, `scroll-area` |
| **Forms** | `input`, `textarea`, `select`, `checkbox`, `switch`, `radio-group`, `calendar` |
| **Overlays** | `dialog`, `sheet`, `popover`, `hover-card`, `tooltip` |
| **Navigation** | `sidebar`, `pagination`, `scroll-to-top` |
| **Data** | `table`, `empty`, `skeleton` |
| **Feedback** | `alert`, `badge`, `kbd`, `spinner`, `progress` |
| **Interactive** | `accordion`, `collapsible`, `slider`, `carousel` |
| **Content** | `typography`, `markdown-viewer`, `markdown-editor` |

```bash
npx @intellihelper/cli@latest list
```

---

## Themes

IntelliHelper UI ships Liquid Glass themes driven by CSS variables:

| ID | Label |
| --- | --- |
| `mono` | Mono Basic |
| `aurora` | Cool Aurora |
| `sunset` | Warm Sunset |
| `frost` | Neutral Frost |
| `ocean` | Deep Ocean |

List themes from an agent with the MCP `list_themes` tool, or explore them on the [docs site](https://ui.intellihelper.in).

---

## Configuration

`components.json` (created by `init`):

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "intelli-glass",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registry": "https://ui.intellihelper.in/r"
}
```

The CLI resolves component files, rewrites import aliases to match your config, and tracks installed components in a local manifest for `update` / `diff` / `list --installed`.

---

## How it works

1. **Registry** — Components are published as JSON items at `https://ui.intellihelper.in/r` (also bundled inside this package for offline-friendly MCP tooling).
2. **Install** — `add` fetches items, writes source under your UI alias path, and installs npm deps.
3. **Own the code** — Files live in *your* repo; edit freely. Use `update` / `diff` when you want upstream changes.
4. **Agents** — `mcp` exposes the same registry over stdio MCP for Cursor, Claude Code, VS Code, Codex, OpenCode, Grok, and other MCP clients.

---

## Troubleshooting

| Issue | What to try |
| --- | --- |
| `Missing components.json` | Run `npx @intellihelper/cli@latest init` |
| Component not found | Run `list` and use the exact slug (e.g. `glass-bar`) |
| Import path errors | Align `aliases` in `components.json` with `tsconfig` paths |
| Styles look wrong | Ensure global CSS includes IntelliHelper / Liquid Glass tokens and theme variables |
| MCP tools missing | Restart the agent after `mcp init`; confirm the server is enabled |
| Overwrote local edits | Prefer `diff` first; use `update --skip-modified` to protect customizations |

---

## Links

- **Website / docs:** [https://ui.intellihelper.in](https://ui.intellihelper.in)
- **Getting started:** [https://ui.intellihelper.in/getting-started](https://ui.intellihelper.in/getting-started)
- **MCP setup:** [https://ui.intellihelper.in/getting-started#mcp](https://ui.intellihelper.in/getting-started#mcp)
- **npm:** [https://www.npmjs.com/package/@intellihelper/cli](https://www.npmjs.com/package/@intellihelper/cli)
- **Source:** [https://github.com/IntelliHelper/IntelliHelper-UI](https://github.com/IntelliHelper/IntelliHelper-UI) (`packages/cli`)
- **Issues:** [https://github.com/IntelliHelper/IntelliHelper-UI/issues](https://github.com/IntelliHelper/IntelliHelper-UI/issues)

---

## License

MIT
```