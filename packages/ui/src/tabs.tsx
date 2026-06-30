"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn, focusRing } from "@intelli/utils";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-1 p-1",
    "glass-chrome glass-chrome-capsule",
  ],
  {
    variants: {
      size: {
        sm: "h-9",
        default: "h-10",
        lg: "h-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface TabsListProps
  extends ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, size, children, ...props }, ref) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const updateIndicator = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const active = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    setIndicator({
      left: active.offsetLeft,
      width: active.offsetWidth,
      opacity: 1,
    });
  }, []);

  useEffect(() => {
    updateIndicator();

    const list = listRef.current;
    if (!list) return;

    const observer = new MutationObserver(updateIndicator);
    observer.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });

    window.addEventListener("resize", updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  return (
    <TabsPrimitive.List
      ref={(node) => {
        listRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(tabsListVariants({ size, className }))}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-1 left-0 rounded-full",
          "glass-chrome-indicator",
          "transition-[transform,width,opacity]",
          "duration-[var(--duration-slow)] [transition-timing-function:var(--ease-spring)]",
        )}
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: indicator.width,
          opacity: indicator.opacity,
        }}
      />
      {children}
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5",
      "text-sm font-medium glass-chrome-text-muted",
      "transition-[color,font-weight,transform] duration-[var(--duration-normal)] [transition-timing-function:var(--ease-default)]",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:glass-chrome-text data-[state=active]:font-semibold",
      "data-[state=active]:scale-[1.02]",
      focusRing,
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none",
      "animate-tab-content",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };