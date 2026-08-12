"use client";

import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import {
  cascadeAddressValue,
  emptyAddressValue,
  type AddressValue,
} from "./address-data";
import {
  AddressCitySelect,
  AddressCountrySelect,
  AddressRegionSelect,
} from "./address-select";
import { type FieldVariantProps } from "./field-variants";
import { Box, Grid, Stack } from "./layout";
import { Label } from "./label";

export interface AddressFieldsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps {
  value?: AddressValue;
  defaultValue?: AddressValue;
  onValueChange?: (value: AddressValue) => void;
  disabled?: boolean;
  /** Show field labels. Default true. */
  showLabels?: boolean;
  countryLabel?: ReactNode;
  regionLabel?: ReactNode;
  cityLabel?: ReactNode;
  /** Optional layout: stack (default) or grid (2-col on sm+). */
  layout?: "stack" | "grid";
}

const AddressFields = forwardRef<HTMLDivElement, AddressFieldsProps>(
  (
    {
      className,
      variant,
      size,
      state,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled,
      showLabels = true,
      countryLabel = "Country",
      regionLabel = "State / Province",
      cityLabel = "City",
      layout = "stack",
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [uncontrolled, setUncontrolled] = useState<AddressValue>(
      defaultValue ?? emptyAddressValue(),
    );
    const value = valueProp !== undefined ? valueProp : uncontrolled;

    const commit = (patch: Partial<AddressValue>) => {
      const next = cascadeAddressValue(value, patch);
      if (valueProp === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const countryField = (
      <Stack gap={1.5} className="min-w-0">
        {showLabels ? (
          <Label htmlFor={`${baseId}-country`} size={size === "sm" ? "sm" : "default"}>
            {countryLabel}
          </Label>
        ) : null}
        <AddressCountrySelect
          id={`${baseId}-country`}
          value={value.country}
          onValueChange={(iso2) => commit({ country: iso2 })}
          disabled={disabled}
          variant={variant}
          size={size}
          state={state}
        />
      </Stack>
    );

    const regionField = (
      <Stack gap={1.5} className="min-w-0">
        {showLabels ? (
          <Label htmlFor={`${baseId}-region`} size={size === "sm" ? "sm" : "default"}>
            {regionLabel}
          </Label>
        ) : null}
        <AddressRegionSelect
          id={`${baseId}-region`}
          country={value.country}
          value={value.region}
          onValueChange={(code) => commit({ region: code })}
          disabled={disabled}
          variant={variant}
          size={size}
          state={state}
        />
      </Stack>
    );

    const cityField = (
      <Stack gap={1.5} className="min-w-0">
        {showLabels ? (
          <Label htmlFor={`${baseId}-city`} size={size === "sm" ? "sm" : "default"}>
            {cityLabel}
          </Label>
        ) : null}
        <AddressCitySelect
          id={`${baseId}-city`}
          country={value.country}
          region={value.region}
          value={value.city}
          onValueChange={(city) => commit({ city })}
          disabled={disabled}
          variant={variant}
          size={size}
          state={state}
        />
      </Stack>
    );

    return (
      <Box
        ref={ref as React.Ref<HTMLElement>}
        data-slot="address-fields"
        className={cn("w-full", className)}
        {...props}
      >
        {layout === "grid" ? (
          <Grid cols={1} smCols={2} gap={3} className="w-full">
            <Box className="sm:col-span-2">{countryField}</Box>
            {regionField}
            {cityField}
          </Grid>
        ) : (
          <Stack gap={3} className="w-full">
            {countryField}
            {regionField}
            {cityField}
          </Stack>
        )}
      </Box>
    );
  },
);
AddressFields.displayName = "AddressFields";

export { AddressFields };
export type { AddressValue };
