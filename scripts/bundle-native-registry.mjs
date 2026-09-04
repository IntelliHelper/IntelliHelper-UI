#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const nativeSrc = join(root, "packages/ui-native/src");
const componentsDir = join(nativeSrc, "components");

/** Extra registry names that share a source file. */
const FILE_ALIASES = {
  "charts.tsx": [
    "bar-chart",
    "line-chart",
    "area-chart",
    "sparkline",
    "stacked-bar-chart",
    "pie-chart",
    "donut-chart",
    "radar-chart",
    "funnel-chart",
    "heatmap",
    "tree-map",
    "sankey",
    "gauge",
    "metric-card",
    "chart-frame",
    "chart-period",
  ],
  "ai.tsx": [
    "prompt-input",
    "streaming-text",
    "typing-indicator",
    "thinking-animation",
    "reasoning-block",
    "citation-card",
    "token-counter",
    "prompt-suggestions",
    "agent-card",
    "tool-call-viewer",
    "mcp-server-card",
    "ai-model-selector",
    "conversation-sidebar",
    "ai-chat",
    "floating-widget",
  ],
  "media.tsx": [
    "aspect-ratio",
    "image-preview",
    "image-editor",
    "media-player",
    "file-upload",
    "font-picker",
  ],
  "viewers.tsx": [
    "code-viewer",
    "json-viewer",
    "terminal-block",
    "markdown-editor",
    "component-preview",
  ],
  "layout.tsx": ["layout", "resizable", "background-picture-picker"],
  "data-views.tsx": [
    "kanban",
    "data-grid",
    "virtual-table",
    "address-fields",
    "address-country-select",
    "address-region-select",
    "address-city-select",
    "event-calendar",
  ],
  "banner.tsx": ["banner", "callout", "offline-banner"],
  "loading-screen.tsx": ["loading-screen", "retry-view"],
  "bottom-navigation.tsx": ["bottom-navigation", "dock", "navigation-menu"],
  "timeline.tsx": ["timeline", "activity-feed", "notification-center"],
  "combobox.tsx": ["combobox", "multi-select", "command"],
  "otp-input.tsx": ["otp-input", "pin-input"],
  "number-input.tsx": ["number-input", "currency-input"],
  "time-picker.tsx": ["time-picker", "month-picker", "date-time-picker"],
  "dropdown-menu.tsx": ["dropdown-menu"],
  "context-menu.tsx": ["context-menu"],
};

const DEPS = {
  calendar: ["date-fns"],
  "month-picker": ["date-fns"],
  "date-time-picker": ["date-fns"],
};

const REGISTRY_DEPS = {
  "copy-button": ["button", "native-theme"],
  "alert-dialog": ["dialog"],
  drawer: ["sheet"],
  "hover-card": ["popover"],
  "native-select": ["select"],
  "context-menu": ["dropdown-menu"],
};

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

const themeFiles = readdirSync(join(nativeSrc, "theme")).map((name) => ({
  path: `packages/ui-native/src/theme/${name}`,
  type: "registry:lib",
  target: `components/ui/native/theme/${name}`,
}));

const utilFiles = readdirSync(join(nativeSrc, "utils")).map((name) => ({
  path: `packages/ui-native/src/utils/${name}`,
  type: "registry:lib",
  target: `components/ui/native/utils/${name}`,
}));

const items = [
  {
    name: "native-theme",
    type: "registry:lib",
    title: "Native Theme",
    description: "Liquid Glass theme tokens and ThemeProvider for React Native.",
    meta: { platform: "native" },
    files: themeFiles,
  },
  {
    name: "native-utils",
    type: "registry:lib",
    title: "Native Utils",
    description: "Style merge and motion helpers for React Native.",
    meta: { platform: "native" },
    files: utilFiles,
  },
];

const seen = new Set();

for (const file of readdirSync(componentsDir).filter((f) => f.endsWith(".tsx"))) {
  const names = FILE_ALIASES[file] ?? [file.replace(/\.tsx$/, "")];
  const sourcePath = `packages/ui-native/src/components/${file}`;
  const target = `components/ui/native/${file}`;

  for (const name of names) {
    if (seen.has(name)) continue;
    seen.add(name);
    items.push({
      name,
      type: "registry:ui",
      title: titleFromSlug(name),
      description: `React Native ${titleFromSlug(name)} for Expo, iOS, and Android.`,
      dependencies: DEPS[name] ?? [],
      registryDependencies: [
        "native-theme",
        "native-utils",
        ...(REGISTRY_DEPS[name] ?? []),
      ],
      files: [
        {
          path: sourcePath,
          type: "registry:ui",
          target,
        },
      ],
      meta: { platform: "native" },
    });
  }
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "intelli-ui-native",
  homepage: "https://ui.intellihelper.in/native",
  items,
};

export function embedContent(reg) {
  for (const item of reg.items) {
    for (const file of item.files) {
      const abs = join(root, file.path);
      if (!existsSync(abs)) {
        throw new Error(`Native registry source missing: ${file.path}`);
      }
      file.content = readFileSync(abs, "utf8");
    }
  }
  return reg;
}

const filled = embedContent(registry);

const cliOut = join(root, "packages/cli/src/registry/bundled-native.json");
mkdirSync(dirname(cliOut), { recursive: true });
writeFileSync(cliOut, `${JSON.stringify(filled, null, 2)}\n`);

const publicDir = join(root, "apps/playground/public/r/native");
mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "registry.json"), `${JSON.stringify(filled, null, 2)}\n`);
for (const item of filled.items) {
  writeFileSync(join(publicDir, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
}

console.log(`Native registry: ${filled.items.length} items → ${publicDir}`);
