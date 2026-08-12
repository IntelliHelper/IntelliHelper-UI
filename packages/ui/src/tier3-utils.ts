/**
 * Pure utilities for Tier 3 product-surface components.
 * Keep this file free of React — unit-tested and registry-friendly.
 */

/* ─── Number / currency / phone ─────────────────────────────────────────── */

export function clampNumber(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined && Number.isFinite(min)) next = Math.max(min, next);
  if (max !== undefined && Number.isFinite(max)) next = Math.min(max, next);
  return next;
}

export function roundToStep(value: number, step: number, min = 0): number {
  if (!Number.isFinite(step) || step <= 0) return value;
  const offset = value - min;
  const rounded = Math.round(offset / step) * step + min;
  // Avoid floating-point dust (e.g. 0.1 + 0.2)
  const decimals = stepDecimals(step);
  return Number(rounded.toFixed(decimals));
}

export function stepDecimals(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 0;
  const text = String(step);
  if (text.includes("e-") || text.includes("E-")) {
    const exp = Number(text.split(/e-/i)[1]);
    return Number.isFinite(exp) ? exp : 0;
  }
  const parts = text.split(".");
  return parts[1]?.length ?? 0;
}

export function parseNumericInput(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.+\-eE]/g, "").trim();
  if (!cleaned || cleaned === "-" || cleaned === "+" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function formatNumberDisplay(
  value: number | null | undefined,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  const locale = options?.locale ?? "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits ?? 20,
    }).format(value);
  } catch {
    return String(value);
  }
}

export function formatCurrencyValue(
  value: number | null | undefined,
  options?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  const currency = options?.currency ?? "USD";
  const locale = options?.locale ?? "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    }).format(value);
  } catch {
    return formatNumberDisplay(value, options);
  }
}

export function currencySymbol(
  currency = "USD",
  locale = "en-US",
): string {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? currency;
  } catch {
    return currency;
  }
}

/** Strip non-digits (optional leading +). */
export function sanitizePhoneDigits(raw: string, allowPlus = true): string {
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]!;
    if (ch >= "0" && ch <= "9") out += ch;
    else if (allowPlus && ch === "+" && out.length === 0) out += "+";
  }
  return out;
}

/** Simple national grouping: (XXX) XXX-XXXX style for 10 US digits, else spaced groups. */
export function formatPhoneDisplay(digits: string): string {
  const hasPlus = digits.startsWith("+");
  const body = hasPlus ? digits.slice(1) : digits;
  if (!body) return hasPlus ? "+" : "";

  // US-style when exactly 10 national digits and no country prefix intent
  if (!hasPlus && body.length <= 10) {
    const a = body.slice(0, 3);
    const b = body.slice(3, 6);
    const c = body.slice(6, 10);
    if (body.length <= 3) return a;
    if (body.length <= 6) return `(${a}) ${b}`;
    return `(${a}) ${b}-${c}`;
  }

  // International: +C CC CCC … groups of 3 after country hint
  const groups: string[] = [];
  let i = 0;
  // first 1–3 as country code chunk
  const ccLen = body.length > 10 ? 2 : Math.min(3, body.length);
  groups.push(body.slice(0, ccLen));
  i = ccLen;
  while (i < body.length) {
    groups.push(body.slice(i, i + 3));
    i += 3;
  }
  return (hasPlus ? "+" : "") + groups.filter(Boolean).join(" ");
}

/* ─── Color ─────────────────────────────────────────────────────────────── */

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHexColor(raw: string): string | null {
  const m = raw.trim().match(HEX_RE);
  if (!m) return null;
  let hex = m[1]!;
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return `#${hex.toLowerCase()}`;
}

export function isValidHexColor(raw: string): boolean {
  return normalizeHexColor(raw) !== null;
}

/* ─── Rating ────────────────────────────────────────────────────────────── */

export function clampRating(
  value: number,
  max: number,
  allowHalf = false,
): number {
  const step = allowHalf ? 0.5 : 1;
  const clamped = clampNumber(value, 0, max);
  return roundToStep(clamped, step, 0);
}

