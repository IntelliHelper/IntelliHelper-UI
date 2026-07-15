"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { nextThemeMode, type ThemeMode } from "./theme-mode";

export type { ThemeMode };
export { nextThemeMode };

const themeToggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-full",
    "transition-[transform,box-shadow,background] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      variant: {
        chrome: "glass-chrome glass-chrome-interactive glass-chrome-text",
        ghost: "glass-button-ghost glass-chrome-interactive",
        outline: "glass-button-chrome glass-chrome-interactive",
      },
      size: {
        sm: "size-8",
        default: "size-9",
        lg: "size-10",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

function readDocumentMode(): ThemeMode {
  if (typeof document === "undefined") {
    return "light";
  }
  const root = document.documentElement;
  if (root.classList.contains("dark")) {
    return "dark";
  }
  if (root.classList.contains("light")) {
    return "light";
  }
  if (root.getAttribute("data-mode") === "dark") {
    return "dark";
  }
  return "light";
}

/**
 * Apply light/dark mode classes on the document root (matches @intelli/themes provider).
 */
export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
  root.setAttribute("data-mode", mode);
}

export interface ThemeToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof themeToggleVariants> {
  /** Controlled mode. When omitted, reads/writes documentElement classes. */
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  /** When true (default), also apply classes on documentElement. */
  applyToDocument?: boolean;
  lightLabel?: string;
  darkLabel?: string;
}

const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (
    {
      className,
      variant,
      size,
      mode: modeProp,
      defaultMode = "light",
      onModeChange,
      applyToDocument = true,
      lightLabel = "Switch to light mode",
      darkLabel = "Switch to dark mode",
      onClick,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState<ThemeMode>(defaultMode);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (modeProp === undefined) {
        setUncontrolled(readDocumentMode());
      }
    }, [modeProp]);

    const mode = modeProp !== undefined ? modeProp : uncontrolled;

    const setMode = useCallback(
      (next: ThemeMode) => {
        if (modeProp === undefined) {
          setUncontrolled(next);
        }
        if (applyToDocument) {
          applyThemeMode(next);
        }
        onModeChange?.(next);
      },
      [applyToDocument, modeProp, onModeChange],
    );

    const toggle = () => {
      setMode(nextThemeMode(mode));
    };

    const label = mode === "dark" ? lightLabel : darkLabel;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="theme-toggle"
        data-mode={mode}
        aria-label={label}
        title={label}
        className={cn(themeToggleVariants({ variant, size, className }))}
        onClick={(event) => {
          toggle();
          onClick?.(event);
        }}
        {...props}
      >
        {/* Avoid hydration mismatch: render sun until mounted when uncontrolled */}
        {!mounted || mode === "light" ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )}
      </button>
    );
  },
);
ThemeToggle.displayName = "ThemeToggle";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export { ThemeToggle, themeToggleVariants };
