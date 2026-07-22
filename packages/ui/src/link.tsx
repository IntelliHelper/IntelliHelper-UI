import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const linkVariants = cva(
  [
    "inline-flex items-center font-medium",
    "transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-default)]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "rounded-sm",
    focusRing,
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /** Primary text link — default product accent */
        default: ["text-primary", "hover:text-primary/90"],
        /** Secondary / body-adjacent link */
        muted: ["text-muted-foreground", "hover:text-foreground"],
        /** Chrome layer — frosted toolbars and glass bars */
        chrome: [
          "glass-chrome-text-muted",
          "hover:text-[var(--glass-chrome-fg)]",
        ],
        /** Animated underline reveal (glass-link-underline) */
        underline: [
          "text-primary [text-shadow:none]",
          "glass-link-underline",
        ],
      },
      size: {
        sm: "gap-1 text-xs [&_svg]:size-3",
        default: "gap-1.5 text-sm [&_svg]:size-3.5",
        lg: "gap-2 text-base [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function ExternalIcon({ className }: { className?: string }) {
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
      aria-hidden
      focusable="false"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /**
   * Merge props onto the child element (e.g. Next.js `Link`) instead of
   * rendering a native `<a>`.
   */
  asChild?: boolean;
  /**
   * Opens in a new tab with `rel="noopener noreferrer"`.
   * Explicit `target` / `rel` props still win when provided.
   */
  external?: boolean;
  /**
   * Show an external-link icon after the label.
   * Defaults to `true` when `external` is set; ignored when `asChild` is true
   * (compose the icon inside the child yourself).
   */
  showExternalIcon?: boolean;
  /** Optional leading icon or adornment */
  startIcon?: ReactNode;
  /** Optional trailing icon (overrides `showExternalIcon` when set) */
  endIcon?: ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      external = false,
      showExternalIcon,
      startIcon,
      endIcon,
      children,
      target,
      rel,
      "aria-disabled": ariaDisabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";
    const resolvedTarget = target ?? (external ? "_blank" : undefined);
    const resolvedRel =
      rel ??
      (external || resolvedTarget === "_blank"
        ? "noopener noreferrer"
        : undefined);
    const shouldShowExternalIcon =
      !asChild &&
      (endIcon !== undefined
        ? false
        : (showExternalIcon ?? external));

    return (
      <Comp
        ref={ref}
        data-slot="link"
        data-variant={variant ?? "default"}
        data-external={external || undefined}
        className={cn(linkVariants({ variant, size, className }))}
        target={resolvedTarget}
        rel={resolvedRel}
        aria-disabled={ariaDisabled}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {startIcon}
            {children}
            {endIcon}
            {shouldShowExternalIcon ? <ExternalIcon /> : null}
          </>
        )}
      </Comp>
    );
  },
);
Link.displayName = "Link";

export { Link, linkVariants, ExternalIcon };
