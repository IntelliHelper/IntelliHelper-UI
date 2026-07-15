/**
 * Lightweight fuzzy scoring for component search.
 * Prefer this over heavy search libraries to keep the CLI lean.
 */

export type SearchableItem = {
  name: string;
  title?: string;
  description?: string;
  category?: string;
  type?: string;
  meta?: Record<string, unknown>;
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[\s\-_/]+/)
    .filter(Boolean);
}

/**
 * Score how well an item matches a query. Higher is better.
 * Returns 0 when there is no meaningful match.
 */
export function scoreItem(item: SearchableItem, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(item.name);
  const title = normalize(item.title ?? "");
  const description = normalize(item.description ?? "");
  const category = normalize(item.category ?? "");
  const metaText = item.meta
    ? normalize(
        Object.values(item.meta)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .map(String)
          .join(" "),
      )
    : "";

  let score = 0;

  if (name === q || title === q) score += 100;
  if (name.startsWith(q) || title.startsWith(q)) score += 50;
  if (name.includes(q)) score += 30;
  if (title.includes(q)) score += 25;
  if (category.includes(q)) score += 20;
  if (description.includes(q)) score += 15;
  if (metaText.includes(q)) score += 10;

  const queryTokens = tokens(q);
  const haystack = `${name} ${title} ${description} ${category} ${metaText}`;
  const hayTokens = new Set(tokens(haystack));

  for (const token of queryTokens) {
    if (hayTokens.has(token)) score += 8;
    else if ([...hayTokens].some((t) => t.includes(token) || token.includes(t))) {
      score += 3;
    }
  }

  return score;
}

export function searchItems<T extends SearchableItem>(
  items: T[],
  query: string,
): T[] {
  const ranked = items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  return ranked.map((entry) => entry.item);
}

export function paginate<T>(
  items: T[],
  options: { limit?: number; offset?: number } = {},
): { items: T[]; total: number; limit: number; offset: number; hasMore: boolean } {
  const offset = Math.max(0, options.offset ?? 0);
  const limit =
    options.limit === 0
      ? items.length
      : Math.max(0, options.limit ?? 100);

  const slice = items.slice(offset, limit === 0 ? undefined : offset + limit);

  return {
    items: slice,
    total: items.length,
    limit: options.limit ?? 100,
    offset,
    hasMore: offset + slice.length < items.length,
  };
}
