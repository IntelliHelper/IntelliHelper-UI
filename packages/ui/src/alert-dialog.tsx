"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";
import { buttonVariants, type ButtonProps } from "./button";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const alertDialogOverlayVariants = cva(
  [
    "fixed inset-0 z-[var(--z-modal)]",
    "data-[state=open]:animate-fade-in",
    "data-[state=closed]:opacity-0 data-[state=closed]:blur-sm",
    "transition-[opacity,filter] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
  ],
  {
    variants: {
      dim: {
        light: "bg-[color-mix(in_oklch,black_14%,transparent)]",
        default: "bg-[color-mix(in_oklch,black_28%,transparent)]",
        heavy: "bg-[color-mix(in_oklch,black_48%,transparent)]",
      },
      blur: {
        none: "backdrop-blur-none",
        default: "backdrop-blur-[var(--glass-chrome-blur)]",
        heavy: "backdrop-blur-xl",
      },
    },
    defaultVariants: {
      dim: "default",
      blur: "default",
    },
  },
);

export interface AlertDialogOverlayProps
  extends ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>,
    VariantProps<typeof alertDialogOverlayVariants> {}

const AlertDialogOverlay = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Overlay>,
  AlertDialogOverlayProps
>(({ className, dim, blur, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    data-slot="alert-dialog-overlay"
    className={cn(alertDialogOverlayVariants({ dim, blur, className }))}
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const alertDialogContentVariants = cva(
  [
    "fixed left-1/2 top-1/2 z-[calc(var(--z-modal)+1)] grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 p-6",
    "rounded-2xl text-foreground",
    "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.97] data-[state=closed]:blur-sm",
    "data-[state=open]:animate-glass-rise",
    "transition-[opacity,transform,filter] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "focus:outline-none",
  ],
  {
    variants: {
      variant: {
        chrome: "glass-dialog",
        elevated: "glass-dialog-elevated",
        destructive: [
          "glass-dialog",
          "border-[color-mix(in_oklch,var(--destructive)_35%,transparent)]",
          "shadow-[0_0_0_1px_color-mix(in_oklch,var(--destructive)_18%,transparent),var(--glass-chrome-shadow)]",
        ],
      },
      size: {
        sm: "max-w-sm",
        default: "max-w-md",
        lg: "max-w-lg",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

export interface AlertDialogContentProps
  extends ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
    VariantProps<typeof alertDialogContentVariants> {
  overlayClassName?: string;
  overlayDim?: VariantProps<typeof alertDialogOverlayVariants>["dim"];
  overlayBlur?: VariantProps<typeof alertDialogOverlayVariants>["blur"];
}

const AlertDialogContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(
  (
    {
      className,
      variant,
      size,
      overlayClassName,
      overlayDim,
      overlayBlur,
      ...props
    },
    ref,
  ) => (
    <AlertDialogPortal>
      <AlertDialogOverlay
        dim={overlayDim}
        blur={overlayBlur}
        className={overlayClassName}
      />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-slot="alert-dialog-content"
        className={cn(alertDialogContentVariants({ variant, size, className }))}
        {...props}
      />
    </AlertDialogPortal>
  ),
);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="alert-dialog-header"
    className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="alert-dialog-footer"
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

export interface AlertDialogActionProps
  extends ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  shape?: ButtonProps["shape"];
}

const AlertDialogAction = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Action>,
  AlertDialogActionProps
>(({ className, variant = "primary", size = "default", shape, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    data-slot="alert-dialog-action"
    className={cn(buttonVariants({ variant, size, shape, className }))}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export interface AlertDialogCancelProps
  extends ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  shape?: ButtonProps["shape"];
}

const AlertDialogCancel = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Cancel>,
  AlertDialogCancelProps
>(
  (
    { className, variant = "outline", size = "default", shape, ...props },
    ref,
  ) => (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant, size, shape, className }), "mt-0")}
      {...props}
    />
  ),
);
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  alertDialogContentVariants,
  alertDialogOverlayVariants,
};
