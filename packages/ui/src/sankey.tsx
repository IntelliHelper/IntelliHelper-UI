"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";
import {
  chartColorAt,
  layoutSankey,
  type SankeyLinkInput,
  type SankeyNodeInput,
} from "./chart-utils";

const sankeyVariants = cva("relative w-full min-w-0 overflow-hidden", {
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

export interface SankeyProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof sankeyVariants> {
  nodes: SankeyNodeInput[];
  links: SankeyLinkInput[];
  width?: number;
  height?: number;
  label?: string;
  showLabels?: boolean;
  nodeWidth?: number;
  nodeGap?: number;
  colors?: string[];
  /** Opacity for link ribbons (0–1). Default 0.45. */
  linkOpacity?: number;
}

const Sankey = forwardRef<HTMLDivElement, SankeyProps>(
  (
    {
      className,
      variant,
      nodes,
      links,
      width = 360,
      height = 240,
      label = "Sankey diagram",
      showLabels = true,
      nodeWidth = 14,
      nodeGap = 12,
      colors,
      linkOpacity = 0.45,
      ...props
    },
    ref,
  ) => {
    const layout = useMemo(
      () =>
        layoutSankey(
          nodes,
          links,
          width,
          height,
          {
            top: 12,
            right: showLabels ? 56 : 12,
            bottom: 12,
            left: showLabels ? 56 : 12,
          },
          { nodeWidth, nodeGap },
        ),
      [nodes, links, width, height, showLabels, nodeWidth, nodeGap],
    );
    const empty = layout.nodes.length === 0;

    return (
      <div
        ref={ref}
        data-slot="sankey"
        data-variant={variant}
        className={cn(sankeyVariants({ variant }), className)}
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
            <>
              {layout.links.map((link, i) => (
                <path
                  key={`${link.source}-${link.target}-${i}`}
                  data-slot="sankey-link"
                  d={link.path}
                  fill={link.color ?? chartColorAt(i, colors)}
                  opacity={linkOpacity}
                >
                  <title>
                    {link.source} → {link.target}: {link.value}
                  </title>
                </path>
              ))}
              {layout.nodes.map((node, i) => {
                const fill = node.color ?? chartColorAt(i, colors);
                const isLeft = node.column === 0;
                const isRight = node.column === layout.columns - 1;
                return (
                  <g key={node.id} data-slot="sankey-node">
                    <rect
                      x={node.x}
                      y={node.y}
                      width={node.width}
                      height={node.height}
                      rx={3}
                      ry={3}
                      fill={fill}
                    >
                      <title>
                        {node.label ?? node.id}: {node.value}
                      </title>
                    </rect>
                    {showLabels ? (
                      <text
                        x={
                          isLeft
                            ? node.x - 6
                            : isRight
                              ? node.x + node.width + 6
                              : node.x + node.width / 2
                        }
                        y={node.y + node.height / 2}
                        textAnchor={
                          isLeft ? "end" : isRight ? "start" : "middle"
                        }
                        dominantBaseline="middle"
                        className="fill-[var(--glass-chrome-fg)]"
                        fontSize={10}
                        fontWeight={500}
                      >
                        {node.label ?? node.id}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </>
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
Sankey.displayName = "Sankey";

export { Sankey, sankeyVariants };
