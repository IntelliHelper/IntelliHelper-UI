/**
 * Unit tests for media kit pure utilities.
 * Runs with: node --experimental-strip-types --test packages/ui/src/__tests__/media-kit-utils.test.mts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  aspectPresetRatio,
  areFiltersDefault,
  clamp,
  DEFAULT_IMAGE_FILTERS,
  filtersToCss,
  fitCropToAspect,
  normalizeRotation,
} from "../image-editor-utils.ts";
import {
  captionTrackId,
  clampVolume,
  detectMediaKind,
  formatMediaTime,
  qualityId,
  resolveDefaultCaption,
  resolveDefaultQuality,
} from "../media-player-utils.ts";

describe("media-player-utils", () => {
  it("formatMediaTime handles seconds, minutes, and hours", () => {
    assert.equal(formatMediaTime(0), "0:00");
    assert.equal(formatMediaTime(65), "1:05");
    assert.equal(formatMediaTime(3661), "1:01:01");
    assert.equal(formatMediaTime(Number.NaN), "0:00");
    assert.equal(formatMediaTime(-3), "0:00");
  });

  it("detectMediaKind prefers explicit kind then extension", () => {
    assert.equal(detectMediaKind("x.mp4", "audio"), "audio");
    assert.equal(detectMediaKind("track.mp3"), "audio");
    assert.equal(detectMediaKind("clip.m4a?token=1"), "audio");
    assert.equal(detectMediaKind("clip.mp4"), "video");
    assert.equal(detectMediaKind(undefined), "video");
  });

  it("resolveDefaultCaption honors preferred, default flag, then off", () => {
    const tracks = [
      { src: "/a.vtt", label: "English", srcLang: "en", id: "en" },
      {
        src: "/b.vtt",
        label: "Español",
        srcLang: "es",
        id: "es",
        default: true,
      },
    ];
    assert.equal(resolveDefaultCaption(tracks, "off"), "off");
    assert.equal(resolveDefaultCaption(tracks, "en"), "en");
    assert.equal(resolveDefaultCaption(tracks), "es");
    assert.equal(resolveDefaultCaption([{ src: "/x.vtt", label: "Only" }]), "off");
  });

  it("resolveDefaultQuality picks preferred or highest height", () => {
    const qualities = [
      { src: "/a.mp4", label: "480p", id: "480", height: 480 },
      { src: "/b.mp4", label: "1080p", id: "1080", height: 1080 },
      { src: "/c.mp4", label: "720p", id: "720", height: 720 },
    ];
    assert.equal(resolveDefaultQuality(qualities, "720"), "720");
    assert.equal(resolveDefaultQuality(qualities), "1080");
    assert.equal(qualityId(qualities[0]!, 0), "480");
    assert.equal(captionTrackId(tracksLike(), 0), "en");
  });

  it("clampVolume bounds 0–1", () => {
    assert.equal(clampVolume(0.5), 0.5);
    assert.equal(clampVolume(-1), 0);
    assert.equal(clampVolume(2), 1);
    assert.equal(clampVolume(Number.NaN), 0);
  });
});

function tracksLike() {
  return { src: "/a.vtt", label: "English", srcLang: "en", id: "en" };
}

describe("image-editor-utils", () => {
  it("aspectPresetRatio maps known presets", () => {
    assert.equal(aspectPresetRatio("free"), null);
    assert.equal(aspectPresetRatio("1:1"), 1);
    assert.equal(aspectPresetRatio("16:9"), 16 / 9);
    assert.equal(aspectPresetRatio("9:16"), 9 / 16);
  });

  it("normalizeRotation wraps degrees", () => {
    assert.equal(normalizeRotation(0), 0);
    assert.equal(normalizeRotation(90), 90);
    assert.equal(normalizeRotation(450), 90);
    assert.equal(normalizeRotation(-90), 270);
  });

  it("fitCropToAspect free clamps; ratio locks from center", () => {
    const free = fitCropToAspect(
      { x: -0.1, y: 0.2, width: 1.5, height: 0.5 },
      null,
    );
    assert.equal(free.x, 0);
    assert.ok(free.width <= 1);

    const square = fitCropToAspect(
      { x: 0.1, y: 0.1, width: 0.8, height: 0.4 },
      1,
    );
    assert.ok(Math.abs(square.width - square.height) < 1e-9);
    assert.ok(square.x >= 0 && square.y >= 0);
    assert.ok(square.x + square.width <= 1 + 1e-9);
    assert.ok(square.y + square.height <= 1 + 1e-9);
  });

  it("filtersToCss and areFiltersDefault", () => {
    assert.equal(
      filtersToCss(DEFAULT_IMAGE_FILTERS),
      "brightness(100%) contrast(100%) saturate(100%) grayscale(0%) sepia(0%) blur(0px)",
    );
    assert.equal(areFiltersDefault(DEFAULT_IMAGE_FILTERS), true);
    assert.equal(
      areFiltersDefault({ ...DEFAULT_IMAGE_FILTERS, blur: 2 }),
      false,
    );
  });

  it("clamp bounds values", () => {
    assert.equal(clamp(5, 0, 10), 5);
    assert.equal(clamp(-1, 0, 10), 0);
    assert.equal(clamp(99, 0, 10), 10);
  });
});
