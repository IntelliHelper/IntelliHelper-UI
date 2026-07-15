"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from "react";
import { cn } from "@intelli/utils";

const avatarVariants = cva(
  [
    "relative flex shrink-0 overflow-hidden",
    "border border-[var(--glass-chrome-border)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_55%,transparent)]",
    "shadow-[var(--glass-chrome-inset),var(--glass-chrome-rim)]",
    "backdrop-blur-[var(--glass-chrome-blur)]",
  ],
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-xl",
        square: "rounded-md",
      },
      ring: {
        none: "",
        chrome: "ring-2 ring-[color-mix(in_oklch,var(--glass-chrome-border)_80%,transparent)] ring-offset-2 ring-offset-background",
        primary: "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
      ring: "none",
    },
  },
);

export interface AvatarProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, shape, ring, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={cn(avatarVariants({ size, shape, ring, className }))}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const avatarFallbackVariants = cva(
  [
    "flex size-full items-center justify-center font-semibold uppercase tracking-tight",
    "text-[var(--glass-chrome-fg)]",
    "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_72%,transparent)]",
  ],
  {
    variants: {
      tone: {
        chrome: "",
        primary: "bg-[color-mix(in_oklch,var(--primary)_18%,transparent)] text-primary",
        success:
          "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_16%,transparent)] text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
        destructive:
          "bg-[color-mix(in_oklch,var(--destructive)_16%,transparent)] text-destructive",
      },
    },
    defaultVariants: {
      tone: "chrome",
    },
  },
);

export interface AvatarFallbackProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, tone, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(avatarFallbackVariants({ tone, className }))}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const avatarGroupVariants = cva("flex flex-row items-center", {
  variants: {
    size: {
      xs: "-space-x-1.5",
      sm: "-space-x-2",
      default: "-space-x-2.5",
      lg: "-space-x-3",
      xl: "-space-x-3.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface AvatarGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  max?: number;
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, size, max, children, ...props }, ref) => {
    const items = Children.toArray(children);
    const visible = max != null ? items.slice(0, max) : items;
    const overflow = max != null ? Math.max(0, items.length - max) : 0;

    return (
      <div
        ref={ref}
        data-slot="avatar-group"
        role="group"
        className={cn(avatarGroupVariants({ size, className }))}
        {...props}
      >
        {visible}
        {overflow > 0 ? (
          <Avatar size={size ?? "default"} className="z-10">
            <AvatarFallback className="text-[0.7em]">+{overflow}</AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    );
  },
);
AvatarGroup.displayName = "AvatarGroup";

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  avatarVariants,
  avatarFallbackVariants,
  avatarGroupVariants,
};
