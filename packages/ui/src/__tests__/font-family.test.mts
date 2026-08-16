import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_FONT_ID,
  DEFAULT_FONTS,
  fallbackFontId,
  findFontOption,
  resolveFontId,
  type FontOption,
} from "../font-family.ts";

const customFonts: FontOption[] = [
  {
    id: "display",
    label: "Display",
    stack: "Georgia, serif",
    category: "serif",
  },
  {
    id: "code",
    label: "Code",
    stack: "Menlo, monospace",
    category: "mono",
  },
];

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

  it("falls back to the first custom font when sans is absent", () => {
    assert.equal(fallbackFontId(customFonts), "display");
    assert.equal(resolveFontId(undefined, customFonts), "display");
    assert.equal(resolveFontId("sans", customFonts), "display");
    assert.equal(resolveFontId("code", customFonts), "code");
  });
});
