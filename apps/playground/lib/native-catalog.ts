import {
  CATALOG,
  CATEGORY_META,
  type CatalogItem,
  type ComponentCategory,
} from "./catalog";

export type NativeCatalogItem = CatalogItem & {
  importName: string;
};

export const NATIVE_PACKAGE = "@intelli/ui-native";

export const NATIVE_CATEGORY_META = CATEGORY_META;

function toImportName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

const IMPORT_OVERRIDES: Record<string, string> = {
  typography: "TypographyH1",
  "mcp-server-card": "McpServerCard",
  "ai-chat": "AiChat",
  "ai-model-selector": "AiModelSelector",
};

const GLASS_SURFACE: NativeCatalogItem = {
  slug: "glass-surface",
  title: "Glass Surface",
  description: "Base frosted layer used by bars, cards, and overlays.",
  category: "glass-system",
  importName: "GlassSurface",
};

export const NATIVE_CATALOG: NativeCatalogItem[] = [
  GLASS_SURFACE,
  ...CATALOG.map((item) => ({
    ...item,
    importName: IMPORT_OVERRIDES[item.slug] ?? toImportName(item.slug),
  })),
];

/** All web catalog slugs now have a native implementation. */
export const NATIVE_DEFERRED: ReadonlyArray<{ title: string; reason: string }> =
  [];

export const NATIVE_CATEGORY_ORDER = Object.keys(
  NATIVE_CATEGORY_META,
) as ComponentCategory[];

export function getNativeItem(slug: string): NativeCatalogItem | undefined {
  return NATIVE_CATALOG.find((item) => item.slug === slug);
}

export function hasNativeTwin(webSlug: string): boolean {
  return NATIVE_CATALOG.some((item) => item.slug === webSlug);
}

export function getNativeByCategory(): Record<
  ComponentCategory,
  NativeCatalogItem[]
> {
  return NATIVE_CATEGORY_ORDER.reduce(
    (acc, category) => {
      acc[category] = NATIVE_CATALOG.filter((item) => item.category === category);
      return acc;
    },
    {} as Record<ComponentCategory, NativeCatalogItem[]>,
  );
}
