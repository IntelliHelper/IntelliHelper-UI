# Intelli UI

**Liquid Glass component library for React & Next.js** — copy-paste Tailwind components you own, install with a CLI, and wire into AI coding agents via MCP.

| | |
| --- | --- |
| **Docs & playground** | [ui.intellihelper.in](https://ui.intellihelper.in) |
| **Getting started** | [ui.intellihelper.in/getting-started](https://ui.intellihelper.in/getting-started) |
| **Registry** | [ui.intellihelper.in/r/registry.json](https://ui.intellihelper.in/r/registry.json) |
| **CLI** | [`@intellihelper/cli`](./packages/cli) |
| **SEO playbook** | [docs/SEO-PLAYBOOK.md](./docs/SEO-PLAYBOOK.md) |
| **Repository** | [github.com/IntelliHelper/IntelliHelper-UI](https://github.com/IntelliHelper/IntelliHelper-UI) |

---

## What is Intelli UI?

Intelli UI (by **IntelliHelper**) is a **Liquid Glass** design system and component library:

- **40+ React components** built with TypeScript and Tailwind CSS  
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

- **React 19** / **Next.js 16** (playground)  
- **Tailwind CSS 4**  
- **TypeScript 5.9**  
- **Turborepo** + **pnpm** workspaces  
- **Radix-style** accessible primitives (where applicable)  

---

## Contributing

1. Fork / branch from the active feature branch  
2. `pnpm install`  
3. Run `pnpm --filter playground dev` for UI work  
4. Keep component catalog + registry in sync when adding UI  
5. New public components should ship with: catalog entry, examples, install path, and (for docs) FAQ/related links  

For CLI behavior details, see [packages/cli/README.md](./packages/cli/README.md).

---

## License

MIT (see package licenses; CLI is published as MIT under `@intellihelper/cli`).

---

## Links

- [Documentation](https://ui.intellihelper.in)  
- [Getting started](https://ui.intellihelper.in/getting-started)  
- [SEO playbook](./docs/SEO-PLAYBOOK.md)  
- [CLI package](./packages/cli)  
- [GitHub](https://github.com/IntelliHelper/IntelliHelper-UI)  
