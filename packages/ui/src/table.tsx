"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type TdHTMLAttributes } from "react";
import { cn } from "@intelli/utils";

const tableContainerVariants = cva("relative w-full overflow-auto", {
  variants: {
    variant: {
      chrome: "glass-panel rounded-2xl",
      elevated: "glass-header rounded-2xl",
      plain: "",
    },
    animated: {
      true: "animate-glass-rise",
      false: "",
    },
  },
  defaultVariants: {
    variant: "chrome",
    animated: true,
  },
});

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  containerVariant?: VariantProps<typeof tableContainerVariants>["variant"];
  animated?: boolean;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    { className, containerClassName, containerVariant, animated, ...props },
    ref,
  ) => (
    <div
      className={cn(
        tableContainerVariants({ variant: containerVariant, animated }),
        containerClassName,
      )}
    >
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b [&_tr]:border-[color-mix(in_oklch,var(--glass-chrome-border)_55%,transparent)]",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  animated?: boolean;
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, animated = true, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        "[&_tr:last-child]:border-0",
        animated && "glass-stagger-rows",
        className,
      )}
      {...props}
    />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-[color-mix(in_oklch,var(--glass-chrome-border)_55%,transparent)]",
      "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_40%,transparent)]",
      "font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_35%,transparent)]",
      "glass-row-hover",
      "data-[state=selected]:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide",
      "glass-chrome-text-muted",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle glass-chrome-text",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm glass-chrome-text-muted animate-fade-in-up",
      className,
    )}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableContainerVariants,
};