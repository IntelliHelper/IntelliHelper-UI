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
import { JsonLd } from "../../../components/json-ld";
import { PageHeader } from "../../../components/page-header";
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
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Guides" },
          ]}
          meta={`${GUIDES.length} articles`}
          title="Guides"
          description="Practical writing on glassmorphism, Next.js + Tailwind component libraries, and how Intelli UI fits next to tools like shadcn/ui."
        />

        <ul className="space-y-3">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <Card
                  variant="outline"
                  animated={false}
                  className="transition-colors group-hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_22%,transparent)]"
                >
                  <CardHeader className="p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" size="sm">
                        {guide.readingMinutes} min
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {guide.datePublished}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-lg group-hover:text-foreground">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="mt-1.5 leading-relaxed">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 pt-0 md:px-6 md:pb-6">
                    <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      Read guide →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>

        <Card variant="chrome" animated={false}>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Ready to build?</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Install the library or open the component catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="primary">
                <Link href="/getting-started">Get started</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/components">Browse components</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
