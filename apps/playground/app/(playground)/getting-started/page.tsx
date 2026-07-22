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
import { CliGettingStarted } from "../../../components/cli-getting-started";
import { CustomizationDemo } from "../../../components/customization-demo";
import { DocsFaq } from "../../../components/docs-faq";
import { JsonLd } from "../../../components/json-ld";
import { McpGettingStarted } from "../../../components/mcp-getting-started";
import { PageHeader } from "../../../components/page-header";
import { PluginGettingStarted } from "../../../components/plugin-getting-started";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  getCatalogByCategory,
} from "../../../lib/catalog";
import {
  gettingStartedFaqJsonLd,
  gettingStartedJsonLd,
  webPageJsonLd,
} from "../../../lib/json-ld";
import { createPageMetadata } from "../../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Getting Started — Install Liquid Glass React Components",
  description:
    "Install IntelliHelper UI Liquid Glass components with npx @intellihelper/cli, or wire Cursor, Claude, VS Code, Grok, and other agents via the official agent plugin and intellihelper-ui MCP server. Free for Next.js + Tailwind.",
  path: "/getting-started",
  keywords: [
    "intellihelper cli",
    "intellihelper-ui",
    "npx @intellihelper/cli",
    "install react components",
    "next.js setup",
    "tailwind setup",
    "mcp server",
    "cursor mcp",
    "claude code mcp",
    "grok mcp",
    "agent skills",
    "claude plugin",
    "grok plugin",
    "intellihelper agent-skills",
    "shadcn alternative install",
  ],
  type: "article",
  imagePath: "/getting-started/opengraph-image",
  imageAlt: "Getting started with Intelli UI",
});

const FAQ_ITEMS = [
  {
    q: "What is Intelli UI?",
    a: "Intelli UI by IntelliHelper is a Liquid Glass component library for React and Next.js. Components install into your codebase so you fully own and customize the source.",
  },
  {
    q: "How do I install components?",
    a: "Run npx @intellihelper/cli@latest init, then npx @intellihelper/cli@latest add button card dialog (or any component name from the catalog).",
  },
  {
    q: "Is Intelli UI a shadcn/ui alternative?",
    a: "Yes. It follows a copy-paste registry workflow similar to shadcn/ui, with a Liquid Glass visual system, CLI, MCP, and an official agent plugin for coding agents.",
  },
  {
    q: "Does it support AI coding agents?",
    a: "Yes. Install the official plugin from github.com/IntelliHelper/agent-skills (skills + MCP + slash commands), or wire MCP only with npx @intellihelper/cli mcp init. Works with Claude Code, Grok, Cursor, Codex, OpenCode, and more.",
  },
  {
    q: "Plugin vs MCP — which should I use?",
    a: "Use the agent plugin for one-step install with skills, slash commands, and MCP. Use MCP-only if you already manage skills yourself and only need registry tools.",
  },
  {
    q: "Is it free?",
    a: "Yes. Components are free to install and use. You own the copied source files in your project.",
  },
] as const;

const TOC = [
  { id: "cli", label: "CLI" },
  { id: "plugin", label: "Agent plugin" },
  { id: "mcp", label: "MCP" },
  { id: "customization", label: "Customization" },
  { id: "faq", label: "FAQ" },
] as const;

export default function GettingStartedPage() {
  const grouped = getCatalogByCategory();
  const total = Object.values(grouped).flat().length;

  return (
    <>
      <JsonLd
        data={[
          gettingStartedJsonLd(),
          gettingStartedFaqJsonLd(),
          webPageJsonLd({
            name: "Getting Started with Intelli UI",
            description:
              "Install Liquid Glass components with the CLI, agent plugin, or MCP for AI coding agents.",
            path: "/getting-started",
            type: "WebPage",
          }),
        ]}
      />
      <div className="mx-auto max-w-3xl space-y-8 pb-8">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Getting started" },
          ]}
          meta={
            <span className="inline-flex items-center gap-2">
              <Badge variant="secondary" size="sm">
                Docs
              </Badge>
              <span>
                {total} components · {CATEGORY_ORDER.length} categories
              </span>
            </span>
          }
          title="Getting started"
          description="Install Liquid Glass components into any Next.js + Tailwind project. Own the source, customize freely, and optionally wire coding agents with the plugin or MCP."
          actions={
            <Button asChild variant="outline" size="sm">
              <Link href="/components">Browse catalog</Link>
            </Button>
          }
        />

        {/* On-page TOC — product docs pattern */}
        <nav
          aria-label="On this page"
          className="flex flex-wrap gap-1.5 rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)] p-1.5"
        >
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%,transparent)] hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Card id="cli" className="scroll-mt-24" variant="chrome" animated={false}>
          <CardHeader>
            <CardTitle>CLI</CardTitle>
            <CardDescription>
              Initialize your project and add components with{" "}
              <code className="font-mono text-xs">@intellihelper/cli</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CliGettingStarted />
          </CardContent>
        </Card>

        <Card
          id="plugin"
          className="scroll-mt-24"
          variant="chrome"
          animated={false}
        >
          <CardHeader>
            <CardTitle>Agent plugin</CardTitle>
            <CardDescription>
              One install for Claude Code, Grok, Codex, Gemini, and more —
              skills, slash commands, and MCP bundled. Repo:{" "}
              <a
                href="https://github.com/IntelliHelper/agent-skills"
                className="font-medium text-foreground underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                IntelliHelper/agent-skills
              </a>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PluginGettingStarted />
          </CardContent>
        </Card>

        <Card id="mcp" className="scroll-mt-24" variant="chrome" animated={false}>
          <CardHeader>
            <CardTitle>MCP for AI agents</CardTitle>
            <CardDescription>
              Prefer tools only? Wire the intellihelper-ui MCP server into
              Cursor, Claude Code, VS Code, Codex, OpenCode, or Grok without the
              full plugin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <McpGettingStarted />
          </CardContent>
        </Card>

        <Card
          id="customization"
          className="scroll-mt-24"
          variant="chrome"
          animated={false}
        >
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>
              Variants, className slots, data-slot hooks, and exported CVA
              helpers on every component.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomizationDemo />
          </CardContent>
        </Card>

        <section id="faq" className="scroll-mt-24 space-y-4" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <DocsFaq items={FAQ_ITEMS} />
        </section>

        <Card variant="chrome" animated={false}>
          <CardHeader>
            <CardTitle className="text-base">What&apos;s included</CardTitle>
            <CardDescription>
              {total} components across {CATEGORY_ORDER.length} categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {CATEGORY_ORDER.map((category, index) => {
              const items = grouped[category];
              if (!items.length) return null;
              return (
                <div key={category}>
                  {index > 0 ? (
                    <Separator className="my-4" variant="subtle" />
                  ) : null}
                  <div>
                    <Link
                      href={`/categories/${category}`}
                      className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {CATEGORY_META[category].label}
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {items.map((item) => item.title).join(" · ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
