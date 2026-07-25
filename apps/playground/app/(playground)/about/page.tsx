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
import { GithubStars } from "../../../components/github-stars";
import { JsonLd } from "../../../components/json-ld";
import { PageHeader } from "../../../components/page-header";
import { CATALOG } from "../../../lib/catalog";
import {
  absoluteUrl,
  AGENT_SKILLS_URL,
  BRAND_NAME,
  createPageMetadata,
  GITHUB_URL,
  SITE_CONTENT_DATES,
  SITE_NAME,
  SITE_URL,
} from "../../../lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = createPageMetadata({
  title: "About Intelli UI — Liquid Glass by IntelliHelper",
  description:
    "Meet the team behind Intelli UI: an open-source Liquid Glass React component library for Next.js and Tailwind. Maintainer, mission, and how to contribute.",
  path: "/about",
  keywords: [
    "about intelli ui",
    "intellihelper team",
    "liquid glass maintainers",
    "open source react ui",
  ],
});

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#webpage`,
      name: `About ${SITE_NAME}`,
      description:
        "About Intelli UI by IntelliHelper — Liquid Glass React components, CLI, and agent tooling.",
      url: absoluteUrl("/about"),
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#software` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
      datePublished: SITE_CONTENT_DATES.published,
      dateModified: SITE_CONTENT_DATES.modified,
    },
    {
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
          name: "About",
          item: absoluteUrl("/about"),
        },
      ],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/about#maintainer`,
      name: "Adeeb Mirza",
      url: "https://github.com/adeebmirza",
      jobTitle: "Creator & maintainer",
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: ["https://github.com/adeebmirza"],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <div className="mx-auto max-w-3xl space-y-10 pb-10">
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
          meta={
            <span className="inline-flex flex-wrap items-center gap-2">
              <Badge variant="secondary" size="sm">
                Open source
              </Badge>
              <Badge variant="outline" size="sm">
                MIT
              </Badge>
              <span className="text-xs text-muted-foreground">
                Updated {SITE_CONTENT_DATES.modified}
              </span>
            </span>
          }
          title="About Intelli UI"
          description={
            <>
              <strong className="font-medium text-foreground">
                Intelli UI is a free, open-source Liquid Glass component library
                for React and Next.js
              </strong>{" "}
              from{" "}
              <strong className="font-medium text-foreground">{BRAND_NAME}</strong>
              . It ships {CATALOG.length}+ components, a CLI that copies source
              into your repo, five themes, and agent tooling (plugin + MCP) so
              product teams own frosted UI without black-box kits.
            </>
          }
          actions={
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="primary" size="sm">
                <Link href="/getting-started">Get started</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            </div>
          }
        />

        <section aria-labelledby="definition-heading" className="space-y-4">
          <h2
            id="definition-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            What is Intelli UI?
          </h2>
          <Card variant="chrome" animated={false}>
            <CardContent className="space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                Intelli UI is Liquid Glass first — chrome vs content layers,
                frosted primitives, and five themes (mono, aurora, sunset, frost,
                ocean) so product UI looks intentional on day one. The CLI copies
                TypeScript components into your repository under an MIT-friendly
                ownership model, the same install pattern teams know from
                shadcn-style registries, with glass hierarchy and agent-native
                tooling included.
              </p>
              <p>
                Use Intelli UI when you want glassmorphism that stays readable:
                neutral chrome above expressive content, accessible Radix-based
                primitives, live docs with install commands, and MCP/plugin
                support for Claude, Grok, Cursor, and other coding agents.
              </p>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="mission-heading" className="space-y-4">
          <h2
            id="mission-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Mission
          </h2>
          <Card variant="chrome" animated={false}>
            <CardContent className="space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                Product teams should not choose between{" "}
                <strong className="font-medium text-foreground">
                  flat, generic defaults
                </strong>{" "}
                and{" "}
                <strong className="font-medium text-foreground">
                  locked design systems
                </strong>
                . Intelli UI ships a glass-first system (chrome vs content),{" "}
                {CATALOG.length}+ components, themes, and the same copy-paste
                ownership model developers already know from shadcn-style
                workflows.
              </p>
              <p>
                We also invest in{" "}
                <strong className="font-medium text-foreground">
                  AI coding agents
                </strong>
                : an official plugin, MCP server, and docs that agents can
                follow so installs stay correct instead of inventing frosted CSS
                from scratch. The goal is less tab-hopping between Storybook,
                npm, and half-finished glass CSS recipes.
              </p>
              <p>
                Open source means transparent roadmap and contribution paths:
                issues, pull requests, and showcases on GitHub shape what ships
                next — components, themes, and agent skills included.
              </p>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="team-heading" className="space-y-4">
          <h2
            id="team-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Team
          </h2>
          <ul className="grid gap-3">
            <li>
              <Card variant="outline" animated={false}>
                <CardHeader className="p-5 pb-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">Adeeb Mirza</CardTitle>
                      <CardDescription className="mt-1">
                        Creator &amp; maintainer · IntelliHelper
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" size="sm">
                      Lead
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-2 text-sm text-muted-foreground">
                  <p>
                    Designs and ships the Liquid Glass system, playground,
                    registry, CLI, and agent plugin for Intelli UI.
                  </p>
                  <a
                    href="https://github.com/adeebmirza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    github.com/adeebmirza →
                  </a>
                </CardContent>
              </Card>
            </li>
            <li>
              <Card variant="outline" animated={false}>
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-base">IntelliHelper</CardTitle>
                  <CardDescription className="mt-1">
                    Open-source organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-2 text-sm text-muted-foreground">
                  <p>
                    Home of Intelli UI, the agent-skills plugin, and related
                    tooling. Contributions welcome via pull requests and issues.
                  </p>
                  <a
                    href="https://github.com/IntelliHelper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    github.com/IntelliHelper →
                  </a>
                </CardContent>
              </Card>
            </li>
          </ul>
        </section>

        <section aria-labelledby="social-proof-heading" className="space-y-4">
          <h2
            id="social-proof-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Project status
          </h2>
          <Card variant="chrome" animated={false}>
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  GitHub · IntelliHelper-UI
                </p>
                <p className="text-sm text-muted-foreground">
                  Stars help others discover the project. Issues and PRs shape
                  the roadmap.
                </p>
                <GithubStars className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-foreground underline-offset-4 hover:underline" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Repository
                  </a>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <a
                    href={AGENT_SKILLS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Agent skills
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="built-with-heading" className="space-y-4">
          <h2
            id="built-with-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Built with Intelli UI
          </h2>
          <Card variant="outline" animated={false}>
            <CardContent className="space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
              <p>
                This documentation site is the flagship showcase: Liquid Glass
                chrome, live component stages, and catalog pages are composed
                from the same registry you install with{" "}
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                  npx @intellihelper/cli add
                </code>
                .
              </p>
              <p>
                Shipping a product with Intelli UI? Open an issue on GitHub with
                a link and we will consider featuring it here and in the
                community.
              </p>
              <Button asChild variant="primary" size="sm" className="mt-1">
                <Link href="/components">Browse the catalog</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="contact-heading" className="space-y-4">
          <h2
            id="contact-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Contact &amp; contribute
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/getting-started"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Getting started
              </Link>{" "}
              — install CLI, plugin, or MCP
            </li>
            <li>
              <a
                href={`${GITHUB_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                GitHub issues
              </a>{" "}
              — bugs, ideas, and showcases
            </li>
            <li>
              <a
                href="https://github.com/IntelliHelper/IntelliHelper-UI/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Contributing guide
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
