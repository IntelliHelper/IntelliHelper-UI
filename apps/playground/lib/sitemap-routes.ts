import type { MetadataRoute } from "next";
import { CATALOG, CATEGORY_ORDER } from "./catalog";
import { GUIDES } from "./guides";
import { absoluteUrl } from "./seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Core product components get higher priority than niche utilities. */
const CORE_COMPONENT_SLUGS = new Set([
  "button",
  "card",
  "dialog",
  "input",
  "select",
  "tabs",
  "sheet",
  "sidebar",
  "table",
  "toast",
  "dropdown-menu",
  "popover",
  "checkbox",
  "switch",
  "textarea",
  "glass-bar",
  "glass-content-card",
  "ai-chat",
  "command",
]);

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/components", changeFrequency: "weekly", priority: 0.98 },
  { path: "/getting-started", changeFrequency: "monthly", priority: 0.95 },
  { path: "/guides", changeFrequency: "weekly", priority: 0.9 },
  { path: "/sitemap", changeFrequency: "monthly", priority: 0.3 },
];

export function getSitemapEntries(): MetadataRoute.Sitemap {
  // Stable lastModified day for better crawl budget signals vs always-now churn
  const lastModified = new Date();
  lastModified.setUTCHours(0, 0, 0, 0);

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(guide.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_ORDER.map(
    (category) => ({
      url: absoluteUrl(`/categories/${category}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }),
  );

  const componentRoutes: MetadataRoute.Sitemap = CATALOG.map((item) => ({
    url: absoluteUrl(`/components/${item.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: CORE_COMPONENT_SLUGS.has(item.slug) ? 0.7 : 0.5,
  }));

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...categoryRoutes,
    ...componentRoutes,
  ];
}
