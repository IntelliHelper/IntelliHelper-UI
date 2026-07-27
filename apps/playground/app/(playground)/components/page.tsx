import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@intelli/ui";
import {
  Box,
  Cluster,
  Split,
  Stack,
} from "@intelli/ui/layout";
import { ComponentCatalogGrid } from "../../../components/component-catalog-grid";
import { JsonLd } from "../../../components/json-ld";
import { PlaygroundSettings } from "../../../components/playground-settings";
import { CATALOG, CATEGORY_META, CATEGORY_ORDER } from "../../../lib/catalog";
import { catalogGraphJsonLd } from "../../../lib/json-ld";
import { createPageMetadata } from "../../../lib/seo";

/** Static catalog HTML for edge caching — filters run client-side. */
export const dynamic = "force-static";

export const metadata: Metadata = createPageMetadata({
  title: "Liquid Glass React Components — Free Catalog",
  description:
    "Browse 80+ free Liquid Glass React components for Next.js & Tailwind CSS. Live previews, copy-paste source, and one-command CLI install — a glass-first alternative to flat shadcn defaults.",
  path: "/components",
  keywords: [
    "liquid glass react components",
    "liquid glass components",
    "glassmorphism react components",
    "react component catalog",
    "component playground",
    "ui documentation",
    "react ui kit",
    "tailwind ui components",
    "free react components",
    "shadcn alternative components",
  ],
});

export default function ComponentsPage() {
  return (
    <>
      <JsonLd data={catalogGraphJsonLd()} />
      <Stack gap={10} className="pb-8">
        <Box
          as="section"
          className="relative overflow-hidden rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)] px-6 py-8 shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)] md:px-8 md:py-10"
        >
          <Stack gap={5} className="relative max-w-2xl">
            <Cluster gap={2}>
              <Badge variant="secondary" size="sm">
                {CATALOG.length}+ components
              </Badge>
              <Badge variant="outline" size="sm">
                React · Next.js · Tailwind
              </Badge>
            </Cluster>

            <Stack gap={3}>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl md:leading-[1.15]">
                Liquid Glass React components
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Free frosted-glass UI for Next.js and Tailwind — live previews,
                CLI install, and source you own. Built for product chrome, AI
                interfaces, and teams who want hierarchy instead of flat defaults.
              </p>
            </Stack>

            <Cluster gap={2.5} className="pt-0.5">
              <Button asChild variant="primary">
                <Link href="/getting-started">Get started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/components/button">Open Button</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/guides/shadcn-vs-intelli-ui">vs shadcn</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/guides/layout-primitives">Layout primitives</Link>
              </Button>
            </Cluster>
          </Stack>
        </Box>

        <Stack as="section" gap={3} aria-labelledby="category-links">
          <Split gap={3} align="end">
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
          </Split>
          <Cluster as="ul" gap={2}>
            {CATEGORY_ORDER.map((category) => (
              <li key={category}>
                <Link
                  href={`/categories/${category}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] px-3 py-2 text-xs font-medium text-muted-foreground backdrop-blur-[var(--glass-blur)] transition-colors hover:border-[color-mix(in_oklch,var(--primary)_25%,var(--glass-chrome-border))] hover:text-foreground"
                >
                  {CATEGORY_META[category].label}
                </Link>
              </li>
            ))}
          </Cluster>
        </Stack>

        <Stack as="section" gap={5} aria-labelledby="catalog-heading">
          <Stack gap={1}>
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
          </Stack>
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">Loading catalog…</p>
            }
          >
            <ComponentCatalogGrid />
          </Suspense>
        </Stack>

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
      </Stack>
    </>
  );
}
