"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Button } from "./button";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type EventCalendarColor =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info";

export type CalendarEvent = {
  /** Stable unique id for list keys and selection. */
  id: string;
  title: string;
  /** Inclusive event start (local date/time). */
  start: Date;
  /** Optional end; all-day multi-day spans use end of the last day. */
  end?: Date;
  /** When true, treat as a date-level event (no time shown). */
  allDay?: boolean;
  description?: string;
  location?: string;
  /** Semantic color token or custom CSS color string. */
  color?: EventCalendarColor | (string & {});
};

/* ─── Variants ──────────────────────────────────────────────────────────── */

const eventCalendarVariants = cva(
  [
    "group/event-calendar flex w-full min-w-0 flex-col overflow-hidden",
    "text-foreground",
  ],
  {
    variants: {
      variant: {
        chrome: "glass-panel rounded-2xl",
        elevated: "glass-header rounded-2xl",
        outline: [
          "rounded-2xl border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_35%,transparent)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
      },
      size: {
        sm: "[--ec-cell-min:4.5rem] [--ec-gap:0.25rem] [--ec-pad:0.75rem] [--ec-text:0.75rem] [--ec-title:0.8125rem] [--ec-chip:0.625rem]",
        default:
          "[--ec-cell-min:5.5rem] [--ec-gap:0.375rem] [--ec-pad:1rem] [--ec-text:0.8125rem] [--ec-title:0.9375rem] [--ec-chip:0.6875rem]",
        lg: "[--ec-cell-min:6.5rem] [--ec-gap:0.5rem] [--ec-pad:1.25rem] [--ec-text:0.875rem] [--ec-title:1rem] [--ec-chip:0.75rem]",
      },
      animated: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: ["chrome", "elevated"],
        animated: true,
        className: "animate-glass-rise",
      },
      {
        variant: "outline",
        animated: true,
        className: "animate-fade-in-up",
      },
    ],
    defaultVariants: {
      variant: "chrome",
      size: "default",
      animated: true,
    },
  },
);

const eventChipVariants = cva(
  [
    "flex min-w-0 items-center gap-1 truncate rounded-md border px-1.5 py-0.5",
    "text-left font-medium leading-tight",
    "transition-[filter,transform,background] duration-[var(--duration-fast,120ms)]",
    "hover:brightness-105 active:scale-[0.98]",
    focusRing,
  ],
  {
    variants: {
      color: {
        default: [
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
        ],
        primary: [
          "border-[color-mix(in_oklch,var(--primary)_42%,transparent)]",
          "bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
          "text-primary",
        ],
        success: [
          "border-[color-mix(in_oklch,oklch(0.62_0.17_145)_42%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_16%,transparent)]",
          "text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
        ],
        warning: [
          "border-[color-mix(in_oklch,oklch(0.78_0.16_75)_42%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.78_0.16_75)_18%,transparent)]",
          "text-[color-mix(in_oklch,oklch(0.55_0.14_55)_90%,var(--foreground))]",
        ],
        destructive: [
          "border-[color-mix(in_oklch,var(--destructive)_42%,transparent)]",
          "bg-[color-mix(in_oklch,var(--destructive)_16%,transparent)]",
          "text-destructive",
        ],
        info: [
          "border-[color-mix(in_oklch,oklch(0.65_0.14_240)_42%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.65_0.14_240)_16%,transparent)]",
          "text-[color-mix(in_oklch,oklch(0.5_0.14_240)_90%,var(--foreground))]",
        ],
      },
    },
    defaultVariants: {
      color: "default",
    },
  },
);

const eventDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    color: {
      default: "bg-[var(--glass-chrome-fg)]/55",
      primary: "bg-primary",
      success: "bg-[oklch(0.62_0.17_145)]",
      warning: "bg-[oklch(0.78_0.16_75)]",
      destructive: "bg-destructive",
      info: "bg-[oklch(0.65_0.14_240)]",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

/* ─── Icons ─────────────────────────────────────────────────────────────── */

function ChevronLeftIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="m9 18 6-6 6-6" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarDaysIcon({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const TOKEN_COLORS = new Set<string>([
  "default",
  "primary",
  "success",
  "warning",
  "destructive",
  "info",
]);

function isTokenColor(color?: string): color is EventCalendarColor {
  return !!color && TOKEN_COLORS.has(color);
}

function resolveEventColor(
  color?: CalendarEvent["color"],
): EventCalendarColor {
  if (isTokenColor(color)) return color;
  return "default";
}

function isCustomColor(color?: CalendarEvent["color"]): color is string {
  return typeof color === "string" && color.length > 0 && !isTokenColor(color);
}

function eventOccursOnDay(event: CalendarEvent, day: Date): boolean {
  const dayStart = startOfDay(day);
  const start = startOfDay(event.start);
  const end = startOfDay(event.end ?? event.start);
  if (end < start) {
    return isSameDay(dayStart, start);
  }
  return isWithinInterval(dayStart, { start, end });
}

function eventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events
    .filter((event) => eventOccursOnDay(event, day))
    .sort((a, b) => {
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      return a.start.getTime() - b.start.getTime();
    });
}

function formatEventTime(event: CalendarEvent): string {
  if (event.allDay) return "All day";
  const startLabel = format(event.start, "h:mm a");
  if (!event.end || isSameDay(event.start, event.end)) {
    if (event.end && event.end.getTime() !== event.start.getTime()) {
      return `${startLabel} – ${format(event.end, "h:mm a")}`;
    }
    return startLabel;
  }
  return `${format(event.start, "MMM d, h:mm a")} – ${format(event.end, "MMM d, h:mm a")}`;
}

function weekdayLabels(weekStartsOn: 0 | 1): string[] {
  const base = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (weekStartsOn === 1) {
    return [...base.slice(1), base[0]!];
  }
  return base;
}

/* ─── Subcomponents ─────────────────────────────────────────────────────── */

export type EventCalendarChipProps = {
  event: CalendarEvent;
  className?: string;
  compact?: boolean;
  onClick?: (event: CalendarEvent, e: MouseEvent<HTMLButtonElement>) => void;
};

function EventCalendarChip({
  event,
  className,
  compact = false,
  onClick,
}: EventCalendarChipProps) {
  const token = resolveEventColor(event.color);
  const custom = isCustomColor(event.color);

  return (
    <button
      type="button"
      data-slot="event-calendar-chip"
      data-event-id={event.id}
      title={event.title}
      className={cn(
        eventChipVariants({ color: token }),
        compact && "px-1 py-px",
        className,
      )}
      style={
        custom
          ? {
              borderColor: `color-mix(in oklch, ${event.color} 42%, transparent)`,
              background: `color-mix(in oklch, ${event.color} 18%, transparent)`,
              color: event.color,
            }
          : undefined
      }
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event, e);
      }}
    >
      <span
        className={cn(
          eventDotVariants({ color: token }),
          compact && "size-1",
        )}
        style={custom ? { backgroundColor: event.color } : undefined}
      />
      <span
        className={cn(
          "min-w-0 truncate",
          compact
            ? "text-[length:var(--ec-chip)]"
            : "text-[length:var(--ec-chip)]",
        )}
      >
        {event.title}
      </span>
    </button>
  );
}

export type EventCalendarEventRowProps = {
  event: CalendarEvent;
  className?: string;
  onClick?: (event: CalendarEvent) => void;
};

