"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn, focusRing } from "@intelli/utils";

function GripIcon({ className }: { className?: string }) {
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
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  );
}

const resizablePanelGroupVariants = cva("flex h-full w-full", {
  variants: {
    variant: {
      default: "",
      chrome: "rounded-xl border border-[var(--glass-chrome-border)] glass-panel",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const resizableHandleVariants = cva(
  [
    "relative flex w-px items-center justify-center",
    "bg-[color-mix(in_oklch,var(--glass-chrome-border)_70%,transparent)]",
    "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
    "[&[data-orientation=vertical]_&]:h-px [&[data-orientation=vertical]_&]:w-full",
    "[&[data-orientation=vertical]_&]:after:left-0 [&[data-orientation=vertical]_&]:after:h-1",
    "[&[data-orientation=vertical]_&]:after:w-full [&[data-orientation=vertical]_&]:after:-translate-y-1/2",
    "[&[data-orientation=vertical]_&]:after:translate-x-0",
    "[&[data-orientation=vertical]_&>div]:rotate-90",
    focusRing,
  ],
  {
    variants: {
      variant: {
        default: "",
        chrome: "bg-[var(--glass-chrome-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ResizablePanelGroupProps
  extends ComponentProps<typeof Group>,
    VariantProps<typeof resizablePanelGroupVariants> {}

const ResizablePanelGroup = ({
  className,
  variant,
  orientation = "horizontal",
  ...props
}: ResizablePanelGroupProps) => (
  <Group
    data-slot="resizable-panel-group"
    data-orientation={orientation}
    orientation={orientation}
    className={cn(resizablePanelGroupVariants({ variant, className }))}
    {...props}
  />
);

const ResizablePanel = Panel;

export interface ResizableHandleProps
  extends ComponentProps<typeof Separator>,
    VariantProps<typeof resizableHandleVariants> {
  withHandle?: boolean;
}

const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ withHandle, className, variant, ...props }, ref) => (
    <Separator
      elementRef={ref}
      data-slot="resizable-handle"
      className={cn(resizableHandleVariants({ variant, className }))}
      {...props}
    >
      {withHandle && (
        <div
          data-slot="resizable-handle-grip"
          className={cn(
            "z-10 flex h-4 w-3 items-center justify-center rounded-sm",
            "border border-[var(--glass-chrome-border)]",
            "bg-[color-mix(in_oklch,var(--glass-chrome-bg-env)_65%,transparent)]",
            "glass-chrome-text-muted",
          )}
        >
          <GripIcon className="size-2.5" />
        </div>
      )}
    </Separator>
  ),
);
ResizableHandle.displayName = "ResizableHandle";

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  resizablePanelGroupVariants,
  resizableHandleVariants,
};