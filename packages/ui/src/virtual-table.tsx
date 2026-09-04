"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type UIEvent,
} from "react";
import { cn } from "@intelli/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableProps,
} from "./table";
import { computeVirtualWindow } from "./tier3-utils";

export type VirtualTableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
};

export interface VirtualTableProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  columns: VirtualTableColumn<T>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  rowHeight?: number;
  height?: number | string;
  overscan?: number;
  density?: TableProps["density"];
  containerVariant?: TableProps["containerVariant"];
  emptyMessage?: ReactNode;
  /** Infinite scroll: called near the end. */
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loadingMore?: boolean;
  /**
   * When false, `onEndReached` is never called (end of list).
   * Parents should set this after an empty page so we stop retrying.
   * @default true
   */
  hasMore?: boolean;
}

function VirtualTableInner<T>(
  {
    className,
    columns,
    data,
    getRowId,
    rowHeight = 48,
    height = 360,
    overscan = 6,
    density,
    containerVariant,
    emptyMessage = "No rows.",
    onEndReached,
    endReachedThreshold = 240,
    loadingMore = false,
    hasMore = true,
    ...props
  }: VirtualTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  /**
   * Blocks duplicate onEndReached while a page is in flight or until the user
   * leaves the end zone. Cleared when:
   * - loadingMore goes true → false (failed/empty pages can retry)
   * - data.length changes (successful append / reset)
   * - scroll leaves the end threshold (re-entry required to fire again)
   */
  const endReachedLockRef = useRef(false);
  const prevLoadingMoreRef = useRef(loadingMore);
  const [scrollTop, setScrollTop] = useState(0);
  const viewportHeight =
    typeof height === "number" ? height : scrollerRef.current?.clientHeight ?? 360;

  useEffect(() => {
    if (prevLoadingMoreRef.current && !loadingMore) {
      // Load attempt finished — unlock even when row count did not grow.
      endReachedLockRef.current = false;
    }
    prevLoadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    endReachedLockRef.current = false;
  }, [data.length]);

  const window = useMemo(
    () =>
      computeVirtualWindow({
        scrollTop,
        viewportHeight:
          typeof height === "number"
            ? height
            : viewportHeight,
        rowCount: data.length,
        rowHeight,
        overscan,
      }),
    [scrollTop, height, viewportHeight, data.length, rowHeight, overscan],
  );

  const visibleRows = useMemo(() => {
    return data.slice(window.startIndex, window.endIndex).map((row, i) => ({
      row,
      index: window.startIndex + i,
    }));
  }, [data, window.startIndex, window.endIndex]);

  const onScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      setScrollTop(el.scrollTop);
      if (!onEndReached || !hasMore || loadingMore) return;

      const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
      const inEndZone = remaining < endReachedThreshold;

      if (!inEndZone) {
        // Left the threshold — allow a future re-entry to load again.
        endReachedLockRef.current = false;
        return;
      }

      if (endReachedLockRef.current) return;
      endReachedLockRef.current = true;
      onEndReached();
    },
    [onEndReached, endReachedThreshold, loadingMore, hasMore],
  );

  const heightStyle =
    typeof height === "number" ? `${height}px` : height;

  return (
    <div
      ref={ref}
      data-slot="virtual-table"
      className={cn("w-full", className)}
      {...props}
    >
      <div
        ref={scrollerRef}
        data-slot="virtual-table-scroller"
        className="relative w-full overflow-auto rounded-2xl"
        style={{ height: heightStyle }}
        onScroll={onScroll}
      >
        <Table
          density={density}
          containerVariant={containerVariant ?? "plain"}
          animated={false}
          containerClassName="overflow-visible rounded-none"
        >
          <TableHeader className="sticky top-0 z-[1] bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_88%, var(--glass-mix-into))] backdrop-blur-md">
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody animated={false}>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center glass-chrome-text-muted"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              <>
                {window.offsetTop > 0 ? (
                  <tr aria-hidden>
                    <td
                      colSpan={columns.length}
                      style={{ height: window.offsetTop, padding: 0, border: 0 }}
                    />
                  </tr>
                ) : null}
                {visibleRows.map(({ row, index }) => (
                  <TableRow
                    key={getRowId(row, index)}
                    style={{ height: rowHeight }}
                    data-index={index}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        className={cn(
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                        )}
                      >
                        {col.cell(row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {window.totalHeight - window.offsetTop - visibleRows.length * rowHeight >
                0 ? (
                  <tr aria-hidden>
                    <td
                      colSpan={columns.length}
                      style={{
                        height: Math.max(
                          0,
                          window.totalHeight -
                            window.offsetTop -
                            visibleRows.length * rowHeight,
                        ),
                        padding: 0,
                        border: 0,
                      }}
                    />
                  </tr>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
        {loadingMore ? (
          <div className="sticky bottom-0 py-2 text-center text-xs glass-chrome-text-muted">
            Loading more…
          </div>
        ) : null}
      </div>
    </div>
  );
}

const VirtualTable = forwardRef(VirtualTableInner) as <T>(
  props: VirtualTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement | null;

(VirtualTable as { displayName?: string }).displayName = "VirtualTable";

export { VirtualTable };