function EventCalendarEventRow({
  event,
  className,
  onClick,
}: EventCalendarEventRowProps) {
  const token = resolveEventColor(event.color);
  const custom = isCustomColor(event.color);

  return (
    <button
      type="button"
      data-slot="event-calendar-event-row"
      data-event-id={event.id}
      className={cn(
        "flex w-full min-w-0 items-start gap-3 rounded-xl border p-3 text-left",
        "border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_28%,transparent)]",
        "transition-[background,transform,box-shadow] duration-[var(--duration-normal)]",
        "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
        "hover:shadow-[var(--glass-chrome-inset)]",
        "active:scale-[0.99]",
        focusRing,
        className,
      )}
      onClick={() => onClick?.(event)}
    >
      <span
        className={cn(
          "mt-1 size-2.5 shrink-0 rounded-full ring-2 ring-background",
          eventDotVariants({ color: token }),
          "size-2.5",
        )}
        style={custom ? { backgroundColor: event.color } : undefined}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 space-y-1">
        <span className="block truncate text-sm font-semibold text-foreground">
          {event.title}
        </span>
        <span className="block text-xs glass-chrome-text-muted">
          {formatEventTime(event)}
        </span>
        {event.location ? (
          <span className="flex items-center gap-1 text-xs glass-chrome-text-muted">
            <MapPinIcon className="size-3 shrink-0 opacity-70" />
            <span className="truncate">{event.location}</span>
          </span>
        ) : null}
        {event.description ? (
          <span className="line-clamp-2 block text-xs text-muted-foreground">
            {event.description}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */

export type EventCalendarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> &
  VariantProps<typeof eventCalendarVariants> & {
    events?: CalendarEvent[];
    /** Controlled visible month. */
    month?: Date;
    defaultMonth?: Date;
    onMonthChange?: (month: Date) => void;
    /** Controlled selected day (agenda focus). */
    selectedDate?: Date;
    defaultSelectedDate?: Date;
    onSelectedDateChange?: (date: Date | undefined) => void;
    onEventClick?: (event: CalendarEvent) => void;
    onDayClick?: (date: Date, dayEvents: CalendarEvent[]) => void;
    /** Max event chips rendered per day cell before "+N more". */
    maxEventsPerDay?: number;
    /** Show the selected-day agenda panel beside the month grid. */
    showAgenda?: boolean;
    weekStartsOn?: 0 | 1;
    /** Optional header title override. */
    title?: string;
  };

function EventCalendar({
  className,
  variant,
  size,
  animated,
  events = [],
  month: monthProp,
  defaultMonth,
  onMonthChange,
  selectedDate: selectedProp,
  defaultSelectedDate,
  onSelectedDateChange,
  onEventClick,
  onDayClick,
  maxEventsPerDay = 3,
  showAgenda = true,
  weekStartsOn = 0,
  title,
  ...props
}: EventCalendarProps) {
  const labelId = useId();
  const [internalMonth, setInternalMonth] = useState<Date>(
    () => defaultMonth ?? selectedProp ?? defaultSelectedDate ?? new Date(),
  );
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(
    () => defaultSelectedDate ?? new Date(),
  );

  const month = monthProp ?? internalMonth;
  const selectedDate =
    selectedProp !== undefined ? selectedProp : internalSelected;

  const setMonth = useCallback(
    (next: Date) => {
      if (monthProp === undefined) setInternalMonth(next);
      onMonthChange?.(next);
    },
    [monthProp, onMonthChange],
  );

  const setSelected = useCallback(
    (next: Date | undefined) => {
      if (selectedProp === undefined) setInternalSelected(next);
      onSelectedDateChange?.(next);
    },
    [selectedProp, onSelectedDateChange],
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn });
    return eachDayOfInterval({ start, end });
  }, [month, weekStartsOn]);

  const weeks = useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(days.slice(i, i + 7));
    }
    return rows;
  }, [days]);

  const weekdays = useMemo(() => weekdayLabels(weekStartsOn), [weekStartsOn]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsForDay(events, selectedDate);
  }, [events, selectedDate]);

  const goPrev = () => setMonth(subMonths(month, 1));
  const goNext = () => setMonth(addMonths(month, 1));
  const goToday = () => {
    const today = new Date();
    setMonth(today);
    setSelected(today);
  };

  const handleDayClick = (day: Date) => {
    const dayEvents = eventsForDay(events, day);
    setSelected(day);
    if (!isSameMonth(day, month)) {
      setMonth(day);
    }
    onDayClick?.(day, dayEvents);
  };

  const handleDayKeyDown = (e: KeyboardEvent<HTMLDivElement>, day: Date) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDayClick(day);
    }
  };

  return (
    <div
      data-slot="event-calendar"
      role="application"
      aria-labelledby={labelId}
      className={cn(
        eventCalendarVariants({ variant, size, animated, className }),
      )}
      {...props}
    >
      {/* Header */}
      <div
        data-slot="event-calendar-header"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--glass-chrome-border)] p-[var(--ec-pad)]"
      >
        <div className="min-w-0 space-y-0.5">
          <h2
            id={labelId}
            className="truncate font-semibold tracking-tight glass-chrome-text text-[length:var(--ec-title)]"
          >
            {title ?? format(month, "MMMM yyyy")}
          </h2>
          <p className="text-xs glass-chrome-text-muted">
            {events.length === 0
              ? "No events scheduled"
              : `${events.length} event${events.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs"
            onClick={goToday}
          >
            Today
          </Button>
          <div
            className={cn(
              "flex items-center rounded-xl border border-[var(--glass-chrome-border)]",
              "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_32%,transparent)]",
              "p-0.5 shadow-[var(--glass-chrome-inset)]",
            )}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg"
              aria-label="Previous month"
              onClick={goPrev}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg"
              aria-label="Next month"
              onClick={goNext}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          "grid min-h-0 flex-1",
          showAgenda
            ? "lg:grid-cols-[minmax(0,1fr)_16.5rem]"
            : "grid-cols-1",
        )}
      >
        {/* Month grid */}
        <div
          data-slot="event-calendar-grid"
          className="min-w-0 p-[var(--ec-pad)]"
        >
          <div
            className="mb-2 grid grid-cols-7 gap-[var(--ec-gap)]"
            aria-hidden="true"
          >
            {weekdays.map((label) => (
              <div
                key={label}
                className="px-1 text-center text-[0.65rem] font-medium uppercase tracking-wider glass-chrome-text-muted"
              >
                {label}
              </div>
            ))}
          </div>

          <div
            className="grid gap-[var(--ec-gap)]"
            role="grid"
            aria-label={format(month, "MMMM yyyy")}
          >
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                role="row"
                className="grid grid-cols-7 gap-[var(--ec-gap)]"
              >
                {week.map((day) => {
                  const dayEvents = eventsForDay(events, day);
                  const outside = !isSameMonth(day, month);
                  const today = isToday(day);
                  const selected =
                    selectedDate !== undefined && isSameDay(day, selectedDate);
                  const visible = dayEvents.slice(0, maxEventsPerDay);
                  const overflow = dayEvents.length - visible.length;

                  return (
                    <div
                      key={day.toISOString()}
                      role="gridcell"
                      tabIndex={selected || (today && !selectedDate) ? 0 : -1}
                      aria-selected={selected}
                      aria-label={`${format(day, "EEEE, MMMM d")}${
                        dayEvents.length
                          ? `, ${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`
                          : ""
                      }`}
                      data-today={today || undefined}
                      data-selected={selected || undefined}
                      data-outside={outside || undefined}
                      className={cn(
                        "group/day flex min-h-[var(--ec-cell-min)] cursor-pointer flex-col gap-1 rounded-xl border p-1.5",
                        "border-transparent",
                        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_18%,transparent)]",
                        "transition-[background,border-color,box-shadow,transform]",
                        "duration-[var(--duration-normal)]",
                        "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_38%,transparent)]",
                        "hover:border-[var(--glass-chrome-border)]",
                        outside && "opacity-45",
                        today &&
                          !selected &&
                          "ring-1 ring-[color-mix(in_oklch,var(--primary)_38%,transparent)]",
                        selected && [
                          "border-[color-mix(in_oklch,var(--primary)_45%,transparent)]",
                          "bg-[color-mix(in_oklch,var(--primary)_12%,transparent)]",
                          "shadow-[var(--glass-chrome-inset)]",
                        ],
                        focusRing,
                      )}
                      onClick={() => handleDayClick(day)}
                      onKeyDown={(e) => handleDayKeyDown(e, day)}
                    >
                      <div className="flex items-center justify-between gap-1 px-0.5">
                        <span
                          className={cn(
                            "inline-flex size-6 items-center justify-center rounded-lg text-[length:var(--ec-text)] tabular-nums",
                            "font-medium glass-chrome-text",
                            today &&
                              "bg-[color-mix(in_oklch,var(--primary)_78%,transparent)] text-primary-foreground shadow-[var(--glass-chrome-inset)]",
                            selected &&
                              !today &&
                              "font-semibold text-primary",
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {dayEvents.length > 0 ? (
                          <span className="hidden text-[0.6rem] tabular-nums glass-chrome-text-muted sm:inline">
                            {dayEvents.length}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                        {visible.map((event) => (
                          <EventCalendarChip
                            key={event.id}
                            event={event}
                            compact
                            onClick={(ev) => onEventClick?.(ev)}
                          />
                        ))}
                        {overflow > 0 ? (
                          <span className="px-1 text-[length:var(--ec-chip)] font-medium glass-chrome-text-muted">
                            +{overflow} more
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Agenda sidebar */}
        {showAgenda ? (
          <aside
            data-slot="event-calendar-agenda"
            className={cn(
              "flex min-h-0 flex-col border-t border-[var(--glass-chrome-border)]",
              "lg:border-l lg:border-t-0",
              "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_14%,transparent)]",
            )}
          >
            <div className="border-b border-[var(--glass-chrome-border)] p-[var(--ec-pad)]">
              <p className="text-xs font-medium uppercase tracking-wider glass-chrome-text-muted">
                Agenda
              </p>
              <p className="mt-1 text-sm font-semibold glass-chrome-text">
                {selectedDate
                  ? format(selectedDate, "EEEE, MMM d")
                  : "Select a day"}
              </p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-[var(--ec-pad)]">
              {!selectedDate ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CalendarDaysIcon className="size-8 opacity-40" />
                  <p className="text-sm glass-chrome-text-muted">
                    Select a day to view events
                  </p>
                </div>
              ) : selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CalendarDaysIcon className="size-8 opacity-40" />
                  <p className="text-sm font-medium glass-chrome-text">
                    Free day
                  </p>
                  <p className="text-xs glass-chrome-text-muted">
                    No events scheduled for this date
                  </p>
                </div>
              ) : (
                selectedDayEvents.map((event) => (
                  <EventCalendarEventRow
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                  />
                ))
              )}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export {
  EventCalendar,
  EventCalendarChip,
  EventCalendarEventRow,
  eventCalendarVariants,
  eventChipVariants,
  eventsForDay,
  eventOccursOnDay,
};
