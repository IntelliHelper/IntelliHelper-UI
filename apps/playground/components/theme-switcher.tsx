"use client";

import { useTheme, type ThemeId } from "@intelli/themes";
import { cn } from "@intelli/utils";

const themePreviews: Record<
  ThemeId,
  { gradient: string; accent: string }
> = {
  mono: {
    gradient:
      "linear-gradient(135deg, oklch(0.99 0 0), oklch(0.75 0 0), oklch(0.15 0 0))",
    accent: "oklch(0.2 0 0)",
  },
  aurora: {
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.16 195), oklch(0.52 0.22 290), oklch(0.35 0.12 270))",
    accent: "oklch(0.72 0.14 195)",
  },
  sunset: {
    gradient:
      "linear-gradient(135deg, oklch(0.7 0.18 55), oklch(0.58 0.22 15), oklch(0.45 0.14 35))",
    accent: "oklch(0.74 0.17 55)",
  },
  frost: {
    gradient:
      "linear-gradient(135deg, oklch(0.82 0.04 250), oklch(0.58 0.1 220), oklch(0.35 0.04 250))",
    accent: "oklch(0.78 0.06 250)",
  },
  ocean: {
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.14 200), oklch(0.58 0.16 175), oklch(0.32 0.08 220))",
    accent: "oklch(0.72 0.13 195)",
  },
};

type ThemeSwitcherProps = {
  variant?: "default" | "compact";
};

export function ThemeSwitcher({ variant = "default" }: ThemeSwitcherProps) {
  const { theme, setTheme, availableThemes } = useTheme();
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        isCompact
          ? "flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
      )}
    >
      {availableThemes.map((t) => {
        const preview = themePreviews[t.id as ThemeId];
        if (!preview) return null;
        const isActive = theme === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            aria-pressed={isActive}
            aria-label={`Switch to ${t.label} theme`}
            title={t.description}
            className={cn(
              "group relative flex shrink-0 flex-col overflow-hidden rounded-xl text-left transition-all duration-200",
              "glass-interactive",
              isCompact ? "w-[8.5rem] p-2.5" : "p-3",
              isActive
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "opacity-90 hover:opacity-100",
            )}
            style={{
              background: `color-mix(in oklch, ${preview.accent} 12%, transparent)`,
              backdropFilter: "blur(12px)",
              border: isActive
                ? `1.5px solid color-mix(in oklch, ${preview.accent} 50%, transparent)`
                : "1px solid var(--glass-border)",
              boxShadow: isActive
                ? "var(--glass-shadow-hover), var(--glass-inset)"
                : "var(--glass-shadow), var(--glass-inset)",
            }}
          >
            <div
              className={cn(
                "w-full rounded-lg",
                isCompact ? "mb-2 h-8" : "mb-3 h-10",
              )}
              style={{ background: preview.gradient }}
              aria-hidden="true"
            />
            <span
              className={cn(
                "font-semibold text-foreground",
                isCompact ? "text-xs leading-tight" : "text-sm",
              )}
            >
              {t.label}
            </span>
            {!isCompact ? (
              <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {t.description}
              </span>
            ) : null}
            {isActive ? (
              <span
                className="absolute right-2 top-2 size-2 rounded-full"
                style={{ background: preview.accent }}
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}