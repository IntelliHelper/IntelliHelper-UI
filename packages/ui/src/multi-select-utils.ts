/**
 * Pure multi-select value helpers — shared by MultiSelect and tests.
 */

export type MultiSelectOption = {
  value: string;
  label: string;
  keywords?: readonly string[];
  disabled?: boolean;
  description?: string;
};

/**
 * Toggle a value in a multi-select list. Disabled options are ignored when
 * present in `disabledValues`. Empty string values are never added.
 */
export function toggleMultiSelectValue(
  values: readonly string[],
  next: string,
  options?: { disabledValues?: readonly string[]; max?: number },
): string[] {
  if (!next) {
    return [...values];
  }
  if (options?.disabledValues?.includes(next)) {
    return [...values];
  }
  if (values.includes(next)) {
    return values.filter((value) => value !== next);
  }
  if (options?.max != null && values.length >= options.max) {
    return [...values];
  }
  return [...values, next];
}

/** Remove one value from the selection. */
export function removeMultiSelectValue(
  values: readonly string[],
  target: string,
): string[] {
  return values.filter((value) => value !== target);
}

/** Clear all selected values. */
export function clearMultiSelectValues(): string[] {
  return [];
}

/**
 * Resolve display labels for selected values in selection order.
 * Falls back to the raw value when no option matches.
 */
export function resolveMultiSelectLabels(
  options: readonly MultiSelectOption[],
  values: readonly string[],
): string[] {
  return values.map((value) => {
    const match = options.find((option) => option.value === value);
    return match?.label ?? value;
  });
}

/** True when every listed value is present in the selection. */
export function areAllSelected(
  values: readonly string[],
  candidates: readonly string[],
): boolean {
  if (candidates.length === 0) {
    return false;
  }
  return candidates.every((candidate) => values.includes(candidate));
}
