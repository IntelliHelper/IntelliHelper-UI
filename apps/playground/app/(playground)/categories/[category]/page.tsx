import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "../../../../components/json-ld";
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
            name: `${meta.label} Components`,
            description: meta.description,
            path: `/categories/${category}`,
            type: "CollectionPage",
          }),
        ]}
      />
      <div className="mx-auto max-w-4xl space-y-8 pb-8">
        <header className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Components
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium text-foreground">{meta.label}</span>
          </nav>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Category
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {meta.label} components
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {meta.description}. {items.length} Liquid Glass React component
              {items.length === 1 ? "" : "s"} for Next.js and Tailwind CSS —
              install with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                npx {CLI_PACKAGE} add
              </code>
              .
            </p>
          </div>
        </header>

        <section className="glass-panel rounded-2xl p-6" aria-labelledby="category-list">
          <h2 id="category-list" className="text-lg font-semibold text-foreground">
            All {meta.label.toLowerCase()} components
          </h2>
          <ul className="mt-5 divide-y divide-border/60">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/components/${item.slug}`}
                  className="group flex flex-col gap-1 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium text-foreground group-hover:text-primary">
                    {item.title}
                  </span>
                  <span className="text-sm text-muted-foreground sm:max-w-md sm:text-right">
                    {item.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <aside className="glass-panel rounded-2xl p-6 text-sm text-muted-foreground">
          <p>
            Looking for something else?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Browse the full catalog
            </Link>{" "}
            or read the{" "}
            <Link
              href="/getting-started"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              getting started guide
            </Link>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
