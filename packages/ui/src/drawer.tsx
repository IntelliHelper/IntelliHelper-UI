"use client";

import { DrawerCloseIcon } from "./icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn, focusRing } from "@intelli/utils";
import {
  type DialogOverlayBlur,
  type DialogOverlayDim,
} from "./dialog";

const Drawer = ({
  shouldScaleBackground = false,
  ...props
}: ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    data-slot="drawer"
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;
const DrawerNestedRoot = DrawerPrimitive.NestedRoot;

function getOverlayStyle({
  blurAmount,
  dimAmount,
  style,
}: {
  blurAmount?: string;
  dimAmount?: number;
  style?: CSSProperties;
}): CSSProperties | undefined {
  if (!blurAmount && dimAmount === undefined && !style) {
    return undefined;
  }

  return {
    ...(blurAmount
      ? {
          backdropFilter: `blur(${blurAmount}) saturate(var(--glass-saturation))`,
          WebkitBackdropFilter: `blur(${blurAmount}) saturate(var(--glass-saturation))`,
        }
      : {}),
    ...(dimAmount !== undefined
      ? {
          backgroundColor: `color-mix(in oklch, black ${dimAmount}%, transparent)`,
        }
      : {}),
    ...style,
  };
}

const drawerOverlayVariants = cva(
  "fixed inset-0 z-[var(--z-modal)]",
  {
    variants: {
      blur: {
        none: "backdrop-blur-none",
        sm: "backdrop-blur-sm",
        default: "backdrop-blur-[var(--glass-chrome-blur)]",
        lg: "backdrop-blur-lg",
        xl: "backdrop-blur-xl",
        heavy: "backdrop-blur-2xl",
      },
      dim: {
        none: "bg-transparent",
        light: "bg-[color-mix(in_oklch,black_12%,transparent)]",
        default: "bg-[color-mix(in_oklch,black_22%,transparent)]",
        heavy: "bg-[color-mix(in_oklch,black_45%,transparent)]",
      },
    },
    defaultVariants: {
      blur: "default",
      dim: "default",
    },
  },
);

export interface DrawerOverlayProps
  extends ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>,
    VariantProps<typeof drawerOverlayVariants> {
  blurAmount?: string;
  dimAmount?: number;
}

const DrawerOverlay = forwardRef<
  ElementRef<typeof DrawerPrimitive.Overlay>,
  DrawerOverlayProps
>(
  (
    { className, blur, dim, blurAmount, dimAmount, style, ...props },
    ref,
  ) => (
    <DrawerPrimitive.Overlay
      ref={ref}
      data-slot="drawer-overlay"
      className={cn(
        drawerOverlayVariants({
          blur: blurAmount ? undefined : blur,
          dim: dimAmount !== undefined ? undefined : dim,
        }),
        className,
      )}
      style={getOverlayStyle({ blurAmount, dimAmount, style })}
      {...props}
    />
  ),
);
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const drawerContentVariants = cva(
  [
    "group/drawer-content fixed z-[calc(var(--z-modal)+1)] flex h-auto flex-col gap-4 p-6 text-foreground",
    "outline-none",
    focusRing,
    "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:rounded-b-2xl data-[vaul-drawer-direction=top]:border-b",
    "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:border-t",
    "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:h-full data-[vaul-drawer-direction=left]:rounded-r-2xl data-[vaul-drawer-direction=left]:border-r",
    "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:rounded-l-2xl data-[vaul-drawer-direction=right]:border-l",
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
      size: {
        sm: [
          "data-[vaul-drawer-direction=top]:max-h-[40%] data-[vaul-drawer-direction=bottom]:max-h-[40%]",
          "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:max-w-sm",
          "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:max-w-sm",
        ],
        default: [
          "data-[vaul-drawer-direction=top]:max-h-[50%] data-[vaul-drawer-direction=bottom]:max-h-[50%]",
          "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:max-w-md",
          "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:max-w-md",
        ],
        lg: [
          "data-[vaul-drawer-direction=top]:max-h-[65%] data-[vaul-drawer-direction=bottom]:max-h-[65%]",
          "data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:max-w-lg",
          "data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:max-w-lg",
        ],
        full: [
          "data-[vaul-drawer-direction=top]:h-full data-[vaul-drawer-direction=top]:max-h-none",
          "data-[vaul-drawer-direction=bottom]:h-full data-[vaul-drawer-direction=bottom]:max-h-none",
          "data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:max-w-none",
          "data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:max-w-none",
        ],
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
    },
  },
);

export interface DrawerContentProps
  extends ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {
  showHandle?: boolean;
  showClose?: boolean;
  overlayClassName?: string;
  overlayBlur?: DialogOverlayBlur;
  overlayDim?: DialogOverlayDim;
  overlayBlurAmount?: string;
  overlayDimAmount?: number;
  closeClassName?: string;
  closeIcon?: ReactNode;
  closeLabel?: string;
  handleClassName?: string;
}

const DrawerContent = forwardRef<
  ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      variant,
      size,
      children,
      showHandle = true,
      showClose = false,
      overlayClassName,
      overlayBlur,
      overlayDim,
      overlayBlurAmount,
      overlayDimAmount,
      closeClassName,
      closeIcon,
      closeLabel = "Close",
      handleClassName,
      onOpenAutoFocus,
      ...props
    },
    ref,
  ) => (
    <DrawerPortal>
      <DrawerOverlay
        blur={overlayBlur}
        dim={overlayDim}
        blurAmount={overlayBlurAmount}
        dimAmount={overlayDimAmount}
        className={overlayClassName}
      />
      <DrawerPrimitive.Content
        ref={ref}
        data-slot="drawer-content"
        data-show-close={showClose ? "" : undefined}
        className={cn(drawerContentVariants({ variant, size, className }))}
        {...props}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          const target = event.currentTarget;
          if (target instanceof HTMLElement) {
            target.focus();
          }
        }}
      >
        {showHandle ? <DrawerHandle className={handleClassName} /> : null}
        {children}
        {showClose ? (
          <DrawerPrimitive.Close
            data-slot="drawer-close"
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
            {closeIcon ?? <DrawerCloseIcon />}
          </DrawerPrimitive.Close>
        ) : null}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  ),
);
DrawerContent.displayName = DrawerPrimitive.Content.displayName;

