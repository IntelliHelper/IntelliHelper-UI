"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@intelli/ui";
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

function CommandIcon() {
  return (
    <kbd className="hidden rounded-md border border-border/60 bg-background/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
      ⌘K
    </kbd>
  );
}

type ComponentSearchProps = {
  onNavigate?: () => void;
};

export function ComponentSearch({ onNavigate }: ComponentSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
    onNavigate?.();
  }, [onNavigate]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

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
        <span className="hidden sm:inline">Find a component</span>
        <CommandIcon />
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center bg-background/60 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={close}
          role="presentation"
        >
          <div
            className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-label="Search components"
          >
            <div className="flex items-center gap-3 border-b border-[var(--glass-chrome-border)] px-4 py-3">
              <SearchIcon />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, category, or keyword…"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <Button type="button" variant="ghost" size="sm" onClick={close}>
                Esc
              </Button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No components match &ldquo;{query}&rdquo;
                </p>
              ) : (
                Array.from(grouped.entries()).map(([category, items]) => (
                  <div key={category} className="mb-2">
                    <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {category}
                    </p>
                    <ul>
                      {items.map((item) => (
                        <li key={item.slug}>
                          <Link
                            href={`/components/${item.slug}`}
                            onClick={close}
                            className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-[color-mix(in_oklch,var(--glass-surface-fill)_30%,transparent)]"
                          >
                            <span className="text-sm font-medium text-foreground">
                              {item.title}
                            </span>
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}