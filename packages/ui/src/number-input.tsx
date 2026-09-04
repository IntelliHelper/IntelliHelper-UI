"use client";

import { MinusIcon, PlusIcon } from "./icons";
import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "@intelli/utils";
import { Box } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import {
  clampNumber,
  parseNumericInput,
  roundToStep,
  stepDecimals,
} from "./tier3-utils";

const sizeStyles = {
  sm: { pad: "px-9", btn: "size-7 rounded-lg [&_svg]:size-3.5", side: "w-8" },
  default: { pad: "px-10", btn: "size-8 rounded-lg [&_svg]:size-4", side: "w-9" },
  lg: { pad: "px-12", btn: "size-9 rounded-xl [&_svg]:size-[1.125rem]", side: "w-11" },
} as const;

export interface NumberInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "value" | "defaultValue" | "onChange"
    >,
    FieldVariantProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Show +/- steppers. Default true. */
  steppers?: boolean;
  /** Format display while not focused. */
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
  decrementLabel?: string;
  incrementLabel?: string;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      min,
      max,
      step = 1,
      steppers = true,
      formatOptions,
      locale = "en-US",
      decrementLabel = "Decrease",
      incrementLabel = "Increase",
      disabled,
      id: idProp,
      onBlur,
      onFocus,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [uncontrolled, setUncontrolled] = useState<number | null>(
      defaultValue ?? null,
    );
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState("");
    const value = valueProp !== undefined ? valueProp : uncontrolled;
    const resolvedSize = size ?? "default";
    const styles = sizeStyles[resolvedSize];

    const commit = (next: number | null, options?: { syncDraft?: boolean }) => {
      let resolved = next;
      if (resolved !== null && Number.isFinite(resolved)) {
        resolved = clampNumber(roundToStep(resolved, step, min ?? 0), min, max);
      } else {
        resolved = null;
      }
      if (valueProp === undefined) setUncontrolled(resolved);
      onValueChange?.(resolved);
      // Steppers / arrow keys commit while focused — keep draft in sync so blur
      // does not re-apply a stale intermediate string.
      if (options?.syncDraft || focused) {
        setDraft(resolved === null || resolved === undefined ? "" : String(resolved));
      }
      return resolved;
    };

    const display =
      focused
        ? draft
        : value === null || value === undefined
          ? ""
          : formatOptions
            ? new Intl.NumberFormat(locale, formatOptions).format(value)
            : String(Number(value.toFixed(stepDecimals(step))));

    const nudge = (dir: 1 | -1) => {
      if (disabled) return;
      const base = value ?? min ?? 0;
      commit(base + dir * step, { syncDraft: true });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        nudge(1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        nudge(-1);
      }
      onKeyDown?.(e);
    };

    return (
      <Box
        data-slot="number-input"
        className={cn("relative w-full", disabled && "opacity-50")}
      >
        {steppers ? (
          <button
            type="button"
            data-slot="number-input-decrement"
            aria-label={decrementLabel}
            disabled={disabled || (min !== undefined && value !== null && value <= min)}
            className={cn(
              "absolute start-1 top-1/2 z-[1] inline-flex -translate-y-1/2 items-center justify-center",
              "text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]",
              "transition-[background,color,transform] duration-[var(--duration-normal)]",
              "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%, var(--glass-mix-into))]",
              "hover:text-[var(--glass-chrome-fg,var(--foreground))] active:scale-95",
              "disabled:pointer-events-none disabled:opacity-40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/40",
              styles.btn,
            )}
            onClick={() => nudge(-1)}
            tabIndex={-1}
          >
            <MinusIcon />
          </button>
        ) : null}
        <input
          ref={ref}
          id={id}
          type="text"
          inputMode="decimal"
          data-slot="number-input-field"
          disabled={disabled}
          value={display}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value ?? undefined}
          role="spinbutton"
          className={cn(
            fieldVariants({ variant, size, state }),
            steppers && styles.pad,
            "text-center tabular-nums",
            disabled && "opacity-100",
            className,
          )}
          onFocus={(e) => {
            setFocused(true);
            setDraft(
              value === null || value === undefined
                ? ""
                : String(value),
            );
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            const parsed = parseNumericInput(draft);
            commit(parsed);
            onBlur?.(e);
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            const parsed = parseNumericInput(e.target.value);
            if (parsed !== null) {
              if (valueProp === undefined) setUncontrolled(parsed);
              onValueChange?.(parsed);
            } else if (e.target.value.trim() === "") {
              if (valueProp === undefined) setUncontrolled(null);
              onValueChange?.(null);
            }
          }}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {steppers ? (
          <button
            type="button"
            data-slot="number-input-increment"
            aria-label={incrementLabel}
            disabled={disabled || (max !== undefined && value !== null && value >= max)}
            className={cn(
              "absolute end-1 top-1/2 z-[1] inline-flex -translate-y-1/2 items-center justify-center",
              "text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]",
              "transition-[background,color,transform] duration-[var(--duration-normal)]",
              "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%, var(--glass-mix-into))]",
              "hover:text-[var(--glass-chrome-fg,var(--foreground))] active:scale-95",
              "disabled:pointer-events-none disabled:opacity-40",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/40",
              styles.btn,
            )}
            onClick={() => nudge(1)}
            tabIndex={-1}
          >
            <PlusIcon />
          </button>
        ) : null}
      </Box>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
