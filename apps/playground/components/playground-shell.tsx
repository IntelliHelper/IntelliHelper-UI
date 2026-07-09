import Link from "next/link";
import type { ReactNode } from "react";
import { ScrollToTop } from "@intelli/ui";
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

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/getting-started"
            className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)] hover:text-foreground md:inline-block"
          >
            Getting started
          </Link>
          <ComponentSearch />
          <ThemeToggle />
        </nav>
      </header>

      <div className="mx-auto min-w-0 max-w-6xl px-4 sm:px-6">{children}</div>

      <ScrollToTop />
    </div>
  );
}