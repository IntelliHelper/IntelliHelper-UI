"use client";

import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Width / height ratio (e.g. 16/9). Defaults to 1 (square). */
  ratio?: number;
}

const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 1, style, children, ...props }, ref) => {
    const safeRatio =
      Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
    const mergedStyle: CSSProperties = {
      ...style,
      position: "relative",
      width: "100%",
      paddingBottom: `${(1 / safeRatio) * 100}%`,
    };

    return (
      <div
        ref={ref}
        data-slot="aspect-ratio"
        data-ratio={safeRatio}
        className={cn("overflow-hidden", className)}
        style={mergedStyle}
        {...props}
      >
        <div className="absolute inset-0 size-full [&>*]:size-full">
          {children}
        </div>
      </div>
    );
  },
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };
