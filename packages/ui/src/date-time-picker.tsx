"use client";

import {
  forwardRef,
  useState,
  type HTMLAttributes,
} from "react";
import { format as formatDate } from "date-fns";
import { cn, focusRing } from "@intelli/utils";
import { Box, Stack } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { TimePicker } from "./time-picker";
import {
  dateToTimeValue,
  formatTimeValue,
  normalizeTimeValue,
  timeValueToDate,
  type TimeValue,
} from "./tier3-utils";

function CalendarClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M12 14v2l1 1" />
    </svg>
  );
}

export interface DateTimePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  hour12?: boolean;
  withSeconds?: boolean;
  disabled?: boolean;
  placeholder?: string;
  dateFormat?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      hour12 = false,
      withSeconds = false,
      disabled = false,
      placeholder = "Pick date & time",
      dateFormat = "PPP",
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState<Date | null>(
      defaultValue ?? null,
    );
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const value = valueProp !== undefined ? valueProp : uncontrolled;
    const open = openProp !== undefined ? openProp : uncontrolledOpen;

    const setOpen = (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    };

    const commit = (next: Date | null) => {
      if (valueProp === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const time: TimeValue | null = value
      ? dateToTimeValue(value, withSeconds)
      : null;

    const display = value
      ? `${formatDate(value, dateFormat)} · ${formatTimeValue(
          dateToTimeValue(value, withSeconds),
          { hour12, withSeconds },
        )}`
      : "";

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="date-time-picker"
        className={cn("w-full", className)}
        {...props}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              data-slot="date-time-picker-trigger"
              className={cn(
                fieldVariants({ variant, size, state }),
                "inline-flex items-center gap-2 text-left font-normal",
                focusRing,
                disabled && "opacity-50",
              )}
            >
              <CalendarClockIcon className="size-4 shrink-0 opacity-70" />
              <Box
                as="span"
                className={cn("flex-1 truncate", !display && "glass-chrome-text-muted")}
              >
                {display || placeholder}
              </Box>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-auto p-3"
            data-slot="date-time-picker-content"
          >
            <Stack gap={3}>
              <Calendar
                mode="single"
                selected={value ?? undefined}
                onSelect={(day) => {
                  if (!day) {
                    commit(null);
                    return;
                  }
                  const t = time ?? normalizeTimeValue({ hours: 0, minutes: 0 }, withSeconds);
                  commit(timeValueToDate(day, t));
                }}
                size="sm"
                shape="auto"
                animated={false}
              />
              <Box className="border-t border-[var(--glass-chrome-border)] pt-3">
                <TimePicker
                  value={time}
                  hour12={hour12}
                  withSeconds={withSeconds}
                  onValueChange={(t) => {
                    const base = value ?? new Date();
                    commit(timeValueToDate(base, t));
                  }}
                  size="sm"
                />
              </Box>
            </Stack>
          </PopoverContent>
        </Popover>
      </Box>
    );
  },
);
DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };
