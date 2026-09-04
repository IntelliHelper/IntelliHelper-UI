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
import {
  Box,
  Cluster,
  Container,
  Flex,
  Stack,
} from "@intelli/ui/layout";
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
      <Container
        as="article"
        size="md"
        padded={false}
        className="max-w-3xl pb-8"
      >
        <Stack gap={8}>
          <PageHeader
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: guide.title },
            ]}
            meta={
              <Cluster gap={2}>
                <Badge variant="secondary" size="sm">
                  {guide.readingMinutes} min read
                </Badge>
                <span>Updated {guide.dateModified}</span>
              </Cluster>
            }
            title={guide.title}
            description={guide.description}
          />

          <Stack gap={10}>
            {guide.sections.map((section, index) => {
              const headingId = section.heading
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");
              return (
                <Stack
                  key={section.heading}
                  as="section"
                  gap={3}
                  aria-labelledby={headingId}
                >
                  {index > 0 ? (
                    <Separator variant="subtle" className="mb-8" />
                  ) : null}
                  <h2
                    id={headingId}
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
                    <Stack
                      as="ul"
                      gap={2}
                      className="list-disc pl-5 text-sm leading-relaxed text-muted-foreground md:text-[15px]"
                    >
                      {section.bullets.map((b) => (
                        <li key={b.slice(0, 40)}>{b}</li>
                      ))}
                    </Stack>
                  ) : null}
                  {section.table ? (
                    <Box className="overflow-x-auto rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_40%, var(--glass-mix-into))] shadow-[var(--glass-chrome-shadow)] backdrop-blur-[var(--glass-blur)]">
                      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                        <caption className="border-b border-[var(--glass-chrome-border)] px-4 py-3 text-left text-xs font-medium text-muted-foreground md:px-5">
                          {section.table.caption}
                        </caption>
                        <thead>
                          <tr className="border-b border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--background)_40%,transparent)]">
                            {section.table.headers.map((header) => (
                              <th
                                key={header}
                                scope="col"
                                className="px-4 py-3 font-semibold text-foreground md:px-5"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr
                              key={row.join("|").slice(0, 48)}
                              className="border-b border-[var(--glass-chrome-border)] last:border-b-0"
                            >
                              {row.map((cell, cellIndex) =>
                                cellIndex === 0 ? (
                                  <th
                                    key={`${row[0]}-${cellIndex}`}
                                    scope="row"
                                    className="px-4 py-3 font-medium text-foreground md:px-5"
                                  >
                                    {cell}
                                  </th>
                                ) : (
                                  <td
                                    key={`${row[0]}-${cellIndex}`}
                                    className="px-4 py-3 text-muted-foreground md:px-5"
                                  >
                                    {cell}
                                  </td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  ) : null}
                  {section.code ? (
                    <pre className="overflow-x-auto rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%, var(--glass-mix-into))] p-4 text-xs leading-relaxed text-foreground backdrop-blur-[var(--glass-blur)]">
                      <code>{section.code}</code>
                    </pre>
                  ) : null}
                </Stack>
              );
            })}
          </Stack>

          <Card variant="chrome" animated={false}>
            <CardContent className="p-6">
              <Flex
                direction="column"
                gap={4}
                className="sm:flex-row sm:items-center sm:justify-between"
              >
                <Stack gap={0.5}>
                  <p className="text-sm font-medium text-foreground">Ship it</p>
                  <p className="text-sm text-muted-foreground">
                    Install the library or open the catalog.
                  </p>
                </Stack>
                <Cluster gap={2}>
                  <Button asChild size="sm" variant="primary">
                    <Link href="/getting-started">Getting started</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/components">Components</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/guides">All guides</Link>
                  </Button>
                </Cluster>
              </Flex>
            </CardContent>
          </Card>

          {related.length > 0 ? (
            <Stack as="section" gap={3} aria-labelledby="related-guides">
              <h2
                id="related-guides"
                className="text-base font-semibold text-foreground"
              >
                Related guides
              </h2>
              <Stack as="ul" gap={3}>
                {related.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides/${g.slug}`}
                      className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      <Card
                        variant="outline"
                        animated={false}
                        className="bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%, var(--glass-mix-into))] transition-colors group-hover:backdrop-blur-[var(--glass-blur)]"
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
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </>
  );
}
