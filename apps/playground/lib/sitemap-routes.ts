import type { MetadataRoute } from "next";
import { CATALOG, CATEGORY_ORDER } from "./catalog";
import { absoluteUrl } from "./seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/getting-started", changeFrequency: "weekly", priority: 0.95 },
  { path: "/sitemap", changeFrequency: "monthly", priority: 0.4 },
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

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_ORDER.map(
    (category) => ({
      url: absoluteUrl(`/categories/${category}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }),
  );

  const componentRoutes: MetadataRoute.Sitemap = CATALOG.map((item) => ({
    url: absoluteUrl(`/components/${item.slug}`),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...componentRoutes];
}
