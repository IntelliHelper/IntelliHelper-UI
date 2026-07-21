import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "../../../../components/json-ld";
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
        data={[
          guideBreadcrumbJsonLd(guide),
          guideArticleJsonLd(guide),
        ]}
      />
      <article className="mx-auto max-w-3xl space-y-8 pb-8">
        <header className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <Link
              href="/guides"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Guides
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium text-foreground line-clamp-1">
              {guide.title}
            </span>
          </nav>

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Guide · {guide.readingMinutes} min read · Updated{" "}
            {guide.dateModified}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {guide.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            {guide.description}
          </p>
        </header>

        <div className="space-y-10">
          {guide.sections.map((section) => (
            <section
              key={section.heading}
              className="space-y-3"
              aria-labelledby={section.heading
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}
            >
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
                <pre className="glass-panel overflow-x-auto rounded-xl p-4 text-xs leading-relaxed text-foreground">
                  <code>{section.code}</code>
                </pre>
              ) : null}
            </section>
          ))}
        </div>

        <aside className="glass-panel space-y-3 rounded-2xl p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Ship it</p>
          <p>
            <Link
              href="/getting-started"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Getting started
            </Link>{" "}
            ·{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Component catalog
            </Link>{" "}
            ·{" "}
            <Link
              href="/guides"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              All guides
            </Link>
          </p>
        </aside>

        {related.length > 0 ? (
          <section aria-labelledby="related-guides" className="space-y-3">
            <h2
              id="related-guides"
              className="text-lg font-semibold text-foreground"
            >
              Related guides
            </h2>
            <ul className="space-y-2">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {g.title}
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
