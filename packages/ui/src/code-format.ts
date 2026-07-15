/**
 * Pure code / JSON formatting helpers for CodeViewer, TerminalBlock, JsonViewer.
 */

export type JsonParseResult =
  | { ok: true; value: unknown; formatted: string }
  | { ok: false; error: string; formatted: string };

/** Pretty-print JSON with optional indent. Returns null if parse fails. */
export function formatJson(
  input: string,
  indent: number = 2,
): string | null {
  try {
    const value = JSON.parse(input) as unknown;
    return JSON.stringify(value, null, indent);
  } catch {
    return null;
  }
}

/** Safe parse + pretty-print with error detail for viewers. */
export function parseAndFormatJson(
  input: string,
  indent: number = 2,
): JsonParseResult {
  try {
    const value = JSON.parse(input) as unknown;
    return {
      ok: true,
      value,
      formatted: JSON.stringify(value, null, indent),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid JSON";
    return { ok: false, error: message, formatted: input };
  }
}

/** Validate JSON without formatting. */
export function isValidJson(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

/** Split source into line strings (preserves empty trailing line). */
export function splitCodeLines(code: string): string[] {
  if (code === "") {
    return [""];
  }
  return code.replace(/\r\n/g, "\n").split("\n");
}

/** Pad line numbers to a fixed width for monospace gutters. */
export function formatLineNumber(index: number, total: number): string {
  const width = Math.max(String(total).length, 1);
  return String(index + 1).padStart(width, " ");
}

/** Normalize language labels (e.g. `language-ts` → `ts`). */
export function normalizeLanguage(language?: string | null): string {
  if (!language) {
    return "text";
  }
  return language.replace(/^language-/, "").toLowerCase().trim() || "text";
}
