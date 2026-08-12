/**
 * Unit tests for Tier 3 pure utilities.
 * Runs with: node --experimental-strip-types --test packages/ui/src/__tests__/tier3-utils.test.mts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  clampNumber,
  clampRating,
  compareCellValues,
  computeVirtualWindow,
  currencySymbol,
  filterDataGridRows,
  formatCurrencyValue,
  formatPhoneDisplay,
  formatTimeValue,
  groupKanbanCards,
  isValidHexColor,
  moveKanbanCard,
  normalizeHexColor,
  normalizeMonthValue,
  normalizeTimeValue,
  parseNumericInput,
  parseTimeString,
  processDataGridRows,
  ratingStars,
  roundToStep,
  sanitizePhoneDigits,
  sortDataGridRows,
  toggleRowSelection,
  toggleSelectAll,
  toggleSortState,
  type DataGridColumnDef,
  type KanbanCard,
  type KanbanColumn,
} from "../tier3-utils.ts";

describe("number utils", () => {
  it("clampNumber and roundToStep", () => {
    assert.equal(clampNumber(5, 0, 10), 5);
    assert.equal(clampNumber(-1, 0, 10), 0);
    assert.equal(clampNumber(99, 0, 10), 10);
    assert.equal(roundToStep(1.24, 0.1), 1.2);
    assert.equal(roundToStep(1.26, 0.1), 1.3);
  });

  it("parseNumericInput", () => {
    assert.equal(parseNumericInput("12.5"), 12.5);
    assert.equal(parseNumericInput("$1,200"), 1200);
    assert.equal(parseNumericInput(""), null);
    assert.equal(parseNumericInput("-"), null);
  });

  it("currency helpers", () => {
    assert.ok(currencySymbol("USD").includes("$") || currencySymbol("USD") === "USD");
    assert.ok(formatCurrencyValue(12.5, { currency: "USD" }).length > 0);
  });
});

describe("phone utils", () => {
  it("sanitize and format", () => {
    assert.equal(sanitizePhoneDigits("+1 (415) 555-0100"), "+14155550100");
    assert.equal(formatPhoneDisplay("4155550100"), "(415) 555-0100");
    assert.equal(formatPhoneDisplay("+14155550100").startsWith("+"), true);
  });
});

describe("country-data international support", () => {
  it("includes a large country and currency catalog", async () => {
    const {
      COUNTRIES,
      CURRENCIES,
      getCountry,
      getCurrency,
      toE164,
      parseE164,
      formatNationalNumber,
      searchCountries,
      searchCurrencies,
      defaultLocaleForCurrency,
    } = await import("../country-data.ts");

    assert.ok(COUNTRIES.length >= 200, `countries=${COUNTRIES.length}`);
    assert.ok(CURRENCIES.length >= 100, `currencies=${CURRENCIES.length}`);
    assert.equal(getCountry("IN")?.dialCode, "91");
    assert.equal(getCountry("GB")?.currency, "GBP");
    assert.equal(getCurrency("EUR")?.code, "EUR");
    assert.equal(getCurrency("JPY")?.decimals, 0);

    assert.equal(toE164("4155550100", getCountry("US")!), "+14155550100");
    assert.equal(toE164("9876543210", getCountry("IN")!), "+919876543210");

    const us = parseE164("+14155550100", "US");
    assert.equal(us.country.iso2, "US");
    assert.equal(us.national, "4155550100");

    const inParsed = parseE164("+919876543210", "IN");
    assert.equal(inParsed.country.iso2, "IN");
    assert.equal(inParsed.national, "9876543210");

    assert.equal(
      formatNationalNumber("4155550100", getCountry("US")!),
      "415 555 0100",
    );
    assert.equal(
      formatNationalNumber("9876543210", getCountry("IN")!),
      "98765 43210",
    );

    assert.ok(searchCountries("india").some((c) => c.iso2 === "IN"));
    assert.ok(searchCountries("+44").some((c) => c.iso2 === "GB"));
    assert.ok(searchCurrencies("yen").some((c) => c.code === "JPY"));
    assert.ok(searchCurrencies("eur").some((c) => c.code === "EUR"));
    assert.equal(defaultLocaleForCurrency("JPY"), "ja-JP");
  });
});

describe("color utils", () => {
  it("normalizeHexColor", () => {
    assert.equal(normalizeHexColor("#abc"), "#aabbcc");
    assert.equal(normalizeHexColor("FF0000"), "#ff0000");
    assert.equal(normalizeHexColor("nope"), null);
    assert.equal(isValidHexColor("#00ff00"), true);
  });
});

describe("rating utils", () => {
  it("clampRating and ratingStars", () => {
    assert.equal(clampRating(3.7, 5, true), 3.5);
    assert.equal(clampRating(9, 5), 5);
    assert.deepEqual(ratingStars(3.5, 5), [
      "full",
      "full",
      "full",
      "half",
      "empty",
    ]);
  });
});

describe("time utils", () => {
  it("normalize and format 24h", () => {
    const t = normalizeTimeValue({ hours: 14, minutes: 5 }, false);
    assert.equal(formatTimeValue(t, { hour12: false }), "14:05");
  });

  it("parseTimeString 12h and 24h", () => {
    assert.deepEqual(parseTimeString("14:30"), {
      hours: 14,
      minutes: 30,
    });
    assert.equal(parseTimeString("2:30 PM")?.hours, 14);
    assert.equal(parseTimeString("12:00 AM")?.hours, 0);
    assert.equal(parseTimeString("bogus"), null);
  });
});

describe("month utils", () => {
  it("normalizeMonthValue rolls overflow", () => {
    assert.deepEqual(normalizeMonthValue({ year: 2024, month: 12 }), {
      year: 2025,
      month: 0,
    });
    assert.deepEqual(normalizeMonthValue({ year: 2024, month: -1 }), {
      year: 2023,
      month: 11,
    });
  });
});

describe("data grid utils", () => {
  type Row = { id: string; name: string; score: number };
  const columns: DataGridColumnDef<Row>[] = [
    { id: "name", header: "Name", accessor: "name" },
    { id: "score", header: "Score", accessor: "score" },
  ];
  const rows: Row[] = [
    { id: "1", name: "Zed", score: 10 },
    { id: "2", name: "Amy", score: 30 },
    { id: "3", name: "Bob", score: 20 },
  ];

  it("sort and filter", () => {
    const sorted = sortDataGridRows(rows, columns, {
      columnId: "name",
      direction: "asc",
    });
    assert.equal(sorted[0]!.name, "Amy");
    const filtered = filterDataGridRows(rows, columns, {}, "bo");
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0]!.name, "Bob");
  });

  it("process pipeline and selection", () => {
    const out = processDataGridRows(rows, columns, {
      sort: { columnId: "score", direction: "desc" },
      globalFilter: "a",
    });
    assert.equal(out[0]!.name, "Amy");
    assert.deepEqual(toggleSortState(null, "name"), {
      columnId: "name",
      direction: "asc",
    });
    assert.deepEqual(
      toggleSortState({ columnId: "name", direction: "asc" }, "name"),
      { columnId: "name", direction: "desc" },
    );
    assert.equal(toggleSortState({ columnId: "name", direction: "desc" }, "name"), null);
    assert.deepEqual(toggleRowSelection(["1"], "2"), ["1", "2"]);
    assert.deepEqual(toggleSelectAll(["1"], ["1", "2", "3"]), ["1", "2", "3"]);
    assert.deepEqual(toggleSelectAll(["1", "2", "3"], ["1", "2", "3"]), []);
  });

  it("compareCellValues", () => {
    assert.ok(compareCellValues(1, 2) < 0);
    assert.ok(compareCellValues("b", "a") > 0);
  });
});

describe("virtual window", () => {
  it("computes start/end with overscan", () => {
    const w = computeVirtualWindow({
      scrollTop: 500,
      viewportHeight: 200,
      rowCount: 1000,
      rowHeight: 50,
      overscan: 2,
    });
    assert.equal(w.startIndex, 8); // floor(500/50)=10 - 2
    assert.equal(w.totalHeight, 50000);
    assert.ok(w.endIndex > w.startIndex);
  });
});

describe("kanban utils", () => {
  const columns: KanbanColumn[] = [
    { id: "todo", title: "Todo" },
    { id: "doing", title: "Doing" },
  ];
  const cards: KanbanCard[] = [
    { id: "a", columnId: "todo", title: "A" },
    { id: "b", columnId: "todo", title: "B" },
    { id: "c", columnId: "doing", title: "C" },
  ];

  it("group and move cards", () => {
    const g = groupKanbanCards(cards, columns);
    assert.equal(g.todo!.length, 2);
    const moved = moveKanbanCard(cards, "a", "doing", 0);
    assert.equal(moved.find((c) => c.id === "a")!.columnId, "doing");
    assert.equal(moved.filter((c) => c.columnId === "doing")[0]!.id, "a");
  });
});
