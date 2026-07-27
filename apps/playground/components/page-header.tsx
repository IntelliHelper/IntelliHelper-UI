import type { ReactNode } from "react";
import { Cluster, Flex, Stack } from "@intelli/ui/layout";
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
    <Stack
      as="header"
      gap={density === "default" ? 4 : 3}
      className={cn("min-w-0", className)}
    >
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <PageBreadcrumbs items={breadcrumbs} />
      ) : null}

      <Flex
        direction="column"
        gap={4}
        className={cn(
          "min-w-0",
          actions ? "sm:flex-row sm:items-end sm:justify-between" : null,
        )}
      >
        <Stack gap={2} className="min-w-0 max-w-2xl">
          {meta ? (
            <BoxMeta>{meta}</BoxMeta>
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
        </Stack>

        {actions ? (
          <Cluster gap={2} className="shrink-0">
            {actions}
          </Cluster>
        ) : null}
      </Flex>
    </Stack>
  );
}

function BoxMeta({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-medium text-muted-foreground">{children}</div>
  );
}
