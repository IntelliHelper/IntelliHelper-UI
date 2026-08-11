/**
 * Unit tests for analytics / chart pure helpers.
 * Runs with: node --experimental-strip-types --test packages/ui/src/__tests__/chart-utils.test.mts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyChartPeriod,
  chartColorAt,
  computeDelta,
  describeArc,
  donutSegments,
  donutSlicePath,
  filterTimeSeriesByPeriod,
  formatDelta,
  layoutFunnelStages,
  layoutHorizontalBars,
  layoutRadarPoints,
  layoutStackedBars,
  layoutVerticalBars,
  normalizeSeries,
  percentOfTotal,
  periodDaySpan,
  periodStartMs,
  pointsToAreaPath,
  pointsToLinePath,
  pointsToPolygonPath,
  polarToCartesian,
  scaleLinear,
  scaleSeriesToPoints,
  seriesExtent,
  sliceSeriesForPeriod,
  sumValues,
} from "../chart-utils.ts";

describe("normalizeSeries / seriesExtent / sumValues", () => {
  it("normalizes numbers and objects", () => {
    assert.deepEqual(normalizeSeries([1, 2, 3]), [
      { value: 1 },
      { value: 2 },
      { value: 3 },
    ]);
    assert.deepEqual(normalizeSeries([{ label: "a", value: 10 }]), [
      { label: "a", value: 10 },
    ]);
    assert.deepEqual(normalizeSeries(null), []);
    assert.deepEqual(normalizeSeries([]), []);
  });

  it("computes extent and sum", () => {
    assert.deepEqual(seriesExtent([3, 1, 8, 2]), { min: 1, max: 8 });
    assert.deepEqual(seriesExtent([]), { min: 0, max: 0 });
    assert.equal(sumValues([10, 20, 30]), 60);
    assert.equal(sumValues([{ value: 5 }, { value: 7 }]), 12);
  });
});

describe("scaleLinear", () => {
  it("maps domain to range", () => {
    assert.equal(scaleLinear(0, [0, 10], [0, 100]), 0);
    assert.equal(scaleLinear(10, [0, 10], [0, 100]), 100);
    assert.equal(scaleLinear(5, [0, 10], [0, 100]), 50);
  });

  it("uses range midpoint for degenerate domain", () => {
    assert.equal(scaleLinear(3, [2, 2], [0, 100]), 50);
  });
});

describe("scaleSeriesToPoints / line & area paths", () => {
  it("scales multi-point series into viewBox coordinates", () => {
    const points = scaleSeriesToPoints([0, 50, 100], 100, 50, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    assert.equal(points.length, 3);
    assert.equal(points[0]!.x, 0);
    assert.equal(points[2]!.x, 100);
    // y inverted: max value → y=0, min → y=height
    assert.equal(points[0]!.y, 50);
    assert.equal(points[2]!.y, 0);
    assert.equal(points[1]!.y, 25);
  });

  it("returns empty for empty series or non-positive size", () => {
    assert.deepEqual(scaleSeriesToPoints([], 100, 50), []);
    assert.deepEqual(scaleSeriesToPoints([1, 2], 0, 50), []);
  });

  it("builds non-empty line and area paths", () => {
    const points = scaleSeriesToPoints([10, 20, 15, 30], 200, 80, {
      top: 4,
      right: 4,
      bottom: 4,
      left: 4,
    });
    const line = pointsToLinePath(points);
    assert.ok(line.startsWith("M"));
    assert.ok(line.includes(" L"));
    assert.match(line, /M[\d.]+ [\d.]+/);

    const area = pointsToAreaPath(points, 76);
    assert.ok(area.startsWith("M"));
    assert.ok(area.endsWith(" Z") || area.endsWith("Z"));
    assert.ok(area.includes("76"));
  });

  it("single-point series centers on x", () => {
    const points = scaleSeriesToPoints([42], 100, 40, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    assert.equal(points.length, 1);
    assert.equal(points[0]!.x, 50);
  });
});

describe("formatDelta / computeDelta", () => {
  it("formats percent up/down/flat", () => {
    const up = formatDelta(120, 100);
    assert.equal(up.direction, "up");
    assert.equal(up.delta, 20);
    assert.equal(up.percent, 20);
    assert.equal(up.label, "+20.0%");

    const down = formatDelta(80, 100);
    assert.equal(down.direction, "down");
    assert.equal(down.label, "−20.0%");

    const flat = formatDelta(50, 50);
    assert.equal(flat.direction, "flat");
    assert.equal(flat.label, "0%");
  });

  it("falls back to absolute when previous is 0", () => {
    const result = formatDelta(12, 0);
    assert.equal(result.direction, "up");
    assert.equal(result.percent, null);
    assert.equal(result.label, "+12");
  });

  it("supports absolute mode with suffix", () => {
    const result = formatDelta(110, 100, {
      mode: "absolute",
      decimals: 0,
      absoluteSuffix: "ms",
    });
    assert.equal(result.label, "+10ms");
  });

  it("computeDelta matches formatDelta numbers", () => {
    const d = computeDelta(150, 100);
    assert.equal(d.delta, 50);
    assert.equal(d.percent, 50);
    assert.equal(d.direction, "up");
  });
});

describe("percentOfTotal / donutSegments", () => {
  it("percentOfTotal sums to ~100 for non-zero data", () => {
    const pct = percentOfTotal([25, 25, 50]);
    assert.deepEqual(pct, [25, 25, 50]);
    assert.deepEqual(percentOfTotal([]), []);
    assert.deepEqual(percentOfTotal([0, 0]), [0, 0]);
  });

  it("builds donut segments with paths and percentages", () => {
    const segs = donutSegments(
      [
        { label: "A", value: 50 },
        { label: "B", value: 30 },
        { label: "C", value: 20 },
      ],
      { cx: 50, cy: 50, outerRadius: 40, innerRadius: 24 },
    );
    assert.equal(segs.length, 3);
    assert.equal(segs[0]!.percent, 50);
    assert.equal(segs[1]!.percent, 30);
    assert.equal(segs[2]!.percent, 20);
    for (const s of segs) {
      assert.ok(s.path.length > 0, "segment path should be non-empty");
      assert.ok(s.path.startsWith("M"));
      assert.ok(s.endAngle > s.startAngle);
    }
    // Full circle coverage (no pad)
    const span = segs[segs.length - 1]!.endAngle - segs[0]!.startAngle;
    assert.ok(Math.abs(span - Math.PI * 2) < 1e-9);
  });

  it("returns empty segments when total is zero", () => {
    assert.deepEqual(
      donutSegments([0, 0], { cx: 10, cy: 10, outerRadius: 8, innerRadius: 4 }),
      [],
    );
  });

  it("single 100% segment with padAngle 0 yields non-degenerate full-circle path", () => {
    const segs = donutSegments([{ label: "All", value: 100 }], {
      cx: 50,
      cy: 50,
      outerRadius: 40,
      innerRadius: 24,
      padAngle: 0,
    });
    assert.equal(segs.length, 1);
    assert.equal(segs[0]!.percent, 100);
    const path = segs[0]!.path;
    assert.ok(path.length > 0, "path must be non-empty");
    // Full circle must use two half-arcs (four A commands: 2 outer + 2 inner).
    // Degenerate SVG form is a single A with start==end (paints nothing).
    const arcCount = (path.match(/ A /g) ?? []).length;
    assert.ok(
      arcCount >= 4,
      `expected ≥4 arc commands for full donut, got ${arcCount}: ${path}`,
    );
    // Start at 12 o'clock (50, 10); opposite mid on outer ring (50, 90)
    assert.ok(path.includes("50 10"), `path should include start: ${path}`);
    assert.ok(
      path.includes("50 90"),
      `path should include outer midpoint (non-degenerate): ${path}`,
    );
    // First arc must travel to the midpoint, not immediately back to start
    assert.match(path, /^M 50 10 A 40 40 0 1 1 50 90 /);
  });

  it("donutSlicePath full sweep uses two half-arcs (solid and donut)", () => {
    const fullDonut = donutSlicePath(50, 50, 40, 24, 0, Math.PI * 2);
    assert.ok(fullDonut.startsWith("M "));
    assert.ok((fullDonut.match(/ A /g) ?? []).length >= 4);
    assert.ok(fullDonut.includes("50 10"));
    assert.ok(fullDonut.includes("50 90"));
    assert.match(fullDonut, /^M 50 10 A 40 40 0 1 1 50 90 /);

    const fullPie = donutSlicePath(0, 0, 10, 0, 0, Math.PI * 2);
    assert.ok((fullPie.match(/ A /g) ?? []).length >= 2);
    assert.ok(fullPie.endsWith(" Z") || fullPie.endsWith("Z"));
  });

  it("donutSlicePath and describeArc produce SVG commands", () => {
    const slice = donutSlicePath(0, 0, 10, 5, 0, Math.PI / 2);
    assert.ok(slice.includes("A"));
    assert.ok(slice.includes("Z"));
    const arc = describeArc(0, 0, 10, 0, Math.PI);
    assert.ok(arc.startsWith("M"));
    assert.ok(arc.includes("A"));
    const full = describeArc(0, 0, 10, 0, Math.PI * 2);
    assert.ok((full.match(/ A /g) ?? []).length >= 2);
  });

  it("polarToCartesian at 0 rad is top of circle", () => {
    const p = polarToCartesian(0, 0, 10, 0);
    assert.equal(p.x, 0);
    assert.equal(p.y, -10);
  });
});

describe("chartColorAt", () => {
  it("cycles palette", () => {
    assert.equal(chartColorAt(0, ["a", "b"]), "a");
    assert.equal(chartColorAt(1, ["a", "b"]), "b");
    assert.equal(chartColorAt(2, ["a", "b"]), "a");
  });
});

describe("chart period helpers", () => {
  const fixedNow = new Date("2026-06-15T12:00:00.000Z").getTime();

  it("periodStartMs computes bounds for presets", () => {
    assert.equal(periodStartMs("all", fixedNow), null);
    assert.equal(
      periodStartMs("7d", fixedNow),
      fixedNow - 7 * 24 * 60 * 60 * 1000,
    );
    assert.equal(
      periodStartMs("30d", fixedNow),
      fixedNow - 30 * 24 * 60 * 60 * 1000,
    );
    const ytd = periodStartMs("ytd", fixedNow);
    assert.equal(ytd, new Date(2026, 0, 1).getTime());
    assert.equal(periodDaySpan("7d"), 7);
    assert.equal(periodDaySpan("all"), null);
  });

  it("filterTimeSeriesByPeriod keeps points inside window", () => {
    const data = [
      { label: "a", value: 1, date: "2026-06-01T00:00:00.000Z" },
      { label: "b", value: 2, date: "2026-06-10T00:00:00.000Z" },
      { label: "c", value: 3, date: "2026-06-14T00:00:00.000Z" },
      { label: "d", value: 4, date: "2026-05-01T00:00:00.000Z" },
    ];
    const week = filterTimeSeriesByPeriod(data, "7d", fixedNow);
    assert.deepEqual(
      week.map((d) => d.label),
      ["b", "c"],
    );
    assert.equal(filterTimeSeriesByPeriod(data, "all", fixedNow).length, 4);
  });

  it("sliceSeriesForPeriod truncates undated series by span", () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert.deepEqual(sliceSeriesForPeriod(nums, "7d"), [4, 5, 6, 7, 8, 9, 10]);
    assert.deepEqual(sliceSeriesForPeriod(nums, "all"), nums);
  });

  it("applyChartPeriod prefers dates when present", () => {
    const dated = [
      { value: 1, date: "2026-06-14T00:00:00.000Z" },
      { value: 2, date: "2026-01-01T00:00:00.000Z" },
    ];
    assert.equal(applyChartPeriod(dated, "7d", fixedNow).length, 1);
    const undated = [{ value: 1 }, { value: 2 }, { value: 3 }];
    assert.equal(applyChartPeriod(undated, "7d", fixedNow).length, 3);
  });
});

describe("bar / stacked / radar / funnel layout", () => {
  it("layoutVerticalBars produces positive-height rects", () => {
    const bars = layoutVerticalBars([10, 20, 5], 100, 50, {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
    assert.equal(bars.length, 3);
    assert.ok(bars.every((b) => b.height > 0 || b.value === 0));
    assert.ok(bars[1]!.height > bars[0]!.height);
    assert.equal(bars[0]!.x < bars[1]!.x, true);
  });

  it("layoutHorizontalBars grows width by value", () => {
    const bars = layoutHorizontalBars(
      [
        { label: "A", value: 10 },
        { label: "B", value: 30 },
      ],
      100,
      40,
      { top: 0, right: 0, bottom: 0, left: 0 },
    );
    assert.equal(bars.length, 2);
    assert.ok(bars[1]!.width > bars[0]!.width);
  });

  it("layoutStackedBars stacks series per category", () => {
    const segs = layoutStackedBars(
      ["Mon", "Tue"],
      [
        { key: "a", values: [10, 20] },
        { key: "b", values: [5, 10] },
      ],
      100,
      50,
      { top: 0, right: 0, bottom: 0, left: 0 },
    );
    assert.equal(segs.length, 4);
    const mon = segs.filter((s) => s.categoryIndex === 0);
    assert.equal(mon.length, 2);
    assert.equal(mon[0]!.value + mon[1]!.value, 15);
    // Stacked segments share x and stack upward (smaller y on top of larger)
    assert.equal(mon[0]!.x, mon[1]!.x);
  });

  it("layoutRadarPoints and polygon path are non-empty", () => {
    const pts = layoutRadarPoints(
      [
        { label: "Speed", value: 80 },
        { label: "Power", value: 60 },
        { label: "Range", value: 90 },
      ],
      50,
      50,
      40,
      { maxValue: 100 },
    );
    assert.equal(pts.length, 3);
    assert.ok(pts.every((p) => p.ratio > 0 && p.ratio <= 1));
    const poly = pointsToPolygonPath(pts);
    assert.ok(poly.startsWith("M"));
    assert.ok(poly.endsWith("Z") || poly.endsWith(" Z"));
  });

  it("layoutFunnelStages tapers and keeps paths", () => {
    const stages = layoutFunnelStages(
      [
        { label: "Visit", value: 1000 },
        { label: "Signup", value: 400 },
        { label: "Pay", value: 120 },
      ],
      200,
      150,
      { top: 0, right: 0, bottom: 0, left: 0 },
    );
    assert.equal(stages.length, 3);
    assert.equal(stages[0]!.percentOfFirst, 100);
    assert.ok(stages[0]!.topWidth >= stages[1]!.topWidth);
    assert.ok(stages[1]!.topWidth >= stages[2]!.topWidth);
    for (const s of stages) {
      assert.ok(s.path.includes("Z"));
    }
  });
});
