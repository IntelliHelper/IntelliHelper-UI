import type { MetadataRoute } from "next";
import { CATALOG, CATEGORY_ORDER } from "./catalog";
import { GUIDES } from "./guides";
import { absoluteUrl } from "./seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

/**
 * Sitemap entries: real lastmod where we have content dates.
 * Omit priority/changefreq (deprecated signals Google ignores).
 * HTML /sitemap stays listed as a human index page (not sitemap.xml self-ref).
 */
const STATIC_ROUTES: Array<{
  path: string;
  lastModified?: Date;
}> = [
  { path: "/" },
  { path: "/components" },
  { path: "/getting-started" },
  { path: "/guides" },
  { path: "/about" },
  { path: "/sitemap" },
];

function startOfUtcDay(date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const buildDay = startOfUtcDay();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, lastModified }) => ({
      url: absoluteUrl(path),
      lastModified: lastModified ?? buildDay,
    }),
  );

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: startOfUtcDay(new Date(guide.dateModified)),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_ORDER.map(
    (category) => ({
      url: absoluteUrl(`/categories/${category}`),
      lastModified: buildDay,
    }),
  );

  const componentRoutes: MetadataRoute.Sitemap = CATALOG.map((item) => ({
    url: absoluteUrl(`/components/${item.slug}`),
    lastModified: buildDay,
  }));

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...categoryRoutes,
    ...componentRoutes,
  ];
}

// Re-export type helper for consumers that need SitemapEntry
export type { SitemapEntry };
