"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { cn } from "@intelli/utils";
import {
  heatmapColorAt,
  layoutHeatmapCells,
  type HeatmapCellLayout,
  type HeatmapColorScaleId,
  type HeatmapDatum,
} from "./chart-utils";

const heatmapVariants = cva("relative w-full min-w-0 overflow-hidden", {
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

export type HeatmapCellInteraction = {
  cell: HeatmapCellLayout;
  event: MouseEvent<SVGRectElement> | KeyboardEvent<SVGRectElement>;
};

export interface HeatmapProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onClick">,
    VariantProps<typeof heatmapVariants> {
  /**
   * Sparse cells `{ row, col, value }` **or** a dense `number[][]` matrix
   * (`values[rowIndex][colIndex]`). Pair matrix input with `rows` / `cols` labels.
   */
  data: HeatmapDatum[] | number[][];
  /** Explicit row order / labels (recommended for matrix data) */
  rows?: string[];
  /** Explicit column order / labels */
  cols?: string[];
  width?: number;
  height?: number;
  /** Fixed square cell size in SVG units; when set, layout expands to fit */
  cellSize?: number;
  /** Gap between cells in SVG units (default 3) */
  gap?: number;
  /** Corner radius for each cell (default 3) */
  cellRadius?: number;
  /**
   * Color ramp: named token scale (`primary` | `cool` | `warm` | `mono`)
   * or custom CSS color stops from low → high.
   */
  colorScale?: HeatmapColorScaleId | string[];
  /** Fully custom color for a cell (overrides scale / cell.color when provided) */
  getCellColor?: (cell: HeatmapCellLayout, min: number, max: number) => string;
  /** Domain override for intensity mapping */
  minValue?: number;
  maxValue?: number;
  /** Fill for missing / zero-intensity empty chrome (default transparent glass border mix) */
  emptyColor?: string;
  showRowLabels?: boolean;
  showColLabels?: boolean;
  /** Render numeric value centered in each cell */
  showValues?: boolean;
  /** Format cell values when `showValues` is true */
  formatValue?: (value: number, cell: HeatmapCellLayout) => string;
  /** Color scale legend under the plot */
  showLegend?: boolean;
  /** Labels for legend endpoints */
  legendLowLabel?: string;
  legendHighLabel?: string;
  label?: string;
  /**
   * Prefer pointer cursor when cells can be activated.
   * Keyboard `role="button"` + Enter/Space only apply when `onCellClick` is set.
   * Hover-only cells use focus/blur to mirror `onCellHover` for keyboard users.
   */
  interactive?: boolean;
  onCellClick?: (payload: HeatmapCellInteraction) => void;
  onCellHover?: (cell: HeatmapCellLayout | null) => void;
  /** Label used for absent sparse cells in tooltips / values (default "no data") */
  emptyLabel?: string;
}

const Heatmap = forwardRef<HTMLDivElement, HeatmapProps>(
  (
    {
      className,
      variant,
      data,
      rows: rowsProp,
      cols: colsProp,
      width = 360,
      height = 220,
      cellSize,
      gap = 3,
      cellRadius = 3,
      colorScale = "primary",
      getCellColor,
      minValue,
      maxValue,
      emptyColor = "color-mix(in oklch, var(--glass-chrome-border) 35%, transparent)",
      showRowLabels = true,
      showColLabels = true,
      showValues = false,
      formatValue,
      showLegend = true,
      legendLowLabel = "Low",
      legendHighLabel = "High",
      label = "Heatmap",
      interactive = false,
      onCellClick,
      onCellHover,
      emptyLabel = "no data",
      ...props
    },
    ref,
  ) => {
    const pad = useMemo(
      () => ({
        top: showColLabels ? 22 : 8,
        right: 8,
        bottom: 8,
        left: showRowLabels ? 44 : 8,
      }),
      [showRowLabels, showColLabels],
    );

    const layout = useMemo(
      () =>
        layoutHeatmapCells(data, width, height, pad, {
          rows: rowsProp,
          cols: colsProp,
          gap,
          minValue,
          maxValue,
          cellSize,
        }),
      [data, width, height, pad, rowsProp, colsProp, gap, minValue, maxValue, cellSize],
    );

    const svgWidth = useMemo(() => {
      if (cellSize != null && cellSize > 0) {
        return pad.left + layout.plotWidth + pad.right;
      }
      return width;
    }, [cellSize, pad.left, pad.right, layout.plotWidth, width]);

    const svgHeight = useMemo(() => {
      if (cellSize != null && cellSize > 0) {
        return pad.top + layout.plotHeight + pad.bottom;
      }
      return height;
    }, [cellSize, pad.top, pad.bottom, layout.plotHeight, height]);

    const empty = layout.cells.length === 0;
    const domainMin = layout.min;
    const domainMax = layout.max;

    const resolveColor = (cell: HeatmapCellLayout) => {
      if (getCellColor) return getCellColor(cell, domainMin, domainMax);
      if (cell.color) return cell.color;
      if (!cell.present) return emptyColor;
      return heatmapColorAt(cell.t, colorScale);
    };

    const legendStops = useMemo(() => {
      return [0, 0.33, 0.66, 1].map((t) => heatmapColorAt(t, colorScale));
    }, [colorScale]);

    return (
      <div
        ref={ref}
        data-slot="heatmap"
        data-variant={variant}
        data-interactive={interactive || undefined}
        className={cn(heatmapVariants({ variant }), className)}
        {...props}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-auto w-full"
          role="img"
          aria-label={label}
          data-empty={empty || undefined}
        >
          <title>{label}</title>
          {!empty ? (
            <>
              {showColLabels
                ? layout.cols.map((col, i) => {
                    const sample = layout.cells.find((c) => c.colIndex === i);
                    if (!sample) return null;
                    return (
                      <text
                        key={`col-${col}`}
                        x={sample.x + sample.width / 2}
                        y={pad.top - 8}
                        textAnchor="middle"
                        className="fill-muted-foreground"
                        fontSize={9}
                        data-slot="heatmap-col-label"
                      >
                        {col}
                      </text>
                    );
                  })
                : null}
              {showRowLabels
                ? layout.rows.map((row, i) => {
                    const sample = layout.cells.find((c) => c.rowIndex === i);
                    if (!sample) return null;
                    return (
                      <text
                        key={`row-${row}`}
                        x={pad.left - 6}
                        y={sample.y + sample.height / 2}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="fill-muted-foreground"
                        fontSize={9}
                        data-slot="heatmap-row-label"
                      >
                        {row}
                      </text>
                    );
                  })
                : null}
              <g data-slot="heatmap-cells">
                {layout.cells.map((cell) => {
                  const fill = resolveColor(cell);
                  // Absent sparse slots must not be presented as numeric zero.
                  const valueText = cell.present
                    ? formatValue
                      ? formatValue(cell.value, cell)
                      : String(cell.value)
                    : emptyLabel;
                  const title = `${cell.row} · ${cell.col}: ${valueText}`;
                  const isClickable = Boolean(onCellClick);
                  const isHoverable = Boolean(onCellHover);
                  // Focusable when click or hover is wired; never advertise button without click.
                  const isFocusable = isClickable || isHoverable;
                  const showPointer =
                    isClickable || isHoverable || interactive;
                  return (
                    <g
                      key={`${cell.row}-${cell.col}`}
                      data-slot="heatmap-cell"
                      data-row={cell.row}
                      data-col={cell.col}
                      data-present={cell.present ? undefined : "false"}
                    >
                      <rect
                        x={cell.x}
                        y={cell.y}
                        width={cell.width}
                        height={cell.height}
                        rx={cellRadius}
                        ry={cellRadius}
                        fill={fill}
                        tabIndex={isFocusable ? 0 : undefined}
                        role={isClickable ? "button" : undefined}
                        aria-label={title}
                        className={cn(
                          showPointer && "cursor-pointer",
                          isFocusable &&
                            "outline-none focus-visible:stroke-[var(--primary)] focus-visible:stroke-2",
                        )}
                        onClick={
                          onCellClick
                            ? (event) => onCellClick({ cell, event })
                            : undefined
                        }
                        onMouseEnter={
                          onCellHover ? () => onCellHover(cell) : undefined
                        }
                        onMouseLeave={
                          onCellHover ? () => onCellHover(null) : undefined
                        }
                        onFocus={
                          onCellHover ? () => onCellHover(cell) : undefined
                        }
                        onBlur={
                          onCellHover ? () => onCellHover(null) : undefined
                        }
                        onKeyDown={
                          isClickable && onCellClick
                            ? (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  onCellClick({ cell, event });
                                }
                              }
                            : undefined
                        }
                      >
                        <title>{title}</title>
                      </rect>
                      {showValues && cell.width >= 18 && cell.height >= 14 ? (
                        <text
                          x={cell.x + cell.width / 2}
                          y={cell.y + cell.height / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="pointer-events-none fill-[var(--glass-chrome-fg)]"
                          fontSize={Math.min(10, Math.max(7, cell.width / 3.5))}
                          fontWeight={500}
                          opacity={cell.present ? 0.9 : 0.55}
                          data-slot="heatmap-value"
                        >
                          {valueText}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </g>
            </>
          ) : (
            <text
              x={svgWidth / 2}
              y={svgHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              fontSize={12}
            >
              No data
            </text>
          )}
        </svg>
        {showLegend && !empty ? (
          <div
            data-slot="heatmap-legend"
            className="mt-2 flex items-center gap-2 px-0.5 text-[10px] text-muted-foreground"
          >
            <span className="shrink-0">{legendLowLabel}</span>
            <div
              className="flex h-2.5 min-w-0 flex-1 overflow-hidden rounded-full border border-[var(--glass-chrome-border)]"
              aria-hidden
            >
              {legendStops.map((stop, i) => (
                <span
                  key={i}
                  className="h-full flex-1"
                  style={{ background: stop }}
                />
              ))}
            </div>
            <span className="shrink-0">{legendHighLabel}</span>
            <span className="ml-auto tabular-nums opacity-80">
              {domainMin}
              <span className="mx-0.5 opacity-50">–</span>
              {domainMax}
            </span>
          </div>
        ) : null}
      </div>
    );
  },
);
Heatmap.displayName = "Heatmap";

export { Heatmap, heatmapVariants };
