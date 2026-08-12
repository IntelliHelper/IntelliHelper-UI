"use client";

import { SearchIcon, XIcon } from "./icons";
import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import { Box, Flex } from "./layout";
import { fieldVariants, type FieldVariantProps } from "./field-variants";

const iconPad = {
  sm: { start: "ps-9", end: "pe-9", icon: "start-2.5 size-3.5", btn: "end-1 size-7 rounded-lg [&_svg]:size-3.5" },
  default: { start: "ps-10", end: "pe-10", icon: "start-3 size-4", btn: "end-1 size-8 rounded-lg [&_svg]:size-4" },
  lg: { start: "ps-11", end: "pe-12", icon: "start-3.5 size-[1.125rem]", btn: "end-1.5 size-9 rounded-xl [&_svg]:size-[1.125rem]" },
} as const;

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "onChange">,
    FieldVariantProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Show clear control when there is a value. Default true. */
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  /** Leading icon slot — defaults to magnifier. Pass null to hide. */
  leadingIcon?: ReactNode | null;
  /** Trailing slot before clear (e.g. kbd hint). */
  trailing?: ReactNode;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      clearable = true,
      clearLabel = "Clear search",
      onClear,
      leadingIcon,
      trailing,
      disabled,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [uncontrolled, setUncontrolled] = useState(String(defaultValue ?? ""));
    const value = valueProp !== undefined ? String(valueProp) : uncontrolled;
    const resolvedSize = size ?? "default";
    const pad = iconPad[resolvedSize];
    const showClear = clearable && value.length > 0 && !disabled;

    const commit = (next: string) => {
      if (valueProp === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const handleClear = () => {
      commit("");
      onClear?.();
    };

    return (
      <Box
        data-slot="search-input"
        className={cn("relative w-full", disabled && "opacity-50")}
      >
        {leadingIcon !== null ? (
          <Box
            as="span"
            data-slot="search-input-icon"
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2",
              "text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]",
              pad.icon,
            )}
          >
            {leadingIcon === undefined ? <SearchIcon className="size-full" /> : leadingIcon}
          </Box>
        ) : null}
        <input
          ref={ref}
          id={id}
          type="search"
          role="searchbox"
          data-slot="search-input-field"
          disabled={disabled}
          value={value}
          onChange={(e) => commit(e.target.value)}
          className={cn(
            fieldVariants({ variant, size, state }),
            leadingIcon !== null && pad.start,
            (showClear || trailing) && pad.end,
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
            disabled && "opacity-100",
            className,
          )}
          {...props}
        />
        {(trailing || showClear) && (
          <Flex
            data-slot="search-input-trailing"
            align="center"
            gap={0.5}
            className="absolute end-1 top-1/2 -translate-y-1/2"
          >
            {trailing}
            {showClear ? (
              <button
                type="button"
                data-slot="search-input-clear"
                aria-label={clearLabel}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center justify-center",
                  "text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]",
                  "transition-[background,color,transform] duration-[var(--duration-normal)]",
                  "[transition-timing-function:var(--ease-spring)]",
                  "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
                  "hover:text-[var(--glass-chrome-fg,var(--foreground))]",
                  "active:scale-95",
                  "disabled:pointer-events-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/40",
                  pad.btn,
                )}
                onClick={handleClear}
              >
                <XIcon />
              </button>
            ) : null}
          </Flex>
        )}
      </Box>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
