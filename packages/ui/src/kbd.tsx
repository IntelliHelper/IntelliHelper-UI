"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useSyncExternalStore,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";

const MAC_MODIFIERS = ["⌘", "⇧", "⌥", "⌃"] as const;
const OTHER_MODIFIERS = ["Ctrl", "Shift", "Alt"] as const;

const MAC_TO_OTHER_MODIFIER: Record<
  (typeof MAC_MODIFIERS)[number],
  (typeof OTHER_MODIFIERS)[number]
> = {
  "⌘": "Ctrl",
  "⇧": "Shift",
  "⌥": "Alt",
  "⌃": "Ctrl",
};

const MODIFIER_KEYS = new Set<string>([
  ...MAC_MODIFIERS,
  ...OTHER_MODIFIERS,
]);

function isMacOS() {
  if (typeof navigator === "undefined") {
    return true;
  }

  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ??
    navigator.platform ??
    "";

  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

function subscribeToPlatform() {
  return () => {};
}

function useIsMac() {
  return useSyncExternalStore(
    subscribeToPlatform,
    isMacOS,
    () => true,
  );
}

export function formatShortcutForPlatform(
  shortcut: string,
  isMac = isMacOS(),
): string {
  if (isMac) {
    return shortcut;
  }

  let formatted = "";
  let index = 0;

  while (index < shortcut.length) {
    const char = shortcut[index]!;

    if (MODIFIER_KEYS.has(char)) {
      formatted += MAC_TO_OTHER_MODIFIER[char as (typeof MAC_MODIFIERS)[number]];
      index += 1;
      continue;
    }

    formatted += shortcut.slice(index);
    break;
  }

  return formatted;
}

const kbdVariants = cva(
  [
    "pointer-events-none inline-flex select-none items-center justify-center",
    "font-medium font-mono leading-none",
    "transition-[background,border-color,box-shadow]",
    "duration-[var(--duration-fast)] [transition-timing-function:var(--ease-default)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "rounded-[calc(var(--radius)-2px)] border",
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_75%,transparent)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_50%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
          "shadow-[inset_0_1px_0_color-mix(in_oklch,white_18%,transparent)]",
        ],
        muted: [
          "rounded-[calc(var(--radius)-2px)] border",
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_55%,transparent)]",
          "bg-[color-mix(in_oklch,var(--muted)_40%,transparent)]",
          "text-muted-foreground",
        ],
      },
      size: {
        sm: "h-4 min-w-4 px-1 text-[9px]",
        default: "h-5 min-w-5 px-1.5 text-[10px]",
        lg: "h-6 min-w-6 px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

export function parseShortcutKeys(shortcut: string): string[] {
  const keys: string[] = [];
  let remaining = shortcut;
  const modifiers = [...OTHER_MODIFIERS, ...MAC_MODIFIERS].sort(
    (left, right) => right.length - left.length,
  );

  while (remaining.length > 0) {
    const modifier = modifiers.find((candidate) =>
      remaining.startsWith(candidate),
    );

    if (modifier) {
      keys.push(modifier);
      remaining = remaining.slice(modifier.length);
      continue;
    }

    keys.push(remaining);
    break;
  }

  return keys;
}

export interface KbdProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, size, ...props }, ref) => (
    <kbd
      ref={ref}
      data-slot="kbd"
      className={cn(kbdVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Kbd.displayName = "Kbd";

export type KbdGroupProps = HTMLAttributes<HTMLSpanElement>;

const KbdGroup = forwardRef<HTMLSpanElement, KbdGroupProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-0.5", className)}
      {...props}
    />
  ),
);
KbdGroup.displayName = "KbdGroup";

export interface KbdShortcutProps extends Omit<KbdProps, "children"> {
  shortcut: string;
}

function KbdShortcut({
  shortcut,
  className,
  variant,
  size,
  ...props
}: KbdShortcutProps) {
  const isMac = useIsMac();
  const displayShortcut = formatShortcutForPlatform(shortcut, isMac);

  return (
    <KbdGroup className={className}>
      {parseShortcutKeys(displayShortcut).map((key, index) => (
        <Kbd key={`${key}-${index}`} variant={variant} size={size} {...props}>
          {key}
        </Kbd>
      ))}
    </KbdGroup>
  );
}

export { Kbd, KbdGroup, KbdShortcut, kbdVariants, useIsMac };