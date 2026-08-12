"use client";

import { CalendarIcon } from "./icons";
import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Box, Grid, Split, Stack } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  formatMonthValue,
  monthGrid,
  normalizeMonthValue,
  type MonthValue,
} from "./tier3-utils";

export interface MonthPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps {
  value?: MonthValue | null;
  defaultValue?: MonthValue | null;
  onValueChange?: (value: MonthValue) => void;
  locale?: string;
  disabled?: boolean;
  placeholder?: string;
  minYear?: number;
  maxYear?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MonthPicker = forwardRef<HTMLDivElement, MonthPickerProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      locale = "en-US",
      disabled = false,
      placeholder = "Select month",
      minYear = 1970,
      maxYear = 2100,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const now = new Date();
    const [uncontrolled, setUncontrolled] = useState<MonthValue | null>(
      defaultValue ? normalizeMonthValue(defaultValue) : null,
    );
    const [viewYear, setViewYear] = useState(
      () =>
        (valueProp ?? defaultValue)?.year ?? now.getFullYear(),
    );
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const value =
      valueProp !== undefined
        ? valueProp
          ? normalizeMonthValue(valueProp)
          : null
        : uncontrolled;
    const open = openProp !== undefined ? openProp : uncontrolledOpen;

    const setOpen = (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (next && value) setViewYear(value.year);
    };

    const commit = (next: MonthValue) => {
      const normalized = normalizeMonthValue(next);
      if (valueProp === undefined) setUncontrolled(normalized);
      onValueChange?.(normalized);
      setOpen(false);
    };

    const months = useMemo(() => monthGrid(viewYear), [viewYear]);
    const labels = useMemo(() => {
      return months.map((m) =>
        formatMonthValue(m, locale, { month: "short", year: undefined }),
      );
    }, [months, locale]);

    const display = value ? formatMonthValue(value, locale) : "";

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="month-picker"
        className={cn("w-full", className)}
        {...props}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              data-slot="month-picker-trigger"
              className={cn(
                fieldVariants({ variant, size, state }),
                "inline-flex items-center gap-2 text-left font-normal",
                focusRing,
                disabled && "opacity-50",
              )}
            >
              <CalendarIcon className="size-4 shrink-0 opacity-70" />
              <Box
                as="span"
                className={cn("flex-1 truncate", !display && "glass-chrome-text-muted")}
              >
                {display || placeholder}
              </Box>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-3" data-slot="month-picker-content">
            <Stack gap={3}>
              <Split align="center" gap={2} wrap={false}>
                <button
                  type="button"
                  aria-label="Previous year"
                  disabled={viewYear <= minYear}
                  className={cn(
                    "rounded-lg px-2 py-1 text-sm hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)] disabled:opacity-40",
                    focusRing,
                  )}
                  onClick={() => setViewYear((y) => Math.max(minYear, y - 1))}
                >
                  ‹
                </button>
                <Box as="span" className="text-sm font-semibold tabular-nums">
                  {viewYear}
                </Box>
                <button
                  type="button"
                  aria-label="Next year"
                  disabled={viewYear >= maxYear}
                  className={cn(
                    "rounded-lg px-2 py-1 text-sm hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)] disabled:opacity-40",
                    focusRing,
                  )}
                  onClick={() => setViewYear((y) => Math.min(maxYear, y + 1))}
                >
                  ›
                </button>
              </Split>
              <Grid cols={3} gap={2}>
                {months.map((m, i) => {
                  const selected =
                    value?.year === m.year && value?.month === m.month;
                  return (
                    <button
                      key={m.month}
                      type="button"
                      className={cn(
                        "rounded-xl px-2 py-2.5 text-sm font-medium transition-colors",
                        selected
                          ? "bg-primary/20 text-primary"
                          : "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
                        focusRing,
                      )}
                      onClick={() => commit(m)}
                    >
                      {labels[i]}
                    </button>
                  );
                })}
              </Grid>
            </Stack>
          </PopoverContent>
        </Popover>
      </Box>
    );
  },
);
MonthPicker.displayName = "MonthPicker";

export { MonthPicker };
export type { MonthValue };
