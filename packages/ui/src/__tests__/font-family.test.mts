import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_FONT_ID,
  DEFAULT_FONTS,
  findFontOption,
} from "../font-family.ts";

describe("font-family", () => {
  it("lists unique ids and stacks", () => {
    const ids = DEFAULT_FONTS.map((font) => font.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const font of DEFAULT_FONTS) {
      assert.ok(font.stack.length > 0);
      assert.ok(["sans", "serif", "mono"].includes(font.category));
    }
  });

  it("finds default and known fonts", () => {
    assert.equal(findFontOption(DEFAULT_FONT_ID)?.id, "sans");
    assert.equal(findFontOption("georgia")?.category, "serif");
    assert.equal(findFontOption("missing"), undefined);
  });
});
