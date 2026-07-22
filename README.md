# Intelli UI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![CI/CD](https://github.com/IntelliHelper/IntelliHelper-UI/actions/workflows/ci.yml/badge.svg)](https://github.com/IntelliHelper/IntelliHelper-UI/actions/workflows/ci.yml)
[![Docs](https://img.shields.io/badge/docs-ui.intellihelper.in-0ea5e9)](https://ui.intellihelper.in)
[![npm](https://img.shields.io/npm/v/@intellihelper/cli?label=%40intellihelper%2Fcli)](https://www.npmjs.com/package/@intellihelper/cli)

**Liquid Glass component library for React & Next.js** — copy-paste Tailwind components you own, install with a CLI, and wire into AI coding agents via MCP.

## About

**Intelli UI** (by [IntelliHelper](https://github.com/IntelliHelper)) is an open-source **Liquid Glass** design system: frosted chrome, expressive content panels, and a shadcn-style workflow so components land in *your* repo. Interactive primitives build on **[Radix UI](https://www.radix-ui.com/)** for accessibility and behavior; Liquid Glass styling, themes, and ownership stay with you. Use it to build product UI with Next.js + Tailwind, or drive installs from coding agents through the official CLI, plugin, and MCP server.

| | |
| --- | --- |
| **Docs & playground** | [ui.intellihelper.in](https://ui.intellihelper.in) |
| **Getting started** | [ui.intellihelper.in/getting-started](https://ui.intellihelper.in/getting-started) |
| **Registry** | [ui.intellihelper.in/r/registry.json](https://ui.intellihelper.in/r/registry.json) |
| **CLI** | [`@intellihelper/cli`](./packages/cli) |
| **SEO playbook** | [docs/SEO-PLAYBOOK.md](./docs/SEO-PLAYBOOK.md) |
| **Repository** | [github.com/IntelliHelper/IntelliHelper-UI](https://github.com/IntelliHelper/IntelliHelper-UI) |
| **License** | [MIT](./LICENSE) |
| **Contributing** | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| **Security** | [SECURITY.md](./SECURITY.md) |
| **Code of conduct** | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) |
| **Support** | [SUPPORT.md](./SUPPORT.md) |

---

## What is Intelli UI?

Intelli UI (by **IntelliHelper**) is a **Liquid Glass** design system and component library:

- **80+ React components** built with TypeScript and Tailwind CSS  
- **Radix UI** under the hood for dialogs, menus, tabs, and other accessible primitives  
- **Copy-paste workflow** — components land in *your* codebase (shadcn-style ownership)  
- **CLI** — `npx @intellihelper/cli` to init, add, update, and list components  
- **Agent plugin** ([IntelliHelper/agent-skills](https://github.com/IntelliHelper/agent-skills)) — skills + MCP + slash commands for Claude, Grok, Codex, Gemini  
- **MCP server** (`intellihelper-ui`) — Cursor, Claude Code, VS Code, Codex, OpenCode, Grok  
- **Live playground** — previews, source, and install commands at [ui.intellihelper.in](https://ui.intellihelper.in)  
- **Themes** — mono, aurora, sunset, frost, ocean  

---

## Quick start (consumers)

Use this in any React + Tailwind project (Next.js App Router recommended):

```bash
npx @intellihelper/cli@latest init
npx @intellihelper/cli@latest add button card dialog
```

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <Button>Continue</Button>
    </Card>
  );
}
```

**Agent plugin (recommended for coding agents):**

```bash
claude plugin marketplace add IntelliHelper/agent-skills
claude plugin install intellihelper-ui@intellihelper

grok plugin install IntelliHelper/agent-skills --trust
```

**MCP only:**

```bash
npx @intellihelper/cli@latest mcp init --client cursor
# or: claude | vscode | codex | opencode
```

Plugin: [IntelliHelper/agent-skills](https://github.com/IntelliHelper/agent-skills) · CLI docs: [packages/cli/README.md](./packages/cli/README.md)

---

## Monorepo structure

This repository is a **pnpm + Turborepo** workspace.

```
apps/
  playground/          # Next.js docs site & component registry host (ui.intellihelper.in)
  native-playground/   # React Native playground for @intelli/ui-native
  registry/            # Registry metadata packaging
packages/
  ui/                  # Web React components (@intelli/ui)
  ui-native/           # React Native components (@intelli/ui-native)
  cli/                 # @intellihelper/cli + MCP server
  themes/              # Theme CSS + ThemeProvider
  tokens/              # Design tokens
  animations/          # Shared animation utilities
  utils/               # Shared utils (cn, focus-ring, …)
  config/              # Shared PostCSS / global CSS entry
  eslint-config/       # Shared ESLint configs
  typescript-config/   # Shared TSConfigs
docs/
  SEO-PLAYBOOK.md      # Keyword map, content calendar, technical SEO ops
```

### Apps

| App | Package name | Description |
| --- | --- | --- |
| **playground** | `playground` | Public docs, demos, OG images, sitemap, `llms.txt`, RSS, `/r/*` registry |
| **native-playground** | `native-playground` | Expo-style playground for native components |
| **registry** | — | Registry source / packaging helpers |

### Packages

| Package | Role |
| --- | --- |
| `@intelli/ui` | Liquid Glass web components |
| `@intelli/ui-native` | Native component set |
| `@intellihelper/cli` | Install CLI + MCP (`intellihelper-ui`) |
| `@intelli/themes` | Theme styles and provider |
| `@intelli/tokens` | Design tokens |
| `@intelli/utils` | Shared utilities |
| `@intelli/config` | Shared frontend config |
| `@intelli/animations` | Animation CSS |

---

## Develop this repo

### Requirements

- **Node.js** ≥ 18  
- **pnpm** 9 (`packageManager`: `pnpm@9.0.0`)

### Install

```bash
pnpm install
```

### Scripts (root)

```bash
pnpm dev            # turbo dev (all packages with a dev task)
pnpm build          # turbo build
pnpm lint           # turbo lint
pnpm check-types    # turbo typecheck
pnpm format         # prettier write
pnpm native         # native playground only
```

### Playground (docs site)

```bash
pnpm --filter playground dev      # http://localhost:3000
pnpm --filter playground build
pnpm --filter playground check-types
```

The playground `prebuild` step bundles the public registry into `apps/playground/public/r/`.

### CLI (local)

```bash
pnpm --filter @intellihelper/cli build
# then exercise via node packages/cli/dist/index.js … or published npx package
```

---

## Public SEO & discovery endpoints

Served by the playground app (production: `https://ui.intellihelper.in`):

| Endpoint | Purpose |
| --- | --- |
| `/sitemap.xml` | Machine sitemap |
| `/sitemap` | HTML sitemap |
| `/robots.txt` | Crawl rules |
| `/llms.txt` | AI / LLM site summary |
| `/rss.xml` | Component & docs feed |
| `/manifest.webmanifest` | PWA manifest |
| `/r/registry.json` | Component registry |
| `/categories/{category}` | Category landings |
| `/components/{slug}` | Component docs |

Strategy, keyword map, and 12-week content calendar: **[docs/SEO-PLAYBOOK.md](./docs/SEO-PLAYBOOK.md)**.

---

## Themes

Intelli UI ships multiple Liquid Glass themes (e.g. **mono**, **aurora**, **sunset**, **frost**, **ocean**). Theme CSS and the React `ThemeProvider` live in [`packages/themes`](./packages/themes). The playground exposes a theme switcher for live previews.

---

## Tech stack

| Layer | Stack |
| --- | --- |
| **UI components** | React 19, TypeScript, Tailwind CSS 4 |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) (`@radix-ui/react-*`) for a11y, focus, and interaction |
| **Styling system** | Liquid Glass tokens + themes (`@intelli/themes`, `@intelli/tokens`) |
| **Docs / playground** | Next.js 16 |
| **Tooling** | Turborepo, pnpm workspaces, `@intellihelper/cli`, MCP |

Interactive components (dialog, select, dropdown, tabs, accordion, and similar) wrap Radix primitives and layer Liquid Glass chrome/content styles on top. Some surfaces (glass bar, markdown, data tables, AI chat, etc.) are custom-built without Radix.

When you `npx @intellihelper/cli add …`, the registry installs the matching `@radix-ui/*` packages into **your** project alongside the component source.

---

## Acknowledgments

Intelli UI stands on excellent open-source work:

- **[Radix UI](https://www.radix-ui.com/)** ([radix-ui/primitives](https://github.com/radix-ui/primitives)) — unstyled, accessible React primitives (MIT). Behavior and ARIA patterns for many components come from these packages; visual design is IntelliHelper Liquid Glass.
- **[shadcn/ui](https://ui.shadcn.com/)** — inspiration for the copy-paste registry / CLI ownership model (not a fork of their component source).
- **React**, **Next.js**, **Tailwind CSS**, and the rest of the JS tooling ecosystem.

Third-party packages keep their own licenses; they are declared in each package’s `package.json` and ship via npm. This repository’s own code is MIT — see [License](#license).

---

## Contributing

We welcome issues and pull requests. Please read:

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — setup, workflow, component checklist  
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** — community standards  
- **[SECURITY.md](./SECURITY.md)** — private vulnerability reporting  

Quick start for contributors:

```bash
pnpm install
pnpm --filter playground dev
```

1. Branch from `main`  
2. Keep component catalog + registry in sync when adding UI  
3. New public components should ship with: catalog entry, examples, install path, and (for docs) FAQ/related links  
4. Run `pnpm lint` and `pnpm check-types` before opening a PR  

For CLI behavior details, see [packages/cli/README.md](./packages/cli/README.md). Support options: [SUPPORT.md](./SUPPORT.md).

---

## License

This project is licensed under the **[MIT License](./LICENSE)**.

Copyright © 2025–2026 IntelliHelper.  
Published packages (including `@intellihelper/cli`) use the same MIT terms unless a package file states otherwise.

---

## Links

- [Documentation](https://ui.intellihelper.in)  
- [Getting started](https://ui.intellihelper.in/getting-started)  
- [SEO playbook](./docs/SEO-PLAYBOOK.md)  
- [CLI package](./packages/cli)  
- [Agent skills](https://github.com/IntelliHelper/agent-skills)  
- [Radix UI](https://www.radix-ui.com/)  
- [GitHub](https://github.com/IntelliHelper/IntelliHelper-UI)  
- [Issues](https://github.com/IntelliHelper/IntelliHelper-UI/issues)  
- [Security advisories](https://github.com/IntelliHelper/IntelliHelper-UI/security)  
