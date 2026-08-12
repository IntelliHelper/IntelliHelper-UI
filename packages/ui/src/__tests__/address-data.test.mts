/**
 * Address data coverage — imports generated tables with .ts extensions for Node's
 * strip-types runner (extensionless sibling imports are resolved by the TS bundler).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ADDRESS_CITIES } from "../address-cities-data.ts";
import { ADDRESS_REGIONS } from "../address-regions-data.ts";

type AddressValue = { country: string; region: string; city: string };

function cascadeAddressValue(
  prev: AddressValue,
  patch: Partial<AddressValue>,
): AddressValue {
  const next = { ...prev, ...patch };
  if (patch.country !== undefined && patch.country !== prev.country) {
    next.region = "";
    next.city = "";
  } else if (patch.region !== undefined && patch.region !== prev.region) {
    next.city = "";
  }
  return next;
}

function regionsFor(country: string) {
  return ADDRESS_REGIONS.filter(([cc]) => cc === country).map(
    ([countryCode, code, name]) => ({ countryCode, code, name }),
  );
}

function citiesFor(country: string, region: string) {
  return ADDRESS_CITIES[`${country}|${region}`] ?? [];
}

describe("address regions catalog", () => {
  it("includes a large region set", () => {
    assert.ok(ADDRESS_REGIONS.length >= 4000);
  });

  it("lists US states including California", () => {
    const us = regionsFor("US");
    assert.ok(us.length >= 50);
    assert.ok(us.some((r) => r.code === "CA" && r.name === "California"));
  });

  it("lists Indian states", () => {
    const regions = regionsFor("IN");
    assert.ok(regions.length >= 20);
    assert.ok(regions.some((r) => /Maharashtra|MH/i.test(r.name + r.code)));
  });
});

describe("address cities catalog", () => {
  it("lists California cities including San Francisco", () => {
    const cities = citiesFor("US", "CA");
    assert.ok(cities.length > 100);
    assert.ok(cities.some((c) => /San Francisco/i.test(c)));
  });

  it("search is case-insensitive by filter", () => {
    const hits = citiesFor("US", "CA").filter((c) =>
      c.toLowerCase().includes("los ang"),
    );
    assert.ok(hits.some((c) => /los angeles/i.test(c)));
  });
});

describe("cascadeAddressValue", () => {
  it("clears region and city when country changes", () => {
    assert.deepEqual(
      cascadeAddressValue(
        { country: "US", region: "CA", city: "San Jose" },
        { country: "IN" },
      ),
      { country: "IN", region: "", city: "" },
    );
  });

  it("clears city when region changes", () => {
    assert.deepEqual(
      cascadeAddressValue(
        { country: "US", region: "CA", city: "San Jose" },
        { region: "NY" },
      ),
      { country: "US", region: "NY", city: "" },
    );
  });
});
