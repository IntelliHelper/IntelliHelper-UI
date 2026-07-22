import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@intelli/ui";
import { PageHeader } from "../../../components/page-header";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  getCatalogByCategory,
} from "../../../lib/catalog";
import { GUIDES } from "../../../lib/guides";
import { createPageMetadata } from "../../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sitemap — All Intelli UI Pages",
  description:
    "Browse every page on Intelli UI — homepage, getting started, guides, categories, and all Liquid Glass component documentation for React and Next.js.",
  path: "/sitemap",
  keywords: ["sitemap", "site map", "all pages", "component index", "HTML sitemap"],
});

export default function SitemapPage() {
  const grouped = getCatalogByCategory();

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sitemap" },
        ]}
        title="Sitemap"
        description={
          <>
            Every public page on Intelli UI. Machines can also use the{" "}
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
          </>
        }
      />

      <Card variant="chrome" animated={false}>
        <CardHeader>
          <CardTitle className="text-base">Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/components", label: "Components" },
              { href: "/getting-started", label: "Getting started" },
              { href: "/guides", label: "Guides" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card variant="chrome" animated={false}>
        <CardHeader>
          <CardTitle className="text-base">Guides</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card variant="chrome" animated={false}>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {CATEGORY_ORDER.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${category}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CATEGORY_META[category].label}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card variant="chrome" animated={false}>
        <CardHeader>
          <CardTitle className="text-base">Components</CardTitle>
          <CardDescription>Grouped by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {CATEGORY_ORDER.map((category, index) => {
            const items = grouped[category];
            if (!items.length) return null;
            return (
              <div key={category}>
                {index > 0 ? (
                  <Separator className="my-5" variant="subtle" />
                ) : null}
                <p className="text-sm font-medium text-foreground">
                  <Link
                    href={`/categories/${category}`}
                    className="transition-colors hover:text-primary"
                  >
                    {CATEGORY_META[category].label}
                  </Link>
                </p>
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
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
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