export function ratingStars(
  value: number,
  max: number,
): Array<"full" | "half" | "empty"> {
  const stars: Array<"full" | "half" | "empty"> = [];
  for (let i = 1; i <= max; i++) {
    if (value >= i) stars.push("full");
    else if (value >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}

/* ─── Time ──────────────────────────────────────────────────────────────── */

export type TimeValue = {
  hours: number;
  minutes: number;
  seconds?: number;
};

export function clampTimePart(part: number, max: number): number {
  if (!Number.isFinite(part)) return 0;
  return Math.min(max, Math.max(0, Math.trunc(part)));
}

export function normalizeTimeValue(
  value: Partial<TimeValue> | null | undefined,
  withSeconds = false,
): TimeValue {
  const hours = clampTimePart(value?.hours ?? 0, 23);
  const minutes = clampTimePart(value?.minutes ?? 0, 59);
  if (withSeconds) {
    return {
      hours,
      minutes,
      seconds: clampTimePart(value?.seconds ?? 0, 59),
    };
  }
  return { hours, minutes };
}

export function formatTimeValue(
  value: TimeValue,
  options?: { hour12?: boolean; withSeconds?: boolean },
): string {
  const hour12 = options?.hour12 ?? false;
  const withSeconds = options?.withSeconds ?? value.seconds !== undefined;
  const h = value.hours;
  const m = String(value.minutes).padStart(2, "0");
  const s = String(value.seconds ?? 0).padStart(2, "0");

  if (!hour12) {
    const hh = String(h).padStart(2, "0");
    return withSeconds ? `${hh}:${m}:${s}` : `${hh}:${m}`;
  }

  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return withSeconds
    ? `${h12}:${m}:${s} ${period}`
    : `${h12}:${m} ${period}`;
}

export function parseTimeString(raw: string): TimeValue | null {
  const trimmed = raw.trim();
  // 24h: HH:MM(:SS)?
  const m24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (m24) {
    const hours = Number(m24[1]);
    const minutes = Number(m24[2]);
    const seconds = m24[3] !== undefined ? Number(m24[3]) : undefined;
    if (hours > 23 || minutes > 59 || (seconds !== undefined && seconds > 59)) {
      return null;
    }
    return normalizeTimeValue({ hours, minutes, seconds }, seconds !== undefined);
  }
  // 12h: H:MM(:SS)? AM/PM
  const m12 = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/,
  );
  if (m12) {
    let hours = Number(m12[1]);
    const minutes = Number(m12[2]);
    const seconds = m12[3] !== undefined ? Number(m12[3]) : undefined;
    const period = m12[4]!.toUpperCase();
    if (hours < 1 || hours > 12 || minutes > 59) return null;
    if (period === "AM") hours = hours === 12 ? 0 : hours;
    else hours = hours === 12 ? 12 : hours + 12;
    return normalizeTimeValue({ hours, minutes, seconds }, seconds !== undefined);
  }
  return null;
}

export function timeValueToDate(base: Date, time: TimeValue): Date {
  const d = new Date(base);
  d.setHours(time.hours, time.minutes, time.seconds ?? 0, 0);
  return d;
}

export function dateToTimeValue(date: Date, withSeconds = false): TimeValue {
  return normalizeTimeValue(
    {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    },
    withSeconds,
  );
}

/* ─── Month ─────────────────────────────────────────────────────────────── */

export type MonthValue = { year: number; month: number }; // month 0–11

export function normalizeMonthValue(
  value: Partial<MonthValue> | null | undefined,
): MonthValue {
  const now = new Date();
  let year = value?.year ?? now.getFullYear();
  let month = value?.month ?? now.getMonth();
  if (!Number.isFinite(year)) year = now.getFullYear();
  if (!Number.isFinite(month)) month = now.getMonth();
  year = Math.trunc(year);
  month = Math.trunc(month);
  while (month < 0) {
    month += 12;
    year -= 1;
  }
  while (month > 11) {
    month -= 12;
    year += 1;
  }
  return { year, month };
}

export function formatMonthValue(
  value: MonthValue,
  locale = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = new Date(value.year, value.month, 1);
  try {
    return new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
      ...options,
    }).format(d);
  } catch {
    return `${value.month + 1}/${value.year}`;
  }
}

