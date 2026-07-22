import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@intelli/ui";
import { JsonLd } from "../../../../components/json-ld";
import { PageHeader } from "../../../../components/page-header";
import { getAllGuideSlugs, getGuide, GUIDES } from "../../../../lib/guides";
import {
  guideArticleJsonLd,
  guideBreadcrumbJsonLd,
} from "../../../../lib/json-ld";
import {
  createPageMetadata,
  trimMetaDescription,
} from "../../../../lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return {
      title: "Guide Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: guide.title,
    description: trimMetaDescription(guide.description),
    path: `/guides/${guide.slug}`,
    keywords: guide.keywords,
    type: "article",
  });
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const related = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <>
      <JsonLd
        data={[guideBreadcrumbJsonLd(guide), guideArticleJsonLd(guide)]}
      />
      <article className="mx-auto max-w-3xl space-y-8 pb-8">
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: guide.title },
          ]}
          meta={
            <span className="inline-flex flex-wrap items-center gap-2">
              <Badge variant="secondary" size="sm">
                {guide.readingMinutes} min read
              </Badge>
              <span>Updated {guide.dateModified}</span>
            </span>
          }
          title={guide.title}
          description={guide.description}
        />

        <div className="space-y-10">
          {guide.sections.map((section, index) => (
            <section
              key={section.heading}
              className="space-y-3"
              aria-labelledby={section.heading
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}
            >
              {index > 0 ? (
                <Separator variant="subtle" className="mb-8" />
              ) : null}
              <h2
                id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="text-xl font-semibold tracking-tight text-foreground"
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="text-sm leading-relaxed text-muted-foreground md:text-[15px]"
                >
                  {p}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {section.bullets.map((b) => (
                    <li key={b.slice(0, 40)}>{b}</li>
                  ))}
                </ul>
              ) : null}
              {section.code ? (
                <pre className="overflow-x-auto rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_18%,transparent)] p-4 text-xs leading-relaxed text-foreground">
                  <code>{section.code}</code>
                </pre>
              ) : null}
            </section>
          ))}
        </div>

        <Card variant="chrome" animated={false}>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Ship it</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Install the library or open the catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="primary">
                <Link href="/getting-started">Getting started</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/components">Components</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href="/guides">All guides</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {related.length > 0 ? (
          <section aria-labelledby="related-guides" className="space-y-3">
            <h2
              id="related-guides"
              className="text-base font-semibold text-foreground"
            >
              Related guides
            </h2>
            <ul className="grid gap-3 sm:grid-cols-1">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <Card
                      variant="outline"
                      animated={false}
                      className="transition-colors group-hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_22%,transparent)]"
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">{g.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {g.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </>
  );
}
