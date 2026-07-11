import type { MetadataRoute } from "next";
import { getSitemapEntries } from "../lib/sitemap-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries();
}