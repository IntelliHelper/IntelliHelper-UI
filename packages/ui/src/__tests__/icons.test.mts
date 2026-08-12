/**
 * Unit tests for shared icon components (shipped packages/ui/src/icons.tsx).
 * Transpiles the real TSX module via TypeScript so node:test can render icons.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describe, it, before } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);
const ts = require("typescript") as typeof import("typescript");

const iconsSrcPath = path.join(import.meta.dirname, "../icons.tsx");
/** Compiled next to the test so node can import JSX without a TS loader. */
const OUT = path.join(import.meta.dirname, ".icons.compiled.mjs");

let icons: Record<string, (props?: Record<string, unknown>) => unknown>;

before(async () => {
  const source = fs.readFileSync(iconsSrcPath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: "icons.tsx",
  });
  // Rewrite react/jsx-runtime imports to absolute package paths for node
  const jsxRuntime = pathToFileURL(
    require.resolve("react/jsx-runtime")
  ).href;
  const reactUrl = pathToFileURL(require.resolve("react")).href;
  const code = outputText
    .replaceAll('from "react/jsx-runtime"', `from ${JSON.stringify(jsxRuntime)}`)
    .replaceAll("from 'react/jsx-runtime'", `from ${JSON.stringify(jsxRuntime)}`)
    .replaceAll('from "react"', `from ${JSON.stringify(reactUrl)}`)
    .replaceAll("from 'react'", `from ${JSON.stringify(reactUrl)}`);
  fs.writeFileSync(OUT, code);
  icons = await import(pathToFileURL(OUT).href);
});

function renderIcon(Icon: (props?: Record<string, unknown>) => unknown, props: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(Icon as never, props));
}

function assertSvgRoot(html: string, className?: string) {
  assert.match(html, /^<svg\b/, "root element must be svg");
  assert.match(html, /aria-hidden="true"/, "decorative icons must be aria-hidden");
  assert.match(html, /viewBox="0 0 24 24"/, "standard 24 viewBox");
  if (className) {
    assert.match(html, new RegExp(`class="${className}"`), "className passthrough");
  }
  assert.ok(
    html.includes("currentColor"),
    "uses currentColor for theming"
  );
}

describe("shared icons (live render of shipped icons.tsx)", () => {
  const names = [
    "CheckIcon",
    "ChevronRightIcon",
    "ChevronLeftIcon",
    "ChevronDownIcon",
    "CloseIcon",
    "XIcon",
    "CircleIcon",
    "SearchIcon",
    "EyeIcon",
    "EyeOffIcon",
    "CopyIcon",
    "SunIcon",
    "MoonIcon",
    "PlayIcon",
    "ArrowUpIcon",
    "IndeterminateIcon",
  ] as const;

  for (const name of names) {
    it(`${name} renders svg with aria-hidden and className passthrough`, () => {
      const Icon = icons[name];
      assert.equal(typeof Icon, "function", `${name} must be exported`);
      const html = renderIcon(Icon, { className: "size-4 test-icon" });
      assertSvgRoot(html, "size-4 test-icon");
    });
  }

  it("CheckIcon accepts strokeWidth override", () => {
    const html = renderIcon(icons.CheckIcon, { className: "c", strokeWidth: 3 });
    assert.match(html, /stroke-width="3"/);
  });

  it("VolumeIcon muted variant differs from unmuted", () => {
    const on = renderIcon(icons.VolumeIcon, { className: "v" });
    const off = renderIcon(icons.VolumeIcon, { className: "v", muted: true });
    assertSvgRoot(on, "v");
    assertSvgRoot(off, "v");
    assert.notEqual(on, off);
  });

  it("CloseIcon and XIcon alias produce equivalent markup", () => {
    assert.equal(
      renderIcon(icons.CloseIcon, { className: "x" }),
      renderIcon(icons.XIcon, { className: "x" })
    );
  });
});

describe("consumer modules use shared icons (shipped source)", () => {
  function read(rel: string) {
    return fs.readFileSync(path.join(import.meta.dirname, rel), "utf8");
  }

  it("password-input imports shared eye icons", () => {
    const src = read("../password-input.tsx");
    assert.match(src, /from "\.\/icons"/);
    assert.doesNotMatch(src, /function EyeIcon/);
    assert.doesNotMatch(src, /function EyeOffIcon/);
    assert.match(src, /<EyeIcon\b/);
  });

  it("checkbox uses shared CheckIcon with thicker stroke", () => {
    const src = read("../checkbox.tsx");
    assert.match(src, /from "\.\/icons"/);
    assert.doesNotMatch(src, /function CheckIcon/);
    assert.match(src, /<CheckIcon\b/);
    assert.match(src, /strokeWidth=\{3\}/);
  });

  it("dropdown-menu and context-menu import shared chevron/check", () => {
    for (const name of ["../dropdown-menu.tsx", "../context-menu.tsx"]) {
      const src = read(name);
      assert.match(src, /from "\.\/icons"/);
      assert.doesNotMatch(src, /function CheckIcon/);
      assert.doesNotMatch(src, /function ChevronRightIcon/);
    }
  });

  it("theme-toggle uses shared SunIcon and MoonIcon", () => {
    const src = read("../theme-toggle.tsx");
    assert.match(src, /from "\.\/icons"/);
    assert.doesNotMatch(src, /function SunIcon/);
    assert.doesNotMatch(src, /function MoonIcon/);
    assert.match(src, /<SunIcon\b/);
    assert.match(src, /<MoonIcon\b/);
  });

  it("media-player-icons re-exports from shared icons surface", () => {
    const src = read("../media-player-icons.tsx");
    assert.match(src, /from "\.\/icons"/);
    assert.doesNotMatch(src, /function PlayIcon/);
    assert.match(src, /PlayIcon/);
  });

  it("package exports map includes ./icons", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(import.meta.dirname, "../../package.json"), "utf8")
    );
    assert.equal(pkg.exports["./icons"], "./src/icons.tsx");
  });

  it("select and carousel use shared check/chevron icons", () => {
    const select = read("../select.tsx");
    assert.match(select, /from "\.\/icons"/);
    assert.doesNotMatch(select, /function SelectChevron|function SelectItemCheck/);
    assert.match(select, /<ChevronDownIcon\b/);
    assert.match(select, /<CheckIcon\b/);

    const carousel = read("../carousel.tsx");
    assert.match(carousel, /from "\.\/icons"/);
    assert.doesNotMatch(carousel, /function CarouselChevron/);
    assert.match(carousel, /<ChevronLeftIcon\b/);
    assert.match(carousel, /<ChevronRightIcon\b/);
  });

  it("no duplicated chrome glyph paths outside icons.tsx", () => {
    const srcDir = path.join(import.meta.dirname, "..");
    const chromePaths = [
      /d=["']m6 9 6 6 6-6["']/,
      /d=["']m15 18-6-6 6-6["']/,
      /d=["']m9 18 6-6-6-6["']/,
      /d=["']M20 6 9 17l-5-5["']/,
      /d=["']M18 6 6 18["']/,
    ];
    const offenders: string[] = [];
    for (const name of fs.readdirSync(srcDir)) {
      if (!name.endsWith(".tsx") || name === "icons.tsx") continue;
      const src = fs.readFileSync(path.join(srcDir, name), "utf8");
      for (const re of chromePaths) {
        if (re.test(src)) offenders.push(`${name} matches ${re}`);
      }
    }
    assert.deepEqual(offenders, [], `duplicate chrome paths: ${offenders.join("; ")}`);
  });
});
