import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Badge } from "@intelli/ui/badge";
import { Button } from "@intelli/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@intelli/ui/card";
import { Separator } from "@intelli/ui/separator";
import { InstallStrip } from "../../components/landing/install-strip";
import { JsonLd } from "../../components/json-ld";
import { GithubStars } from "../../components/github-stars";
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
  SITE_CONTENT_DATES,
  createPageMetadata,
} from "../../lib/seo";

const HeroStage = dynamic(
  () =>
    import("../../components/landing/hero-stage").then((m) => m.HeroStage),
  {
    ssr: true,
    loading: () => (
      <div
        className="min-h-[280px] rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)]"
        aria-hidden
      />
    ),
  },
);

const WhyBetterSection = dynamic(
  () =>
    import("../../components/landing/why-better-section").then(
      (m) => m.WhyBetterSection,
    ),
  {
    // SSR keeps comparison copy for SEO; heavy demos still mount via LazyStage
    ssr: true,
    loading: () => (
      <div className="min-h-[520px] cv-auto" aria-hidden />
    ),
  },
);

const ThemeSwitcher = dynamic(
  () =>
    import("../../components/theme-switcher").then((m) => m.ThemeSwitcher),
  { ssr: true },
);

export const metadata: Metadata = createPageMetadata({
  title:
    "Intelli UI — Free Liquid Glass React Components for Next.js & Tailwind CSS",
  description:
    "80+ free Liquid Glass React components for Next.js & Tailwind — better than flat shadcn defaults for glass UI, AI product chrome, themes, and agent install. Live previews, CLI, source you own.",
  path: "/",
  keywords: [
    "liquid glass components",
    "liquid glass ui react",
    "glass morphism react components",
    "shadcn alternative",
    "better than shadcn",
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

const HOME_FAQ = [
  {
    q: "What is Intelli UI?",
    a: "Intelli UI is a free, open-source Liquid Glass component library for React and Next.js. It ships 80+ accessible components, a CLI that copies source into your repo, five themes, an MCP server for AI coding agents, and a plugin for Claude Code, Grok, Cursor, and VS Code.",
  },
  {
    q: "Is Intelli UI free?",
    a: "Yes. Intelli UI is free and open source under the MIT license. You install components into your project and own the copied source files.",
  },
  {
    q: "Is Intelli UI better than shadcn/ui for glass UI?",
    a: "For glass product UI, yes when you want hierarchy out of the box. Both use a copy-paste ownership model. Intelli UI adds Liquid Glass chrome vs content layers, five themes, glass primitives, AI product components, and agent install (plugin + MCP).",
  },
  {
    q: "Does Intelli UI work with Tailwind CSS and Next.js?",
    a: "Yes. Intelli UI is built for React 19, Next.js, and Tailwind CSS. Initialize with the CLI, then add components such as button, card, and dialog.",
  },
  {
    q: "Can AI coding agents install Intelli UI components?",
    a: "Yes. Install the official agent plugin (IntelliHelper/agent-skills) or wire the intellihelper-ui MCP server so Claude, Grok, Cursor, Codex, and others install and compose components correctly.",
  },
  {
    q: "How do I install Intelli UI?",
    a: `Run npx ${CLI_PACKAGE}@latest init, then npx ${CLI_PACKAGE}@latest add button card dialog. Optional: install the agent plugin or MCP for coding agents.`,
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
                <Badge variant="outline" size="sm">
                  Updated {SITE_CONTENT_DATES.modified}
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
                  Liquid Glass components{" "}
                  <span className="text-muted-foreground">you own</span>
                </h1>
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                  <strong className="font-medium text-foreground">
                    Intelli UI is a free, open-source Liquid Glass component
                    library for React and Next.js.
                  </strong>{" "}
                  It ships {CATALOG.length}+ accessible components, a CLI that
                  copies source into your repo, an MCP server for AI coding
                  agents, and a plugin for Claude Code, Grok, Cursor, and VS
                  Code — frosted product UI with MIT-friendly ownership.
                </p>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                  More than a shadcn clone: Liquid Glass hierarchy (chrome vs
                  content layers), five themes, AI product components, and
                  agent-native install for Next.js and Tailwind.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  variant="primary"
                  size="lg"
                  className="min-h-12"
                >
                  <Link href="/getting-started">Get started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-h-12"
                >
                  <Link href="/components">Browse components</Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="min-h-12">
                  <Link href="/guides/shadcn-vs-intelli-ui">vs shadcn</Link>
                </Button>
              </div>

              <InstallStrip />

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <GithubStars className="font-medium text-foreground underline-offset-4 hover:underline" />
                <span aria-hidden>·</span>
                <span>
                  Agents:{" "}
                  <Link
                    href="/getting-started#plugin"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    plugin
                  </Link>
                  {" · "}
                  <Link
                    href="/getting-started#mcp"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    MCP
                  </Link>
                </span>
                <span aria-hidden>·</span>
                <Link
                  href="/about"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  About
                </Link>
              </div>
            </div>

            <HeroStage />
          </div>
        </section>

        {/* ── Pillars ──────────────────────────────────────────── */}
        <section
          aria-labelledby="pillars-heading"
          className="space-y-8 cv-auto"
        >
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
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Intelli UI is Liquid Glass first — chrome vs content layers,
              frosted primitives, and five themes so product UI looks intentional
              on day one. The CLI copies components into your repo with the same
              ownership model as shadcn, plus a Liquid Glass visual system built
              for product chrome. Neutral frosted controls sit above expressive
              panels so hierarchy stays clear instead of stacking blur on every
              surface. An official plugin and MCP server help Claude, Grok,
              Cursor, and other agents install and compose components correctly —
              so teams ship glass UI without inventing frosted CSS from scratch.
            </p>
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

        {/* ── Why better than shadcn / other libraries ─────────── */}
        <WhyBetterSection />

        {/* ── How it works ─────────────────────────────────────── */}
        <section aria-labelledby="steps-heading" className="space-y-8 cv-auto">
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
                className="relative flex flex-col rounded-2xl border border-[var(--glass-chrome-border)] backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] p-5 shadow-[var(--glass-chrome-shadow)]"
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
        <section
          aria-labelledby="featured-heading"
          className="space-y-8 cv-auto"
        >
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
                  className="group flex h-full flex-col rounded-2xl border border-[var(--glass-chrome-border)] backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] p-5 transition-colors hover:border-[color-mix(in_oklch,var(--primary)_28%,var(--glass-chrome-border))] hover:backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)]"
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
                    className="inline-flex items-center rounded-full border border-[var(--glass-chrome-border)] backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[color-mix(in_oklch,var(--primary)_25%,var(--glass-chrome-border))] hover:text-foreground"
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
          className="cv-auto overflow-hidden rounded-3xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)] shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)]"
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
                    className="rounded-xl border border-[var(--glass-chrome-border)] backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] p-3.5"
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
        <section aria-labelledby="themes-heading" className="space-y-6 cv-auto">
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
              Click a theme to apply it site-wide — mono, aurora, sunset, frost,
              and ocean drive CSS variables across every component on this page.
            </p>
          </div>
          <ThemeSwitcher />
        </section>

        {/* ── FAQ (citability + FAQPage schema on homeGraph) ───── */}
        <section
          aria-labelledby="home-faq-heading"
          className="space-y-6 cv-auto"
        >
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              FAQ
            </p>
            <h2
              id="home-faq-heading"
              className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              What is Intelli UI?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Short answers for teams evaluating Liquid Glass components, shadcn
              alternatives, and agent-native install.
            </p>
          </div>
          <dl className="grid gap-4 md:grid-cols-2">
            {HOME_FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] p-5 shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)]"
              >
                <dt className="text-sm font-semibold text-foreground">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <section className="rounded-3xl border border-[var(--glass-chrome-border)] backdrop-blur-[var(--glass-blur)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)] px-6 py-10 text-center shadow-[var(--glass-chrome-shadow)] sm:px-10 md:py-14">
          <div className="mx-auto max-w-xl space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Start building with Liquid Glass
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Free Liquid Glass components, CLI install, live docs, and agent
              tooling — product UI that looks better than flat defaults, with
              source you control.
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
