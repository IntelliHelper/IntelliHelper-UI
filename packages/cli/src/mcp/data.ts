import catalogJson from "../registry/catalog.json" with { type: "json" };
import examplesJson from "../registry/examples.json" with { type: "json" };
import themesJson from "../registry/themes.json" with { type: "json" };
import {
  configExists,
  DEFAULT_NATIVE_REGISTRY_URL,
  DEFAULT_REGISTRY_URL,
  getConfigPath,
  readConfig,
} from "../lib/config.js";
import {
  fetchRegistry,
  fetchRegistryItem,
  listRegistryItems,
} from "../lib/registry.js";
import { parseComponentSpec, registryUrlFor } from "../lib/spec.js";
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

export type MaterialEntry = {
  id: string;
  label: string;
  description: string;
};

const catalog = catalogJson as CatalogData;
const examples = examplesJson as Record<string, ExampleEntry[]>;
const themesData = themesJson as {
  themes: ThemeEntry[];
  materials?: MaterialEntry[];
};

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

export function getMaterials(): MaterialEntry[] {
  return themesData.materials ?? [];
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
  const [webRegistry, nativeRegistry] = await Promise.all([
    fetchRegistry(registryUrl),
    fetchRegistry(DEFAULT_NATIVE_REGISTRY_URL),
  ]);

  const web = listRegistryItems(webRegistry).map((item) => ({
    ...item,
    category: getCategoryForName(item.name),
  }));

  const native = listRegistryItems(nativeRegistry).map((item) => ({
    ...item,
    name: `@native/${item.name.replace(/^@native\//, "")}`,
    category: getCategoryForName(item.name.replace(/^@native\//, "")),
  }));

  return [...web, ...native];
}

export async function loadComponent(
  name: string,
  cwd: string,
): Promise<RegistryItem | null> {
  const spec = parseComponentSpec(name);
  const url =
    spec.platform === "native"
      ? registryUrlFor(spec, getRegistryUrlForProject(cwd))
      : getRegistryUrlForProject(cwd);
  const item = await fetchRegistryItem(spec.name, url);
  if (!item) return null;
  if (spec.platform === "native") {
    return {
      ...item,
      name: spec.key,
    };
  }
  return item;
}
