/**
 * Pure text filtering shared by Combobox and Command.
 * Exported for unit tests and consumer composition.
 */

export type FilterableItem = {
  value: string;
  label: string;
  keywords?: readonly string[];
  disabled?: boolean;
};

/**
 * Case-insensitive filter: matches if query is empty, or appears in
 * label, value, or any keyword.
 */
export function filterItems<T extends FilterableItem>(
  items: readonly T[],
  query: string,
): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...items];
  }

  return items.filter((item) => {
    if (item.label.toLowerCase().includes(normalized)) {
      return true;
    }
    if (item.value.toLowerCase().includes(normalized)) {
      return true;
    }
    return (item.keywords ?? []).some((keyword) =>
      keyword.toLowerCase().includes(normalized),
    );
  });
}

/**
 * Resolve the display label for a selected value, or the value itself.
 */
export function resolveItemLabel(
  items: readonly FilterableItem[],
  value: string | undefined | null,
): string {
  if (value == null || value === "") {
    return "";
  }
  const match = items.find((item) => item.value === value);
  return match?.label ?? value;
}
