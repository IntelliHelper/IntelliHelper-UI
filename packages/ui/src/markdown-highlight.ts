import { codeToHtml, bundledLanguages, type BundledLanguage } from "shiki";

const LANGUAGE_ALIASES: Record<string, BundledLanguage> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  py: "python",
};

function resolveLanguage(language: string): BundledLanguage | "text" {
  const normalized = language.toLowerCase();

  if (normalized in LANGUAGE_ALIASES) {
    return LANGUAGE_ALIASES[normalized]!;
  }

  if (normalized in bundledLanguages) {
    return normalized as BundledLanguage;
  }

  return "text";
}

async function renderHighlightedCode(
  code: string,
  language: BundledLanguage | "text",
): Promise<string> {
  return codeToHtml(code, {
    lang: language,
    themes: {
      light: "rose-pine-dawn",
      dark: "rose-pine-moon",
    },
    defaultColor: false,
  });
}

export async function highlightMarkdownCode(
  code: string,
  language: string,
): Promise<string> {
  const resolvedLanguage = resolveLanguage(language);

  try {
    return await renderHighlightedCode(code, resolvedLanguage);
  } catch {
    return renderHighlightedCode(code, "text");
  }
}