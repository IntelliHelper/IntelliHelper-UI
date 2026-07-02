"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";

export type BackgroundPictureSource = "none" | "preset" | "custom";

export interface BackgroundPictureValue {
  source: BackgroundPictureSource;
  presetId?: string;
  url?: string;
  background?: string;
}

export interface BackgroundPicturePreset {
  id: string;
  label: string;
  background?: string;
  url?: string;
}

export const NONE_BACKGROUND_VALUE: BackgroundPictureValue = { source: "none" };

export const DEFAULT_BACKGROUND_PRESETS: BackgroundPicturePreset[] = [
  {
    id: "aurora",
    label: "Aurora",
    background:
      "linear-gradient(135deg, oklch(0.55 0.16 195), oklch(0.52 0.22 290), oklch(0.35 0.12 270))",
  },
  {
    id: "sunset",
    label: "Sunset",
    background:
      "linear-gradient(135deg, oklch(0.7 0.18 55), oklch(0.58 0.22 15), oklch(0.45 0.14 35))",
  },
  {
    id: "ocean",
    label: "Ocean",
    background:
      "linear-gradient(135deg, oklch(0.55 0.14 200), oklch(0.58 0.16 175), oklch(0.32 0.08 220))",
  },
  {
    id: "frost",
    label: "Frost",
    background:
      "linear-gradient(135deg, oklch(0.82 0.04 250), oklch(0.58 0.1 220), oklch(0.35 0.04 250))",
  },
  {
    id: "forest",
    label: "Forest",
    background:
      "linear-gradient(160deg, oklch(0.42 0.08 155), oklch(0.55 0.12 145), oklch(0.32 0.06 160))",
  },
  {
    id: "ember",
    label: "Ember",
    background:
      "radial-gradient(circle at 20% 20%, oklch(0.72 0.18 45), transparent 55%), radial-gradient(circle at 80% 70%, oklch(0.45 0.2 25), transparent 50%), oklch(0.22 0.04 30)",
  },
];

export function presetToValue(preset: BackgroundPicturePreset): BackgroundPictureValue {
  return {
    source: "preset",
    presetId: preset.id,
    url: preset.url,
    background: preset.background,
  };
}

