import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@intelli/ui";
import { HeroStage } from "../../components/landing/hero-stage";
import { InstallStrip } from "../../components/landing/install-strip";
import { JsonLd } from "../../components/json-ld";
import {
  CATALOG,
  CATEGORY_META,
  CATEGORY_ORDER,
  type CatalogItem,
} from "../../lib/catalog";
import { homeGraphJsonLd } from "../../lib/json-ld";
import {
  AGENT_SKILLS_URL,
  CLI_PACKAGE,
  GITHUB_URL,
  createPageMetadata,
} from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title:
    "Intelli UI — Free Liquid Glass React Components for Next.js & Tailwind CSS",
  description:
    "80+ free Liquid Glass React components for Next.js & Tailwind CSS. Live previews, copy-paste source, CLI install. Build glassmorphism UIs you own — shadcn-style workflow.",
  path: "/",
  keywords: [
    "liquid glass components",
    "liquid glass ui react",
    "glass morphism react components",
    "shadcn alternative",
    "shadcn ui alternative liquid glass",
    "next.js tailwind components",
    "react component library",
    "free react components",
    "agent plugin",
    "mcp ui components",
  ],
  absoluteTitle: true,
});

const FEATURED_SLUGS = [
  "button",
  "card",
  "dialog",
  "glass-bar",
  "sidebar",
  "ai-chat",
] as const;

const PILLARS = [
  {
    title: "You own the source",
    body: "CLI copies components into your repo — same ownership model as shadcn, with a Liquid Glass visual system built for product chrome.",
  },
  {
    title: "Chrome vs content",
    body: "Neutral frosted controls sit above expressive panels. Hierarchy stays clear instead of stacking blur on every surface.",
  },
  {
    title: "Built for agents",
    body: "Official plugin and MCP server so Claude, Grok, Cursor, and other agents install and compose components correctly.",
  },
] as const;

const STEPS = [
  {
    title: "Init",
    command: `npx ${CLI_PACKAGE}@latest init`,
    body: "Scaffold components.json and wire Tailwind tokens for Liquid Glass themes.",
  },
  {
    title: "Add",
    command: `npx ${CLI_PACKAGE}@latest add button card dialog`,
    body: "Pull components and shared utils into your app. Edit freely — nothing is locked behind a package.",
  },
  {
    title: "Ship",
    command: "Compose product screens",
    body: "Pair glass chrome with content CTAs. Optional: install the agent plugin for AI-assisted UI.",
  },
] as const;

function getFeatured(): CatalogItem[] {
  const bySlug = new Map(CATALOG.map((item) => [item.slug, item]));
  return FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (item): item is CatalogItem => Boolean(item),
  );
}

export default function LandingPage() {
  const featured = getFeatured();

  return (
    <>
      <JsonLd data={homeGraphJsonLd()} />
      <div className="space-y-20 pb-12 md:space-y-28">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-2 md:pt-6">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            <div className="space-y-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" size="sm">
                  {CATALOG.length}+ components
                </Badge>
                <Badge variant="outline" size="sm">
                  Free · Open source
                </Badge>
                <Badge variant="outline" size="sm">
                  React 19 · Next.js
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
                  Liquid Glass components{" "}
                  <span className="text-muted-foreground">you own</span>
                </h1>
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Frosted React UI for Next.js and Tailwind — install with a
                  CLI, keep the source, and wire coding agents when you want
                  them. Glassmorphism with real product hierarchy.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="primary" size="lg">
                  <Link href="/getting-started">Get started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/components">Browse components</Link>
                </Button>
              </div>

              <InstallStrip />

              <p className="text-xs text-muted-foreground">
                Or install for agents:{" "}
                <Link
                  href="/getting-started#plugin"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  agent plugin
                </Link>
                {" · "}
                <Link
                  href="/getting-started#mcp"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  MCP
                </Link>
              </p>
            </div>

            <HeroStage />
          </div>
        </section>

        {/* ── Pillars ──────────────────────────────────────────── */}
        <section aria-labelledby="pillars-heading" className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Why Intelli UI
            </p>
            <h2
              id="pillars-heading"
              className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              A glass system for product teams
            </h2>
          </div>

          <ul className="grid gap-4 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <li key={pillar.title}>
                <Card variant="chrome" animated={false} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {pillar.body}
                    </CardDescription>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section aria-labelledby="steps-heading" className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Workflow
              </p>
              <h2
                id="steps-heading"
                className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
              >
                From zero to glass UI in minutes
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/getting-started">Full setup guide →</Link>
            </Button>
          </div>

          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="relative flex flex-col rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_14%,transparent)] p-5 shadow-[var(--glass-chrome-shadow)]"
              >
                <span className="mb-4 flex size-8 items-center justify-center rounded-full border border-[var(--glass-chrome-border)] text-xs font-semibold tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
                <code className="mt-4 block overflow-x-auto rounded-xl bg-[color-mix(in_oklch,var(--background)_50%,transparent)] px-3 py-2.5 font-mono text-[11px] text-foreground sm:text-xs">
                  {step.command}
                </code>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Featured components ──────────────────────────────── */}
        <section aria-labelledby="featured-heading" className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Catalog
              </p>
              <h2
                id="featured-heading"
                className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
              >
                Start with the essentials
              </h2>
              <p className="text-sm text-muted-foreground">
                Every component ships with a live preview, install command, and
                source you can edit.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/components">View all {CATALOG.length}+ →</Link>
            </Button>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/components/${item.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)] p-5 transition-colors hover:border-[color-mix(in_oklch,var(--primary)_28%,var(--glass-chrome-border))] hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_22%,transparent)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground">
                      {item.title}
                    </h3>
                    <Badge variant="outline" size="sm">
                      {CATEGORY_META[item.category].label}
                    </Badge>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-4 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Open preview →
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Browse by category
            </p>
            <ul className="flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((category) => (
                <li key={category}>
                  <Link
                    href={`/categories/${category}`}
                    className="inline-flex items-center rounded-full border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[color-mix(in_oklch,var(--primary)_25%,var(--glass-chrome-border))] hover:text-foreground"
                  >
                    {CATEGORY_META[category].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Agents ───────────────────────────────────────────── */}
        <section
          aria-labelledby="agents-heading"
          className="overflow-hidden rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_18%,transparent)] shadow-[var(--glass-chrome-shadow)]"
        >
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="space-y-5 p-6 sm:p-8 md:p-10">
              <Badge variant="secondary" size="sm">
                Agent plugin · MCP
              </Badge>
              <div className="space-y-3">
                <h2
                  id="agents-heading"
                  className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
                >
                  Install UI the way your agents work
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Skills, slash commands, and an MCP server teach coding agents
                  to search the registry, add components, and respect chrome vs
                  content — not invent glass CSS from scratch.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Button asChild variant="primary">
                  <Link href="/getting-started#plugin">Install plugin</Link>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={AGENT_SKILLS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    agent-skills repo
                  </a>
                </Button>
              </div>
            </div>

            <div className="border-t border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_35%,transparent)] p-6 sm:p-8 lg:border-l lg:border-t-0 md:p-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Quick installs
              </p>
              <ul className="space-y-3">
                {[
                  {
                    label: "Claude Code",
                    cmd: "claude plugin install intellihelper-ui@intellihelper",
                  },
                  {
                    label: "Grok",
                    cmd: "grok plugin install IntelliHelper/agent-skills --trust",
                  },
                  {
                    label: "MCP only",
                    cmd: `npx ${CLI_PACKAGE}@latest mcp init --client cursor`,
                  },
                ].map((row) => (
                  <li
                    key={row.label}
                    className="rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_10%,transparent)] p-3.5"
                  >
                    <p className="mb-1.5 text-xs font-medium text-foreground">
                      {row.label}
                    </p>
                    <code className="block overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                      {row.cmd}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Themes ───────────────────────────────────────────── */}
        <section aria-labelledby="themes-heading" className="space-y-6">
          <div className="max-w-xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Themes
            </p>
            <h2
              id="themes-heading"
              className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              Five Liquid Glass themes
            </h2>
            <p className="text-sm text-muted-foreground">
              Switch appearance in the playground header — mono, aurora, sunset,
              frost, and ocean drive CSS variables across every component.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {(
              [
                { id: "mono", label: "Mono", swatch: "from-zinc-200 to-zinc-500" },
                {
                  id: "aurora",
                  label: "Aurora",
                  swatch: "from-cyan-400 to-violet-500",
                },
                {
                  id: "sunset",
                  label: "Sunset",
                  swatch: "from-amber-400 to-rose-500",
                },
                {
                  id: "frost",
                  label: "Frost",
                  swatch: "from-slate-200 to-sky-400",
                },
                {
                  id: "ocean",
                  label: "Ocean",
                  swatch: "from-teal-400 to-blue-600",
                },
              ] as const
            ).map((theme) => (
              <li
                key={theme.id}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)] px-3 py-4"
              >
                <span
                  className={`size-10 rounded-full bg-gradient-to-br ${theme.swatch} shadow-md ring-2 ring-white/30`}
                  aria-hidden
                />
                <span className="text-sm font-medium text-foreground">
                  {theme.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <section className="rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_22%,transparent)] px-6 py-10 text-center shadow-[var(--glass-chrome-shadow)] sm:px-10 md:py-14">
          <div className="mx-auto max-w-xl space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Start building with Liquid Glass
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Free components, CLI install, live docs, and agent tooling — all
              aimed at shipping product UI you control.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Button asChild variant="primary" size="lg">
                <Link href="/getting-started">Get started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/components">Browse catalog</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            </div>
            <Separator className="my-2" variant="subtle" />
            <p className="text-xs text-muted-foreground">
              {CATALOG.length}+ components · {CATEGORY_ORDER.length} categories ·
              MIT-friendly ownership model
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
