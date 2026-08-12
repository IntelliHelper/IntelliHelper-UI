"use client";

import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  CURRENCIES,
  currencyDecimals,
  defaultLocaleForCurrency,
  getCurrency,
  searchCurrencies,
  type CurrencyRecord,
} from "./country-data";
import { Box, Flex, Stack } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import {
  clampNumber,
  currencySymbol,
  formatCurrencyValue,
  parseNumericInput,
  roundToStep,
} from "./tier3-utils";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const sizePad = {
  sm: { trigger: "h-9 px-2 text-xs gap-1 min-w-[4.5rem]", amount: "ps-2" },
  default: { trigger: "h-10 px-2.5 text-sm gap-1.5 min-w-[5rem]", amount: "ps-2" },
  lg: { trigger: "h-11 px-3 text-base gap-1.5 min-w-[5.5rem]", amount: "ps-2" },
} as const;

export interface CurrencyInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "value" | "defaultValue" | "onChange"
    >,
    FieldVariantProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  /** ISO 4217 currency code. Controlled. */
  currency?: string;
  defaultCurrency?: string;
  onCurrencyChange?: (code: string, currency: CurrencyRecord) => void;
  /** Override locale; defaults from currency’s primary country. */
  locale?: string;
  min?: number;
  max?: number;
  step?: number;
  fractionDigits?: number;
  /** Show searchable currency selector. Default true. */
  showCurrencySelect?: boolean;
  /** Limit currencies (default: all ISO currencies from country data). */
  currencies?: CurrencyRecord[];
  searchPlaceholder?: string;
  emptyMessage?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      currency: currencyProp,
      defaultCurrency = "USD",
      onCurrencyChange,
      locale: localeProp,
      min,
      max,
      step: stepProp,
      fractionDigits,
      showCurrencySelect = true,
      currencies = CURRENCIES,
      searchPlaceholder = "Search currency…",
      emptyMessage = "No currencies found.",
      disabled,
      id: idProp,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;

    const [uncontrolled, setUncontrolled] = useState<number | null>(
      defaultValue ?? null,
    );
    const [uncontrolledCurrency, setUncontrolledCurrency] = useState(
      defaultCurrency.toUpperCase(),
    );
    const [focused, setFocused] = useState(false);
    const [draft, setDraft] = useState("");
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const value = valueProp !== undefined ? valueProp : uncontrolled;
    const currencyCode = (
      currencyProp !== undefined ? currencyProp : uncontrolledCurrency
    ).toUpperCase();
    const currencyRec =
      getCurrency(currencyCode) ??
      currencies.find((c) => c.code === currencyCode) ??
      getCurrency("USD")!;

    const locale = localeProp ?? defaultLocaleForCurrency(currencyCode);
    const decimals =
      fractionDigits ?? currencyDecimals(currencyCode) ?? currencyRec.decimals;
    const step =
      stepProp ??
      (decimals <= 0 ? 1 : Number(`0.${"0".repeat(decimals - 1)}1`));
    const symbol = currencySymbol(currencyCode, locale);
    const resolvedSize = size ?? "default";
    const pad = sizePad[resolvedSize];

    const commit = (next: number | null) => {
      let resolved = next;
      if (resolved !== null && Number.isFinite(resolved)) {
        resolved = clampNumber(roundToStep(resolved, step, min ?? 0), min, max);
      } else {
        resolved = null;
      }
      if (valueProp === undefined) setUncontrolled(resolved);
      onValueChange?.(resolved);
    };

    const setCurrency = (next: CurrencyRecord) => {
      if (currencyProp === undefined) setUncontrolledCurrency(next.code);
      onCurrencyChange?.(next.code, next);
      setOpen(false);
      setQuery("");
    };

    const filtered = useMemo(
      () => searchCurrencies(query, currencies),
      [query, currencies],
    );

    const amountDisplay = focused
      ? draft
      : value === null || value === undefined
        ? ""
        : formatCurrencyValue(value, {
            currency: currencyCode,
            locale,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
            // Strip currency symbol/code for the amount field when selector shows code
            .replace(symbol, "")
            .replace(currencyCode, "")
            .replace(/\s/g, " ")
            .trim();

    return (
      <Flex
        data-slot="currency-input"
        align="stretch"
        gap={2}
        className={cn("w-full", disabled && "opacity-50")}
      >
        {showCurrencySelect ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                data-slot="currency-input-select"
                aria-label={`Currency: ${currencyRec.name}`}
                className={cn(
                  fieldVariants({ variant, size, state }),
                  "inline-flex w-auto shrink-0 items-center font-normal",
                  pad.trigger,
                  focusRing,
                  disabled && "opacity-100",
                )}
              >
                <span className="font-semibold tabular-nums">{currencyCode}</span>
                <span className="truncate glass-chrome-text-muted">{symbol}</span>
                <ChevronDown className="size-3.5 shrink-0 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-80 p-0"
              data-slot="currency-input-list"
            >
              <Stack gap={0}>
                <Box className="border-b border-[var(--glass-chrome-border)] p-2">
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className={cn(
                      fieldVariants({ variant: "outline", size: "sm" }),
                      "w-full",
                    )}
                    autoFocus
                  />
                </Box>
                <ScrollArea className="h-64 w-full">
                  <Box as="ul" role="listbox" aria-label="Currencies" className="p-1">
                    {filtered.length === 0 ? (
                      <Box
                        as="li"
                        className="px-3 py-6 text-center text-sm glass-chrome-text-muted"
                      >
                        {emptyMessage}
                      </Box>
                    ) : (
                      filtered.map((c) => {
                        const selected = c.code === currencyCode;
                        return (
                          <Box as="li" key={c.code} role="none">
                            <button
                              type="button"
                              role="option"
                              aria-selected={selected}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                                selected
                                  ? "bg-primary/15 text-primary"
                                  : "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
                                focusRing,
                              )}
                              onClick={() => setCurrency(c)}
                            >
                              <span className="w-12 shrink-0 font-semibold tabular-nums">
                                {c.code}
                              </span>
                              <span className="min-w-0 flex-1 truncate">
                                {c.name}
                              </span>
                              <span className="shrink-0 tabular-nums glass-chrome-text-muted">
                                {c.symbol}
                              </span>
                            </button>
                          </Box>
                        );
                      })
                    )}
                  </Box>
                </ScrollArea>
              </Stack>
            </PopoverContent>
          </Popover>
        ) : (
          <Box
            as="span"
            data-slot="currency-input-symbol"
            className={cn(
              fieldVariants({ variant, size, state }),
              "inline-flex w-auto shrink-0 items-center justify-center px-3 font-medium tabular-nums",
              disabled && "opacity-100",
            )}
            aria-hidden
          >
            {symbol}
          </Box>
        )}

        <input
          ref={ref}
          id={id}
          type="text"
          inputMode="decimal"
          data-slot="currency-input-field"
          disabled={disabled}
          value={amountDisplay}
          className={cn(
            fieldVariants({ variant, size, state }),
            "min-w-0 flex-1 tabular-nums",
            pad.amount,
            disabled && "opacity-100",
            className,
          )}
          onFocus={(e) => {
            setFocused(true);
            setDraft(
              value === null || value === undefined ? "" : String(value),
            );
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            commit(parseNumericInput(draft));
            onBlur?.(e);
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            const parsed = parseNumericInput(e.target.value);
            if (parsed !== null) {
              if (valueProp === undefined) setUncontrolled(parsed);
              onValueChange?.(parsed);
            } else if (e.target.value.trim() === "") {
              if (valueProp === undefined) setUncontrolled(null);
              onValueChange?.(null);
            }
          }}
          {...props}
        />
      </Flex>
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
export type { CurrencyRecord };
