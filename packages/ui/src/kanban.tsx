"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useMemo,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import { Badge } from "./badge";
import { Box, Cluster, Flex, Split, Stack } from "./layout";
import { ScrollArea } from "./scroll-area";
import {
  groupKanbanCards,
  moveKanbanCard,
  type KanbanCard,
  type KanbanColumn,
} from "./tier3-utils";

const kanbanVariants = cva("w-full overflow-x-auto pb-2", {
  variants: {
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const columnVariants = cva(
  [
    "shrink-0 rounded-2xl border",
    "border-[var(--glass-chrome-border)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_48%, var(--glass-mix-into))]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
  ],
  {
    variants: {
      size: {
        sm: "w-64",
        default: "w-72",
        lg: "w-80",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type { KanbanCard, KanbanColumn };

export interface KanbanProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof kanbanVariants> {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardsChange?: (cards: KanbanCard[]) => void;
  renderCard?: (card: KanbanCard) => ReactNode;
  columnHeight?: number | string;
  disabled?: boolean;
}

const Kanban = forwardRef<HTMLDivElement, KanbanProps>(
  (
    {
      className,
      size,
      columns,
      cards,
      onCardsChange,
      renderCard,
      columnHeight = 420,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [overColumn, setOverColumn] = useState<string | null>(null);
    const grouped = useMemo(
      () => groupKanbanCards(cards, columns),
      [cards, columns],
    );
    const height =
      typeof columnHeight === "number" ? `${columnHeight}px` : columnHeight;

    const gap = size === "sm" ? 2 : size === "lg" ? 4 : 3;

    const move = (cardId: string, toColumnId: string, toIndex?: number) => {
      if (disabled) return;
      const next = moveKanbanCard(cards, cardId, toColumnId, toIndex);
      onCardsChange?.(next);
    };

    const onDragStart = (e: DragEvent, cardId: string) => {
      if (disabled) return;
      e.dataTransfer.setData("text/kanban-card", cardId);
      e.dataTransfer.effectAllowed = "move";
      setDraggingId(cardId);
    };

    const onDropColumn = (e: DragEvent, columnId: string) => {
      e.preventDefault();
      const cardId =
        e.dataTransfer.getData("text/kanban-card") || draggingId || "";
      if (cardId) move(cardId, columnId);
      setDraggingId(null);
      setOverColumn(null);
    };

    return (
      <Flex
        ref={ref as React.Ref<HTMLElement>}
        gap={gap as 2 | 3 | 4}
        data-slot="kanban"
        className={cn(kanbanVariants({ size }), className)}
        {...props}
      >
        {columns.map((column) => {
          const columnCards = grouped[column.id] ?? [];
          const isOver = overColumn === column.id;
          return (
            <Stack
              as="section"
              key={column.id}
              gap={0}
              data-slot="kanban-column"
              data-column-id={column.id}
              className={cn(
                columnVariants({ size }),
                isOver && "ring-2 ring-primary/30",
              )}
              onDragOver={(e) => {
                if (disabled) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setOverColumn(column.id);
              }}
              onDragLeave={() => {
                setOverColumn((c) => (c === column.id ? null : c));
              }}
              onDrop={(e) => onDropColumn(e, column.id)}
            >
              <Split
                as="header"
                align="start"
                gap={2}
                wrap={false}
                className="border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_55%,transparent)] px-3 py-2.5"
              >
                <Stack gap={0.5} className="min-w-0">
                  <Box as="h3" className="truncate text-sm font-semibold">
                    {column.title}
                  </Box>
                  {column.description ? (
                    <Box as="p" className="truncate text-xs glass-chrome-text-muted">
                      {column.description}
                    </Box>
                  ) : null}
                </Stack>
                <Badge variant="secondary" className="tabular-nums">
                  {columnCards.length}
                </Badge>
              </Split>
              <ScrollArea style={{ height }} className="w-full">
                <Stack as="ul" gap={2} className="p-2">
                  {columnCards.map((card, index) => (
                    <Box as="li" key={card.id}>
                      <Stack
                        as="article"
                        gap={1}
                        draggable={!disabled}
                        data-slot="kanban-card"
                        data-card-id={card.id}
                        className={cn(
                          "rounded-xl border border-[var(--glass-chrome-border)] p-3",
                          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_70%, var(--glass-mix-into))]",
                          "shadow-[var(--glass-chrome-inset)]",
                          "transition-[opacity,transform,box-shadow]",
                          !disabled && "cursor-grab active:cursor-grabbing",
                          draggingId === card.id && "opacity-50",
                          focusRing,
                        )}
                        onDragStart={(e) => onDragStart(e, card.id)}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setOverColumn(null);
                        }}
                        onDragOver={(e) => {
                          if (disabled) return;
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const cardId =
                            e.dataTransfer.getData("text/kanban-card") ||
                            draggingId ||
                            "";
                          if (cardId) move(cardId, column.id, index);
                          setDraggingId(null);
                          setOverColumn(null);
                        }}
                      >
                        {renderCard ? (
                          renderCard(card)
                        ) : (
                          <>
                            <Box className="text-sm font-semibold leading-snug">
                              {card.title}
                            </Box>
                            {card.description ? (
                              <Box as="p" className="text-xs glass-chrome-text-muted">
                                {card.description}
                              </Box>
                            ) : null}
                            {card.labels && card.labels.length > 0 ? (
                              <Cluster gap={1} className="mt-1">
                                {card.labels.map((label) => (
                                  <Badge
                                    key={label}
                                    variant="outline"
                                    className="text-[10px]"
                                  >
                                    {label}
                                  </Badge>
                                ))}
                              </Cluster>
                            ) : null}
                          </>
                        )}
                      </Stack>
                    </Box>
                  ))}
                  {columnCards.length === 0 ? (
                    <Box
                      as="li"
                      className="rounded-xl border border-dashed border-[var(--glass-chrome-border)] px-3 py-8 text-center text-xs glass-chrome-text-muted"
                    >
                      Drop cards here
                    </Box>
                  ) : null}
                </Stack>
              </ScrollArea>
            </Stack>
          );
        })}
      </Flex>
    );
  },
);
Kanban.displayName = "Kanban";

export { Kanban, kanbanVariants, columnVariants };
