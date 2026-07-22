"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Empty, EmptyDescription, EmptyHeader, EmptyTitle, Kbd } from "@intelli/ui";
import { CATALOG, CATEGORY_META, type CatalogItem } from "../lib/catalog";

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

type ComponentSearchProps = {
  onNavigate?: () => void;
};

export function ComponentSearch({ onNavigate }: ComponentSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return CATALOG;

    return CATALOG.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.slug.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        CATEGORY_META[item.category].label.toLowerCase().includes(normalized),
    );
  }, [query]);

  const flatResults = results;
  const grouped = useMemo(() => {
    const map = new Map<string, CatalogItem[]>();
    for (const item of results) {
      const label = CATEGORY_META[item.category].label;
      const group = map.get(label) ?? [];
      group.push(item);
      map.set(label, group);
    }
    return map;
  }, [results]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    onNavigate?.();
  }, [onNavigate]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
        setActiveIndex(0);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-search-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(flatResults.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && flatResults[activeIndex]) {
      event.preventDefault();
      const item = flatResults[activeIndex];
      close();
      window.location.href = `/components/${item.slug}`;
    }
  }

  let runningIndex = -1;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        shape="pill"
        className="h-9 gap-2 px-3 text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search components"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Search</span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center bg-background/55 p-4 pt-[10vh] backdrop-blur-sm sm:pt-[12vh]"
          onClick={close}
          role="presentation"
        >
          <div
            className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search components"
          >
            <div className="flex items-center gap-3 border-b border-[var(--glass-chrome-border)] px-4 py-3">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search components…"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-autocomplete="list"
                aria-controls="component-search-results"
              />
              <Kbd>Esc</Kbd>
            </div>

            <div
              id="component-search-results"
              ref={listRef}
              className="max-h-[min(50vh,22rem)] overflow-y-auto p-2"
              role="listbox"
            >
              {results.length === 0 ? (
                <Empty variant="outline" animated={false} className="border-0 py-10">
                  <EmptyHeader>
                    <EmptyTitle>No results</EmptyTitle>
                    <EmptyDescription>
                      Nothing matches &ldquo;{query}&rdquo;. Try a category name
                      or slug.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                Array.from(grouped.entries()).map(([category, items]) => (
                  <div key={category} className="mb-1.5">
                    <p className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                      {category}
                    </p>
                    <ul>
                      {items.map((item) => {
                        runningIndex += 1;
                        const index = runningIndex;
                        const isActive = index === activeIndex;
                        return (
                          <li key={item.slug} role="option" aria-selected={isActive}>
                            <Link
                              href={`/components/${item.slug}`}
                              data-search-index={index}
                              onClick={close}
                              onMouseEnter={() => setActiveIndex(index)}
                              className={
                                isActive
                                  ? "flex flex-col gap-0.5 rounded-xl bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] px-3 py-2.5"
                                  : "flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_24%,transparent)]"
                              }
                            >
                              <span className="text-sm font-medium text-foreground">
                                {item.title}
                              </span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-[var(--glass-chrome-border)] px-4 py-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <Kbd>↵</Kbd>
                open
              </span>
              <span className="ml-auto tabular-nums">
                {results.length} result{results.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
