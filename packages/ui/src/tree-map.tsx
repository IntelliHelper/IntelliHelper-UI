"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";
import {
  chartColorAt,
  layoutTreeMap,
  type TreeMapNode,
  type TreeMapTile,
} from "./chart-utils";

const treeMapVariants = cva("relative w-full min-w-0 overflow-hidden", {
  variants: {
    variant: {
      chrome: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-3",
        "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_52%,transparent)]",
        "backdrop-blur-[var(--glass-chrome-blur)]",
        "shadow-[var(--glass-chrome-shadow)]",
      ],
      outline: [
        "rounded-2xl border border-[var(--glass-chrome-border)] p-3",
        "bg-transparent",
      ],
      bare: "p-0",
    },
  },
  defaultVariants: {
    variant: "chrome",
  },
});

export interface TreeMapProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof treeMapVariants> {
  /** Hierarchical data (single root or forest of roots). */
  data: TreeMapNode | TreeMapNode[];
  width?: number;
  height?: number;
  label?: string;
  /** Gap between sibling tiles in SVG units. */
  gap?: number;
  showLabels?: boolean;
  /** Minimum tile area (w×h) before a label is drawn. */
  labelMinArea?: number;
  colors?: string[];
  formatValue?: (value: number, tile: TreeMapTile) => string;
}

const TreeMap = forwardRef<HTMLDivElement, TreeMapProps>(
  (
    {
      className,
      variant,
      data,
      width = 320,
      height = 220,
      label = "Tree map",
      gap = 2,
      showLabels = true,
      labelMinArea = 900,
      colors,
      formatValue,
      ...props
    },
    ref,
  ) => {
    const tiles = useMemo(
      () =>
        layoutTreeMap(data, width, height, { top: 4, right: 4, bottom: 4, left: 4 }, { gap }),
      [data, width, height, gap],
    );
    const empty = tiles.length === 0;
    const leaves = useMemo(() => tiles.filter((t) => t.leaf), [tiles]);

    return (
      <div
        ref={ref}
        data-slot="tree-map"
        data-variant={variant}
        className={cn(treeMapVariants({ variant }), className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label={label}
          data-empty={empty || undefined}
        >
          <title>{label}</title>
          {!empty ? (
            leaves.map((tile, index) => {
              const fill = tile.color ?? chartColorAt(index, colors);
              const showLabel =
                showLabels &&
                tile.width * tile.height >= labelMinArea &&
                tile.width >= 28 &&
                tile.height >= 16;
              return (
                <g key={tile.path || `${tile.name}-${index}`} data-slot="tree-map-tile">
                  <rect
                    x={tile.x}
                    y={tile.y}
                    width={tile.width}
                    height={tile.height}
                    rx={4}
                    ry={4}
                    fill={fill}
                    opacity={0.88}
                  >
                    <title>
                      {tile.name}:{" "}
                      {formatValue ? formatValue(tile.value, tile) : tile.value}
                    </title>
                  </rect>
                  {showLabel ? (
                    <text
                      x={tile.x + tile.width / 2}
                      y={tile.y + tile.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-[var(--glass-chrome-fg)] pointer-events-none"
                      fontSize={Math.min(12, Math.max(9, tile.width / 10))}
                      fontWeight={500}
                    >
                      {tile.name}
                    </text>
                  ) : null}
                </g>
              );
            })
          ) : (
            <text
              x={width / 2}
              y={height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              fontSize={12}
            >
              No data
            </text>
          )}
        </svg>
      </div>
    );
  },
);
TreeMap.displayName = "TreeMap";

export { TreeMap, treeMapVariants };
