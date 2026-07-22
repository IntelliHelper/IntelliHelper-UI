# Contributing to Intelli UI

Thanks for your interest in **IntelliHelper UI** (Intelli UI) — a Liquid Glass component library for React and Next.js.

By participating, you agree to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to contribute

| Area | Examples |
| --- | --- |
| **Components** | New primitives, bug fixes, a11y, variants, themes |
| **Docs / playground** | Examples, guides, SEO pages, landing copy |
| **CLI / MCP** | `add` / `update` / `list`, MCP tools, agent DX |
| **Native** | `@intelli/ui-native` and Expo playground |
| **Community** | Issues, reproductions, reviews, translations |

## Before you start

1. Search [existing issues](https://github.com/IntelliHelper/IntelliHelper-UI/issues) and PRs.
2. For large features, open an issue first so we can align on API and scope.
3. Read the [README](./README.md) and, for UI work, the live docs:
   - https://ui.intellihelper.in
   - https://ui.intellihelper.in/getting-started

## Development setup

### Requirements

- **Node.js** ≥ 18 (20 recommended)
- **pnpm** 9 (`packageManager` is pinned in root `package.json`)
- Git

### Install

```bash
git clone https://github.com/IntelliHelper/IntelliHelper-UI.git
cd IntelliHelper-UI
pnpm install
```

### Common commands

```bash
# Whole monorepo
pnpm dev              # turbo dev (playground + packages as configured)
pnpm lint
pnpm check-types
pnpm build

# Playground (docs site)
pnpm --filter playground dev
pnpm --filter playground lint
pnpm --filter playground check-types
pnpm --filter playground build

# CLI
pnpm --filter @intellihelper/cli build
```

Playground defaults to [http://localhost:3000](http://localhost:3000).

### Monorepo map

```text
apps/playground/     # Next.js docs + registry host (ui.intellihelper.in)
apps/native-playground/
packages/ui/         # Web React components (@intelli/ui)
packages/ui-native/  # React Native components
packages/cli/        # @intellihelper/cli + MCP server
packages/themes/     # Theme CSS + ThemeProvider
packages/tokens/     # Design tokens
packages/utils/      # cn, focus-ring, …
```

## Contribution guidelines

### Branching

- Branch from `main`: `git checkout -b fix/short-description` or `feat/…`
- Keep PRs focused — one concern per PR when possible

### Code quality

- TypeScript strictness: no `any` without a short comment
- Match existing patterns in the package you touch
- Prefer design tokens / theme CSS variables over hard-coded colors
- Respect Liquid Glass **chrome vs content** layers (neutral chrome, expressive CTAs)
- Accessibility: labels, keyboard focus, `aria-*` where needed
- Run `pnpm lint` and `pnpm check-types` before opening a PR

### Adding or changing a UI component

When you ship or materially change a public component:

1. **Implementation** in `packages/ui/src/` (and exports in `index.ts` if required)
2. **Catalog** entry in `apps/playground/lib/catalog.ts`
3. **Examples** for the playground (see existing `components/*-demo.tsx` / examples map)
4. **Registry** — keep registry bundling in sync (playground `prebuild` / scripts under `scripts/`)
5. **Docs surface** — component page should show preview + install command
6. Prefer a short note in the PR: API changes, breaking changes, a11y notes

### CLI / MCP changes

- Update `packages/cli` and rebuild (`pnpm --filter @intellihelper/cli build`)
- Keep MCP tool names/descriptions accurate for agents
- Document user-facing CLI flags in `packages/cli/README.md` when behavior changes

### Commit messages

Prefer concise, conventional commits:

```text
feat(ui): add NotificationCenter filters
fix(playground): correct components breadcrumb href
docs: clarify agent plugin install
chore: add SECURITY.md
```

Scopes we use often: `ui`, `ui-native`, `cli`, `playground`, `themes`, `docs`, `ci`.

## Pull requests

1. Push your branch and open a PR against **`main`**.
2. Fill out the PR template (what / why / how tested).
3. Link related issues (`Fixes #123`).
4. Ensure CI is green (lint, types, build as configured).
5. Keep discussion technical and kind — maintainers may request changes.

### Review expectations

- Small, reviewable diffs land faster
- Visual UI changes: screenshots or a short Loom help a lot
- Breaking API changes need a clear migration note

## Issue reporting

Use the issue templates:

- **Bug report** — repro steps, expected vs actual, environment
- **Feature request** — problem, proposed API, alternatives

Security issues: **do not** file a public bug — see [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE) that covers this repository.

## Questions

- Docs: https://ui.intellihelper.in  
- Discussions / issues: https://github.com/IntelliHelper/IntelliHelper-UI/issues  
- Agent skills (separate repo): https://github.com/IntelliHelper/agent-skills  

Welcome aboard — we appreciate every careful contribution.
