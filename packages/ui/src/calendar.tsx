"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useRef } from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type ChevronProps,
  type DateRange,
  type DayButtonProps,
  type DayPickerProps,
  type RootProps,
  type WeekNumberProps,
} from "react-day-picker";
import { cn, focusRing } from "@intelli/utils";
import { Button, buttonVariants, type ButtonProps } from "./button";

const calendarVariants = cva(
  [
    "group/calendar",
    "[[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
    "[--calendar-track:calc(7*var(--cell-size)+6*var(--cell-gap))]",
    String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
    String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
  ],
  {
    variants: {
      shape: {
        square: [
          "[--calendar-size:calc(var(--calendar-pad)*2+var(--calendar-track))]",
          "flex aspect-square w-[var(--calendar-size)] flex-col items-center justify-center",
        ],
        auto: "w-fit",
      },
      size: {
        sm: [
          "[--calendar-pad:0.75rem] p-3 [--cell-size:2.25rem] [--cell-gap:0.25rem]",
          "[--calendar-text:0.8125rem] [--calendar-weekday:0.6rem] [--calendar-caption:0.8125rem]",
        ],
        default: [
          "[--calendar-pad:1rem] p-4 [--cell-size:2.5rem] [--cell-gap:0.375rem]",
          "[--calendar-text:0.875rem] [--calendar-weekday:0.65rem] [--calendar-caption:0.875rem]",
        ],
        lg: [
          "[--calendar-pad:1.25rem] p-5 [--cell-size:2.75rem] [--cell-gap:0.5rem]",
          "[--calendar-text:1rem] [--calendar-weekday:0.7rem] [--calendar-caption:1rem]",
        ],
      },
      variant: {
        chrome: "glass-panel rounded-2xl text-foreground",
        elevated: "glass-header rounded-2xl text-foreground",
        outline: [
          "rounded-2xl border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_35%,transparent)]",
          "shadow-[var(--glass-chrome-shadow)] text-foreground",
        ],
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
      shape: "square",
      size: "default",
      variant: "chrome",
      animated: true,
    },
  },
);

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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export type CalendarProps = DayPickerProps &
  VariantProps<typeof calendarVariants> & {
    buttonVariant?: ButtonProps["variant"];
  };

function CalendarRoot({ className, rootRef, ...rootProps }: RootProps) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...rootProps}
    />
  );
}

function CalendarChevron({ className, orientation, ...chevronProps }: ChevronProps) {
  const iconClassName = cn(
    "size-[calc(var(--cell-size)*0.36)]",
    className,
  );

  if (orientation === "left") {
    return (
      <ChevronLeftIcon className={iconClassName} {...chevronProps} />
    );
  }

  if (orientation === "right") {
    return (
      <ChevronRightIcon className={iconClassName} {...chevronProps} />
    );
  }

  return (
    <ChevronDownIcon className={iconClassName} {...chevronProps} />
  );
}

