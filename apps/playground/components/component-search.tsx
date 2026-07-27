"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@intelli/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  type CommandItemData,
} from "@intelli/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@intelli/ui/dialog";
import { Kbd } from "@intelli/ui/kbd";
import { filterItems } from "@intelli/ui/filter-items";
import { cn } from "@intelli/utils";
import { CATALOG, CATEGORY_META } from "../lib/catalog";

type ComponentSearchProps = {
  onNavigate?: () => void;
};

/**
 * Solid, non-sampling surface + placement that wins over DialogContent’s
 * default center (`top-1/2 -translate-y-1/2`). Tailwind v4 uses the `translate`
 * CSS property, so style.transform alone does not cancel those utilities.
 */
const dialogSurfaceStyle = {
  backgroundColor: "var(--background)",
  backgroundImage: "none",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
  top: "min(12vh, 5.5rem)",
  left: "50%",
  translate: "-50% 0",
  transform: "none",
  width: "min(36rem, calc(100vw - 2rem))",
  maxHeight: "min(36rem, calc(100vh - 2rem))",
} as const;

const solidFillStyle = {
  backgroundColor: "var(--background)",
  backgroundImage: "none",
  backdropFilter: "none",
  WebkitBackdropFilter: "none",
} as const;

export function ComponentSearch({ onNavigate }: ComponentSearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const items = useMemo<CommandItemData[]>(
    () =>
      CATALOG.map((item) => ({
        value: item.slug,
        label: item.title,
        description: item.description,
        group: CATEGORY_META[item.category].label,
        keywords: [
          item.slug,
          item.category,
          CATEGORY_META[item.category].label,
          item.description,
        ],
        onSelect: () => {
          router.push(`/components/${item.slug}`);
          onNavigate?.();
        },
      })),
    [router, onNavigate],
  );

  const resultCount = useMemo(
    () => filterItems(items, query).length,
    [items, query],
  );

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuery("");
    }
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => {
          const next = !current;
          if (!next) setQuery("");
          return next;
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        shape="pill"
        className="h-9 gap-2 px-3 text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search components"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Search</span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showClose={false}
          size="default"
          animated={false}
          overlayDim="heavy"
          overlayBlur="xl"
          style={dialogSurfaceStyle}
          className={cn(
            // Cancel DialogContent center placement (tw-merge + inline style)
            "top-[min(12vh,5.5rem)] left-1/2 w-[min(36rem,calc(100vw-2rem))] max-w-none",
            "max-h-[min(36rem,calc(100vh-2rem))] -translate-x-1/2 translate-y-0",
            // Layout: flex column so list scrolls between input and footer
            "flex flex-col gap-0 overflow-hidden border border-[var(--glass-chrome-border)] p-0 shadow-2xl",
          )}
        >
          <DialogTitle className="sr-only">Search components</DialogTitle>
          <DialogDescription className="sr-only">
            Filter the component catalog by name, category, or description.
          </DialogDescription>

          <Command
            items={items}
            value={query}
            onValueChange={setQuery}
            onItemSelect={() => handleOpenChange(false)}
            emptyMessage="No components match your search."
            style={solidFillStyle}
            className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-0 shadow-none"
          >
            <div
              className="relative shrink-0 [&_[data-slot=command-input-wrap]]:pr-12"
              style={solidFillStyle}
            >
              <CommandInput placeholder="Search components…" />
              <Kbd className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2">
                Esc
              </Kbd>
            </div>

            <CommandList
              emptyMessage="No components match your search."
              className="max-h-none min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background p-2 pb-3"
            />

            <div
              className="flex shrink-0 items-center gap-3 border-t border-[var(--glass-chrome-border)] px-4 py-2.5 text-[11px] text-muted-foreground"
              style={solidFillStyle}
            >
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
                {resultCount} result{resultCount === 1 ? "" : "s"}
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
