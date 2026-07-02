"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  DialogOverlay,
  type DialogOverlayBlur,
  type DialogOverlayDim,
} from "./dialog";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const sheetContentVariants = cva(
  [
    "fixed z-[calc(var(--z-modal)+1)] flex flex-col gap-4 p-6 text-foreground",
    "data-[state=closed]:opacity-0",
    "transition-[opacity,transform,filter] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "focus:outline-none",
  ],
  {
    variants: {
      variant: {
        chrome: "glass-dialog",
        elevated: "glass-dialog-elevated",
        outline: [
          "border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--background)_88%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
      },
      side: {
        top: [
          "inset-x-0 top-0 rounded-b-2xl border-b",
          "data-[state=open]:animate-sheet-slide-in-top",
          "data-[state=closed]:-translate-y-full data-[state=closed]:blur-sm",
        ],
        bottom: [
          "inset-x-0 bottom-0 rounded-t-2xl border-t",
          "data-[state=open]:animate-sheet-slide-in-bottom",
          "data-[state=closed]:translate-y-full data-[state=closed]:blur-sm",
        ],
        left: [
          "inset-y-0 left-0 h-full rounded-r-2xl border-r",
          "data-[state=open]:animate-sheet-slide-in-left",
          "data-[state=closed]:-translate-x-full data-[state=closed]:blur-sm",
        ],
        right: [
          "inset-y-0 right-0 h-full rounded-l-2xl border-l",
          "data-[state=open]:animate-sheet-slide-in-right",
          "data-[state=closed]:translate-x-full data-[state=closed]:blur-sm",
        ],
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        full: "",
      },
    },
    compoundVariants: [
      { side: ["left", "right"], size: "sm", className: "w-3/4 max-w-sm" },
      { side: ["left", "right"], size: "default", className: "w-3/4 max-w-md" },
      { side: ["left", "right"], size: "lg", className: "w-3/4 max-w-lg" },
      { side: ["left", "right"], size: "full", className: "w-full max-w-none" },
      { side: ["top", "bottom"], size: "sm", className: "h-auto max-h-[40%]" },
      { side: ["top", "bottom"], size: "default", className: "h-auto max-h-[50%]" },
      { side: ["top", "bottom"], size: "lg", className: "h-auto max-h-[65%]" },
      { side: ["top", "bottom"], size: "full", className: "h-full max-h-none" },
    ],
    defaultVariants: {
      variant: "chrome",
      side: "right",
      size: "default",
    },
  },
);

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetContentVariants> {
  showClose?: boolean;
  overlayClassName?: string;
  overlayBlur?: DialogOverlayBlur;
  overlayDim?: DialogOverlayDim;
  overlayBlurAmount?: string;
  overlayDimAmount?: number;
  closeClassName?: string;
  closeIcon?: ReactNode;
  closeLabel?: string;
}

function SheetCloseIcon() {
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
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const SheetContent = forwardRef<
  ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      className,
      variant,
      side,
      size,
      children,
      showClose = true,
      overlayClassName,
      overlayBlur,
      overlayDim,
      overlayBlurAmount,
      overlayDimAmount,
      closeClassName,
      closeIcon,
      closeLabel = "Close",
      ...props
    },
    ref,
  ) => (
    <SheetPortal>
      <DialogOverlay
        blur={overlayBlur}
        dim={overlayDim}
        blurAmount={overlayBlurAmount}
        dimAmount={overlayDimAmount}
        className={overlayClassName}
      />
      <SheetPrimitive.Content
        ref={ref}
        data-slot="sheet-content"
        className={cn(sheetContentVariants({ variant, side, size, className }))}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            className={cn(
              "absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full",
              "glass-chrome glass-chrome-interactive glass-chrome-text",
              "transition-[transform,box-shadow,background] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
              "[&_svg]:size-4",
              focusRing,
              closeClassName,
            )}
            aria-label={closeLabel}
          >
            {closeIcon ?? <SheetCloseIcon />}
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>;

const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 pr-8 text-left", className)}
      {...props}
    />
  ),
);
SheetHeader.displayName = "SheetHeader";

export type SheetFooterProps = HTMLAttributes<HTMLDivElement>;

const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  ),
);
SheetFooter.displayName = "SheetFooter";

export type SheetTitleProps = ComponentPropsWithoutRef<typeof SheetPrimitive.Title>;

const SheetTitle = forwardRef<
  ElementRef<typeof SheetPrimitive.Title>,
  SheetTitleProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

export type SheetDescriptionProps = ComponentPropsWithoutRef<
  typeof SheetPrimitive.Description
>;

const SheetDescription = forwardRef<
  ElementRef<typeof SheetPrimitive.Description>,
  SheetDescriptionProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetContentVariants,
};