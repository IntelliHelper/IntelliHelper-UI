"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@intelli/ui";
import {
  CATALOG,
  CATEGORY_META,
  getCatalogByCategory,
  type ComponentCategory,
} from "../lib/catalog";

const CATEGORY_ORDER = Object.keys(CATEGORY_META) as ComponentCategory[];

export function ComponentCatalogGrid() {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | "all">(
    "all",
  );
  const [query, setQuery] = useState("");

  const grouped = getCatalogByCategory();

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
        [category, filtered.filter((item) => item.category === category)] as const,
    ).filter(([, items]) => items.length > 0);
  }, [activeCategory, filtered]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter components…"
          aria-label="Filter components"
          className="h-10 w-full max-w-md rounded-xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_18%,transparent)] px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40 sm:flex-1"
        />
        <p className="text-sm text-muted-foreground">
          {filtered.length} component{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          shape="pill"
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        {CATEGORY_ORDER.map((category) => (
          <Button
            key={category}
            type="button"
            size="sm"
            shape="pill"
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
          >
            {CATEGORY_META[category].label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--glass-chrome-border)] px-6 py-16 text-center text-sm text-muted-foreground">
          No components match your filters.
        </p>
      ) : (
        <div className="space-y-10">
          {sections.map(([category, items]) => (
            <section key={category} className="space-y-4">
              {activeCategory === "all" ? (
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {CATEGORY_META[category].label}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {CATEGORY_META[category].description}
                  </p>
                </div>
              ) : null}

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/components/${item.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_16%,transparent)] p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--glass-chrome-shadow)]"
                    >
                      <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </span>
                      <span className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </span>
                      <span className="mt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                        View examples →
                      </span>
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