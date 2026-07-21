import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../../components/json-ld";
import { GUIDES } from "../../../lib/guides";
import { webPageJsonLd } from "../../../lib/json-ld";
import { createPageMetadata } from "../../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Guides — Liquid Glass React UI Tutorials",
  description:
    "Free guides on Liquid Glass UI, glassmorphism in React, and shadcn/ui vs Intelli UI. Learn Next.js & Tailwind patterns with copy-paste components.",
  path: "/guides",
  keywords: [
    "liquid glass guide",
    "glassmorphism tutorial react",
    "shadcn alternative guide",
    "intelli ui blog",
    "react ui tutorials",
  ],
  type: "website",
});

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "Intelli UI Guides",
          description:
            "Tutorials and comparisons for Liquid Glass React components, Next.js, and Tailwind CSS.",
          path: "/guides",
          type: "CollectionPage",
        })}
      />
      <div className="mx-auto max-w-3xl space-y-8 pb-8">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Editorial · SEO guides
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Guides for Liquid Glass React UI
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Practical articles on glassmorphism, Next.js + Tailwind component
            libraries, and how Intelli UI compares to shadcn/ui. New posts land
            here as we grow topical authority — start with the two below.
          </p>
        </header>

        <ul className="space-y-4">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="glass-panel block rounded-2xl p-6 transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)]"
              >
                <p className="text-xs text-muted-foreground">
                  {guide.datePublished} · {guide.readingMinutes} min read
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <aside className="glass-panel rounded-2xl p-6 text-sm text-muted-foreground">
          <p>
            Ready to build?{" "}
            <Link
              href="/getting-started"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Install Intelli UI
            </Link>{" "}
            or{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              browse components
            </Link>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
