"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { themes, type ThemeId } from "./manifest";

export type ColorMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeId;
  mode: ColorMode;
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  availableThemes: typeof themes;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeId;
  defaultMode?: ColorMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "mono",
  defaultMode = "light",
  storageKey = "intelli-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [mode, setModeState] = useState<ColorMode>(defaultMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          theme?: ThemeId;
          mode?: ColorMode;
        };
        if (parsed.theme && themes.some((t) => t.id === parsed.theme)) {
          setThemeState(parsed.theme);
        }
        if (parsed.mode) setModeState(parsed.mode);
      } catch {
        // ignore invalid storage
      }
    }
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");

    localStorage.setItem(storageKey, JSON.stringify({ theme, mode }));
  }, [theme, mode, mounted, storageKey]);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
  }, []);

  const setMode = useCallback((newMode: ColorMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      mode,
      setTheme,
      setMode,
      toggleMode,
      availableThemes: themes,
    }),
    [theme, mode, setTheme, setMode, toggleMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}