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
import { Cluster, Grid, Stack } from "@intelli/ui/layout";
import {
  NATIVE_CATALOG,
  NATIVE_CATEGORY_META,
  NATIVE_CATEGORY_ORDER,
  type NativeCatalogItem,
} from "../lib/native-catalog";
import type { ComponentCategory } from "../lib/catalog";

export function NativeCatalogGrid() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ComponentCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return NATIVE_CATALOG.filter((item) => {
      const cat = active === "all" || item.category === active;
      const match =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.slug.includes(q) ||
        item.description.toLowerCase().includes(q);
      return cat && match;
    });
  }, [query, active]);

  const sections = useMemo(() => {
    if (active !== "all") {
      return [[active, filtered] as const];
    }
    return NATIVE_CATEGORY_ORDER.map(
      (category) =>
        [category, filtered.filter((item) => item.category === category)] as const,
    ).filter(([, items]) => items.length > 0);
  }, [active, filtered]);

  return (
    <Stack gap={6}>
      <Stack gap={3}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search native components"
          aria-label="Search native components"
        />
        <Cluster gap={2}>
          <FilterChip
            label="All"
            active={active === "all"}
            onClick={() => setActive("all")}
          />
          {NATIVE_CATEGORY_ORDER.filter((c) =>
            NATIVE_CATALOG.some((item) => item.category === c),
          ).map((category) => (
            <FilterChip
              key={category}
              label={NATIVE_CATEGORY_META[category].label}
              active={active === category}
              onClick={() => setActive(category)}
            />
          ))}
        </Cluster>
      </Stack>

      {filtered.length === 0 ? (
        <Empty variant="outline" animated={false} className="py-14">
          <EmptyHeader>
            <EmptyTitle>No native components match</EmptyTitle>
            <EmptyDescription>
              Try another keyword or show all categories.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery("");
              setActive("all");
            }}
          >
            Clear filters
          </Button>
        </Empty>
      ) : (
        sections.map(([category, items]) => (
          <Stack key={category} gap={3}>
            <h3 className="text-sm font-semibold text-foreground">
              {NATIVE_CATEGORY_META[category].label}
            </h3>
            <Grid cols={1} smCols={2} lgCols={3} gap={3}>
              {items.map((item) => (
                <NativeCard key={item.slug} item={item} />
              ))}
            </Grid>
          </Stack>
        ))
      )}
    </Stack>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex min-h-10 items-center rounded-full border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_64%,transparent)] px-3 text-xs font-medium text-foreground"
          : "inline-flex min-h-10 items-center rounded-full border border-[var(--glass-chrome-border)] bg-[color-mix(in_oklch,var(--glass-surface-fill)_36%,transparent)] px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
      }
    >
      {label}
    </button>
  );
}

function NativeCard({ item }: { item: NativeCatalogItem }) {
  return (
    <Link href={`/native/${item.slug}`} className="min-w-0">
      <Card variant="chrome" animated={false} className="h-full transition-colors hover:border-[color-mix(in_oklch,var(--primary)_25%,var(--glass-chrome-border))]">
        <CardContent className="flex h-full flex-col gap-2 p-4">
          <Cluster gap={2} align="center">
            <span className="font-medium text-foreground">{item.title}</span>
            <Badge variant="secondary" size="sm">
              RN
            </Badge>
          </Cluster>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
