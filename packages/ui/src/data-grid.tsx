"use client";

import {
  forwardRef,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Checkbox } from "./checkbox";
import { Box, Cluster, Stack } from "./layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableProps,
} from "./table";
import { SearchInput } from "./search-input";
import {
  getDataGridCellValue,
  processDataGridRows,
  toggleRowSelection,
  toggleSelectAll,
  toggleSortState,
  type DataGridColumnDef,
  type DataGridSortState,
} from "./tier3-utils";

export type { DataGridColumnDef, DataGridSortState };

export interface DataGridProps<T>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  columns: DataGridColumnDef<T>[];
  data: T[];
  /** Unique row id accessor. */
  getRowId: (row: T) => string;
  /** Custom cell renderer. */
  renderCell?: (
    row: T,
    column: DataGridColumnDef<T>,
    value: unknown,
  ) => ReactNode;
  sort?: DataGridSortState;
  defaultSort?: DataGridSortState;
  onSortChange?: (sort: DataGridSortState) => void;
  filters?: Record<string, string>;
  defaultFilters?: Record<string, string>;
  onFiltersChange?: (filters: Record<string, string>) => void;
  globalFilter?: string;
  defaultGlobalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  /** Enable global search. Default true. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Row selection. */
  selectable?: boolean;
  multiSelect?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  emptyMessage?: ReactNode;
  density?: TableProps["density"];
  containerVariant?: TableProps["containerVariant"];
  showColumnFilters?: boolean;
  toolbar?: ReactNode;
}

function SortGlyph({ direction }: { direction: "asc" | "desc" | false }) {
  return (
    <span className="inline-flex w-3 flex-col text-[8px] leading-none opacity-70" aria-hidden>
      <span className={direction === "asc" ? "text-primary" : ""}>▲</span>
      <span className={direction === "desc" ? "text-primary" : ""}>▼</span>
    </span>
  );
}

