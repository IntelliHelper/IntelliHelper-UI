"use client";

import { CopyButton } from "@intelli/ui";

const MCP_INIT_COMMANDS = [
  {
    label: "Cursor",
    command: "npx @intellihelper/cli@latest mcp init --client cursor",
    configPath: ".cursor/mcp.json",
  },
  {
    label: "Claude Code",
    command: "npx @intellihelper/cli@latest mcp init --client claude",
    configPath: ".mcp.json",
  },
  {
    label: "VS Code",
    command: "npx @intellihelper/cli@latest mcp init --client vscode",
    configPath: ".vscode/mcp.json",
  },
  {
    label: "OpenCode",
    command: "npx @intellihelper/cli@latest mcp init --client opencode",
    configPath: "opencode.json",
  },
  {
    label: "Codex",
    command: "npx @intellihelper/cli@latest mcp init --client codex",
    configPath: "~/.codex/config.toml",
  },
] as const;

const MCP_TOOLS = [
  {
    name: "get_project_config",
    description: "Read components.json and Liquid Glass setup guidance",
  },
  {
    name: "list_components",
    description: "Browse registry items by category and type",
  },
  {
    name: "search_components",
    description: "Fuzzy search by name, title, description, or meta",
  },
  {
    name: "get_component",
    description: "Full source, variants, sizes, and dependencies",
  },
  {
    name: "get_component_examples",
    description: "Ready-to-adapt usage snippets",
  },
  {
    name: "get_add_command",
    description: "CLI install command (does not write files)",
  },
  {
    name: "list_themes",
    description: "Theme catalog (mono, aurora, sunset, frost, ocean)",
  },
  {
    name: "get_audit_checklist",
    description: "Post-install QA for imports and glass layers",
  },
] as const;

const GROK_CONFIG = `[mcp_servers.intellihelper-ui]
command = "npx"
args = ["-y", "@intellihelper/cli@latest", "mcp"]
enabled = true`;

const CURSOR_CONFIG = `{
  "mcpServers": {
    "intellihelper-ui": {
      "command": "npx",
      "args": ["-y", "@intellihelper/cli@latest", "mcp"]
    }
  }
}`;

const PROMPTS = [
  "Show me all IntelliHelper UI glass components",
  "Add button, dialog, and card from IntelliHelper UI",
  "Show me usage examples for the sheet component",
  "Search IntelliHelper UI for form inputs",
] as const;

const blockClass =
  "rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)] p-4";

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className={blockClass}>
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <CopyButton value={code} size="sm" variant="outline" />
        </div>
      ) : (
        <div className="mb-2 flex justify-end">
          <CopyButton value={code} size="sm" variant="outline" />
        </div>
      )}
      <pre className="overflow-x-auto rounded-lg bg-[color-mix(in_oklch,var(--background)_55%,transparent)] px-3 py-2 font-mono text-xs text-foreground whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function McpGettingStarted() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Connect coding agents to the IntelliHelper UI registry over MCP
          (Model Context Protocol). Agents can browse components, inspect
          source, pull usage examples, and get install commands — the same
          way{" "}
          <a
            href="https://ui.shadcn.com/docs/mcp"
            className="font-medium text-foreground underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            shadcn MCP
          </a>{" "}
          works. For skills + slash commands in one install, use the{" "}
          <a
            href="#plugin"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            agent plugin
          </a>{" "}
          instead.
        </p>
        <p className="text-xs text-muted-foreground">
          Server name:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
            intellihelper-ui
          </code>
          {" · "}
          Package:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
            @intellihelper/cli
          </code>
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          1. Initialize for your agent
        </h3>
        <p className="text-xs text-muted-foreground">
          Run in your app project, then restart the agent / enable the MCP
          server.
        </p>
        <div className="space-y-3">
          {MCP_INIT_COMMANDS.map((item) => (
            <div key={item.command} className={blockClass}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Writes{" "}
                    <code className="font-mono text-foreground/80">
                      {item.configPath}
                    </code>
                  </p>
                </div>
                <CopyButton value={item.command} size="sm" variant="outline" />
              </div>
              <pre className="overflow-x-auto rounded-lg bg-[color-mix(in_oklch,var(--background)_55%,transparent)] px-3 py-2 font-mono text-xs text-foreground">
                <code>{item.command}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          2. Manual config examples
        </h3>
        <CodeBlock
          label="Cursor / Claude (.cursor/mcp.json or .mcp.json)"
          code={CURSOR_CONFIG}
        />
        <CodeBlock
          label="Grok Build CLI (~/.grok/config.toml or .grok/config.toml)"
          code={GROK_CONFIG}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">3. MCP tools</h3>
        <p className="text-xs text-muted-foreground">
          After connecting, tools appear as{" "}
          <code className="font-mono">intellihelper-ui__&lt;tool&gt;</code>.
        </p>
        <ul className="space-y-2">
          {MCP_TOOLS.map((tool) => (
            <li key={tool.name} className={blockClass + " !p-3"}>
              <code className="text-xs font-medium text-foreground">
                {tool.name}
              </code>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {tool.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          4. Example prompts
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
