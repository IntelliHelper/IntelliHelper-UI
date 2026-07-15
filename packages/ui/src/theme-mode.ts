export type ThemeMode = "light" | "dark";

/**
 * Flip light ↔ dark.
 */
export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return mode === "dark" ? "light" : "dark";
}