export function monthGrid(year: number): MonthValue[] {
  return Array.from({ length: 12 }, (_, month) => ({ year, month }));
}

/* ─── Data grid ─────────────────────────────────────────────────────────── */

export type SortDirection = "asc" | "desc";

export type DataGridSortState = {
  columnId: string;
  direction: SortDirection;
} | null;

export type DataGridColumnDef<T> = {
  id: string;
  header: string;
  /** Accessor — string key of T or function */
  accessor?: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  filterable?: boolean;
  /** Custom sort comparator (a, b raw cell values) */
  sortFn?: (a: unknown, b: unknown) => number;
  /** Custom filter — return true to keep row */
  filterFn?: (row: T, filterValue: string) => boolean;
  align?: "left" | "center" | "right";
  width?: string | number;
};

function getCellValue<T>(row: T, column: DataGridColumnDef<T>): unknown {
  if (typeof column.accessor === "function") return column.accessor(row);
  if (column.accessor !== undefined) {
    return (row as Record<string, unknown>)[column.accessor as string];
  }
  return (row as Record<string, unknown>)[column.id];
}

export function compareCellValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function toggleSortState(
  current: DataGridSortState,
  columnId: string,
): DataGridSortState {
  if (!current || current.columnId !== columnId) {
    return { columnId, direction: "asc" };
  }
  if (current.direction === "asc") {
    return { columnId, direction: "desc" };
  }
  return null;
}

export function sortDataGridRows<T>(
  rows: T[],
  columns: DataGridColumnDef<T>[],
  sort: DataGridSortState,
): T[] {
  if (!sort) return rows;
  const column = columns.find((c) => c.id === sort.columnId);
  if (!column || column.sortable === false) return rows;
  const dir = sort.direction === "asc" ? 1 : -1;
  const sorted = [...rows];
  sorted.sort((ra, rb) => {
    const va = getCellValue(ra, column);
    const vb = getCellValue(rb, column);
    const cmp = column.sortFn
      ? column.sortFn(va, vb)
      : compareCellValues(va, vb);
    return cmp * dir;
  });
  return sorted;
}

export function filterDataGridRows<T>(
  rows: T[],
  columns: DataGridColumnDef<T>[],
  filters: Record<string, string>,
  globalFilter?: string,
): T[] {
  const activeFilters = Object.entries(filters).filter(
    ([, v]) => v != null && String(v).trim() !== "",
  );
  const global = globalFilter?.trim().toLowerCase() ?? "";

  if (activeFilters.length === 0 && !global) return rows;

  return rows.filter((row) => {
    for (const [columnId, filterValue] of activeFilters) {
      const column = columns.find((c) => c.id === columnId);
      if (!column || column.filterable === false) continue;
      if (column.filterFn) {
        if (!column.filterFn(row, filterValue)) return false;
      } else {
        const cell = getCellValue(row, column);
        if (
          !String(cell ?? "")
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase())
        ) {
          return false;
        }
      }
    }
    if (global) {
      const hay = columns
        .map((c) => String(getCellValue(row, c) ?? ""))
        .join(" ")
        .toLowerCase();
      if (!hay.includes(global)) return false;
    }
    return true;
  });
}

export function processDataGridRows<T>(
  rows: T[],
  columns: DataGridColumnDef<T>[],
  options: {
    sort?: DataGridSortState;
    filters?: Record<string, string>;
    globalFilter?: string;
  } = {},
): T[] {
  const filtered = filterDataGridRows(
    rows,
    columns,
    options.filters ?? {},
    options.globalFilter,
  );
  return sortDataGridRows(filtered, columns, options.sort ?? null);
}

export function toggleRowSelection(
  selected: string[],
  rowId: string,
  options?: { multi?: boolean },
): string[] {
  const multi = options?.multi ?? true;
  const has = selected.includes(rowId);
  if (!multi) {
    return has ? [] : [rowId];
  }
  return has ? selected.filter((id) => id !== rowId) : [...selected, rowId];
}

