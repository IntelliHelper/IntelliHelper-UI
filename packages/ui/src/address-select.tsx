"use client";

import { ChevronDownIcon } from "./icons";
import {
  forwardRef,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  ADDRESS_COUNTRIES,
  getAddressCountry,
  getCitiesForRegion,
  getRegion,
  getRegionsForCountry,
  searchAddressCountries,
  searchCities,
  searchRegions,
  type AddressCountry,
  type AddressRegion,
} from "./address-data";
import { Box, Stack } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";

type SelectBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue" | "children"
> &
  FieldVariantProps & {
    disabled?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabledMessage?: string;
  };

/* ── Shared searchable popover shell ─────────────────────────────── */

function AddressSelectShell({
  open,
  onOpenChange,
  disabled,
  triggerLabel,
  triggerAriaLabel,
  placeholder,
  searchPlaceholder,
  query,
  onQueryChange,
  emptyMessage,
  listLabel,
  children,
  variant,
  size,
  state,
  className,
  id,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  triggerLabel: ReactNode;
  triggerAriaLabel: string;
  placeholder: string;
  searchPlaceholder: string;
  query: string;
  onQueryChange: (q: string) => void;
  emptyMessage: string;
  listLabel: string;
  children: ReactNode;
  variant?: FieldVariantProps["variant"];
  size?: FieldVariantProps["size"];
  state?: FieldVariantProps["state"];
  className?: string;
  id?: string;
}) {
  const hasValue = triggerLabel != null && triggerLabel !== "";

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label={triggerAriaLabel}
          data-slot="address-select-trigger"
          className={cn(
            fieldVariants({ variant, size, state }),
            "inline-flex w-full items-center gap-2 text-left font-normal",
            focusRing,
            disabled && "opacity-50",
            className,
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              !hasValue && "glass-chrome-text-muted",
            )}
          >
            {hasValue ? triggerLabel : placeholder}
          </span>
          <ChevronDownIcon className="size-3.5 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-0"
        data-slot="address-select-content"
      >
        <Stack gap={0}>
          <Box className="border-b border-[var(--glass-chrome-border)] p-2">
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              className={cn(
                fieldVariants({ variant: "outline", size: "sm" }),
                "w-full",
              )}
              autoFocus
              disabled={disabled}
            />
          </Box>
          <ScrollArea className="h-64 w-full">
            <Box
              as="ul"
              role="listbox"
              aria-label={listLabel}
              className="p-1"
            >
              {children ?? (
                <Box
                  as="li"
                  className="px-3 py-6 text-center text-sm glass-chrome-text-muted"
                >
                  {emptyMessage}
                </Box>
              )}
            </Box>
          </ScrollArea>
        </Stack>
      </PopoverContent>
    </Popover>
  );
}

function OptionButton({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <Box as="li" role="none">
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
        onClick={onSelect}
      >
        {children}
      </button>
    </Box>
  );
}

/* ── Country ─────────────────────────────────────────────────────── */

export interface AddressCountrySelectProps extends SelectBaseProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (iso2: string, country: AddressCountry) => void;
  countries?: AddressCountry[];
}

const AddressCountrySelect = forwardRef<HTMLDivElement, AddressCountrySelectProps>(
  (
    {
      className,
      variant,
      size,
      state,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      countries = ADDRESS_COUNTRIES,
      disabled,
      placeholder = "Select country",
      searchPlaceholder = "Search country…",
      emptyMessage = "No countries found.",
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const value = (valueProp !== undefined ? valueProp : uncontrolled).toUpperCase();
    const selected = getAddressCountry(value) ?? countries.find((c) => c.iso2 === value);

    const filtered = useMemo(
      () => searchAddressCountries(query, countries),
      [query, countries],
    );

    const commit = (c: AddressCountry) => {
      if (valueProp === undefined) setUncontrolled(c.iso2);
      onValueChange?.(c.iso2, c);
      setOpen(false);
      setQuery("");
    };

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="address-country-select"
        className={cn("w-full", className)}
        {...props}
      >
        <AddressSelectShell
          id={id}
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setQuery("");
          }}
          disabled={disabled}
          triggerLabel={
            selected ? (
              <span className="inline-flex items-center gap-2">
                <span aria-hidden>{selected.flag}</span>
                <span>{selected.name}</span>
              </span>
            ) : null
          }
          triggerAriaLabel={
            selected ? `Country: ${selected.name}` : "Select country"
          }
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          query={query}
          onQueryChange={setQuery}
          emptyMessage={emptyMessage}
          listLabel="Countries"
          variant={variant}
          size={size}
          state={state}
        >
          {filtered.length === 0
            ? null
            : filtered.map((c) => (
                <OptionButton
                  key={c.iso2}
                  selected={c.iso2 === value}
                  onSelect={() => commit(c)}
                >
                  <span aria-hidden>{c.flag}</span>
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {c.name}
                  </span>
                  <span className="shrink-0 text-xs glass-chrome-text-muted">
                    {c.iso2}
                  </span>
                </OptionButton>
              ))}
        </AddressSelectShell>
      </Box>
    );
  },
);
AddressCountrySelect.displayName = "AddressCountrySelect";

/* ── Region / State ──────────────────────────────────────────────── */

