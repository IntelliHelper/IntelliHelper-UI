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
import { materials, themes, type MaterialId, type ThemeId } from "./manifest";

export type ColorMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeId;
  mode: ColorMode;
  material: MaterialId;
  setTheme: (theme: ThemeId) => void;
  setMode: (mode: ColorMode) => void;
  setMaterial: (material: MaterialId) => void;
  toggleMode: () => void;
  availableThemes: typeof themes;
  availableMaterials: typeof materials;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeId;
  defaultMode?: ColorMode;
  defaultMaterial?: MaterialId;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "mono",
  defaultMode = "light",
  defaultMaterial = "glass",
  storageKey = "intelli-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [mode, setModeState] = useState<ColorMode>(defaultMode);
  const [material, setMaterialState] = useState<MaterialId>(defaultMaterial);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          theme?: ThemeId;
          mode?: ColorMode;
          material?: MaterialId;
        };
        if (parsed.theme && themes.some((t) => t.id === parsed.theme)) {
          setThemeState(parsed.theme);
        }
        if (parsed.mode) setModeState(parsed.mode);
        if (parsed.material && materials.some((m) => m.id === parsed.material)) {
          setMaterialState(parsed.material);
        }
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
    root.setAttribute("data-material", material);
    root.classList.toggle("dark", mode === "dark");
    root.classList.toggle("light", mode === "light");

    localStorage.setItem(storageKey, JSON.stringify({ theme, mode, material }));
  }, [theme, mode, material, mounted, storageKey]);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
  }, []);

  const setMode = useCallback((newMode: ColorMode) => {
    setModeState(newMode);
  }, []);

  const setMaterial = useCallback((newMaterial: MaterialId) => {
    setMaterialState(newMaterial);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      mode,
      material,
      setTheme,
      setMode,
      setMaterial,
      toggleMode,
      availableThemes: themes,
      availableMaterials: materials,
    }),
    [theme, mode, material, setTheme, setMode, setMaterial, toggleMode],
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