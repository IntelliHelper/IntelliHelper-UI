"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const floatingWidgetTriggerVariants = cva(
  [
    "group z-[var(--z-toast)] inline-flex shrink-0 items-center justify-center rounded-full",
    "shadow-[var(--glass-chrome-shadow)]",
    "transition-[transform,box-shadow,background,opacity] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "data-[state=open]:scale-95",
    focusRing,
  ],
  {
    variants: {
      variant: {
        chrome: "glass-chrome glass-chrome-interactive",
        primary: [
          "glass-button-content glass-chrome-interactive",
          "hover:brightness-105",
        ],
        ghost: "glass-button-ghost glass-chrome-interactive",
      },
      size: {
        sm: "size-11 [&_svg]:size-4",
        default: "size-12 [&_svg]:size-5",
        lg: "size-14 [&_svg]:size-6",
      },
      position: {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
      },
      scope: {
        viewport: "fixed",
        container: "absolute",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      position: "bottom-right",
      scope: "viewport",
    },
  },
);

type FloatingWidgetPosition = NonNullable<
  VariantProps<typeof floatingWidgetTriggerVariants>["position"]
>;
type FloatingWidgetScope = NonNullable<
  VariantProps<typeof floatingWidgetTriggerVariants>["scope"]
>;

type FloatingWidgetContextValue = {
  position: FloatingWidgetPosition;
  scope: FloatingWidgetScope;
};

const FloatingWidgetContext = createContext<FloatingWidgetContextValue>({
  position: "bottom-right",
  scope: "viewport",
});

function useFloatingWidget() {
  return useContext(FloatingWidgetContext);
}

