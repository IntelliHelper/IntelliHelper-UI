/**
 * Unit tests for pure utilities used by Tier 1 remaining + Tier 2 components.
 * Runs with: node --experimental-strip-types --test packages/ui/src/__tests__/tier12-utils.test.mts
 *
 * Imports real shipped modules — does not re-implement logic under test.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  areAllSelected,
  clearMultiSelectValues,
  removeMultiSelectValue,
  resolveMultiSelectLabels,
  toggleMultiSelectValue,
} from "../multi-select-utils.ts";
import {
  countUnread,
  dismissAllNotifications,
  dismissNotification,
  filterNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  sortNotifications,
  type NotificationItem,
} from "../notification-utils.ts";
import {
  formatJson,
  formatLineNumber,
  isValidJson,
  normalizeLanguage,
  parseAndFormatJson,
  splitCodeLines,
} from "../code-format.ts";
import {
  appendStreamChunk,
  estimateTokens,
  filterPromptSuggestions,
  formatTokenCount,
  joinStreamChunks,
  sortConversations,
} from "../ai-utils.ts";

describe("multi-select utils", () => {
  it("toggleMultiSelectValue adds and removes values", () => {
    assert.deepEqual(toggleMultiSelectValue([], "a"), ["a"]);
    assert.deepEqual(toggleMultiSelectValue(["a", "b"], "a"), ["b"]);
    assert.deepEqual(toggleMultiSelectValue(["a"], "b"), ["a", "b"]);
  });

  it("toggleMultiSelectValue respects max and disabled", () => {
    assert.deepEqual(
      toggleMultiSelectValue(["a"], "b", { max: 1 }),
      ["a"],
    );
    assert.deepEqual(
      toggleMultiSelectValue(["a"], "x", { disabledValues: ["x"] }),
      ["a"],
    );
    assert.deepEqual(toggleMultiSelectValue(["a"], ""), ["a"]);
  });

  it("remove and clear selection", () => {
    assert.deepEqual(removeMultiSelectValue(["a", "b", "c"], "b"), ["a", "c"]);
    assert.deepEqual(clearMultiSelectValues(), []);
  });

  it("resolveMultiSelectLabels and areAllSelected", () => {
    const options = [
      { value: "ts", label: "TypeScript" },
      { value: "py", label: "Python" },
    ];
    assert.deepEqual(resolveMultiSelectLabels(options, ["py", "ts", "go"]), [
      "Python",
      "TypeScript",
      "go",
    ]);
    assert.equal(areAllSelected(["a", "b", "c"], ["a", "c"]), true);
    assert.equal(areAllSelected(["a"], ["a", "b"]), false);
    assert.equal(areAllSelected(["a"], []), false);
  });
});

describe("notification utils", () => {
  const base: NotificationItem[] = [
    {
      id: "1",
      title: "A",
      createdAt: 100,
      status: "unread",
      category: "sys",
    },
    {
      id: "2",
      title: "B",
      createdAt: 300,
      status: "read",
      category: "social",
    },
    {
      id: "3",
      title: "C",
      createdAt: 200,
      status: "unread",
      category: "sys",
    },
  ];

  it("countUnread and mark read ops", () => {
    assert.equal(countUnread(base), 2);
    const one = markNotificationRead(base, "1");
    assert.equal(countUnread(one), 1);
    assert.equal(one.find((i) => i.id === "1")?.status, "read");
    const all = markAllNotificationsRead(base);
    assert.equal(countUnread(all), 0);
  });

  it("dismiss and dismiss all", () => {
    assert.equal(dismissNotification(base, "2").length, 2);
    assert.deepEqual(dismissAllNotifications(), []);
  });

  it("sort unread-first then newest", () => {
    const sorted = sortNotifications(base, { unreadFirst: true });
    assert.deepEqual(
      sorted.map((i) => i.id),
      ["3", "1", "2"],
    );
  });

  it("filter by status and category", () => {
    const unread = filterNotifications(base, { status: "unread" });
    assert.equal(unread.length, 2);
    const sys = filterNotifications(base, { category: "sys" });
    assert.equal(sys.length, 2);
  });
});

describe("code-format utils", () => {
  it("formatJson pretty-prints valid JSON", () => {
    const out = formatJson('{"a":1,"b":[2]}');
    assert.ok(out);
    assert.match(out!, /"a": 1/);
    assert.equal(formatJson("{nope"), null);
  });

  it("parseAndFormatJson returns ok/error", () => {
    const ok = parseAndFormatJson('{"x":true}');
    assert.equal(ok.ok, true);
    if (ok.ok) {
      assert.equal((ok.value as { x: boolean }).x, true);
      assert.match(ok.formatted, /"x": true/);
    }
    const bad = parseAndFormatJson("{");
    assert.equal(bad.ok, false);
    if (!bad.ok) {
      assert.ok(bad.error.length > 0);
    }
  });

  it("isValidJson, splitCodeLines, formatLineNumber, normalizeLanguage", () => {
    assert.equal(isValidJson("[1,2]"), true);
    assert.equal(isValidJson("nope"), false);
    assert.deepEqual(splitCodeLines("a\nb\n"), ["a", "b", ""]);
    assert.deepEqual(splitCodeLines(""), [""]);
    assert.equal(formatLineNumber(0, 12), " 1");
    assert.equal(formatLineNumber(9, 12), "10");
    assert.equal(normalizeLanguage("language-TS"), "ts");
    assert.equal(normalizeLanguage(null), "text");
  });
});

describe("ai-utils", () => {
  it("estimateTokens is non-zero for real text and zero for empty", () => {
    assert.equal(estimateTokens(""), 0);
    assert.equal(estimateTokens("   "), 0);
    const short = estimateTokens("hello world");
    assert.ok(short >= 2);
    const long = estimateTokens("word ".repeat(50));
    assert.ok(long > short);
  });

  it("formatTokenCount scales", () => {
    assert.equal(formatTokenCount(42), "42");
    assert.equal(formatTokenCount(1500), "1.5k");
    assert.equal(formatTokenCount(12_000), "12k");
    assert.equal(formatTokenCount(-1), "0");
  });

  it("appendStreamChunk and joinStreamChunks", () => {
    assert.equal(appendStreamChunk("Hel", "lo"), "Hello");
    assert.equal(appendStreamChunk("Hel", ""), "Hel");
    assert.equal(appendStreamChunk("Hel", null), "Hel");
    assert.equal(joinStreamChunks(["a", "b", "c"]), "abc");
  });

  it("filterPromptSuggestions and sortConversations", () => {
    const suggestions = [
      {
        id: "1",
        label: "Explain glass",
        prompt: "Explain liquid glass",
        keywords: ["design"],
      },
      {
        id: "2",
        label: "Scaffold form",
        prompt: "Build a form",
        keywords: ["forms"],
      },
    ];
    assert.equal(filterPromptSuggestions(suggestions, "").length, 2);
    assert.equal(filterPromptSuggestions(suggestions, "form").length, 1);
    assert.equal(filterPromptSuggestions(suggestions, "design")[0]!.id, "1");

    const convos = [
      { id: "a", title: "A", updatedAt: 1, pinned: false },
      { id: "b", title: "B", updatedAt: 3, pinned: true },
      { id: "c", title: "C", updatedAt: 2, pinned: false },
    ];
    assert.deepEqual(
      sortConversations(convos).map((c) => c.id),
      ["b", "c", "a"],
    );
  });
});