function DataGridInner<T>(
  {
    className,
    columns,
    data,
    getRowId,
    renderCell,
    sort: sortProp,
    defaultSort = null,
    onSortChange,
    filters: filtersProp,
    defaultFilters = {},
    onFiltersChange,
    globalFilter: globalProp,
    defaultGlobalFilter = "",
    onGlobalFilterChange,
    searchable = true,
    searchPlaceholder = "Search…",
    selectable = false,
    multiSelect = true,
    selectedRowIds: selectedProp,
    defaultSelectedRowIds = [],
    onSelectedRowIdsChange,
    emptyMessage = "No results.",
    density,
    containerVariant,
    showColumnFilters = false,
    toolbar,
    ...props
  }: DataGridProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [sortUncontrolled, setSortUncontrolled] =
    useState<DataGridSortState>(defaultSort);
  const [filtersUncontrolled, setFiltersUncontrolled] =
    useState<Record<string, string>>(defaultFilters);
  const [globalUncontrolled, setGlobalUncontrolled] =
    useState(defaultGlobalFilter);
  const [selectedUncontrolled, setSelectedUncontrolled] = useState<string[]>(
    defaultSelectedRowIds,
  );

  const sort = sortProp !== undefined ? sortProp : sortUncontrolled;
  const filters = filtersProp !== undefined ? filtersProp : filtersUncontrolled;
  const globalFilter =
    globalProp !== undefined ? globalProp : globalUncontrolled;
  const selected =
    selectedProp !== undefined ? selectedProp : selectedUncontrolled;

  const setSort = (next: DataGridSortState) => {
    if (sortProp === undefined) setSortUncontrolled(next);
    onSortChange?.(next);
  };
  const setFilters = (next: Record<string, string>) => {
    if (filtersProp === undefined) setFiltersUncontrolled(next);
    onFiltersChange?.(next);
  };
  const setGlobal = (next: string) => {
    if (globalProp === undefined) setGlobalUncontrolled(next);
    onGlobalFilterChange?.(next);
  };
  const setSelected = (next: string[]) => {
    if (selectedProp === undefined) setSelectedUncontrolled(next);
    onSelectedRowIdsChange?.(next);
  };

  const rows = useMemo(
    () =>
      processDataGridRows(data, columns, {
        sort,
        filters,
        globalFilter,
      }),
    [data, columns, sort, filters, globalFilter],
  );

  const rowIds = rows.map(getRowId);
  const allSelected =
    rowIds.length > 0 && rowIds.every((id) => selected.includes(id));
  const someSelected = rowIds.some((id) => selected.includes(id)) && !allSelected;

  return (
    <Stack
      ref={ref as React.Ref<HTMLElement>}
      gap={3}
      data-slot="data-grid"
      className={cn("w-full", className)}
      {...props}
    >
      {(searchable || toolbar) && (
        <Cluster
          data-slot="data-grid-toolbar"
          align="center"
          gap={2}
          className="w-full"
        >
          {searchable ? (
            <Box className="min-w-[12rem] max-w-sm flex-1">
              <SearchInput
                value={globalFilter}
                onValueChange={setGlobal}
                placeholder={searchPlaceholder}
                size="sm"
              />
            </Box>
          ) : null}
          {toolbar}
          {selectable && selected.length > 0 ? (
            <Box as="span" className="text-xs tabular-nums glass-chrome-text-muted">
              {selected.length} selected
            </Box>
          ) : null}
        </Cluster>
      )}

      <Table density={density} containerVariant={containerVariant} animated={false}>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                {multiSelect ? (
                  <Checkbox
                    checked={
                      allSelected ? true : someSelected ? "indeterminate" : false
                    }
                    onCheckedChange={() => setSelected(toggleSelectAll(selected, rowIds))}
                    aria-label="Select all rows"
                  />
                ) : null}
              </TableHead>
            ) : null}
            {columns.map((col) => {
              const sortable = col.sortable !== false;
              const active = sort?.columnId === col.id ? sort.direction : false;
              return (
                <TableHead
                  key={col.id}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                >
                  {sortable ? (
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md hover:text-foreground",
                        focusRing,
                      )}
                      onClick={() => setSort(toggleSortState(sort, col.id))}
                    >
                      {col.header}
                      <SortGlyph direction={active} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
          {showColumnFilters ? (
            <TableRow>
              {selectable ? <TableHead /> : null}
              {columns.map((col) => (
                <TableHead key={`filter-${col.id}`} className="py-2 font-normal normal-case tracking-normal">
                  {col.filterable !== false ? (
                    <SearchInput
                      size="sm"
                      value={filters[col.id] ?? ""}
                      onValueChange={(v) =>
                        setFilters({ ...filters, [col.id]: v })
                      }
                      placeholder={`Filter ${col.header}`}
                      leadingIcon={null}
                      className="h-8 text-xs"
                    />
                  ) : null}
                </TableHead>
              ))}
            </TableRow>
          ) : null}
        </TableHeader>
        <TableBody animated={false}>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="h-24 text-center glass-chrome-text-muted"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.includes(id);
              return (
                <TableRow
                  key={id}
                  data-state={isSelected ? "selected" : undefined}
                >
                  {selectable ? (
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() =>
                          setSelected(
                            toggleRowSelection(selected, id, {
                              multi: multiSelect,
                            }),
                          )
                        }
                        aria-label={`Select row ${id}`}
                      />
                    </TableCell>
                  ) : null}
                  {columns.map((col) => {
                    const value = getDataGridCellValue(row, col);
                    return (
                      <TableCell
                        key={col.id}
                        className={cn(
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                        )}
                      >
                        {renderCell
                          ? renderCell(row, col, value)
                          : (value as ReactNode)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Stack>
  );
}

const DataGrid = forwardRef(DataGridInner) as <T>(
  props: DataGridProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => React.ReactElement | null;

(DataGrid as { displayName?: string }).displayName = "DataGrid";

export { DataGrid };
