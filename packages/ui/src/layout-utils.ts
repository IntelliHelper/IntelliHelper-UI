/**
 * Pure spacing / grid class maps for layout primitives.
 * Kept free of React so unit tests can import without loading .tsx.
 */

export type LayoutGap =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 12
  | 14
  | 16
  | 20
  | 24
  | 28;

export type LayoutAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type LayoutJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export type LayoutCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export const gapClass: Record<LayoutGap, string> = {
  0: "gap-0",
  0.5: "gap-0.5",
  1: "gap-1",
  1.5: "gap-1.5",
  2: "gap-2",
  2.5: "gap-2.5",
  3: "gap-3",
  3.5: "gap-3.5",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
  12: "gap-12",
  14: "gap-14",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
  28: "gap-28",
};

export const alignClass: Record<LayoutAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

export const justifyClass: Record<LayoutJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export const colsClass: Record<LayoutCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

export const smColsClass: Record<LayoutCols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
  12: "sm:grid-cols-12",
};

export const mdColsClass: Record<LayoutCols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};

export const lgColsClass: Record<LayoutCols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

export const paddingClass: Record<LayoutGap, string> = {
  0: "p-0",
  0.5: "p-0.5",
  1: "p-1",
  1.5: "p-1.5",
  2: "p-2",
  2.5: "p-2.5",
  3: "p-3",
  3.5: "p-3.5",
  4: "p-4",
  5: "p-5",
  6: "p-6",
  7: "p-7",
  8: "p-8",
  9: "p-9",
  10: "p-10",
  12: "p-12",
  14: "p-14",
  16: "p-16",
  20: "p-20",
  24: "p-24",
  28: "p-28",
};

export const spacerSizeClass: Record<LayoutGap, { h: string; w: string }> = {
  0: { h: "h-0", w: "w-0" },
  0.5: { h: "h-0.5", w: "w-0.5" },
  1: { h: "h-1", w: "w-1" },
  1.5: { h: "h-1.5", w: "w-1.5" },
  2: { h: "h-2", w: "w-2" },
  2.5: { h: "h-2.5", w: "w-2.5" },
  3: { h: "h-3", w: "w-3" },
  3.5: { h: "h-3.5", w: "w-3.5" },
  4: { h: "h-4", w: "w-4" },
  5: { h: "h-5", w: "w-5" },
  6: { h: "h-6", w: "w-6" },
  7: { h: "h-7", w: "w-7" },
  8: { h: "h-8", w: "w-8" },
  9: { h: "h-9", w: "w-9" },
  10: { h: "h-10", w: "w-10" },
  12: { h: "h-12", w: "w-12" },
  14: { h: "h-14", w: "w-14" },
  16: { h: "h-16", w: "w-16" },
  20: { h: "h-20", w: "w-20" },
  24: { h: "h-24", w: "w-24" },
  28: { h: "h-28", w: "w-28" },
};

export function layoutGapClass(gap?: LayoutGap): string | undefined {
  return gap === undefined ? undefined : gapClass[gap];
}

export function layoutAlignClass(align?: LayoutAlign): string | undefined {
  return align === undefined ? undefined : alignClass[align];
}

export function layoutJustifyClass(
  justify?: LayoutJustify,
): string | undefined {
  return justify === undefined ? undefined : justifyClass[justify];
}

export function layoutColsClass(
  cols?: LayoutCols,
  sm?: LayoutCols,
  md?: LayoutCols,
  lg?: LayoutCols,
): string {
  return [
    cols !== undefined ? colsClass[cols] : "",
    sm !== undefined ? smColsClass[sm] : "",
    md !== undefined ? mdColsClass[md] : "",
    lg !== undefined ? lgColsClass[lg] : "",
  ]
    .filter(Boolean)
    .join(" ");
}
