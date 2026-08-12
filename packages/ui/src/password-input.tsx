"use client";

import { EyeIcon, EyeOffIcon } from "./icons";
import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";
import { fieldVariants, type FieldVariantProps } from "./field-variants";

const toggleSizeStyles = {
  sm: "end-1 size-7 rounded-lg [&_svg]:size-3.5",
  default: "end-1 size-8 rounded-lg [&_svg]:size-4",
  lg: "end-1.5 size-9 rounded-xl [&_svg]:size-[1.125rem]",
} as const;

const inputPaddingStyles = {
  sm: "pe-9",
  default: "pe-10",
  lg: "pe-12",
} as const;

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    FieldVariantProps {
  /** Controlled visibility of the password text. */
  visible?: boolean;
  /** Default visibility when uncontrolled. */
  defaultVisible?: boolean;
  /** Called when visibility toggles. */
  onVisibleChange?: (visible: boolean) => void;
  /** Accessible label for the show action. */
  showLabel?: string;
  /** Accessible label for the hide action. */
  hideLabel?: string;
  /** Optional custom toggle content (overrides default eye icons). */
  toggleIcon?: (visible: boolean) => ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      variant,
      size = "default",
      state,
      visible: visibleProp,
      defaultVisible = false,
      onVisibleChange,
      showLabel = "Show password",
      hideLabel = "Hide password",
      toggleIcon,
      disabled,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const [uncontrolledVisible, setUncontrolledVisible] =
      useState(defaultVisible);
    const visible =
      visibleProp !== undefined ? visibleProp : uncontrolledVisible;
    const resolvedSize = size ?? "default";

    const setVisible = (next: boolean) => {
      if (visibleProp === undefined) {
        setUncontrolledVisible(next);
      }
      onVisibleChange?.(next);
    };

    return (
      <div
        data-slot="password-input"
        className={cn("relative w-full", disabled && "opacity-50")}
      >
        <input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          data-slot="password-input-field"
          autoComplete={props.autoComplete ?? "current-password"}
          disabled={disabled}
          className={cn(
            fieldVariants({ variant, size, state }),
            inputPaddingStyles[resolvedSize],
            disabled && "opacity-100",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          data-slot="password-input-toggle"
          disabled={disabled}
          aria-label={visible ? hideLabel : showLabel}
          aria-controls={id}
          aria-pressed={visible}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center",
            "text-[var(--glass-chrome-fg-muted,var(--muted-foreground))]",
            "transition-[background,color,transform] duration-[var(--duration-normal)]",
            "[transition-timing-function:var(--ease-spring)]",
            "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
            "hover:text-[var(--glass-chrome-fg,var(--foreground))]",
            "active:scale-95",
            // Wrapper already applies opacity-50 when disabled; keep button fully opaque inside it.
            "disabled:pointer-events-none disabled:opacity-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]/40",
            toggleSizeStyles[resolvedSize],
          )}
          onClick={() => setVisible(!visible)}
        >
          {toggleIcon ? (
            toggleIcon(visible)
          ) : visible ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
