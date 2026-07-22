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
import { JsonLd } from "../../../../components/json-ld";
import { PageHeader } from "../../../../components/page-header";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  getCategoryItems,
  isComponentCategory,
  type ComponentCategory,
} from "../../../../lib/catalog";
import {
  categoryBreadcrumbJsonLd,
  categoryItemListJsonLd,
  webPageJsonLd,
} from "../../../../lib/json-ld";
import { CATEGORY_SEO_INTRO } from "../../../../lib/category-seo";
import { CLI_PACKAGE, createCategoryMetadata } from "../../../../lib/seo";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isComponentCategory(category)) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  return createCategoryMetadata(category);
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: raw } = await params;

  if (!isComponentCategory(raw)) {
    notFound();
  }

  const category = raw as ComponentCategory;
  const meta = CATEGORY_META[category];
  const items = getCategoryItems(category);

  return (
    <>
      <JsonLd
        data={[
          categoryBreadcrumbJsonLd(category),
          categoryItemListJsonLd(category),
          webPageJsonLd({
            name: `Free ${meta.label} React Components for Next.js`,
            description: `${meta.description}. ${items.length} free Liquid Glass components for React, Next.js, and Tailwind CSS.`,
            path: `/categories/${category}`,
            type: "CollectionPage",
          }),
        ]}
      />
      <div className="mx-auto max-w-4xl space-y-8 pb-8">
        <PageHeader
          breadcrumbs={[
            { label: "Components", href: "/components" },
            { label: meta.label },
          ]}
          meta={
            <span className="inline-flex items-center gap-2">
              <Badge variant="secondary" size="sm">
                {items.length} component{items.length === 1 ? "" : "s"}
              </Badge>
              <span>Category</span>
            </span>
          }
          title={meta.label}
          description={
            <>
              {meta.description}. Install with{" "}
              <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                npx {CLI_PACKAGE} add
              </code>
              .
            </>
          }
        />

        <Card variant="chrome" animated={false}>
          <CardHeader>
            <CardTitle className="text-base">
              About {meta.label.toLowerCase()}
            </CardTitle>
            <CardDescription>
              How this category fits the Liquid Glass system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            {CATEGORY_SEO_INTRO[category].split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>

        <section aria-labelledby="category-list" className="space-y-4">
          <h2
            id="category-list"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Components
          </h2>
          <Card variant="outline" animated={false}>
            <ul className="divide-y divide-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)]">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/components/${item.slug}`}
                    className="group flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_18%,transparent)] sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="text-sm text-muted-foreground sm:max-w-md sm:text-right">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <Card variant="chrome" animated={false}>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Looking for something else?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/components">Full catalog</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href="/getting-started">Getting started</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Other categories */}
        <section className="space-y-3" aria-labelledby="other-categories">
          <h2
            id="other-categories"
            className="text-sm font-semibold text-foreground"
          >
            Other categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.filter((c) => c !== category).map((c) => (
              <Link
                key={c}
                href={`/categories/${c}`}
                className="inline-flex rounded-full border border-[var(--glass-chrome-border)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {CATEGORY_META[c].label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
