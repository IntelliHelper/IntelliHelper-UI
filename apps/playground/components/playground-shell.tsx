import Link from "next/link";
import type { ReactNode } from "react";
import { ScrollToTop } from "@intelli/ui";
import { CATEGORY_META, CATEGORY_ORDER } from "../lib/catalog";
import { GITHUB_URL } from "../lib/seo";
import { BrandLogo } from "./brand-logo";
import { ComponentSearch } from "./component-search";
import { ThemeToggle } from "./theme-toggle";

type PlaygroundShellProps = {
  children: ReactNode;
};

export function PlaygroundShell({ children }: PlaygroundShellProps) {
  return (
    <div className="relative min-h-screen pb-8">
      <header className="glass-header sticky top-4 z-[var(--z-sticky)] mx-auto mb-8 flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <BrandLogo size={40} className="shrink-0" />
          <div className="min-w-0">
            <p className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
              Intelli UI
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Liquid Glass component library
            </p>
          </div>
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-2 sm:gap-3"
        >
          <Link
            href="/getting-started"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)] hover:text-foreground md:inline-block"
          >
            Getting started
          </Link>
          <Link
            href="/getting-started#plugin"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)] hover:text-foreground lg:inline-block"
          >
            Agent plugin
          </Link>
          <Link
            href="/sitemap"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)] hover:text-foreground xl:inline-block"
          >
            Sitemap
          </Link>
          <ComponentSearch />
          <ThemeToggle />
        </nav>
      </header>

      <main id="main-content" className="mx-auto min-w-0 max-w-6xl px-4 sm:px-6">
        {children}
      </main>

      <footer className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BrandLogo size={32} />
                <p className="font-semibold text-foreground">Intelli UI</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Liquid Glass React components for Next.js and Tailwind. Copy,
                customize, and ship — with CLI, agent plugin, and MCP for AI
                agents.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Explore</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="transition-colors hover:text-foreground"
                  >
                    Component catalog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/getting-started"
                    className="transition-colors hover:text-foreground"
                  >
                    Getting started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/getting-started#plugin"
                    className="transition-colors hover:text-foreground"
                  >
                    Agent plugin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/getting-started#mcp"
                    className="transition-colors hover:text-foreground"
                  >
                    MCP for agents
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="transition-colors hover:text-foreground"
                  >
                    Sitemap
                  </Link>
                </li>
                <li>
                  <a
                    href="/llms.txt"
                    className="transition-colors hover:text-foreground"
                  >
                    llms.txt
                  </a>
                </li>
                <li>
                  <a
                    href="/rss.xml"
                    className="transition-colors hover:text-foreground"
                  >
                    RSS
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">Categories</p>
              <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {CATEGORY_ORDER.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/categories/${category}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {CATEGORY_META[category].label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} IntelliHelper. Open source Liquid
              Glass UI.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
