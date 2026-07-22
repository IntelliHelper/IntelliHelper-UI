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

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getCatalogItem(slug);

  if (!item) {
    notFound();
  }

  const category = CATEGORY_META[item.category];
  const related = getRelatedItems(item.slug);

  return (
    <>
      <JsonLd
        data={[
          componentBreadcrumbJsonLd(item),
          componentPageJsonLd(item),
          componentFaqJsonLd(item),
        ]}
      />
      <article className="mx-auto min-w-0 max-w-6xl pb-4">
        <PageHeader
          className="mb-8"
          breadcrumbs={[
            { label: "Components", href: "/components" },
            { label: category.label, href: `/categories/${item.category}` },
            { label: item.title },
          ]}
          meta={
            <span className="inline-flex items-center gap-2">
              <Badge variant="secondary" size="sm">
                {category.label}
              </Badge>
              <span className="text-muted-foreground">Liquid Glass</span>
            </span>
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

        <div className="mb-8">
          <InstallCommand slug={item.slug} />
        </div>

        <ComponentExamples slug={item.slug} />

        <section
          className="mt-12 space-y-4"
          aria-labelledby="component-overview"
        >
          <h2
            id="component-overview"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            About this component
          </h2>
          <Card variant="chrome" animated={false}>
            <CardContent className="space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
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
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 space-y-4" aria-labelledby="component-faq">
          <h2
            id="component-faq"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            FAQ
          </h2>
          <ComponentFaq
            title={item.title}
            description={item.description}
            installCommand={`npx ${CLI_PACKAGE}@latest add ${item.slug}`}
          />
        </section>

        {related.length > 0 ? (
          <section
            className="mt-12 space-y-4"
            aria-labelledby="related-components"
          >
            <div className="flex items-end justify-between gap-3">
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
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/components/${rel.slug}`}
                    className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <Card
                      variant="outline"
                      animated={false}
                      className="h-full transition-colors group-hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_22%,transparent)]"
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
            </ul>
          </section>
        ) : null}

        <ComponentDock slug={item.slug} />
      </article>
    </>
  );
}
