"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./dialog";
import {
  filterItems,
  type FilterableItem,
} from "./filter-items";
import {
  orderCommandItemsByGroup,
  type CommandGroupBucket,
} from "./command-utils";

export type CommandItemData = FilterableItem & {
  description?: string;
  shortcut?: string;
  icon?: ReactNode;
  onSelect?: () => void;
  group?: string;
};

type CommandContextValue = {
  query: string;
  setQuery: (query: string) => void;
  /** Items in keyboard + paint order (group-bucketed flat list). */
  orderedItems: CommandItemData[];
  groups: CommandGroupBucket<CommandItemData>[];
  highlight: number;
  setHighlight: (index: number) => void;
  runItem: (item: CommandItemData) => void;
  listId: string;
};

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommandContext() {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error("Command components must be used within <Command>");
  }
  return ctx;
}

const commandVariants = cva(
  [
    "flex w-full flex-col overflow-hidden rounded-2xl border text-sm",
    "border-[var(--glass-chrome-border)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_78%,transparent)]",
    "text-[var(--glass-chrome-fg)]",
    "shadow-[var(--glass-chrome-shadow)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
  ],
  {
    variants: {
      variant: {
        chrome: "",
        elevated: [
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_58%,transparent)]",
          "text-foreground",
        ],
        outline: [
          "bg-[color-mix(in_oklch,var(--background)_92%,transparent)]",
          "text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface CommandProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof commandVariants> {
  items: CommandItemData[];
  value?: string;
  onValueChange?: (query: string) => void;
  onItemSelect?: (item: CommandItemData) => void;
  emptyMessage?: string;
}

const Command = forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      className,
      variant,
      items,
      value,
      onValueChange,
      onItemSelect,
      emptyMessage = "No results found.",
      children,
      ...props
    },
    ref,
  ) => {
    const listId = useId();
    const [uncontrolledQuery, setUncontrolledQuery] = useState("");
    const [highlight, setHighlight] = useState(0);

    const query = value !== undefined ? value : uncontrolledQuery;
    const setQuery = useCallback(
      (next: string) => {
        if (value === undefined) {
          setUncontrolledQuery(next);
        }
        onValueChange?.(next);
        setHighlight(0);
      },
      [onValueChange, value],
    );

    const filtered = useMemo(() => filterItems(items, query), [items, query]);
    const ordered = useMemo(
      () => orderCommandItemsByGroup(filtered),
      [filtered],
    );
    const orderedItems = ordered.flat;
    const groups = ordered.groups;

    useEffect(() => {
      if (highlight >= orderedItems.length) {
        setHighlight(0);
      }
    }, [orderedItems.length, highlight]);

    const runItem = useCallback(
      (item: CommandItemData) => {
        if (item.disabled) {
          return;
        }
        item.onSelect?.();
        onItemSelect?.(item);
      },
      [onItemSelect],
    );

    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlight((index) =>
          orderedItems.length === 0 ? 0 : (index + 1) % orderedItems.length,
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((index) =>
          orderedItems.length === 0
            ? 0
            : (index - 1 + orderedItems.length) % orderedItems.length,
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        const item = orderedItems[highlight];
        if (item) {
          runItem(item);
        }
      }
    };

    const ctx: CommandContextValue = {
      query,
      setQuery,
      orderedItems,
      groups,
      highlight,
      setHighlight,
      runItem,
      listId,
    };

    return (
      <CommandContext.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="command"
          className={cn(commandVariants({ variant, className }))}
          onKeyDown={onKeyDown}
          {...props}
        >
          {children ?? (
            <>
              <CommandInput placeholder="Type a command or search…" />
              <CommandList emptyMessage={emptyMessage} />
            </>
          )}
        </div>
      </CommandContext.Provider>
    );
  },
);
Command.displayName = "Command";

export type CommandInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
>;

const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => {
    const { query, setQuery, listId } = useCommandContext();
    return (
      <div
        data-slot="command-input-wrap"
        className="flex items-center gap-2 border-b border-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)] px-3"
      >
        <SearchIcon className="size-4 shrink-0 opacity-60" />
        <input
          ref={ref}
          data-slot="command-input"
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={cn(
            "h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
            focusRing,
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
CommandInput.displayName = "CommandInput";

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {
  emptyMessage?: string;
}

const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, emptyMessage = "No results found.", ...props }, ref) => {
    const { orderedItems, groups, highlight, setHighlight, runItem, listId } =
      useCommandContext();

    let runningIndex = -1;

    return (
      <div
        ref={ref}
        id={listId}
        role="listbox"
        data-slot="command-list"
        className={cn("max-h-72 overflow-y-auto p-1", className)}
        {...props}
      >
        {orderedItems.length === 0 ? (
          <div
            data-slot="command-empty"
            className="px-3 py-8 text-center text-sm text-muted-foreground"
          >
            {emptyMessage}
          </div>
        ) : (
          groups.map(({ key: group, items: groupItems }) => (
            <div key={group || "default"} data-slot="command-group">
              {group ? (
                <div
                  data-slot="command-group-heading"
                  className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide glass-chrome-text-muted"
                >
                  {group}
                </div>
              ) : null}
              {groupItems.map((item) => {
                runningIndex += 1;
                const index = runningIndex;
                const active = index === highlight;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    data-slot="command-item"
                    data-highlighted={active || undefined}
                    disabled={item.disabled}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm outline-none",
                      "transition-colors duration-[var(--duration-fast)]",
                      "disabled:pointer-events-none disabled:opacity-50",
                      active &&
                        "bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)]",
                      focusRing,
                    )}
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => runItem(item)}
                  >
                    {item.icon ? (
                      <span className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    {item.shortcut ? (
                      <kbd className="ml-auto text-[10px] tracking-widest glass-chrome-text-muted">
                        {item.shortcut}
                      </kbd>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    );
  },
);
CommandList.displayName = "CommandList";

export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: CommandItemData[];
  title?: string;
  description?: string;
  onItemSelect?: (item: CommandItemData) => void;
  emptyMessage?: string;
  className?: string;
  children?: ReactNode;
}

function CommandDialog({
  open,
  onOpenChange,
  items,
  title = "Command palette",
  description = "Search for a command to run…",
  onItemSelect,
  emptyMessage,
  className,
  children,
}: CommandDialogProps) {
  const handleSelect = (item: CommandItemData) => {
    onItemSelect?.(item);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        size="default"
        className={cn("overflow-hidden p-0 gap-0 sm:max-w-lg", className)}
        data-slot="command-dialog-content"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command
          items={items}
          onItemSelect={handleSelect}
          emptyMessage={emptyMessage}
          className="rounded-2xl border-0 shadow-none"
        >
          {children ?? (
            <>
              <CommandInput placeholder={description} />
              <CommandList emptyMessage={emptyMessage} />
            </>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandDialog,
  commandVariants,
  filterItems,
  orderCommandItemsByGroup,
};
