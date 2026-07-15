#!/usr/bin/env node
/**
 * Bundle catalog, examples, and themes for the Intelli UI MCP server.
 * Writes JSON assets next to the CLI bundled registry.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(__dirname, "../../..");
const outDir = join(__dirname, "../src/registry");

mkdirSync(outDir, { recursive: true });

// ── Themes ──────────────────────────────────────────────────────────────────

const themesSource = readFileSync(
  join(monorepoRoot, "packages/themes/src/manifest.ts"),
  "utf8",
);

const themes = [];
const themeBlockRe =
  /\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*cssFile:\s*"([^"]+)",?\s*\}/g;
let themeMatch;
while ((themeMatch = themeBlockRe.exec(themesSource)) !== null) {
  themes.push({
    id: themeMatch[1],
    label: themeMatch[2],
    description: themeMatch[3],
    cssFile: themeMatch[4],
  });
}

if (themes.length === 0) {
  console.error("bundle-mcp-data: failed to extract themes from manifest.ts");
  process.exit(1);
}

// ── Catalog ─────────────────────────────────────────────────────────────────

const catalogSource = readFileSync(
  join(monorepoRoot, "apps/playground/lib/catalog.ts"),
  "utf8",
);

const categoryMeta = {};
const categoryMetaRe =
  /"([^"]+)":\s*\{\s*label:\s*"([^"]+)",\s*description:\s*"([^"]+)",?\s*\}/g;
let catMetaMatch;
// Only parse inside CATEGORY_META block
const categoryMetaBlock = catalogSource.match(
  /export const CATEGORY_META[\s\S]*?=\s*\{([\s\S]*?)\n\};/,
)?.[1];
if (categoryMetaBlock) {
  while ((catMetaMatch = categoryMetaRe.exec(categoryMetaBlock)) !== null) {
    categoryMeta[catMetaMatch[1]] = {
      label: catMetaMatch[2],
      description: catMetaMatch[3],
    };
  }
}

// Also match unquoted keys like actions: {
const unquotedMetaRe =
  /(\w+):\s*\{\s*label:\s*"([^"]+)",\s*description:\s*"([^"]+)",?\s*\}/g;
if (categoryMetaBlock) {
  while ((catMetaMatch = unquotedMetaRe.exec(categoryMetaBlock)) !== null) {
    if (!categoryMeta[catMetaMatch[1]]) {
      categoryMeta[catMetaMatch[1]] = {
        label: catMetaMatch[2],
        description: catMetaMatch[3],
      };
    }
  }
}

const catalog = [];
const catalogItemRe =
  /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*category:\s*"([^"]+)",?\s*\}/g;
let itemMatch;
const catalogBlock = catalogSource.match(
  /export const CATALOG[\s\S]*?=\s*\[([\s\S]*?)\n\];/,
)?.[1];
if (catalogBlock) {
  while ((itemMatch = catalogItemRe.exec(catalogBlock)) !== null) {
    catalog.push({
      slug: itemMatch[1],
      title: itemMatch[2],
      description: itemMatch[3],
      category: itemMatch[4],
    });
  }
}

if (catalog.length === 0) {
  console.error("bundle-mcp-data: failed to extract catalog from catalog.ts");
  process.exit(1);
}

// ── Examples ────────────────────────────────────────────────────────────────

const examplesSource = readFileSync(
  join(monorepoRoot, "apps/playground/lib/examples/index.tsx"),
  "utf8",
);

/**
 * Extract EXAMPLES record: slug -> [{ title, description?, code }]
 * Parses object entries between "const EXAMPLES" and the closing "};"
 */
function extractExamples(source) {
  const startMarker = "const EXAMPLES:";
  const startIdx = source.indexOf(startMarker);
  if (startIdx === -1) {
    // try without type annotation
    const alt = source.indexOf("const EXAMPLES =");
    if (alt === -1) return {};
    return extractExamplesFromOffset(source, alt);
  }
  return extractExamplesFromOffset(source, startIdx);
}

function extractExamplesFromOffset(source, startIdx) {
  // Find the first `{` after EXAMPLES
  const braceStart = source.indexOf("{", startIdx);
  if (braceStart === -1) return {};

  let depth = 0;
  let endIdx = -1;
  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }
  if (endIdx === -1) return {};

  const body = source.slice(braceStart + 1, endIdx);
  const result = {};

  // Split top-level keys:  "slug": [ ... ]  or  slug: [ ... ]
  // Walk character by character tracking bracket depth for arrays
  let i = 0;
  while (i < body.length) {
    // skip whitespace and commas
    while (i < body.length && /[\s,]/.test(body[i])) i++;
    if (i >= body.length) break;

    // read key
    let key;
    if (body[i] === '"' || body[i] === "'") {
      const quote = body[i];
      i++;
      let k = "";
      while (i < body.length && body[i] !== quote) {
        if (body[i] === "\\") {
          k += body[i] + body[i + 1];
          i += 2;
          continue;
        }
        k += body[i];
        i++;
      }
      i++; // closing quote
      key = k;
    } else {
      let k = "";
      while (i < body.length && /[\w-]/.test(body[i])) {
        k += body[i];
        i++;
      }
      key = k;
    }

    // skip to :
    while (i < body.length && body[i] !== ":") i++;
    i++; // :
    while (i < body.length && /\s/.test(body[i])) i++;

    if (body[i] !== "[") {
      // unexpected — skip to next top-level
      break;
    }

    // extract array body with depth tracking
    const arrStart = i;
    let arrDepth = 0;
    let arrEnd = -1;
    for (let j = arrStart; j < body.length; j++) {
      if (body[j] === "[") arrDepth++;
      else if (body[j] === "]") {
        arrDepth--;
        if (arrDepth === 0) {
          arrEnd = j;
          break;
        }
      }
    }
    if (arrEnd === -1) break;

    const arrBody = body.slice(arrStart + 1, arrEnd);
    result[key] = parseExampleArray(arrBody);
    i = arrEnd + 1;
  }

  return result;
}

