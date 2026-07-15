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
  card: "rgba(255,255,255,0.85)",
  cardForeground: "#1a1a1a",
  popover: "rgba(255,255,255,0.95)",
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
  glassChromeBg: "rgba(220,220,220,0.82)",
  glassChromeBgEnv: "rgba(230,230,230,0.88)",
  glassChromeFg: "#1f1f1f",
  glassChromeFgMuted: "#6b6b6b",
  glassChromeBorder: "rgba(20,20,20,0.14)",
  glassSurfaceFill: "rgba(255,255,255,0.82)",
  glassButtonUiBg: "rgba(255,255,255,0.44)",
  glassButtonUiBgHover: "rgba(255,255,255,0.58)",
  glassButtonUiFg: "#1f1f1f",
  glassButtonUiBorder: "rgba(20,20,20,0.18)",
  glassIndicatorBg: "rgba(255,255,255,0.97)",
  glassIndicatorBorder: "rgba(20,20,20,0.1)",
  contentText: "#fafafa",
  contentTextMuted: "rgba(250,250,250,0.72)",
  overlay: "rgba(0,0,0,0.22)",
  overlayHeavy: "rgba(0,0,0,0.45)",
};

export const monoDark: ThemeColors = {
  background: "#141414",
  foreground: "#f5f5f5",
  surface: "#1f1f1f",
  card: "rgba(30,30,34,0.75)",
  cardForeground: "#f5f5f5",
  popover: "rgba(22,22,26,0.95)",
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
  glassChromeBg: "rgba(55,55,70,0.55)",
  glassChromeBgEnv: "rgba(50,50,65,0.62)",
  glassChromeFg: "#f0f0f5",
  glassChromeFgMuted: "rgba(240,240,245,0.62)",
  glassChromeBorder: "rgba(255,255,255,0.14)",
  glassSurfaceFill: "rgba(30,30,40,0.7)",
  glassButtonUiBg: "rgba(255,255,255,0.12)",
  glassButtonUiBgHover: "rgba(255,255,255,0.18)",
  glassButtonUiFg: "#f0f0f5",
  glassButtonUiBorder: "rgba(255,255,255,0.16)",
  glassIndicatorBg: "rgba(40,40,50,0.95)",
  glassIndicatorBorder: "rgba(255,255,255,0.12)",
  contentText: "#fafafa",
  contentTextMuted: "rgba(250,250,250,0.72)",
  overlay: "rgba(0,0,0,0.45)",
  overlayHeavy: "rgba(0,0,0,0.65)",
};
