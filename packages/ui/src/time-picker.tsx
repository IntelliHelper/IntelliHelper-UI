"use client";

import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Box, Flex, Stack } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  formatTimeValue,
  normalizeTimeValue,
  parseTimeString,
  type TimeValue,
} from "./tier3-utils";

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function range(max: number, step = 1): number[] {
  const out: number[] = [];
  for (let i = 0; i < max; i += step) out.push(i);
  return out;
}

export interface TimePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onValueChange?: (value: TimeValue) => void;
  hour12?: boolean;
  withSeconds?: boolean;
  minuteStep?: number;
  secondStep?: number;
  disabled?: boolean;
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
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
      minuteStep = 5,
      secondStep = 1,
      disabled = false,
      placeholder = "Select time",
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const labelId = useId();
    const [uncontrolled, setUncontrolled] = useState<TimeValue | null>(
      defaultValue
        ? normalizeTimeValue(defaultValue, withSeconds)
        : null,
    );
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const value =
      valueProp !== undefined
        ? valueProp
          ? normalizeTimeValue(valueProp, withSeconds)
          : null
        : uncontrolled;
    const open = openProp !== undefined ? openProp : uncontrolledOpen;

    const setOpen = (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    };

    const commit = (next: TimeValue) => {
      const normalized = normalizeTimeValue(next, withSeconds);
      if (valueProp === undefined) setUncontrolled(normalized);
      onValueChange?.(normalized);
    };

    const hours = useMemo(() => {
      if (hour12) return range(12).map((h) => (h === 0 ? 12 : h));
      return range(24);
    }, [hour12]);

    const minutes = useMemo(() => range(60, minuteStep), [minuteStep]);
    const seconds = useMemo(() => range(60, secondStep), [secondStep]);

    const display = value
      ? formatTimeValue(value, { hour12, withSeconds })
      : "";

    const period = value && value.hours >= 12 ? "PM" : "AM";
    const hourDisplay = value
      ? hour12
        ? value.hours % 12 === 0
          ? 12
          : value.hours % 12
        : value.hours
      : null;

    const setHourFromDisplay = (h: number) => {
      let hours24 = h;
      if (hour12) {
        const isPm = (value?.hours ?? 0) >= 12;
        if (h === 12) hours24 = isPm ? 12 : 0;
        else hours24 = isPm ? h + 12 : h;
      }
      commit({
        hours: hours24,
        minutes: value?.minutes ?? 0,
        seconds: value?.seconds ?? 0,
      });
    };

    const setPeriod = (next: "AM" | "PM") => {
      const base = value ?? { hours: 0, minutes: 0, seconds: 0 };
      let h = base.hours % 12;
      if (next === "PM") h = h === 0 ? 12 : h + 12;
      // when AM and h was 12 (noon), becomes 0
      if (next === "AM" && base.hours >= 12) {
        h = base.hours === 12 ? 0 : base.hours - 12;
      }
      if (next === "PM" && base.hours < 12) {
        h = base.hours === 0 ? 12 : base.hours + 12;
      }
      commit({ ...base, hours: h });
    };

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="time-picker"
        className={cn("w-full", className)}
        {...props}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              id={labelId}
              disabled={disabled}
              data-slot="time-picker-trigger"
              className={cn(
                fieldVariants({ variant, size, state }),
                "inline-flex items-center gap-2 text-left font-normal tabular-nums",
                focusRing,
                disabled && "opacity-50",
              )}
            >
              <ClockIcon className="size-4 shrink-0 opacity-70" />
              <Box
                as="span"
                className={cn("flex-1 truncate", !display && "glass-chrome-text-muted")}
              >
                {display || placeholder}
              </Box>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-3" data-slot="time-picker-content">
            <Stack gap={3}>
              <Flex gap={2}>
                <TimeColumn
                  label="Hour"
                  items={hours}
                  selected={hourDisplay}
                  onSelect={setHourFromDisplay}
                />
                <TimeColumn
                  label="Minute"
                  items={minutes}
                  selected={value?.minutes ?? null}
                  onSelect={(m) =>
                    commit({
                      hours: value?.hours ?? 0,
                      minutes: m,
                      seconds: value?.seconds ?? 0,
                    })
                  }
                />
                {withSeconds ? (
                  <TimeColumn
                    label="Second"
                    items={seconds}
                    selected={value?.seconds ?? null}
                    onSelect={(s) =>
                      commit({
                        hours: value?.hours ?? 0,
                        minutes: value?.minutes ?? 0,
                        seconds: s,
                      })
                    }
                  />
                ) : null}
                {hour12 ? (
                  <Stack gap={1} className="pt-6">
                    {(["AM", "PM"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={cn(
                          "rounded-lg px-2.5 py-1.5 text-xs font-semibold",
                          period === p
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
                          focusRing,
                        )}
                        onClick={() => setPeriod(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </Stack>
                ) : null}
              </Flex>
              <Box className="border-t border-[var(--glass-chrome-border)] pt-2">
                <input
                  type="text"
                  aria-label="Type a time"
                  placeholder={hour12 ? "2:30 PM" : "14:30"}
                  defaultValue={display}
                  key={display}
                  className={cn(fieldVariants({ variant: "outline", size: "sm" }), "tabular-nums")}
                  onBlur={(e) => {
                    const parsed = parseTimeString(e.target.value);
                    if (parsed) commit(parsed);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const parsed = parseTimeString(
                        (e.target as HTMLInputElement).value,
                      );
                      if (parsed) {
                        commit(parsed);
                        setOpen(false);
                      }
                    }
                  }}
                />
              </Box>
            </Stack>
          </PopoverContent>
        </Popover>
      </Box>
    );
  },
);
TimePicker.displayName = "TimePicker";

function TimeColumn({
  label,
  items,
  selected,
  onSelect,
}: {
  label: string;
  items: number[];
  selected: number | null;
  onSelect: (n: number) => void;
}) {
  return (
    <Stack gap={1}>
      <Box
        as="span"
        className="px-1 text-[10px] font-semibold uppercase tracking-wide glass-chrome-text-muted"
      >
        {label}
      </Box>
      <Stack gap={0.5} className="max-h-40 overflow-y-auto pr-0.5">
        {items.map((n) => (
          <button
            key={n}
            type="button"
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-sm tabular-nums",
              selected === n
                ? "bg-primary/20 font-semibold text-primary"
                : "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
              focusRing,
            )}
            onClick={() => onSelect(n)}
          >
            {String(n).padStart(2, "0")}
          </button>
        ))}
      </Stack>
    </Stack>
  );
}

export { TimePicker };
export type { TimeValue };
