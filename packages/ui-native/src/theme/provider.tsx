import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import type { ThemeColors } from "./colors";
import {
  createTheme,
  type ColorMode,
  type Theme,
  type ThemeId,
} from "./themes";

export interface ThemeProviderProps {
  children: ReactNode;
  /** Theme id (v1: mono only). */
  theme?: ThemeId;
  /** Force light/dark. When omitted, follows system when `followSystem` is true. */
  mode?: ColorMode;
  /** Sync with system color scheme when `mode` is not controlled. Default true. */
  followSystem?: boolean;
  onModeChange?: (mode: ColorMode) => void;
}

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  theme: themeId = "mono",
  mode: controlledMode,
  followSystem = true,
  onModeChange,
}: ThemeProviderProps) {
  const system = useColorScheme();
  const [internalMode, setInternalMode] = useState<ColorMode>(
    controlledMode ?? (system === "dark" ? "dark" : "light"),
  );

  const mode: ColorMode =
    controlledMode ??
    (followSystem ? (system === "dark" ? "dark" : "light") : internalMode);

  const setMode = useCallback(
    (next: ColorMode) => {
      setInternalMode(next);
      onModeChange?.(next);
    },
    [onModeChange],
  );

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const theme = useMemo(() => createTheme(themeId, mode), [themeId, mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: theme.colors,
      mode,
      setMode,
      toggleMode,
    }),
    [theme, mode, setMode, toggleMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

/** Convenience: theme colors only. */
export function useColors(): ThemeColors {
  return useTheme().colors;
}
