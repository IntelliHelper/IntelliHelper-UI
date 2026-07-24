/**
 * Semantic + glass chrome palettes.
 * Approximates web oklch / color-mix tokens as RN-safe hex/rgba.
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  surface: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  successForeground: string;
  /** Glass chrome (neutral frosted surfaces) */
  glassChromeBg: string;
  glassChromeBgEnv: string;
  glassChromeFg: string;
  glassChromeFgMuted: string;
  glassChromeBorder: string;
  glassSurfaceFill: string;
  glassButtonUiBg: string;
  glassButtonUiBgHover: string;
  glassButtonUiFg: string;
  glassButtonUiBorder: string;
  glassIndicatorBg: string;
  glassIndicatorBorder: string;
  contentText: string;
  contentTextMuted: string;
  overlay: string;
  overlayHeavy: string;
}

export const monoLight: ThemeColors = {
  background: "#ffffff",
  foreground: "#1a1a1a",
  surface: "#ffffff",
  card: "rgba(255,255,255,0.92)",
  cardForeground: "#1a1a1a",
  popover: "rgba(255,255,255,0.96)",
  popoverForeground: "#1a1a1a",
  primary: "#1a1a1a",
  primaryForeground: "#fafafa",
  secondary: "#f5f5f5",
  secondaryForeground: "#2a2a2a",
  muted: "#f0f0f0",
  mutedForeground: "#6b6b6b",
  accent: "#2a2a2a",
  accentForeground: "#fafafa",
  destructive: "#5c5c5c",
  destructiveForeground: "#fafafa",
  border: "rgba(0,0,0,0.14)",
  input: "rgba(0,0,0,0.06)",
  ring: "rgba(26,26,26,0.35)",
  success: "#2d8a4e",
  successForeground: "#fafafa",
  /* Apple Liquid Glass — milky frost (matches web tokens) */
  glassChromeBg: "rgba(247,247,247,0.72)",
  glassChromeBgEnv: "rgba(250,250,250,0.78)",
  glassChromeFg: "#1f1f1f",
  glassChromeFgMuted: "#666666",
  glassChromeBorder: "rgba(20,20,20,0.12)",
  glassSurfaceFill: "rgba(252,252,252,0.78)",
  glassButtonUiBg: "rgba(255,255,255,0.62)",
  glassButtonUiBgHover: "rgba(255,255,255,0.74)",
  glassButtonUiFg: "#1f1f1f",
  glassButtonUiBorder: "rgba(20,20,20,0.14)",
  glassIndicatorBg: "rgba(255,255,255,0.96)",
  glassIndicatorBorder: "rgba(20,20,20,0.09)",
  contentText: "#fafafa",
  contentTextMuted: "rgba(250,250,250,0.72)",
  overlay: "rgba(0,0,0,0.22)",
  overlayHeavy: "rgba(0,0,0,0.45)",
};

export const monoDark: ThemeColors = {
  background: "#141414",
  foreground: "#f5f5f5",
  surface: "#1f1f1f",
  card: "rgba(30,30,34,0.88)",
  cardForeground: "#f5f5f5",
  popover: "rgba(22,22,26,0.94)",
  popoverForeground: "#f5f5f5",
  primary: "#f5f5f5",
  primaryForeground: "#141414",
  secondary: "#2e2e2e",
  secondaryForeground: "#e8e8e8",
  muted: "#262626",
  mutedForeground: "#9a9a9a",
  accent: "#d4d4d4",
  accentForeground: "#141414",
  destructive: "#8a8a8a",
  destructiveForeground: "#fafafa",
  border: "rgba(255,255,255,0.18)",
  input: "rgba(255,255,255,0.08)",
  ring: "rgba(245,245,245,0.35)",
  success: "#4ade80",
  successForeground: "#0a0a0a",
  /* Dense smoked glass — matches web dark Liquid Glass */
  glassChromeBg: "rgba(48,50,62,0.68)",
  glassChromeBgEnv: "rgba(52,54,68,0.72)",
  glassChromeFg: "#f5f5f7",
  glassChromeFgMuted: "rgba(240,240,245,0.74)",
  glassChromeBorder: "rgba(255,255,255,0.16)",
  glassSurfaceFill: "rgba(34,36,48,0.74)",
  glassButtonUiBg: "rgba(58,62,78,0.62)",
  glassButtonUiBgHover: "rgba(66,70,88,0.72)",
  glassButtonUiFg: "#f5f5f7",
  glassButtonUiBorder: "rgba(255,255,255,0.2)",
  glassIndicatorBg: "rgba(36,38,50,0.95)",
  glassIndicatorBorder: "rgba(255,255,255,0.14)",
  contentText: "#fafafa",
  contentTextMuted: "rgba(250,250,250,0.72)",
  overlay: "rgba(0,0,0,0.45)",
  overlayHeavy: "rgba(0,0,0,0.65)",
};