export interface AddressRegionSelectProps extends SelectBaseProps {
  /** Parent country ISO2 — required for options. */
  country?: string;
  value?: string;
  defaultValue?: string;
  /** Emits region code (preferred) when selected. */
  onValueChange?: (regionCode: string, region: AddressRegion) => void;
}

const AddressRegionSelect = forwardRef<HTMLDivElement, AddressRegionSelectProps>(
  (
    {
      className,
      variant,
      size,
      state,
      country = "",
      value: valueProp,
      defaultValue = "",
      onValueChange,
      disabled,
      placeholder = "Select state / province",
      searchPlaceholder = "Search state…",
      emptyMessage = "No states found.",
      disabledMessage = "Select a country first",
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const value = valueProp !== undefined ? valueProp : uncontrolled;
    const regions = useMemo(
      () => getRegionsForCountry(country),
      [country],
    );
    const selected = country
      ? getRegion(country, value) ??
        regions.find((r) => r.code === value || r.name === value)
      : undefined;

    const filtered = useMemo(
      () => (country ? searchRegions(query, country) : []),
      [query, country],
    );

    const isDisabled = disabled || !country || regions.length === 0;
    const resolvedPlaceholder = !country
      ? disabledMessage
      : regions.length === 0
        ? "No states for this country"
        : placeholder;

    const commit = (r: AddressRegion) => {
      if (valueProp === undefined) setUncontrolled(r.code);
      onValueChange?.(r.code, r);
      setOpen(false);
      setQuery("");
    };

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="address-region-select"
        className={cn("w-full", className)}
        {...props}
      >
        <AddressSelectShell
          id={id}
          open={open && !isDisabled}
          onOpenChange={(next) => {
            if (isDisabled) return;
            setOpen(next);
            if (!next) setQuery("");
          }}
          disabled={isDisabled}
          triggerLabel={selected?.name ?? null}
          triggerAriaLabel={
            selected ? `State: ${selected.name}` : "Select state or province"
          }
          placeholder={resolvedPlaceholder}
          searchPlaceholder={searchPlaceholder}
          query={query}
          onQueryChange={setQuery}
          emptyMessage={emptyMessage}
          listLabel="States and provinces"
          variant={variant}
          size={size}
          state={state}
        >
          {filtered.length === 0
            ? null
            : filtered.map((r) => (
                <OptionButton
                  key={`${r.countryCode}-${r.code}`}
                  selected={r.code === value || r.name === value}
                  onSelect={() => commit(r)}
                >
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {r.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums glass-chrome-text-muted">
                    {r.code}
                  </span>
                </OptionButton>
              ))}
        </AddressSelectShell>
      </Box>
    );
  },
);
AddressRegionSelect.displayName = "AddressRegionSelect";

/* ── City ────────────────────────────────────────────────────────── */

export interface AddressCitySelectProps extends SelectBaseProps {
  country?: string;
  region?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (city: string) => void;
}

const AddressCitySelect = forwardRef<HTMLDivElement, AddressCitySelectProps>(
  (
    {
      className,
      variant,
      size,
      state,
      country = "",
      region = "",
      value: valueProp,
      defaultValue = "",
      onValueChange,
      disabled,
      placeholder = "Select city",
      searchPlaceholder = "Search city…",
      emptyMessage = "No cities found.",
      disabledMessage = "Select a state first",
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const value = valueProp !== undefined ? valueProp : uncontrolled;

    const cities = useMemo(
      () => getCitiesForRegion(country, region),
      [country, region],
    );
    const filtered = useMemo(
      () =>
        country && region ? searchCities(query, country, region) : [],
      [query, country, region],
    );

    const isDisabled = disabled || !country || !region || cities.length === 0;
    const resolvedPlaceholder = !country
      ? "Select a country first"
      : !region
        ? disabledMessage
        : cities.length === 0
          ? "No cities for this state"
          : placeholder;

    const commit = (city: string) => {
      if (valueProp === undefined) setUncontrolled(city);
      onValueChange?.(city);
      setOpen(false);
      setQuery("");
    };

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="address-city-select"
        className={cn("w-full", className)}
        {...props}
      >
        <AddressSelectShell
          id={id}
          open={open && !isDisabled}
          onOpenChange={(next) => {
            if (isDisabled) return;
            setOpen(next);
            if (!next) setQuery("");
          }}
          disabled={isDisabled}
          triggerLabel={value || null}
          triggerAriaLabel={value ? `City: ${value}` : "Select city"}
          placeholder={resolvedPlaceholder}
          searchPlaceholder={searchPlaceholder}
          query={query}
          onQueryChange={setQuery}
          emptyMessage={emptyMessage}
          listLabel="Cities"
          variant={variant}
          size={size}
          state={state}
        >
          {filtered.length === 0
            ? null
            : filtered.map((city) => (
                <OptionButton
                  key={city}
                  selected={city === value}
                  onSelect={() => commit(city)}
                >
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {city}
                  </span>
                </OptionButton>
              ))}
        </AddressSelectShell>
      </Box>
    );
  },
);
AddressCitySelect.displayName = "AddressCitySelect";

export {
  AddressCountrySelect,
  AddressRegionSelect,
  AddressCitySelect,
};
