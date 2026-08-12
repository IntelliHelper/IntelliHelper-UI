/**
 * Ship-path checks for Tier 4 charts (tree-map / sankey / gauge).
 * Drives pure helpers from the shipped chart-utils module and asserts
 * package exports + component modules are wired like prior charts.
 *
 * Runs with: node --experimental-strip-types --test packages/ui/src/__tests__/tier4-charts-ship.test.mts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  layoutGauge,
  layoutSankey,
  layoutTreeMap,
  treeMapNodeValue,
} from "../chart-utils.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.resolve(here, "../..");
const srcRoot = path.join(uiRoot, "src");

function readSrc(name: string): string {
  return fs.readFileSync(path.join(srcRoot, name), "utf8");
}

describe("Tier 4 package exports map to real files", () => {
  it("package.json exports tree-map, sankey, gauge", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(uiRoot, "package.json"), "utf8"),
    ) as { exports: Record<string, string> };
    for (const slug of ["tree-map", "sankey", "gauge"] as const) {
      const key = `./${slug}`;
      assert.ok(pkg.exports[key], `missing export ${key}`);
      const target = pkg.exports[key]!;
      const abs = path.join(uiRoot, target.replace(/^\.\//, ""));
      assert.ok(fs.existsSync(abs), `export target missing: ${abs}`);
    }
  });

  it("index.ts re-exports components and layout helpers", () => {
    const index = readSrc("index.ts");
    assert.match(index, /from "\.\/tree-map"/);
    assert.match(index, /from "\.\/sankey"/);
    assert.match(index, /from "\.\/gauge"/);
    assert.match(index, /\bTreeMap\b/);
    assert.match(index, /\bSankey\b/);
    assert.match(index, /\bGauge\b/);
    assert.match(index, /\blayoutTreeMap\b/);
    assert.match(index, /\blayoutSankey\b/);
    assert.match(index, /\blayoutGauge\b/);
  });
});

describe("Tier 4 component modules (structural + helper wiring)", () => {
  it("TreeMap is a glass chart shell that calls layoutTreeMap", () => {
    const src = readSrc("tree-map.tsx");
    assert.match(src, /const TreeMap = forwardRef/);
    assert.match(src, /treeMapVariants/);
    assert.match(src, /chrome:/);
    assert.match(src, /outline:/);
    assert.match(src, /bare:/);
    assert.match(src, /role="img"/);
    assert.match(src, /No data/);
    assert.match(src, /layoutTreeMap\(/);
    assert.match(src, /export \{ TreeMap, treeMapVariants \}/);
    assert.match(src, /displayName = "TreeMap"/);
  });

  it("Sankey is a glass chart shell that calls layoutSankey", () => {
    const src = readSrc("sankey.tsx");
    assert.match(src, /const Sankey = forwardRef/);
    assert.match(src, /sankeyVariants/);
    assert.match(src, /chrome:/);
    assert.match(src, /outline:/);
    assert.match(src, /bare:/);
    assert.match(src, /role="img"/);
    assert.match(src, /No data/);
    assert.match(src, /layoutSankey\(/);
    assert.match(src, /export \{ Sankey, sankeyVariants \}/);
    assert.match(src, /displayName = "Sankey"/);
  });

  it("Gauge is a glass chart shell that calls layoutGauge", () => {
    const src = readSrc("gauge.tsx");
    assert.match(src, /const Gauge = forwardRef/);
    assert.match(src, /gaugeVariants/);
    assert.match(src, /chrome:/);
    assert.match(src, /outline:/);
    assert.match(src, /bare:/);
    assert.match(src, /role="img"/);
    assert.match(src, /layoutGauge\(/);
    assert.match(src, /export \{ Gauge, gaugeVariants \}/);
    assert.match(src, /displayName = "Gauge"/);
  });
});

describe("Tier 4 shipped helpers (live path)", () => {
  it("layoutTreeMap areas follow hierarchy values", () => {
    assert.equal(
      treeMapNodeValue({
        name: "r",
        children: [
          { name: "a", value: 3 },
          { name: "b", value: 1 },
        ],
      }),
      4,
    );
    const tiles = layoutTreeMap(
      {
        name: "r",
        children: [
          { name: "a", value: 3 },
          { name: "b", value: 1 },
        ],
      },
      100,
      40,
      { top: 0, right: 0, bottom: 0, left: 0 },
      { gap: 0 },
    );
    assert.equal(tiles.length, 2);
    const a = tiles.find((t) => t.name === "a")!;
    const b = tiles.find((t) => t.name === "b")!;
    assert.ok(a && b);
    const ratio = (a.width * a.height) / (b.width * b.height);
    assert.ok(Math.abs(ratio - 3) < 0.08, `area ratio ${ratio}`);
  });

  it("layoutSankey produces multi-column flow with path ribbons", () => {
    const layout = layoutSankey(
      [
        { id: "in" },
        { id: "mid" },
        { id: "out" },
      ],
      [
        { source: "in", target: "mid", value: 10 },
        { source: "mid", target: "out", value: 7 },
        { source: "in", target: "out", value: 3 },
      ],
      200,
      100,
      { top: 0, right: 0, bottom: 0, left: 0 },
    );
    assert.equal(layout.nodes.length, 3);
    assert.equal(layout.links.length, 3);
    assert.ok(layout.columns >= 2);
    for (const link of layout.links) {
      assert.ok(link.path.startsWith("M "));
      assert.ok(link.width > 0);
    }
    const direct = layout.links.find(
      (l) => l.source === "in" && l.target === "out",
    )!;
    const viaMid = layout.links.find(
      (l) => l.source === "in" && l.target === "mid",
    )!;
    assert.ok(viaMid.width > direct.width);
  });

  it("layoutGauge maps domain and clamps edges", () => {
    const mid = layoutGauge(50, 0, 100, 180, 100);
    assert.ok(mid);
    assert.equal(mid!.t, 0.5);
    assert.ok(mid!.needlePath.startsWith("M "));
    assert.ok(mid!.trackPath.length > 0);

    const hi = layoutGauge(999, 0, 100, 180, 100);
    assert.equal(hi!.clampedValue, 100);
    assert.equal(hi!.t, 1);

    const lo = layoutGauge(-5, 0, 100, 180, 100);
    assert.equal(lo!.clampedValue, 0);
    assert.equal(lo!.t, 0);

    const bands = layoutGauge(40, 0, 100, 180, 100, {}, {
      thresholds: [{ value: 30, color: "a" }, { value: 60, color: "b" }],
    });
    assert.ok(bands!.bands.length >= 2);
    assert.equal(bands!.bands[0]!.to, 30);
  });
});
