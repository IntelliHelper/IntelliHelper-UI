"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { estimateTokens, formatTokenCount } from "./ai-utils";

const promptInputVariants = cva(
  [
    "flex w-full flex-col gap-2 rounded-2xl border p-2",
    "border-[var(--glass-chrome-border)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
        outline: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface PromptInputProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onChange" | "onSubmit" | "defaultValue">,
    VariantProps<typeof promptInputVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxLength?: number;
  showTokenCount?: boolean;
  submitLabel?: ReactNode;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
  footer?: ReactNode;
}

const PromptInput = forwardRef<HTMLFormElement, PromptInputProps>(
  (
    {
      className,
      variant,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onSubmit,
      placeholder = "Message the assistant…",
      disabled = false,
      loading = false,
      maxLength,
      showTokenCount = true,
      submitLabel = "Send",
      textareaProps,
      footer,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const value = valueProp !== undefined ? valueProp : uncontrolled;

    const setValue = useCallback(
      (next: string) => {
        if (valueProp === undefined) {
          setUncontrolled(next);
        }
        onValueChange?.(next);
      },
      [onValueChange, valueProp],
    );

    const submit = () => {
      const trimmed = value.trim();
      if (!trimmed || disabled || loading) {
        return;
      }
      onSubmit?.(trimmed);
    };

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      submit();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      textareaProps?.onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    };

    const tokens = estimateTokens(value);

    return (
      <form
        ref={ref}
        data-slot="prompt-input"
        className={cn(promptInputVariants({ variant }), className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <textarea
          data-slot="prompt-input-field"
          value={value}
          disabled={disabled || loading}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          {...textareaProps}
          onChange={(event) => {
            setValue(event.target.value);
            textareaProps?.onChange?.(event);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-h-[4.5rem] w-full resize-y rounded-xl border-0 bg-transparent px-2.5 py-2 text-sm",
            "text-[var(--glass-chrome-fg)] placeholder:text-muted-foreground",
            "outline-none focus-visible:ring-0",
            focusRing,
            textareaProps?.className,
          )}
        />
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            {showTokenCount ? (
              <span data-slot="prompt-input-tokens">
                ~{formatTokenCount(tokens)} tokens
              </span>
            ) : null}
            {footer}
          </div>
          <button
            type="submit"
            data-slot="prompt-input-submit"
            disabled={disabled || loading || !value.trim()}
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold",
              "glass-chrome glass-chrome-interactive glass-chrome-text",
              "disabled:pointer-events-none disabled:opacity-50",
              focusRing,
            )}
          >
            {loading ? "Sending…" : submitLabel}
          </button>
        </div>
      </form>
    );
  },
);
PromptInput.displayName = "PromptInput";

export { PromptInput, promptInputVariants };
