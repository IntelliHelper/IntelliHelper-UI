import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@intelli/ui";
import { ComponentCatalogGrid } from "../../components/component-catalog-grid";
import { JsonLd } from "../../components/json-ld";
import { PlaygroundSettings } from "../../components/playground-settings";
import { CATALOG, CATEGORY_META, CATEGORY_ORDER } from "../../lib/catalog";
import { homeGraphJsonLd } from "../../lib/json-ld";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title:
    "Intelli UI — Free Liquid Glass React Components for Next.js & Tailwind CSS",
  description:
    "80+ free Liquid Glass React components for Next.js & Tailwind CSS. Live previews, copy-paste source, CLI install. Build stunning glassmorphism UIs you own.",
  path: "/",
  keywords: [
    "component playground",
    "ui documentation",
    "react ui kit",
    "tailwind ui components",
    "liquid glass playground",
    "free react components",
    "free liquid glass components",
    "glassmorphism react",
    "agent plugin",
    "claude code plugin",
    "grok plugin",
  ],
  absoluteTitle: true,
});

type HomePageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <>
      <JsonLd data={homeGraphJsonLd()} />
      <div className="space-y-10 pb-8">
        <section className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Liquid Glass · React · Next.js · Tailwind
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Free Liquid Glass React Components for Next.js &amp; Tailwind CSS
            </h1>
            <p className="text-base font-medium text-foreground/90 md:text-lg">
              Browse, preview, and copy every component
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Intelli UI is a free Liquid Glass component library with{" "}
              {CATALOG.length}+ React components for Next.js and Tailwind CSS.
              Each page ships a live preview beside the source. Install with
              the CLI, paste into your project, and customize variants you own
              — or wire Claude, Grok, and other coding agents with the official{" "}
              <Link
                href="/getting-started#plugin"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                agent plugin
              </Link>
              . Prefer guides? Read{" "}
              <Link
                href="/guides"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Liquid Glass tutorials
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild>
                <Link href="/getting-started">Get started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/getting-started#plugin">Install agent plugin</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/components/button">Start with Button</Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          className="glass-panel rounded-2xl p-5 md:p-6"
          aria-labelledby="category-links"
        >
          <h2
            id="category-links"
            className="text-sm font-semibold text-foreground"
          >
            Browse by category
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${category}`}
                  className="inline-flex rounded-full border border-[var(--glass-chrome-border)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)] hover:text-foreground"
                >
                  {CATEGORY_META[category].label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <PlaygroundSettings />

        <ComponentCatalogGrid initialQuery={initialQuery} />
      </div>
    </>
  );
}
