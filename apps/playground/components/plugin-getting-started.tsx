"use client";

import { useState } from "react";
import { AGENT_SKILLS_REPO, AGENT_SKILLS_URL } from "../lib/seo";

const PLUGIN_INSTALLS = [
  {
    label: "Claude Code",
    commands: [
      `claude plugin marketplace add ${AGENT_SKILLS_REPO}`,
      "claude plugin install intellihelper-ui@intellihelper",
    ],
    note: "Restart or /reload-plugins after install. Trust the plugin so MCP activates.",
  },
  {
    label: "Grok CLI",
    commands: [
      `grok plugin marketplace add ${AGENT_SKILLS_REPO}`,
      `grok plugin install ${AGENT_SKILLS_REPO} --trust`,
    ],
    note: "Use --trust so hooks and the intellihelper-ui MCP server activate.",
  },
  {
    label: "Codex",
    commands: [
      `codex plugin marketplace add ${AGENT_SKILLS_REPO}`,
      "# Then install intellihelper-ui from /plugins",
    ],
    note: "Open /plugins after adding the marketplace.",
  },
  {
    label: "Gemini CLI",
    commands: [`gemini extensions install ${AGENT_SKILLS_URL}`],
    note: "Installs MCP + skills via gemini-extension.json.",
  },
  {
    label: "skills.sh (any agent)",
    commands: [`npx skills add ${AGENT_SKILLS_REPO}`],
    note: "Cross-agent skill installer. Pair with MCP for full registry tools.",
  },
] as const;

const PLUGIN_SKILLS = [
  {
    name: "intellihelper-ui",
    description: "Hub skill — MCP workflow, registry rules, anti-patterns",
  },
  {
    name: "liquid-glass",
    description: "Chrome vs content layers, themes, visual system",
  },
  {
    name: "add-component",
    description: "Init → discover → CLI add → audit path",
  },
  {
    name: "compose-ui",
    description: "Settings, dashboard, auth, and glass-stage recipes",
  },
] as const;

const PLUGIN_COMMANDS = [
  { name: "add", description: "Install one or more components" },
  { name: "search", description: "Search the registry" },
  { name: "list", description: "List by category" },
  { name: "audit", description: "Project health check" },
  { name: "themes", description: "Theme guide (mono → ocean)" },
] as const;

const PROMPTS = [
  "Show me all IntelliHelper UI glass components",
  "Add button, dialog, and card from IntelliHelper UI",
  "Build a settings page with Liquid Glass",
  "Audit this project for IntelliHelper setup",
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 rounded-lg border border-border/60 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CommandBlock({
  label,
  commands,
  note,
}: {
  label: string;
  commands: readonly string[];
  note: string;
}) {
  const text = commands.join("\n");
  return (
    <div className="rounded-xl border border-border/50 bg-background/30 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
        </div>
        <CopyButton text={text} />
      </div>
      <pre className="overflow-x-auto rounded-lg bg-background/60 px-3 py-2 font-mono text-xs text-foreground whitespace-pre">
        <code>{text}</code>
      </pre>
    </div>
  );
}

export function PluginGettingStarted() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Install the official{" "}
          <strong className="font-medium text-foreground">agent plugin</strong>{" "}
          for one-step setup across coding agents. It bundles{" "}
          <strong className="font-medium text-foreground">MCP</strong> (live
          registry tools),{" "}
          <strong className="font-medium text-foreground">skills</strong>{" "}
          (Liquid Glass judgment),{" "}
          <strong className="font-medium text-foreground">slash commands</strong>
          , and a{" "}
          <strong className="font-medium text-foreground">ui-builder</strong>{" "}
          agent — so agents install and compose components correctly instead of
          inventing props.
        </p>
        <p className="text-xs text-muted-foreground">
          Repo:{" "}
          <a
            href={AGENT_SKILLS_URL}
            className="font-medium text-foreground underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {AGENT_SKILLS_REPO}
          </a>
          {" · "}
          Plugin:{" "}
          <code className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-foreground">
            intellihelper-ui
          </code>
          {" · "}
          Requires Node.js 18+ for MCP (
          <code className="font-mono">@intellihelper/cli</code>)
        </p>
      </div>

      <div className="rounded-xl border border-border/50 bg-background/30 p-4">
        <p className="text-sm font-medium text-foreground">Marketplace status</p>
        <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
          <li>
            <strong className="font-medium text-foreground">Install now</strong>
            {" — "}
            add{" "}
            <code className="font-mono text-foreground/90">
              {AGENT_SKILLS_REPO}
            </code>{" "}
            as a marketplace (commands below). Works today on Claude Code, Grok,
            Codex, Gemini, and skills.sh.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              xAI Official (Grok)
            </strong>
            {" — "}
            submitted to{" "}
            <a
              href="https://github.com/xai-org/plugin-marketplace/pull/86"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              xai-org/plugin-marketplace#86
            </a>
            . After merge, install from the xAI Official tab in{" "}
            <code className="font-mono">/marketplace</code>.
          </li>
          <li>
            <strong className="font-medium text-foreground">
              Claude community
            </strong>
            {" — "}
            submit via{" "}
            <a
              href="https://clau.de/plugin-directory-submission"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              clau.de/plugin-directory-submission
            </a>{" "}
            (Anthropic review). Until listed, use the marketplace add command
            below.
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          1. Install the plugin
        </h3>
        <div className="space-y-3">
          {PLUGIN_INSTALLS.map((item) => (
            <CommandBlock
              key={item.label}
              label={item.label}
              commands={item.commands}
              note={item.note}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          2. What you get
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Skills
            </p>
            <ul className="space-y-2">
              {PLUGIN_SKILLS.map((skill) => (
                <li
                  key={skill.name}
                  className="rounded-lg border border-border/40 bg-background/20 px-3 py-2"
                >
                  <code className="text-xs font-medium text-foreground">
                    {skill.name}
                  </code>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {skill.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Slash commands
            </p>
            <ul className="space-y-2">
              {PLUGIN_COMMANDS.map((cmd) => (
                <li
                  key={cmd.name}
                  className="rounded-lg border border-border/40 bg-background/20 px-3 py-2"
                >
                  <code className="text-xs font-medium text-foreground">
                    /{cmd.name}
                  </code>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cmd.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Plus MCP tools (
              <code className="font-mono">search_components</code>,{" "}
              <code className="font-mono">get_component</code>, …) and the{" "}
              <code className="font-mono">ui-builder</code> agent. Prefer the{" "}
              <a
                href="#mcp"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                MCP-only setup
              </a>{" "}
              if you only need tools without skills.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          3. Example prompts
        </h3>
        <ul className="list-inside list-disc space-y-1.5 text-xs text-muted-foreground">
          {PROMPTS.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
