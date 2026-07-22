import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@intelli/ui";
import { ComponentCatalogGrid } from "../../../components/component-catalog-grid";
import { JsonLd } from "../../../components/json-ld";
import { PlaygroundSettings } from "../../../components/playground-settings";
import { CATALOG, CATEGORY_META, CATEGORY_ORDER } from "../../../lib/catalog";
import { catalogGraphJsonLd } from "../../../lib/json-ld";
import { createPageMetadata } from "../../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Component Catalog — Liquid Glass React UI",
  description:
    "Browse 80+ free Liquid Glass React components for Next.js & Tailwind CSS. Live previews, copy-paste source, and one-command CLI install for every component.",
  path: "/components",
  keywords: [
    "component catalog",
    "component playground",
    "ui documentation",
    "react ui kit",
    "tailwind ui components",
    "liquid glass playground",
    "free react components",
    "glassmorphism react",
  ],
});

type ComponentsPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function ComponentsPage({
  searchParams,
}: ComponentsPageProps) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <>
      <JsonLd data={catalogGraphJsonLd()} />
      <div className="space-y-10 pb-8">
        <section className="relative overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_22%,transparent)] px-6 py-8 shadow-[var(--glass-chrome-shadow)] md:px-8 md:py-10">
          <div className="relative max-w-2xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" size="sm">
                {CATALOG.length}+ components
              </Badge>
              <Badge variant="outline" size="sm">
                React · Next.js · Tailwind
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl md:leading-[1.15]">
                Component catalog
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Browse live previews, copy source, and install with the CLI.
                Built for product teams who want frosted chrome, clear hierarchy,
                and files they can actually edit — not a locked package.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-0.5">
              <Button asChild variant="primary">
                <Link href="/getting-started">Get started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/components/button">Open Button</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/getting-started#plugin">Agent plugin</Link>
              </Button>
            </div>
          </div>
        </section>

        <section aria-labelledby="category-links" className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2
              id="category-links"
              className="text-sm font-semibold text-foreground"
            >
              Browse by category
            </h2>
            <Link
              href="/getting-started"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Setup guide →
            </Link>
          </div>
          <ul className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${category}`}
                  className="inline-flex items-center rounded-full border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_12%,transparent)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[color-mix(in_oklch,var(--primary)_25%,var(--glass-chrome-border))] hover:text-foreground"
                >
                  {CATEGORY_META[category].label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="catalog-heading" className="space-y-5">
          <div className="space-y-1">
            <h2
              id="catalog-heading"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              All components
            </h2>
            <p className="text-sm text-muted-foreground">
              Filter by category or search. Every page includes a live preview
              and install command.
            </p>
          </div>
          <ComponentCatalogGrid initialQuery={initialQuery} />
        </section>

        <Card variant="chrome" animated={false}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Playground appearance</CardTitle>
            <CardDescription>
              Theme and background apply across every component page so previews
              match your product surface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlaygroundSettings embedded />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
