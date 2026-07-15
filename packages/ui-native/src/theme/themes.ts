import { monoDark, monoLight, type ThemeColors } from "./colors";
import {
  durations,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  spacing,
  zIndex,
} from "./tokens";

export type ColorMode = "light" | "dark";
export type ThemeId = "mono";

export interface Theme {
  id: ThemeId;
  mode: ColorMode;
  colors: ThemeColors;
  radii: typeof radii;
  spacing: typeof spacing;
  durations: typeof durations;
  fontSizes: typeof fontSizes;
  fontWeights: typeof fontWeights;
  lineHeights: typeof lineHeights;
  zIndex: typeof zIndex;
}

const colorMaps: Record<ThemeId, Record<ColorMode, ThemeColors>> = {
  mono: {
    light: monoLight,
    dark: monoDark,
  },
};

export function createTheme(
  id: ThemeId = "mono",
  mode: ColorMode = "light",
): Theme {
  return {
    id,
    mode,
    colors: colorMaps[id][mode],
    radii,
    spacing,
    durations,
    fontSizes,
    fontWeights,
    lineHeights,
    zIndex,
  };
}

export const defaultTheme = createTheme("mono", "light");