export type DrawerHandleProps = ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Handle
>;

const DrawerHandle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Handle>,
  DrawerHandleProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Handle
    ref={ref}
    data-slot="drawer-handle"
    className={cn(
      "!mx-auto !h-1.5 !w-[100px] shrink-0 !rounded-full",
      "!bg-[color-mix(in_oklch,var(--foreground)_18%,transparent)]",
      "group-data-[vaul-drawer-direction=left]/drawer-content:!hidden",
      "group-data-[vaul-drawer-direction=right]/drawer-content:!hidden",
      "group-data-[vaul-drawer-direction=top]/drawer-content:order-last group-data-[vaul-drawer-direction=top]/drawer-content:mt-auto",
      className,
    )}
    {...props}
  />
));
DrawerHandle.displayName = "DrawerHandle";

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1.5 text-left",
        "group-data-[show-close]/drawer-content:pr-8",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center",
        "group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
        "sm:text-left",
        className,
      )}
      {...props}
    />
  ),
);
DrawerHeader.displayName = "DrawerHeader";

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  ),
);
DrawerFooter.displayName = "DrawerFooter";

export type DrawerTitleProps = ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Title
>;

const DrawerTitle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    data-slot="drawer-title"
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

export type DrawerDescriptionProps = ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Description
>;

const DrawerDescription = forwardRef<
  ElementRef<typeof DrawerPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    data-slot="drawer-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerNestedRoot,
  DrawerContent,
  DrawerHandle,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  drawerContentVariants,
};
