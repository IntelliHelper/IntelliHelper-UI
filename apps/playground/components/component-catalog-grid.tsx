"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Input,
} from "@intelli/ui";
import {
  CATALOG,
  CATEGORY_META,
  type ComponentCategory,
} from "../lib/catalog";

const CATEGORY_ORDER = Object.keys(CATEGORY_META) as ComponentCategory[];

type ComponentCatalogGridProps = {
  initialQuery?: string;
};

export function ComponentCatalogGrid({
  initialQuery = "",
}: ComponentCatalogGridProps) {
  const [activeCategory, setActiveCategory] = useState<
    ComponentCategory | "all"
  >("all");
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return CATALOG.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesQuery =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        item.slug.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const sections = useMemo(() => {
    if (activeCategory !== "all") {
      return [[activeCategory, filtered] as const];
    }

    return CATEGORY_ORDER.map(
      (category) =>
        [
          category,
          filtered.filter((item) => item.category === category),
        ] as const,
    ).filter(([, items]) => items.length > 0);
  }, [activeCategory, filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by name or keyword…"
          aria-label="Filter components"
          className="h-10 w-full max-w-md sm:flex-1"
        />
        <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
          {filtered.length} component{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div
        className="flex flex-wrap gap-1.5"
        role="tablist"
        aria-label="Filter by category"
      >
        <Button
          type="button"
          size="sm"
          shape="pill"
          variant={activeCategory === "all" ? "default" : "ghost"}
          onClick={() => setActiveCategory("all")}
          aria-pressed={activeCategory === "all"}
        >
          All
        </Button>
        {CATEGORY_ORDER.map((category) => (
          <Button
            key={category}
            type="button"
            size="sm"
            shape="pill"
            variant={activeCategory === category ? "default" : "ghost"}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {CATEGORY_META[category].label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty variant="outline" animated={false} className="py-14">
          <EmptyHeader>
            <EmptyTitle>No matches</EmptyTitle>
            <EmptyDescription>
              Try another keyword or clear the category filter.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setActiveCategory("all");
            }}
          >
            Clear filters
          </Button>
        </Empty>
      ) : (
        <div className="space-y-10">
          {sections.map(([category, items]) => (
            <section key={category} className="space-y-4">
              {activeCategory === "all" ? (
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {CATEGORY_META[category].label}
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {CATEGORY_META[category].description}
                    </p>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {items.length}
                  </Badge>
                </div>
              ) : null}

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/components/${item.slug}`}
                      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      <Card
                        variant="outline"
                        animated={false}
                        className="h-full transition-[border-color,background,box-shadow] duration-200 group-hover:border-[color-mix(in_oklch,var(--primary)_28%,var(--glass-chrome-border))] group-hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_22%,transparent)] group-focus-visible:border-[color-mix(in_oklch,var(--primary)_28%,var(--glass-chrome-border))]"
                      >
                        <CardContent className="flex h-full flex-col p-4">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {item.title}
                            </span>
                            {activeCategory === "all" ? null : (
                              <Badge
                                variant="outline"
                                size="sm"
                                className="shrink-0"
                              >
                                {CATEGORY_META[item.category].label}
                              </Badge>
                            )}
                          </div>
                          <span className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                            {item.description}
                          </span>
                          <span className="mt-4 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                            Open →
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