function CalendarWeekNumber({ children, ...weekProps }: WeekNumberProps) {
  return (
    <td {...weekProps}>
      <div className="flex size-[--cell-size] shrink-0 items-center justify-center text-center">
        {children}
      </div>
    </td>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  shape,
  size,
  variant,
  animated,
  formatters,
  components,
  numberOfMonths,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const resolvedShape =
    shape ?? ((numberOfMonths ?? 1) > 1 ? "auto" : "square");

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      numberOfMonths={numberOfMonths}
      className={cn(
        calendarVariants({ shape: resolvedShape, size, variant, animated, className }),
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("en-US", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(
          resolvedShape === "square"
            ? "w-[var(--calendar-size)]"
            : "w-fit",
          defaultClassNames.root,
        ),
        months: cn(
          "relative flex w-fit flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn(
          "flex w-[var(--calendar-track)] flex-col gap-2",
          defaultClassNames.month,
        ),
        nav: cn(
          "absolute inset-x-0 top-0 flex h-[--cell-size] w-full items-center justify-between",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] shrink-0 select-none rounded-xl p-0",
          "hover:translate-y-0 active:scale-100",
          "aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] shrink-0 select-none rounded-xl p-0",
          "hover:translate-y-0 active:scale-100",
          "aria-disabled:pointer-events-none aria-disabled:opacity-40",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "relative flex h-[--cell-size] w-full items-center justify-center",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 px-[calc(var(--cell-size)+0.125rem)]",
          "text-[length:var(--calendar-caption)] font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative h-[calc(var(--cell-size)*0.82)] min-w-0 flex-1 rounded-xl border border-[var(--glass-chrome-border)] px-2",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_42%,transparent)]",
          "shadow-[var(--glass-chrome-inset)]",
          "has-focus:border-[color-mix(in_oklch,var(--primary)_50%,transparent)]",
          "has-focus:ring-2 has-focus:ring-primary/20",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium glass-chrome-text text-[length:var(--calendar-caption)]",
          captionLayout === "label"
            ? ""
            : "flex h-[calc(var(--cell-size)*0.82)] items-center gap-1 rounded-md pl-2 pr-1 [&>svg]:size-[calc(var(--cell-size)*0.32)] [&>svg]:glass-chrome-text-muted",
          defaultClassNames.caption_label,
        ),
        month_grid: cn(
          "w-[var(--calendar-track)] border-collapse",
          defaultClassNames.month_grid,
        ),
        weekdays: cn(
          "grid w-full grid-cols-7 gap-[--cell-gap]",
          defaultClassNames.weekdays,
        ),
        weekday: cn(
          "flex w-full items-center justify-center p-0",
          "text-[length:var(--calendar-weekday)] font-medium uppercase tracking-wider glass-chrome-text-muted",
          defaultClassNames.weekday,
        ),
        weeks: cn("flex flex-col gap-[--cell-gap]", defaultClassNames.weeks),
        week: cn("grid w-full grid-cols-7 gap-[--cell-gap]", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "select-none text-[0.8rem] glass-chrome-text-muted",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative flex aspect-square w-full items-center justify-center p-0 text-center",
          "[&:first-child[data-selected=true]_button]:rounded-l-xl",
          "[&:last-child[data-selected=true]_button]:rounded-r-xl",
          defaultClassNames.day,
        ),
        range_start: cn(
          "rounded-l-xl bg-[color-mix(in_oklch,var(--primary)_14%,transparent)]",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          "rounded-none bg-[color-mix(in_oklch,var(--primary)_14%,transparent)]",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          "rounded-r-xl bg-[color-mix(in_oklch,var(--primary)_14%,transparent)]",
          defaultClassNames.range_end,
        ),
        today: cn(
          "[&_button]:font-semibold",
          "[&_button]:ring-1 [&_button]:ring-[color-mix(in_oklch,var(--primary)_38%,transparent)]",
          "data-[selected=true]:[&_button]:ring-0",
          defaultClassNames.today,
        ),
        outside: cn(
          "opacity-55 glass-chrome-text-muted",
          "aria-selected:opacity-100",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "glass-chrome-text-muted opacity-35",
          "[&_button]:cursor-not-allowed [&_button]:pointer-events-none",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  );
}

export type CalendarDayButtonProps = DayButtonProps;

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: CalendarDayButtonProps) {
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      data-day={day.date.toISOString().slice(0, 10)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "aspect-square h-full w-full rounded-xl p-0 text-[length:var(--calendar-text)] font-normal leading-none tabular-nums",
        "hover:translate-y-0 active:scale-100 hover:shadow-none active:shadow-none",
        "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
        "data-[selected-single=true]:bg-[color-mix(in_oklch,var(--primary)_78%,transparent)]",
        "data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:shadow-[var(--glass-chrome-inset)]",
        "data-[selected-single=true]:hover:bg-[color-mix(in_oklch,var(--primary)_82%,transparent)]",
        "data-[range-start=true]:bg-[color-mix(in_oklch,var(--primary)_78%,transparent)]",
        "data-[range-start=true]:text-primary-foreground",
        "data-[range-start=true]:hover:bg-[color-mix(in_oklch,var(--primary)_82%,transparent)]",
        "data-[range-end=true]:bg-[color-mix(in_oklch,var(--primary)_78%,transparent)]",
        "data-[range-end=true]:text-primary-foreground",
        "data-[range-end=true]:hover:bg-[color-mix(in_oklch,var(--primary)_82%,transparent)]",
        "data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground",
        "data-[range-middle=true]:hover:bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
        "data-[range-end=true]:rounded-xl data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-xl",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-primary/30",
        focusRing,
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton, calendarVariants, type DateRange };