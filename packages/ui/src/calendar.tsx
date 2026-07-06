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
    String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
    String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
  ],
  {
    variants: {
      size: {
        sm: "p-3 [--cell-size:2.25rem] [--cell-gap:0.25rem]",
        default: "p-4 [--cell-size:2.5rem] [--cell-gap:0.375rem]",
        lg: "p-5 [--cell-size:2.75rem] [--cell-gap:0.5rem]",
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
  if (orientation === "left") {
    return (
      <ChevronLeftIcon className={cn("size-4", className)} {...chevronProps} />
    );
  }

  if (orientation === "right") {
    return (
      <ChevronRightIcon className={cn("size-4", className)} {...chevronProps} />
    );
  }

  return (
    <ChevronDownIcon className={cn("size-4", className)} {...chevronProps} />
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
  size,
  variant,
  animated,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(calendarVariants({ size, variant, animated, className }))}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("en-US", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-5", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-2 px-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] shrink-0 select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[--cell-size] shrink-0 select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "mb-1 flex h-[--cell-size] w-full items-center justify-center px-[calc(var(--cell-size)+0.5rem)]",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-2 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative min-w-[5.5rem] rounded-xl border border-[var(--glass-chrome-border)] px-2",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_42%,transparent)]",
          "shadow-[var(--glass-chrome-inset)]",
          "has-focus:border-[color-mix(in_oklch,var(--primary)_50%,transparent)]",
          "has-focus:ring-2 has-focus:ring-primary/20",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium glass-chrome-text",
          captionLayout === "label"
            ? "text-sm"
            : "flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5 [&>svg]:glass-chrome-text-muted",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex w-full", defaultClassNames.weekdays),
        weekday: cn(
          "flex size-[--cell-size] flex-1 items-center justify-center p-0 text-[0.75rem] font-medium uppercase tracking-wide glass-chrome-text-muted",
          defaultClassNames.weekday,
        ),
        weeks: cn("flex flex-col gap-[--cell-gap]", defaultClassNames.weeks),
        week: cn("flex w-full gap-[--cell-gap]", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "select-none text-[0.8rem] glass-chrome-text-muted",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative flex size-[--cell-size] flex-1 p-0 text-center",
          "[&:first-child[data-selected=true]_button]:rounded-l-xl",
          "[&:last-child[data-selected=true]_button]:rounded-r-xl",
          defaultClassNames.day,
        ),
        range_start: cn(
          "rounded-l-xl bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "rounded-r-xl bg-[color-mix(in_oklch,var(--primary)_18%,transparent)]",
          defaultClassNames.range_end,
        ),
        today: cn(
          "rounded-xl bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_65%,transparent)]",
          "glass-chrome-text data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "glass-chrome-text-muted aria-selected:glass-chrome-text-muted",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "glass-chrome-text-muted opacity-50",
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
        "size-[--cell-size] shrink-0 p-0 text-sm font-normal leading-none",
        "data-[selected-single=true]:bg-[color-mix(in_oklch,var(--primary)_78%,transparent)]",
        "data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:shadow-[var(--glass-chrome-inset)]",
        "data-[range-start=true]:bg-[color-mix(in_oklch,var(--primary)_78%,transparent)]",
        "data-[range-start=true]:text-primary-foreground",
        "data-[range-end=true]:bg-[color-mix(in_oklch,var(--primary)_78%,transparent)]",
        "data-[range-end=true]:text-primary-foreground",
        "data-[range-middle=true]:bg-[color-mix(in_oklch,var(--primary)_22%,transparent)]",
        "data-[range-middle=true]:text-foreground",
        "data-[range-end=true]:rounded-xl data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-xl",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-primary/30",
        "[&>span]:text-xs [&>span]:opacity-70",
        focusRing,
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton, calendarVariants, type DateRange };