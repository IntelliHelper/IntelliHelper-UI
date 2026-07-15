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
      <article className="mx-auto min-w-0 max-w-4xl pb-4">
        <header className="mb-8 space-y-4">
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
            <Link
              href={`/categories/${item.category}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {category.label}
            </Link>
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
              {item.description} Built as a Liquid Glass React component for
              Next.js and Tailwind CSS — copy the source into your app and own
              every variant.
            </p>
          </div>

          <InstallCommand slug={item.slug} />
        </header>

        <ComponentExamples slug={item.slug} />

        <section
          className="mt-10 space-y-4"
          aria-labelledby="component-overview"
        >
          <h2
            id="component-overview"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            About this component
          </h2>
          <div className="glass-panel space-y-3 rounded-2xl p-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              The <strong className="text-foreground">{item.title}</strong>{" "}
              component is part of the{" "}
              <Link
                href={`/categories/${item.category}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {category.label}
              </Link>{" "}
              category in Intelli UI. {item.description}
            </p>
            <p>
              Install it with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                npx {CLI_PACKAGE}@latest add {item.slug}
              </code>
              . Files land in your project so you can customize styles, variants,
              and behavior without fighting a locked package.
            </p>
            <p>
              Prefer AI-assisted install? Install the official{" "}
              <Link
                href="/getting-started#plugin"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                agent plugin
              </Link>{" "}
              or connect the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                intellihelper-ui
              </code>{" "}
              MCP server from the{" "}
              <Link
                href="/getting-started#mcp"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                getting started guide
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mt-10 space-y-4" aria-labelledby="component-faq">
          <h2
            id="component-faq"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            FAQ
          </h2>
          <dl className="glass-panel space-y-5 rounded-2xl p-6">
            <div>
              <dt className="font-medium text-foreground">
                How do I install {item.title}?
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Run{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                  npx {CLI_PACKAGE}@latest add {item.slug}
                </code>{" "}
                after initializing IntelliHelper UI in your Next.js project.
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">
                What is {item.title} used for?
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">
                Does {item.title} work with Next.js and Tailwind?
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Yes. It is designed for React, Next.js, and Tailwind CSS with
                Liquid Glass tokens and chrome variants you can edit locally.
              </dd>
            </div>
          </dl>
        </section>

        {related.length > 0 ? (
          <section
            className="mt-10 space-y-4"
            aria-labelledby="related-components"
          >
            <h2
              id="related-components"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Related {category.label.toLowerCase()} components
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    href={`/components/${rel.slug}`}
                    className="glass-panel block rounded-2xl p-4 transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)]"
                  >
                    <p className="font-medium text-foreground">{rel.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {rel.description}
                    </p>
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
