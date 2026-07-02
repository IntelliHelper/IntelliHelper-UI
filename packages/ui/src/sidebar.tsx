"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn, focusRing } from "@intelli/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TooltipContentProps,
} from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

function getSidebarCookie(): boolean | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${SIDEBAR_COOKIE_NAME}=([^;]*)`),
  );

  if (!match?.[1]) {
    return null;
  }

  return match[1] === "true";
}

function setSidebarCookie(open: boolean) {
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
}

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [openUncontrolled, setOpenUncontrolled] = useState(() => {
    if (openProp !== undefined) {
      return defaultOpen;
    }

    return getSidebarCookie() ?? defaultOpen;
  });

  const open = openProp ?? openUncontrolled;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value;
      if (onOpenChange) {
        onOpenChange(next);
      } else {
        setOpenUncontrolled(next);
      }

      setSidebarCookie(next);
    },
    [onOpenChange, open],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
      return;
    }
    setOpen((prev) => !prev);
  }, [isMobile, setOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const value = useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, openMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          data-state={state}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper min-h-svh w-full has-[[data-variant=inset]]:bg-background",
            className,
          )}
          {...props}
        >
          <div className="flex min-h-svh w-full min-w-0">{children}</div>
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

const sidebarVariants = cva(
  [
    "group/sidebar flex h-full flex-col text-foreground",
    "transition-[width,transform,opacity,box-shadow] duration-[var(--duration-slow)] [transition-timing-function:var(--ease-spring)]",
  ],
  {
    variants: {
      variant: {
        chrome: "glass-panel",
        elevated: "glass-header",
        outline: [
          "border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_38%,transparent)]",
          "backdrop-blur-[var(--glass-chrome-blur)]",
          "shadow-[var(--glass-chrome-shadow)]",
        ],
      },
      side: {
        left: "",
        right: "",
      },
      collapsible: {
        none: "w-[var(--sidebar-width)]",
        icon: "",
        offcanvas: "",
      },
    },
    compoundVariants: [
      {
        side: "left",
        collapsible: "offcanvas",
        className:
          "data-[state=collapsed]:-translate-x-full data-[state=expanded]:translate-x-0",
      },
      {
        side: "right",
        collapsible: "offcanvas",
        className:
          "data-[state=collapsed]:translate-x-full data-[state=expanded]:translate-x-0",
      },
    ],
    defaultVariants: {
      variant: "chrome",
      side: "left",
      collapsible: "icon",
    },
  },
);

export interface SidebarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  animated?: boolean;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      variant,
      side = "left",
      collapsible = "icon",
      animated = true,
      children,
      ...props
    },
    ref,
  ) => {
    const { state, openMobile, setOpenMobile, isMobile } = useSidebar();
    const currentState = isMobile ? (openMobile ? "expanded" : "collapsed") : state;

    if (collapsible === "none") {
      return (
        <aside
          ref={ref}
          data-slot="sidebar"
          data-state="expanded"
          data-variant={variant}
          data-side={side}
          data-collapsible={collapsible}
          className={cn(
            sidebarVariants({ variant, side, collapsible }),
            animated && "animate-sidebar-slide-in",
            "w-[var(--sidebar-width)] shrink-0 rounded-2xl",
            className,
          )}
          {...props}
        >
          {children}
        </aside>
      );
    }

    if (isMobile) {
      return (
        <>
          <div
            data-slot="sidebar-overlay"
            data-state={openMobile ? "open" : "closed"}
            className={cn(
              "fixed inset-0 z-[calc(var(--z-modal)-1)] md:hidden",
              "bg-[color-mix(in_oklch,black_22%,transparent)] backdrop-blur-[var(--glass-chrome-blur)]",
              "data-[state=open]:animate-fade-in",
              "data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0",
              "transition-opacity duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
            )}
            onClick={() => setOpenMobile(false)}
            aria-hidden="true"
          />
          <aside
            ref={ref}
            data-slot="sidebar"
            data-state={currentState}
            data-variant={variant}
            data-side={side}
            data-collapsible={collapsible}
            data-mobile="true"
            className={cn(
              sidebarVariants({ variant, side, collapsible: "offcanvas" }),
              "fixed inset-y-0 z-[var(--z-modal)] w-[var(--sidebar-width)] p-2 md:hidden",
              side === "left" ? "left-0" : "right-0",
              side === "left"
                ? openMobile
                  ? "animate-sidebar-slide-in"
                  : "-translate-x-full opacity-0"
                : openMobile
                  ? "animate-sidebar-slide-in"
                  : "translate-x-full opacity-0",
              className,
            )}
            {...props}
          >
            <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl">
              {children}
            </div>
          </aside>
        </>
      );
    }

    return (
      <aside
        ref={ref}
        data-slot="sidebar"
        data-state={currentState}
        data-variant={variant}
        data-side={side}
        data-collapsible={collapsible}
        className={cn(
          sidebarVariants({ variant, side, collapsible }),
          animated && currentState === "expanded" && "animate-sidebar-slide-in",
          "hidden shrink-0 overflow-hidden md:flex",
          collapsible === "icon"
            ? currentState === "collapsed"
              ? "w-[var(--sidebar-width-icon)]"
              : "w-[var(--sidebar-width)]"
            : currentState === "collapsed"
              ? "w-0 opacity-0"
              : "w-[var(--sidebar-width)]",
          "rounded-2xl",
          className,
        )}
        {...props}
      >
        <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl">
          {children}
        </div>
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithoutRef<"button">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      data-slot="sidebar-trigger"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full",
        "glass-chrome glass-chrome-interactive glass-chrome-text",
        "transition-[transform,box-shadow] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
        "[&_svg]:size-4",
        focusRing,
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <SidebarPanelIcon />
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

function SidebarPanelIcon() {
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

const SidebarRail = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-rail"
        aria-label="Toggle sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-[opacity,background]",
          "duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
          "after:absolute after:inset-y-0 after:left-1/2 after:w-[2px]",
          "group-data-[side=left]/sidebar:-right-4 group-data-[side=right]/sidebar:left-0",
          "hover:after:bg-[color-mix(in_oklch,var(--primary)_45%,transparent)]",
          "group-data-[collapsible=offcanvas]/sidebar:translate-x-0 group-data-[collapsible=offcanvas]/sidebar:after:left-full",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          "md:flex",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      data-slot="sidebar-inset"
      className={cn(
        "relative flex min-h-0 min-w-0 flex-1 flex-col bg-background",
        "transition-[margin,padding] duration-[var(--duration-slow)] [transition-timing-function:var(--ease-default)]",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]",
        className,
      )}
      {...props}
    />
  ),
);
SidebarInset.displayName = "SidebarInset";

const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-header"
      className={cn(
        "flex flex-col gap-2 p-4",
        "group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:p-2",
        className,
      )}
      {...props}
    />
  ),
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 p-4",
        "group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:p-2",
        className,
      )}
      {...props}
    />
  ),
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2",
        "group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:overflow-hidden group-data-[state=collapsed]/sidebar:px-1",
        className,
      )}
      {...props}
    />
  ),
);
SidebarContent.displayName = "SidebarContent";

const SidebarSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-separator"
      className={cn(
        "mx-2 h-px bg-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)]",
        className,
      )}
      {...props}
    />
  ),
);
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-group"
      className={cn(
        "relative flex w-full min-w-0 flex-col gap-1 p-2",
        "group-data-[state=collapsed]/sidebar:items-center group-data-[state=collapsed]/sidebar:p-1",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 py-1 text-xs font-semibold uppercase tracking-wide glass-chrome-text-muted",
        "transition-[opacity,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
        "group-data-[state=collapsed]/sidebar:pointer-events-none group-data-[state=collapsed]/sidebar:h-0 group-data-[state=collapsed]/sidebar:overflow-hidden group-data-[state=collapsed]/sidebar:opacity-0",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-group-content"
      className={cn("glass-stagger-children w-full", className)}
      {...props}
    />
  ),
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="sidebar-menu"
      className={cn(
        "flex w-full min-w-0 flex-col gap-1",
        "group-data-[state=collapsed]/sidebar:items-center",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button relative flex w-full items-center gap-2 overflow-hidden rounded-xl px-2.5 py-2 text-left text-sm font-medium",
    "glass-chrome-text-muted",
    "transition-[color,background,transform,box-shadow] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-spring)]",
    "hover:glass-chrome-text hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
    "hover:shadow-[var(--glass-chrome-inset)]",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50",
    "group-data-[state=collapsed]/sidebar:size-8 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:gap-0 group-data-[state=collapsed]/sidebar:p-0",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    "[&>span]:truncate [&>span]:transition-[opacity] [&>span]:duration-[var(--duration-normal)]",
    "group-data-[state=collapsed]/sidebar:[&>span]:hidden",
    focusRing,
  ],
  {
    variants: {
      active: {
        true: [
          "glass-chrome-text font-semibold",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_72%,transparent)]",
          "shadow-[var(--glass-chrome-inset),var(--glass-chrome-rim)]",
        ],
        false: "",
      },
      size: {
        sm: "h-8 text-xs",
        default: "h-9 text-sm",
        lg: "h-10 text-base",
      },
    },
    defaultVariants: {
      active: false,
      size: "default",
    },
  },
);

export interface SidebarMenuButtonProps
  extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  tooltip?: string | (Omit<TooltipContentProps, "children"> & { children?: ReactNode });
}

const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, active, size, asChild = false, tooltip, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-slot="sidebar-menu-button"
        data-active={active ? "" : undefined}
        className={cn(sidebarMenuButtonVariants({ active, size, className }))}
        {...props}
      >
        {active && (
          <span
            aria-hidden="true"
            data-slot="sidebar-menu-indicator"
            className={cn(
              "absolute inset-y-1 left-1 w-0.5 rounded-full bg-primary",
              "animate-scale-in",
              "group-data-[state=collapsed]/sidebar:hidden",
            )}
          />
        )}
        {children}
      </Comp>
    );

    if (!tooltip) {
      return button;
    }

    const tooltipProps =
      typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltipProps}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  sidebarVariants,
  sidebarMenuButtonVariants,
  useSidebar,
};