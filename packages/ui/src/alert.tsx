import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@intelli/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-2xl border px-4 py-3 text-sm",
    "[&>svg]:pointer-events-none [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4 [&>svg]:shrink-0",
    "[&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-[color-mix(in_oklch,var(--primary)_40%,transparent)]",
          "bg-[color-mix(in_oklch,var(--primary)_14%,transparent)]",
          "text-foreground [&>svg]:text-primary",
          "shadow-[inset_0_1px_0_color-mix(in_oklch,white_18%,transparent)]",
        ],
        destructive: [
          "border-[color-mix(in_oklch,var(--destructive)_40%,transparent)]",
          "bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)]",
          "text-foreground [&>svg]:text-destructive",
          "shadow-[inset_0_1px_0_color-mix(in_oklch,white_12%,transparent)]",
        ],
        success: [
          "border-[color-mix(in_oklch,oklch(0.62_0.17_145)_40%,transparent)]",
          "bg-[color-mix(in_oklch,oklch(0.62_0.17_145)_12%,transparent)]",
          "text-foreground",
          "[&>svg]:text-[color-mix(in_oklch,oklch(0.52_0.17_145)_90%,var(--foreground))]",
        ],
        chrome: [
          "glass-panel border-[var(--glass-chrome-border)]",
          "text-[var(--glass-chrome-fg)] [&>svg]:text-[var(--glass-chrome-fg)]",
        ],
        outline: [
          "border border-dashed border-[var(--glass-chrome-border)]",
          "bg-transparent text-foreground [&>svg]:text-[var(--glass-chrome-fg)]",
        ],
      },
      animated: {
        true: "animate-fade-in-up",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animated: true,
    },
  },
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, animated, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      data-variant={variant}
      className={cn(alertVariants({ variant, animated, className }))}
      {...props}
    />
  ),
);
Alert.displayName = "Alert";

const AlertTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn(
      "text-sm/relaxed glass-chrome-text-muted [&_p]:leading-relaxed",
      className,
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };