import type { RegistryItem } from "../types.js";
import type { CatalogData, ExampleEntry, ThemeEntry } from "./data.js";

export type EnrichedItem = RegistryItem & {
  category?: string;
};

export function formatList(
  items: EnrichedItem[],
  meta: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
    query?: string;
    category?: string;
  },
): string {
  const headerParts = [
    meta.query ? `Search: "${meta.query}"` : "Components",
    meta.category ? `category=${meta.category}` : null,
    `showing ${items.length} of ${meta.total}`,
  ].filter(Boolean);

  const lines: string[] = [`## ${headerParts.join(" · ")}`, ""];

  if (items.length === 0) {
    lines.push("No components found.");
    return lines.join("\n");
  }

  for (const item of items) {
    const category = item.category ? ` [${item.category}]` : "";
    const title = item.title ?? item.name;
    lines.push(`- **${item.name}** — ${title}${category}`);
    if (item.description) {
      lines.push(`  ${item.description}`);
    }
    const deps = [
      ...(item.dependencies ?? []).map((d) => `npm:${d}`),
      ...(item.registryDependencies ?? []).map((d) => `registry:${d}`),
    ];
    if (deps.length > 0) {
      lines.push(`  deps: ${deps.join(", ")}`);
    }
  }

  if (meta.hasMore) {
    lines.push(
      "",
      `_More results available. Use offset=${meta.offset + items.length} to continue._`,
    );
  }

  lines.push(
    "",
    "Next: use `get_component` for source, `get_component_examples` for usage, then `get_add_command` to install.",
  );

  return lines.join("\n");
}

export function formatComponent(
  item: RegistryItem,
  options: { category?: string; docsBase?: string } = {},
): string {
  const lines: string[] = [
    `# ${item.title ?? item.name} (\`${item.name}\`)`,
    "",
  ];

  if (options.category) {
    lines.push(`**Category:** ${options.category}`);
  }
  lines.push(`**Type:** ${item.type}`);
  if (item.description) {
    lines.push(`**Description:** ${item.description}`);
  }

  if (item.meta && Object.keys(item.meta).length > 0) {
    lines.push("", "## Meta");
    for (const [key, value] of Object.entries(item.meta)) {
      const rendered = Array.isArray(value) ? value.join(", ") : String(value);
      lines.push(`- **${key}:** ${rendered}`);
    }
  }

  if (item.registryDependencies?.length) {
    lines.push("", `**Registry dependencies:** ${item.registryDependencies.join(", ")}`);
  }
  if (item.dependencies?.length) {
    lines.push(`**npm dependencies:** ${item.dependencies.join(", ")}`);
  }

  if (options.docsBase) {
    lines.push(
      "",
      `**Docs:** ${options.docsBase}/components/${item.name}`,
    );
  }

  lines.push("", "## Files");

  for (const file of item.files) {
    const target = file.target || file.path;
    lines.push("", `### \`${target}\``);
    if (file.content) {
      const lang = target.endsWith(".ts")
        ? "ts"
        : target.endsWith(".tsx")
          ? "tsx"
          : target.endsWith(".css")
            ? "css"
            : "txt";
      lines.push("```" + lang, file.content.trimEnd(), "```");
    } else {
      lines.push("_Source content unavailable. Install via CLI or fetch the live registry item._");
    }
  }

  lines.push(
    "",
    "Next: call `get_component_examples` for usage snippets, then `get_add_command` to install.",
  );

  return lines.join("\n");
}

export function formatExamples(
  name: string,
  examples: ExampleEntry[],
): string {
  if (examples.length === 0) {
    return [
      `No bundled examples found for \`${name}\`.`,
      "",
      "Tips:",
      "- Use `get_component` to inspect the source and props",
      "- Browse docs at https://ui.intellihelper.in",
      "- Try `search_components` with a related query",
    ].join("\n");
  }

  const lines: string[] = [
    `# Examples: ${name}`,
    "",
    `Found ${examples.length} example(s).`,
  ];

  for (const [index, example] of examples.entries()) {
    lines.push("", `## ${index + 1}. ${example.title}`);
    if (example.description) {
      lines.push(example.description);
    }
    lines.push("", "```tsx", example.code.trimEnd(), "```");
  }

  lines.push(
    "",
    `Install with: \`npx @intellihelper/cli@latest add ${name}\``,
  );

  return lines.join("\n");
}

