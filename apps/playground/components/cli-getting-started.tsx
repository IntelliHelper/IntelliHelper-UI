"use client";

import { CopyButton } from "@intelli/ui";

const commands = [
  {
    label: "Initialize",
    command: "npx @intellihelper/cli@latest init",
    description: "Create components.json in your project",
  },
  {
    label: "Add components",
    command: "npx @intellihelper/cli@latest add button card tabs",
    description: "Install one or more components (utils are added automatically)",
  },
  {
    label: "Interactive add",
    command: "npx @intellihelper/cli@latest add",
    description: "Pick components from a list when you omit names",
  },
  {
    label: "List available",
    command: "npx @intellihelper/cli@latest list",
    description: "See all registry components and what is installed",
  },
  {
    label: "Update",
    command: "npx @intellihelper/cli@latest update",
    description: "Pull registry updates; prompts before overwriting local edits",
  },
] as const;

export function CliGettingStarted() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Copy source into your app with the IntelliHelper UI CLI. Components are
        fetched from{" "}
        <a
          href="https://ui.intellihelper.in/r/registry.json"
          className="font-medium text-foreground underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          ui.intellihelper.in
        </a>
        .
      </p>

      <ol className="space-y-3">
        {commands.map((item, index) => (
          <li
            key={item.command}
            className="rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)] p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--glass-chrome-border)] text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              <CopyButton value={item.command} size="sm" variant="outline" />
            </div>
            <code className="block overflow-x-auto rounded-lg bg-[color-mix(in_oklch,var(--background)_55%,transparent)] px-3 py-2.5 font-mono text-xs text-foreground sm:text-[13px]">
              {item.command}
            </code>
          </li>
        ))}
      </ol>
    </div>
  );
}