function parseExampleArray(arrBody) {
  const examples = [];
  // Find each top-level object { ... }
  let i = 0;
  while (i < arrBody.length) {
    while (i < arrBody.length && /[\s,]/.test(arrBody[i])) i++;
    if (i >= arrBody.length) break;
    if (arrBody[i] !== "{") {
      i++;
      continue;
    }

    let depth = 0;
    let end = -1;
    let inString = false;
    let stringQuote = null;
    let escaped = false;

    for (let j = i; j < arrBody.length; j++) {
      const ch = arrBody[j];
      if (inString) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (ch === "\\") {
          escaped = true;
          continue;
        }
        if (ch === stringQuote) {
          inString = false;
          stringQuote = null;
        }
        continue;
      }
      // template literals
      if (ch === "`") {
        inString = true;
        stringQuote = "`";
        continue;
      }
      if (ch === '"' || ch === "'") {
        inString = true;
        stringQuote = ch;
        continue;
      }
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          end = j;
          break;
        }
      }
    }
    if (end === -1) break;

    const objBody = arrBody.slice(i + 1, end);
    const example = parseExampleObject(objBody);
    if (example) examples.push(example);
    i = end + 1;
  }
  return examples;
}

function parseExampleObject(objBody) {
  const title = extractStringProp(objBody, "title");
  if (!title) return null;
  const description = extractStringProp(objBody, "description");
  const code = extractCodeProp(objBody);
  if (!code) return null;
  return {
    title,
    ...(description ? { description } : {}),
    code,
  };
}

function extractStringProp(body, prop) {
  // prop: "..." or prop: '...'
  const re = new RegExp(`${prop}\\s*:\\s*("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')`);
  const m = body.match(re);
  if (!m) return null;
  try {
    return JSON.parse(m[1].replace(/^'/, '"').replace(/'$/, '"').replace(/\\'/g, "'"));
  } catch {
    // manual unquote
    return m[1].slice(1, -1).replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
}

function extractCodeProp(body) {
  // Prefer template literal: code: `...`
  const tplIdx = body.search(/code\s*:\s*`/);
  if (tplIdx !== -1) {
    const start = body.indexOf("`", tplIdx) + 1;
    let end = start;
    let escaped = false;
    while (end < body.length) {
      const ch = body[end];
      if (escaped) {
        escaped = false;
        end++;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        end++;
        continue;
      }
      // handle ${...} inside template — keep as-is for agent display
      if (ch === "`") break;
      end++;
    }
    return body.slice(start, end);
  }

  // Fallback: code: someIdentifier  (e.g. loginCardCode)
  const identMatch = body.match(/code\s*:\s*([A-Za-z_$][\w$]*)/);
  if (identMatch) {
    // Try to resolve identifier from source file later
    return `[see source: ${identMatch[1]}]`;
  }
  return null;
}

const examples = extractExamples(examplesSource);

// Resolve simple identifier references from the examples file (e.g. loginCardCode)
// by looking for `export const name = \`...\`` or `const name = \`...\``
for (const [slug, list] of Object.entries(examples)) {
  for (const ex of list) {
    if (ex.code?.startsWith("[see source:")) {
      const name = ex.code.match(/\[see source: ([^\]]+)\]/)?.[1];
      if (!name) continue;
      // search in monorepo for that export
      const re = new RegExp(
        `(?:export\\s+)?const\\s+${name}\\s*=\\s*\`([\\s\\S]*?)\``,
      );
      // check component-preview-demo and examples file
      const searchFiles = [
        join(monorepoRoot, "apps/playground/components/component-preview-demo.tsx"),
        join(monorepoRoot, "apps/playground/lib/examples/index.tsx"),
      ];
      for (const file of searchFiles) {
        try {
          const content = readFileSync(file, "utf8");
          const m = content.match(re);
          if (m) {
            ex.code = m[1];
            break;
          }
        } catch {
          // ignore
        }
      }
    }
  }
}

const exampleCount = Object.values(examples).reduce((n, a) => n + a.length, 0);
if (exampleCount === 0) {
  console.error("bundle-mcp-data: failed to extract any examples");
  process.exit(1);
}

// ── Write outputs ───────────────────────────────────────────────────────────

const catalogOut = {
  categories: categoryMeta,
  items: catalog,
};

const themesOut = { themes };

writeFileSync(join(outDir, "catalog.json"), `${JSON.stringify(catalogOut, null, 2)}\n`);
writeFileSync(join(outDir, "examples.json"), `${JSON.stringify(examples, null, 2)}\n`);
writeFileSync(join(outDir, "themes.json"), `${JSON.stringify(themesOut, null, 2)}\n`);

console.log(
  `bundle-mcp-data: ${catalog.length} catalog items, ${exampleCount} examples, ${themes.length} themes → ${outDir}`,
);