export function formatThemes(themes: ThemeEntry[]): string {
  const lines: string[] = [
    "# IntelliHelper UI Themes",
    "",
    "Themes live in `@intelli/themes` and style the Liquid Glass system via CSS variables.",
    "",
  ];

  for (const theme of themes) {
    lines.push(`- **${theme.id}** — ${theme.label}`);
    lines.push(`  ${theme.description}`);
  }

  lines.push(
    "",
    "Use `ThemeProvider` from the themes package (or playground setup) to switch themes.",
    "Docs: https://ui.intellihelper.in",
  );

  return lines.join("\n");
}

export function formatCatalogSummary(catalog: CatalogData): string {
  const lines: string[] = ["# Catalog categories", ""];
  for (const [id, meta] of Object.entries(catalog.categories)) {
    const count = catalog.items.filter((item) => item.category === id).length;
    lines.push(`- **${id}** (${meta.label}) — ${count} components`);
    lines.push(`  ${meta.description}`);
  }
  return lines.join("\n");
}

export function formatAddCommand(components: string[]): string {
  const names = components.map((name) => name.replace(/^@[\w-]+\//, "")).filter(Boolean);
  if (names.length === 0) {
    return "No components specified. Example: get_add_command with components: [\"button\", \"dialog\"]";
  }
  return [
    "Run this in your project root (after `npx @intellihelper/cli@latest init` if needed):",
    "",
    "```bash",
    `npx @intellihelper/cli@latest add ${names.join(" ")}`,
    "```",
    "",
    "Flags:",
    "- `-y` skip confirmation prompts",
    "- `--overwrite` overwrite existing files",
    "- `--dry-run` preview without writing",
  ].join("\n");
}

export function formatProjectConfig(config: {
  style?: string;
  rsc?: boolean;
  tsx?: boolean;
  registry?: string;
  aliases: Record<string, string | undefined>;
  path: string;
} | null): string {
  if (!config) {
    return [
      "No `components.json` found in the current project.",
      "",
      "To fix this, run:",
      "```bash",
      "npx @intellihelper/cli@latest init",
      "```",
      "",
      "MCP tools still work with the default registry:",
      "`https://ui.intellihelper.in/r`",
      "",
      "Liquid Glass quick guide:",
      "- **Chrome layer** — neutral frosted controls (outline, secondary, ghost, glass-bar)",
      "- **Content layer** — saturated surfaces (primary, destructive, glass-content-card)",
      "- Prefer imports from `@/components/ui/*` after CLI install",
      "- Docs: https://ui.intellihelper.in",
    ].join("\n");
  }

  return [
    "# Project config (`components.json`)",
    "",
    `**Path:** ${config.path}`,
    `**Style:** ${config.style ?? "intelli-glass"}`,
    `**RSC:** ${config.rsc ?? true}`,
    `**TSX:** ${config.tsx ?? true}`,
    `**Registry:** ${config.registry ?? "https://ui.intellihelper.in/r"}`,
    "",
    "## Aliases",
    ...Object.entries(config.aliases).map(
      ([key, value]) => `- **${key}:** ${value ?? "(unset)"}`,
    ),
    "",
    "## Liquid Glass",
    "- **Chrome layer** — neutral frosted controls (outline, secondary, ghost, glass-bar)",
    "- **Content layer** — saturated surfaces (primary, destructive, glass-content-card)",
    "- Docs: https://ui.intellihelper.in",
  ].join("\n");
}

export function formatAuditChecklist(): string {
  return [
    "## IntelliHelper UI Audit Checklist",
    "",
    "After adding or generating components, verify:",
    "",
    "- [ ] `components.json` exists and aliases match your tsconfig paths",
    "- [ ] Imports use the configured UI alias (e.g. `@/components/ui/button`)",
    "- [ ] Named vs default imports match the component exports",
    "- [ ] Registry dependencies were installed (e.g. `utils` for `cn` / `focusRing`)",
    "- [ ] npm dependencies from the component are installed",
    "- [ ] Global CSS imports tokens / themes / glass variables (`@intelli/config` or playground globals)",
    "- [ ] Chrome-layer controls stay neutral; content-layer CTAs use saturated variants",
    "- [ ] Dark/light mode contrast looks correct on frosted surfaces",
    "- [ ] No TypeScript or lint errors",
    "- [ ] Interactive components that need client state are in Client Components (`\"use client\"`)",
    "",
    "Docs: https://ui.intellihelper.in · CLI: `npx @intellihelper/cli@latest list`",
  ].join("\n");
}
