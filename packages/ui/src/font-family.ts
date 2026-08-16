export type FontCategory = "sans" | "serif" | "mono";

export type FontOption = {
  id: string;
  label: string;
  /** CSS font-family stack applied to `--font-sans` (or `--font-mono`). */
  stack: string;
  category: FontCategory;
  /** Google Fonts family name. Loaded on demand when applying or previewing. */
  google?: string;
};

function googleFamily(name: string, fallback: string): Pick<FontOption, "stack" | "google"> {
  return {
    google: name,
    stack: `"${name}", ${fallback}`,
  };
}

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
    category: "sans",
    ...googleFamily("Inter", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "geist",
    label: "Geist",
    category: "sans",
    ...googleFamily("Geist", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans",
    category: "sans",
    ...googleFamily("Plus Jakarta Sans", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    category: "sans",
    ...googleFamily("DM Sans", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "outfit",
    label: "Outfit",
    category: "sans",
    ...googleFamily("Outfit", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "manrope",
    label: "Manrope",
    category: "sans",
    ...googleFamily("Manrope", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "figtree",
    label: "Figtree",
    category: "sans",
    ...googleFamily("Figtree", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "instrument-sans",
    label: "Instrument Sans",
    category: "sans",
    ...googleFamily("Instrument Sans", "ui-sans-serif, system-ui, sans-serif"),
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    category: "sans",
    ...googleFamily("Space Grotesk", "ui-sans-serif, system-ui, sans-serif"),
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
    id: "source-serif",
    label: "Source Serif 4",
    category: "serif",
    ...googleFamily("Source Serif 4", "Georgia, serif"),
  },
  {
    id: "newsreader",
    label: "Newsreader",
    category: "serif",
    ...googleFamily("Newsreader", "Georgia, serif"),
  },
  {
    id: "instrument-serif",
    label: "Instrument Serif",
    category: "serif",
    ...googleFamily("Instrument Serif", "Georgia, serif"),
  },
  {
    id: "fraunces",
    label: "Fraunces",
    category: "serif",
    ...googleFamily("Fraunces", "Georgia, serif"),
  },
  {
    id: "lora",
    label: "Lora",
    category: "serif",
    ...googleFamily("Lora", "Georgia, serif"),
  },
  {
    id: "playfair",
    label: "Playfair Display",
    category: "serif",
    ...googleFamily("Playfair Display", "Georgia, serif"),
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
    id: "geist-mono",
    label: "Geist Mono",
    category: "mono",
    ...googleFamily("Geist Mono", "ui-monospace, monospace"),
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    category: "mono",
    ...googleFamily("JetBrains Mono", "ui-monospace, monospace"),
  },
  {
    id: "ibm-plex-mono",
    label: "IBM Plex Mono",
    category: "mono",
    ...googleFamily("IBM Plex Mono", "ui-monospace, monospace"),
  },
  {
    id: "fira-code",
    label: "Fira Code",
    category: "mono",
    ...googleFamily("Fira Code", "ui-monospace, monospace"),
  },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    category: "mono",
    ...googleFamily("Source Code Pro", "ui-monospace, monospace"),
  },
  {
    id: "courier",
    label: "Courier New",
    stack: '"Courier New", Courier, monospace',
    category: "mono",
  },
] as const;

const GOOGLE_FONTS_LINK_ID = "intelli-font-picker-google";

/** Combined Google Fonts stylesheet for every option that needs a webfont. */
export function googleFontsHref(
  fonts: readonly FontOption[] = DEFAULT_FONTS,
): string | null {
  const families = [
    ...new Set(
      fonts
        .map((font) => font.google)
        .filter((name): name is string => Boolean(name)),
    ),
  ];
  if (families.length === 0) {
    return null;
  }
  const query = families
    .map((name) => {
      const family = name.replace(/ /g, "+");
      return `family=${family}:wght@400;500;600;700`;
    })
    .join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

export function ensureGoogleFontsLoaded(
  fonts: readonly FontOption[] = DEFAULT_FONTS,
): void {
  if (typeof document === "undefined") {
    return;
  }
  const href = googleFontsHref(fonts);
  if (!href) {
    return;
  }
  const existing = document.getElementById(GOOGLE_FONTS_LINK_ID);
  if (existing instanceof HTMLLinkElement) {
    if (existing.href !== href) {
      existing.href = href;
    }
    return;
  }
  const link = document.createElement("link");
  link.id = GOOGLE_FONTS_LINK_ID;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

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
  ensureGoogleFontsLoaded([font]);
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
