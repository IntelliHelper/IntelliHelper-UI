import Link from "next/link";
import type { ReactNode } from "react";
import { ScrollToTop, Separator } from "@intelli/ui";
import { CATEGORY_META, CATEGORY_ORDER } from "../lib/catalog";
import { GITHUB_URL } from "../lib/seo";
import { BrandLogo } from "./brand-logo";
import { PlaygroundNav } from "./playground-nav";

type PlaygroundShellProps = {
  children: ReactNode;
};

export function PlaygroundShell({ children }: PlaygroundShellProps) {
  return (
    <div className="relative min-h-screen pb-10">
      <PlaygroundNav githubUrl={GITHUB_URL} />

      <main id="main-content" className="mx-auto min-w-0 max-w-6xl px-4 sm:px-6">
        {children}
      </main>

      <footer className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="space-y-3 md:col-span-5">
              <div className="flex items-center gap-2.5">
                <BrandLogo size={30} />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Intelli UI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by IntelliHelper
                  </p>
                </div>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Liquid Glass components for React and Next.js. Install with the
                CLI, own the source, and ship with agent tooling when you need
                it.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
              <div>
                <p className="text-xs font-semibold text-foreground">Product</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-foreground"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/components"
                      className="transition-colors hover:text-foreground"
                    >
                      Components
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
                      href="/guides"
                      className="transition-colors hover:text-foreground"
                    >
                      Guides
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
                      MCP
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground">
                  Categories
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {CATEGORY_ORDER.slice(0, 6).map((category) => (
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

              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold text-foreground">Resources</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-foreground"
                    >
                      GitHub
                    </a>
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
            </div>
          </div>

          <Separator className="my-6" variant="subtle" />

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} IntelliHelper. Open source Liquid
              Glass UI.
            </p>
            <p className="text-muted-foreground/80">
              Built for teams that ship product UI.
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
