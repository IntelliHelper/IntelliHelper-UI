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
import {
  Box,
  Cluster,
  Container,
  Stack,
} from "@intelli/ui/layout";
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
import { createPageMetadata, SITE_CONTENT_DATES } from "../../../lib/seo";

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
    q: "Is Intelli UI a shadcn/ui alternative? Why is it better?",
    a: "Yes — same copy-paste ownership, stronger product system. Intelli UI ships Liquid Glass chrome vs content layers, five themes, glass primitives (glass-bar, content cards), AI surfaces (chat, streaming, reasoning), plus an official agent plugin and MCP. shadcn is excellent for flat/neutral UIs; Intelli UI is built when glass hierarchy and agent-native install matter.",
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
            datePublished: SITE_CONTENT_DATES.published,
            dateModified: SITE_CONTENT_DATES.modified,
          }),
        ]}
      />
      <Container size="md" padded={false} className="max-w-3xl pb-8">
        <Stack gap={8}>
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Getting started" },
          ]}
          meta={
            <Cluster gap={2}>
              <Badge variant="secondary" size="sm">
                Docs
              </Badge>
              <span>
                {total} components · {CATEGORY_ORDER.length} categories
              </span>
              <span className="text-xs text-muted-foreground">
                Updated {SITE_CONTENT_DATES.modified}
              </span>
            </Cluster>
          }
          title="Getting started"
          description="Install Liquid Glass components into any Next.js + Tailwind project. Own the source, customize freely, and optionally wire coding agents with the plugin or MCP. Prefer layout primitives over nested divs — see the layout guide."
          actions={
            <Cluster gap={2}>
              <Button asChild variant="outline" size="sm">
                <Link href="/components">Browse catalog</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/guides/layout-primitives">Layout guide</Link>
              </Button>
            </Cluster>
          }
        />

        {/* On-page TOC — product docs pattern */}
        <Cluster
          as="nav"
          gap={1.5}
          aria-label="On this page"
          className="rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] p-1.5 backdrop-blur-[var(--glass-blur)]"
        >
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:backdrop-blur-[var(--glass-blur)]"
            >
              {item.label}
            </a>
          ))}
        </Cluster>

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

        <Stack
          as="section"
          id="faq"
          gap={4}
          className="scroll-mt-24"
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Frequently asked questions
          </h2>
          <DocsFaq items={FAQ_ITEMS} />
        </Stack>

        <Card variant="chrome" animated={false}>
          <CardHeader>
            <CardTitle className="text-base">What&apos;s included</CardTitle>
            <CardDescription>
              {total} components across {CATEGORY_ORDER.length} categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stack gap={0}>
              {CATEGORY_ORDER.map((category, index) => {
                const items = grouped[category];
                if (!items.length) return null;
                return (
                  <Box key={category}>
                    {index > 0 ? (
                      <Separator className="my-4" variant="subtle" />
                    ) : null}
                    <Stack gap={1}>
                      <Link
                        href={`/categories/${category}`}
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {CATEGORY_META[category].label}
                      </Link>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {items.map((item) => item.title).join(" · ")}
                      </p>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
        </Stack>
      </Container>
    </>
  );
}
