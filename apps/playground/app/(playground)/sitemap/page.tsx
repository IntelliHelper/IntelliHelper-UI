import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  getCatalogByCategory,
} from "../../../lib/catalog";
import { createPageMetadata } from "../../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sitemap — All Intelli UI Pages",
  description:
    "Browse every page on Intelli UI — homepage, getting started, categories, and all Liquid Glass component documentation for React and Next.js.",
  path: "/sitemap",
  keywords: ["sitemap", "site map", "all pages", "component index", "HTML sitemap"],
});

export default function SitemapPage() {
  const grouped = getCatalogByCategory();

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <header className="space-y-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All components
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sitemap
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Every public page on Intelli UI. Search engines can also use the{" "}
          <Link
            href="/sitemap.xml"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            XML sitemap
          </Link>
          ,{" "}
          <Link
            href="/rss.xml"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            RSS feed
          </Link>
          , and{" "}
          <a
            href="/llms.txt"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            llms.txt
          </a>
          .
        </p>
      </header>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">Pages</h2>
        <ul className="mt-4 space-y-2">
          <li>
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/getting-started"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Getting started
            </Link>
          </li>
        </ul>
      </section>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">Categories</h2>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {CATEGORY_ORDER.map((category) => (
            <li key={category}>
              <Link
                href={`/categories/${category}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {CATEGORY_META[category].label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">Components</h2>
        <ul className="mt-5 space-y-6">
          {CATEGORY_ORDER.map((category) => {
            const items = grouped[category];
            if (!items.length) return null;
            return (
              <li key={category}>
                <p className="text-sm font-medium text-foreground">
                  <Link
                    href={`/categories/${category}`}
                    className="transition-colors hover:text-primary"
                  >
                    {CATEGORY_META[category].label}
                  </Link>
                </p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  {items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/components/${item.slug}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
