"use client";

import Link from "next/link";
import { Button, Separator } from "@intelli/ui";
import { cn } from "@intelli/utils";
import { getAdjacentItems, type CatalogItem } from "../lib/catalog";

function ChevronLeft() {
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
      className="size-4 shrink-0"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
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
      className="size-4 shrink-0"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function DockLink({
  item,
  direction,
}: {
  item: CatalogItem;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";

  return (
    <Link
      href={`/components/${item.slug}`}
      className={cn(
        "group flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 transition-colors",
        "hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_28%,transparent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
      )}
    >
      {isPrev ? <ChevronLeft /> : null}
      <div className={cn("min-w-0 flex-1", isPrev ? "text-left" : "text-right")}>
        <p className="text-[10px] font-medium text-muted-foreground">
          {isPrev ? "Previous" : "Next"}
        </p>
        <p className="truncate text-sm font-medium text-foreground">
          {item.title}
        </p>
      </div>
      {!isPrev ? <ChevronRight /> : null}
    </Link>
  );
}

type ComponentDockProps = {
  slug: string;
};

export function ComponentDock({ slug }: ComponentDockProps) {
  const { prev, next } = getAdjacentItems(slug);

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Component navigation"
      className="glass-panel sticky bottom-4 z-[var(--z-sticky)] mx-auto mt-12 flex max-w-6xl items-stretch gap-1 rounded-2xl p-1.5 shadow-lg"
    >
      {prev ? (
        <DockLink item={prev} direction="prev" />
      ) : (
        <div className="flex-1" />
      )}

      <Separator orientation="vertical" className="hidden self-stretch sm:block" />

      <Button
        asChild
        variant="ghost"
        size="sm"
        className="hidden shrink-0 self-center sm:inline-flex"
      >
        <Link href="/components">All components</Link>
      </Button>

      {next ? (
        <DockLink item={next} direction="next" />
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
