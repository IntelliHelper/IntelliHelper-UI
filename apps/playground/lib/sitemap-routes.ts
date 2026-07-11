import type { MetadataRoute } from "next";
import { CATALOG } from "./catalog";
import { absoluteUrl } from "./seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: NonNullable<SitemapEntry["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/getting-started", changeFrequency: "monthly", priority: 0.9 },
  { path: "/sitemap", changeFrequency: "monthly", priority: 0.5 },
];

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  const componentRoutes: MetadataRoute.Sitemap = CATALOG.map((item) => ({
    url: absoluteUrl(`/components/${item.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...componentRoutes];
}