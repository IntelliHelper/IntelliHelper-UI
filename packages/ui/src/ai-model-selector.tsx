"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { fieldVariants, type FieldVariantProps } from "./field-variants";

export type AIModelOption = {
  value: string;
  label: string;
  description?: string;
  provider?: string;
  disabled?: boolean;
};

const aiModelSelectorVariants = cva("relative w-full", {
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

export interface AIModelSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    FieldVariantProps,
    VariantProps<typeof aiModelSelectorVariants> {
  models: AIModelOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: ReactNode;
}

const AIModelSelector = forwardRef<HTMLDivElement, AIModelSelectorProps>(
  (
    {
      className,
      models,
      value: valueProp,
      defaultValue = "",
      onValueChange,
      placeholder = "Select model",
      disabled = false,
      variant,
      size,
      state,
      label,
      ...props
    },
    ref,
  ) => {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const value = valueProp !== undefined ? valueProp : uncontrolled;

    const selected = useMemo(
      () => models.find((model) => model.value === value),
      [models, value],
    );

    const setValue = (next: string) => {
      if (valueProp === undefined) {
        setUncontrolled(next);
      }
      onValueChange?.(next);
      setOpen(false);
    };

    return (
      <div
        ref={ref}
        data-slot="ai-model-selector"
        className={cn(aiModelSelectorVariants({ size }), className)}
        {...props}
      >
        {label ? (
          <div className="mb-1.5 text-xs font-medium text-muted-foreground">
            {label}
          </div>
        ) : null}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={disabled}
              data-slot="ai-model-selector-trigger"
              aria-haspopup="listbox"
              aria-expanded={open}
              className={cn(
                fieldVariants({ variant, size, state }),
                "inline-flex w-full items-center justify-between gap-2 text-left",
                !selected && "text-muted-foreground",
                focusRing,
              )}
            >
              <span className="min-w-0 truncate">
                {selected ? (
                  <>
                    <span className="font-medium">{selected.label}</span>
                    {selected.provider ? (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {selected.provider}
                      </span>
                    ) : null}
                  </>
                ) : (
                  placeholder
                )}
              </span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-4 shrink-0 opacity-60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)] p-1"
            variant="chrome"
          >
            <ul role="listbox" data-slot="ai-model-selector-list">
              {models.map((model) => {
                const active = model.value === value;
                return (
                  <li key={model.value} role="option" aria-selected={active}>
                    <button
                      type="button"
                      disabled={model.disabled}
                      data-slot="ai-model-selector-item"
                      className={cn(
                        "flex w-full flex-col items-start gap-0.5 rounded-lg px-2.5 py-2 text-left text-sm",
                        "hover:bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)]",
                        "disabled:pointer-events-none disabled:opacity-50",
                        active && "font-semibold text-primary",
                        focusRing,
                      )}
                      onClick={() => {
                        if (!model.disabled) {
                          setValue(model.value);
                        }
                      }}
                    >
                      <span>{model.label}</span>
                      {model.description || model.provider ? (
                        <span className="text-xs font-normal text-muted-foreground">
                          {[model.provider, model.description]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
AIModelSelector.displayName = "AIModelSelector";

export { AIModelSelector, aiModelSelectorVariants };
