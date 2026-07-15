/**
 * Pure helpers for Command list ordering.
 * Keyboard highlight indices and DOM order must share the same flat sequence.
 */

export type GroupableCommandItem = {
  group?: string;
};

export type CommandGroupBucket<T> = {
  key: string;
  items: T[];
};

export type OrderedCommandItems<T> = {
  /** Groups in first-seen group-key order; items keep filter order within group. */
  groups: CommandGroupBucket<T>[];
  /** Flattened list: group1 items, then group2 items, … — use for highlight + Enter. */
  flat: T[];
};

/**
 * Reorder filtered items so group rendering and keyboard navigation agree.
 * Interleaved source groups (B, A, B) become B-items then A-items, matching Map paint order.
 */
export function orderCommandItemsByGroup<T extends GroupableCommandItem>(
  items: readonly T[],
): OrderedCommandItems<T> {
  const map = new Map<string, T[]>();

  for (const item of items) {
    const key = item.group ?? "";
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }

  const groups: CommandGroupBucket<T>[] = [];
  for (const [key, groupItems] of map.entries()) {
    groups.push({ key, items: groupItems });
  }

  const flat = groups.flatMap((group) => group.items);
  return { groups, flat };
}
