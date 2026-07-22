import type { ReactNode } from "react";
import { cn } from "@intelli/utils";
import {
  PageBreadcrumbs,
  type BreadcrumbCrumb,
} from "./page-breadcrumbs";

type PageHeaderProps = {
  breadcrumbs?: BreadcrumbCrumb[];
  /** Small meta line above the title — keep short, sentence case. */
  meta?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  /** Tighter spacing for denser product pages. */
  density?: "default" | "compact";
};

/**
 * Shared page masthead for the playground.
 * Hierarchy: breadcrumbs → meta → title → description → actions.
 */
export function PageHeader({
  breadcrumbs,
  meta,
  title,
  description,
  actions,
  className,
  density = "default",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "min-w-0",
        density === "default" ? "space-y-4" : "space-y-3",
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <PageBreadcrumbs items={breadcrumbs} />
      ) : null}

      <div
        className={cn(
          "flex min-w-0 flex-col gap-4",
          actions ? "sm:flex-row sm:items-end sm:justify-between" : null,
        )}
      >
        <div className="min-w-0 max-w-2xl space-y-2">
          {meta ? (
            <div className="text-xs font-medium text-muted-foreground">
              {meta}
            </div>
          ) : null}
          <h1
            className={cn(
              "font-semibold tracking-tight text-foreground",
              density === "default"
                ? "text-3xl md:text-[2rem] md:leading-tight"
                : "text-2xl md:text-3xl",
            )}
          >
            {title}
          </h1>
          {description ? (
            <div className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {description}
            </div>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
