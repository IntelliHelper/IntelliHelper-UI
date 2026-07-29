"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import type { FieldVariantProps } from "./field-variants";

const slotSizeStyles = {
  sm: "h-9 w-9 text-xs rounded-lg",
  default: "h-10 w-10 text-sm rounded-xl",
  lg: "h-12 w-12 text-base rounded-xl",
} as const;

const slotVariantStyles = {
  chrome: "glass-field",
  outline: [
    "border border-[var(--glass-chrome-border)]",
    "bg-[color-mix(in_oklch,var(--glass-surface-fill)_50%,transparent)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-inset)]",
  ],
} as const;

const slotStateStyles = {
  default: "",
  error:
    "border-destructive/60 ring-destructive/20 focus-visible:ring-destructive/40",
  success:
    "border-[color-mix(in_oklch,var(--primary)_50%,transparent)] ring-primary/20 focus-visible:ring-primary/40",
} as const;

function sanitizeChar(char: string, pattern: RegExp): string {
  const match = char.match(pattern);
  return match ? match[0] : "";
}

function splitValue(value: string, length: number, pattern: RegExp): string[] {
  const chars = value
    .split("")
    .map((c) => sanitizeChar(c, pattern))
    .filter(Boolean)
    .slice(0, length);
  return Array.from({ length }, (_, i) => chars[i] ?? "");
}

export interface OtpInputProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "onChange" | "defaultValue" | "children"
    >,
    FieldVariantProps {
  /** Number of digit/character slots. Default 6. */
  length?: number;
  /** Controlled value (concatenated string). */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called whenever the value changes. */
  onValueChange?: (value: string) => void;
  /** Called when all slots are filled. */
  onComplete?: (value: string) => void;
  /** Allowed character pattern per slot. Default digits only. */
  pattern?: RegExp;
  /** Disabled state for all slots. */
  disabled?: boolean;
  /** Auto-focus the first empty slot on mount. */
  autoFocus?: boolean;
  /** Name for a hidden input (form posts). */
  name?: string;
  /** Input mode for mobile keyboards. */
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  /** Autocomplete hint (e.g. one-time-code). */
  autoComplete?: string;
  /** Accessible label for the group. */
  "aria-label"?: string;
  /** Id of an external label element. */
  "aria-labelledby"?: string;
}

export interface OtpInputHandle {
  focus: (index?: number) => void;
  clear: () => void;
  getValue: () => string;
}