const FloatingWidget = ({
  modal = false,
  position = "bottom-right",
  scope = "viewport",
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Root> & {
  position?: FloatingWidgetPosition;
  scope?: FloatingWidgetScope;
}) => {
  const value = useMemo(() => ({ position, scope }), [position, scope]);

  return (
    <FloatingWidgetContext.Provider value={value}>
      <DialogPrimitive.Root data-slot="floating-widget" modal={modal} {...props} />
    </FloatingWidgetContext.Provider>
  );
};

const FloatingWidgetPortal = DialogPrimitive.Portal;
const FloatingWidgetClose = DialogPrimitive.Close;

function MessageIcon() {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function CloseIcon() {
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

export interface FloatingWidgetTriggerProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
    Omit<VariantProps<typeof floatingWidgetTriggerVariants>, "position" | "scope"> {
  asChild?: boolean;
  label?: string;
  closeLabel?: string;
  icon?: ReactNode;
  closeIcon?: ReactNode;
  badge?: ReactNode;
  badgeClassName?: string;
}

const FloatingWidgetTrigger = forwardRef<
  ElementRef<typeof DialogPrimitive.Trigger>,
  FloatingWidgetTriggerProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      label = "Open feedback",
      closeLabel = "Close feedback",
      icon,
      closeIcon,
      badge,
      badgeClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const { position, scope } = useFloatingWidget();

    if (asChild) {
      return (
        <DialogPrimitive.Trigger
          ref={ref}
          data-slot="floating-widget-trigger"
          asChild
          className={cn(
            floatingWidgetTriggerVariants({
              variant,
              size,
              position,
              scope,
              className,
            }),
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Trigger>
      );
    }

    return (
      <DialogPrimitive.Trigger
        ref={ref}
        data-slot="floating-widget-trigger"
        className={cn(
          floatingWidgetTriggerVariants({
            variant,
            size,
            position,
            scope,
            className,
          }),
        )}
        {...(children ? {} : { "aria-label": label })}
        {...props}
      >
        {children ?? (
          <>
            <span className="flex items-center justify-center group-data-[state=open]:hidden">
              {icon ?? <MessageIcon />}
            </span>
            <span className="hidden items-center justify-center group-data-[state=open]:flex">
              {closeIcon ?? <CloseIcon />}
            </span>
            {badge != null && badge !== "" ? (
              <span
                data-slot="floating-widget-badge"
                className={cn(
                  "absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full px-1",
                  "border border-[color-mix(in_oklch,var(--destructive)_40%,transparent)]",
                  "bg-[color-mix(in_oklch,var(--destructive)_88%,transparent)]",
                  "text-[10px] font-semibold leading-none text-white",
                  "shadow-[0_2px_8px_color-mix(in_oklch,black_20%,transparent)]",
                  "group-data-[state=open]:hidden",
                  badgeClassName,
                )}
              >
                {badge}
              </span>
            ) : null}
            <span className="sr-only">
              <span className="group-data-[state=open]:hidden">{label}</span>
              <span className="hidden group-data-[state=open]:inline">{closeLabel}</span>
            </span>
          </>
        )}
      </DialogPrimitive.Trigger>
    );
  },
);
FloatingWidgetTrigger.displayName = "FloatingWidgetTrigger";

const floatingWidgetOverlayVariants = cva(
  [
    "inset-0 z-[calc(var(--z-toast)-1)]",
    "data-[state=open]:animate-fade-in",
    "data-[state=closed]:opacity-0",
    "transition-opacity duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
  ],
  {
    variants: {
      dim: {
        none: "pointer-events-none bg-transparent",
        light: "bg-[color-mix(in_oklch,black_10%,transparent)]",
        default: "bg-[color-mix(in_oklch,black_18%,transparent)]",
      },
      scope: {
        viewport: "fixed",
        container: "absolute",
      },
    },
    defaultVariants: {
      dim: "none",
      scope: "viewport",
    },
  },
);

export interface FloatingWidgetOverlayProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
    Omit<VariantProps<typeof floatingWidgetOverlayVariants>, "scope"> {}

const FloatingWidgetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  FloatingWidgetOverlayProps
>(({ className, dim, ...props }, ref) => {
  const { scope } = useFloatingWidget();

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="floating-widget-overlay"
      className={cn(floatingWidgetOverlayVariants({ dim, scope, className }))}
      {...props}
    />
  );
});
FloatingWidgetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const floatingWidgetContentVariants = cva(
  [
    "z-[var(--z-toast)] flex w-full flex-col overflow-hidden text-foreground outline-none",
    "data-[state=closed]:scale-[0.96] data-[state=closed]:opacity-0 data-[state=closed]:blur-sm",
    "data-[state=open]:animate-glass-rise",
    "transition-[opacity,transform,filter] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
  ],
  {
    variants: {
      variant: {
        chrome: "glass-dialog rounded-2xl",
        elevated: "glass-dialog-elevated rounded-2xl",
        outline: [
          "rounded-2xl border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--background)_90%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
      },
      size: {
        sm: "max-w-[min(18rem,calc(100vw-2rem))] max-h-[min(24rem,70vh)]",
        default: "max-w-[min(22rem,calc(100vw-2rem))] max-h-[min(32rem,78vh)]",
        lg: "max-w-[min(26rem,calc(100vw-2rem))] max-h-[min(36rem,82vh)]",
      },
      position: {
        "bottom-right": "bottom-[4.75rem] right-4 origin-bottom-right",
        "bottom-left": "bottom-[4.75rem] left-4 origin-bottom-left",
        "top-right": "top-[4.75rem] right-4 origin-top-right",
        "top-left": "top-[4.75rem] left-4 origin-top-left",
      },
      scope: {
        viewport: "fixed",
        container: "absolute",
      },
    },
    defaultVariants: {
      variant: "chrome",
      size: "default",
      position: "bottom-right",
      scope: "viewport",
    },
  },
);

export interface FloatingWidgetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    Omit<VariantProps<typeof floatingWidgetContentVariants>, "position" | "scope"> {
  showClose?: boolean;
  overlay?: boolean;
  overlayDim?: VariantProps<typeof floatingWidgetOverlayVariants>["dim"];
  overlayClassName?: string;
  closeClassName?: string;
  closeIcon?: ReactNode;
  closeLabel?: string;
}

const FloatingWidgetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  FloatingWidgetContentProps
>(
  (
    {
      className,
      variant,
      size,
      children,
      showClose = true,
      overlay = false,
      overlayDim = "light",
      overlayClassName,
      closeClassName,
      closeIcon,
      closeLabel = "Close",
      onOpenAutoFocus,
      ...props
    },
    ref,
  ) => {
    const { position, scope } = useFloatingWidget();

    const content = (
      <>
        {overlay ? (
          <FloatingWidgetOverlay dim={overlayDim} className={overlayClassName} />
        ) : null}
        <DialogPrimitive.Content
          ref={ref}
          data-slot="floating-widget-content"
          className={cn(
            floatingWidgetContentVariants({
              variant,
              size,
              position,
              scope,
              className,
            }),
          )}
          onOpenAutoFocus={(event) => {
            if (onOpenAutoFocus) {
              onOpenAutoFocus(event);
              return;
            }
            // Keep bubble UX light — don't yank focus into the panel unless asked.
            event.preventDefault();
          }}
          {...props}
        >
          {children}
          {showClose ? (
            <DialogPrimitive.Close
              data-slot="floating-widget-close"
              className={cn(
                "absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full",
                "glass-chrome glass-chrome-interactive glass-chrome-text",
                "transition-[transform,box-shadow,background] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
                "[&_svg]:size-3.5",
                focusRing,
                closeClassName,
              )}
              aria-label={closeLabel}
            >
              {closeIcon ?? <CloseIcon />}
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Content>
      </>
    );

    // Container scope stays in the local stacking context (no body portal).
    if (scope === "container") {
      return content;
    }

    return <FloatingWidgetPortal>{content}</FloatingWidgetPortal>;
  },
);
FloatingWidgetContent.displayName = "FloatingWidgetContent";

export type FloatingWidgetHeaderProps = HTMLAttributes<HTMLDivElement>;

const FloatingWidgetHeader = forwardRef<HTMLDivElement, FloatingWidgetHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="floating-widget-header"
      className={cn(
        "flex shrink-0 flex-col gap-1 border-b border-[color-mix(in_oklch,var(--glass-border)_55%,transparent)] px-4 py-3.5 pr-12",
        className,
      )}
      {...props}
    />
  ),
);
FloatingWidgetHeader.displayName = "FloatingWidgetHeader";

export type FloatingWidgetTitleProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
>;

const FloatingWidgetTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  FloatingWidgetTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="floating-widget-title"
    className={cn("text-sm font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
FloatingWidgetTitle.displayName = DialogPrimitive.Title.displayName;

export type FloatingWidgetDescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

const FloatingWidgetDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  FloatingWidgetDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="floating-widget-description"
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
FloatingWidgetDescription.displayName = DialogPrimitive.Description.displayName;

export type FloatingWidgetBodyProps = HTMLAttributes<HTMLDivElement>;

const FloatingWidgetBody = forwardRef<HTMLDivElement, FloatingWidgetBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="floating-widget-body"
      className={cn("min-h-0 flex-1 overflow-y-auto px-4 py-3", className)}
      {...props}
    />
  ),
);
FloatingWidgetBody.displayName = "FloatingWidgetBody";

export type FloatingWidgetFooterProps = HTMLAttributes<HTMLDivElement>;

const FloatingWidgetFooter = forwardRef<HTMLDivElement, FloatingWidgetFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="floating-widget-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 border-t border-[color-mix(in_oklch,var(--glass-border)_55%,transparent)] px-4 py-3 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  ),
);
FloatingWidgetFooter.displayName = "FloatingWidgetFooter";

export {
  FloatingWidget,
  FloatingWidgetPortal,
  FloatingWidgetOverlay,
  FloatingWidgetClose,
  FloatingWidgetTrigger,
  FloatingWidgetContent,
  FloatingWidgetHeader,
  FloatingWidgetTitle,
  FloatingWidgetDescription,
  FloatingWidgetBody,
  FloatingWidgetFooter,
  floatingWidgetTriggerVariants,
  floatingWidgetContentVariants,
  floatingWidgetOverlayVariants,
};
