import type { Metadata } from "next";
import Link from "next/link";
import { CliGettingStarted } from "../../../components/cli-getting-started";
import { CustomizationDemo } from "../../../components/customization-demo";
import { JsonLd } from "../../../components/json-ld";
import { CATEGORY_META, getCatalogByCategory } from "../../../lib/catalog";
import { gettingStartedJsonLd } from "../../../lib/json-ld";
import { createPageMetadata } from "../../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Getting Started",
  description:
    "Install Intelli UI Liquid Glass components with the IntelliHelper CLI. Initialize your project, add button, card, tabs, and 40+ components, then customize variants in your codebase.",
  path: "/getting-started",
  keywords: [
    "intellihelper cli",
    "npx @intellihelper/cli",
    "install react components",
    "next.js setup",
    "tailwind setup",
  ],
  type: "article",
});

export default function GettingStartedPage() {
  const grouped = getCatalogByCategory();

  return (
    <>
      <JsonLd data={gettingStartedJsonLd()} />
      <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <header className="space-y-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← All components
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Getting started
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Copy Liquid Glass components into any Next.js + Tailwind project with
          the Intelli UI CLI. Components live in your codebase — fully owned and
          customizable.
        </p>
      </header>

      <section className="glass-panel rounded-2xl p-6">
        <CliGettingStarted />
      </section>

      <section className="glass-panel rounded-2xl p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">Customization</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Variants, className slots, data-slot hooks, and exported CVA helpers
            on every component.
          </p>
        </div>
        <CustomizationDemo />
      </section>

      <section className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">What&apos;s included</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {Object.values(grouped).flat().length} components across{" "}
          {Object.keys(CATEGORY_META).length} categories.
        </p>
        <ul className="mt-5 space-y-4">
          {Object.entries(grouped).map(([category, items]) =>
            items.length > 0 ? (
              <li key={category}>
                <p className="text-sm font-medium text-foreground">
                  {CATEGORY_META[category as keyof typeof CATEGORY_META].label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {items.map((item) => item.title).join(", ")}
                </p>
              </li>
            ) : null,
          )}
        </ul>
      </section>
      </div>
    </>
  );
}