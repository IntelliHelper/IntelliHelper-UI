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

/** Built-in analytics period keys used by ChartPeriodControl. */
export type ChartPeriodKey =
  | "24h"
  | "7d"
  | "14d"
  | "30d"
  | "90d"
  | "6m"
  | "1y"
  | "ytd"
  | "all";

export type ChartPeriodOption = {
  value: ChartPeriodKey;
  /** Short control label (e.g. "7D") */
  label: string;
  /** Longer accessible name */
  description: string;
};

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
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

/**
 * Inclusive lower bound for a period relative to `now`.
 * Returns null for `"all"` (no lower bound).
 */
export function periodStartMs(
  period: ChartPeriodKey,
  now: Date | number = Date.now(),
): number | null {
  const nowMs = typeof now === "number" ? now : now.getTime();
  const d = new Date(nowMs);
  switch (period) {
    case "24h":
      return nowMs - 24 * 60 * 60 * 1000;
    case "7d":
      return nowMs - 7 * 24 * 60 * 60 * 1000;
    case "14d":
      return nowMs - 14 * 24 * 60 * 60 * 1000;
    case "30d":
      return nowMs - 30 * 24 * 60 * 60 * 1000;
    case "90d":
      return nowMs - 90 * 24 * 60 * 60 * 1000;
    case "6m":
      return nowMs - 182 * 24 * 60 * 60 * 1000;
    case "1y":
      return nowMs - 365 * 24 * 60 * 60 * 1000;
    case "ytd":
      return new Date(d.getFullYear(), 0, 1).getTime();
    case "all":
      return null;
    default:
      return null;
  }
}

/**
 * Approximate day span for a period (for truncating non-dated series by count).
 * `"all"` / unknown → null.
 */
export function periodDaySpan(period: ChartPeriodKey): number | null {
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
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
    }
    case "all":
      return null;
    default:
      return null;
  }
}

/**
 * Filter time-series points into the selected period.
 * Points without a parseable `date` are kept only when period is `"all"`.
 */
export function filterTimeSeriesByPeriod<T extends TimeSeriesDatum>(
  data: T[] | undefined | null,
  period: ChartPeriodKey,
  now: Date | number = Date.now(),
): T[] {
  if (!data || data.length === 0) return [];
  if (period === "all") return [...data];
  const start = periodStartMs(period, now);
  if (start == null) return [...data];
  const end = typeof now === "number" ? now : now.getTime();
  return data.filter((d) => {
    const t = toEpochMs(d.date);
    if (t == null) return false;
    return t >= start && t <= end;
  });
}

/**
 * When series has no dates, take the last N points matching the period span
 * (e.g. last 7 points for `"7d"`). `"all"` returns the full series.
 */
export function sliceSeriesForPeriod<T>(
  data: T[] | undefined | null,
  period: ChartPeriodKey,
): T[] {
  if (!data || data.length === 0) return [];
  const span = periodDaySpan(period);
  if (span == null || span >= data.length) return [...data];
  return data.slice(-span);
}

/** Prefer date filter when any point has a date; otherwise slice by count. */
export function applyChartPeriod<T extends TimeSeriesDatum>(
  data: T[] | undefined | null,
  period: ChartPeriodKey,
  now: Date | number = Date.now(),
): T[] {
  if (!data || data.length === 0) return [];
  const hasDates = data.some((d) => toEpochMs(d.date) != null);
  if (hasDates) return filterTimeSeriesByPeriod(data, period, now);
  return sliceSeriesForPeriod(data, period);
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
