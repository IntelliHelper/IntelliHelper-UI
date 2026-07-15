"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const citationCardVariants = cva(
  [
    "flex w-full flex-col gap-1 rounded-xl border p-3 text-left text-sm",
    "border-[var(--glass-chrome-border)] transition-colors",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_42%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_58%,transparent)]",
        ],
        outline: "bg-transparent hover:bg-[color-mix(in_oklch,var(--foreground)_4%,transparent)]",
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface CitationCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof citationCardVariants> {
  index?: number | string;
  title: ReactNode;
  source?: ReactNode;
  excerpt?: ReactNode;
  href?: string;
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

const CitationCard = forwardRef<HTMLDivElement, CitationCardProps>(
  (
    {
      className,
      variant,
      index,
      title,
      source,
      excerpt,
      href,
      linkProps,
      ...props
    },
    ref,
  ) => {
    const body = (
      <>
        <div className="flex items-start gap-2">
          {index != null ? (
            <span
              data-slot="citation-card-index"
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-[10px] font-bold text-primary"
            >
              {index}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <div
              data-slot="citation-card-title"
              className="font-medium text-[var(--glass-chrome-fg)]"
            >
              {title}
            </div>
            {source ? (
              <div
                data-slot="citation-card-source"
                className="mt-0.5 text-xs text-muted-foreground"
              >
                {source}
              </div>
            ) : null}
          </div>
        </div>
        {excerpt ? (
          <p
            data-slot="citation-card-excerpt"
            className="line-clamp-3 text-xs leading-relaxed text-muted-foreground"
          >
            {excerpt}
          </p>
        ) : null}
      </>
    );

    return (
      <div
        ref={ref}
        data-slot="citation-card"
        className={cn(citationCardVariants({ variant }), className)}
        {...props}
      >
        {href ? (
          <a
            href={href}
            data-slot="citation-card-link"
            className={cn("block outline-none", focusRing)}
            {...linkProps}
          >
            {body}
          </a>
        ) : (
          body
        )}
      </div>
    );
  },
);
CitationCard.displayName = "CitationCard";

export { CitationCard, citationCardVariants };
