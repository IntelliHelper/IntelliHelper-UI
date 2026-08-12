/**
 * Pure analytics / chart geometry helpers.
 * Safe for Node unit tests (no React, no DOM).
 */

export type ChartDatum = {
  /** Optional category / x-axis label */
  label?: string;
  /** Numeric value for the series point or segment */
  value: number;
};

export type ScaledPoint = {
  x: number;
  y: number;
  value: number;
  label?: string;
  index: number;
};

export type SeriesExtent = {
  min: number;
  max: number;
};

export type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type TrendDirection = "up" | "down" | "flat";

export type FormattedDelta = {
  direction: TrendDirection;
  /** Absolute difference current - previous */
  delta: number;
  /** Percent change relative to previous; null when previous is 0 */
  percent: number | null;
  /** Signed human-readable string, e.g. "+12.5%" or "−3" */
  label: string;
};

export type DonutSegment = {
  index: number;
  label?: string;
  value: number;
  /** Share of total in 0–100 */
  percent: number;
  /** Arc start angle in radians (0 = 12 o'clock, clockwise) */
  startAngle: number;
  /** Arc end angle in radians */
  endAngle: number;
  /** SVG path `d` for the donut slice (annulus sector) */
  path: string;
  color?: string;
};

const DEFAULT_PAD: ChartPadding = { top: 8, right: 8, bottom: 8, left: 8 };

/** Coerce mixed series input into ChartDatum[]. */
export function normalizeSeries(
  data: Array<number | ChartDatum> | undefined | null,
): ChartDatum[] {
  if (!data || data.length === 0) return [];
  return data.map((item) =>
    typeof item === "number" ? { value: item } : { label: item.label, value: item.value },
  );
}

