import catalogJson from "../registry/catalog.json" with { type: "json" };
import examplesJson from "../registry/examples.json" with { type: "json" };
import themesJson from "../registry/themes.json" with { type: "json" };
import {
  configExists,
  DEFAULT_REGISTRY_URL,
  getConfigPath,
  readConfig,
} from "../lib/config.js";
import {
  fetchRegistry,
  fetchRegistryItem,
  listRegistryItems,
} from "../lib/registry.js";
import type { IntelliConfig, RegistryItem } from "../types.js";
import type { EnrichedItem } from "./format.js";

export type CatalogItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
};

export type CatalogData = {
  categories: Record<string, { label: string; description: string }>;
  items: CatalogItem[];
};

export type ExampleEntry = {
  title: string;
  description?: string;
  code: string;
};

export type ThemeEntry = {
  id: string;
  label: string;
  description: string;
  cssFile: string;
};

const catalog = catalogJson as CatalogData;
const examples = examplesJson as Record<string, ExampleEntry[]>;
const themesData = themesJson as { themes: ThemeEntry[] };

export const DOCS_BASE = "https://ui.intellihelper.in";

export function getCatalog(): CatalogData {
  return catalog;
}

export function getCategoryForName(name: string): string | undefined {
  return catalog.items.find((item) => item.slug === name)?.category;
}

export function getExamplesMap(): Record<string, ExampleEntry[]> {
  return examples;
}

export function getExamplesFor(name: string): ExampleEntry[] {
  return examples[name] ?? [];
}

export function getThemes(): ThemeEntry[] {
  return themesData.themes;
}

export function resolveCwd(): string {
  return process.cwd();
}

export function tryReadConfig(cwd: string): IntelliConfig | null {
  if (!configExists(cwd)) return null;
  try {
    return readConfig(cwd);
  } catch {
    return null;
  }
}

export function getRegistryUrlForProject(cwd: string): string {
  const config = tryReadConfig(cwd);
  return config?.registry?.replace(/\/$/, "") ?? DEFAULT_REGISTRY_URL;
}

export function getProjectConfigSummary(cwd: string) {
  const config = tryReadConfig(cwd);
  if (!config) return null;
  return {
    path: getConfigPath(cwd),
    style: config.style,
    rsc: config.rsc,
    tsx: config.tsx,
    registry: config.registry,
    aliases: config.aliases as Record<string, string | undefined>,
  };
}

export async function loadEnrichedItems(
  cwd: string,
): Promise<EnrichedItem[]> {
  const registryUrl = getRegistryUrlForProject(cwd);
  const registry = await fetchRegistry(registryUrl);
  const items = listRegistryItems(registry);

  return items.map((item) => ({
    ...item,
    category: getCategoryForName(item.name),
  }));
}

export async function loadComponent(
  name: string,
  cwd: string,
): Promise<RegistryItem | null> {
  const registryUrl = getRegistryUrlForProject(cwd);
  return fetchRegistryItem(name, registryUrl);
}
