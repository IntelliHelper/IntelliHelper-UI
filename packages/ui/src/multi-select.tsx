"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { filterItems } from "./filter-items";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import {
  clearMultiSelectValues,
  removeMultiSelectValue,
  resolveMultiSelectLabels,
  toggleMultiSelectValue,
  type MultiSelectOption,
} from "./multi-select-utils";

export type { MultiSelectOption };

const multiSelectTriggerVariants = cva(
  [
    "inline-flex min-h-10 w-full flex-wrap items-center gap-1.5 text-left font-normal",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      size: {
        sm: "min-h-9 text-xs",
        default: "min-h-10 text-sm",
        lg: "min-h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface MultiSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps,
    VariantProps<typeof multiSelectTriggerVariants> {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  max?: number;
  name?: string;
}

const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      options,
      value: valueProp,
      defaultValue = [],
      onValueChange,
      placeholder = "Select…",
      searchPlaceholder = "Search…",
      emptyMessage = "No results found.",
      disabled = false,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      variant,
      size,
      state,
      max,
      name,
      ...props
    },
    ref,
  ) => {
    const listId = useId();
    const [uncontrolledValue, setUncontrolledValue] =
      useState<string[]>(defaultValue);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [query, setQuery] = useState("");
    const [highlight, setHighlight] = useState(0);

    const value = valueProp !== undefined ? valueProp : uncontrolledValue;
    const open = openProp !== undefined ? openProp : uncontrolledOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (openProp === undefined) {
          setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
        if (!next) {
          setQuery("");
          setHighlight(0);
        }
      },
      [onOpenChange, openProp],
    );

    const setValue = useCallback(
      (next: string[]) => {
        if (valueProp === undefined) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [onValueChange, valueProp],
    );

    const filtered = useMemo(
      () => filterItems(options, query),
      [options, query],
    );

    const labels = resolveMultiSelectLabels(options, value);
    const hasValue = value.length > 0;

    const toggle = (optionValue: string) => {
      const option = options.find((item) => item.value === optionValue);
      if (option?.disabled) {
        return;
      }
      setValue(
        toggleMultiSelectValue(value, optionValue, {
          max,
          disabledValues: options
            .filter((item) => item.disabled)
            .map((item) => item.value),
        }),
      );
    };

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setHighlight((index) =>
          filtered.length === 0 ? 0 : (index + 1) % filtered.length,
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setHighlight((index) =>
          filtered.length === 0
            ? 0
            : (index - 1 + filtered.length) % filtered.length,
        );
      } else if (event.key === "Enter" && open) {
        event.preventDefault();
        const item = filtered[highlight];
        if (item && !item.disabled) {
          toggle(item.value);
        }
      } else if (event.key === "Backspace" && !query && hasValue && open) {
        event.preventDefault();
        setValue(removeMultiSelectValue(value, value[value.length - 1]!));
      } else if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    return (
      <div
        ref={ref}
        data-slot="multi-select"
        className={cn("relative w-full", className)}
        onKeyDown={onKeyDown}
        {...props}
      >
        {name
          ? value.map((item) => (
              <input key={item} type="hidden" name={name} value={item} />
            ))
          : null}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-slot="multi-select-trigger"
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={listId}
              aria-multiselectable="true"
              className={cn(
                fieldVariants({ variant, size, state }),
                multiSelectTriggerVariants({ size }),
                "py-1.5",
                !hasValue && "text-muted-foreground",
              )}
            >
              {hasValue ? (
                <span className="flex min-w-0 flex-1 flex-wrap gap-1">
                  {labels.map((label, index) => (
                    <span
                      key={value[index]}
                      data-slot="multi-select-chip"
                      className={cn(
                        "inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        "border border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)]",
                        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%,transparent)]",
                        "text-[var(--glass-chrome-fg)]",
                      )}
                    >
                      <span className="truncate">{label}</span>
                      <span
                        role="button"
                        tabIndex={-1}
                        aria-label={`Remove ${label}`}
                        className="rounded-full opacity-70 hover:opacity-100"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setValue(removeMultiSelectValue(value, value[index]!));
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            setValue(
                              removeMultiSelectValue(value, value[index]!),
                            );
                          }
                        }}
                      >
                        <CloseIcon />
                      </span>
                    </span>
                  ))}
                </span>
              ) : (
                <span className="flex-1 truncate">{placeholder}</span>
              )}
              <span className="ml-auto flex shrink-0 items-center gap-1 opacity-60">
                {hasValue ? (
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label="Clear selection"
                    className="rounded-md p-0.5 hover:opacity-100"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setValue(clearMultiSelectValues());
                    }}
                  >
                    <CloseIcon />
                  </span>
                ) : null}
                <ChevronIcon />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            data-slot="multi-select-content"
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            size="default"
            variant="chrome"
          >
            <div className="border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] p-2">
              <input
                data-slot="multi-select-search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlight(0);
                }}
                placeholder={searchPlaceholder}
                className={cn(
                  fieldVariants({ variant: "outline", size: "sm" }),
                  "h-9",
                )}
                autoFocus
              />
            </div>
            <ul
              id={listId}
              role="listbox"
              aria-multiselectable="true"
              data-slot="multi-select-list"
              className="max-h-56 overflow-y-auto p-1"
            >
              {filtered.length === 0 ? (
                <li
                  data-slot="multi-select-empty"
                  className="px-2.5 py-6 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </li>
              ) : (
                filtered.map((item, index) => {
                  const selected = value.includes(item.value);
                  const active = index === highlight;
                  return (
                    <li
                      key={item.value}
                      role="option"
                      aria-selected={selected}
                    >
                      <button
                        type="button"
                        data-slot="multi-select-item"
                        data-selected={selected || undefined}
                        data-highlighted={active || undefined}
                        disabled={item.disabled}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-sm outline-none",
                          "transition-colors duration-[var(--duration-fast)]",
                          "disabled:pointer-events-none disabled:opacity-50",
                          active &&
                            "bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)]",
                          selected && "font-semibold text-primary",
                          focusRing,
                        )}
                        onMouseEnter={() => setHighlight(index)}
                        onClick={() => {
                          if (!item.disabled) {
                            toggle(item.value);
                          }
                        }}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border text-[10px]",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-[var(--glass-chrome-border)]",
                          )}
                        >
                          {selected ? "✓" : null}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span>{item.label}</span>
                          {item.description ? (
                            <span className="text-xs font-normal text-muted-foreground">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
MultiSelect.displayName = "MultiSelect";

function ChevronIcon({ className }: { className?: string }) {
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
      className={cn("size-4", className)}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      className={cn("size-3", className)}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export {
  MultiSelect,
  multiSelectTriggerVariants,
  toggleMultiSelectValue,
  removeMultiSelectValue,
  clearMultiSelectValues,
  resolveMultiSelectLabels,
};
