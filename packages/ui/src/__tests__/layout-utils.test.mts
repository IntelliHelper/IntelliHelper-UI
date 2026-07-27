/**
 * Unit tests for layout primitive spacing / grid class maps.
 * Runs with: node --experimental-strip-types --test packages/ui/src/__tests__/layout-utils.test.mts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  layoutAlignClass,
  layoutColsClass,
  layoutGapClass,
  layoutJustifyClass,
} from "../layout-utils.ts";

describe("layoutGapClass", () => {
  it("returns undefined when gap is omitted", () => {
    assert.equal(layoutGapClass(undefined), undefined);
  });

  it("maps scale tokens to Tailwind gap classes", () => {
    assert.equal(layoutGapClass(0), "gap-0");
    assert.equal(layoutGapClass(0.5), "gap-0.5");
    assert.equal(layoutGapClass(2), "gap-2");
    assert.equal(layoutGapClass(4), "gap-4");
    assert.equal(layoutGapClass(7), "gap-7");
    assert.equal(layoutGapClass(28), "gap-28");
  });
});

describe("layoutAlignClass / layoutJustifyClass", () => {
  it("maps align tokens", () => {
    assert.equal(layoutAlignClass("start"), "items-start");
    assert.equal(layoutAlignClass("center"), "items-center");
    assert.equal(layoutAlignClass("stretch"), "items-stretch");
    assert.equal(layoutAlignClass(undefined), undefined);
  });

  it("maps justify tokens", () => {
    assert.equal(layoutJustifyClass("between"), "justify-between");
    assert.equal(layoutJustifyClass("evenly"), "justify-evenly");
    assert.equal(layoutJustifyClass(undefined), undefined);
  });
});

describe("layoutColsClass", () => {
  it("builds responsive grid column classes", () => {
    assert.equal(layoutColsClass(1), "grid-cols-1");
    assert.equal(
      layoutColsClass(1, undefined, 2, 3),
      "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    );
    assert.equal(
      layoutColsClass(1, 2, 3, 4),
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    );
  });
});
