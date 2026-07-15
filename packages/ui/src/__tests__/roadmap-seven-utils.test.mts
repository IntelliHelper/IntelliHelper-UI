/**
 * Unit tests for pure utilities used by the seven roadmap components.
 * Runs with: node --experimental-strip-types --test packages/ui/src/__tests__/roadmap-seven-utils.test.mts
 *
 * Imports real shipped modules — does not re-implement filter/step/file/copy logic.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  filterItems,
  resolveItemLabel,
} from "../filter-items.ts";
import { clampActiveStep, getStepStatus } from "../stepper-utils.ts";
import {
  fileMatchesAccept,
  filterAcceptedFiles,
  formatFileSize,
  normalizeAccept,
} from "../file-upload-utils.ts";
import { copyText } from "../copy-text.ts";
import { nextThemeMode } from "../theme-mode.ts";
import { orderCommandItemsByGroup } from "../command-utils.ts";

// Note: .ts extensions required for Node --experimental-strip-types resolution.

describe("filterItems (combobox + command)", () => {
  const items = [
    { value: "next", label: "Next.js", keywords: ["react", "vercel"] },
    { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
    { value: "astro", label: "Astro", keywords: ["static"] },
  ] as const;

  it("returns all items when query is empty", () => {
    assert.equal(filterItems(items, "").length, 3);
    assert.equal(filterItems(items, "   ").length, 3);
  });

  it("filters by label (case-insensitive)", () => {
    const result = filterItems(items, "next");
    assert.deepEqual(
      result.map((i) => i.value),
      ["next"],
    );
  });

  it("filters by keyword", () => {
    const result = filterItems(items, "vue");
    assert.equal(result.length, 1);
    assert.equal(result[0]!.value, "nuxt");
  });

  it("filters by value", () => {
    const result = filterItems(items, "astro");
    assert.equal(result[0]!.label, "Astro");
  });

  it("resolveItemLabel returns label or raw value", () => {
    assert.equal(resolveItemLabel(items, "next"), "Next.js");
    assert.equal(resolveItemLabel(items, "missing"), "missing");
    assert.equal(resolveItemLabel(items, ""), "");
  });
});

describe("stepper utils", () => {
  it("getStepStatus maps completed/active/upcoming", () => {
    assert.equal(getStepStatus(0, 2), "completed");
    assert.equal(getStepStatus(2, 2), "active");
    assert.equal(getStepStatus(3, 2), "upcoming");
  });

  it("clampActiveStep clamps into range", () => {
    assert.equal(clampActiveStep(-3, 4), 0);
    assert.equal(clampActiveStep(99, 4), 3);
    assert.equal(clampActiveStep(1.9, 4), 1);
    assert.equal(clampActiveStep(0, 0), 0);
  });
});

describe("file-upload utils", () => {
  it("normalizeAccept splits and lowercases", () => {
    assert.deepEqual(normalizeAccept(".PNG, image/*"), [".png", "image/*"]);
    assert.deepEqual(normalizeAccept([".Pdf", "TEXT/plain"]), [
      ".pdf",
      "text/plain",
    ]);
  });

  it("fileMatchesAccept honors extensions and mime wildcards", () => {
    const png = new File([""], "photo.PNG", { type: "image/png" });
    const pdf = new File([""], "doc.pdf", { type: "application/pdf" });
    assert.equal(fileMatchesAccept(png, "image/*"), true);
    assert.equal(fileMatchesAccept(png, ".png"), true);
    assert.equal(fileMatchesAccept(pdf, "image/*"), false);
    assert.equal(fileMatchesAccept(pdf, undefined), true);
  });

  it("filterAcceptedFiles splits accepted vs rejected by size", () => {
    const small = new File(["a"], "a.txt", { type: "text/plain" });
    const large = new File([new Uint8Array(100)], "b.txt", {
      type: "text/plain",
    });
    const { accepted, rejected } = filterAcceptedFiles([small, large], {
      maxSize: 10,
    });
    assert.equal(accepted.length, 1);
    assert.equal(accepted[0]!.name, "a.txt");
    assert.equal(rejected.length, 1);
    assert.equal(rejected[0]!.name, "b.txt");
  });

  it("formatFileSize formats bytes", () => {
    assert.equal(formatFileSize(0), "0 B");
    assert.equal(formatFileSize(512), "512 B");
    assert.match(formatFileSize(2048), /KB/);
  });
});

describe("theme nextThemeMode", () => {
  it("flips light and dark", () => {
    assert.equal(nextThemeMode("light"), "dark");
    assert.equal(nextThemeMode("dark"), "light");
  });
});

describe("orderCommandItemsByGroup (command keyboard = paint order)", () => {
  it("flattens interleaved groups so highlight index matches render", () => {
    // Source filter order: B, A, B — paint groups as B-bucket then A-bucket.
    const items = [
      { value: "b1", label: "B1", group: "B" },
      { value: "a1", label: "A1", group: "A" },
      { value: "b2", label: "B2", group: "B" },
    ];
    const { flat, groups } = orderCommandItemsByGroup(items);

    assert.deepEqual(
      groups.map((g) => g.key),
      ["B", "A"],
    );
    assert.deepEqual(
      flat.map((i) => i.value),
      ["b1", "b2", "a1"],
    );

    // Simulate ArrowDown to index 1 then Enter → must be b2 (painted second), not a1.
    const highlight = 1;
    assert.equal(flat[highlight]!.value, "b2");
    assert.equal(flat[highlight]!.value, groups[0]!.items[1]!.value);
  });
});

describe("copyText", () => {
  it("uses navigator.clipboard.writeText when available", async () => {
    const writes: string[] = [];
    const original = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: {
        clipboard: {
          writeText: async (text: string) => {
            writes.push(text);
          },
        },
      },
    });

    try {
      const ok = await copyText("hello-roadmap");
      assert.equal(ok, true);
      assert.deepEqual(writes, ["hello-roadmap"]);
    } finally {
      Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: original,
      });
    }
  });

  it("returns false for non-string input", async () => {
    // @ts-expect-error intentional bad input
    assert.equal(await copyText(null), false);
  });
});
