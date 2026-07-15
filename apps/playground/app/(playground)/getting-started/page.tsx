import type { Metadata } from "next";
import Link from "next/link";
import { CliGettingStarted } from "../../../components/cli-getting-started";
import { CustomizationDemo } from "../../../components/customization-demo";
import { JsonLd } from "../../../components/json-ld";
import { McpGettingStarted } from "../../../components/mcp-getting-started";
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

export default function GettingStartedPage() {
  const grouped = getCatalogByCategory();

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
        <header className="space-y-2">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← All components
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Getting started
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Copy Liquid Glass components into any Next.js + Tailwind project with
            the IntelliHelper UI CLI. Components live in your codebase — fully
            owned and customizable. Wire the same registry into coding agents
            with the official{" "}
            <a
              href="#plugin"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              agent plugin
            </a>{" "}
            or{" "}
            <a
              href="#mcp"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              MCP server
            </a>
            .
          </p>
        </header>

        <section className="glass-panel rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">CLI</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Initialize your project and add components with{" "}
              <code className="font-mono text-xs">@intellihelper/cli</code>.
            </p>
          </div>
          <CliGettingStarted />
        </section>

        <section
          id="plugin"
          className="glass-panel scroll-mt-24 rounded-2xl p-6"
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              Agent plugin
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
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
            </p>
          </div>
          <PluginGettingStarted />
        </section>

        <section id="mcp" className="glass-panel scroll-mt-24 rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              MCP for AI agents
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Prefer tools only? Wire the intellihelper-ui MCP server into
              Cursor, Claude Code, VS Code, Codex, OpenCode, or Grok without the
              full plugin.
            </p>
          </div>
          <McpGettingStarted />
        </section>

        <section className="glass-panel rounded-2xl p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">Customization</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Variants, className slots, data-slot hooks, and exported CVA helpers
              on every component.
            </p>
          </div>
          <CustomizationDemo />
        </section>

        <section className="glass-panel rounded-2xl p-6" aria-labelledby="faq">
          <h2 id="faq" className="text-lg font-semibold text-foreground">
            Frequently asked questions
          </h2>
          <dl className="mt-5 space-y-5">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-foreground">{item.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">What&apos;s included</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {Object.values(grouped).flat().length} components across{" "}
            {CATEGORY_ORDER.length} categories.
          </p>
          <ul className="mt-5 space-y-4">
            {CATEGORY_ORDER.map((category) => {
              const items = grouped[category];
              if (!items.length) return null;
              return (
                <li key={category}>
                  <Link
                    href={`/categories/${category}`}
                    className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {CATEGORY_META[category].label}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {items.map((item) => item.title).join(", ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
