"use client";

import { useState } from "react";
import { Calendar, type DateRange } from "@intelli/ui";

export function CalendarDemo() {
  const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-start gap-10">
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Single date</p>
          <p className="text-xs text-muted-foreground">
            Chrome panel with primary glass selection
          </p>
          <Calendar
            mode="single"
            selected={singleDate}
            onSelect={setSingleDate}
            variant="chrome"
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Date range</p>
          <p className="text-xs text-muted-foreground">
            Range start, middle, and end highlighting
          </p>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
            variant="elevated"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Dropdown caption</p>
        <p className="text-xs text-muted-foreground">
          Outline variant with month/year dropdowns
        </p>
        <Calendar
          mode="single"
          selected={singleDate}
          onSelect={setSingleDate}
          captionLayout="dropdown"
          startMonth={new Date(2024, 0)}
          endMonth={new Date(2028, 11)}
          variant="outline"
          size="lg"
        />
      </div>
    </div>
  );
}