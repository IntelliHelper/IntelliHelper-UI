import type { MetadataRoute } from "next";
import { CATALOG, CATEGORY_ORDER } from "./catalog";
import { NATIVE_CATALOG } from "./native-catalog";
import { GUIDES } from "./guides";
import { absoluteUrl, SITE_CONTENT_DATES } from "./seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

function startOfUtcDay(date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Sitemap entries: real lastmod where we have content dates.
 * Omit priority/changefreq (deprecated signals Google ignores).
 * HTML /sitemap stays listed as a human index page (not sitemap.xml self-ref).
 */
const STATIC_ROUTES: Array<{
  path: string;
  lastModified?: Date;
}> = [
  {
    path: "/",
    lastModified: startOfUtcDay(new Date(SITE_CONTENT_DATES.modified)),
  },
  {
    path: "/components",
    lastModified: startOfUtcDay(new Date(SITE_CONTENT_DATES.modified)),
  },
  {
    path: "/native",
    lastModified: startOfUtcDay(new Date(SITE_CONTENT_DATES.modified)),
  },
  {
    path: "/getting-started",
    lastModified: startOfUtcDay(new Date(SITE_CONTENT_DATES.modified)),
  },
  {
    path: "/guides",
    lastModified: startOfUtcDay(new Date(SITE_CONTENT_DATES.modified)),
  },
  {
    path: "/about",
    lastModified: startOfUtcDay(new Date(SITE_CONTENT_DATES.modified)),
  },
  { path: "/sitemap" },
];

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const contentDay = startOfUtcDay(new Date(SITE_CONTENT_DATES.modified));

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, lastModified }) => ({
      url: absoluteUrl(path),
      lastModified: lastModified ?? contentDay,
    }),
  );

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: startOfUtcDay(new Date(guide.dateModified)),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_ORDER.map(
    (category) => ({
      url: absoluteUrl(`/categories/${category}`),
      lastModified: contentDay,
    }),
  );

  const componentRoutes: MetadataRoute.Sitemap = CATALOG.map((item) => ({
    url: absoluteUrl(`/components/${item.slug}`),
    lastModified: contentDay,
  }));

  const nativeRoutes: MetadataRoute.Sitemap = NATIVE_CATALOG.map((item) => ({
    url: absoluteUrl(`/native/${item.slug}`),
    lastModified: contentDay,
  }));

  return [
    ...staticRoutes,
    ...guideRoutes,
    ...categoryRoutes,
    ...componentRoutes,
    ...nativeRoutes,
  ];
}

// Re-export type helper for consumers that need SitemapEntry
export type { SitemapEntry };
