"use client";

import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Box, Flex, Grid, Stack } from "./layout";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import { isValidHexColor, normalizeHexColor } from "./tier3-utils";

const DEFAULT_SWATCHES = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#0f172a",
  "#ffffff",
  "#000000",
];

export interface ColorPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  swatches?: string[];
  disabled?: boolean;
  placeholder?: string;
  /** Show native color input. Default true. */
  showNative?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      value: valueProp,
      defaultValue = "#3b82f6",
      onValueChange,
      swatches = DEFAULT_SWATCHES,
      disabled = false,
      placeholder = "Pick a color",
      showNative = true,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const listId = useId();
    const [uncontrolled, setUncontrolled] = useState(
      normalizeHexColor(defaultValue) ?? "#3b82f6",
    );
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [hexDraft, setHexDraft] = useState("");
    const value =
      valueProp !== undefined
        ? normalizeHexColor(valueProp) ?? valueProp
        : uncontrolled;
    const open = openProp !== undefined ? openProp : uncontrolledOpen;

    const setOpen = (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (next) setHexDraft(value);
    };

    const commit = (raw: string) => {
      const next = normalizeHexColor(raw);
      if (!next) return;
      if (valueProp === undefined) setUncontrolled(next);
      onValueChange?.(next);
      setHexDraft(next);
    };

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="color-picker"
        className={cn("w-full", className)}
        {...props}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              data-slot="color-picker-trigger"
              className={cn(
                fieldVariants({ variant, size, state }),
                "inline-flex items-center gap-2 text-left font-normal",
                focusRing,
                disabled && "opacity-50",
              )}
              aria-label={placeholder}
            >
              <Box
                as="span"
                className="size-5 shrink-0 rounded-md border border-[var(--glass-chrome-border)] shadow-inner"
                style={{ backgroundColor: value }}
                aria-hidden
              />
              <Box as="span" className="flex-1 truncate tabular-nums uppercase">
                {value || placeholder}
              </Box>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-64"
            data-slot="color-picker-content"
          >
            <Stack gap={3}>
              <Grid
                as="div"
                cols={6}
                gap={2}
                role="listbox"
                id={listId}
                aria-label="Color swatches"
              >
                {swatches.map((swatch) => {
                  const hex = normalizeHexColor(swatch) ?? swatch;
                  const selected = hex.toLowerCase() === value.toLowerCase();
                  return (
                    <button
                      key={hex}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-label={hex}
                      className={cn(
                        "size-8 rounded-lg border-2 transition-transform active:scale-95",
                        selected
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-[var(--glass-chrome-border)]",
                        focusRing,
                      )}
                      style={{ backgroundColor: hex }}
                      onClick={() => {
                        commit(hex);
                        setOpen(false);
                      }}
                    />
                  );
                })}
              </Grid>
              <Flex align="center" gap={2}>
                {showNative ? (
                  <input
                    type="color"
                    value={normalizeHexColor(value) ?? "#000000"}
                    aria-label="Native color picker"
                    className="size-10 cursor-pointer rounded-lg border border-[var(--glass-chrome-border)] bg-transparent p-0.5"
                    onChange={(e) => commit(e.target.value)}
                  />
                ) : null}
                <input
                  type="text"
                  value={hexDraft}
                  spellCheck={false}
                  aria-label="Hex color"
                  placeholder="#000000"
                  className={cn(
                    fieldVariants({ variant: "outline", size: "sm" }),
                    "flex-1 font-mono uppercase",
                    !isValidHexColor(hexDraft) &&
                      hexDraft.length > 0 &&
                      "border-destructive/60",
                  )}
                  onChange={(e) => setHexDraft(e.target.value)}
                  onBlur={() => {
                    if (isValidHexColor(hexDraft)) commit(hexDraft);
                    else setHexDraft(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isValidHexColor(hexDraft)) {
                      commit(hexDraft);
                      setOpen(false);
                    }
                  }}
                />
              </Flex>
            </Stack>
          </PopoverContent>
        </Popover>
      </Box>
    );
  },
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker, DEFAULT_SWATCHES };