/** Min/max of series values. Empty → { min: 0, max: 0 }. */
export function seriesExtent(data: Array<number | ChartDatum>): SeriesExtent {
  const series = normalizeSeries(data);
  if (series.length === 0) return { min: 0, max: 0 };
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const d of series) {
    const v = d.value;
    if (!Number.isFinite(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 0 };
  return { min, max };
}

/**
 * Linear map from domain [d0, d1] → range [r0, r1].
 * Degenerate domain (d0 === d1) maps to the midpoint of the range.
 */
export function scaleLinear(
  value: number,
  domain: [number, number],
  range: [number, number],
): number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (!Number.isFinite(value)) return r0;
  if (d1 === d0) return (r0 + r1) / 2;
  return r0 + ((value - d0) / (d1 - d0)) * (r1 - r0);
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/**
 * Map a series into SVG coordinate points inside a viewBox.
 * Y is inverted (higher values → smaller y). When all values are equal,
 * points sit on the vertical midpoint of the plot area.
 */
export function scaleSeriesToPoints(
  data: Array<number | ChartDatum>,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: { baselineZero?: boolean },
): ScaledPoint[] {
  const series = normalizeSeries(data);
  if (series.length === 0 || width <= 0 || height <= 0) return [];

  const pad = { ...DEFAULT_PAD, ...padding };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const { min: rawMin, max: rawMax } = seriesExtent(series);
  let min = options?.baselineZero ? Math.min(0, rawMin) : rawMin;
  let max = options?.baselineZero ? Math.max(0, rawMax) : rawMax;
  if (min === max) {
    // Expand slightly so a flat line still has a defined band
    min = min - 1;
    max = max + 1;
  }

  const n = series.length;
  return series.map((d, index) => {
    const x =
      n === 1
        ? pad.left + innerW / 2
        : pad.left + (index / (n - 1)) * innerW;
    const y = scaleLinear(d.value, [min, max], [pad.top + innerH, pad.top]);
    return { x, y, value: d.value, label: d.label, index };
  });
}

/** Build an SVG polyline/path `d` for a line through scaled points. */
export function pointsToLinePath(points: ScaledPoint[]): string {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
    .join(" ");
}

/**
 * Closed area path from the line down to a baseline y.
 * Returns empty string when fewer than 1 point.
 */
export function pointsToAreaPath(points: ScaledPoint[], baselineY: number): string {
  if (points.length === 0) return "";
  const line = pointsToLinePath(points);
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${line} L${round(last.x)} ${round(baselineY)} L${round(first.x)} ${round(baselineY)} Z`;
}

function round(n: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

/** Absolute and percent delta of current vs previous. */
export function computeDelta(current: number, previous: number): {
  delta: number;
  percent: number | null;
  direction: TrendDirection;
} {
  const delta =
    Number.isFinite(current) && Number.isFinite(previous)
      ? current - previous
      : 0;
  let percent: number | null = null;
  if (Number.isFinite(previous) && previous !== 0 && Number.isFinite(current)) {
    percent = ((current - previous) / Math.abs(previous)) * 100;
  }
  const direction: TrendDirection =
    delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return { delta, percent, direction };
}

/**
 * Format a trend/delta for KPI cards.
 * Prefer percent when previous ≠ 0; otherwise absolute delta.
 */
export function formatDelta(
  current: number,
  previous: number,
  options?: {
    /** Force absolute delta instead of percent */
    mode?: "auto" | "percent" | "absolute";
    /** Digits after decimal for percent / absolute */
    decimals?: number;
    /** Suffix for absolute mode (e.g. "ms") */
    absoluteSuffix?: string;
  },
): FormattedDelta {
  const { delta, percent, direction } = computeDelta(current, previous);
  const decimals = options?.decimals ?? 1;
  const mode = options?.mode ?? "auto";
  const usePercent =
    mode === "percent" || (mode === "auto" && percent != null);
  let label: string;
  if (usePercent && percent != null) {
    const sign = percent > 0 ? "+" : percent < 0 ? "−" : "";
    const abs = Math.abs(percent).toFixed(decimals);
    label = `${sign}${abs}%`;
  } else {
    const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
    const abs = Math.abs(delta).toFixed(decimals).replace(/\.0$/, "");
    const suffix = options?.absoluteSuffix ?? "";
    label = `${sign}${abs}${suffix}`;
  }
  // Normalize unicode minus for flat zero already handled
  if (direction === "flat" && (label === "+0%" || label === "+0" || label === "0" || label === "0.0%")) {
    label = mode === "percent" || (mode === "auto" && percent != null) ? "0%" : "0";
  }
  return { direction, delta, percent, label };
}

/** Sum of segment values (non-finite treated as 0). */
export function sumValues(data: Array<number | ChartDatum>): number {
  return normalizeSeries(data).reduce((acc, d) => {
    return acc + (Number.isFinite(d.value) ? d.value : 0);
  }, 0);
}

/** Percent of total for each value (0–100). Empty or zero total → all 0. */
export function percentOfTotal(data: Array<number | ChartDatum>): number[] {
  const series = normalizeSeries(data);
  const total = sumValues(series);
  if (total === 0) return series.map(() => 0);
  return series.map((d) =>
    Number.isFinite(d.value) ? (d.value / total) * 100 : 0,
  );
}

/**
 * Polar helpers — angles measured from 12 o'clock, clockwise (SVG-friendly).
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
): { x: number; y: number } {
  return {
    x: cx + radius * Math.sin(angleRad),
    y: cy - radius * Math.cos(angleRad),
  };
}

/** True when sweep is a full turn (SVG cannot draw a single 360° arc). */
function isFullCircleSweep(sweep: number): boolean {
  return sweep >= Math.PI * 2 - 1e-9;
}

/**
 * SVG arc path command from startAngle → endAngle at a given radius.
 * Angles in radians, 0 at 12 o'clock, clockwise positive.
 * Full circles use two half-arcs so the path is non-degenerate.
 */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;
  if (radius <= 0 || sweep <= 0) return "";
  const start = polarToCartesian(cx, cy, radius, startAngle);
  if (isFullCircleSweep(sweep)) {
    const mid = polarToCartesian(cx, cy, radius, startAngle + Math.PI);
    const r = round(radius);
    return [
      `M ${round(start.x)} ${round(start.y)}`,
      `A ${r} ${r} 0 1 1 ${round(mid.x)} ${round(mid.y)}`,
      `A ${r} ${r} 0 1 1 ${round(start.x)} ${round(start.y)}`,
    ].join(" ");
  }
  const end = polarToCartesian(cx, cy, radius, endAngle);
  const largeArc = sweep > Math.PI ? 1 : 0;
  return `M ${round(start.x)} ${round(start.y)} A ${round(radius)} ${round(radius)} 0 ${largeArc} 1 ${round(end.x)} ${round(end.y)}`;
}

/**
 * Build donut (annulus) segments for pie/donut charts.
 * Returns empty array when total is 0 or data is empty.
 */
export function donutSegments(
  data: Array<number | ChartDatum & { color?: string }>,
  options: {
    cx: number;
    cy: number;
    outerRadius: number;
    innerRadius: number;
    /** Gap between segments in radians (default 0) */
    padAngle?: number;
  },
): DonutSegment[] {
  const series = normalizeSeries(data).map((d, i) => {
    const raw = data[i];
    const color =
      raw && typeof raw === "object" && "color" in raw
        ? (raw as { color?: string }).color
        : undefined;
    return { ...d, color };
  });
  const total = sumValues(series);
  if (series.length === 0 || total <= 0) return [];

  const { cx, cy, outerRadius, innerRadius } = options;
  const padAngle = options.padAngle ?? 0;
  const totalPad = padAngle * series.length;
  const usable = Math.max(0, Math.PI * 2 - totalPad);

  let angle = 0;
  const segments: DonutSegment[] = [];

  for (let i = 0; i < series.length; i++) {
    const d = series[i]!;
    const value = Number.isFinite(d.value) ? Math.max(0, d.value) : 0;
    const fraction = value / total;
    const sweep = fraction * usable;
    const startAngle = angle + padAngle / 2;
    const endAngle = startAngle + sweep;
    angle = endAngle + padAngle / 2;

    const path = donutSlicePath(
      cx,
      cy,
      outerRadius,
      innerRadius,
      startAngle,
      endAngle,
    );

    segments.push({
      index: i,
      label: d.label,
      value,
      percent: fraction * 100,
      startAngle,
      endAngle,
      path,
      color: d.color,
    });
  }

  return segments;
}

/**
 * Closed path for a donut slice between two radii.
 * Full-circle sweeps (single 100% segment, padAngle 0) are drawn as two
 * half-arcs — SVG treats a 360° arc with identical endpoints as empty.
 */
export function donutSlicePath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  if (endAngle <= startAngle || outerRadius <= 0) return "";
  const sweep = endAngle - startAngle;
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const or = round(outerRadius);

  if (isFullCircleSweep(sweep)) {
    const outerMid = polarToCartesian(cx, cy, outerRadius, startAngle + Math.PI);
    if (innerRadius <= 0) {
      // Solid disc: two outer half-arcs closed to center implicitly via Z from start
      return [
        `M ${round(outerStart.x)} ${round(outerStart.y)}`,
        `A ${or} ${or} 0 1 1 ${round(outerMid.x)} ${round(outerMid.y)}`,
        `A ${or} ${or} 0 1 1 ${round(outerStart.x)} ${round(outerStart.y)}`,
        "Z",
      ].join(" ");
    }
    const ir = round(innerRadius);
    const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
    const innerMid = polarToCartesian(cx, cy, innerRadius, startAngle + Math.PI);
    // Outer ring CW (two halves), then inner ring CCW (two halves)
    return [
      `M ${round(outerStart.x)} ${round(outerStart.y)}`,
      `A ${or} ${or} 0 1 1 ${round(outerMid.x)} ${round(outerMid.y)}`,
      `A ${or} ${or} 0 1 1 ${round(outerStart.x)} ${round(outerStart.y)}`,
      `L ${round(innerStart.x)} ${round(innerStart.y)}`,
      `A ${ir} ${ir} 0 1 0 ${round(innerMid.x)} ${round(innerMid.y)}`,
      `A ${ir} ${ir} 0 1 0 ${round(innerStart.x)} ${round(innerStart.y)}`,
      "Z",
    ].join(" ");
  }

  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const largeArc = sweep > Math.PI ? 1 : 0;

  if (innerRadius <= 0) {
    // Solid pie slice
    return [
      `M ${round(cx)} ${round(cy)}`,
      `L ${round(outerStart.x)} ${round(outerStart.y)}`,
      `A ${or} ${or} 0 ${largeArc} 1 ${round(outerEnd.x)} ${round(outerEnd.y)}`,
      "Z",
    ].join(" ");
  }

  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const ir = round(innerRadius);

  return [
    `M ${round(outerStart.x)} ${round(outerStart.y)}`,
    `A ${or} ${or} 0 ${largeArc} 1 ${round(outerEnd.x)} ${round(outerEnd.y)}`,
    `L ${round(innerEnd.x)} ${round(innerEnd.y)}`,
    `A ${ir} ${ir} 0 ${largeArc} 0 ${round(innerStart.x)} ${round(innerStart.y)}`,
    "Z",
  ].join(" ");
}

/** Nice default palette using CSS variable fallbacks for charts. */
export const DEFAULT_CHART_COLORS = [
  "var(--primary)",
  "color-mix(in oklch, var(--primary) 70%, oklch(0.75 0.12 200))",
  "color-mix(in oklch, var(--primary) 55%, oklch(0.7 0.14 320))",
  "color-mix(in oklch, var(--primary) 45%, oklch(0.72 0.13 80))",
  "color-mix(in oklch, var(--foreground) 35%, transparent)",
] as const;

export function chartColorAt(index: number, colors?: string[]): string {
  const palette = colors?.length ? colors : [...DEFAULT_CHART_COLORS];
  return palette[index % palette.length]!;
}

/* ── Time period presets (dashboard chrome) ── */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Built-in analytics period keys used by ChartPeriodControl. */
export type BuiltinChartPeriodKey =
  | "24h"
  | "7d"
  | "14d"
  | "30d"
  | "90d"
  | "6m"
  | "1y"
  | "ytd"
  | "all"
  /** Absolute custom range via `ChartPeriodRange` */
  | "custom";

/**
 * Built-in keys plus app-defined period ids (e.g. `"45d"`, `"sprint"`).
 * Custom ids resolve via `ChartPeriodOption.daySpan` / `startOffsetMs`.
 */
export type ChartPeriodKey = BuiltinChartPeriodKey | (string & {});

export type ChartPeriodRange = {
  /** Inclusive range start */
  from: string | number | Date;
  /** Inclusive range end (defaults to `now` when omitted) */
  to?: string | number | Date;
};

export type ChartPeriodOption = {
  value: ChartPeriodKey;
  /** Short control label (e.g. "7D") */
  label: string;
  /** Longer accessible name */
  description: string;
  /**
   * For custom keys: relative window length in days ending at `now`.
   * Used by `periodDaySpan` / undated series slicing.
   */
  daySpan?: number;
  /**
   * For custom keys: ms before `now` for the lower bound.
   * Used when `daySpan` is omitted.
   */
  startOffsetMs?: number;
};

export type ChartPeriodResolveOptions = {
  now?: Date | number;
  /** Absolute range used when period is `"custom"` */
  range?: ChartPeriodRange | null;
  /** Registry of custom period definitions (daySpan / startOffsetMs) */
  periods?: readonly ChartPeriodOption[];
};

export const BUILTIN_CHART_PERIOD_KEYS: readonly BuiltinChartPeriodKey[] = [
  "24h",
  "7d",
  "14d",
  "30d",
  "90d",
  "6m",
  "1y",
  "ytd",
  "all",
  "custom",
] as const;

const BUILTIN_PERIOD_SET = new Set<string>(BUILTIN_CHART_PERIOD_KEYS);

export function isBuiltinChartPeriodKey(
  period: ChartPeriodKey,
): period is BuiltinChartPeriodKey {
  return BUILTIN_PERIOD_SET.has(period);
}

export const DEFAULT_CHART_PERIODS: readonly ChartPeriodOption[] = [
  { value: "24h", label: "24H", description: "Last 24 hours" },
  { value: "7d", label: "7D", description: "Last 7 days" },
  { value: "14d", label: "14D", description: "Last 14 days" },
  { value: "30d", label: "30D", description: "Last 30 days" },
  { value: "90d", label: "90D", description: "Last 90 days" },
  { value: "6m", label: "6M", description: "Last 6 months" },
  { value: "1y", label: "1Y", description: "Last 12 months" },
  { value: "ytd", label: "YTD", description: "Year to date" },
  { value: "all", label: "All", description: "All time" },
] as const;

/** Default chip for absolute custom range mode */
export const CUSTOM_CHART_PERIOD: ChartPeriodOption = {
  value: "custom",
  label: "Custom",
  description: "Custom date range",
};

export type TimeSeriesDatum = ChartDatum & {
  /** ISO date string, unix ms, or Date — used for period filtering */
  date?: string | number | Date;
};

/** Parse a date-like value to epoch ms; invalid → null. */
export function toEpochMs(value: string | number | Date | undefined | null): number | null {
  if (value == null) return null;
  if (value instanceof Date) {
    const t = value.getTime();
    return Number.isFinite(t) ? t : null;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  // Prefer full ISO parse; bare YYYY-MM-DD → local midnight via Date parts
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    const t = new Date(y!, (m ?? 1) - 1, d ?? 1).getTime();
    return Number.isFinite(t) ? t : null;
  }
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

/** Format epoch/Date as `YYYY-MM-DD` for native date inputs (local calendar). */
export function toDateInputValue(
  value: string | number | Date | undefined | null,
): string {
  const ms = toEpochMs(value);
  if (ms == null) return "";
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Normalize a range so from ≤ to when both parse. */
export function normalizeChartPeriodRange(
  range: ChartPeriodRange | null | undefined,
): { from: number; to: number } | null {
  if (!range) return null;
  const from = toEpochMs(range.from);
  if (from == null) return null;
  const toRaw = range.to != null ? toEpochMs(range.to) : null;
  const to = toRaw ?? from;
  if (from <= to) return { from, to };
  return { from: to, to: from };
}

function resolveNowMs(now: Date | number = Date.now()): number {
  return typeof now === "number" ? now : now.getTime();
}

function findPeriodOption(
  period: ChartPeriodKey,
  periods?: readonly ChartPeriodOption[],
): ChartPeriodOption | undefined {
  if (!periods?.length) return undefined;
  return periods.find((p) => p.value === period);
}

/**
 * Inclusive lower bound for a period relative to `now`.
 * Returns null for `"all"`, unknown keys without custom definition, or incomplete custom range.
 */
export function periodStartMs(
  period: ChartPeriodKey,
  now: Date | number = Date.now(),
  options?: Omit<ChartPeriodResolveOptions, "now">,
): number | null {
  const opts: ChartPeriodResolveOptions = { ...options, now };
  const nowMs = resolveNowMs(now);
  const d = new Date(nowMs);

  if (period === "custom") {
    const bounds = normalizeChartPeriodRange(opts.range);
    return bounds?.from ?? null;
  }

  switch (period) {
    case "24h":
      return nowMs - DAY_MS;
    case "7d":
      return nowMs - 7 * DAY_MS;
    case "14d":
      return nowMs - 14 * DAY_MS;
    case "30d":
      return nowMs - 30 * DAY_MS;
    case "90d":
      return nowMs - 90 * DAY_MS;
    case "6m":
      return nowMs - 182 * DAY_MS;
    case "1y":
      return nowMs - 365 * DAY_MS;
    case "ytd":
      return new Date(d.getFullYear(), 0, 1).getTime();
    case "all":
      return null;
    default: {
      const def = findPeriodOption(period, opts.periods);
      if (def?.daySpan != null && def.daySpan > 0) {
        return nowMs - def.daySpan * DAY_MS;
      }
      if (def?.startOffsetMs != null && def.startOffsetMs > 0) {
        return nowMs - def.startOffsetMs;
      }
      return null;
    }
  }
}

/**
 * Inclusive upper bound for a period.
 * Presets use `now`; `"custom"` uses `range.to` (or `now` / `from` fallback).
 */
export function periodEndMs(
  period: ChartPeriodKey,
  now: Date | number = Date.now(),
  options?: Omit<ChartPeriodResolveOptions, "now">,
): number {
  const nowMs = resolveNowMs(now);
  if (period === "custom") {
    const bounds = normalizeChartPeriodRange(options?.range);
    if (bounds) return bounds.to;
    return nowMs;
  }
  return nowMs;
}

/**
 * Approximate day span for a period (for truncating non-dated series by count).
 * `"all"` / unknown without definition → null.
 */
export function periodDaySpan(
  period: ChartPeriodKey,
  options?: ChartPeriodResolveOptions,
): number | null {
  if (period === "custom") {
    const bounds = normalizeChartPeriodRange(options?.range);
    if (!bounds) return null;
    return Math.max(1, Math.ceil((bounds.to - bounds.from) / DAY_MS) + 1);
  }
  switch (period) {
    case "24h":
      return 1;
    case "7d":
      return 7;
    case "14d":
      return 14;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "6m":
      return 182;
    case "1y":
      return 365;
    case "ytd": {
      const nowMs = resolveNowMs(options?.now);
      const now = new Date(nowMs);
      const start = new Date(now.getFullYear(), 0, 1);
      return Math.max(
        1,
        Math.ceil((nowMs - start.getTime()) / DAY_MS) + 1,
      );
    }
    case "all":
      return null;
    default: {
      const def = findPeriodOption(period, options?.periods);
      if (def?.daySpan != null && def.daySpan > 0) return Math.floor(def.daySpan);
      if (def?.startOffsetMs != null && def.startOffsetMs > 0) {
        return Math.max(1, Math.ceil(def.startOffsetMs / DAY_MS));
      }
      return null;
    }
  }
}

function normalizePeriodArgs(
  nowOrOptions: Date | number | ChartPeriodResolveOptions = Date.now(),
): ChartPeriodResolveOptions {
  if (
    typeof nowOrOptions === "object" &&
    nowOrOptions != null &&
    !(nowOrOptions instanceof Date)
  ) {
    return nowOrOptions;
  }
  return { now: nowOrOptions };
}

/**
 * Filter time-series points into the selected period / custom range.
 * Points without a parseable `date` are kept only when period is `"all"`.
 */
export function filterTimeSeriesByPeriod<T extends TimeSeriesDatum>(
  data: T[] | undefined | null,
  period: ChartPeriodKey,
  nowOrOptions: Date | number | ChartPeriodResolveOptions = Date.now(),
): T[] {
  if (!data || data.length === 0) return [];
  const opts = normalizePeriodArgs(nowOrOptions);
  const nowMs = resolveNowMs(opts.now);
  const resolveOpts = { range: opts.range, periods: opts.periods };
  if (period === "all") return [...data];
  if (period === "custom" && !normalizeChartPeriodRange(opts.range)) {
    // Incomplete custom range → empty rather than unfiltered surprise
    return [];
  }
  const start = periodStartMs(period, nowMs, resolveOpts);
  if (start == null && period !== "custom") return [...data];
  if (start == null) return [];
  const end = periodEndMs(period, nowMs, resolveOpts);
  // Date-only `to` (YYYY-MM-DD) is midnight — include the full local day.
  const endInclusive =
    period === "custom" &&
    opts.range?.to != null &&
    typeof opts.range.to === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(opts.range.to)
      ? end + DAY_MS - 1
      : end;
  return data.filter((d) => {
    const t = toEpochMs(d.date);
    if (t == null) return false;
    return t >= start && t <= endInclusive;
  });
}

/**
 * When series has no dates, take the last N points matching the period span
 * (e.g. last 7 points for `"7d"`). `"all"` returns the full series.
 */
export function sliceSeriesForPeriod<T>(
  data: T[] | undefined | null,
  period: ChartPeriodKey,
  options?: ChartPeriodResolveOptions,
): T[] {
  if (!data || data.length === 0) return [];
  const span = periodDaySpan(period, options);
  if (span == null || span >= data.length) return [...data];
  return data.slice(-span);
}

/**
 * Prefer date filter when any point has a date; otherwise slice by count.
 * Third arg: `now` (legacy) or {@link ChartPeriodResolveOptions} with `range` / `periods`.
 */
export function applyChartPeriod<T extends TimeSeriesDatum>(
  data: T[] | undefined | null,
  period: ChartPeriodKey,
  nowOrOptions: Date | number | ChartPeriodResolveOptions = Date.now(),
): T[] {
  if (!data || data.length === 0) return [];
  const opts = normalizePeriodArgs(nowOrOptions);
  const hasDates = data.some((d) => toEpochMs(d.date) != null);
  if (hasDates) return filterTimeSeriesByPeriod(data, period, opts);
  return sliceSeriesForPeriod(data, period, opts);
}

/** Human-readable range label for footers / toolbars. */
export function formatChartPeriodRange(
  range: ChartPeriodRange | null | undefined,
  locale?: string,
): string {
  const bounds = normalizeChartPeriodRange(range);
  if (!bounds) return "";
  const fmt = (ms: number) =>
    new Date(ms).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (bounds.from === bounds.to) return fmt(bounds.from);
  return `${fmt(bounds.from)} – ${fmt(bounds.to)}`;
}

/* ── Bar / stacked / radar / funnel geometry ── */

export type BarRect = {
  index: number;
  label?: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Layout vertical bars inside a plot area.
 * Baseline is the bottom of the plot; values scale from 0 (or min if negative).
 */
export function layoutVerticalBars(
  data: Array<number | ChartDatum>,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: { gapRatio?: number; baselineZero?: boolean },
): BarRect[] {
  const series = normalizeSeries(data);
  if (series.length === 0 || width <= 0 || height <= 0) return [];
  const pad = { ...DEFAULT_PAD, ...padding };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const { min: rawMin, max: rawMax } = seriesExtent(series);
  const min = options?.baselineZero !== false ? Math.min(0, rawMin) : rawMin;
  let max = options?.baselineZero !== false ? Math.max(0, rawMax) : rawMax;
  if (min === max) max = min + 1;
  const n = series.length;
  const gapRatio = options?.gapRatio ?? 0.25;
  const slot = innerW / n;
  const gap = slot * gapRatio;
  const barW = Math.max(1, slot - gap);
  const baselineY = scaleLinear(0, [min, max], [pad.top + innerH, pad.top]);

  return series.map((d, index) => {
    const cx = pad.left + index * slot + gap / 2;
    const valueY = scaleLinear(d.value, [min, max], [pad.top + innerH, pad.top]);
    const y = Math.min(baselineY, valueY);
    const h = Math.max(0, Math.abs(baselineY - valueY));
    return {
      index,
      label: d.label,
      value: d.value,
      x: round(cx),
      y: round(y),
      width: round(barW),
      height: round(h),
    };
  });
}

/** Horizontal bars grow left → right from a zero baseline. */
export function layoutHorizontalBars(
  data: Array<number | ChartDatum>,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: { gapRatio?: number; baselineZero?: boolean },
): BarRect[] {
  const series = normalizeSeries(data);
  if (series.length === 0 || width <= 0 || height <= 0) return [];
  const pad = { ...DEFAULT_PAD, ...padding };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const { min: rawMin, max: rawMax } = seriesExtent(series);
  const min = options?.baselineZero !== false ? Math.min(0, rawMin) : rawMin;
  let max = options?.baselineZero !== false ? Math.max(0, rawMax) : rawMax;
  if (min === max) max = min + 1;
  const n = series.length;
  const gapRatio = options?.gapRatio ?? 0.25;
  const slot = innerH / n;
  const gap = slot * gapRatio;
  const barH = Math.max(1, slot - gap);
  const baselineX = scaleLinear(0, [min, max], [pad.left, pad.left + innerW]);

  return series.map((d, index) => {
    const cy = pad.top + index * slot + gap / 2;
    const valueX = scaleLinear(d.value, [min, max], [pad.left, pad.left + innerW]);
    const x = Math.min(baselineX, valueX);
    const w = Math.max(0, Math.abs(valueX - baselineX));
    return {
      index,
      label: d.label,
      value: d.value,
      x: round(x),
      y: round(cy),
      width: round(w),
      height: round(barH),
    };
  });
}

export type StackedBarSeries = {
  key: string;
  label?: string;
  /** One value per category index */
  values: number[];
  color?: string;
};

export type StackedBarSegment = {
  categoryIndex: number;
  seriesKey: string;
  seriesIndex: number;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};

/** Vertical stacked bars. Categories are columns; series stack upward from 0. */
export function layoutStackedBars(
  categories: string[],
  series: StackedBarSeries[],
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: { gapRatio?: number },
): StackedBarSegment[] {
  if (categories.length === 0 || series.length === 0 || width <= 0 || height <= 0) {
    return [];
  }
  const pad = { ...DEFAULT_PAD, ...padding };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const n = categories.length;
  const totals = Array.from({ length: n }, (_, i) =>
    series.reduce((acc, s) => acc + (Number.isFinite(s.values[i]!) ? Math.max(0, s.values[i]!) : 0), 0),
  );
  const maxTotal = Math.max(1, ...totals);
  const gapRatio = options?.gapRatio ?? 0.25;
  const slot = innerW / n;
  const gap = slot * gapRatio;
  const barW = Math.max(1, slot - gap);
  const out: StackedBarSegment[] = [];

  for (let i = 0; i < n; i++) {
    let stacked = 0;
    const x = pad.left + i * slot + gap / 2;
    for (let s = 0; s < series.length; s++) {
      const ser = series[s]!;
      const value = Number.isFinite(ser.values[i]!) ? Math.max(0, ser.values[i]!) : 0;
      const y1 = scaleLinear(stacked, [0, maxTotal], [pad.top + innerH, pad.top]);
      const y0 = scaleLinear(stacked + value, [0, maxTotal], [pad.top + innerH, pad.top]);
      stacked += value;
      out.push({
        categoryIndex: i,
        seriesKey: ser.key,
        seriesIndex: s,
        value,
        x: round(x),
        y: round(y0),
        width: round(barW),
        height: round(Math.max(0, y1 - y0)),
        color: ser.color,
      });
    }
  }
  return out;
}

export type RadarPoint = {
  index: number;
  label?: string;
  value: number;
  /** Normalized 0–1 against max */
  ratio: number;
  x: number;
  y: number;
};

/** Points for a radar/spider polygon. Values scale 0 → maxRadius from center. */
export function layoutRadarPoints(
  data: Array<number | ChartDatum>,
  cx: number,
  cy: number,
  maxRadius: number,
  options?: { maxValue?: number },
): RadarPoint[] {
  const series = normalizeSeries(data);
  if (series.length === 0 || maxRadius <= 0) return [];
  const maxVal =
    options?.maxValue ??
    Math.max(1, ...series.map((d) => (Number.isFinite(d.value) ? d.value : 0)));
  const n = series.length;
  return series.map((d, index) => {
    const value = Number.isFinite(d.value) ? Math.max(0, d.value) : 0;
    const ratio = clamp(value / maxVal, 0, 1);
    const angle = (index / n) * Math.PI * 2;
    const r = ratio * maxRadius;
    const { x, y } = polarToCartesian(cx, cy, r, angle);
    return {
      index,
      label: d.label,
      value,
      ratio,
      x: round(x),
      y: round(y),
    };
  });
}

/** Closed polygon path through radar points. */
export function pointsToPolygonPath(
  points: Array<{ x: number; y: number }>,
): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${round(points[0]!.x)} ${round(points[0]!.y)} Z`;
  }
  return (
    points
      .map((p, i) => `${i === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
      .join(" ") + " Z"
  );
}

export type FunnelStage = {
  index: number;
  label?: string;
  value: number;
  percentOfFirst: number;
  /** Trapezoid path for the stage band */
  path: string;
  y: number;
  height: number;
  topWidth: number;
  bottomWidth: number;
};

/**
 * Funnel stages: widths proportional to value, stacked top → bottom.
 * First stage uses full plot width; subsequent stages taper by value ratio.
 */
export function layoutFunnelStages(
  data: Array<number | ChartDatum>,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: { minWidthRatio?: number },
): FunnelStage[] {
  const series = normalizeSeries(data);
  if (series.length === 0 || width <= 0 || height <= 0) return [];
  const pad = { ...DEFAULT_PAD, ...padding };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  const rawFirst =
    series[0] && Number.isFinite(series[0].value) ? Math.max(0, series[0].value) : 0;
  // All-zero (or non-positive) series must not invent a visible funnel body.
  const firstValue = rawFirst > 0 ? rawFirst : 0;
  const minRatio = options?.minWidthRatio ?? 0.12;
  const stageH = innerH / series.length;
  const stages: FunnelStage[] = [];

  const widthAt = (value: number) => {
    if (firstValue <= 0 || value <= 0) return 0;
    const ratio = clamp(value / firstValue, minRatio, 1);
    return innerW * ratio;
  };

  for (let i = 0; i < series.length; i++) {
    const d = series[i]!;
    const value = Number.isFinite(d.value) ? Math.max(0, d.value) : 0;
    const next = series[i + 1];
    const nextValue =
      next && Number.isFinite(next.value) ? Math.max(0, next.value) : value;
    const topW = widthAt(value);
    const bottomW = widthAt(i < series.length - 1 ? nextValue : value * 0.85);
    const y = pad.top + i * stageH;
    const cx = pad.left + innerW / 2;
    const topL = cx - topW / 2;
    const topR = cx + topW / 2;
    const botL = cx - bottomW / 2;
    const botR = cx + bottomW / 2;
    const path =
      topW <= 0 && bottomW <= 0
        ? ""
        : [
            `M ${round(topL)} ${round(y)}`,
            `L ${round(topR)} ${round(y)}`,
            `L ${round(botR)} ${round(y + stageH)}`,
            `L ${round(botL)} ${round(y + stageH)}`,
            "Z",
          ].join(" ");
    stages.push({
      index: i,
      label: d.label,
      value,
      percentOfFirst: firstValue > 0 ? (value / firstValue) * 100 : 0,
      path,
      y: round(y),
      height: round(stageH),
      topWidth: round(topW),
      bottomWidth: round(bottomW),
    });
  }
  return stages;
}

/** Nice tick values between min and max (inclusive-ish), count ≈ tickCount. */
export function niceTicks(min: number, max: number, tickCount = 4): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0];
  if (min === max) return [min];
  const span = max - min;
  const step = span / Math.max(1, tickCount - 1);
  const ticks: number[] = [];
  for (let i = 0; i < tickCount; i++) {
    ticks.push(round(min + step * i, 4));
  }
  return ticks;
}

/* ── Heatmap geometry + color scales ── */

/** Sparse cell for a matrix heatmap (row × col). */
export type HeatmapDatum = {
  /** Row category key / label */
  row: string;
  /** Column category key / label */
  col: string;
  value: number;
  /** Optional per-cell color override */
  color?: string;
};

export type HeatmapCellLayout = {
  rowIndex: number;
  colIndex: number;
  row: string;
  col: string;
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Normalized intensity 0–1 against the domain */
  t: number;
  /** False when no sparse/matrix value was provided for this slot */
  present: boolean;
  color?: string;
};

/** Named token-aware color ramps (low → high). */
export type HeatmapColorScaleId =
  | "primary"
  | "cool"
  | "warm"
  | "mono"
  /** GitHub contribution-graph greens (light empty → deep green) */
  | "github";

/**
 * Default multi-stop ramps using CSS color-mix so heatmaps track Liquid Glass themes.
 * Consumers can pass a custom `string[]` of stops instead.
 * `github` uses the classic contribution palette (theme-independent on purpose).
 */
export const HEATMAP_COLOR_SCALES: Record<HeatmapColorScaleId, readonly string[]> = {
  primary: [
    "color-mix(in oklch, var(--primary) 10%, transparent)",
    "color-mix(in oklch, var(--primary) 35%, transparent)",
    "color-mix(in oklch, var(--primary) 62%, transparent)",
    "var(--primary)",
  ],
  cool: [
    "color-mix(in oklch, oklch(0.72 0.12 230) 12%, transparent)",
    "color-mix(in oklch, oklch(0.65 0.14 220) 45%, transparent)",
    "color-mix(in oklch, oklch(0.58 0.16 280) 70%, transparent)",
    "oklch(0.52 0.18 300)",
  ],
  warm: [
    "color-mix(in oklch, oklch(0.82 0.12 85) 14%, transparent)",
    "color-mix(in oklch, oklch(0.74 0.15 55) 48%, transparent)",
    "color-mix(in oklch, oklch(0.65 0.18 35) 72%, transparent)",
    "oklch(0.58 0.2 25)",
  ],
  mono: [
    "color-mix(in oklch, var(--foreground) 8%, transparent)",
    "color-mix(in oklch, var(--foreground) 28%, transparent)",
    "color-mix(in oklch, var(--foreground) 52%, transparent)",
    "color-mix(in oklch, var(--foreground) 78%, transparent)",
  ],
  // Mirrors GitHub contribution levels 0–4 (empty → max activity)
  github: [
    "#ebedf0",
    "#9be9a8",
    "#40c463",
    "#30a14e",
    "#216e39",
  ],
} as const;

/** Resolve a named scale id or custom stops into a color list. */
export function resolveHeatmapScale(
  scale?: HeatmapColorScaleId | string[],
): string[] {
  if (Array.isArray(scale) && scale.length > 0) return [...scale];
  if (typeof scale === "string" && scale in HEATMAP_COLOR_SCALES) {
    return [...HEATMAP_COLOR_SCALES[scale as HeatmapColorScaleId]];
  }
  return [...HEATMAP_COLOR_SCALES.primary];
}

/**
 * Map intensity `t` ∈ [0, 1] onto a multi-stop palette.
 * Adjacent stops are blended with `color-mix` for continuous ramps in CSS.
 */
export function heatmapColorAt(
  t: number,
  scale?: HeatmapColorScaleId | string[],
): string {
  const colors = resolveHeatmapScale(scale);
  const clamped = clamp(t, 0, 1);
  if (colors.length === 0) return "var(--primary)";
  if (colors.length === 1) return colors[0]!;
  const pos = clamped * (colors.length - 1);
  const i = Math.min(colors.length - 2, Math.floor(pos));
  const f = pos - i;
  if (f < 1e-6) return colors[i]!;
  if (f > 1 - 1e-6) return colors[i + 1]!;
  const pct = Math.round(f * 100);
  return `color-mix(in oklch, ${colors[i + 1]} ${pct}%, ${colors[i]})`;
}

/** True when input is a dense numeric matrix (rows of numbers). */
export function isHeatmapMatrix(
  input: HeatmapDatum[] | number[][] | undefined | null,
): input is number[][] {
  if (!input || input.length === 0) return false;
  const first = input[0];
  if (!Array.isArray(first)) return false;
  // Sparse HeatmapDatum[] never has array rows; matrix rows are number arrays.
  return input.every(
    (row) =>
      Array.isArray(row) &&
      (row as unknown[]).every(
        (v) => typeof v === "number" || v == null || Number.isNaN(v as number),
      ),
  );
}

/**
 * Normalize sparse cells or a dense matrix into ordered rows, cols, and cells.
 * Matrix form uses `values[rowIndex][colIndex]`.
 */
export function normalizeHeatmapData(
  input:
    | HeatmapDatum[]
    | number[][]
    | undefined
    | null,
  options?: {
    rows?: string[];
    cols?: string[];
  },
): { rows: string[]; cols: string[]; cells: HeatmapDatum[] } {
  if (!input || (Array.isArray(input) && input.length === 0)) {
    return { rows: [], cols: [], cells: [] };
  }

  // Dense matrix: number[][]
  if (isHeatmapMatrix(input)) {
    const matrix = input;
    const rowCount = matrix.length;
    const colCount = Math.max(0, ...matrix.map((r) => r?.length ?? 0));
    const rows =
      options?.rows && options.rows.length > 0
        ? Array.from({ length: rowCount }, (_, i) => options.rows![i] ?? `R${i + 1}`)
        : Array.from({ length: rowCount }, (_, i) => `R${i + 1}`);
    const cols =
      options?.cols && options.cols.length > 0
        ? Array.from({ length: colCount }, (_, i) => options.cols![i] ?? `C${i + 1}`)
        : Array.from({ length: colCount }, (_, i) => `C${i + 1}`);
    const cells: HeatmapDatum[] = [];
    for (let r = 0; r < rowCount; r++) {
      const row = matrix[r] ?? [];
      for (let c = 0; c < colCount; c++) {
        const value = row[c];
        cells.push({
          row: rows[r]!,
          col: cols[c]!,
          value: Number.isFinite(value) ? value! : 0,
        });
      }
    }
    return { rows, cols, cells };
  }

  // Sparse cells
  const sparse = input as HeatmapDatum[];
  const rowOrder: string[] = [];
  const colOrder: string[] = [];
  const rowSeen = new Set<string>();
  const colSeen = new Set<string>();

  if (options?.rows?.length) {
    for (const r of options.rows) {
      if (!rowSeen.has(r)) {
        rowSeen.add(r);
        rowOrder.push(r);
      }
    }
  }
  if (options?.cols?.length) {
    for (const c of options.cols) {
      if (!colSeen.has(c)) {
        colSeen.add(c);
        colOrder.push(c);
      }
    }
  }

  for (const d of sparse) {
    if (!rowSeen.has(d.row)) {
      rowSeen.add(d.row);
      rowOrder.push(d.row);
    }
    if (!colSeen.has(d.col)) {
      colSeen.add(d.col);
      colOrder.push(d.col);
    }
  }

  return { rows: rowOrder, cols: colOrder, cells: sparse };
}

/**
 * Estimate SVG text width for monospace-ish labels (viewBox units).
 * Tuned for ~9px UI labels; slightly wide so we thin early rather than clip.
 */
export function estimateHeatmapLabelWidth(
  label: string,
  fontSize = 9,
): number {
  if (!label) return 0;
  // Average glyph width ≈ 0.58em for tabular UI labels (W10, Mon, etc.)
  return Math.max(fontSize * 0.5, label.length * fontSize * 0.58);
}

/**
 * Pick which axis labels to show so dense grids don't run labels together.
 * Always keeps first + last when thinning. Returns indices into `labels`.
 *
 * @param pitch Distance between adjacent cell centers (cellSize + gap).
 */
export function selectHeatmapAxisLabelIndices(
  labels: readonly string[],
  pitch: number,
  options?: {
    fontSize?: number;
    /** Minimum gap between adjacent drawn labels (viewBox units). Default 2. */
    minGap?: number;
    /**
     * Force a fixed step (1 = all). When omitted, step is derived from
     * the widest label vs pitch.
     */
    step?: number;
  },
): number[] {
  const n = labels.length;
  if (n === 0) return [];
  if (n === 1) return [0];
  const fontSize = options?.fontSize ?? 9;
  const minGap = options?.minGap ?? 2;
  const maxLabelW = Math.max(
    ...labels.map((l) => estimateHeatmapLabelWidth(l, fontSize)),
    fontSize,
  );
  const needed = maxLabelW + minGap;
  const autoStep =
    pitch > 0 && needed > pitch ? Math.ceil(needed / pitch) : 1;
  const step = Math.max(1, options?.step ?? autoStep);

  if (step <= 1) {
    return Array.from({ length: n }, (_, i) => i);
  }

  const picked = new Set<number>();
  for (let i = 0; i < n; i += step) picked.add(i);
  picked.add(0);
  picked.add(n - 1);
  return [...picked].sort((a, b) => a - b);
}

/**
 * Layout heatmap cells as a grid of rects inside a viewBox.
 * When `cellSize` is set, width/height are derived; otherwise cells fill the plot area.
 */
export function layoutHeatmapCells(
  input: HeatmapDatum[] | number[][] | undefined | null,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: {
    rows?: string[];
    cols?: string[];
    gap?: number;
    minValue?: number;
    maxValue?: number;
    /** Fixed square cell size in SVG units (overrides fill-to-fit) */
    cellSize?: number;
  },
): {
  rows: string[];
  cols: string[];
  cells: HeatmapCellLayout[];
  min: number;
  max: number;
  plotWidth: number;
  plotHeight: number;
} {
  const empty = {
    rows: [] as string[],
    cols: [] as string[],
    cells: [] as HeatmapCellLayout[],
    min: 0,
    max: 0,
    plotWidth: 0,
    plotHeight: 0,
  };
  if (!input || width <= 0 || height <= 0) return empty;

  const { rows, cols, cells: rawCells } = normalizeHeatmapData(input, {
    rows: options?.rows,
    cols: options?.cols,
  });
  if (rows.length === 0 || cols.length === 0) return empty;

  const pad = { ...DEFAULT_PAD, ...padding };
  const gap = Math.max(0, options?.gap ?? 2);
  const nRows = rows.length;
  const nCols = cols.length;

  let cellW: number;
  let cellH: number;
  let plotW: number;
  let plotH: number;

  if (options?.cellSize != null && options.cellSize > 0) {
    cellW = options.cellSize;
    cellH = options.cellSize;
    plotW = nCols * cellW + Math.max(0, nCols - 1) * gap;
    plotH = nRows * cellH + Math.max(0, nRows - 1) * gap;
  } else {
    const innerW = Math.max(0, width - pad.left - pad.right);
    const innerH = Math.max(0, height - pad.top - pad.bottom);
    plotW = innerW;
    plotH = innerH;
    cellW =
      nCols === 0
        ? 0
        : Math.max(1, (innerW - Math.max(0, nCols - 1) * gap) / nCols);
    cellH =
      nRows === 0
        ? 0
        : Math.max(1, (innerH - Math.max(0, nRows - 1) * gap) / nRows);
  }

  // Build lookup for sparse values
  const valueMap = new Map<string, HeatmapDatum>();
  for (const d of rawCells) {
    valueMap.set(`${d.row}\0${d.col}`, d);
  }

  const values: number[] = [];
  for (const r of rows) {
    for (const c of cols) {
      const hit = valueMap.get(`${r}\0${c}`);
      if (hit && Number.isFinite(hit.value)) values.push(hit.value);
    }
  }
  const dataMin = values.length ? Math.min(...values) : 0;
  const dataMax = values.length ? Math.max(...values) : 0;
  let min = options?.minValue ?? dataMin;
  let max = options?.maxValue ?? dataMax;
  if (min === max) {
    min = min - 1;
    max = max + 1;
  }

  const rowIndex = new Map(rows.map((r, i) => [r, i]));
  const colIndex = new Map(cols.map((c, i) => [c, i]));
  const layout: HeatmapCellLayout[] = [];

  for (const r of rows) {
    for (const c of cols) {
      const ri = rowIndex.get(r)!;
      const ci = colIndex.get(c)!;
      const hit = valueMap.get(`${r}\0${c}`);
      const present = Boolean(hit && Number.isFinite(hit.value));
      const value = present ? hit!.value : 0;
      const t = present
        ? clamp(scaleLinear(value, [min, max], [0, 1]), 0, 1)
        : 0;
      layout.push({
        rowIndex: ri,
        colIndex: ci,
        row: r,
        col: c,
        value,
        x: round(pad.left + ci * (cellW + gap)),
        y: round(pad.top + ri * (cellH + gap)),
        width: round(cellW),
        height: round(cellH),
        t: round(t, 4),
        present,
        color: hit?.color,
      });
    }
  }

  return {
    rows,
    cols,
    cells: layout,
    min: options?.minValue ?? dataMin,
    max: options?.maxValue ?? dataMax,
    plotWidth: round(plotW),
    plotHeight: round(plotH),
  };
}

/* ── Tree Map geometry ── */

/** Hierarchical node for tree-map layout. Leaf value or parent sum of children. */
export type TreeMapNode = {
  name: string;
  /** Absolute value. When omitted on parents, sum of children is used. */
  value?: number;
  children?: TreeMapNode[];
  color?: string;
};

export type TreeMapTile = {
  name: string;
  value: number;
  depth: number;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Dot-separated ancestry path from root */
  path: string;
  /** True for leaves (no children layout tiles) */
  leaf: boolean;
  color?: string;
};

/** Resolve display value: sum of children when present, else node.value (clamped ≥ 0). */
export function treeMapNodeValue(node: TreeMapNode): number {
  if (node.children && node.children.length > 0) {
    const childSum = node.children.reduce((s, c) => s + treeMapNodeValue(c), 0);
    if (childSum > 0) return childSum;
  }
  const v = node.value;
  return Number.isFinite(v) ? Math.max(0, v as number) : 0;
}

type InternalTree = {
  name: string;
  value: number;
  children: InternalTree[];
  color?: string;
  path: string;
  depth: number;
};

function buildInternalTree(
  node: TreeMapNode,
  path: string,
  depth: number,
): InternalTree {
  const children = (node.children ?? []).map((c, i) =>
    buildInternalTree(c, path ? `${path}.${c.name}` : c.name, depth + 1),
  );
  let value = children.length
    ? children.reduce((s, c) => s + c.value, 0)
    : Number.isFinite(node.value)
      ? Math.max(0, node.value as number)
      : 0;
  // Parent may declare a value larger than children (padding weight) — use max
  if (
    children.length &&
    node.value != null &&
    Number.isFinite(node.value) &&
    node.value > value
  ) {
    value = Math.max(0, node.value);
  }
  return {
    name: node.name,
    value,
    children,
    color: node.color,
    path: path || node.name,
    depth,
  };
}

/** Worst aspect ratio for a row of sizes in a free rectangle of short side `side`. */
function worstAspect(row: number[], side: number): number {
  if (row.length === 0 || side <= 0) return Infinity;
  const s = row.reduce((a, b) => a + b, 0);
  if (s <= 0) return Infinity;
  let maxR = 0;
  for (const r of row) {
    const w = (r / s) * side;
    // rect is (s/side) × w in the layout plane; aspect = max(side²r/s², s²/(side²r))
    const a1 = (side * side * r) / (s * s);
    const a2 = (s * s) / (side * side * r);
    maxR = Math.max(maxR, a1, a2);
  }
  return maxR;
}

/**
 * Squarified tree-map (Bruls et al.): layout leaves (and intermediate nodes if
 * `includeParents`) as rectangles with area proportional to value.
 */
export function layoutTreeMap(
  data: TreeMapNode | TreeMapNode[] | null | undefined,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: {
    /** Gap between sibling tiles (SVG units). Default 1. */
    gap?: number;
    /** When true, emit parent tiles as well as leaves. Default false (leaves only). */
    includeParents?: boolean;
  },
): TreeMapTile[] {
  if (!data || width <= 0 || height <= 0) return [];
  const roots = Array.isArray(data) ? data : [data];
  if (roots.length === 0) return [];

  const pad = { ...DEFAULT_PAD, ...padding };
  const gap = Math.max(0, options?.gap ?? 1);
  const includeParents = options?.includeParents ?? false;
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  if (innerW <= 0 || innerH <= 0) return [];

  const forest: InternalTree =
    roots.length === 1
      ? buildInternalTree(roots[0]!, roots[0]!.name, 0)
      : {
          name: "__root__",
          value: 0,
          children: roots.map((r) => buildInternalTree(r, r.name, 0)),
          path: "",
          depth: -1,
        };
  if (forest.children.length && forest.value === 0) {
    forest.value = forest.children.reduce((s, c) => s + c.value, 0);
  }
  if (forest.value <= 0) return [];

  const tiles: TreeMapTile[] = [];

  const pushTile = (
    node: InternalTree,
    x: number,
    y: number,
    w: number,
    h: number,
    leaf: boolean,
  ) => {
    if (w <= 0 || h <= 0) return;
    tiles.push({
      name: node.name,
      value: node.value,
      depth: node.depth,
      x: round(x),
      y: round(y),
      width: round(w),
      height: round(h),
      path: node.path,
      leaf,
      color: node.color,
    });
  };

  const layoutNode = (
    node: InternalTree,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => {
    const kids = node.children.filter((c) => c.value > 0);
    if (kids.length === 0) {
      pushTile(node, x, y, w, h, true);
      return;
    }
    if (includeParents && node.depth >= 0) {
      pushTile(node, x, y, w, h, false);
    }
    // Squarify children into the rectangle
    squarify(kids, x, y, w, h, layoutNode);
  };

  type LayoutChild = (
    node: InternalTree,
    x: number,
    y: number,
    w: number,
    h: number,
  ) => void;

  function squarify(
    children: InternalTree[],
    x: number,
    y: number,
    w: number,
    h: number,
    layoutChild: LayoutChild,
  ) {
    const total = children.reduce((s, c) => s + c.value, 0);
    if (total <= 0 || w <= 0 || h <= 0) return;
    // Scale values to area units
    const area = w * h;
    const sizes = children.map((c) => (c.value / total) * area);
    const nodes = children.map((c, i) => ({ node: c, size: sizes[i]! }));

    let cx = x;
    let cy = y;
    let cw = w;
    let ch = h;
    let i = 0;
    while (i < nodes.length) {
      const row: typeof nodes = [];
      const horizontal = cw >= ch; // row grows along the long side
      const side = horizontal ? ch : cw;

      while (i < nodes.length) {
        const next = nodes[i]!;
        const trial = [...row, next];
        const trialSizes = trial.map((t) => t.size);
        if (
          row.length === 0 ||
          worstAspect(trialSizes, side) <= worstAspect(
            row.map((t) => t.size),
            side,
          )
        ) {
          row.push(next);
          i++;
        } else {
          break;
        }
      }

      const rowSum = row.reduce((s, t) => s + t.size, 0);
      if (rowSum <= 0) break;
      const rowThickness = rowSum / side;

      if (horizontal) {
        // Row stacks vertically along height `side`, thickness along x
        let ry = cy;
        for (const item of row) {
          const rh = (item.size / rowSum) * side;
          const g = gap > 0 && row.length > 1 ? gap / 2 : 0;
          layoutChild(
            item.node,
            cx,
            ry + g,
            Math.max(0, rowThickness - (gap > 0 ? gap / 2 : 0)),
            Math.max(0, rh - g * 2),
          );
          ry += rh;
        }
        cx += rowThickness;
        cw = Math.max(0, cw - rowThickness);
      } else {
        // Row stacks horizontally along width `side`, thickness along y
        let rx = cx;
        for (const item of row) {
          const rw = (item.size / rowSum) * side;
          const g = gap > 0 && row.length > 1 ? gap / 2 : 0;
          layoutChild(
            item.node,
            rx + g,
            cy,
            Math.max(0, rw - g * 2),
            Math.max(0, rowThickness - (gap > 0 ? gap / 2 : 0)),
          );
          rx += rw;
        }
        cy += rowThickness;
        ch = Math.max(0, ch - rowThickness);
      }
    }
  }

  if (forest.depth === -1) {
    // Synthetic multi-root forest
    squarify(forest.children, pad.left, pad.top, innerW, innerH, layoutNode);
  } else if (forest.children.length === 0) {
    pushTile(forest, pad.left, pad.top, innerW, innerH, true);
  } else {
    if (includeParents) {
      pushTile(forest, pad.left, pad.top, innerW, innerH, false);
    }
    squarify(forest.children, pad.left, pad.top, innerW, innerH, layoutNode);
  }

  return tiles;
}

/* ── Sankey geometry ── */

export type SankeyNodeInput = {
  id: string;
  label?: string;
  /** Explicit column/rank (0-based). Auto from topology when omitted. */
  column?: number;
  color?: string;
};

export type SankeyLinkInput = {
  source: string;
  target: string;
  value: number;
  color?: string;
};

export type SankeyNodeLayout = {
  id: string;
  label?: string;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  color?: string;
};

export type SankeyLinkLayout = {
  source: string;
  target: string;
  value: number;
  path: string;
  width: number;
  sourceY0: number;
  sourceY1: number;
  targetY0: number;
  targetY1: number;
  color?: string;
};

export type SankeyLayout = {
  nodes: SankeyNodeLayout[];
  links: SankeyLinkLayout[];
  columns: number;
};

/**
 * Layout a multi-column Sankey diagram.
 * Node height ∝ max(sum of inbound, sum of outbound) values.
 * Link ribbon widths ∝ flow value; paths are cubic bezier bands.
 */
export function layoutSankey(
  nodesInput: SankeyNodeInput[] | null | undefined,
  linksInput: SankeyLinkInput[] | null | undefined,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: {
    nodeWidth?: number;
    nodeGap?: number;
  },
): SankeyLayout {
  const empty: SankeyLayout = { nodes: [], links: [], columns: 0 };
  if (!nodesInput || nodesInput.length === 0 || width <= 0 || height <= 0) {
    return empty;
  }
  const pad = { ...DEFAULT_PAD, ...padding };
  const nodeW = options?.nodeWidth ?? 14;
  const nodeGap = options?.nodeGap ?? 10;
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  if (innerW <= 0 || innerH <= 0) return empty;

  const nodeMap = new Map<string, SankeyNodeInput>();
  for (const n of nodesInput) {
    if (n.id) nodeMap.set(n.id, n);
  }
  if (nodeMap.size === 0) return empty;

  const links = (linksInput ?? [])
    .filter(
      (l) =>
        l &&
        nodeMap.has(l.source) &&
        nodeMap.has(l.target) &&
        l.source !== l.target &&
        Number.isFinite(l.value) &&
        l.value > 0,
    )
    .map((l) => ({ ...l, value: Math.max(0, l.value) }));

  // Incoming / outgoing totals
  const outSum = new Map<string, number>();
  const inSum = new Map<string, number>();
  for (const id of nodeMap.keys()) {
    outSum.set(id, 0);
    inSum.set(id, 0);
  }
  for (const l of links) {
    outSum.set(l.source, (outSum.get(l.source) ?? 0) + l.value);
    inSum.set(l.target, (inSum.get(l.target) ?? 0) + l.value);
  }

  // Column assignment
  const columns = new Map<string, number>();
  for (const [id, n] of nodeMap) {
    if (n.column != null && Number.isFinite(n.column) && n.column >= 0) {
      columns.set(id, Math.floor(n.column));
    }
  }
  // Topological-ish: sources first; longest-path from sources for the rest
  const adj = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const id of nodeMap.keys()) {
    adj.set(id, []);
    indeg.set(id, 0);
  }
  for (const l of links) {
    adj.get(l.source)!.push(l.target);
    indeg.set(l.target, (indeg.get(l.target) ?? 0) + 1);
  }
  // BFS rank for unassigned
  const queue: string[] = [];
  for (const id of nodeMap.keys()) {
    if (!columns.has(id)) {
      if ((indeg.get(id) ?? 0) === 0) {
        columns.set(id, 0);
        queue.push(id);
      }
    } else {
      queue.push(id);
    }
  }
  // Relax longest path
  const order = [...nodeMap.keys()];
  for (let pass = 0; pass < order.length; pass++) {
    let changed = false;
    for (const l of links) {
      const sc = columns.get(l.source);
      if (sc == null) continue;
      const want = sc + 1;
      const tc = columns.get(l.target);
      if (tc == null || tc < want) {
        // Don't overwrite explicit columns from input when they already set a higher rank
        const explicit = nodeMap.get(l.target)?.column;
        if (explicit != null && Number.isFinite(explicit)) {
          if (tc == null) columns.set(l.target, Math.floor(explicit));
        } else {
          columns.set(l.target, want);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
  for (const id of nodeMap.keys()) {
    if (!columns.has(id)) columns.set(id, 0);
  }

  const maxCol = Math.max(0, ...[...columns.values()]);
  const colCount = maxCol + 1;

  // Group nodes by column
  const byCol: string[][] = Array.from({ length: colCount }, () => []);
  for (const id of nodeMap.keys()) {
    byCol[columns.get(id)!]!.push(id);
  }

  // Node value = max(in, out) so height covers both sides
  const nodeValue = (id: string) =>
    Math.max(inSum.get(id) ?? 0, outSum.get(id) ?? 0, 1e-9);

  // Per-column scale: height available after gaps
  const nodeLayouts = new Map<string, SankeyNodeLayout>();
  const xForCol = (col: number) => {
    if (colCount === 1) return pad.left + (innerW - nodeW) / 2;
    return pad.left + (col / (colCount - 1)) * (innerW - nodeW);
  };

  for (let col = 0; col < colCount; col++) {
    const ids = byCol[col]!;
    if (ids.length === 0) continue;
    // Stable order by id for determinism
    ids.sort((a, b) => a.localeCompare(b));
    const values = ids.map(nodeValue);
    const totalVal = values.reduce((s, v) => s + v, 0);
    const gaps = Math.max(0, ids.length - 1) * nodeGap;
    const usable = Math.max(0, innerH - gaps);
    let y = pad.top;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]!;
      const h =
        totalVal > 0 ? (values[i]! / totalVal) * usable : usable / ids.length;
      const n = nodeMap.get(id)!;
      nodeLayouts.set(id, {
        id,
        label: n.label ?? id,
        column: col,
        x: round(xForCol(col)),
        y: round(y),
        width: round(nodeW),
        height: round(Math.max(1, h)),
        value: round(values[i]!, 4),
        color: n.color,
      });
      y += h + nodeGap;
    }
  }

  // Link attachments: stack outbound at source, inbound at target
  const outCursor = new Map<string, number>();
  const inCursor = new Map<string, number>();
  for (const [id, n] of nodeLayouts) {
    outCursor.set(id, n.y);
    inCursor.set(id, n.y);
  }

  // Sort links for stable stacking: by source column, then source id, then target
  const sortedLinks = [...links].sort((a, b) => {
    const ca = columns.get(a.source)! - columns.get(b.source)!;
    if (ca !== 0) return ca;
    const s = a.source.localeCompare(b.source);
    if (s !== 0) return s;
    return a.target.localeCompare(b.target);
  });

  const linkLayouts: SankeyLinkLayout[] = [];
  for (const l of sortedLinks) {
    const src = nodeLayouts.get(l.source);
    const tgt = nodeLayouts.get(l.target);
    if (!src || !tgt) continue;

    // Thickness proportional within source node height using out-sum
    const srcOut = outSum.get(l.source) || 1;
    const tgtIn = inSum.get(l.target) || 1;
    const srcH = Math.max(1, (l.value / srcOut) * src.height);
    const tgtH = Math.max(1, (l.value / tgtIn) * tgt.height);

    const sy0 = outCursor.get(l.source) ?? src.y;
    const sy1 = sy0 + srcH;
    outCursor.set(l.source, sy1);
    const ty0 = inCursor.get(l.target) ?? tgt.y;
    const ty1 = ty0 + tgtH;
    inCursor.set(l.target, ty1);

    const x0 = src.x + src.width;
    const x1 = tgt.x;
    const mx = (x0 + x1) / 2;
    // Ribbon: closed path with two cubic curves
    const path = [
      `M ${round(x0)} ${round(sy0)}`,
      `C ${round(mx)} ${round(sy0)}, ${round(mx)} ${round(ty0)}, ${round(x1)} ${round(ty0)}`,
      `L ${round(x1)} ${round(ty1)}`,
      `C ${round(mx)} ${round(ty1)}, ${round(mx)} ${round(sy1)}, ${round(x0)} ${round(sy1)}`,
      "Z",
    ].join(" ");

    linkLayouts.push({
      source: l.source,
      target: l.target,
      value: l.value,
      path,
      width: round(Math.min(srcH, tgtH), 4),
      sourceY0: round(sy0),
      sourceY1: round(sy1),
      targetY0: round(ty0),
      targetY1: round(ty1),
      color: l.color,
    });
  }

  return {
    nodes: [...nodeLayouts.values()].sort((a, b) =>
      a.column !== b.column
        ? a.column - b.column
        : a.id.localeCompare(b.id),
    ),
    links: linkLayouts,
    columns: colCount,
  };
}

/* ── Gauge geometry ── */

export type GaugeThreshold = {
  /** Absolute domain value marking the end of this band (inclusive upper). */
  value: number;
  color?: string;
};

export type GaugeBandLayout = {
  from: number;
  to: number;
  startAngle: number;
  endAngle: number;
  path: string;
  color?: string;
};

export type GaugeLayout = {
  cx: number;
  cy: number;
  radius: number;
  innerRadius: number;
  /** Arc start (left / low end), radians — 0 at 12 o'clock, clockwise */
  startAngle: number;
  /** Arc end (right / high end) */
  endAngle: number;
  valueAngle: number;
  min: number;
  max: number;
  value: number;
  clampedValue: number;
  /** Normalized 0–1 position of value in domain */
  t: number;
  needle: { x: number; y: number };
  needlePath: string;
  trackPath: string;
  valueArcPath: string;
  bands: GaugeBandLayout[];
};

/**
 * Semi-circular (or custom-sweep) gauge layout.
 * Maps `value` into [min, max] along an arc; clamps out-of-range safely.
 * Optional thresholds produce colored bands from min → each threshold.
 */
export function layoutGauge(
  value: number,
  min: number,
  max: number,
  width: number,
  height: number,
  padding: Partial<ChartPadding> = {},
  options?: {
    /** Start angle rad (default -π/2 = 9 o'clock) */
    startAngle?: number;
    /** End angle rad (default π/2 = 3 o'clock) — top semicircle when start < end clockwise via top */
    endAngle?: number;
    /** Outer radius; default fits plot */
    radius?: number;
    /** Inner radius ratio of outer (0–1). Default 0.72 */
    innerRatio?: number;
    thresholds?: GaugeThreshold[];
  },
): GaugeLayout | null {
  if (width <= 0 || height <= 0) return null;
  const pad = { ...DEFAULT_PAD, ...padding };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);
  if (innerW <= 0 || innerH <= 0) return null;

  let d0 = Number.isFinite(min) ? min : 0;
  let d1 = Number.isFinite(max) ? max : 1;
  if (d1 < d0) {
    const t = d0;
    d0 = d1;
    d1 = t;
  }
  // Degenerate domain: expand slightly so needle has a defined mid
  if (d1 === d0) {
    d0 = d0 - 1;
    d1 = d1 + 1;
  }

  const startAngle = options?.startAngle ?? -Math.PI / 2;
  const endAngle = options?.endAngle ?? Math.PI / 2;
  const sweep = endAngle - startAngle;

  // Center near bottom of plot for top semicircle; general center for full
  const cx = pad.left + innerW / 2;
  const isSemi = Math.abs(Math.abs(sweep) - Math.PI) < 0.2;
  const cy = isSemi
    ? pad.top + innerH * 0.92
    : pad.top + innerH / 2;
  const maxR = options?.radius
    ?? (isSemi
      ? Math.min(innerW / 2, innerH * 0.95) * 0.96
      : Math.min(innerW, innerH) / 2 * 0.9);
  const radius = Math.max(1, maxR);
  const innerRatio = clamp(options?.innerRatio ?? 0.72, 0.05, 0.95);
  const innerRadius = radius * innerRatio;

  const raw = Number.isFinite(value) ? value : d0;
  const clampedValue = clamp(raw, d0, d1);
  const t = (clampedValue - d0) / (d1 - d0);
  const valueAngle = startAngle + t * sweep;

  const needle = polarToCartesian(cx, cy, radius * 0.88, valueAngle);
  // Needle base triangle
  const baseW = Math.max(3, radius * 0.04);
  const baseLeft = polarToCartesian(cx, cy, baseW, valueAngle - Math.PI / 2);
  const baseRight = polarToCartesian(cx, cy, baseW, valueAngle + Math.PI / 2);
  const hub = { x: cx, y: cy };
  const needlePath = [
    `M ${round(baseLeft.x)} ${round(baseLeft.y)}`,
    `L ${round(needle.x)} ${round(needle.y)}`,
    `L ${round(baseRight.x)} ${round(baseRight.y)}`,
    `L ${round(hub.x)} ${round(hub.y)}`,
    "Z",
  ].join(" ");

  const trackPath = donutSlicePath(
    cx,
    cy,
    radius,
    innerRadius,
    startAngle,
    endAngle,
  );
  const valueArcPath =
    t > 0
      ? donutSlicePath(cx, cy, radius, innerRadius, startAngle, valueAngle)
      : "";

  // Threshold bands
  const bands: GaugeBandLayout[] = [];
  const thresholds = [...(options?.thresholds ?? [])]
    .filter((th) => Number.isFinite(th.value))
    .sort((a, b) => a.value - b.value);
  if (thresholds.length > 0) {
    let from = d0;
    for (const th of thresholds) {
      const to = clamp(th.value, d0, d1);
      if (to <= from) {
        from = to;
        continue;
      }
      const a0 = startAngle + ((from - d0) / (d1 - d0)) * sweep;
      const a1 = startAngle + ((to - d0) / (d1 - d0)) * sweep;
      bands.push({
        from,
        to,
        startAngle: a0,
        endAngle: a1,
        path: donutSlicePath(cx, cy, radius, innerRadius, a0, a1),
        color: th.color,
      });
      from = to;
    }
    if (from < d1) {
      const a0 = startAngle + ((from - d0) / (d1 - d0)) * sweep;
      bands.push({
        from,
        to: d1,
        startAngle: a0,
        endAngle,
        path: donutSlicePath(cx, cy, radius, innerRadius, a0, endAngle),
      });
    }
  }

  return {
    cx: round(cx),
    cy: round(cy),
    radius: round(radius),
    innerRadius: round(innerRadius),
    startAngle,
    endAngle,
    valueAngle,
    min: d0,
    max: d1,
    value: raw,
    clampedValue,
    t: round(t, 4),
    needle: { x: round(needle.x), y: round(needle.y) },
    needlePath,
    trackPath,
    valueArcPath,
    bands,
  };
}
