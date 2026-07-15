"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  filterItems,
  resolveItemLabel,
  type FilterableItem,
} from "./filter-items";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { fieldVariants, type FieldVariantProps } from "./field-variants";

export type ComboboxOption = FilterableItem & {
  description?: string;
};

const comboboxTriggerVariants = cva(
  [
    "inline-flex w-full items-center justify-between gap-2 text-left font-normal",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      size: {
        sm: "h-9 text-xs",
        default: "h-10 text-sm",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface ComboboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps,
    VariantProps<typeof comboboxTriggerVariants> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
}

const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      className,
      options,
      value: valueProp,
      defaultValue = "",
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
      name,
      ...props
    },
    ref,
  ) => {
    const listId = useId();
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
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
      (next: string) => {
        if (valueProp === undefined) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
        setOpen(false);
      },
      [onValueChange, setOpen, valueProp],
    );

    const filtered = useMemo(
      () => filterItems(options, query),
      [options, query],
    );

    const label = resolveItemLabel(options, value) || placeholder;
    const hasValue = Boolean(value);

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
          setValue(item.value);
        }
      } else if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    return (
      <div
        ref={ref}
        data-slot="combobox"
        className={cn("relative w-full", className)}
        onKeyDown={onKeyDown}
        {...props}
      >
        {name ? <input type="hidden" name={name} value={value} /> : null}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-slot="combobox-trigger"
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={listId}
              className={cn(
                fieldVariants({ variant, size, state }),
                comboboxTriggerVariants({ size }),
                !hasValue && "text-muted-foreground",
              )}
            >
              <span className="truncate">{label}</span>
              <ChevronIcon className="opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            data-slot="combobox-content"
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            size="default"
            variant="chrome"
          >
            <div className="border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] p-2">
              <input
                data-slot="combobox-search"
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
              data-slot="combobox-list"
              className="max-h-56 overflow-y-auto p-1"
            >
              {filtered.length === 0 ? (
                <li
                  data-slot="combobox-empty"
                  className="px-2.5 py-6 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </li>
              ) : (
                filtered.map((item, index) => {
                  const selected = item.value === value;
                  const active = index === highlight;
                  return (
                    <li key={item.value} role="option" aria-selected={selected}>
                      <button
                        type="button"
                        data-slot="combobox-item"
                        data-selected={selected || undefined}
                        data-highlighted={active || undefined}
                        disabled={item.disabled}
                        className={cn(
                          "flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none",
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
                            setValue(item.value);
                          }
                        }}
                      >
                        <span>{item.label}</span>
                        {item.description ? (
                          <span className="text-xs font-normal text-muted-foreground">
                            {item.description}
                          </span>
                        ) : null}
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
Combobox.displayName = "Combobox";

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

export type ComboboxTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export { Combobox, comboboxTriggerVariants, filterItems, resolveItemLabel };
