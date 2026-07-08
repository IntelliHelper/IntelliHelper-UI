import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@intelli/ui";
import { ComponentCatalogGrid } from "../../components/component-catalog-grid";
import { JsonLd } from "../../components/json-ld";
import { PlaygroundSettings } from "../../components/playground-settings";
import {
  itemListJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "../../lib/json-ld";
import { createPageMetadata } from "../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Browse Liquid Glass React Components",
  description:
    "Browse, preview, and copy every Intelli UI component. Install Liquid Glass UI primitives into Next.js with the IntelliHelper CLI and customize variants in your codebase.",
  path: "/",
  keywords: [
    "component playground",
    "ui documentation",
    "react ui kit",
    "tailwind ui components",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          websiteJsonLd(),
          softwareApplicationJsonLd(),
          itemListJsonLd(),
        ]}
      />
      <div className="space-y-10 pb-8">
      <section className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Component library
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Browse, preview, and copy every component
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Each component has its own page with a live preview beside the
            source code. Install with the CLI, paste into your project, and
            customize with variants.
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

      <PlaygroundSettings />

      <ComponentCatalogGrid />
      </div>
    </>
  );
}