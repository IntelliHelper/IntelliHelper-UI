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
} from "@intelli/ui";
import {
  Box,
  Cluster,
  Container,
  Grid,
  Split,
  Stack,
} from "@intelli/ui/layout";
import type { ReactNode } from "react";
import { ComponentDock } from "../../../../components/component-dock";
import { ComponentExamples } from "../../../../components/component-examples";
import { ComponentFaq } from "../../../../components/component-faq";
import { InstallCommand } from "../../../../components/install-command";
import { JsonLd } from "../../../../components/json-ld";
import { PageHeader } from "../../../../components/page-header";
import {
  CATEGORY_META,
  CATALOG,
  getCatalogItem,
  getRelatedItems,
} from "../../../../lib/catalog";
import { getComponentGuidance } from "../../../../lib/component-guidance";
import { getComponentExtraFaqs } from "../../../../lib/component-seo";
import {
  componentBreadcrumbJsonLd,
  componentFaqJsonLd,
  componentPageJsonLd,
} from "../../../../lib/json-ld";
import { CLI_PACKAGE, createComponentMetadata } from "../../../../lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CATALOG.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCatalogItem(slug);

  if (!item) {
    return {
      title: "Component Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createComponentMetadata(item);
}

function DocSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Stack
      as="section"
      gap={4}
      aria-labelledby={id}
      className={className ?? "mt-12"}
    >
      <h2
        id={id}
        className="text-lg font-semibold tracking-tight text-foreground"
      >
        {title}
      </h2>
      {children}
    </Stack>
  );
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getCatalogItem(slug);

  if (!item) {
    notFound();
  }

  const category = CATEGORY_META[item.category];
  const related = getRelatedItems(item.slug);
  const guidance = getComponentGuidance(item);
  const extraFaqs = getComponentExtraFaqs(item.slug);

  return (
    <>
      <JsonLd
        data={[
          componentBreadcrumbJsonLd(item),
          componentPageJsonLd(item),
          componentFaqJsonLd(item, extraFaqs),
        ]}
      />
      <Container
        as="article"
        size="xl"
        padded={false}
        className="min-w-0 max-w-6xl pb-4"
      >
        <PageHeader
          className="mb-8"
          breadcrumbs={[
            { label: "Components", href: "/components" },
            { label: category.label, href: `/categories/${item.category}` },
            { label: item.title },
          ]}
          meta={
            <Cluster gap={2}>
              <Badge variant="secondary" size="sm">
                {category.label}
              </Badge>
              <span className="text-muted-foreground">Liquid Glass</span>
            </Cluster>
          }
          title={item.title}
          description={
            <>
              {item.description} Preview live, copy the source, or install with
              the CLI into your Next.js project.
            </>
          }
          actions={
            <Button asChild variant="outline" size="sm">
              <Link href={`/categories/${item.category}`}>
                More {category.label.toLowerCase()}
              </Link>
            </Button>
          }
        />

        <Box className="mb-8">
          <InstallCommand slug={item.slug} />
        </Box>

        <ComponentExamples slug={item.slug} />

        <DocSection id="component-overview" title="About this component">
          <Card variant="chrome" animated={false}>
            <CardContent className="p-6">
              <Stack gap={3} className="text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="font-medium text-foreground">
                    {item.title}
                  </strong>{" "}
                  is part of{" "}
                  <Link
                    href={`/categories/${item.category}`}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {category.label}
                  </Link>
                  . {item.description}
                </p>
                <p>
                  Install with{" "}
                  <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                    npx {CLI_PACKAGE}@latest add {item.slug}
                  </code>
                  . Files land in your project so you can customize styles,
                  variants, and behavior without a locked package.
                </p>
                <p>
                  Prefer AI-assisted install? Use the{" "}
                  <Link
                    href="/getting-started#plugin"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    agent plugin
                  </Link>{" "}
                  or the{" "}
                  <Link
                    href="/getting-started#mcp"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    MCP server
                  </Link>
                  .
                </p>
              </Stack>
            </CardContent>
          </Card>
        </DocSection>

        <DocSection
          id="component-guidance"
          title={`When to use ${item.title}`}
        >
          <Grid cols={1} mdCols={2} gap={4}>
            <Card variant="outline" animated={false}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Use when</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Stack
                  as="ul"
                  gap={2}
                  className="list-disc pl-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {guidance.whenToUse.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Card variant="outline" animated={false}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avoid when</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <Stack
                  as="ul"
                  gap={2}
                  className="list-disc pl-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {guidance.whenNotTo.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </DocSection>

        <DocSection id="component-a11y" title="Accessibility notes">
          <Card variant="chrome" animated={false}>
            <CardContent className="p-6">
              <Stack
                as="ul"
                gap={2}
                className="list-disc pl-4 text-sm leading-relaxed text-muted-foreground"
              >
                {guidance.accessibility.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </Stack>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Interactive primitives build on accessible patterns (including
                Radix where applicable). Always verify focus order and contrast
                on your mesh or product background.
              </p>
            </CardContent>
          </Card>
        </DocSection>

        <DocSection id="component-composition" title="Composition tips">
          <Card variant="outline" animated={false}>
            <CardContent className="p-6">
              <Stack
                as="ul"
                gap={2}
                className="list-disc pl-4 text-sm leading-relaxed text-muted-foreground"
              >
                {guidance.composition.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </DocSection>

        <DocSection id="component-faq" title="FAQ">
          <ComponentFaq
            title={item.title}
            description={item.description}
            installCommand={`npx ${CLI_PACKAGE}@latest add ${item.slug}`}
            extras={extraFaqs}
          />
        </DocSection>

        {related.length > 0 ? (
          <Stack
            as="section"
            gap={4}
            aria-labelledby="related-components"
            className="mt-12"
          >
            <Split gap={3} align="end">
              <h2
                id="related-components"
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                Related components
              </h2>
              <Link
                href={`/categories/${item.category}`}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View all {category.label.toLowerCase()} →
              </Link>
            </Split>
            <Grid as="ul" cols={1} smCols={2} gap={3}>
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/components/${rel.slug}`}
                    className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <Card
                      variant="outline"
                      animated={false}
                      className="h-full bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)] transition-colors group-hover:backdrop-blur-[var(--glass-blur)]"
                    >
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm">{rel.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {rel.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                          Open →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </Grid>
          </Stack>
        ) : null}

        <ComponentDock slug={item.slug} />
      </Container>
    </>
  );
}