export function toggleSelectAll(
  selected: string[],
  allIds: string[],
): string[] {
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.includes(id));
  return allSelected ? [] : [...allIds];
}

export function getDataGridCellValue<T>(
  row: T,
  column: DataGridColumnDef<T>,
): unknown {
  return getCellValue(row, column);
}

/* ─── Virtual table windowing ───────────────────────────────────────────── */

export type VirtualWindow = {
  startIndex: number;
  endIndex: number;
  offsetTop: number;
  totalHeight: number;
  visibleCount: number;
};

export function computeVirtualWindow(options: {
  scrollTop: number;
  viewportHeight: number;
  rowCount: number;
  rowHeight: number;
  overscan?: number;
}): VirtualWindow {
  const {
    scrollTop,
    viewportHeight,
    rowCount,
    rowHeight,
    overscan = 4,
  } = options;
  const rh = Math.max(1, rowHeight);
  const totalHeight = rowCount * rh;
  if (rowCount === 0) {
    return {
      startIndex: 0,
      endIndex: 0,
      offsetTop: 0,
      totalHeight: 0,
      visibleCount: 0,
    };
  }
  const rawStart = Math.floor(Math.max(0, scrollTop) / rh);
  const visibleCount = Math.ceil(Math.max(0, viewportHeight) / rh) + 1;
  const startIndex = Math.max(0, rawStart - overscan);
  const endIndex = Math.min(rowCount, rawStart + visibleCount + overscan);
  return {
    startIndex,
    endIndex,
    offsetTop: startIndex * rh,
    totalHeight,
    visibleCount: endIndex - startIndex,
  };
}

/* ─── Kanban ────────────────────────────────────────────────────────────── */

export type KanbanCard = {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  labels?: string[];
  meta?: Record<string, unknown>;
};

export type KanbanColumn = {
  id: string;
  title: string;
  description?: string;
};

export function groupKanbanCards(
  cards: KanbanCard[],
  columns: KanbanColumn[],
): Record<string, KanbanCard[]> {
  const map: Record<string, KanbanCard[]> = {};
  for (const col of columns) map[col.id] = [];
  for (const card of cards) {
    if (!map[card.columnId]) map[card.columnId] = [];
    map[card.columnId]!.push(card);
  }
  return map;
}

export function moveKanbanCard(
  cards: KanbanCard[],
  cardId: string,
  toColumnId: string,
  toIndex?: number,
): KanbanCard[] {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return cards;

  const without = cards.filter((c) => c.id !== cardId);
  const moved: KanbanCard = { ...card, columnId: toColumnId };

  // Build ordered list: preserve relative order of other columns; insert in target
  const byColumn = new Map<string, KanbanCard[]>();
  for (const c of without) {
    const list = byColumn.get(c.columnId) ?? [];
    list.push(c);
    byColumn.set(c.columnId, list);
  }
  const target = byColumn.get(toColumnId) ?? [];
  const idx =
    toIndex === undefined
      ? target.length
      : Math.max(0, Math.min(toIndex, target.length));
  target.splice(idx, 0, moved);
  byColumn.set(toColumnId, target);

  // Reconstruct: original column order from first-seen in input + target
  const columnOrder: string[] = [];
  for (const c of cards) {
    if (!columnOrder.includes(c.columnId)) columnOrder.push(c.columnId);
  }
  if (!columnOrder.includes(toColumnId)) columnOrder.push(toColumnId);

  const result: KanbanCard[] = [];
  for (const colId of columnOrder) {
    result.push(...(byColumn.get(colId) ?? []));
  }
  // Include any remaining columns not in order
  for (const [colId, list] of byColumn) {
    if (!columnOrder.includes(colId)) result.push(...list);
  }
  return result;
}

/* ─── Timeline / activity ───────────────────────────────────────────────── */

export type TimelineStatus = "default" | "success" | "warning" | "error" | "active";

export function timelineStatusTone(
  status: TimelineStatus,
): "default" | "success" | "warning" | "destructive" | "primary" {
  switch (status) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "destructive";
    case "active":
      return "primary";
    default:
      return "default";
  }
}
