"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@intelli/utils";

export interface GlassContentCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animated?: boolean;
}

const GlassContentCard = forwardRef<HTMLDivElement, GlassContentCardProps>(
  ({ className, animated = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "shadow-[0_12px_48px_color-mix(in_oklch,black_18%,transparent)]",
          "ring-1 ring-black/10",
          animated && "animate-glass-rise glass-specular-on-mount",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GlassContentCard.displayName = "GlassContentCard";

export interface GlassContentPanelProps extends HTMLAttributes<HTMLDivElement> {
  gradient: string;
  children: ReactNode;
}

function GlassContentPanel({
  className,
  gradient,
  children,
  ...props
}: GlassContentPanelProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between p-5",
        "animate-content-glow",
        className,
      )}
      style={{ background: gradient }}
      {...props}
    >
      {children}
    </div>
  );
}
GlassContentPanel.displayName = "GlassContentPanel";

export { GlassContentCard, GlassContentPanel };