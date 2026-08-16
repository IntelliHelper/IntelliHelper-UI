"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { type FieldVariantProps } from "./field-variants";
import {
  applyDocumentFont,
  DEFAULT_FONT_ID,
  DEFAULT_FONTS,
  findFontOption,
  persistFontId,
  readDocumentFontId,
  readPersistedFontId,
  type FontCategory,
  type FontOption,
} from "./font-family";

export type { FontCategory, FontOption };
export {
  applyDocumentFont,
  DEFAULT_FONT_ID,
  DEFAULT_FONTS,
  findFontOption,
  readDocumentFontId,
};

const CATEGORY_LABELS: Record<FontCategory, string> = {
  sans: "Sans",
  serif: "Serif",
  mono: "Mono",
};

const CATEGORY_ORDER: FontCategory[] = ["sans", "serif", "mono"];

export interface FontPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">,
    FieldVariantProps {
  /** Controlled font id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string, font: FontOption) => void;
  fonts?: readonly FontOption[];
  /** When true (default), write `--font-sans` on documentElement. */
  applyToDocument?: boolean;
  /** Persist the last choice. Set `false` to disable. Default `intelli-font`. */
  storageKey?: string | false;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

const FontPicker = forwardRef<HTMLDivElement, FontPickerProps>(
  (
    {
      className,
      variant,
      size,
      state,
      value: valueProp,
      defaultValue,
      onValueChange,
      fonts = DEFAULT_FONTS,
      applyToDocument = true,
      storageKey = "intelli-font",
      placeholder = "Choose a font",
      disabled,
      name,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState(
      defaultValue ?? DEFAULT_FONT_ID,
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      if (valueProp !== undefined) {
        return;
      }
      const stored =
        storageKey === false ? null : readPersistedFontId(storageKey);
      const next =
        (stored && findFontOption(stored, fonts)?.id) ||
        readDocumentFontId(fonts);
      setUncontrolled(next);
      const font = findFontOption(next, fonts);
      if (font && applyToDocument) {
        applyDocumentFont(font);
      }
    }, [applyToDocument, fonts, storageKey, valueProp]);

    const value = valueProp !== undefined ? valueProp : uncontrolled;
    const selected = findFontOption(value, fonts);

    const grouped = useMemo(() => {
      return CATEGORY_ORDER.map((category) => ({
        category,
        label: CATEGORY_LABELS[category],
        items: fonts.filter((font) => font.category === category),
      })).filter((group) => group.items.length > 0);
    }, [fonts]);

    const setValue = useCallback(
      (id: string) => {
        const font = findFontOption(id, fonts);
        if (!font) {
          return;
        }
        if (valueProp === undefined) {
          setUncontrolled(id);
        }
        if (applyToDocument) {
          applyDocumentFont(font);
        }
        if (storageKey !== false) {
          persistFontId(storageKey, id);
        }
        onValueChange?.(id, font);
      },
      [applyToDocument, fonts, onValueChange, storageKey, valueProp],
    );

    return (
      <div
        ref={ref}
        data-slot="font-picker"
        data-font={value}
        className={cn("w-full min-w-[12rem]", className)}
        {...props}
      >
        <Select
          value={mounted ? value : defaultValue ?? DEFAULT_FONT_ID}
          onValueChange={setValue}
          disabled={disabled}
          name={name}
        >
          <SelectTrigger
            variant={variant}
            size={size}
            state={state}
            aria-label={placeholder}
            style={selected ? { fontFamily: selected.stack } : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {grouped.map((group) => (
              <SelectGroup key={group.category}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.items.map((font) => (
                  <SelectItem
                    key={font.id}
                    value={font.id}
                    size={size === "lg" ? "lg" : size === "sm" ? "sm" : "default"}
                    style={{ fontFamily: font.stack }}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);
FontPicker.displayName = "FontPicker";

export { FontPicker };