export function getBackgroundPictureStyle(
  value: BackgroundPictureValue | null | undefined,
): CSSProperties {
  if (!value || value.source === "none") {
    return {};
  }

  if (value.url) {
    return {
      backgroundImage: `url("${value.url}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  if (value.background) {
    return { background: value.background };
  }

  return {};
}

function valuesEqual(
  a: BackgroundPictureValue | undefined,
  b: BackgroundPictureValue | undefined,
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.source === b.source &&
    a.presetId === b.presetId &&
    a.url === b.url &&
    a.background === b.background
  );
}

const backgroundPicturePickerVariants = cva("flex flex-col gap-3", {
  variants: {
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const backgroundPictureTileVariants = cva(
  [
    "relative shrink-0 overflow-hidden rounded-xl border-2",
    "transition-[border-color,box-shadow,transform] duration-[var(--duration-normal)]",
    "[transition-timing-function:var(--ease-spring)]",
    "hover:scale-[1.03] active:scale-[0.98]",
    focusRing,
  ],
  {
    variants: {
      selected: {
        true: "border-primary shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_18%,transparent)]",
        false:
          "border-[var(--glass-chrome-border)] hover:border-[color-mix(in_oklch,var(--primary)_35%,transparent)]",
      },
      kind: {
        preset: "",
        none: "border-dashed bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_35%,transparent)]",
        upload:
          "border-dashed bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_28%,transparent)]",
      },
      size: {
        sm: "size-14",
        default: "size-16",
        lg: "size-20",
      },
    },
    defaultVariants: {
      selected: false,
      kind: "preset",
      size: "default",
    },
  },
);

const backgroundPictureSurfaceVariants = cva("relative overflow-hidden", {
  variants: {
    variant: {
      fill: "bg-background",
      chrome: [
        "rounded-2xl border border-[var(--glass-chrome-border)]",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_35%,transparent)]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
        "shadow-[var(--glass-chrome-shadow)]",
      ],
      content: [
        "rounded-3xl",
        "shadow-[0_12px_48px_color-mix(in_oklch,black_18%,transparent)]",
        "ring-1 ring-black/10",
      ],
    },
    empty: {
      true: "bg-background",
      false: "",
    },
  },
  defaultVariants: {
    variant: "chrome",
    empty: true,
  },
});

export interface BackgroundPictureSurfaceProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof backgroundPictureSurfaceVariants> {
  value?: BackgroundPictureValue | null;
  overlay?: ReactNode;
  overlayClassName?: string;
}

const BackgroundPictureSurface = forwardRef<
  HTMLDivElement,
  BackgroundPictureSurfaceProps
>(
  (
    {
      className,
      variant,
      value,
      overlay,
      overlayClassName,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const hasBackground = Boolean(value && value.source !== "none");
    const backgroundStyle = getBackgroundPictureStyle(value ?? undefined);

    return (
      <div
        ref={ref}
        data-slot="background-picture-surface"
        data-has-background={hasBackground}
        className={cn(
          backgroundPictureSurfaceVariants({
            variant,
            empty: !hasBackground,
            className,
          }),
        )}
        style={{ ...backgroundStyle, ...style }}
        {...props}
      >
        {overlay && (
          <div
            data-slot="background-picture-overlay"
            className={cn("absolute inset-0", overlayClassName)}
            aria-hidden="true"
          >
            {overlay}
          </div>
        )}
        {children}
      </div>
    );
  },
);
BackgroundPictureSurface.displayName = "BackgroundPictureSurface";

export interface BackgroundPicturePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">,
    VariantProps<typeof backgroundPicturePickerVariants> {
  value?: BackgroundPictureValue;
  defaultValue?: BackgroundPictureValue;
  onValueChange?: (value: BackgroundPictureValue) => void;
  presets?: BackgroundPicturePreset[];
  accept?: string;
  uploadLabel?: string;
  noneLabel?: string;
  disabled?: boolean;
  showUpload?: boolean;
  showNone?: boolean;
  columns?: number;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "accept" | "onChange" | "disabled"
  >;
}

const BackgroundPicturePicker = forwardRef<
  HTMLDivElement,
  BackgroundPicturePickerProps
>(
  (
    {
      className,
      size,
      value: valueProp,
      defaultValue = NONE_BACKGROUND_VALUE,
      onValueChange,
      presets = DEFAULT_BACKGROUND_PRESETS,
      accept = "image/*",
      uploadLabel = "Upload",
      noneLabel = "None",
      disabled = false,
      showUpload = true,
      showNone = true,
      columns = 4,
      inputProps,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] =
      useState<BackgroundPictureValue>(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const customUrlRef = useRef<string | undefined>(
      value.source === "custom" ? value.url : undefined,
    );
    const uploadInputId = useId();

    const setValue = useCallback(
      (next: BackgroundPictureValue) => {
        if (!isControlled) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const revokeCustomUrl = useCallback((url?: string) => {
      if (url?.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    }, []);

    useEffect(() => {
      if (value.source === "custom" && value.url) {
        customUrlRef.current = value.url;
      }
    }, [value]);

    useEffect(
      () => () => {
        revokeCustomUrl(customUrlRef.current);
      },
      [revokeCustomUrl],
    );

    const selectPreset = (preset: BackgroundPicturePreset) => {
      if (disabled) return;
      const next = presetToValue(preset);
      if (valuesEqual(value, next)) return;
      revokeCustomUrl(customUrlRef.current);
      customUrlRef.current = undefined;
      setValue(next);
    };

    const selectNone = () => {
      if (disabled) return;
      if (value.source === "none") return;
      revokeCustomUrl(customUrlRef.current);
      customUrlRef.current = undefined;
      setValue(NONE_BACKGROUND_VALUE);
    };

    const handleUploadClick = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || disabled) return;

      revokeCustomUrl(customUrlRef.current);
      const objectUrl = URL.createObjectURL(file);
      customUrlRef.current = objectUrl;
      setValue({
        source: "custom",
        url: objectUrl,
      });
    };

    const isPresetSelected = (preset: BackgroundPicturePreset) =>
      value.source === "preset" && value.presetId === preset.id;

    const isCustomSelected = value.source === "custom";
    const isNoneSelected = value.source === "none";

    return (
      <div
        ref={ref}
        data-slot="background-picture-picker"
        data-disabled={disabled || undefined}
        className={cn(backgroundPicturePickerVariants({ size, className }))}
        {...props}
      >
        <div
          data-slot="background-picture-picker-grid"
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          role="listbox"
          aria-label="Background picture options"
        >
          {showNone && (
            <button
              type="button"
              role="option"
              aria-selected={isNoneSelected}
              aria-label={noneLabel}
              disabled={disabled}
              onClick={selectNone}
              className={cn(
                backgroundPictureTileVariants({
                  selected: isNoneSelected,
                  kind: "none",
                  size,
                }),
                "flex flex-col items-center justify-center gap-1 text-muted-foreground",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              <BanIcon className="size-4" />
              <span className="text-[10px] font-medium">{noneLabel}</span>
            </button>
          )}

          {presets.map((preset) => {
            const selected = isPresetSelected(preset);
            const previewStyle = getBackgroundPictureStyle(presetToValue(preset));

            return (
              <button
                key={preset.id}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={preset.label}
                disabled={disabled}
                onClick={() => selectPreset(preset)}
                className={cn(
                  backgroundPictureTileVariants({
                    selected,
                    kind: "preset",
                    size,
                  }),
                  disabled && "pointer-events-none opacity-50",
                )}
              >
                <span
                  className="absolute inset-0"
                  style={previewStyle}
                  aria-hidden="true"
                />
                <span className="sr-only">{preset.label}</span>
                {selected && <SelectionBadge />}
              </button>
            );
          })}

          {showUpload && (
            <button
              type="button"
              role="option"
              aria-selected={isCustomSelected}
              aria-label={uploadLabel}
              disabled={disabled}
              onClick={handleUploadClick}
              className={cn(
                backgroundPictureTileVariants({
                  selected: isCustomSelected,
                  kind: "upload",
                  size,
                }),
                "flex flex-col items-center justify-center gap-1 text-muted-foreground",
                disabled && "pointer-events-none opacity-50",
              )}
            >
              {isCustomSelected && value.url ? (
                <>
                  <span
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("${value.url}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    aria-hidden="true"
                  />
                  <SelectionBadge />
                </>
              ) : (
                <>
                  <UploadIcon className="size-4" />
                  <span className="text-[10px] font-medium">{uploadLabel}</span>
                </>
              )}
            </button>
          )}
        </div>

        {showUpload && (
          <input
            {...inputProps}
            ref={fileInputRef}
            id={uploadInputId}
            type="file"
            accept={accept}
            disabled={disabled}
            className="sr-only"
            onChange={handleFileChange}
          />
        )}
      </div>
    );
  },
);
BackgroundPicturePicker.displayName = "BackgroundPicturePicker";

function SelectionBadge() {
  return (
    <span
      className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
      aria-hidden="true"
    >
      <CheckIcon className="size-2.5" />
    </span>
  );
}

function BanIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 8 5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export {
  BackgroundPicturePicker,
  BackgroundPictureSurface,
  backgroundPicturePickerVariants,
  backgroundPictureSurfaceVariants,
  backgroundPictureTileVariants,
};