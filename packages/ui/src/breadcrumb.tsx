import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@intelli/utils";

const breadcrumbListVariants = cva(
  "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2",
  {
    variants: {
      size: {
        sm: "text-xs gap-1 sm:gap-1.5",
        default: "text-sm gap-1.5 sm:gap-2",
        lg: "text-base gap-2 sm:gap-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface BreadcrumbProps extends ComponentPropsWithoutRef<"nav"> {
  separator?: ReactNode;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  ),
);
Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbListProps
  extends ComponentPropsWithoutRef<"ol">,
    VariantProps<typeof breadcrumbListVariants> {}

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, size, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(breadcrumbListVariants({ size, className }))}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="breadcrumb-item"
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const breadcrumbLinkVariants = cva(
  [
    "inline-flex items-center gap-1 transition-colors duration-[var(--duration-fast)]",
    "hover:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
  ],
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        chrome: "glass-chrome-text-muted hover:text-[var(--glass-chrome-fg)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BreadcrumbLinkProps
  extends ComponentPropsWithoutRef<"a">,
    VariantProps<typeof breadcrumbLinkVariants> {
  asChild?: boolean;
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, asChild = false, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        data-slot="breadcrumb-link"
        className={cn(breadcrumbLinkVariants({ variant, className }))}
        {...props}
      />
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    data-slot="breadcrumb-page"
    className={cn("font-medium text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-ellipsis"
    className={cn(
      "flex size-7 items-center justify-center rounded-full",
      "glass-chrome-text-muted",
      className,
    )}
    {...props}
  >
    <MoreHorizontalIcon className="size-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5 opacity-60"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function MoreHorizontalIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  breadcrumbListVariants,
  breadcrumbLinkVariants,
};
