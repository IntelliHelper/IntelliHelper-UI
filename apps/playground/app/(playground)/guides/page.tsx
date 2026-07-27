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
import {
  Cluster,
  Container,
  Flex,
  Stack,
} from "@intelli/ui/layout";
import { JsonLd } from "../../../components/json-ld";
import { PageHeader } from "../../../components/page-header";
import { GUIDES } from "../../../lib/guides";
import { webPageJsonLd } from "../../../lib/json-ld";
import { absoluteUrl, createPageMetadata } from "../../../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Guides — Liquid Glass React UI Tutorials",
  description:
    "Free guides on Liquid Glass UI, layout primitives, glassmorphism in React, and shadcn/ui vs Intelli UI. Learn Next.js & Tailwind patterns with copy-paste components.",
  path: "/guides",
  keywords: [
    "liquid glass guide",
    "layout primitives react",
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
        data={[
          webPageJsonLd({
            name: "Intelli UI Guides",
            description:
              "Tutorials and comparisons for Liquid Glass React components, layout primitives, Next.js, and Tailwind CSS.",
            path: "/guides",
            type: "CollectionPage",
          }),
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Guides",
                item: absoluteUrl("/guides"),
              },
            ],
          },
        ]}
      />
      <Container size="md" padded={false} className="max-w-3xl pb-8">
        <Stack gap={8}>
          <PageHeader
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Guides" },
            ]}
            meta={`${GUIDES.length} articles`}
            title="Guides"
            description="Practical writing on glassmorphism, layout without div soup, Next.js + Tailwind component libraries, and how Intelli UI fits next to tools like shadcn/ui."
          />

          <Stack as="ul" gap={3}>
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <Card
                    variant="outline"
                    animated={false}
                    className="bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)] transition-colors group-hover:backdrop-blur-[var(--glass-blur)]"
                  >
                    <CardHeader className="p-5 md:p-6">
                      <Cluster gap={2}>
                        <Badge variant="secondary" size="sm">
                          {guide.readingMinutes} min
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {guide.datePublished}
                        </span>
                      </Cluster>
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
          </Stack>

          <Card variant="chrome" animated={false}>
            <CardContent className="p-6">
              <Flex
                direction="column"
                gap={4}
                className="sm:flex-row sm:items-center sm:justify-between"
              >
                <Stack gap={0.5}>
                  <p className="text-sm font-medium text-foreground">
                    Ready to build?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Install the library or open the component catalog.
                  </p>
                </Stack>
                <Cluster gap={2}>
                  <Button asChild size="sm" variant="primary">
                    <Link href="/getting-started">Get started</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/components">Browse components</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/components/layout">Layout component</Link>
                  </Button>
                </Cluster>
              </Flex>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
