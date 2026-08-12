"use client";

import { DefaultErrorIcon } from "./icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn, focusRing } from "@intelli/utils";
import { Button, type ButtonProps } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";
import { Cluster } from "./layout";

const retryViewVariants = cva("", {
  variants: {
    variant: {
      chrome: "",
      outline: "",
      destructive: [
        "border-[color-mix(in_oklch,var(--destructive)_35%,transparent)]",
        "bg-[color-mix(in_oklch,var(--destructive)_8%,transparent)]",
      ],
    },
    animated: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    variant: "chrome",
    animated: true,
  },
});

export interface RetryViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof retryViewVariants> {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  retryLabel?: ReactNode;
  onRetry?: () => void;
  retryProps?: Omit<ButtonProps, "onClick" | "children">;
  actions?: ReactNode;
  loading?: boolean;
}

const RetryView = forwardRef<HTMLDivElement, RetryViewProps>(
  (
    {
      className,
      variant,
      animated,
      title = "Something went wrong",
      description = "We couldn't load this content. Check your connection and try again.",
      icon,
      retryLabel = "Try again",
      onRetry,
      retryProps,
      actions,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const emptyVariant = variant === "outline" ? "outline" : "chrome";

    return (
      <Empty
        ref={ref}
        role="alert"
        data-slot="retry-view"
        variant={emptyVariant}
        animated={animated ?? true}
        className={cn(retryViewVariants({ variant, animated }), className)}
        {...props}
      >
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            data-slot="retry-view-icon"
            className={cn(
              variant === "destructive" && "text-destructive",
            )}
          >
            {icon ?? <DefaultErrorIcon className="size-6" />}
          </EmptyMedia>
          <EmptyTitle data-slot="retry-view-title">{title}</EmptyTitle>
          {description ? (
            <EmptyDescription data-slot="retry-view-description">
              {description}
            </EmptyDescription>
          ) : null}
        </EmptyHeader>
        <EmptyContent>
          <Cluster justify="center" gap={2}>
            {onRetry ? (
              <Button
                type="button"
                variant="primary"
                disabled={loading}
                className={cn(focusRing)}
                onClick={onRetry}
                {...retryProps}
              >
                {loading ? "Retrying…" : retryLabel}
              </Button>
            ) : null}
            {actions}
          </Cluster>
        </EmptyContent>
      </Empty>
    );
  },
);
RetryView.displayName = "RetryView";

export { RetryView, retryViewVariants };
