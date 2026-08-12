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
  COUNTRIES,
  formatNationalNumber,
  getCountry,
  parseE164,
  searchCountries,
  toE164,
  type CountryRecord,
} from "./country-data";
import { Box, Flex, Stack } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";

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
  sm: { field: "ps-2", trigger: "h-9 px-2 text-xs gap-1", flag: "text-sm" },
  default: { field: "ps-2", trigger: "h-10 px-2.5 text-sm gap-1.5", flag: "text-base" },
  lg: { field: "ps-2", trigger: "h-11 px-3 text-base gap-1.5", flag: "text-lg" },
} as const;

export interface PhoneInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "type" | "value" | "defaultValue" | "onChange"
    >,
    FieldVariantProps {
  /**
   * Phone value as E.164 (`+14155550100`) or national digits.
   * When country is selected, commits always emit E.164.
   */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** ISO 3166-1 alpha-2 country. Controlled. */
  country?: string;
  defaultCountry?: string;
  onCountryChange?: (iso2: string, country: CountryRecord) => void;
  /** Show searchable country selector. Default true. */
  showCountrySelect?: boolean;
  /** Limit countries (default: all 240). */
  countries?: CountryRecord[];
  /** Format national number while typing. Default true. */
  format?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      country: countryProp,
      defaultCountry = "US",
      onCountryChange,
      showCountrySelect = true,
      countries = COUNTRIES,
      format = true,
      searchPlaceholder = "Search country or code…",
      emptyMessage = "No countries found.",
      disabled,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const listId = useId();

    const initial = parseE164(String(defaultValue ?? ""), defaultCountry);
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue
        ? toE164(initial.national, initial.country)
        : "",
    );
    const [uncontrolledCountry, setUncontrolledCountry] = useState(
      (getCountry(defaultCountry) ?? initial.country).iso2,
    );
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const rawValue = valueProp !== undefined ? valueProp : uncontrolledValue;
    const countryIso =
      countryProp !== undefined ? countryProp.toUpperCase() : uncontrolledCountry;

    // Derive country + national from value when possible; prefer explicit country
    const parsed = useMemo(
      () => parseE164(rawValue, countryIso),
      [rawValue, countryIso],
    );
    const country =
      getCountry(countryIso) ??
      parsed.country ??
      getCountry(defaultCountry) ??
      COUNTRIES[0]!;

    // When value already encodes dial code, use parsed national; else treat raw as national
    const national = useMemo(() => {
      const digits = rawValue.replace(/\D/g, "");
      if (!digits) return "";
      if (rawValue.trim().startsWith("+") || digits.startsWith(country.dialCode)) {
        return parsed.national;
      }
      return digits;
    }, [rawValue, country.dialCode, parsed.national]);

    const display = format
      ? formatNationalNumber(national, country)
      : national;

    const setCountry = (next: CountryRecord) => {
      if (countryProp === undefined) setUncontrolledCountry(next.iso2);
      onCountryChange?.(next.iso2, next);
      const e164 = toE164(national, next);
      if (valueProp === undefined) setUncontrolledValue(e164);
      onValueChange?.(e164);
      setOpen(false);
      setQuery("");
    };

    const commitNational = (raw: string) => {
      const trimmed = raw.trim();
      // Pasted/typed E.164 (or 00… international): re-detect country instead of
      // re-prefixing digits under the currently selected dial code.
      if (trimmed.startsWith("+") || trimmed.startsWith("00")) {
        const normalized = trimmed.startsWith("00")
          ? `+${trimmed.slice(2)}`
          : trimmed;
        const parsed = parseE164(normalized, country.iso2);
        if (countryProp === undefined) {
          setUncontrolledCountry(parsed.country.iso2);
        }
        if (parsed.country.iso2 !== country.iso2) {
          onCountryChange?.(parsed.country.iso2, parsed.country);
        }
        const e164 = toE164(parsed.national, parsed.country);
        if (valueProp === undefined) setUncontrolledValue(e164);
        onValueChange?.(e164);
        return;
      }

      const digits = raw.replace(/\D/g, "");
      const e164 = toE164(digits, country);
      if (valueProp === undefined) setUncontrolledValue(e164);
      onValueChange?.(e164);
    };

    const filtered = useMemo(
      () => searchCountries(query, countries),
      [query, countries],
    );

    const resolvedSize = size ?? "default";
    const pad = sizePad[resolvedSize];

    return (
      <Flex
        data-slot="phone-input"
        align="stretch"
        gap={2}
        className={cn("w-full", disabled && "opacity-50")}
      >
        {showCountrySelect ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                data-slot="phone-input-country"
                aria-label={`Country: ${country.name}`}
                className={cn(
                  fieldVariants({ variant, size, state }),
                  "inline-flex w-auto shrink-0 items-center font-normal tabular-nums",
                  pad.trigger,
                  focusRing,
                  disabled && "opacity-100",
                )}
              >
                <span className={pad.flag} aria-hidden>
                  {country.flag}
                </span>
                <span className="font-medium">+{country.dialCode}</span>
                <ChevronDown className="size-3.5 opacity-60" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-80 p-0"
              data-slot="phone-input-country-list"
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
                  <Box
                    as="ul"
                    id={listId}
                    role="listbox"
                    aria-label="Countries"
                    className="p-1"
                  >
                    {filtered.length === 0 ? (
                      <Box
                        as="li"
                        className="px-3 py-6 text-center text-sm glass-chrome-text-muted"
                      >
                        {emptyMessage}
                      </Box>
                    ) : (
                      filtered.map((c) => {
                        const selected = c.iso2 === country.iso2;
                        return (
                          <Box as="li" key={c.iso2} role="none">
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
                              onClick={() => setCountry(c)}
                            >
                              <span className="text-base" aria-hidden>
                                {c.flag}
                              </span>
                              <span className="min-w-0 flex-1 truncate font-medium">
                                {c.name}
                              </span>
                              <span className="shrink-0 tabular-nums glass-chrome-text-muted">
                                +{c.dialCode}
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
        ) : null}

        <input
          ref={ref}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete={props.autoComplete ?? "tel-national"}
          data-slot="phone-input-field"
          disabled={disabled}
          value={display}
          placeholder={
            props.placeholder ??
            formatNationalNumber(
              "9".repeat(Math.min(country.nationalLength, 10)),
              country,
            )
          }
          className={cn(
            fieldVariants({ variant, size, state }),
            "min-w-0 flex-1 tabular-nums",
            showCountrySelect && pad.field,
            disabled && "opacity-100",
            className,
          )}
          onChange={(e) => commitNational(e.target.value)}
          {...props}
        />
      </Flex>
    );
  },
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
export type { CountryRecord };