const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
  (
    {
      className,
      length = 6,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onComplete,
      pattern: patternProp,
      variant = "chrome",
      size = "default",
      state = "default",
      disabled = false,
      autoFocus = false,
      name,
      inputMode = "numeric",
      autoComplete = "one-time-code",
      "aria-label": ariaLabel = "One-time password",
      "aria-labelledby": ariaLabelledBy,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const pattern = useMemo(
      () => patternProp ?? /^[0-9]$/,
      [patternProp],
    );
    const generatedId = useId();
    const baseId = idProp ?? generatedId;
    const [uncontrolled, setUncontrolled] = useState(() =>
      splitValue(defaultValue, length, pattern),
    );
    const slots =
      valueProp !== undefined
        ? splitValue(valueProp, length, pattern)
        : uncontrolled;
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const completedRef = useRef<string | null>(null);

    const commit = useCallback(
      (nextSlots: string[]) => {
        const next = nextSlots.join("");
        if (valueProp === undefined) {
          setUncontrolled(nextSlots);
        }
        onValueChange?.(next);
        if (
          next.length === length &&
          nextSlots.every(Boolean) &&
          completedRef.current !== next
        ) {
          completedRef.current = next;
          onComplete?.(next);
        }
        if (next.length < length) {
          completedRef.current = null;
        }
      },
      [length, onComplete, onValueChange, valueProp],
    );

    const focusIndex = useCallback((index: number) => {
      const el = inputRefs.current[Math.max(0, Math.min(index, length - 1))];
      el?.focus();
      el?.select();
    }, [length]);

    useImperativeHandle(
      ref,
      () => ({
        focus: (index = 0) => focusIndex(index),
        clear: () => commit(Array.from({ length }, () => "")),
        getValue: () => slots.join(""),
      }),
      [commit, focusIndex, length, slots],
    );

    const didAutoFocus = useRef(false);
    useEffect(() => {
      if (!autoFocus || disabled || didAutoFocus.current) return;
      didAutoFocus.current = true;
      const firstEmpty = slots.findIndex((s) => !s);
      focusIndex(firstEmpty === -1 ? 0 : firstEmpty);
    }, [autoFocus, disabled, focusIndex, slots]);

    const updateAt = (index: number, char: string) => {
      const next = [...slots];
      next[index] = char;
      commit(next);
      if (char && index < length - 1) {
        focusIndex(index + 1);
      }
    };

    const handleKeyDown = (
      index: number,
      event: KeyboardEvent<HTMLInputElement>,
    ) => {
      if (disabled) return;

      if (event.key === "Backspace") {
        event.preventDefault();
        if (slots[index]) {
          updateAt(index, "");
        } else if (index > 0) {
          const next = [...slots];
          next[index - 1] = "";
          commit(next);
          focusIndex(index - 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusIndex(index - 1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusIndex(index + 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusIndex(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusIndex(length - 1);
        return;
      }

      if (event.key === "Delete") {
        event.preventDefault();
        updateAt(index, "");
      }
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      event.preventDefault();
      const raw = event.clipboardData.getData("text");
      const chars = raw
        .split("")
        .map((c) => sanitizeChar(c, pattern))
        .filter(Boolean)
        .slice(0, length);
      if (chars.length === 0) return;
      const next = Array.from({ length }, (_, i) => chars[i] ?? "");
      commit(next);
      focusIndex(Math.min(chars.length, length - 1));
    };

    const handleChange = (index: number, raw: string) => {
      if (disabled) return;
      // Prefer the last typed character (handles mobile overwrite)
      const chars = raw
        .split("")
        .map((c) => sanitizeChar(c, pattern))
        .filter(Boolean);
      if (chars.length === 0) {
        updateAt(index, "");
        return;
      }
      if (chars.length === 1) {
        updateAt(index, chars[0]!);
        return;
      }
      // Multi-char input (some IMEs / autofill into one field)
      const next = [...slots];
      chars.forEach((char, offset) => {
        if (index + offset < length) {
          next[index + offset] = char;
        }
      });
      commit(next);
      focusIndex(Math.min(index + chars.length, length - 1));
    };

    const resolvedSize = size ?? "default";
    const resolvedVariant = variant ?? "chrome";
    const resolvedState = state ?? "default";

    return (
      <div
        data-slot="otp-input"
        role="group"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn("flex w-full flex-wrap items-center gap-2", className)}
        {...props}
      >
        {name ? (
          <input type="hidden" name={name} value={slots.join("")} />
        ) : null}
        {slots.map((char, index) => (
          <input
            key={`${baseId}-${index}`}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            // First slot uses public `id` so <Label htmlFor={id}> focuses it.
            id={index === 0 ? baseId : `${baseId}-slot-${index}`}
            data-slot="otp-input-slot"
            type="text"
            inputMode={inputMode}
            autoComplete={index === 0 ? autoComplete : "off"}
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={length}
            disabled={disabled}
            value={char}
            aria-label={`Character ${index + 1} of ${length}`}
            className={cn(
              "w-full text-center font-medium glass-chrome-text",
              "transition-[border-color,box-shadow,background] duration-[var(--duration-normal)]",
              "[transition-timing-function:var(--ease-default)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "placeholder:glass-chrome-text-muted",
              focusRing,
              slotSizeStyles[resolvedSize],
              slotVariantStyles[resolvedVariant],
              slotStateStyles[resolvedState],
            )}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    );
  },
);
OtpInput.displayName = "OtpInput";

export { OtpInput };
