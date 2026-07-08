"use client";

import { useState } from "react";
import { Calendar, type DateRange } from "@intelli/ui";

const DEMO_REFERENCE_DATE = new Date(2026, 6, 6);
const DEMO_RANGE_END = new Date(2026, 6, 10);

export function CalendarSingleDemo() {
  const [date, setDate] = useState<Date | undefined>(DEMO_REFERENCE_DATE);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      variant="chrome"
      defaultMonth={DEMO_REFERENCE_DATE}
    />
  );
}

export function CalendarRangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: DEMO_REFERENCE_DATE,
    to: DEMO_RANGE_END,
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={1}
      variant="elevated"
      defaultMonth={DEMO_REFERENCE_DATE}
    />
  );
}

export function CalendarDropdownDemo() {
  const [date, setDate] = useState<Date | undefined>(DEMO_REFERENCE_DATE);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      startMonth={new Date(2024, 0)}
      endMonth={new Date(2028, 11)}
      defaultMonth={DEMO_REFERENCE_DATE}
      variant="outline"
      size="lg"
    />
  );
}

/** Combined showcase — used only where a full overview is needed. */
export function CalendarDemo() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-start gap-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Single date</p>
          <p className="text-xs text-muted-foreground">
            Chrome panel with primary glass selection
          </p>
          <CalendarSingleDemo />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Date range</p>
          <p className="text-xs text-muted-foreground">
            Range start, middle, and end highlighting
          </p>
          <CalendarRangeDemo />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Dropdown caption</p>
        <p className="text-xs text-muted-foreground">
          Outline variant with month/year dropdowns
        </p>
        <CalendarDropdownDemo />
      </div>
    </div>
  );
}