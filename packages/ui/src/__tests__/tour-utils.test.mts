import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  centerTourCard,
  chooseTourSide,
  clampTourIndex,
  inflateRect,
  placeTourCard,
} from "../tour-utils.ts";

const viewport = { width: 1000, height: 800 };
const card = { width: 320, height: 160 };

describe("inflateRect", () => {
  it("grows a rect by padding on every side", () => {
    assert.deepEqual(inflateRect({ top: 40, left: 50, width: 100, height: 20 }, 8), {
      top: 32,
      left: 42,
      width: 116,
      height: 36,
    });
  });
});

describe("clampTourIndex", () => {
  it("clamps to the last step and treats an empty tour as index 0", () => {
    assert.equal(clampTourIndex(4, 3), 2);
    assert.equal(clampTourIndex(-2, 3), 0);
    assert.equal(clampTourIndex(1, 0), 0);
  });
});

describe("chooseTourSide", () => {
  it("keeps a preferred side that fits", () => {
    const target = { top: 100, left: 100, width: 80, height: 40 };
    assert.equal(chooseTourSide(target, card, viewport, "right", 12), "right");
  });

  it("flips when the preferred side does not fit", () => {
    const target = { top: 700, left: 100, width: 80, height: 40 };
    assert.equal(chooseTourSide(target, card, viewport, "bottom", 12), "top");
  });

  it("picks the side with the most room when nothing fits", () => {
    const target = { top: 10, left: 10, width: 20, height: 20 };
    const tight = { width: 200, height: 200 };
    const huge = { width: 900, height: 700 };
    assert.equal(chooseTourSide(target, huge, tight, "auto", 12), "bottom");
  });
});

describe("placeTourCard", () => {
  it("centers the card under the target", () => {
    const target = { top: 80, left: 200, width: 100, height: 40 };
    const placed = placeTourCard(target, card, viewport, "bottom", "center", 12, 16);
    assert.equal(placed.side, "bottom");
    assert.equal(placed.top, 132);
    assert.equal(placed.left, 90);
  });

  it("aligns to the start and clamps inside the viewport", () => {
    const target = { top: 40, left: 4, width: 40, height: 20 };
    const placed = placeTourCard(target, card, viewport, "bottom", "start", 12, 16);
    assert.equal(placed.left, 16);
  });
});

describe("centerTourCard", () => {
  it("centers a card when the target is missing", () => {
    assert.deepEqual(centerTourCard(card, viewport, 16), {
      top: 320,
      left: 340,
    });
  });
});
