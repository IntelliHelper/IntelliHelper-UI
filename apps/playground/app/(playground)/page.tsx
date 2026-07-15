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
  title: "Browse Liquid Glass React Components",
  description:
    "Browse, preview, and copy every Intelli UI Liquid Glass component. Free React + Next.js + Tailwind primitives with CLI install, agent plugin + MCP for AI agents, live previews, and full source ownership — a modern shadcn-style workflow.",
  path: "/",
  keywords: [
    "component playground",
    "ui documentation",
    "react ui kit",
    "tailwind ui components",
    "liquid glass playground",
    "free react components",
  ],
  absoluteTitle: false,
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
              Liquid Glass · React · Next.js
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Browse, preview, and copy every component
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              Intelli UI is a Liquid Glass component library with{" "}
              {CATALOG.length}+ React components for Next.js and Tailwind.
              Each page ships a live preview beside the source. Install with
              the CLI, paste into your project, and customize variants you own.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild>
                <Link href="/getting-started">Get started</Link>
              </Button>
              <Button asChild variant="outline">
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
