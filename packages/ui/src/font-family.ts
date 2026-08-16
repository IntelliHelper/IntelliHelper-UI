export type FontCategory = "sans" | "serif" | "mono";

export type FontOption = {
  id: string;
  label: string;
  /** CSS font-family stack applied to `--font-sans` (or `--font-mono`). */
  stack: string;
  category: FontCategory;
};

export const DEFAULT_FONTS: readonly FontOption[] = [
  {
    id: "sans",
    label: "System Sans",
    stack:
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    category: "sans",
  },
  {
    id: "inter",
    label: "Inter",
    stack: 'Inter, ui-sans-serif, system-ui, sans-serif',
    category: "sans",
  },
  {
    id: "arial",
    label: "Arial",
    stack: "Arial, Helvetica, sans-serif",
    category: "sans",
  },
  {
    id: "helvetica",
    label: "Helvetica",
    stack: "Helvetica, Arial, sans-serif",
    category: "sans",
  },
  {
    id: "verdana",
    label: "Verdana",
    stack: "Verdana, Geneva, sans-serif",
    category: "sans",
  },
  {
    id: "trebuchet",
    label: "Trebuchet MS",
    stack: '"Trebuchet MS", Tahoma, sans-serif',
    category: "sans",
  },
  {
    id: "serif",
    label: "System Serif",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    category: "serif",
  },
  {
    id: "georgia",
    label: "Georgia",
    stack: 'Georgia, "Times New Roman", Times, serif',
    category: "serif",
  },
  {
    id: "palatino",
    label: "Palatino",
    stack: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
    category: "serif",
  },
  {
    id: "times",
    label: "Times New Roman",
    stack: '"Times New Roman", Times, serif',
    category: "serif",
  },
  {
    id: "mono",
    label: "System Mono",
    stack: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    category: "mono",
  },
  {
    id: "courier",
    label: "Courier New",
    stack: '"Courier New", Courier, monospace',
    category: "mono",
  },
] as const;

export const DEFAULT_FONT_ID = "sans";

export function findFontOption(
  id: string,
  fonts: readonly FontOption[] = DEFAULT_FONTS,
): FontOption | undefined {
  return fonts.find((font) => font.id === id);
}

/** First valid id in `fonts`, preferring the built-in default when present. */
export function fallbackFontId(
  fonts: readonly FontOption[] = DEFAULT_FONTS,
): string {
  if (findFontOption(DEFAULT_FONT_ID, fonts)) {
    return DEFAULT_FONT_ID;
  }
  return fonts[0]?.id ?? DEFAULT_FONT_ID;
}

/** Return `id` when it exists in `fonts`; otherwise the list fallback. */
export function resolveFontId(
  id: string | null | undefined,
  fonts: readonly FontOption[] = DEFAULT_FONTS,
): string {
  if (id && findFontOption(id, fonts)) {
    return id;
  }
  return fallbackFontId(fonts);
}

/**
 * Apply a font stack on the document root so `body { font-family: var(--font-sans) }` updates.
 */
export function applyDocumentFont(font: FontOption): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.style.setProperty("--font-sans", font.stack);
  if (font.category === "mono") {
    root.style.setProperty("--font-mono", font.stack);
  } else {
    root.style.removeProperty("--font-mono");
  }
  root.setAttribute("data-font", font.id);
}

export function readDocumentFontId(
  fonts: readonly FontOption[] = DEFAULT_FONTS,
): string {
  if (typeof document === "undefined") {
    return fallbackFontId(fonts);
  }
  return resolveFontId(
    document.documentElement.getAttribute("data-font"),
    fonts,
  );
}

export function persistFontId(storageKey: string, id: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(storageKey, id);
  } catch {
    /* private mode / quota */
  }
}

export function readPersistedFontId(storageKey: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}
