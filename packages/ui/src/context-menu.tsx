"use client";

import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = ContextMenuPrimitive.Group;
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

const contextMenuContentVariants = cva(
  [
    "z-[var(--z-dropdown)] min-w-[10rem] overflow-hidden rounded-xl p-1",
    "border backdrop-blur-[var(--glass-chrome-blur)]",
    "shadow-[var(--glass-chrome-shadow)]",
    "text-sm",
    "data-[state=open]:animate-scale-in",
    "data-[state=closed]:pointer-events-none",
    "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97]",
    "transition-[opacity,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "origin-[var(--radix-context-menu-content-transform-origin)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_78%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
        ],
        elevated: [
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_85%,transparent)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_58%,transparent)]",
          "text-foreground",
        ],
        outline: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--background)_90%,transparent)]",
          "text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface ContextMenuContentProps
  extends ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>,
    VariantProps<typeof contextMenuContentVariants> {}

const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, variant, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      data-slot="context-menu-content"
      className={cn(contextMenuContentVariants({ variant, className }))}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const contextMenuItemVariants = cva(
  [
    "relative flex cursor-default select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none",
    "transition-[background,color] duration-[var(--duration-fast)] [transition-timing-function:var(--ease-default)]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    focusRing,
  ],
  {
    variants: {
      inset: {
        true: "pl-8",
        false: "",
      },
      destructive: {
        true: "text-destructive focus:bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)] focus:text-destructive",
        false:
          "focus:bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)] focus:text-foreground",
      },
    },
    defaultVariants: {
      inset: false,
      destructive: false,
    },
  },
);

export interface ContextMenuItemProps
  extends ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    VariantProps<typeof contextMenuItemVariants> {}

const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, inset, destructive, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    data-slot="context-menu-item"
    className={cn(contextMenuItemVariants({ inset, destructive, className }))}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="context-menu-checkbox-item"
    className={cn(contextMenuItemVariants({ inset: true }), className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    data-slot="context-menu-radio-item"
    className={cn(contextMenuItemVariants({ inset: true }), className)}
    {...props}
  >
    <span className="absolute left-2 flex size-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CircleIcon />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

const ContextMenuLabel = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    data-slot="context-menu-label"
    className={cn(
      "px-2.5 py-1.5 text-xs font-semibold glass-chrome-text-muted",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    data-slot="context-menu-separator"
    className={cn(
      "my-1 h-px bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
      className,
    )}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

function ContextMenuShortcut({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ml-auto text-[10px] tracking-widest glass-chrome-text-muted",
        className,
      )}
      {...props}
    />
  );
}

const ContextMenuSubTrigger = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="context-menu-sub-trigger"
    className={cn(
      contextMenuItemVariants({ inset }),
      "data-[state=open]:bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)]",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto size-4 opacity-70" />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

export interface ContextMenuSubContentProps
  extends ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>,
    VariantProps<typeof contextMenuContentVariants> {}

const ContextMenuSubContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuSubContentProps
>(({ className, variant, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    data-slot="context-menu-sub-content"
    className={cn(
      contextMenuContentVariants({ variant }),
      "min-w-[8.5rem]",
      className,
    )}
    {...props}
  />
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

function CheckIcon() {
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
      className="size-3.5"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-2"
    >
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  contextMenuContentVariants,
  contextMenuItemVariants,
};
