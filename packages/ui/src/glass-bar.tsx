"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";

const glassBarVariants = cva(
  [
    "flex w-full items-center gap-2",
    "glass-chrome glass-chrome-capsule",
    "px-2",
    "animate-float-in",
  ],
  {
    variants: {
      size: {
        sm: "h-12 gap-1.5 px-1.5",
        default: "h-14 gap-2 px-2",
        lg: "h-16 gap-3 px-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface GlassBarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassBarVariants> {}

const GlassBar = forwardRef<HTMLDivElement, GlassBarProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="toolbar"
        className={cn(glassBarVariants({ size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GlassBar.displayName = "GlassBar";

function GlassBarMedia({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "size-10 shrink-0 overflow-hidden rounded-md shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
GlassBarMedia.displayName = "GlassBarMedia";

function GlassBarInfo({
  className,
  title,
  subtitle,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      className={cn("min-w-0 flex-1 truncate text-left", className)}
      {...props}
    >
      <p className="truncate text-sm font-semibold leading-tight glass-chrome-text">
        {title}
      </p>
      {subtitle && (
        <p className="truncate text-xs leading-tight glass-chrome-text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
}
GlassBarInfo.displayName = "GlassBarInfo";

function GlassBarControls({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex shrink-0 items-center gap-0.5", className)}
      {...props}
    />
  );
}
GlassBarControls.displayName = "GlassBarControls";

export {
  GlassBar,
  GlassBarMedia,
  GlassBarInfo,
  GlassBarControls,
  glassBarVariants,
};