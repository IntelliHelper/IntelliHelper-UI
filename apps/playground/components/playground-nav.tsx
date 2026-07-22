"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@intelli/ui";
import { cn } from "@intelli/utils";
import { CATEGORY_META, CATEGORY_ORDER } from "../lib/catalog";
import { BrandLogo } from "./brand-logo";
import { ComponentSearch } from "./component-search";
import { ThemeToggle } from "./theme-toggle";

const PRIMARY_LINKS = [
  {
    href: "/",
    label: "Home",
    match: (path: string) => path === "/",
  },
  {
    href: "/components",
    label: "Components",
    match: (path: string) =>
      path.startsWith("/components") || path.startsWith("/categories"),
  },
  {
    href: "/getting-started",
    label: "Docs",
    match: (path: string) => path.startsWith("/getting-started"),
  },
  {
    href: "/guides",
    label: "Guides",
    match: (path: string) => path.startsWith("/guides"),
  },
] as const;

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-4"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="size-4"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  );
}

type PlaygroundNavProps = {
  githubUrl: string;
};

export function PlaygroundNav({ githubUrl }: PlaygroundNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-header sticky top-3 z-[var(--z-sticky)] mx-auto mb-8 flex max-w-6xl items-center gap-3 rounded-2xl px-3 py-2.5 sm:top-4 sm:mb-10 sm:gap-4 sm:px-4 sm:py-3">
      <Link
        href="/"
        className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <BrandLogo size={36} className="shrink-0" />
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-tight text-foreground sm:text-base">
            Intelli UI
          </p>
          <p className="hidden text-[11px] leading-none text-muted-foreground sm:block">
            Liquid Glass
          </p>
        </div>
      </Link>

      <nav
        aria-label="Primary"
        className="ml-1 hidden items-center gap-0.5 md:flex"
      >
        {PRIMARY_LINKS.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[color-mix(in_oklch,var(--glass-surface-fill)_32%,transparent)] text-foreground"
                  : "text-muted-foreground hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <ComponentSearch />
        <ThemeToggle />
        <Button
          asChild
          variant="ghost"
          size="icon"
          shape="pill"
          className="hidden sm:inline-flex"
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
          >
            <GithubIcon />
          </a>
        </Button>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              shape="pill"
              className="md:hidden"
              aria-label="Open menu"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" size="sm" className="gap-0 p-0">
            <SheetHeader className="border-b border-[var(--glass-chrome-border)] px-5 py-4 text-left">
              <SheetTitle className="flex items-center gap-2.5 text-base">
                <BrandLogo size={28} />
                Intelli UI
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
              <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Navigate
              </p>
              <nav className="flex flex-col gap-0.5" aria-label="Mobile primary">
                {PRIMARY_LINKS.map((link) => {
                  const active = link.match(pathname);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] text-foreground"
                          : "text-muted-foreground hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  href="/getting-started#plugin"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] hover:text-foreground"
                >
                  Agent plugin
                </Link>
              </nav>

              <Separator className="my-4" variant="subtle" />

              <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Categories
              </p>
              <ul className="grid grid-cols-1 gap-0.5">
                {CATEGORY_ORDER.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/categories/${category}`}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] hover:text-foreground"
                    >
                      {CATEGORY_META[category].label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Separator className="my-4" variant="subtle" />

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_20%,transparent)] hover:text-foreground"
              >
                <GithubIcon />
                GitHub
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
