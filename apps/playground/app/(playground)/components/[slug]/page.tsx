import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComponentDock } from "../../../../components/component-dock";
import { ComponentExamples } from "../../../../components/component-examples";
import { InstallCommand } from "../../../../components/install-command";
import { JsonLd } from "../../../../components/json-ld";
import {
  CATEGORY_META,
  CATALOG,
  getCatalogItem,
} from "../../../../lib/catalog";
import {
  componentBreadcrumbJsonLd,
  componentPageJsonLd,
} from "../../../../lib/json-ld";
import { createComponentMetadata } from "../../../../lib/seo";

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

  return (
    <>
      <JsonLd
        data={[componentBreadcrumbJsonLd(item), componentPageJsonLd(item)]}
      />
      <article className="mx-auto min-w-0 max-w-4xl pb-4">
        <header className="mb-8 space-y-4">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Components
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-muted-foreground">{category.label}</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium text-foreground">{item.title}</span>
          </nav>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {category.label}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {item.title}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {item.description}
            </p>
          </div>

          <InstallCommand slug={item.slug} />
        </header>

        <ComponentExamples slug={item.slug} />

        <ComponentDock slug={item.slug} />
      </article>
    </>
  );
}