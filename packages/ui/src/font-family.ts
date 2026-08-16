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
  }
  root.setAttribute("data-font", font.id);
}

export function readDocumentFontId(
  fonts: readonly FontOption[] = DEFAULT_FONTS,
): string {
  if (typeof document === "undefined") {
    return DEFAULT_FONT_ID;
  }
  const attr = document.documentElement.getAttribute("data-font");
  if (attr && fonts.some((font) => font.id === attr)) {
    return attr;
  }
  return DEFAULT_FONT_ID;
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
