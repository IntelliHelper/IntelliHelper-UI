"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type SVGProps,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const NavigationMenu = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    data-slot="navigation-menu"
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.List>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    data-slot="navigation-menu-list"
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerVariants = cva(
  [
    "group inline-flex h-9 w-max items-center justify-center gap-1 rounded-full px-4 py-2 text-sm font-medium",
    "transition-[background,color,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=open]:bg-[color-mix(in_oklch,var(--foreground)_8%,transparent)]",
    focusRing,
  ],
  {
    variants: {
      variant: {
        chrome: [
          "glass-chrome-text",
          "hover:bg-[color-mix(in_oklch,var(--foreground)_6%,transparent)]",
        ],
        ghost: [
          "text-foreground",
          "hover:bg-[color-mix(in_oklch,var(--foreground)_6%,transparent)]",
        ],
        outline: [
          "border border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_35%,transparent)]",
          "hover:bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
        ],
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface NavigationMenuTriggerProps
  extends ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>,
    VariantProps<typeof navigationMenuTriggerVariants> {}

const NavigationMenuTrigger = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  NavigationMenuTriggerProps
>(({ className, children, variant, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    data-slot="navigation-menu-trigger"
    className={cn(navigationMenuTriggerVariants({ variant, className }))}
    {...props}
  >
    {children}
    <ChevronDownIcon
      className="relative top-px size-3 opacity-70 transition-transform duration-[var(--duration-normal)] group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    data-slot="navigation-menu-content"
    className={cn(
      "left-0 top-0 w-full md:absolute md:w-auto",
      "data-[motion^=from-]:animate-fade-in",
      "data-[motion^=to-]:opacity-0 data-[motion^=to-]:transition-opacity",
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Link>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    data-slot="navigation-menu-link"
    className={cn(
      "block select-none rounded-xl p-3 text-sm outline-none transition-colors",
      "hover:bg-[color-mix(in_oklch,var(--foreground)_7%,transparent)]",
      "focus:bg-[color-mix(in_oklch,var(--foreground)_7%,transparent)]",
      focusRing,
      className,
    )}
    {...props}
  />
));
NavigationMenuLink.displayName = NavigationMenuPrimitive.Link.displayName;

const navigationMenuViewportVariants = cva(
  [
    "origin-top-center relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden",
    "rounded-2xl border text-sm shadow-[var(--glass-chrome-shadow)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
    "data-[state=open]:animate-scale-in",
    "data-[state=closed]:opacity-0 data-[state=closed]:scale-95",
    "transition-[opacity,transform] duration-[var(--duration-normal)]",
    "md:w-[var(--radix-navigation-menu-viewport-width)]",
  ],
  {
    variants: {
      variant: {
        chrome: [
          "border-[var(--glass-chrome-border)]",
          "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_82%,transparent)]",
          "text-[var(--glass-chrome-fg)]",
        ],
        elevated: [
          "border-[color-mix(in_oklch,var(--glass-chrome-border)_85%,transparent)]",
          "bg-[color-mix(in_oklch,var(--glass-surface-fill)_58%,transparent)]",
          "text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "chrome",
    },
  },
);

export interface NavigationMenuViewportProps
  extends ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>,
    VariantProps<typeof navigationMenuViewportVariants> {}

const NavigationMenuViewport = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  NavigationMenuViewportProps
>(({ className, variant, ...props }, ref) => (
  <div className="absolute left-0 top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      data-slot="navigation-menu-viewport"
      className={cn(navigationMenuViewportVariants({ variant, className }))}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = forwardRef<
  ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    data-slot="navigation-menu-indicator"
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
      "data-[state=visible]:animate-fade-in data-[state=hidden]:opacity-0",
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-[color-mix(in_oklch,var(--glass-chrome-border)_90%,transparent)] shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

function ChevronDownIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerVariants,
  navigationMenuViewportVariants,
};
