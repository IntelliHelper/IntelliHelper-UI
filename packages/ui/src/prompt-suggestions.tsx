"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  filterPromptSuggestions,
  type PromptSuggestion,
} from "./ai-utils";

export type { PromptSuggestion };

const promptSuggestionsVariants = cva("flex w-full flex-wrap gap-2", {
  variants: {
    variant: {
      default: "",
      stack: "flex-col",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface PromptSuggestionsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect">,
    VariantProps<typeof promptSuggestionsVariants> {
  suggestions: PromptSuggestion[];
  query?: string;
  onSelect?: (suggestion: PromptSuggestion) => void;
  emptyMessage?: ReactNode;
}

const PromptSuggestions = forwardRef<HTMLDivElement, PromptSuggestionsProps>(
  (
    {
      className,
      variant,
      suggestions,
      query = "",
      onSelect,
      emptyMessage = "No suggestions",
      ...props
    },
    ref,
  ) => {
    const visible = useMemo(
      () => filterPromptSuggestions(suggestions, query),
      [query, suggestions],
    );

    return (
      <div
        ref={ref}
        data-slot="prompt-suggestions"
        className={cn(promptSuggestionsVariants({ variant }), className)}
        {...props}
      >
        {visible.length === 0 ? (
          <span className="text-xs text-muted-foreground">{emptyMessage}</span>
        ) : (
          visible.map((item) => (
            <button
              key={item.id}
              type="button"
              data-slot="prompt-suggestion"
              className={cn(
                "inline-flex max-w-full items-center rounded-full border px-3 py-1.5 text-left text-xs font-medium",
                "border-[var(--glass-chrome-border)]",
                "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_45%,transparent)]",
                "text-[var(--glass-chrome-fg)]",
                "transition-colors hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_65%,transparent)]",
                focusRing,
              )}
              onClick={() => onSelect?.(item)}
            >
              <span className="truncate">{item.label}</span>
            </button>
          ))
        )}
      </div>
    );
  },
);
PromptSuggestions.displayName = "PromptSuggestions";

export {
  PromptSuggestions,
  promptSuggestionsVariants,
  filterPromptSuggestions,
};
